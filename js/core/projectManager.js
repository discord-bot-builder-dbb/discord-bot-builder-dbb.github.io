// =========================================================================
// PASSERELLE UNIVERSELLE DE SÉCURITÉ ET RÉCONCILIATION DES GÉNÉRATEURS (V10+)
// =========================================================================
(function() {
    const tgtGen = (window.javascript && window.javascript.javascriptGenerator);
    
    if (tgtGen) {
        if (!tgtGen.forBlock) tgtGen.forBlock = {};
        if (Blockly.JavaScript && Blockly.JavaScript !== tgtGen) {
            Object.assign(tgtGen, Blockly.JavaScript);
            if (Blockly.JavaScript.forBlock) {
                Object.assign(tgtGen.forBlock, Blockly.JavaScript.forBlock);
            }
        }
        try {
            Blockly.JavaScript = tgtGen;
        } catch (e) {}
    } else if (!Blockly.JavaScript) {
        Blockly.JavaScript = {};
    }
    
    const active = (window.javascript && window.javascript.javascriptGenerator) || Blockly.JavaScript;
    if (active) {
        if (!active.forBlock) active.forBlock = {};
        if (typeof active.ORDER_ASSIGNMENT === 'undefined') active.ORDER_ASSIGNMENT = 11;
        if (typeof active.ORDER_ATOMIC === 'undefined') active.ORDER_ATOMIC = 0;
        
        const varSetFn = function(block) {
            const argument0 = active.valueToCode(block, 'VALUE', active.ORDER_ASSIGNMENT) || '0';
            const varName = active.getVariableName ? active.getVariableName(block.getFieldValue('VAR')) : block.getFieldValue('VAR');
            return varName + ' = ' + argument0 + ';\n';
        };
        
        const varGetFn = function(block) {
            const varName = active.getVariableName ? active.getVariableName(block.getFieldValue('VAR')) : block.getFieldValue('VAR');
            return [varName, active.ORDER_ATOMIC];
        };

        if (!active['variables_set']) active['variables_set'] = varSetFn;
        if (!active.forBlock['variables_set']) active.forBlock['variables_set'] = varSetFn;

        if (!active['variables_get']) active['variables_get'] = varGetFn;
        if (!active.forBlock['variables_get']) active.forBlock['variables_get'] = varGetFn;

        if (!active['variable_set']) active['variable_set'] = varSetFn;
        if (!active.forBlock['variable_set']) active.forBlock['variable_set'] = varSetFn;

        if (!active['variable_get']) active['variable_get'] = varGetFn;
        if (!active.forBlock['variable_get']) active.forBlock['variable_get'] = varGetFn;
    }
})();

