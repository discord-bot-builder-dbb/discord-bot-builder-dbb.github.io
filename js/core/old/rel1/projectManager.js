// =========================================================================
// SÉCURISATION DE L'API BLOCKLY (POLYFILL)
// =========================================================================
if (!Blockly.JavaScript) {
    if (window.javascript && window.javascript.javascriptGenerator) {
        Blockly.JavaScript = window.javascript.javascriptGenerator;
    } else {
        Blockly.JavaScript = {};
    }
}

const DBB_ProjectManager = {
    
    // --- 1. COMPILATION ET EXPORTATION ZIP ---
    exportProject: async function() {
        const zip = new JSZip();

        // Sauvegarde de l'espace de travail
        const xmlDom = Blockly.Xml.workspaceToDom(DBB_Config.workspace);
        const xmlText = Blockly.Xml.domToPrettyText(xmlDom);
        zip.file("workspace.xml", xmlText);

        // Compilation intelligente du code
        const generator = Blockly.JavaScript || (window.javascript && window.javascript.javascriptGenerator);
        const rawBotCode = generator ? generator.workspaceToCode(DBB_Config.workspace) : "// Erreur Générateur";
        const botJsContent = this.cleanAndGenerateBotJs(rawBotCode);
        zip.file("bot.js", botJsContent);

        // Fichier de configuration Node.js
        const packageJson = {
            name: "geoglory-world-rp",
            version: "1.0.0",
            description: "Généré par DBB Pro Edition",
            main: "bot.js",
            scripts: { "start": "node bot.js" },
            dependencies: { 
                "discord.js": "^14.14.0", 
                "sqlite3": "^5.1.7" 
            }
        };
        zip.file("package.json", JSON.stringify(packageJson, null, 2));

        // Structure des dossiers
        zip.folder("extensions").folder("builtin");
        zip.folder("extensions").folder("community");

        // Téléchargement
        const blob = await zip.generateAsync({ type: "blob" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "GEOGLORY_Project.zip";
        a.click();
        URL.revokeObjectURL(a.href);
    },

    // --- 2. COMPILATEUR ET OPTIMISEUR DE CODE (PARSER AVANCÉ) ---
    cleanAndGenerateBotJs: function(blocklyCode) {
        let cleanedCode = blocklyCode;
        
        // A. Nettoyage des doublons d'instanciation
        cleanedCode = cleanedCode.replace(/const\s+\{[^}]*\}\s*=\s*require\(['"]discord\.js['"]\);?/g, '');
        cleanedCode = cleanedCode.replace(/(?:global\.)?client\s*=\s*new\s+Client\([^)]*\);?/g, '');
        cleanedCode = cleanedCode.replace(/(?:global\.)?client\.login\([^)]*\);?/g, '');

        // B. Analyseur syntaxique par comptage d'accolades (Anti-Crash)
        const readyBlocks = [];
        const signatures = ["client.once('ready', async () => {", "global.client.once('ready', async () => {"];
        
        for (let sig of signatures) {
            let startIndex = 0;
            while ((startIndex = cleanedCode.indexOf(sig, startIndex)) !== -1) {
                let braceCount = 0;
                let i = startIndex + sig.length - 1; // Pointe sur la première accolade '{'
                let bodyStart = i + 1;
                let foundEnd = false;
                
                for (; i < cleanedCode.length; i++) {
                    if (cleanedCode[i] === '{') braceCount++;
                    else if (cleanedCode[i] === '}') {
                        braceCount--;
                        if (braceCount === 0) {
                            foundEnd = true;
                            break;
                        }
                    }
                }
                
                if (foundEnd) {
                    let body = cleanedCode.substring(bodyStart, i).trim();
                    
                    // Isolation des boucles infinies (while) pour ne pas figer le bot
                    if (body.includes("while (true)") || body.includes("while(true)")) {
                        body = `// Tâche de fond isolée automatiquement\n    (async () => {\n        ${body}\n    })();`;
                    }
                    
                    readyBlocks.push(body);
                    
                    // Suppression propre du bloc analysé
                    let endRemove = i + 1;
                    if (cleanedCode.substring(endRemove, endRemove + 2) === ');') endRemove += 2;
                    
                    cleanedCode = cleanedCode.substring(0, startIndex) + cleanedCode.substring(endRemove);
                    startIndex = 0; // On recommence depuis le début pour trouver les suivants
                } else {
                    startIndex += sig.length;
                }
            }
        }
        
        // Nettoyage des sauts de lignes excessifs
        cleanedCode = cleanedCode.trim().replace(/\n{3,}/g, '\n\n');

        // C. Assemblage du fichier de production final
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

// Liaison critique pour assurer la compatibilité des blocs
global.client = client;

// --- DÉBUT DU CODE BLOCKLY (Événements) ---

${cleanedCode}

// --- INITIALISATION UNIQUE (Événement Ready) ---
client.once('ready', async () => {
    console.log(\`[DBB] Le Bot \${client.user.tag} est en ligne !\`);
    
    // 1. Exécution des modules Blockly
    ${readyBlocks.join('\n\n    ')}

    // 2. Déploiement des Commandes Slash (API Discord)
    if (client.slashCommandsData && client.slashCommandsData.length > 0) {
        try {
            const rest = new REST({ version: '10' }).setToken(client.token || process.env.DISCORD_TOKEN);
            console.log(\`[DBB] Synchronisation de \${client.slashCommandsData.length} commande(s)...\`);
            await rest.put(Routes.applicationCommands(client.user.id), { body: client.slashCommandsData });
            console.log('[DBB] Commandes Slash synchronisées avec succès !');
        } catch (error) {
            console.error('[DBB] Erreur API Discord:', error);
        }
    }
});

// Connexion au réseau Discord
client.login(process.env.DISCORD_TOKEN);

// Sécurité Anti-Crash globale
process.on('unhandledRejection', error => console.error('[DBB Erreur Non Capturée] :', error));
`;
    },

    // --- 3. IMPORTATION ZIP AVEC RÉTROCOMPATIBILITÉ DYNAMIQUE ---
    importProject: async function(file) {
        try {
            const zip = await JSZip.loadAsync(file);
            
            // Recherche flexible du fichier XML
            let xmlFile = zip.file("workspace.xml");
            if (!xmlFile) {
                const allFiles = Object.values(zip.files);
                xmlFile = allFiles.find(f => f.name.endsWith("workspace.xml") && !f.dir);
            }

            if (!xmlFile) {
                alert("Fichier 'workspace.xml' introuvable dans cette archive.");
                return;
            }

            let xmlContent = await xmlFile.async("string");
            xmlContent = xmlContent.replace(/^\uFEFF/, '').trim(); // Nettoyage BOM

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
            
            // Extraction des blocs normaux et des ombres (shadow)
            const blockElements = xmlDoc.getElementsByTagName("block");
            const shadowElements = xmlDoc.getElementsByTagName("shadow");
            const allElements = [...Array.from(blockElements), ...Array.from(shadowElements)];

            // Création de Stubs pour les blocs manquants (Empêche le TypeError {})
            allElements.forEach(el => {
                const blockType = el.getAttribute("type");
                
                if (blockType && !Blockly.Blocks[blockType]) {
                    const parentNodeName = el.parentNode ? el.parentNode.nodeName.toLowerCase() : "";
                    const isValueOutput = (parentNodeName === "value");

                    Blockly.Blocks[blockType] = {
                        init: function() {
                            this.appendDummyInput().appendField("⚠️ " + blockType);
                            this.setColour("#e74c3c");
                            if (isValueOutput) {
                                this.setOutput(true, null);
                            } else {
                                this.setPreviousStatement(true, null);
                                this.setNextStatement(true, null);
                            }
                        }
                    };

                    if (Blockly.JavaScript) {
                        Blockly.JavaScript[blockType] = function() {
                            return isValueOutput ? ["''", Blockly.JavaScript.ORDER_ATOMIC] : "";
                        };
                    }
                }
            });

            if (!DBB_Config.workspace) {
                alert("Erreur critique : L'espace de travail n'est pas initialisé.");
                return;
            }

            // Nettoyage et rendu final
            DBB_Config.workspace.clear();
            Blockly.Xml.domToWorkspace(xmlDoc.documentElement, DBB_Config.workspace);
            console.log("[DBB] Projet importé et restauré avec succès !");
            
        } catch (error) {
            console.error("[DBB] Échec de l'importation :", error);
            alert("Erreur de rendu : " + (error.message || "Fichier XML corrompu."));
        }
    }
};


