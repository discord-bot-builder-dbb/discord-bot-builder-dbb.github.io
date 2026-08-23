/**
 * Discord Bot Builder (DBB) - Extension Native : Interactions
 * Version : 2.0.0 (Version Compacte & Unifiée - Spécification Discord.js v14)
 */

DBB.registerExtension({
    id: "core_interactions",
    name: "Interactions",
    color: "#2e7dff", 
    blocks: [
        // --- 0. CONSTRUCTEUR DE COMMANDES SLASH ---
        {
            type: "interaction_create_command",
            message0: "Créer la commande slash / %1 Description: %2 %3 Options: %4",
            args0: [
                { type: "field_input", name: "CMD_NAME", text: "ping" },
                { type: "field_input", name: "CMD_DESC", text: "Répond avec pong" },
                { type: "input_dummy" },
                { type: "input_statement", name: "OPTIONS" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#2e7dff",
            tooltip: "Enregistre une nouvelle commande Slash sur Discord."
        },
        
        // --- BLOC D'OPTION UNIFIÉ (MENU DÉROULANT) ---
        {
            type: "interaction_add_option",
            message0: "ajouter option %1 nommée %2 Description: %3 Obligatoire ? %4",
            args0: [
                { 
                    type: "field_dropdown", 
                    name: "OPT_TYPE", 
                    options: [
                        ["texte", "3"],
                        ["nombre entier", "4"],
                        ["nombre décimal", "10"],
                        ["booléen", "5"],
                        ["membre", "6"],
                        ["salon", "7"],
                        ["rôle", "8"],
                        ["mentionnable", "9"],
                        ["fichier (file input)", "11"]
                    ] 
                },
                { type: "field_input", name: "OPT_NAME", text: "argument" },
                { type: "field_input", name: "OPT_DESC", text: "Description de l'argument" },
                { type: "field_checkbox", name: "REQUIRED", checked: "FALSE" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#2e7dff",
            tooltip: "Ajoute un argument configuré à la commande Slash."
        },

        // --- 1. RÉPONSES, ÉDITIONS & EMBEDS ---
        {
            type: "interaction_reply",
            message0: "répondre à l'interaction avec le texte : %1",
            args0: [{ type: "input_value", name: "RESPONSE_TEXT", check: "String" }],
            previousStatement: null,
            nextStatement: null,
            colour: "#2e7dff"
        },
        {
            type: "interaction_reply_ephemeral",
            message0: "répondre secrètement (éphémère) : %1",
            args0: [{ type: "input_value", name: "RESPONSE_TEXT", check: "String" }],
            previousStatement: null,
            nextStatement: null,
            colour: "#2e7dff"
        },
        {
            type: "interaction_update",
            message0: "mettre à jour le composant (éditer) avec le texte : %1",
            args0: [{ type: "input_value", name: "UPDATE_TEXT", check: "String" }],
            previousStatement: null,
            nextStatement: null,
            colour: "#2e7dff"
        },
        {
            type: "interaction_reply_embed",
            message0: "répondre avec un Embed %1 Titre: %2 Description: %3 Couleur Hex: %4",
            args0: [
                { type: "input_dummy" },
                { type: "input_value", name: "EMBED_TITLE", check: "String" },
                { type: "input_value", name: "EMBED_DESC", check: "String" },
                { type: "field_input", name: "EMBED_COLOR", text: "#2e7dff" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#2e7dff"
        },

        // --- 2. ENVOI DE COMPOSANTS ---
        {
            type: "interaction_send_with_button",
            message0: "répondre avec le texte %1 et un bouton %2 libellé %3 (ID: %4) Émoji: %5",
            args0: [
                { type: "input_value", name: "TEXT", check: "String" },
                { type: "field_dropdown", name: "BTN_STYLE", options: [["Bleu (Primary)", "Primary"], ["Vert (Success)", "Success"], ["Gris (Secondary)", "Secondary"], ["Rouge (Danger)", "Danger"]] },
                { type: "input_value", name: "BTN_LABEL", check: "String" },
                { type: "field_input", name: "BTN_ID", text: "bouton_1" },
                { type: "field_input", name: "BTN_EMOJI", text: "⚙️" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#2e7dff"
        },
        {
            type: "interaction_send_select_menu",
            message0: "répondre avec le texte %1 et un menu (ID: %2) Texte indicatif: %3 Options (séparées par des virgules) : %4",
            args0: [
                { type: "input_value", name: "TEXT", check: "String" },
                { type: "field_input", name: "MENU_ID", text: "menu_1" },
                { type: "field_input", name: "MENU_PLACEHOLDER", text: "Choisissez une option..." },
                { type: "field_input", name: "OPTIONS", text: "Option A, Option B, Option C" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#2e7dff"
        },

        // --- 3. FORMULAIRES (MODALS) ---
        {
            type: "interaction_show_modal",
            message0: "afficher un formulaire (ID: %1) Titre: %2 Question: %3 (ID Champ: %4)",
            args0: [
                { type: "field_input", name: "MODAL_ID", text: "form_1" },
                { type: "field_input", name: "MODAL_TITLE", text: "Mon Formulaire" },
                { type: "field_input", name: "INPUT_LABEL", text: "Votre réponse ?" },
                { type: "field_input", name: "INPUT_ID", text: "champ_1" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#2e7dff"
        },

        // --- 4. FILTRES ET CAPTEURS ---
        { type: "interaction_is_command", message0: "l'interaction est la commande slash %1 ?", args0: [{ type: "field_input", name: "CMD_NAME", text: "ping" }], output: "Boolean", colour: "#2e7dff" },
        { type: "interaction_is_button", message0: "l'interaction est un clic sur le bouton %1 ?", args0: [{ type: "field_input", name: "BTN_ID", text: "bouton_1" }], output: "Boolean", colour: "#2e7dff" },
        { type: "interaction_is_menu", message0: "l'interaction est un choix dans le menu %1 ?", args0: [{ type: "field_input", name: "MENU_ID", text: "menu_1" }], output: "Boolean", colour: "#2e7dff" },
        { type: "interaction_is_modal", message0: "l'interaction est la validation du formulaire %1 ?", args0: [{ type: "field_input", name: "MODAL_ID", text: "form_1" }], output: "Boolean", colour: "#2e7dff" },

        // --- 5. COLLECTEURS UNIFIÉS OU SPÉCIFIQUES ---
        { type: "interaction_get_menu_value", message0: "valeur sélectionnée dans le menu", output: "String", colour: "#2e7dff" },
        { type: "interaction_get_modal_value", message0: "valeur saisie dans le champ %1 du formulaire", args0: [{ type: "field_input", name: "INPUT_ID", text: "champ_1" }], output: "String", colour: "#2e7dff" },
        
        // Collecteurs individuels d'options selon le besoin de sortie Blockly (String, Number, User, etc.)
        { type: "interaction_get_string_option", message0: "lire l'option texte nommée %1", args0: [{ type: "field_input", name: "OPT_NAME", text: "raison" }], output: "String", colour: "#2e7dff" },
        { type: "interaction_get_number_option", message0: "lire l'option nombre nommée %1", args0: [{ type: "field_input", name: "OPT_NAME", text: "quantite" }], output: "Number", colour: "#2e7dff" },
        { type: "interaction_get_boolean_option", message0: "lire l'option booléen nommée %1", args0: [{ type: "field_input", name: "OPT_NAME", text: "choix" }], output: "Boolean", colour: "#2e7dff" },
        { type: "interaction_get_user_option", message0: "lire l'option membre nommée %1", args0: [{ type: "field_input", name: "OPT_NAME", text: "membre" }], output: "User", colour: "#2e7dff" },
        { type: "interaction_get_file_option", message0: "lire l'option fichier nommée %1", args0: [{ type: "field_input", name: "OPT_NAME", text: "fichier" }], output: "Attachment", colour: "#2e7dff" }
    ],
    generators: {
        "interaction_create_command": function(block, generator) {
            const name = block.getFieldValue('CMD_NAME').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
            const desc = block.getFieldValue('CMD_DESC').replace(/'/g, "\\'");
            const options = generator.statementToCode(block, 'OPTIONS') || "";
            return `if (!client.slashCommandsData) client.slashCommandsData = [];\n{\n  const cmdData = { name: '${name}', description: '${desc}', options: [] };\n${options}  client.slashCommandsData.push(cmdData);\n}\n`;
        },
        "interaction_add_option": function(block, generator) {
            const type = parseInt(block.getFieldValue('OPT_TYPE'), 10);
            const name = block.getFieldValue('OPT_NAME').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
            const desc = block.getFieldValue('OPT_DESC').replace(/'/g, "\\'");
            const required = block.getFieldValue('REQUIRED') === 'TRUE';
            return `  cmdData.options.push({ type: ${type}, name: '${name}', description: '${desc}', required: ${required} });\n`;
        },
        "interaction_reply": function(block, generator) { const text = generator.valueToCode(block, 'RESPONSE_TEXT', generator.ORDER_ATOMIC) || "''"; return `if (interaction && interaction.isRepliable()) await interaction.reply({ content: ${text} });\n`; },
        "interaction_reply_ephemeral": function(block, generator) { const text = generator.valueToCode(block, 'RESPONSE_TEXT', generator.ORDER_ATOMIC) || "''"; return `if (interaction && interaction.isRepliable()) await interaction.reply({ content: ${text}, flags: [64] });\n`; },
        "interaction_update": function(block, generator) { const text = generator.valueToCode(block, 'UPDATE_TEXT', generator.ORDER_ATOMIC) || "''"; return `if (interaction && interaction.isMessageComponent()) await interaction.update({ content: ${text} });\n`; },
        "interaction_reply_embed": function(block, generator) { const title = generator.valueToCode(block, 'EMBED_TITLE', generator.ORDER_ATOMIC) || "''"; const desc = generator.valueToCode(block, 'EMBED_DESC', generator.ORDER_ATOMIC) || "''"; const color = block.getFieldValue('EMBED_COLOR').replace('#', '0x'); return `if (interaction && interaction.isRepliable()) {\n  const { EmbedBuilder } = require('discord.js');\n  const embed = new EmbedBuilder().setTitle(${title} || null).setDescription(${desc} || null).setColor(${isNaN(color) ? '0x2e7dff' : color});\n  await interaction.reply({ embeds: [embed] });\n}\n`; },
        "interaction_send_with_button": function(block, generator) { const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''"; const btnStyle = block.getFieldValue('BTN_STYLE'); const btnLabel = generator.valueToCode(block, 'BTN_LABEL', generator.ORDER_ATOMIC) || "'Clic'"; const btnId = block.getFieldValue('BTN_ID').replace(/[^a-zA-Z0-9_]/g, ''); const emoji = block.getFieldValue('BTN_EMOJI').trim(); return `if (interaction && interaction.isRepliable()) {\n  const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');\n  const button = new ButtonBuilder().setCustomId('${btnId}').setLabel(${btnLabel}).setStyle(ButtonStyle.${btnStyle});\n  if ('${emoji}') button.setEmoji('${emoji}');\n  const row = new ActionRowBuilder().addComponents(button);\n  await interaction.reply({ content: ${text}, components: [row] });\n}\n`; },
        "interaction_send_select_menu": function(block, generator) { const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''"; const menuId = block.getFieldValue('MENU_ID').replace(/[^a-zA-Z0-9_]/g, ''); const placeholder = block.getFieldValue('MENU_PLACEHOLDER'); const rawOptions = block.getFieldValue('OPTIONS') || ''; const optionsArrayJson = JSON.stringify(rawOptions.split(',').map((opt, idx) => ({ label: opt.trim(), value: 'val_' + idx + '_' + opt.trim().toLowerCase().replace(/[^a-z0-9]/g, '') })).filter(o => o.label.length > 0)); return `if (interaction && interaction.isRepliable()) {\n  const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');\n  const menu = new StringSelectMenuBuilder().setCustomId('${menuId}').setPlaceholder('${placeholder.replace(/'/g, "\\'")}').addOptions(${optionsArrayJson});\n  const row = new ActionRowBuilder().addComponents(menu);\n  await interaction.reply({ content: ${text}, components: [row] });\n}\n`; },
        "interaction_show_modal": function(block, generator) { const modalId = block.getFieldValue('MODAL_ID').replace(/[^a-zA-Z0-9_]/g, ''); const title = block.getFieldValue('MODAL_TITLE'); const label = block.getFieldValue('INPUT_LABEL'); const inputId = block.getFieldValue('INPUT_ID').replace(/[^a-zA-Z0-9_]/g, ''); return `if (interaction && !interaction.replied) {\n  const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');\n  const modal = new ModalBuilder().setCustomId('${modalId}').setTitle('${title.replace(/'/g, "\\'")}');\n  const textInput = new TextInputBuilder().setCustomId('${inputId}').setLabel('${label.replace(/'/g, "\\'")}').setStyle(TextInputStyle.Paragraph);\n  const row = new ActionRowBuilder().addComponents(textInput);\n  modal.addComponents(row);\n  await interaction.showModal(modal);\n}\n`; },
        "interaction_is_command": function(block, generator) { const cmdName = block.getFieldValue('CMD_NAME').trim().toLowerCase(); return [`(interaction && interaction.isChatInputCommand() && interaction.commandName === '${cmdName}')`, generator.ORDER_ATOMIC]; },
        "interaction_is_button": function(block, generator) { const btnId = block.getFieldValue('BTN_ID').replace(/[^a-zA-Z0-9_]/g, ''); return [`(interaction && interaction.isButton() && interaction.customId === '${btnId}')`, generator.ORDER_ATOMIC]; },
        "interaction_is_menu": function(block, generator) { const menuId = block.getFieldValue('MENU_ID').replace(/[^a-zA-Z0-9_]/g, ''); return [`(interaction && interaction.isStringSelectMenu() && interaction.customId === '${menuId}')`, generator.ORDER_ATOMIC]; },
        "interaction_is_modal": function(block, generator) { const modalId = block.getFieldValue('MODAL_ID').replace(/[^a-zA-Z0-9_]/g, ''); return [`(interaction && interaction.isModalSubmit() && interaction.customId === '${modalId}')`, generator.ORDER_ATOMIC]; },
        "interaction_get_menu_value": function(block, generator) { return [`(interaction && interaction.isStringSelectMenu() ? interaction.values[0] : '')`, generator.ORDER_ATOMIC]; },
        "interaction_get_modal_value": function(block, generator) { const inputId = block.getFieldValue('INPUT_ID').replace(/[^a-zA-Z0-9_]/g, ''); return [`(interaction && interaction.isModalSubmit() ? interaction.fields.getTextInputValue('${inputId}') : '')`, generator.ORDER_ATOMIC]; },
        "interaction_get_string_option": function(block, generator) { const optName = block.getFieldValue('OPT_NAME').trim().toLowerCase(); return [`(interaction && interaction.isChatInputCommand() ? (interaction.options.getString('${optName}') || '') : '')`, generator.ORDER_ATOMIC]; },
        "interaction_get_number_option": function(block, generator) { const optName = block.getFieldValue('OPT_NAME').trim().toLowerCase(); return [`(interaction && interaction.isChatInputCommand() ? (interaction.options.getNumber('${optName}') || 0) : 0)`, generator.ORDER_ATOMIC]; },
        "interaction_get_boolean_option": function(block, generator) { const optName = block.getFieldValue('OPT_NAME').trim().toLowerCase(); return [`(interaction && interaction.isChatInputCommand() ? interaction.options.getBoolean('${optName}') : false)`, generator.ORDER_ATOMIC]; },
        "interaction_get_user_option": function(block, generator) { const optName = block.getFieldValue('OPT_NAME').trim().toLowerCase(); return [`(interaction && interaction.isChatInputCommand() ? interaction.options.getUser('${optName}') : null)`, generator.ORDER_ATOMIC]; },
        "interaction_get_file_option": function(block, generator) { const optName = block.getFieldValue('OPT_NAME').trim().toLowerCase(); return [`(interaction && interaction.isChatInputCommand() ? interaction.options.getAttachment('${optName}') : null)`, generator.ORDER_ATOMIC]; }
    }
});

