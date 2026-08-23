/**
 * Discord Bot Builder (DBB) - Extension Native : Gestion des Fichiers
 * Version : 1.1.0 (Texte, Données Binaires, Base64, Archives ZIP & Convertisseurs d'encodage)
 */

DBB.registerExtension({
    id: "core_files",
    name: "Fichiers & Archives",
    color: "#e67e22", // Couleur orange chaud / cuir pour évoquer les dossiers et le stockage
    
    blocks: [
        // ==========================================
        // 1. LECTURE ET ÉCRITURE STANDARD (TEXTE / BASE64)
        // ==========================================
        
        // Écrire ou Créer un fichier
        {
            type: "file_write_stable",
            message0: "écrire dans le fichier %1 le contenu %2 avec l'encodage %3",
            args0: [
                { type: "input_value", name: "PATH", check: "String" },
                { type: "input_value", name: "CONTENT" },
                {
                    type: "field_dropdown",
                    name: "ENCODING",
                    options: [
                        ["Texte brut (utf8)", "utf8"],
                        ["Binaire / Image (base64)", "base64"]
                    ]
                }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#e67e22",
            tooltip: "Crée ou remplace un fichier. Utilisez l'encodage Base64 pour enregistrer des images ou des fichiers binaires à partir de buffers textuels."
        },

        // Lire un fichier
        {
            type: "file_read_stable",
            message0: "lire le fichier %1 en mode %2",
            args0: [
                { type: "input_value", name: "PATH", check: "String" },
                {
                    type: "field_dropdown",
                    name: "ENCODING",
                    options: [
                        ["Texte normal (utf8)", "utf8"],
                        ["Chaîne cryptée/binaire (base64)", "base64"]
                    ]
                }
            ],
            output: "String",
            colour: "#e67e22",
            tooltip: "Lit le contenu d'un fichier. Le mode Base64 permet de transformer n'importe quelle image ou fichier binaire en texte transmissible (ex: pour des pièces jointes Discord)."
        },

        // Supprimer un fichier
        {
            type: "file_delete_stable",
            message0: "supprimer le fichier ou dossier %1",
            args0: [{ type: "input_value", name: "PATH", check: "String" }],
            previousStatement: null,
            nextStatement: null,
            colour: "#e67e22",
            tooltip: "Supprime définitivement le fichier ou le dossier ciblé sur le disque dur."
        },

        // ==========================================
        // 2. VÉRIFICATIONS & DOSSIERS
        // ==========================================

        // Vérifier si un fichier/dossier existe (Reporter booléen)
        {
            type: "file_exists_stable",
            message0: "le fichier ou dossier %1 existe ?",
            args0: [{ type: "input_value", name: "PATH", check: "String" }],
            output: "Boolean",
            colour: "#e67e22",
            tooltip: "Renvoie Vrai (true) si le chemin d'accès existe sur le serveur, sinon Faux (false)."
        },

        // Créer un dossier (mkdir)
        {
            type: "file_mkdir_stable",
            message0: "créer le dossier %1 (si inexistant)",
            args0: [{ type: "input_value", name: "PATH", check: "String" }],
            previousStatement: null,
            nextStatement: null,
            colour: "#e67e22",
            tooltip: "Crée l'arborescence de dossiers spécifiée de manière sécurisée."
        },

        // ==========================================
        // 3. COMPRESSION & ARCHIVES (ZIP)
        // ==========================================

        // Créer un fichier ZIP à partir d'un dossier
        {
            type: "file_zip_compress",
            message0: "compresser le dossier %1 vers l'archive ZIP %2",
            args0: [
                { type: "input_value", name: "DIR_PATH", check: "String" },
                { type: "input_value", name: "ZIP_PATH", check: "String" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#e67e22",
            tooltip: "Prend un dossier complet et l'empaquette dans un fichier d'archive compressé .zip."
        },

        // Décompresser un fichier ZIP (Extract)
        {
            type: "file_zip_decompress",
            message0: "extraire l'archive ZIP %1 vers le dossier %2",
            args0: [
                { type: "input_value", name: "ZIP_PATH", check: "String" },
                { type: "input_value", name: "DEST_PATH", check: "String" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#e67e22",
            tooltip: "Extrait tout le contenu d'un fichier .zip dans le dossier de destination indiqué."
        },

        // ==========================================
        // 4. CONVERTISSEURS DE DONNÉES / ENCODAGES (AJOUTS)
        // ==========================================
        {
            type: "file_convert_encoding",
            message0: "convertir %1 depuis %2 vers %3",
            args0: [
                { type: "input_value", name: "DATA", check: "String" },
                {
                    type: "field_dropdown",
                    name: "FROM",
                    options: [
                        ["Base64", "BASE64"],
                        ["Texte normal (UTF-8)", "UTF8"],
                        ["Hexadécimal / Base16", "HEX"],
                        ["Binaire (0101...)", "BIN"],
                        ["Base32", "BASE32"]
                    ]
                },
                {
                    type: "field_dropdown",
                    name: "TO",
                    options: [
                        ["Hexadécimal / Base16", "HEX"],
                        ["Binaire (0101...)", "BIN"],
                        ["Base32", "BASE32"],
                        ["Base64", "BASE64"],
                        ["Texte normal (UTF-8)", "UTF8"]
                    ]
                }
            ],
            output: "String",
            colour: "#e67e22",
            tooltip: "Permet de convertir des chaînes de caractères d'un système d'encodage ou d'une base numérique à un(e) autre."
        }
    ],

    generators: {
        // --- Écriture Fichier ---
        "file_write_stable": function(block, generator) {
            const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || "''";
            const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || "''";
            const encoding = block.getFieldValue('ENCODING') || 'utf8';
            return `require('fs').writeFileSync(${path}, ${content}, '${encoding}');\n`;
        },

        // --- Lecture Fichier ---
        "file_read_stable": function(block, generator) {
            const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || "''";
            const encoding = block.getFieldValue('ENCODING') || 'utf8';
            const code = `(() => {\n  try {\n    return require('fs').readFileSync(${path}, '${encoding}');\n  } catch(e) {\n    console.error('[DBB File Error]', e.message);\n    return '';\n  }\n})()`;
            return [code, generator.ORDER_ATOMIC];
        },

        // --- Suppression Fichier/Dossier ---
        "file_delete_stable": function(block, generator) {
            const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || "''";
            return `try {\n  require('fs').rmSync(${path}, { recursive: true, force: true });\n} catch(e) {\n  console.error('[DBB File Delete Error]', e.message);\n}\n`;
        },

        // --- Vérification Existence ---
        "file_exists_stable": function(block, generator) {
            const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || "''";
            const code = `require('fs').existsSync(${path})`;
            return [code, generator.ORDER_ATOMIC];
        },

        // --- Création de dossier ---
        "file_mkdir_stable": function(block, generator) {
            const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || "''";
            return `if (!require('fs').existsSync(${path})) {\n  require('fs').mkdirSync(${path}, { recursive: true });\n}\n`;
        },

        // --- ZIP : Compression ---
        "file_zip_compress": function(block, generator) {
            const dirPath = generator.valueToCode(block, 'DIR_PATH', generator.ORDER_ATOMIC) || "''";
            const zipPath = generator.valueToCode(block, 'ZIP_PATH', generator.ORDER_ATOMIC) || "''";
            return `try {\n  const AdmZip = require('adm-zip');\n  const zip = new AdmZip();\n  zip.addLocalFolder(${dirPath});\n  zip.writeZip(${zipPath});\n} catch(e) {\n  console.error('[DBB Zip Error]', e.message);\n}\n`;
        },

        // --- ZIP : Décompression ---
        "file_zip_decompress": function(block, generator) {
            const zipPath = generator.valueToCode(block, 'ZIP_PATH', generator.ORDER_ATOMIC) || "''";
            const destPath = generator.valueToCode(block, 'DEST_PATH', generator.ORDER_ATOMIC) || "''";
            return `try {\n  const AdmZip = require('adm-zip');\n  const zip = new AdmZip(${zipPath});\n  zip.extractAllTo(${destPath}, true);\n} catch(e) {\n  console.error('[DBB Unzip Error]', e.message);\n}\n`;
        },

        // --- CONVERTISSEUR MULTI-ENCODAGES SÉCURISÉ ---
        "file_convert_encoding": function(block, generator) {
            const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || "''";
            const from = block.getFieldValue('FROM');
            const to = block.getFieldValue('TO');

            // Intégration d'une fonction IIFE auto-exécutée contenant les algorithmes de traduction natifs + Base32 standalone RFC4648
            const code = `(() => {
                try {
                    const input = String(${data});
                    if (!input) return '';
                    
                    // --- ÉTAPE 1 : Décodage de la source vers un Buffer intermédiaire ---
                    let buffer;
                    if ('${from}' === 'UTF8') {
                        buffer = Buffer.from(input, 'utf8');
                    } else if ('${from}' === 'BASE64') {
                        buffer = Buffer.from(input, 'base64');
                    } else if ('${from}' === 'HEX') {
                        // Nettoie les éventuels espaces ou préfixes 0x
                        const cleanHex = input.replace(/0x/g, '').replace(/\\s/g, '');
                        buffer = Buffer.from(cleanHex, 'hex');
                    } else if ('${from}' === 'BIN') {
                        const cleanBin = input.replace(/[^01]/g, '');
                        const bytes = [];
                        for (let i = 0; i < cleanBin.length; i += 8) {
                            bytes.push(parseInt(cleanBin.slice(i, i + 8).padEnd(8, '0'), 2));
                        }
                        buffer = Buffer.from(bytes);
                    } else if ('${from}' === 'BASE32') {
                        // Décodeur Base32 RFC4648 natif sans dépendance externe
                        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
                        const cleanB32 = input.toUpperCase().replace(/=/g, '');
                        let bits = 0, value = 0, index = 0;
                        const bytes = [];
                        for (let i = 0; i < cleanB32.length; i++) {
                            const idx = alphabet.indexOf(cleanB32[i]);
                            if (idx === -1) continue;
                            value = (value << 5) | idx;
                            bits += 5;
                            if (bits >= 8) {
                                bytes.push((value >>> (bits - 8)) & 255);
                                bits -= 8;
                            }
                        }
                        buffer = Buffer.from(bytes);
                    }

                    if (!buffer) return '';

                    // --- ÉTAPE 2 : Encodage du Buffer vers le format cible ---
                    if ('${to}' === 'UTF8') return buffer.toString('utf8');
                    if ('${to}' === 'BASE64') return buffer.toString('base64');
                    if ('${to}' === 'HEX') return buffer.toString('hex');
                    if ('${to}' === 'BIN') {
                        return Array.from(buffer).map(b => b.toString(2).padStart(8, '0')).join('');
                    }
                    if ('${to}' === 'BASE32') {
                        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
                        let bits = 0, value = 0, output = '';
                        for (let i = 0; i < buffer.length; i++) {
                            value = (value << 8) | buffer[i];
                            bits += 8;
                            while (bits >= 5) {
                                output += alphabet[(value >>> (bits - 5)) & 31];
                                bits -= 5;
                            }
                        }
                        if (bits > 0) output += alphabet[(value << (5 - bits)) & 31];
                        while (output.length % 8 !== 0) output += '='; // Padding standard RFC4648
                        return output;
                    }
                    return '';
                } catch (err) {
                    console.error('[DBB Converter Error]', err.message);
                    return '';
                }
            })()`;

            return [code, generator.ORDER_ATOMIC];
        }
    }
});

