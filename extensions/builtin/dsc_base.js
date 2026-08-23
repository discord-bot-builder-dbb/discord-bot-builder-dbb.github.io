/**
 * Discord Bot Builder (DBB) - Extension Native : Discord Base
 * Version : 1.0.0 (Configuration du Client, Statuts, Intents, Salons & Membres)
 * Spécification : Discord.js v14
 */

DBB.registerExtension({
    id: "core_discord_base",
    name: "Discord Base",
    color: "#5865F2", // Le Blurple officiel de Discord pour les fondations

    blocks: [
        // ==========================================
        // 1. CONFIGURATION & INITIALISATION DU BOT
        // ==========================================
        {
            type: "discord_client_init",
            message0: "Initialiser le Bot Discord %1 Sélectionner les privilèges (Intents) : %2 Messages privés (DirectMessages) %3 Contenu des messages (MessageContent) %4 Membres du serveur (GuildMembers) %5",
            args0: [
                { type: "input_dummy" },
                { type: "input_dummy" },
                { type: "field_checkbox", name: "INTENT_DM", checked: true },
                { type: "field_checkbox", name: "INTENT_CONTENT", checked: true },
                { type: "field_checkbox", name: "INTENT_MEMBERS", checked: true }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#5865F2",
            tooltip: "Configure l'instance du bot avec les privilèges requis par l'application sur le portail développeur Discord."
        },
        {
            type: "discord_client_login",
            message0: "Connecter le bot avec le Token %1",
            args0: [{ type: "input_value", name: "TOKEN", check: "String" }],
            previousStatement: null,
            nextStatement: null,
            colour: "#5865F2",
            tooltip: "Authentifie le bot auprès des services de Discord à l'aide de sa clé privée (Token)."
        },

        // ==========================================
        // 2. PRÉSENCE & STATUT NUMÉRIQUE
        // ==========================================
        {
            type: "discord_client_set_activity",
            message0: "Définir l'activité du bot sur le texte %1 en mode %2 statut %3",
            args0: [
                { type: "input_value", name: "TEXT", check: "String" },
                {
                    type: "field_dropdown",
                    name: "TYPE",
                    options: [["Joue à (PLAYING)", "0"], ["Écoute (LISTENING)", "2"], ["Regarde (WATCHING)", "3"], ["Streame (STREAMING)", "1"]]
                },
                {
                    type: "field_dropdown",
                    name: "STATUS",
                    options: [["En ligne (online)", "online"], ["Inactif (idle)", "idle"], ["Ne pas déranger (dnd)", "dnd"], ["Invisible (invisible)", "invisible"]]
                }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#5865F2",
            tooltip: "Met à jour dynamiquement le statut de présence et le texte d'activité du bot."
        },

        // ==========================================
        // 3. ACTIONS DE SALONS & ENVOIS INDÉPENDANTS
        // ==========================================
        {
            type: "discord_send_to_channel_id",
            message0: "Envoyer dans le salon d'ID %1 le texte %2",
            args0: [
                { type: "input_value", name: "CHANNEL_ID", check: "String" },
                { type: "input_value", name: "TEXT", check: "String" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#5865F2",
            tooltip: "Envoie de manière asynchrone un message dans un salon textuel spécifique via son identifiant unique."
        },

        // ==========================================
        // 4. EXTRACTEURS DE PROPRIÉTÉS (REPORTERS)
        // ==========================================
        {
            type: "discord_get_user_info",
            message0: "extraire de l'utilisateur/membre %1 la propriété %2",
            args0: [
                { type: "input_value", name: "USER" },
                {
                    type: "field_dropdown",
                    name: "PROP",
                    options: [
                        ["Identifiant (ID)", "id"],
                        ["Pseudo d'affichage", "displayName"],
                        ["Nom d'utilisateur globale", "username"],
                        ["Est un Bot ?", "bot"],
                        ["Mention (<@ID>)", "mention"]
                    ]
                }
            ],
            output: null,
            colour: "#5865F2",
            tooltip: "Permet de lire les informations fondamentales d'un utilisateur ou d'un membre cible."
        },
        {
            type: "discord_get_guild_info",
            message0: "extraire du serveur %1 la propriété %2",
            args0: [
                { type: "input_value", name: "GUILD" },
                {
                    type: "field_dropdown",
                    name: "PROP",
                    options: [
                        ["Identifiant (ID)", "id"],
                        ["Nom du serveur", "name"],
                        ["Nombre total de membres", "memberCount"],
                        ["ID du Propriétaire", "ownerId"]
                    ]
                }
            ],
            output: null,
            colour: "#5865F2",
            tooltip: "Permet de lire les statistiques globales d'un objet serveur."
        }
    ],

    generators: {
        // --- Générateur : Initialisation du Client ---
        "discord_client_init": function(block, generator) {
            const dm = block.getFieldValue('INTENT_DM') === 'TRUE';
            const content = block.getFieldValue('INTENT_CONTENT') === 'TRUE';
            const members = block.getFieldValue('INTENT_MEMBERS') === 'TRUE';

            let intentsArray = ["GatewayIntentBits.Guilds", "GatewayIntentBits.GuildMessages"];
            if (dm) intentsArray.push("GatewayIntentBits.DirectMessages");
            if (content) intentsArray.push("GatewayIntentBits.MessageContent");
            if (members) intentsArray.push("GatewayIntentBits.GuildMembers");

            let code = `const { Client, GatewayIntentBits, ActivityType } = require('discord.js');\n`;
            code += `global.client = new Client({\n`;
            code += `  intents: [\n    ${intentsArray.join(',\n    ')}\n  ]\n});\n\n`;
            return code;
        },

        // --- Générateur : Connexion ---
        "discord_client_login": function(block, generator) {
            const token = generator.valueToCode(block, 'TOKEN', generator.ORDER_ATOMIC) || "''";
            return `global.client.login(${token});\n`;
        },

        // --- Générateur : Présence/Activité ---
        "discord_client_set_activity": function(block, generator) {
            const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
            const type = block.getFieldValue('TYPE');
            const status = block.getFieldValue('STATUS');

            return `if (global.client && global.client.user) {\n` +
                   `  global.client.user.setPresence({\n` +
                   `    status: '${status}',\n` +
                   `    activities: [{ name: ${text}, type: ${type} }]\n` +
                   `  });\n` +
                   `}\n`;
        },

        // --- Générateur : Envoi par ID de Salon ---
        "discord_send_to_channel_id": function(block, generator) {
            const channelId = generator.valueToCode(block, 'CHANNEL_ID', generator.ORDER_ATOMIC) || "''";
            const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";

            return `if (global.client) {\n` +
                   `  try {\n` +
                   `    const chan = await global.client.channels.fetch(${channelId});\n` +
                   `    if (chan && chan.isTextBased()) await chan.send({ content: ${text} });\n` +
                   `  } catch(e) {\n` +
                   `    console.error('[DBB Base Send Error]', e.message);\n` +
                   `  }\n` +
                   `}\n`;
        },

        // --- Générateur : Inspecteur Utilisateur ---
        "discord_get_user_info": function(block, generator) {
            const user = generator.valueToCode(block, 'USER', generator.ORDER_ATOMIC) || "null";
            const prop = block.getFieldValue('PROP');

            let target = `(${user}?.user || ${user})`; // Gère de manière transparente si c'est un GuildMember ou un User brut
            let evalCode = "";

            if (prop === "mention") evalCode = `(${target} ? \`<@\${${target}.id}>\` : '')`;
            else evalCode = `(${target} ? ${target}.${prop} : undefined)`;

            return [evalCode, generator.ORDER_ATOMIC];
        },

        // --- Générateur : Inspecteur Serveur ---
        "discord_get_guild_info": function(block, generator) {
            const guild = generator.valueToCode(block, 'GUILD', generator.ORDER_ATOMIC) || "null";
            const prop = block.getFieldValue('PROP');

            const code = `(${guild} ? ${guild}.${prop} : undefined)`;
            return [code, generator.ORDER_ATOMIC];
        }
    }
});
