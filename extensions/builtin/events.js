/**
 * Discord Bot Builder (DBB) - Extension Native : Événements
 * Version : 2.0.0 (Événements Discord v14 avancés & Événements personnalisés)
 * Spécification : Discord.js v14
 */

DBB.registerExtension({
    id: "discord_events",
    name: "Événements",
    color: "#ffbb00", // Couleur jaune évènements 
    blocks: [
        // ==========================================
        // 1. ÉVÉNEMENTS NATIFS DISCORD
        // ==========================================
        {
            type: "event_ready",
            message0: "Quand le bot se connecte (Ready) %1 %2",
            args0: [{ type: "input_dummy" }, { type: "input_statement", name: "STACK" }],
            colour: "#ffbb00",
            tooltip: "S'exécute une seule fois lorsque le bot est en ligne."
        },
        {
            type: "event_message_create",
            message0: "Quand un message est envoyé %1 %2",
            args0: [{ type: "input_dummy" }, { type: "input_statement", name: "STACK" }],
            colour: "#ffbb00",
            tooltip: "Déclenché à chaque fois qu'un message est reçu par le bot."
        },
        {
            type: "event_message_var",
            message0: "le message reçu",
            output: "Message",
            colour: "#ffbb00",
            tooltip: "Renvoie l'objet message de l'événement actuel."
        },
        {
            type: "event_interaction_create",
            message0: "Quand une interaction (Slash/Bouton) est reçue %1 %2",
            args0: [{ type: "input_dummy" }, { type: "input_statement", name: "STACK" }],
            colour: "#ffbb00",
            tooltip: "Déclenché lorsqu'un utilisateur utilise une commande slash, un bouton, un menu ou un modal."
        },
        {
            type: "event_interaction_var",
            message0: "l'interaction reçue",
            output: "Interaction",
            colour: "#ffbb00",
            tooltip: "Renvoie l'objet interaction actuel."
        },
        {
            type: "event_guild_member_add",
            message0: "Quand un membre rejoint un serveur %1 %2",
            args0: [{ type: "input_dummy" }, { type: "input_statement", name: "STACK" }],
            colour: "#ffbb00",
            tooltip: "Déclenché à l'arrivée d'un nouvel utilisateur (Nécessite l'intent GuildMembers)."
        },
        {
            type: "event_guild_member_remove",
            message0: "Quand un membre quitte un serveur %1 %2",
            args0: [{ type: "input_dummy" }, { type: "input_statement", name: "STACK" }],
            colour: "#ffbb00",
            tooltip: "Déclenché lorsqu'un membre quitte ou est expulsé d'un serveur."
        },
        {
            type: "event_guild_create",
            message0: "Quand le bot rejoint un nouveau serveur %1 %2",
            args0: [{ type: "input_dummy" }, { type: "input_statement", name: "STACK" }],
            colour: "#ffbb00",
            tooltip: "Déclenché quand le bot est ajouté sur un serveur."
        },
        {
            type: "event_guild_delete",
            message0: "Quand le bot est retiré d'un serveur %1 %2",
            args0: [{ type: "input_dummy" }, { type: "input_statement", name: "STACK" }],
            colour: "#ffbb00",
            tooltip: "Déclenché quand le bot se fait exclure d'un serveur ou que le serveur est supprimé."
        },
        
        // Variables associées
        {
            type: "event_member_var",
            message0: "le membre concerné",
            output: "GuildMember",
            colour: "#ffbb00",
            tooltip: "Renvoie l'objet membre (GuildMember) lié à l'événement d'arrivée ou de départ."
        },
        {
            type: "event_guild_var",
            message0: "le serveur concerné",
            output: "Guild",
            colour: "#ffbb00",
            tooltip: "Renvoie le serveur (Guild) lié à l'événement de structure actuel."
        },

        // ==========================================
        // 2. ÉVÉNEMENTS PERSONNALISÉS (COMMUNICATION INTER-SCRIPTS)
        // ==========================================
        {
            type: "event_custom_emit",
            message0: "envoyer le message personnalisé %1",
            args0: [{ type: "input_value", name: "EVENT_NAME", check: "String" }],
            previousStatement: null,
            nextStatement: null,
            colour: "#ffbb00",
            tooltip: "Déclenche instantanément un signal personnalisé à travers tout le bot."
        },
        {
            type: "event_custom_on",
            message0: "quand je reçois le message personnalisé %1 %2 %3",
            args0: [
                { type: "input_value", name: "EVENT_NAME", check: "String" },
                { type: "input_dummy" },
                { type: "input_statement", name: "STACK" }
            ],
            colour: "#ffbb00",
            tooltip: "Écoute et exécute les blocs dès que le message personnalisé indiqué est envoyé."
        }
    ],
    generators: {
        "event_ready": function(block, generator) {
            const innerCode = generator.statementToCode(block, 'STACK');
            return `client.once('ready', async () => {\n  console.log(\`Bot connecté sous le tag : \${client.user.tag}\`);\n${innerCode}});\n\n`;
        },
        "event_message_create": function(block, generator) {
            const innerCode = generator.statementToCode(block, 'STACK');
            return `client.on('messageCreate', async (msg) => {\n  if (msg.author.bot) return;\n${innerCode}});\n\n`;
        },
        "event_message_var": function(block, generator) { return ["msg", generator.ORDER_ATOMIC]; },
        
        "event_interaction_create": function(block, generator) {
            const innerCode = generator.statementToCode(block, 'STACK');
            return `client.on('interactionCreate', async (interaction) => {\n${innerCode}});\n\n`;
        },
        "event_interaction_var": function(block, generator) { return ["interaction", generator.ORDER_ATOMIC]; },

        "event_guild_member_add": function(block, generator) {
            const innerCode = generator.statementToCode(block, 'STACK');
            return `client.on('guildMemberAdd', async (member) => {\n${innerCode}});\n\n`;
        },
        "event_guild_member_remove": function(block, generator) {
            const innerCode = generator.statementToCode(block, 'STACK');
            return `client.on('guildMemberRemove', async (member) => {\n${innerCode}});\n\n`;
        },
        "event_member_var": function(block, generator) { return ["member", generator.ORDER_ATOMIC]; },

        "event_guild_create": function(block, generator) {
            const innerCode = generator.statementToCode(block, 'STACK');
            return `client.on('guildCreate', async (guild) => {\n${innerCode}});\n\n`;
        },
        "event_guild_delete": function(block, generator) {
            const innerCode = generator.statementToCode(block, 'STACK');
            return `client.on('guildDelete', async (guild) => {\n${innerCode}});\n\n`;
        },
        "event_guild_var": function(block, generator) { return ["guild", generator.ORDER_ATOMIC]; },

        "event_custom_emit": function(block, generator) {
            const eventName = generator.valueToCode(block, 'EVENT_NAME', generator.ORDER_ATOMIC) || "''";
            return `if (!global.botEmitter) { const EventEmitter = require('events'); global.botEmitter = new EventEmitter(); }\n` +
                   `global.botEmitter.emit(${eventName});\n`;
        },

        "event_custom_on": function(block, generator) {
            const eventName = generator.valueToCode(block, 'EVENT_NAME', generator.ORDER_ATOMIC) || "''";
            const innerCode = generator.statementToCode(block, 'STACK');
            return `if (!global.botEmitter) { const EventEmitter = require('events'); global.botEmitter = new EventEmitter(); }\n` +
                   `global.botEmitter.on(${eventName}, async () => {\n${innerCode}});\n\n`;
        }
    }
});

