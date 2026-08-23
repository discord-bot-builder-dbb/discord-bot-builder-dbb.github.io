/**
 * Discord Bot Builder (DBB) - Extension Native : Messages & Émissions (Embeds, Réactions, Suppression, Informations)
 * Version : 1.1.0 (Spécification Discord.js v14)
 */

DBB.registerExtension({
    id: "core_messages_advanced",
    name: "Messages & Embeds",
    color: "#0099ff", // Bleu messagerie

    blocks: [
        // ==========================================
        // 1. EXTRACTION ET LECTURE D'INFORMATIONS (REPORTER + DROPDOWN)
        // ==========================================
        {
            type: "message_get_info",
            message0: "dans le message %1 récupérer %2",
            args0: [
                { type: "input_value", name: "MESSAGE", check: "Message" },
                {
                    type: "field_dropdown",
                    name: "PROPERTY",
                    options: [
                        ["le contenu textuel", "CONTENT"],
                        ["l'ID de l'auteur", "AUTHOR_ID"],
                        ["le nom de l'auteur", "AUTHOR_NAME"],
                        ["l'ID du salon", "CHANNEL_ID"],
                        ["l'ID du serveur (guild)", "GUILD_ID"],
                        ["l'ID unique du message", "MESSAGE_ID"],
                        ["le timestamp de création", "TIMESTAMP"],
                        ["l'objet auteur (User)", "AUTHOR_OBJ"],
                        ["l'objet salon (Channel)", "CHANNEL_OBJ"],
                        ["l'objet serveur (Guild)", "GUILD_OBJ"]
                    ]
                }
            ],
            output: null, // Sortie dynamique selon le choix
            colour: "#0099ff",
            tooltip: "Récupère une information spécifique à partir de l'objet message reçu."
        },

        // ==========================================
        // 2. ÉMISSION DE MESSAGES STANDARDS
        // ==========================================
        {
            type: "message_send_simple",
            message0: "dans le salon (ID ou Objet) %1 envoyer le texte %2",
            args0: [
                { type: "input_value", name: "CHANNEL", check: ["String", "Number", "Channel"] },
                { type: "input_value", name: "TEXT", check: "String" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#0099ff",
            tooltip: "Envoie un message textuel simple dans un salon spécifié par son ID ou son objet."
        },
        {
            type: "message_reply",
            message0: "répondre à l'objet message %1 avec le texte %2",
            args0: [
                { type: "input_value", name: "MESSAGE", check: "Message" },
                { type: "input_value", name: "TEXT", check: "String" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#0099ff",
            tooltip: "Répond directement à un message précis (crée un fil de discussion ou une mention de réponse)."
        },

        // ==========================================
        // 3. CONSTRUCTEUR D'EMBEDS
        // ==========================================
        {
            type: "embed_create",
            message0: "créer un Embed 📝",
            output: "Embed",
            colour: "#1abc9c",
            tooltip: "Initialise un nouvel objet Embed à configurer."
        },
        {
            type: "embed_set_properties",
            message0: "modifier l'Embed %1 | Titre: %2 | Couleur (Hex): %3 | Description: %4",
            args0: [
                { type: "input_value", name: "EMBED", check: "Embed" },
                { type: "input_value", name: "TITLE", check: "String" },
                { type: "input_value", name: "COLOR", check: "String" },
                { type: "input_value", name: "DESC", check: "String" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#1abc9c",
            tooltip: "Définit le titre, la couleur hexadécimale (ex: #ff0000) et la description d'un Embed."
        },
        {
            type: "embed_send",
            message0: "dans le salon (ID ou Objet) %1 envoyer l'Embed %2",
            args0: [
                { type: "input_value", name: "CHANNEL", check: ["String", "Number", "Channel"] },
                { type: "input_value", name: "EMBED", check: "Embed" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#0099ff",
            tooltip: "Envoie un Embed configuré dans le salon spécifié."
        },

        // ==========================================
        // 4. ACTIONS DE MESSAGES (RÉACTIONS & SUPPRESSION)
        // ==========================================
        {
            type: "message_add_reaction",
            message0: "ajouter au message %1 la réaction (Émoji) %2",
            args0: [
                { type: "input_value", name: "MESSAGE", check: "Message" },
                { type: "input_value", name: "EMOJI", check: "String" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#0099ff",
            tooltip: "Ajoute une réaction émoji (ex: 🌍 ou 👍) à un message."
        },
        {
            type: "message_delete",
            message0: "supprimer l'objet message %1",
            args0: [
                { type: "input_value", name: "MESSAGE", check: "Message" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#e74c3c", // Rouge alerte
            tooltip: "Supprime instantanément le message ciblé du salon."
        }
    ],

    generators: {
        // --- Outil interne de résolution de salon ---
        _resolveChannelCode: function(chanVar) {
            return `(typeof ${chanVar} === 'string' || typeof ${chanVar} === 'number' ? client.channels.cache.get(String(${chanVar})) : ${chanVar})`;
        },

        // --- GÉNÉRATEUR : Récupération des infos (Dropdown) ---
        "message_get_info": function(block, generator) {
            const msg = generator.valueToCode(block, 'MESSAGE', generator.ORDER_ATOMIC) || "null";
            const property = block.getFieldValue('PROPERTY');
            
            let code = "''";
            
            switch (property) {
                case "CONTENT":
                    code = `(${msg} ? ${msg}.content : '')`;
                    break;
                case "AUTHOR_ID":
                    code = `(${msg} && ${msg}.author ? ${msg}.author.id : '')`;
                    break;
                case "AUTHOR_NAME":
                    code = `(${msg} && ${msg}.author ? ${msg}.author.username : '')`;
                    break;
                case "CHANNEL_ID":
                    code = `(${msg} ? ${msg}.channelId : '')`;
                    break;
                case "GUILD_ID":
                    code = `(${msg} ? ${msg}.guildId : '')`;
                    break;
                case "MESSAGE_ID":
                    code = `(${msg} ? ${msg}.id : '')`;
                    break;
                case "TIMESTAMP":
                    code = `(${msg} ? ${msg}.createdTimestamp : 0)`;
                    break;
                case "AUTHOR_OBJ":
                    code = `(${msg} ? ${msg}.author : null)`;
                    break;
                case "CHANNEL_OBJ":
                    code = `(${msg} ? ${msg}.channel : null)`;
                    break;
                case "GUILD_OBJ":
                    code = `(${msg} ? ${msg}.guild : null)`;
                    break;
            }
            
            return [code, generator.ORDER_ATOMIC];
        },

        // --- Envoi simple ---
        "message_send_simple": function(block, generator) {
            const channelRaw = generator.valueToCode(block, 'CHANNEL', generator.ORDER_ATOMIC) || "null";
            const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
            
            const targetChannel = this._resolveChannelCode(channelRaw);
            return `const chanObj_send = ${targetChannel};\n` +
                   `if (chanObj_send && typeof chanObj_send.send === 'function') {\n` +
                   `  try { await chanObj_send.send({ content: String(${text}) }); } catch(e) { console.error('[DBB Send Error]', e.message); }\n` +
                   `}\n`;
        },

        // --- Répondre à un message ---
        "message_reply": function(block, generator) {
            const msg = generator.valueToCode(block, 'MESSAGE', generator.ORDER_ATOMIC) || "null";
            const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
            
            return `if (${msg} && typeof ${msg}.reply === 'function') {\n` +
                   `  try { await ${msg}.reply({ content: String(${text}) }); } catch(e) { console.error('[DBB Reply Error]', e.message); }\n` +
                   `}\n`;
        },

        // --- Créer Embed ---
        "embed_create": function(block, generator) {
            const code = `(new (require('discord.js')).EmbedBuilder())`;
            return [code, generator.ORDER_ATOMIC];
        },

        // --- Paramétrer Embed ---
        "embed_set_properties": function(block, generator) {
            const embed = generator.valueToCode(block, 'EMBED', generator.ORDER_ATOMIC) || "null";
            const title = generator.valueToCode(block, 'TITLE', generator.ORDER_ATOMIC) || "''";
            const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || "'#0099ff'";
            const desc = generator.valueToCode(block, 'DESC', generator.ORDER_ATOMIC) || "''";
            
            return `if (${embed} && typeof ${embed}.setTitle === 'function') {\n` +
                   `  if (${title}) ${embed}.setTitle(String(${title}));\n` +
                   `  if (${color}) { \n` +
                   `     try { ${embed}.setColor(String(${color}).startsWith('#') ? String(${color}) : '#' + String(${color})); } catch(e) {}\n` +
                   `  }\n` +
                   `  if (${desc}) ${embed}.setDescription(String(${desc}));\n` +
                   `}\n`;
        },

        // --- Envoyer Embed ---
        "embed_send": function(block, generator) {
            const channelRaw = generator.valueToCode(block, 'CHANNEL', generator.ORDER_ATOMIC) || "null";
            const embed = generator.valueToCode(block, 'EMBED', generator.ORDER_ATOMIC) || "null";
            
            const targetChannel = this._resolveChannelCode(channelRaw);
            return `const chanObj_emb = ${targetChannel};\n` +
                   `if (chanObj_emb && typeof chanObj_emb.send === 'function' && ${embed}) {\n` +
                   `  try { await chanObj_emb.send({ embeds: [${embed}] }); } catch(e) { console.error('[DBB Embed Send Error]', e.message); }\n` +
                   `}\n`;
        },

        // --- Réagir ---
        "message_add_reaction": function(block, generator) {
            const msg = generator.valueToCode(block, 'MESSAGE', generator.ORDER_ATOMIC) || "null";
            const emoji = generator.valueToCode(block, 'EMOJI', generator.ORDER_ATOMIC) || "''";
            
            return `if (${msg} && typeof ${msg}.react === 'function') {\n` +
                   `  try { await ${msg}.react(String(${emoji}).trim()); } catch(e) { console.error('[DBB Reaction Error]', e.message); }\n` +
                   `}\n`;
        },

        // --- Supprimer message ---
        "message_delete": function(block, generator) {
            const msg = generator.valueToCode(block, 'MESSAGE', generator.ORDER_ATOMIC) || "null";
            
            return `if (${msg} && typeof ${msg}.delete === 'function') {\n` +
                   `  try { await ${msg}.delete(); } catch(e) { console.error('[DBB Delete Error]', e.message); }\n` +
                   `}\n`;
        }
    }
});

