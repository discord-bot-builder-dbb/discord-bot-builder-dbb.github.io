window.DBB = {
    registeredExtensions: new Map(),
    toolboxCategories: [],

    /**
     * Notification UI Custom
     */
    showExtensionErrorNotif: function(message) {
        const oldNotif = document.getElementById('ext-error-notif');
        if (oldNotif) oldNotif.remove();

        const notif = document.createElement('div');
        notif.id = 'ext-error-notif';
        notif.innerText = message;

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
            transition: 'all 0.3s ease',
            opacity: '0',
            transform: 'scale(0.95)'
        });

        if (window.innerWidth <= 768) {
            notif.style.top = '15px';
            notif.style.left = '50%';
            notif.style.transform = 'translate(-50%, -20px)';
        } else {
            notif.style.bottom = '20px';
            notif.style.right = '20px';
        }

        document.body.appendChild(notif);

        setTimeout(() => {
            notif.style.opacity = '1';
            notif.style.transform = window.innerWidth <= 768 ? 'translate(-50%, 0)' : 'scale(1)';
        }, 10);

        setTimeout(() => {
            notif.style.opacity = '0';
            setTimeout(() => notif.remove(), 300);
        }, 6000);
    },

    /**
     * Enregistrement Isolé avec Pare-feu de Mutation Absolu
     */
    registerExtension: function(extensionDef, isDynamic = false) {
        const extName = extensionDef?.name || extensionDef?.id || "Inconnue";
        
        try {
            if (!extensionDef || typeof extensionDef !== 'object') throw new Error("Définition invalide.");
            if (!extensionDef.id) throw new Error("L'extension n'a pas d'identifiant (id) valide.");

            // Protection anti-conflits / écrasement
            if (this.registeredExtensions.has(extensionDef.id)) {
                const existingExt = this.registeredExtensions.get(extensionDef.id);
                if (isDynamic && !existingExt.isDynamicEnvironment) {
                    throw new Error(`Conflit d'ID : L'identifiant '${extensionDef.id}' est réservé par le système.`);
                }
                console.warn(`[DBB] L'extension ${extensionDef.id} est déjà enregistrée.`);
                return;
            }

            // =================================================================
            // BOUCLIER DE RUNTIME ABSOLU POUR LES MUTATEURS (ANTI-FUITE MEMOIRE)
            // =================================================================
            if (extensionDef.mutators) {
                for (const [mutatorId, mutatorDef] of Object.entries(extensionDef.mutators)) {
                    
                    const originalUpdateShape = mutatorDef.mixin?.updateShape_;
                    
                    if (typeof originalUpdateShape === 'function') {
                        mutatorDef.mixin.updateShape_ = function() {
                            // 1. Coupe-circuit immédiat si le bloc a déjà été identifié comme corrompu
                            if (this._dbbIsConfined) return;

                            // 2. Initialisation des registres de monitoring d'exécution
                            if (!this._dbbMutationPulseCounter) {
                                this._dbbMutationPulseCounter = 0;
                                this._dbbTotalBursts = 0;
                            }

                            this._dbbMutationPulseCounter++;
                            this._dbbTotalBursts++;

                            // 3. REMISE À ZÉRO SÉCURISÉE (Via l'arbre de rendu graphique)
                            // requestAnimationFrame s'exécute en dehors du cycle d'évaluation des micro-tâches (Promesses).
                            // Si la file des micro-tâches boucle à l'infini, requestAnimationFrame ne s'exécutera JAMAIS.
                            // Le compteur montera donc en flèche sans jamais être reset !
                            if (!this._dbbRafScheduled) {
                                this._dbbRafScheduled = true;
                                requestAnimationFrame(() => {
                                    this._dbbMutationPulseCounter = 0;
                                    this._dbbTotalBursts = 0;
                                    this._dbbRafScheduled = false;
                                });
                            }

                            // 4. SEUIL CRITIQUE SYNCHRONE (Garde-fou #1)
                            // Plus de 5 appels consécutifs dans la même tâche ou micro-tâche
                            if (this._dbbMutationPulseCounter > 5) {
                                this._dbbIsConfined = true;
                                this.updateShape_ = function() {}; // Destruction instantanée du hook
                                
                                console.error(`%c[DBB RUNTIME SHIELD] Sabotage Synchrone/Microtask intercepté sur le mutateur : ${mutatorId}`, 'background:#c0392b;color:#fff;font-weight:bold;padding:4px;');
                                
                                if (isDynamic && typeof window.DBB.showExtensionErrorNotif === 'function') {
                                    window.DBB.showExtensionErrorNotif(`🛑 Bloc "${this.type}" neutralisé : Tentative de freeze de l'application.`);
                                }
                                return;
                            }

                            // 5. SEUIL CRITIQUE DE CHARGE LATENTE (Garde-fou #2)
                            // Si le bloc mute en boucle fermée asynchrone (ex: macro-tâches rapides imbriquées)
                            if (this._dbbTotalBursts > 20) {
                                this._dbbIsConfined = true;
                                this.updateShape_ = function() {};
                                
                                console.error(`%c[DBB RUNTIME SHIELD] Fuite de mémoire asynchrone neutralisée sur le mutateur : ${mutatorId}`, 'background:#d35400;color:#fff;font-weight:bold;padding:4px;');
                                
                                if (isDynamic && typeof window.DBB.showExtensionErrorNotif === 'function') {
                                    window.DBB.showExtensionErrorNotif(`🛑 Fuite de mémoire endiguée : Rendu du composant figé.`);
                                }
                                return;
                            }

                            try {
                                originalUpdateShape.apply(this, arguments);
                            } catch (shapeError) {
                                console.error(`[DBB Shield] Erreur de rendu interceptée :`, shapeError.message);
                                if (isDynamic) window.DBB.showExtensionErrorNotif(`💥 Erreur d'affichage graphique sur le bloc.`);
                            }
                        };
                    }

                    // Enregistrement confiné dans Blockly
                    try {
                        Blockly.Extensions.registerMutator(mutatorId, mutatorDef.mixin, mutatorDef.helper);
                    } catch (e) {
                        throw new Error(`Échec du mutateur '${mutatorId}': ${e.message}`);
                    }
                }
            }

            // 3. Enregistrement des extensions de blocs classiques
            if (extensionDef.blockExtensions) {
                for (const [extId, extFn] of Object.entries(extensionDef.blockExtensions)) {
                    try {
                        Blockly.Extensions.register(extId, extFn);
                    } catch (e) {
                        throw new Error(`Échec de l'extension de bloc '${extId}': ${e.message}`);
                    }
                }
            }

            // 4. Définition des blocs avec isolation JSON
            try {
                if (Array.isArray(extensionDef.blocks)) {
                    Blockly.defineBlocksWithJsonArray(extensionDef.blocks);
                }
            } catch (blocklyError) {
                throw new Error(`[Structure JSON Invalide] ${blocklyError.message}`);
            }

            // 5. Générateurs
            if (extensionDef.generators && Blockly.JavaScript) {
                for (const [blockType, generatorFn] of Object.entries(extensionDef.generators)) {
                    Blockly.JavaScript[blockType] = generatorFn;
                }
            }

            // 6. Injection dans la Toolbox
            if (extensionDef.name && extensionDef.blocks) {
                const categoryBlocks = extensionDef.blocks.map(b => ({ kind: "block", type: b.type }));
                this.toolboxCategories.push({
                    kind: "category",
                    name: extensionDef.name,
                    colour: extensionDef.color || "#5b80a5",
                    contents: categoryBlocks
                });
            }

            extensionDef.isDynamicEnvironment = !!isDynamic;
            this.registeredExtensions.set(extensionDef.id, extensionDef);
            
            console.log(`[DBB Sandbox] Extension '${extName}' validée [Type: ${isDynamic ? 'Dynamique' : 'Builtin'}].`);

        } catch (error) {
            if (isDynamic) {
                this.showExtensionErrorNotif(`⚠️ L'extension externe "${extName}" a été rejetée.`);
                console.warn(`[DBB Sandbox] Rejet dynamique de '${extName}' :`, error.message);
                throw error;
            } else {
                console.error(`%c[DBB CORE CRITICAL] Le module natif "${extName}" a provoqué une anomalie de chargement :`, 'background: #222; color: #ff3333; font-weight: bold;', error.message);
            }
        }
    },

    /**
     * Chargeur natif asynchrone immunisé
     */
    loadExtensionsFromMap: async function() {
        try {
            const response = await fetch('/extensions/extmap.ext.html');
            if (!response.ok) throw new Error('Impossible de localiser extmap.ext.html');
            const htmlText = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            const scripts = doc.querySelectorAll('script[src]');

            if (scripts.length === 0) return;

            for (const scr of scripts) {
                const src = scr.getAttribute('src');
                const checkpointCategoriesCount = this.toolboxCategories.length;
                const originalRegister = this.registerExtension;

                try {
                    const scriptRes = await fetch(src);
                    if (!scriptRes.ok) throw new Error(`Code HTTP ${scriptRes.status}`);
                    const codeText = await scriptRes.text();

                    this.registerExtension = function(extensionDef) {
                        originalRegister.call(window.DBB, extensionDef, false);
                    };

                    const compileTask = new Function(codeText);
                    compileTask();

                } catch (scriptError) {
                    if (this.toolboxCategories.length > checkpointCategoriesCount) {
                        this.toolboxCategories.splice(checkpointCategoriesCount);
                    }
                    console.error(`%c[DBB Isolation] Script natif défaillant confiné [Fichier: ${src}] ->`, 'color: #e67e22', scriptError.message);
                } finally {
                    this.registerExtension = originalRegister;
                }
            }

        } catch (error) {
            console.error('[DBB Critical] Panne d\'accès au système de briques de l\'infrastructure :', error);
        } finally {
            console.log('[DBB] Compilation et rendu final de l\'UI Blockly appliqués.');
            if (typeof DBB_Config !== 'undefined' && typeof DBB_Config.updateToolbox === 'function') {
                DBB_Config.updateToolbox(this.toolboxCategories);
            }
        }
    }
};

