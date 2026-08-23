/**
 * Discord Bot Builder (DBB) - Extension Native : Membres, Rôles & Permissions
 * Version : 1.6.0 (Actions unifiées, Permissions natives & Support des IDs)
 * Spécification : Discord.js v14
 */

DBB.registerExtension({
    id: "core_members_roles",
    name: "Membres & Rôles",
    color: "#e91e63", // Rose fuchsia

    blocks: [
        // ==========================================
        // 1. CIBLAGE DE SERVEURS
        // ==========================================
        {
            type: "discord_get_guild_by_id",
            message0: "obtenir le serveur via l'ID %1",
            args0: [{ type: "input_value", name: "GUILD_ID", check: ["String", "Number"] }],
            output: "Guild",
            colour: "#e91e63",
            tooltip: "Récupère un objet Serveur (Guild) du bot à partir de son identifiant unique."
        },

        // ==========================================
        // 2. GESTION DES ATTRIBUTIONS DE RÔLES
        // ==========================================
        {
            type: "member_add_role",
            message0: "sur le serveur %1 ajouter à l'ID utilisateur %2 le rôle (ID) %3",
            args0: [
                { type: "input_value", name: "GUILD", check: ["Guild", "String", "Number"] },
                { type: "input_value", name: "USER_ID", check: ["String", "Number"] },
                { type: "input_value", name: "ROLE_ID", check: ["String", "Number"] }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#e91e63",
            tooltip: "Ajoute un rôle à un membre via son ID sur le serveur spécifié."
        },
        {
            type: "member_remove_role",
            message0: "sur le serveur %1 retirer à l'ID utilisateur %2 le rôle (ID) %3",
            args0: [
                { type: "input_value", name: "GUILD", check: ["Guild", "String", "Number"] },
                { type: "input_value", name: "USER_ID", check: ["String", "Number"] },
                { type: "input_value", name: "ROLE_ID", check: ["String", "Number"] }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#e91e63",
            tooltip: "Retire un rôle à un membre via son ID sur le serveur spécifié."
        },
        {
            type: "member_has_role",
            message0: "sur le serveur %1 l'ID utilisateur %2 possède le rôle (ID) %3 ?",
            args0: [
                { type: "input_value", name: "GUILD", check: ["Guild", "String", "Number"] },
                { type: "input_value", name: "USER_ID", check: ["String", "Number"] },
                { type: "input_value", name: "ROLE_ID", check: ["String", "Number"] }
            ],
            output: "Boolean",
            colour: "#e91e63",
            tooltip: "Vérifie si un membre possède un rôle spécifique. Renvoie Vrai ou Faux."
        },

        // ==========================================
        // 3. SECURITE & PERMISSIONS CRITIQUES
        // ==========================================
        {
            type: "member_has_permission",
            message0: "sur le serveur %1 l'ID utilisateur %2 a la permission %3 ?",
            args0: [
                { type: "input_value", name: "GUILD", check: ["Guild", "String", "Number"] },
                { type: "input_value", name: "USER_ID", check: ["String", "Number"] },
                {
                    type: "field_dropdown",
                    name: "PERM",
                    options: [
                        ["Administrateur", "Administrator"],
                        ["Gérer le Serveur", "ManageGuild"],
                        ["Gérer les Rôles", "ManageRoles"],
                        ["Gérer les Salons", "ManageChannels"],
                        ["Exclure des membres (Kick)", "KickMembers"],
                        ["Bannir des membres (Ban)", "BanMembers"],
                        ["Gérer les Messages", "ManageMessages"],
                        ["Modérer les membres (Timeout)", "ModerateMembers"]
                    ]
                }
            ],
            output: "Boolean",
            colour: "#e91e63",
            tooltip: "Vérifie si un utilisateur dispose d'un droit de modération ou d'administration natif."
        },

        // ==========================================
        // 4. SANCTIONS & MODÉRATION (PAR ID SÉCURISÉ)
        // ==========================================
        {
            type: "member_kick_by_id",
            message0: "sur le serveur %1 exclure (kick) l'ID %2 pour la raison %3",
            args0: [
                { type: "input_value", name: "GUILD", check: ["Guild", "String", "Number"] },
                { type: "input_value", name: "USER_ID", check: ["String", "Number"] },
                { type: "input_value", name: "REASON", check: "String" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#e91e63",
            tooltip: "Exclut définitivement un membre du serveur en utilisant uniquement son ID Discord."
        },
        {
            type: "member_ban_by_id",
            message0: "sur le serveur %1 bannir (ban) l'ID %2 supprimer %3 jours de messages pour la raison %4",
            args0: [
                { type: "input_value", name: "GUILD", check: ["Guild", "String", "Number"] },
                { type: "input_value", name: "USER_ID", check: ["String", "Number"] },
                { type: "input_value", name: "DAYS", check: "Number" },
                { type: "input_value", name: "REASON", check: "String" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#e91e63",
            tooltip: "Bannit un utilisateur du serveur par son ID et nettoie l'historique de ses messages."
        }
    ],

    generators: {
        // --- Outil de résolution d'objet Guild ---
        _resolveGuildCode: function(guildVar) {
            return `(typeof ${guildVar} === 'string' || typeof ${guildVar} === 'number' ? client.guilds.cache.get(String(${guildVar})) : ${guildVar})`;
        },

        // --- Obtenir serveur par ID ---
        "discord_get_guild_by_id": function(block, generator) {
            const guildId = generator.valueToCode(block, 'GUILD_ID', generator.ORDER_ATOMIC) || "''";
            const code = `client.guilds.cache.get(String(${guildId}))`;
            return [code, generator.ORDER_ATOMIC];
        },

        // --- Ajouter un rôle ---
        "member_add_role": function(block, generator) {
            const guildRaw = generator.valueToCode(block, 'GUILD', generator.ORDER_ATOMIC) || "null";
            const userId = generator.valueToCode(block, 'USER_ID', generator.ORDER_ATOMIC) || "''";
            const roleId = generator.valueToCode(block, 'ROLE_ID', generator.ORDER_ATOMIC) || "''";
            const targetGuild = this._resolveGuildCode(guildRaw);

            return `const guildObj_add = ${targetGuild};\n` +
                   `if (guildObj_add && guildObj_add.members) {\n` +
                   `  try {\n` +
                   `    const member = await guildObj_add.members.fetch(String(${userId}));\n` +
                   `    if (member) await member.roles.add(String(${roleId}));\n` +
                   `  } catch(err) {\n` +
                   `    console.error('[DBB Add Role Error]', err.message);\n` +
                   `  }\n` +
                   `}\n`;
        },

        // --- Retirer un rôle ---
        "member_remove_role": function(block, generator) {
            const guildRaw = generator.valueToCode(block, 'GUILD', generator.ORDER_ATOMIC) || "null";
            const userId = generator.valueToCode(block, 'USER_ID', generator.ORDER_ATOMIC) || "''";
            const roleId = generator.valueToCode(block, 'ROLE_ID', generator.ORDER_ATOMIC) || "''";
            const targetGuild = this._resolveGuildCode(guildRaw);

            return `const guildObj_rem = ${targetGuild};\n` +
                   `if (guildObj_rem && guildObj_rem.members) {\n` +
                   `  try {\n` +
                   `    const member = await guildObj_rem.members.fetch(String(${userId}));\n` +
                   `    if (member) await member.roles.remove(String(${roleId}));\n` +
                   `  } catch(err) {\n` +
                   `    console.error('[DBB Remove Role Error]', err.message);\n` +
                   `  }\n` +
                   `}\n`;
        },

        // --- Vérifier la possession d'un rôle ---
        "member_has_role": function(block, generator) {
            const guildRaw = generator.valueToCode(block, 'GUILD', generator.ORDER_ATOMIC) || "null";
            const userId = generator.valueToCode(block, 'USER_ID', generator.ORDER_ATOMIC) || "''";
            const roleId = generator.valueToCode(block, 'ROLE_ID', generator.ORDER_ATOMIC) || "''";
            const targetGuild = this._resolveGuildCode(guildRaw);

            const code = `await (async () => {\n` +
                         `  const guildObj = ${targetGuild};\n` +
                         `  if (!guildObj || !guildObj.members) return false;\n` +
                         `  try {\n` +
                         `    const member = await guildObj.members.fetch(String(${userId}));\n` +
                         `    return member ? member.roles.cache.has(String(${roleId})) : false;\n` +
                         `  } catch(e) { return false; }\n` +
                         `})()`;
            return [code, generator.ORDER_AWAIT || 0];
        },

        // --- Vérifier une Permission Native (Nouveau) ---
        "member_has_permission": function(block, generator) {
            const guildRaw = generator.valueToCode(block, 'GUILD', generator.ORDER_ATOMIC) || "null";
            const userId = generator.valueToCode(block, 'USER_ID', generator.ORDER_ATOMIC) || "''";
            const permissionSelected = block.getFieldValue('PERM');
            const targetGuild = this._resolveGuildCode(guildRaw);

            const code = `await (async () => {\n` +
                         `  const guildObj = ${targetGuild};\n` +
                         `  if (!guildObj || !guildObj.members) return false;\n` +
                         `  try {\n` +
                         `    const member = await guildObj.members.fetch(String(${userId}));\n` +
                         `    return member ? member.permissions.has("${permissionSelected}") : false;\n` +
                         `  } catch(e) { return false; }\n` +
                         `})()`;
            return [code, generator.ORDER_AWAIT || 0];
        },

        // --- Exclure (Kick par ID) ---
        "member_kick_by_id": function(block, generator) {
            const guildRaw = generator.valueToCode(block, 'GUILD', generator.ORDER_ATOMIC) || "null";
            const userId = generator.valueToCode(block, 'USER_ID', generator.ORDER_ATOMIC) || "''";
            const reason = generator.valueToCode(block, 'REASON', generator.ORDER_ATOMIC) || "'Aucune raison spécifiée'";
            const targetGuild = this._resolveGuildCode(guildRaw);

            return `const guildObj_kick = ${targetGuild};\n` +
                   `if (guildObj_kick && guildObj_kick.members) {\n` +
                   `  try {\n` +
                   `    const member = await guildObj_kick.members.fetch(String(${userId}));\n` +
                   `    if (member) await member.kick(${reason});\n` +
                   `  } catch(err) {\n` +
                   `    console.error('[DBB Kick Error]', err.message);\n` +
                   `  }\n` +
                   `}\n`;
        },

        // --- Bannir (Ban par ID) ---
        "member_ban_by_id": function(block, generator) {
            const guildRaw = generator.valueToCode(block, 'GUILD', generator.ORDER_ATOMIC) || "null";
            const userId = generator.valueToCode(block, 'USER_ID', generator.ORDER_ATOMIC) || "''";
            const days = generator.valueToCode(block, 'DAYS', generator.ORDER_ATOMIC) || "0";
            const reason = generator.valueToCode(block, 'REASON', generator.ORDER_ATOMIC) || "'Aucune raison spécifiée'";
            const targetGuild = this._resolveGuildCode(guildRaw);

            return `const guildObj_ban = ${targetGuild};\n` +
                   `if (guildObj_ban && guildObj_ban.bans) {\n` +
                   `  try {\n` +
                   `    await guildObj_ban.bans.create(String(${userId}), { deleteMessageSeconds: ${days} * 24 * 60 * 60, reason: ${reason} });\n` +
                   `  } catch(err) {\n` +
                   `    console.error('[DBB Ban Error]', err.message);\n` +
                   `  }\n` +
                   `}\n`;
        }
    }
});

