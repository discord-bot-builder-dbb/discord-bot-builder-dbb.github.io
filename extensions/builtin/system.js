{
    /**
     * Discord Bot Builder (DBB) - Extension Native : Système & Logs
     * Version : 1.1.0 (Logs, Exécution Shell & Gestion Processus)
     */

    DBB.registerExtension({
        id: "core_system",
        name: "Système & Logs",
        color: "#5b67a5", // Couleur violet-bleu pro pour les outils système
        
        blocks: [
            // ==========================================
            // 1. LOGS ET AFFICHAGE CONSOLE
            // ==========================================
            {
                type: "system_log_stable",
                message0: "loguer en %1 le message : %2",
                args0: [
                    {
                        type: "field_dropdown",
                        name: "LOG_TYPE",
                        options: [
                            ["[INFO] (Bleu)", "INFO"],
                            ["[SUCCÈS] (Vert)", "SUCCESS"],
                            ["[ATTENTION] (Jaune)", "WARN"],
                            ["[ERREUR] (Rouge)", "ERROR"]
                        ]
                    },
                    { type: "input_value", name: "TEXT" }
                ],
                previousStatement: null,
                nextStatement: null,
                colour: "#5b67a5",
                tooltip: "Affiche un message formaté avec style et horodatage dans la console du bot."
            },
            {
                type: "system_clear_console",
                message0: "effacer l'écran de la console (Clear)",
                args0: [],
                previousStatement: null,
                nextStatement: null,
                colour: "#5b67a5",
                tooltip: "Nettoie entièrement l'historique visible du terminal / de la console."
            },
            
            // ==========================================
            // 2. EXÉCUTION CLI (SHELL)
            // ==========================================
            {
                type: "system_execute_statement_stable",
                message0: "exécuter la commande CLI %1",
                args0: [
                    { type: "input_value", name: "COMMAND" }
                ],
                previousStatement: null,
                nextStatement: null,
                colour: "#5b67a5",
                tooltip: "Exécute une commande système (Shell/Terminal) en arrière-plan sans attendre de retour de texte."
            },
            {
                type: "system_execute_expression_stable",
                message0: "résultat CLI de %1",
                args0: [
                    { type: "input_value", name: "COMMAND" }
                ],
                output: null,
                colour: "#5b67a5",
                tooltip: "Exécute la commande système et renvoie le texte généré par le terminal (stdout)."
            },
            
            // ==========================================
            // 3. CONTRÔLE DU PROCESSUS & OUTILS
            // ==========================================
            {
                type: "system_delay_stable",
                message0: "attendre %1 ms (millisecondes)",
                args0: [
                    { type: "input_value", name: "DELAY", check: "Number" }
                ],
                previousStatement: null,
                nextStatement: null,
                colour: "#5b67a5",
                tooltip: "Met en pause l'exécution du script pendant la durée spécifiée (1000 ms = 1 seconde)."
            },
            {
                type: "system_exit_process",
                message0: "%1 le processus du bot",
                args0: [
                    {
                        type: "field_dropdown",
                        name: "ACTION",
                        options: [
                            ["arrêter (Kill/Exit)", "EXIT"],
                            ["relancer (si PM2/Nodemon actif)", "RESTART"]
                        ]
                    }
                ],
                previousStatement: null,
                nextStatement: null,
                colour: "#5b67a5",
                tooltip: "Arrête l'application Node.js. Si vous utilisez un gestionnaire comme PM2, le mode relancer provoquera un reboot automatique."
            },

            // ==========================================
            // 4. PROTECTION CONTRE LES CRASHS
            // ==========================================
            {
                type: "system_anti_crash",
                message0: "ignorer et loguer les erreurs système imprévues (Anti-Crash)",
                args0: [],
                previousStatement: null,
                nextStatement: null,
                colour: "#5b67a5",
                tooltip: "Intercepte 'uncaughtException' et 'unhandledRejection' pour éviter que le bot Discord ne s'éteigne brutalement lors d'une erreur d'API."
            }
        ],

        generators: {
            // Générateur : Logs personnalisés et colorés
            "system_log_stable": function(block, generator) {
                const logType = block.getFieldValue('LOG_TYPE') || 'INFO';
                const message = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
                
                let prefix = "";
                if (logType === "INFO") prefix = "\\x1b[34m[INFO]\\x1b[0m";       // Bleu
                if (logType === "SUCCESS") prefix = "\\x1b[32m[SUCCÈS]\\x1b[0m";   // Vert
                if (logType === "WARN") prefix = "\\x1b[33m[ATTENTION]\\x1b[0m"; // Jaune
                if (logType === "ERROR") prefix = "\\x1b[31m[ERREUR]\\x1b[0m";    // Rouge

                return `console.log(\`[\${new Date().toLocaleTimeString()}] ${prefix} :\`, ${message});\n`;
            },

            // Générateur : Clear Console
            "system_clear_console": function(block, generator) {
                return `console.clear();\n`;
            },
            
            // Générateur : Exécuter commande sans retour (Statement)
            "system_execute_statement_stable": function(block, generator) {
                const command = generator.valueToCode(block, 'COMMAND', generator.ORDER_ATOMIC) || "''";
                
                return `await new Promise((resolve) => {\n  require('child_process').exec(${command}, (error) => {\n    if (error) console.error(\`[DBB CLI Error]\`, error);\n    resolve();\n  });\n});\n`;
            },

            // Générateur : Récupérer le texte d'une commande (Expression)
            "system_execute_expression_stable": function(block, generator) {
                const command = generator.valueToCode(block, 'COMMAND', generator.ORDER_ATOMIC) || "''";
                
                const code = `await new Promise((resolve) => {\n  require('child_process').exec(${command}, (error, stdout, stderr) => {\n    if (error) { resolve(stderr || error.message); return; }\n    resolve(stdout.trim());\n  });\n})`;
                
                return [code, generator.ORDER_AWAIT || 0];
            },

            // Générateur : Attendre X millisecondes
            "system_delay_stable": function(block, generator) {
                const delay = generator.valueToCode(block, 'DELAY', generator.ORDER_ATOMIC) || "1000";
                
                return `await new Promise(resolve => setTimeout(resolve, Number(${delay})));\n`;
            },

            // Générateur : Arrêter / Relancer le processus
            "system_exit_process": function(block, generator) {
                const action = block.getFieldValue('ACTION');
                const exitCode = action === 'EXIT' ? '0' : '1';
                return `process.exit(${exitCode});\n`;
            },

            // Générateur : Anti-Crash Global
            "system_anti_crash": function(block, generator) {
                return `process.on('uncaughtException', (err) => {\n` +
                       `  console.error(\`[Anti-Crash] Exception non gérée :\`, err);\n` +
                       `});\n` +
                       `process.on('unhandledRejection', (reason, promise) => {\n` +
                       `  console.error(\`[Anti-Crash] Promesse rejetée non gérée à :\`, promise, \`raison :\`, reason);\n` +
                       `});\n`;
            }
        }
    });
}

