/**
 * Discord Bot Builder (DBB) - Extension Native : Web & API
 * Version : 1.0.0 (Serveur Express, CORS, Backend & Requêtes HTTP)
 */

DBB.registerExtension({
    id: "core_web_api",
    name: "Web & API",
    color: "#00b159", // Vert émeraude pour le réseau et les API
    
    blocks: [
        // ==========================================
        // 1. SERVEUR BACKEND (EXPRESS)
        // ==========================================
        
        // Initialiser le serveur Express
        {
            type: "api_express_init",
            message0: "initialiser le serveur Express sur le port %1 %2 activer CORS ? %3",
            args0: [
                { type: "input_value", name: "PORT", check: "Number" },
                { type: "input_dummy" },
                { type: "field_checkbox", name: "CORS", checked: true }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#00b159",
            tooltip: "Démarre un serveur HTTP interne sur le port spécifié avec support JSON et CORS optionnel."
        },

        // Créer une route d'API (GET, POST, etc.)
        {
            type: "api_express_route",
            message0: "écouter la route %1 [ %2 ] en méthode %3 %4",
            args0: [
                { type: "field_input", name: "PATH", text: "/api/status" },
                { type: "field_input", name: "REQ_RES_NAME", text: "requete, reponse" },
                {
                    type: "field_dropdown",
                    name: "METHOD",
                    options: [["GET", "get"], ["POST", "post"], ["PUT", "put"], ["DELETE", "delete"]]
                },
                { type: "input_dummy" }
            ],
            message1: "%1",
            args1: [
                { type: "input_statement", name: "STACK" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#00b159",
            tooltip: "Crée un point d'accès (endpoint) HTTP. Expose les variables locales de requête et de réponse."
        },

        // Renvoyer une réponse HTTP au format JSON
        {
            type: "api_express_respond",
            message0: "renvoyer la réponse HTTP %1 avec le statut %2 et les données %3",
            args0: [
                { type: "field_input", name: "RES_NAME", text: "reponse" },
                { type: "input_value", name: "STATUS", check: "Number" },
                { type: "input_value", name: "DATA" }
            ],
            previousStatement: null,
            colour: "#00b159",
            tooltip: "Envoie les données (texte ou dictionnaire) au client et clôture la requête HTTP (Statut standard : 200)."
        },

        // Récupérer le Body ou les Query params d'une requête reçue
        {
            type: "api_express_get_param",
            message0: "extraire de la requête %1 la propriété %2 depuis %3",
            args0: [
                { type: "field_input", name: "REQ_NAME", text: "requete" },
                { type: "input_value", name: "PARAM_NAME", check: "String" },
                {
                    type: "field_dropdown",
                    name: "SOURCE",
                    options: [
                        ["le corps (Body JSON / POST)", "body"],
                        ["l'URL (Query Params ?id=...)", "query"],
                        ["les entêtes (Headers)", "headers"]
                    ]
                }
            ],
            output: null,
            colour: "#00b159",
            tooltip: "Récupère les données envoyées par le client dans sa requête HTTP."
        },

        // ==========================================
        // 2. CLIENT RESEAU (REQUÊTES FETCH)
        // ==========================================

        // Faire une requête HTTP externe (API REST)
        {
            type: "api_fetch_request",
            message0: "envoyer une requête %1 à l'URL %2 %3 avec les entêtes/options %4",
            args0: [
                {
                    type: "field_dropdown",
                    name: "METHOD",
                    options: [["GET", "GET"], ["POST", "POST"], ["PUT", "PUT"], ["DELETE", "DELETE"]]
                },
                { type: "input_value", name: "URL", check: "String" },
                { type: "input_dummy" },
                { type: "input_value", name: "OPTIONS", check: "Object" }
            ],
            output: null,
            colour: "#00b159",
            tooltip: "Effectue une requête réseau asynchrone vers une API externe et retourne la réponse au format texte ou JSON."
        }
    ],

    generators: {
        // --- Émetteur/Générateur Express Init ---
        "api_express_init": function(block, generator) {
            const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || "3000";
            const useCors = block.getFieldValue('CORS') === 'TRUE';
            
            let code = `\n// Initialisation du serveur Backend\n`;
            code += `const express = require('express');\n`;
            code += `global.appServer = express();\n`;
            code += `global.appServer.use(express.json());\n`;
            
            if (useCors) {
                code += `global.appServer.use(require('cors')());\n`;
            }
            
            code += `global.appServer.listen(${port}, () => console.log(\`[DBB Backend] Serveur API actif sur le port \${${port}}\`));\n`;
            return code;
        },

        // --- Déclaration d'une route d'écoute ---
        "api_express_route": function(block, generator) {
            const path = block.getFieldValue('PATH') || '/';
            const method = block.getFieldValue('METHOD') || 'get';
            const rawParams = block.getFieldValue('REQ_RES_NAME') || 'req, res';
            
            // Nettoyage et séparation sûre des arguments passés par l'utilisateur
            const params = rawParams.split(',').map(p => p.trim().replace(/[^a-zA-Z0-9_]/g, ''));
            const reqVar = params[0] || 'req';
            const resVar = params[1] || 'res';

            const innerCode = generator.statementToCode(block, 'STACK') || '';

            return `if (global.appServer) {\n  global.appServer.${method}('${path}', async (${reqVar}, ${resVar}) => {\n${innerCode}  });\n}\n`;
        },

        // --- Réponse HTTP vers le client ---
        "api_express_respond": function(block, generator) {
            const resVar = block.getFieldValue('RES_NAME').trim().replace(/[^a-zA-Z0-9_]/g, '') || 'res';
            const status = generator.valueToCode(block, 'STATUS', generator.ORDER_ATOMIC) || "200";
            const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || "{}";

            return `if (typeof ${resVar} !== 'undefined' && typeof ${resVar}.status === 'function') {\n  ${resVar}.status(${status}).json(${data});\n}\n`;
        },

        // --- Récupération des paramètres entrants ---
        "api_express_get_param": function(block, generator) {
            const reqVar = block.getFieldValue('REQ_NAME').trim().replace(/[^a-zA-Z0-9_]/g, '') || 'req';
            const paramName = generator.valueToCode(block, 'PARAM_NAME', generator.ORDER_ATOMIC) || "''";
            const source = block.getFieldValue('SOURCE') || 'body';

            const code = `(typeof ${reqVar} !== 'undefined' && ${reqVar}.${source} ? ${reqVar}.${source}[${paramName}] : undefined)`;
            return [code, generator.ORDER_ATOMIC];
        },

        // --- Requête Fetch asynchrone (Mode Expression) ---
        "api_fetch_request": function(block, generator) {
            const method = block.getFieldValue('METHOD') || 'GET';
            const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || "''";
            const options = generator.valueToCode(block, 'OPTIONS', generator.ORDER_ATOMIC) || "null";

            // Injection dynamique des options (headers, body...) si configuré par l'utilisateur
            const fetchOptionsObj = `{\n    method: '${method}',\n    ...(${options} && typeof ${options} === 'object' ? ${options} : {})\n  }`;

            // Fonction auto-exécutée asynchrone protectrice qui gère l'évaluation JSON ou texte brut automatique
            const code = `await (async () => {\n  try {\n    const res = await fetch(${url}, ${fetchOptionsObj});\n    const text = await res.text();\n    try { return JSON.parse(text); } catch(e) { return text; }\n  } catch (err) {\n    console.error('[DBB Fetch Error]', err.message);\n    return undefined;\n  }\n})()`;

            return [code, generator.ORDER_AWAIT || 0];
        }
    }
});