const DBB_ProjectManager = {

    // --- 1. EXPORTATION ZIP ---
    exportProject: async function() {
        try {
            if (typeof JSZip === 'undefined') {
                throw new Error("La bibliothèque JSZip est introuvable. Veuillez vérifier son chargement.");
            }

            if (!DBB_Config.workspace) {
                throw new Error("L'espace de travail (workspace) n'est pas initialisé ou est inaccessible.");
            }

            const zip = new JSZip();

            // Extraction et écriture de l'arbre XML de Blockly
            const xmlDom  = Blockly.Xml.workspaceToDom(DBB_Config.workspace);
            const xmlText = Blockly.Xml.domToPrettyText(xmlDom);
            zip.file("workspace.xml", xmlText);

            // ─── SWEEPER DE SÉCURITÉ ABSOLU : CLONAGE DYNAMIQUE VERS FORBLOCK V10+ ───
            const generator = (window.javascript && window.javascript.javascriptGenerator) || Blockly.JavaScript;
            
            // Liste noire des fonctions internes de l'instance Blockly à ne pas cloner comme des blocs
            const builtInMethods = new Set([
                'init', 'finish', 'scrub_', 'workspaceToCode', 'blockToCode', 
                'valueToCode', 'statementToCode', 'allNestedBlocks', 'getVariableName',
                'quote_', 'scrubNakedValue', 'forBlock', 'ORDER_ASSIGNMENT', 'ORDER_ATOMIC',
                'name_', 'INFINITE_LOOP_TRAP', 'STATEMENT_PREFIX', 'STATEMENT_SUFFIX',
                'INDENT', 'RESERVED_WORDS_', 'addReservedWords'
            ]);

            const syncGeneratorObj = (genObj) => {
                if (!genObj) return;
                if (!genObj.forBlock) genObj.forBlock = {};
                // Transfert racine -> forBlock
                Object.keys(genObj).forEach(key => {
                    if (!builtInMethods.has(key) && typeof genObj[key] === 'function') {
                        if (!genObj.forBlock[key]) genObj.forBlock[key] = genObj[key];
                    }
                });
                // Rétrocompatibilité forBlock -> racine
                Object.keys(genObj.forBlock).forEach(key => {
                    if (typeof genObj.forBlock[key] === 'function' && !genObj[key]) {
                        genObj[key] = genObj.forBlock[key];
                    }
                });
            };

            if (Blockly.JavaScript) syncGeneratorObj(Blockly.JavaScript);
            if (generator) syncGeneratorObj(generator);

            if (Blockly.JavaScript && generator && Blockly.JavaScript !== generator) {
                // Alignement complet et bilatéral immédiat avant compilation
                Object.keys(Blockly.JavaScript.forBlock).forEach(key => {
                    if (!generator.forBlock[key]) generator.forBlock[key] = Blockly.JavaScript.forBlock[key];
                });
                Object.keys(Blockly.JavaScript).forEach(key => {
                    if (!builtInMethods.has(key) && typeof Blockly.JavaScript[key] === 'function' && !generator[key]) {
                        generator[key] = Blockly.JavaScript[key];
                    }
                });
                Object.keys(generator.forBlock).forEach(key => {
                    if (!Blockly.JavaScript.forBlock[key]) Blockly.JavaScript.forBlock[key] = generator.forBlock[key];
                });
                Object.keys(generator).forEach(key => {
                    if (!builtInMethods.has(key) && typeof generator[key] === 'function' && !Blockly.JavaScript[key]) {
                        Blockly.JavaScript[key] = generator[key];
                    }
                });
            }

            if (!generator || typeof generator.workspaceToCode !== 'function') {
                throw new Error("Le générateur de code JavaScript de Blockly n'a pas pu être résolu.");
            }

            // Génération globale de l'arbre de blocs
            const rawBotCode = generator.workspaceToCode(DBB_Config.workspace) || "// Aucun code généré";
            const botJsContent = this.cleanAndGenerateBotJs(rawBotCode);
            zip.file("bot.js", botJsContent);

            // Manifeste package.json
            const packageJson = {
                name: "geoglory-world-rp",
                version: "1.0.0",
                description: "Généré par Discord Bot Builder Pro Edition",
                main: "bot.js",
                scripts: { "start": "node bot.js" },
                dependencies: {
                    "discord.js": "^14.14.0",
                    "sqlite3": "^5.1.7"
                }
            };
            zip.file("package.json", JSON.stringify(packageJson, null, 2));

            zip.folder("extensions").folder("builtin");
            zip.folder("extensions").folder("community");

            const blob = await zip.generateAsync({ type: "blob" });
            const url  = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href     = url;
            a.download = "GEOGLORY_Project.zip";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            setTimeout(() => URL.revokeObjectURL(url), 250);
            console.log("[DBB ProjectManager] Projet exporté avec succès.");

        } catch (exportError) {
            console.error("[DBB Critical] Échec de la routine d'exportation :", exportError);
            if (window.DBB && typeof window.DBB.showExtensionErrorNotif === 'function') {
                window.DBB.showExtensionErrorNotif(`💥 Échec de l'exportation : ${exportError.message}`);
            } else {
                alert(`Erreur d'exportation : ${exportError.message}`);
            }
        }
    },

    // --- 2. COMPILATEUR / OPTIMISEUR ---
    cleanAndGenerateBotJs: function(blocklyCode) {
        let cleanedCode = blocklyCode;

        cleanedCode = cleanedCode.replace(/const\s+\{[^}]*\}\s*=\s*require\(['"]discord\.js['"]\);?/g, '');
        cleanedCode = cleanedCode.replace(/(?:global\.)?client\s*=\s*new\s+Client\([^)]*\);?/g, '');
        cleanedCode = cleanedCode.replace(/(?:global\.)?client\.login\([^)]*\);?/g, '');

        const readyBlocks = [];
        const signatures  = [
            "client.once('ready', async () => {",
            "global.client.once('ready', async () => {"
        ];

        for (const sig of signatures) {
            let startIndex = 0;
            while ((startIndex = cleanedCode.indexOf(sig, startIndex)) !== -1) {
                let braceCount = 0;
                let i          = startIndex + sig.length - 1;
                const bodyStart = i + 1;
                let foundEnd   = false;

                for (; i < cleanedCode.length; i++) {
                    if      (cleanedCode[i] === '{') braceCount++;
                    else if (cleanedCode[i] === '}') {
                        braceCount--;
                        if (braceCount === 0) { foundEnd = true; break; }
                    }
                }

                if (foundEnd) {
                    let body = cleanedCode.substring(bodyStart, i).trim();

                    if (body.includes("while (true)") || body.includes("while(true)")) {
                        body = `// Tâche de fond isolée automatiquement\n    (async () => {\n        ${body}\n    })();`;
                    }

                    readyBlocks.push(body);

                    let endRemove = i + 1;
                    if (cleanedCode.substring(endRemove, endRemove + 2) === ');') endRemove += 2;
                    cleanedCode = cleanedCode.substring(0, startIndex) + cleanedCode.substring(endRemove);
                    startIndex  = 0;
                } else {
                    startIndex += sig.length;
                }
            }
        }

        cleanedCode = cleanedCode.trim().replace(/\n{3,}/g, '\n\n');

        return `// ========================================================
//   Généré par Discord Bot Builder (DBB) - PRO Edition
//   Projet : GEOGLORY World RP
// ========================================================
const { Client, GatewayIntentBits, Partials, REST, Routes, ActivityType } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

global.client = client;

// --- DÉBUT DU CODE BLOCKLY ---

${cleanedCode}

// --- INITIALISATION (Événement Ready) ---
client.once('ready', async () => {
    console.log(\`[DBB] Le Bot \${client.user.tag} est en ligne !\`);

    ${readyBlocks.join('\n\n    ')}

    if (client.slashCommandsData && client.slashCommandsData.length > 0) {
        try {
            const rest = new REST({ version: '10' }).setToken(client.token || process.env.DISCORD_TOKEN);
            console.log(\`[DBB] Synchronisation de \${client.slashCommandsData.length} commande(s)...\\n\`);
            await rest.put(Routes.applicationCommands(client.user.id), { body: client.slashCommandsData });
            console.log('[DBB] Commandes Slash synchronisées !');
        } catch (error) {
            console.error('[DBB] Erreur API Discord:', error);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);

process.on('unhandledRejection', error => console.error('[DBB Erreur Non Capturée] :', error));
`;
    },

    // --- 3. IMPORTATION ZIP ---
    importProject: async function(file) {
        const ALLOWED_TYPES = ['application/zip', 'application/x-zip-compressed', 'application/octet-stream'];
        if (!ALLOWED_TYPES.includes(file.type) && !file.name.endsWith('.zip')) {
            alert("Format invalide : seuls les fichiers .zip sont acceptés.");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert("Archive trop volumineuse (max 10 Mo).");
            return;
        }

        try {
            const zip = await JSZip.loadAsync(file);
            let xmlFile = zip.file("workspace.xml") || Object.values(zip.files).find(f => f.name.endsWith("workspace.xml") && !f.dir);

            if (!xmlFile) {
                alert("Fichier 'workspace.xml' introuvable dans cette archive.");
                return;
            }

            if (xmlFile._data && xmlFile._data.uncompressedSize > 5 * 1024 * 1024) {
                alert("Fichier workspace.xml trop volumineux.");
                return;
            }

            let xmlContent = await xmlFile.async("string");
            xmlContent = xmlContent.replace(/^\uFEFF/, '').trim(); 

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

            if (xmlDoc.querySelector('parsererror')) {
                throw new Error("XML malformé.");
            }

            const blockElements  = xmlDoc.getElementsByTagName("block");
            const shadowElements = xmlDoc.getElementsByTagName("shadow");
            const allElements    = [...Array.from(blockElements), ...Array.from(shadowElements)];

            allElements.forEach(el => {
                const blockType = el.getAttribute("type");
                if (!blockType || !/^[a-zA-Z0-9_]+$/.test(blockType)) return;

                if (!Blockly.Blocks[blockType]) {
                    const parentNodeName = el.parentNode ? el.parentNode.nodeName.toLowerCase() : "";
                    const isValueOutput  = (parentNodeName === "value");

                    Blockly.Blocks[blockType] = {
                        init: function() {
                            this.appendDummyInput().appendField("⚠️ " + blockType);
                            this.setColour("#e74c3c");
                            if (isValueOutput) this.setOutput(true, null);
                            else {
                                this.setPreviousStatement(true, null);
                                this.setNextStatement(true, null);
                            }
                        }
                    };

                    const activeGen = (window.javascript && window.javascript.javascriptGenerator) || Blockly.JavaScript;
                    const dummyGenFn = function() {
                        return isValueOutput ? ["''", (activeGen ? activeGen.ORDER_ATOMIC : 0) || 0] : "";
                    };

                    if (activeGen) {
                        if (!activeGen.forBlock) activeGen.forBlock = {};
                        activeGen[blockType] = dummyGenFn;
                        activeGen.forBlock[blockType] = dummyGenFn;
                    }
                    if (Blockly.JavaScript && Blockly.JavaScript !== activeGen) {
                        if (!Blockly.JavaScript.forBlock) Blockly.JavaScript.forBlock = {};
                        Blockly.JavaScript[blockType] = dummyGenFn;
                        Blockly.JavaScript.forBlock[blockType] = dummyGenFn;
                    }
                }
            });

            if (!DBB_Config.workspace) {
                alert("Erreur critique : L'espace de travail n'est pas initialisé.");
                return;
            }

            DBB_Config.workspace.clear();
            Blockly.Xml.domToWorkspace(xmlDoc.documentElement, DBB_Config.workspace);
            console.log("[DBB] Projet importé avec succès !");

        } catch (error) {
            console.error("[DBB] Échec de l'importation :", error);
            alert("Erreur de rendu : " + (error.message || "Fichier corrompu."));
        }
    }
};

