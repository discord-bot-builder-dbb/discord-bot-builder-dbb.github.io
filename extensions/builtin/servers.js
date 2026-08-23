{
    /**
     * Discord Bot Builder (DBB) - Extension Native : Gestion des Serveurs
     * Version : 1.6.0 (Rétrocompatibilité Totale incluse)
     * Spécification : Discord.js v14
     */

    DBB.registerExtension({
        id: "core_guilds_management",
        name: "Gestion Serveurs",
        color: "#1abc9c",

        blocks: [
            // ==========================================
            // 1. ACTIONS DE STRUCTURE & MODIFICATIONS
            // ==========================================
            {
                type: "guild_create",
                message0: "créer un nouveau serveur nommé %1",
                args0: [{ type: "input_value", name: "NAME", check: "String" }],
                output: "Guild",
                colour: "#1abc9c",
                tooltip: "Crée un nouveau serveur dont le bot est le propriétaire."
            },
            {
                type: "guild_edit_property",
                message0: "sur le serveur (Objet ou ID) %1 modifier le/la %2 pour %3",
                args0: [
                    { type: "input_value", name: "GUILD", check: ["Guild", "String", "Number"] },
                    {
                        type: "field_dropdown",
                        name: "PROPERTY",
                        options: [
                            ["nom", "NAME"],
                            ["description", "DESCRIPTION"],
                            ["icône (URL)", "ICON"],
                            ["bannière (URL)", "BANNER"]
                        ]
                    },
                    { type: "input_value", name: "VALUE", check: "String" }
                ],
                previousStatement: null,
                nextStatement: null,
                colour: "#1abc9c",
                tooltip: "Modifie dynamiquement les métadonnées et l'identité visuelle du serveur ciblé."
            },
            {
                type: "guild_transfer_ownership",
                message0: "sur le serveur (Objet ou ID) %1 transférer la propriété à l'ID utilisateur %2",
                args0: [
                    { type: "input_value", name: "GUILD", check: ["Guild", "String", "Number"] },
                    { type: "input_value", name: "USER_ID", check: "String" }
                ],
                previousStatement: null,
                nextStatement: null,
                colour: "#1abc9c",
                tooltip: "Transfère la propriété du serveur à un autre membre."
            },
            {
                type: "guild_leave",
                message0: "faire quitter le bot du serveur (Objet ou ID) %1",
                args0: [{ type: "input_value", name: "GUILD", check: ["Guild", "String", "Number"] }],
                previousStatement: null,
                nextStatement: null,
                colour: "#1abc9c",
                tooltip: "Force le bot à quitter le serveur spécifié de manière autonome."
            },
            {
                type: "guild_delete",
                message0: "supprimer définitivement le serveur (Objet ou ID) %1",
                args0: [{ type: "input_value", name: "GUILD", check: ["Guild", "String", "Number"] }],
                previousStatement: null,
                nextStatement: null,
                colour: "#1abc9c",
                tooltip: "Supprime définitivement le serveur spécifié (le bot doit en être le propriétaire légal)."
            },

            // ==========================================
            // 2. GESTION DES INVITATIONS AVANCÉES
            // ==========================================
            {
                type: "guild_create_invite",
                message0: "sur le serveur (Objet ou ID) %1 créer une invitation pour le salon (ID) %2 | Expire après : %3 sec (0 = jamais) | Max utilisations : %4 (0 = infini)",
                args0: [
                    { type: "input_value", name: "GUILD", check: ["Guild", "String", "Number"] },
                    { type: "input_value", name: "CHANNEL_ID", check: "String" },
                    { type: "input_value", name: "MAX_AGE", check: "Number" },
                    { type: "input_value", name: "MAX_USES", check: "Number" }
                ],
                output: "String",
                colour: "#1abc9c",
                tooltip: "Génère une URL d'invitation personnalisée."
            },

            // ==========================================
            // 3. RECHERCHES, REPORTERS ET COLLECTIONS
            // ==========================================
            {
                type: "guild_get_name_by_id",
                message0: "récupérer le nom du serveur via l'ID %1",
                args0: [{ type: "input_value", name: "GUILD_ID", check: ["String", "Number"] }],
                output: "String",
                colour: "#1abc9c",
                tooltip: "Retourne le nom textuel d'un serveur d'après son identifiant."
            },
            {
                type: "guild_get_id_by_name",
                message0: "récupérer l'ID du serveur par son nom %1",
                args0: [{ type: "input_value", name: "NAME", check: "String" }],
                output: "String",
                colour: "#1abc9c",
                tooltip: "Cherche un serveur par son nom exact."
            },
            {
                type: "guild_list_all",
                message0: "lister tous les serveurs du bot",
                args0: [],
                output: "Array",
                colour: "#1abc9c",
                tooltip: "Retourne un Tableau contenant tous les serveurs joints par l'application."
            },
            {
                type: "guild_extract_collection",
                message0: "sur le serveur (Objet ou ID) %1 extraire la liste complète des %2",
                args0: [
                    { type: "input_value", name: "GUILD", check: ["Guild", "String", "Number"] },
                    {
                        type: "field_dropdown",
                        name: "COLLECTION",
                        options: [
                            ["salons / canaux", "CHANNELS"],
                            ["rôles", "ROLES"],
                            ["émojis personnalisés", "EMOJIS"],
                            ["membres (en cache)", "MEMBERS"]
                        ]
                    }
                ],
                output: "Array",
                colour: "#1abc9c",
                tooltip: "Extrait et transforme les caches Discord.js en tableaux manipulables (Array d'objets)."
            },

            // ==========================================
            // 4. STATISTIQUES, NIVEAUX ET COMPTEURS
            // ==========================================
            {
                type: "guild_get_member_count",
                message0: "sur le serveur (Objet ou ID) %1 compter les membres de type %2",
                args0: [
                    { type: "input_value", name: "GUILD", check: ["Guild", "String", "Number"] },
                    {
                        type: "field_dropdown",
                        name: "TYPE",
                        options: [
                            ["Total (Humains + Bots)", "TOTAL"],
                            ["Humains uniquement", "HUMANS"],
                            ["Bots uniquement", "BOTS"]
                        ]
                    }
                ],
                output: "Number",
                colour: "#1abc9c",
                tooltip: "Analyse le serveur spécifié pour retourner le nombre exact d'utilisateurs."
            },
            {
                type: "guild_get_boost_metrics",
                message0: "sur le serveur (Objet ou ID) %1 obtenir le %2",
                args0: [
                    { type: "input_value", name: "GUILD", check: ["Guild", "String", "Number"] },
                    {
                        type: "field_dropdown",
                        name: "METRIC",
                        options: [
                            ["nombre total de boosts", "COUNT"],
                            ["niveau de serveur (Tier 0-3)", "TIER"]
                        ]
                    }
                ],
                output: "Number",
                colour: "#1abc9c",
                tooltip: "Récupère les informations d'éligibilité Premium/Boost du serveur."
            }
        ],

        generators: {
            "guild_create": function(block, generator) {
                const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || "'Nouveau Serveur'";
                const code = `await (async () => {\n` +
                             `  if (!global.client) return null;\n` +
                             `  try {\n` +
                             `    return await global.client.guilds.create({ name: ${name} });\n` +
                             `  } catch(err) {\n` +
                             `    console.error('[DBB Guild Create Error]', err.message);\n` +
                             `    return null;\n` +
                             `  }\n` +
                             `})()`;
                return [code, generator.ORDER_AWAIT || 0];
            },

            "guild_edit_property": function(block, generator) {
                let guildInput = generator.valueToCode(block, 'GUILD', generator.ORDER_ATOMIC) || "null";
                const property = block.getFieldValue('PROPERTY');
                const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || "''";

                return `await (async () => {\n` +
                       `  if (!global.client) return;\n` +
                       `  let targetGuild = ${guildInput};\n` +
                       `  if (targetGuild !== null && typeof targetGuild !== 'object') targetGuild = String(targetGuild);\n` +
                       `  if (typeof targetGuild === 'string') targetGuild = global.client.guilds.cache.get(targetGuild) || null;\n` +
                       `  if (!targetGuild) return;\n` +
                       `  try {\n` +
                       `    if ('${property}' === 'NAME') await targetGuild.setName(${value});\n` +
                       `    if ('${property}' === 'DESCRIPTION') await targetGuild.setDescription(${value});\n` +
                       `    if ('${property}' === 'ICON') await targetGuild.setIcon(${value});\n` +
                       `    if ('${property}' === 'BANNER') await targetGuild.setBanner(${value});\n` +
                       `  } catch(err) {\n` +
                       `    console.error('[DBB Guild Edit Error]', err.message);\n` +
                       `  }\n` +
                       `})();\n`;
            },

            "guild_transfer_ownership": function(block, generator) {
                let guildInput = generator.valueToCode(block, 'GUILD', generator.ORDER_ATOMIC) || "null";
                const userId = generator.valueToCode(block, 'USER_ID', generator.ORDER_ATOMIC) || "''";

                return `await (async () => {\n` +
                       `  if (!global.client) return;\n` +
                       `  let targetGuild = ${guildInput};\n` +
                       `  if (targetGuild !== null && typeof targetGuild !== 'object') targetGuild = String(targetGuild);\n` +
                       `  if (typeof targetGuild === 'string') targetGuild = global.client.guilds.cache.get(targetGuild) || null;\n` +
                       `  if (targetGuild && typeof targetGuild.setOwner === 'function') {\n` +
                       `    try {\n` +
                       `      await targetGuild.setOwner(${userId});\n` +
                       `    } catch(err {\n` +
                       `      console.error('[DBB Guild Transfer Error]', err.message);\n` +
                       `    }\n` +
                       `  }\n` +
                       `})();\n`;
            },

            "guild_leave": function(block, generator) {
                let guildInput = generator.valueToCode(block, 'GUILD', generator.ORDER_ATOMIC) || "null";

                return `await (async () => {\n` +
                       `  if (!global.client) return;\n` +
                       `  let targetGuild = ${guildInput};\n` +
                       `  if (targetGuild !== null && typeof targetGuild !== 'object') targetGuild = String(targetGuild);\n` +
                       `  if (typeof targetGuild === 'string') targetGuild = global.client.guilds.cache.get(targetGuild) || null;\n` +
                       `  if (targetGuild && typeof targetGuild.leave === 'function') {\n` +
                       `    try {\n` +
                       `      await targetGuild.leave();\n` +
                       `    } catch(err) {\n` +
                       `      console.error('[DBB Guild Leave Error]', err.message);\n` +
                       `    }\n` +
                       `  }\n` +
                       `})();\n`;
            },

            "guild_delete": function(block, generator) {
                let guildInput = generator.valueToCode(block, 'GUILD', generator.ORDER_ATOMIC) || "null";

                return `await (async () => {\n` +
                       `  if (!global.client) return;\n` +
                       `  let targetGuild = ${guildInput};\n` +
                       `  if (targetGuild !== null && typeof targetGuild !== 'object') targetGuild = String(targetGuild);\n` +
                       `  if (typeof targetGuild === 'string') targetGuild = global.client.guilds.cache.get(targetGuild) || null;\n` +
                       `  if (targetGuild && typeof targetGuild.delete === 'function') {\n` +
                       `    try {\n` +
                       `      await targetGuild.delete();\n` +
                       `    } catch(err) {\n` +
                       `      console.error('[DBB Guild Delete Error]', err.message);\n` +
                       `    }\n` +
                       `  }\n` +
                       `})();\n`;
            },

            "guild_create_invite": function(block, generator) {
                let guildInput = generator.valueToCode(block, 'GUILD', generator.ORDER_ATOMIC) || "null";
                const channelId = generator.valueToCode(block, 'CHANNEL_ID', generator.ORDER_ATOMIC) || "''";
                const maxAge = generator.valueToCode(block, 'MAX_AGE', generator.ORDER_ATOMIC) || "0";
                const maxUses = generator.valueToCode(block, 'MAX_USES', generator.ORDER_ATOMIC) || "0";

                const code = `await (async () => {\n` +
                             `  if (!global.client) return '';\n` +
                             `  let targetGuild = ${guildInput};\n` +
                             `  if (targetGuild !== null && typeof targetGuild !== 'object') targetGuild = String(targetGuild);\n` +
                             `  if (typeof targetGuild === 'string') targetGuild = global.client.guilds.cache.get(targetGuild) || null;\n` +
                             `  if (!targetGuild) return '';\n` +
                             `  try {\n` +
                             `    const channel = await targetGuild.channels.fetch(${channelId});\n` +
                             `    if (channel && typeof channel.createInvite === 'function') {\n` +
                             `      const invite = await channel.createInvite({\n` +
                             `        maxAge: parseInt(${maxAge}),\n` +
                             `        maxUses: parseInt(${maxUses})\n` +
                             `      });\n` +
                             `      return invite ? invite.url : '';\n` +
                             `    }\n` +
                             `  } catch(err) {\n` +
                             `    console.error('[DBB Invite Create Error]', err.message);\n` +
                             `  }\n` +
                             `  return '';\n` +
                             `})()`;
                return [code, generator.ORDER_AWAIT || 0];
            },

            "guild_get_name_by_id": function(block, generator) {
                const guildId = generator.valueToCode(block, 'GUILD_ID', generator.ORDER_ATOMIC) || "''";
                const code = `(() => {\n` +
                             `  const g = global.client ? global.client.guilds.cache.get(String(${guildId})) : null;\n` +
                             `  return g ? g.name : '';\n` +
                             `})()`;
                return [code, generator.ORDER_ATOMIC];
            },

            "guild_get_id_by_name": function(block, generator) {
                const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || "''";
                const code = `(() => {\n` +
                             `  if (!global.client) return '';\n` +
                             `  const g = global.client.guilds.cache.find(guild => guild.name === ${name});\n` +
                             `  return g ? g.id : '';\n` +
                             `})()`;
                return [code, generator.ORDER_ATOMIC];
            },

            "guild_list_all": function(block, generator) {
                const code = `(global.client ? Array.from(global.client.guilds.cache.values()) : [])`;
                return [code, generator.ORDER_ATOMIC];
            },

            "guild_extract_collection": function(block, generator) {
                let guildInput = generator.valueToCode(block, 'GUILD', generator.ORDER_ATOMIC) || "null";
                const collection = block.getFieldValue('COLLECTION');

                const code = `(() => {\n` +
                             `  if (!global.client) return [];\n` +
                             `  let targetGuild = ${guildInput};\n` +
                             `  if (targetGuild !== null && typeof targetGuild !== 'object') targetGuild = String(targetGuild);\n` +
                             `  if (typeof targetGuild === 'string') targetGuild = global.client.guilds.cache.get(targetGuild) || null;\n` +
                             `  if (!targetGuild) return [];\n` +
                             `  \n` +
                             `  if ('${collection}' === 'CHANNELS') return Array.from(targetGuild.channels.cache.values());\n` +
                             `  if ('${collection}' === 'ROLES') return Array.from(targetGuild.roles.cache.values());\n` +
                             `  if ('${collection}' === 'EMOJIS') return Array.from(targetGuild.emojis.cache.values());\n` +
                             `  if ('${collection}' === 'MEMBERS') return Array.from(targetGuild.members.cache.values());\n` +
                             `  return [];\n` +
                             `})()`;
                return [code, generator.ORDER_ATOMIC];
            },

            "guild_get_member_count": function(block, generator) {
                let guildInput = generator.valueToCode(block, 'GUILD', generator.ORDER_ATOMIC) || "null";
                const type = block.getFieldValue('TYPE');

                const code = `(() => {\n` +
                             `  if (!global.client) return 0;\n` +
                             `  let targetGuild = ${guildInput};\n` +
                             `  if (targetGuild !== null && typeof targetGuild !== 'object') targetGuild = String(targetGuild);\n` + 
                             `  if (typeof targetGuild === 'string') targetGuild = global.client.guilds.cache.get(targetGuild) || null;\n` + 
                             `  if (!targetGuild) return 0;\n` +
                             `  \n` +
                             `  if ('${type}' === 'TOTAL') return targetGuild.memberCount || 0;\n` +
                             `  if ('${type}' === 'HUMANS') return targetGuild.members ? targetGuild.members.cache.filter(m => !m.user.bot).size : 0;\n` +
                             `  if ('${type}' === 'BOTS') return targetGuild.members ? targetGuild.members.cache.filter(m => m.user.bot).size : 0;\n` +
                             `  return 0;\n` +
                             `})()`;
                return [code, generator.ORDER_ATOMIC];
            },

            "guild_get_boost_metrics": function(block, generator) {
                let guildInput = generator.valueToCode(block, 'GUILD', generator.ORDER_ATOMIC) || "null";
                const metric = block.getFieldValue('METRIC');

                const code = `(() => {\n` +
                             `  if (!global.client) return 0;\n` +
                             `  let targetGuild = ${guildInput};\n` +
                             `  if (targetGuild !== null && typeof targetGuild !== 'object') targetGuild = String(targetGuild);\n` +
                             `  if (typeof targetGuild === 'string') targetGuild = global.client.guilds.cache.get(targetGuild) || null;\n` +
                             `  if (!targetGuild) return 0;\n` +
                             `  \n` +
                             `  if ('${metric}' === 'COUNT') return targetGuild.premiumSubscriptionCount || 0;\n` +
                             `  if ('${metric}' === 'TIER') {\n` +
                             `    const tier = targetGuild.premiumTier;\n` +
                             `    if (tier === 'NONE' || tier === 0) return 0;\n` +
                             `    if (tier === 'TIER_1' || tier === 1) return 1;\n` +
                             `    if (tier === 'TIER_2' || tier === 2) return 2;\n` +
                             `    if (tier === 'TIER_3' || tier === 3) return 3;\n` +
                             `  }\n` +
                             `  return 0;\n` +
                             `})()`;
                return [code, generator.ORDER_ATOMIC];
            }
        }
    });
}

