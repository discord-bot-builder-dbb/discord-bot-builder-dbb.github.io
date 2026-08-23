// =========================================================================
// DBB CORE — pluginLoader.js (Hardened v6 - Universal ForBlock Shield)
// =========================================================================

window.DBB = (() => {
    // ── Registre privé (non exposé globalement) ──────────────────────────
    const _registeredExtensions = new Map();
    const _notifTimers = [];            // [FIX ML-1] Suivi des setTimeout pour cleanup

    // ── Constantes de sécurité ────────────────────────────────────────────
    const NOTIF_FADE_MS     = 6000;
    const NOTIF_REMOVE_MS   = 300;
    const MAX_SCRIPT_BYTES  = 512 * 1024; // 512 KB [FIX SEC-2]

    // Limites du Pare-feu de Mutation Synchrone
    const MAX_MUTATIONS_PER_WINDOW = 5;   // Max 5 mutations autorisées...
    const TIME_WINDOW_MS           = 16;  // ...dans une fenêtre de 16ms (1 frame à 60fps)

    // ── Bannissement des URLs non-relatives (SSRF / path traversal) ───────
    function _isSafeRelativeUrl(url) {
        if (typeof url !== 'string' || url.trim() === '') return false;
        if (/^[a-z][a-z0-9+\-.]*:/i.test(url)) return false;
        if (/(?:^|\/)\.\.(?:\/|$)/.test(url)) return false;
        return true;
    }

    // ── Notification d'erreur saine ───────────────────────────────────────
    function showExtensionErrorNotif(message) {
        const oldNotif = document.getElementById('ext-error-notif');
        if (oldNotif) oldNotif.remove();

        const notif = document.createElement('div');
        notif.id = 'ext-error-notif';
        notif.textContent = message;

        Object.assign(notif.style, {
            position: 'fixed',
            zIndex: '9999',
            backgroundColor: '#e74c3c',
            color: '#ffffff',
            padding: '14px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            fontFamily: 'sans-serif',
            fontSize: '14px',
            fontWeight: 'bold',
            maxWidth: '90%',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            opacity: '0',
            transform: 'scale(0.95)'
        });

        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            Object.assign(notif.style, { top: '15px', left: '50%', transform: 'translate(-50%, -20px)' });
        } else {
            Object.assign(notif.style, { bottom: '20px', right: '20px' });
        }

        document.body.appendChild(notif);

        const t1 = setTimeout(() => {
            notif.style.opacity = '1';
            notif.style.transform = isMobile ? 'translate(-50%, 0)' : 'scale(1)';
        }, 10);

        const t2 = setTimeout(() => {
            notif.style.opacity = '0';
            const t3 = setTimeout(() => {
                if (notif.parentNode) notif.remove();
                _notifTimers.splice(_notifTimers.indexOf(t1), 1);
                _notifTimers.splice(_notifTimers.indexOf(t2), 1);
            }, NOTIF_REMOVE_MS);
            _notifTimers.push(t3);
        }, NOTIF_FADE_MS);

        _notifTimers.push(t1, t2);
    }

    // ── Bouclier Temporel Synchrone Absolu ────────────────────────────────
    function _wrapMutatorUpdateShape(originalUpdateShape, mutatorId, isDynamic) {
        return function dbbShieldedUpdateShape() {
            if (this._dbbIsConfined) return;
            const now = performance.now();

            if (!this._dbbLastMutationWindowStart) {
                this._dbbLastMutationWindowStart = now;
                this._dbbMutationCounterInWindow = 0;
            }

            if (now - this._dbbLastMutationWindowStart > TIME_WINDOW_MS) {
                this._dbbLastMutationWindowStart = now;
                this._dbbMutationCounterInWindow = 0;
            }

            this._dbbMutationCounterInWindow++;

            if (this._dbbMutationCounterInWindow > MAX_MUTATIONS_PER_WINDOW) {
                this._dbbIsConfined = true;
                this.updateShape_ = function() {}; 

                console.error(
                    `%c[DBB RUNTIME SHIELD] Fuite asynchrone interceptée et désamorcée sur le mutateur : ${mutatorId}`,
                    'background:#c0392b;color:#fff;font-weight:bold;padding:4px;'
                );

                if (isDynamic) {
                    showExtensionErrorNotif(`🛑 Sécurité : Le bloc "${this.type}" a été neutralisé pour empêcher un crash.`);
                }
                return;
            }

            try {
                originalUpdateShape.apply(this, arguments);
            } catch (shapeError) {
                console.error(`[DBB Shield] Erreur de rendu interne :`, shapeError.message);
                if (isDynamic) showExtensionErrorNotif(`💥 Erreur d'affichage graphique sur le bloc.`);
            }
        };
    }

    // ── Enregistrement d'extension sécurisé ───────────────────────────────
    function registerExtension(extensionDef, isDynamic = false) {
        const extName = extensionDef?.name || extensionDef?.id || 'Inconnue';

        try {
            if (!extensionDef || typeof extensionDef !== 'object')
                throw new Error('Définition invalide.');
            if (typeof extensionDef.id !== 'string' || extensionDef.id.trim() === '')
                throw new Error("L'extension n'a pas d'identifiant (id) valide.");
            if (!/^[a-zA-Z0-9_-]+$/.test(extensionDef.id))
                throw new Error(`ID d'extension invalide : "${extensionDef.id}"`);

            // Protection et isolation des mutateurs
            if (extensionDef.mutators && typeof extensionDef.mutators === 'object') {
                for (const [mutatorId, mutatorDef] of Object.entries(extensionDef.mutators)) {
                    const originalUpdateShape = mutatorDef.mixin?.updateShape_;
                    if (typeof originalUpdateShape === 'function') {
                        mutatorDef.mixin.updateShape_ = _wrapMutatorUpdateShape(
                            originalUpdateShape, mutatorId, isDynamic
                        );
                    }
                    try {
                        Blockly.Extensions.registerMutator(mutatorId, mutatorDef.mixin, mutatorDef.helper);
                    } catch (e) {
                        throw new Error(`Échec du mutateur "${mutatorId}" : ${e.message}`);
                    }
                }
            }

            // Extensions de blocs
            if (extensionDef.blockExtensions && typeof extensionDef.blockExtensions === 'object') {
                for (const [extId, extFn] of Object.entries(extensionDef.blockExtensions)) {
                    if (typeof extFn !== 'function') throw new Error(`blockExtension "${extId}" doit être une fonction.`);
                    try {
                        Blockly.Extensions.register(extId, extFn);
                    } catch (e) {
                        throw new Error(`Échec de l'extension de bloc "${extId}" : ${e.message}`);
                    }
                }
            }

            // Définition des blocs JSON
            try {
                if (Array.isArray(extensionDef.blocks)) {
                    Blockly.defineBlocksWithJsonArray(extensionDef.blocks);
                }
            } catch (blocklyError) {
                throw new Error(`[Structure JSON invalide] ${blocklyError.message}`);
            }

            // =================================================================
            // FIX CRITIQUE : ALIGNEMENT COMPILATEUR ET PASSAGE DOUBLE FORMAT V10+
            // =================================================================
            if (extensionDef.generators) {
                const activeGenerator = (window.javascript && window.javascript.javascriptGenerator) || Blockly.JavaScript;
                
                if (activeGenerator) {
                    if (!activeGenerator.forBlock) activeGenerator.forBlock = {};
                    
                    for (const [blockType, generatorFn] of Object.entries(extensionDef.generators)) {
                        if (typeof generatorFn !== 'function')
                            throw new Error(`Générateur "${blockType}" doit être une fonction.`);
                        
                        // Injection double format dans le générateur actif (Ancien style + Nouveau style forBlock)
                        activeGenerator[blockType] = generatorFn;
                        activeGenerator.forBlock[blockType] = generatorFn;
                        
                        // Fallback double format sur l'objet global Blockly.JavaScript
                        if (Blockly.JavaScript) {
                            if (!Blockly.JavaScript.forBlock) Blockly.JavaScript.forBlock = {};
                            Blockly.JavaScript[blockType] = generatorFn;
                            Blockly.JavaScript.forBlock[blockType] = generatorFn;
                        }
                    }
                }
            }

            // Injection UI Toolbox
            if (extensionDef.name && Array.isArray(extensionDef.blocks)) {
                const categoryBlocks = extensionDef.blocks.map(b => ({ kind: 'block', type: b.type }));
                publicAPI.toolboxCategories.push({
                    kind: 'category',
                    name: extensionDef.name,
                    colour: extensionDef.color || '#5b80a5',
                    contents: categoryBlocks
                });
            }

            const frozen = Object.freeze({ ...extensionDef, isDynamicEnvironment: !!isDynamic });
            _registeredExtensions.set(extensionDef.id, frozen);

            console.log(`[DBB Sandbox] Extension "${extName}" validée [Type: ${isDynamic ? 'Dynamique' : 'Builtin'}].`);

        } catch (error) {
            if (isDynamic) {
                showExtensionErrorNotif(`⚠️ L'extension externe "${extName}" a été rejetée.`);
                throw error;
            } else {
                console.error(`%c[DBB CORE CRITICAL] Le module natif "${extName}" a provoqué une anomalie :`, 'background:#222;color:#ff3333;font-weight:bold;', error.message);
            }
        }
    }

    // ── Chargeur natif asynchrone ─────────────────────────────────────────
    async function loadExtensionsFromMap() {
        try {
            const response = await fetch('/extensions/extmap.ext.html');
            if (!response.ok) throw new Error('Impossible de localiser extmap.ext.html');
            const htmlText = await response.text();

            const parser = new DOMParser();
            const doc    = parser.parseFromString(htmlText, 'text/html');
            const scripts = doc.querySelectorAll('script[src]');

            if (scripts.length === 0) return;

            for (const scr of scripts) {
                const src = scr.getAttribute('src');

                if (!_isSafeRelativeUrl(src)) continue;

                const checkpointCategoriesCount = publicAPI.toolboxCategories.length;
                const originalRegister = publicAPI.registerExtension;

                try {
                    const scriptRes = await fetch(src);
                    if (!scriptRes.ok) throw new Error(`Code HTTP ${scriptRes.status}`);

                    const codeText = await scriptRes.text();
                    if (codeText.length > MAX_SCRIPT_BYTES) throw new Error(`Script trop volumineux`);

                    publicAPI.registerExtension = function(extensionDef) {
                        originalRegister.call(publicAPI, extensionDef, false);
                    };

                    const compileTask = new Function('"use strict";\n' + codeText);
                    compileTask();

                } catch (scriptError) {
                    if (publicAPI.toolboxCategories.length > checkpointCategoriesCount) {
                        publicAPI.toolboxCategories.splice(checkpointCategoriesCount);
                    }
                    console.error(`%c[DBB Isolation] Script natif confiné [Fichier: ${src}] →`, 'color:#e67e22', scriptError.message);
                } finally {
                    publicAPI.registerExtension = originalRegister;
                }
            }

        } catch (error) {
            console.error("[DBB Critical] Panne d'accès à l'infrastructure :", error);
        } finally {
            if (typeof DBB_Config !== 'undefined' && typeof DBB_Config.updateToolbox === 'function') {
                DBB_Config.updateToolbox(publicAPI.toolboxCategories);
            }
        }
    }

    const publicAPI = {
        get registeredExtensions() { return _registeredExtensions; },
        toolboxCategories: [],
        showExtensionErrorNotif,
        registerExtension,
        loadExtensionsFromMap
    };

    return publicAPI;
})();

