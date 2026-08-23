/**
 * Discord Bot Builder (DBB) - Extension Native : Sécurité & Cryptographie
 * Version : 1.0.0 (Gestion .env, Hachage & Chiffrage Symétrique)
 */

DBB.registerExtension({
    id: "core_security",
    name: "Sécurité & Crypto",
    color: "#7f8c8d", // Gris blindé / Sécurité
    
    blocks: [
        // ==========================================
        // 1. ENVIRONNEMENT & VARIABLES CACHÉES (.ENV)
        // ==========================================
        {
            type: "security_get_env",
            message0: "obtenir la variable secrète (.env) nommée %1",
            args0: [{ type: "field_input", name: "VAR_NAME", text: "DISCORD_TOKEN" }],
            output: "String",
            colour: "#7f8c8d",
            tooltip: "Récupère une clé configurée en toute sécurité dans le fichier .env (process.env) pour éviter de l'afficher dans le code."
        },

        // ==========================================
        // 2. CRYPTOGRAPHIE - HACHAGE (IRRÉVERSIBLE)
        // ==========================================
        {
            type: "security_hash",
            message0: "hacher le texte %1 avec l'algorithme %2",
            args0: [
                { type: "input_value", name: "TEXT", check: "String" },
                {
                    type: "field_dropdown",
                    name: "ALGO",
                    options: [["SHA-256 (Recommandé)", "sha256"], ["SHA-512 (Ultra-Sécurisé)", "sha512"], ["MD5 (Hérité/Rapide)", "md5"]]
                }
            ],
            output: "String",
            colour: "#7f8c8d",
            tooltip: "Génère une empreinte numérique unique et irréversible (idéal pour vérifier un mot de passe)."
        },

        // ==========================================
        // 3. CHIFFREMENT SYMÉTRIQUE (RÉVERSIBLE)
        // ==========================================
        {
            type: "security_encrypt",
            message0: "chiffrer le texte %1 avec la clé secrète %2 (AES-256-GCM)",
            args0: [
                { type: "input_value", name: "TEXT", check: "String" },
                { type: "input_value", name: "KEY", check: "String" }
            ],
            output: "String",
            colour: "#7f8c8d",
            tooltip: "Chiffre un texte de manière réversible. La clé doit faire idéalement 32 caractères."
        },
        {
            type: "security_decrypt",
            message0: "déchiffrer le texte crypté %1 avec la clé secrète %2",
            args0: [
                { type: "input_value", name: "CIPHER", check: "String" },
                { type: "input_value", name: "KEY", check: "String" }
            ],
            output: "String",
            colour: "#7f8c8d",
            tooltip: "Restaure le texte d'origine à partir d'une chaîne chiffrée. Renvoie une chaîne vide en cas de mauvaise clé."
        }
    ],

    generators: {
        // --- Récupération .env ---
        "security_get_env": function(block, generator) {
            const varName = block.getFieldValue('VAR_NAME').trim().replace(/[^a-zA-Z0-9_]/g, '');
            // require('dotenv').config() est appelé de manière transparente au chargement global
            return [`process.env.${varName}`, generator.ORDER_ATOMIC];
        },

        // --- Hachage ---
        "security_hash": function(block, generator) {
            const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
            const algo = block.getFieldValue('ALGO');

            const code = `require('crypto').createHash('${algo}').update(${text}).digest('hex')`;
            return [code, generator.ORDER_ATOMIC];
        },

        // --- Chiffrement AES-256-GCM Évolué (Format d'export : iv:authTag:encryptedData) ---
        "security_encrypt": function(block, generator) {
            const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
            const keyStr = generator.valueToCode(block, 'KEY', generator.ORDER_ATOMIC) || "''";

            const code = `(() => {
                try {
                    const crypto = require('crypto');
                    // On s'assure que la clé fait exactement 32 octets (exigence AES-256) via un hachage sha256 sous-jacent
                    const secretKey = crypto.createHash('sha256').update(String(${keyStr})).digest();
                    const iv = crypto.randomBytes(12); // IV standard pour GCM
                    
                    const cipher = crypto.createCipheriv('aes-256-gcm', secretKey, iv);
                    let encrypted = cipher.update(${text}, 'utf8', 'hex');
                    encrypted += cipher.final('hex');
                    
                    const authTag = cipher.getAuthTag().toString('hex');
                    
                    // On assemble les composants séparés par des deux-points pour une sauvegarde facile en DB/Fichier
                    return \`\${iv.toString('hex')}:\${authTag}:\${encrypted}\`;
                } catch (err) {
                    console.error('[DBB Crypto Encrypt Error]', err.message);
                    return '';
                }
            })()`;
            return [code, generator.ORDER_ATOMIC];
        },

        // --- Déchiffrement AES-256-GCM ---
        "security_decrypt": function(block, generator) {
            const cipherText = generator.valueToCode(block, 'CIPHER', generator.ORDER_ATOMIC) || "''";
            const keyStr = generator.valueToCode(block, 'KEY', generator.ORDER_ATOMIC) || "''";

            const code = `(() => {
                try {
                    const crypto = require('crypto');
                    const parts = String(${cipherText}).split(':');
                    if (parts.length !== 3) return '';
                    
                    const iv = Buffer.from(parts[0], 'hex');
                    const authTag = Buffer.from(parts[1], 'hex');
                    const encryptedData = parts[2];
                    
                    const secretKey = crypto.createHash('sha256').update(String(${keyStr})).digest();
                    const decipher = crypto.createDecipheriv('aes-256-gcm', secretKey, iv);
                    decipher.setAuthTag(authTag);
                    
                    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
                    decrypted += decipher.final('utf8');
                    return decrypted;
                } catch (err) {
                    // Si la clé est mauvaise ou si les données ont été altérées, GCM lève une erreur : on la capture proprement
                    return '';
                }
            })()`;
            return [code, generator.ORDER_ATOMIC];
        }
    }
});
