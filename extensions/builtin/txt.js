/**
 * Discord Bot Builder (DBB) - Extension Native : Manipulation de Texte Avancée (Édition Impériale v2)
 * Version : 1.8.0 (Analyse, RegExp, Mutation, Listes, Index de caractères, Censure & Sécurité)
 */

DBB.registerExtension({
    id: "core_text_advanced",
    name: "Texte Avancé",
    color: "#2ecc71", 

    blocks: [
        // ==========================================
        // 1. ANALYSE ET MESURE
        // ==========================================
        {
            type: "text_get_length",
            message0: "longueur de %1",
            args0: [{ type: "input_value", name: "TEXT", check: "String" }],
            output: "Number",
            colour: "#2ecc71",
            tooltip: "Renvoie le nombre de caractères présents dans le texte."
        },
        {
            type: "text_get_char_at",
            message0: "lettre %1 de %2",
            args0: [
                { type: "input_value", name: "INDEX", check: "Number" },
                { type: "input_value", name: "TEXT", check: "String" }
            ],
            output: "String",
            colour: "#2ecc71",
            tooltip: "Récupère le caractère situé à la position donnée (Base 1)."
        },
        {
            type: "text_case_convert",
            message0: "convertir %1 en %2",
            args0: [
                { type: "input_value", name: "TEXT", check: "String" },
                {
                    type: "field_dropdown",
                    name: "MODE",
                    options: [
                        ["MAJUSCULES", "UPPER"],
                        ["minuscules", "LOWER"],
                        ["Minuscule Au Début", "CAPITAL"]
                    ]
                }
            ],
            output: "String",
            colour: "#2ecc71",
            tooltip: "Modifie la casse du texte (majuscules, minuscules ou capitalisation)."
        },
        {
            type: "text_trim",
            message0: "nettoyer les espaces inutiles au début et à la fin de %1",
            args0: [{ type: "input_value", name: "TEXT", check: "String" }],
            output: "String",
            colour: "#2ecc71",
            tooltip: "Supprime les espaces blancs au début et à la fin du texte (Trim)."
        },
        {
            type: "text_is_empty",
            message0: "le texte %1 est vide (ou ne contient que des espaces) ?",
            args0: [{ type: "input_value", name: "TEXT", check: "String" }],
            output: "Boolean",
            colour: "#2ecc71",
            tooltip: "Vérifie si la chaîne de caractères est vide, nulle ou remplie d'espaces invisibles."
        },

        // ==========================================
        // 2. RECHERCHE ET VÉRIFICATION
        // ==========================================
        {
            type: "text_includes_condition",
            message0: "le texte %1 %2 %3 ?",
            args0: [
                { type: "input_value", name: "TEXT", check: "String" },
                {
                    type: "field_dropdown",
                    name: "OPERATOR",
                    options: [
                        ["contient", "CONTAINS"],
                        ["commence par", "STARTS_WITH"],
                        ["se termine par", "ENDS_WITH"]
                    ]
                },
                { type: "input_value", name: "SEARCH", check: "String" }
            ],
            output: "Boolean",
            colour: "#2ecc71",
            tooltip: "Vérifie si un texte contient, commence ou se termine par une sous-chaîne spécifique."
        },
        {
            type: "text_count_occurrences",
            message0: "compter le nombre de fois que %1 apparaît dans %2",
            args0: [
                { type: "input_value", name: "SEARCH", check: "String" },
                { type: "input_value", name: "TEXT", check: "String" }
            ],
            output: "Number",
            colour: "#2ecc71",
            tooltip: "Compte combien de fois un mot ou groupe de mots exact apparaît dans le texte cible."
        },

        // ==========================================
        // 3. PASSERELLES TEXTE <-> LISTE (ARRAY)
        // ==========================================
        {
            type: "text_to_list",
            message0: "former une liste avec le texte %1 séparé par %2",
            args0: [
                { type: "input_value", name: "TEXT", check: "String" },
                { type: "input_value", name: "DELIMITER", check: "String" }
            ],
            output: "Array",
            colour: "#2ecc71",
            tooltip: "Découpe une chaîne de caractères selon le séparateur fourni pour générer une liste exploitable."
        },
        {
            type: "list_to_text",
            message0: "former un texte en joignant la liste %1 avec le séparateur %2",
            args0: [
                { type: "input_value", name: "LIST", check: "Array" },
                { type: "input_value", name: "DELIMITER", check: "String" }
            ],
            output: "String",
            colour: "#2ecc71",
            tooltip: "Prend tous les éléments d'une liste et les fusionne en un seul texte."
        },

        // ==========================================
        // 4. SÉPARATION, DÉCOUPAGE ET MUTATION
        // ==========================================
        {
            type: "text_split_get_index",
            message0: "élément n° %1 du texte %2 séparé par %3",
            args0: [
                { type: "input_value", name: "INDEX", check: "Number" },
                { type: "input_value", name: "TEXT", check: "String" },
                { type: "input_value", name: "DELIMITER", check: "String" }
            ],
            output: "String",
            colour: "#2ecc71",
            tooltip: "Découpe le texte selon un séparateur et récupère l'élément à l'index donné."
        },
        {
            type: "text_substring",
            message0: "extraire une partie de %1 du caractère n° %2 jusqu'au caractère n° %3",
            args0: [
                { type: "input_value", name: "TEXT", check: "String" },
                { type: "input_value", name: "START", check: "Number" },
                { type: "input_value", name: "END", check: "Number" }
            ],
            output: "String",
            colour: "#2ecc71",
            tooltip: "Extrait une partie du texte entre deux positions (Base 1)."
        },
        {
            type: "text_reverse",
            message0: "inverser le texte %1",
            args0: [{ type: "input_value", name: "TEXT", check: "String" }],
            output: "String",
            colour: "#2ecc71",
            tooltip: "Inverse l'ordre de tous les caractères du texte."
        },

        // ==========================================
        // 5. EDITIONS, FORMATTAGE & SÉCURITÉ
        // ==========================================
        {
            type: "text_simple_replace",
            message0: "dans %1 remplacer le texte %2 par %3",
            args0: [
                { type: "input_value", name: "TEXT", check: "String" },
                { type: "input_value", name: "OLD", check: "String" },
                { type: "input_value", name: "NEW", check: "String" }
            ],
            output: "String",
            colour: "#2ecc71",
            tooltip: "Remplace la première occurrence d'un mot ou d'un texte par un autre."
        },
        {
            type: "text_repeat",
            message0: "répéter le texte %1 %2 fois",
            args0: [
                { type: "input_value", name: "TEXT", check: "String" },
                { type: "input_value", name: "TIMES", check: "Number" }
            ],
            output: "String",
            colour: "#2ecc71",
            tooltip: "Duplique et répète un texte un nombre défini de fois."
        },
        {
            type: "text_obscure",
            message0: "masquer le texte %1 en ne gardant que les %2 premiers caractères visibles avec %3",
            args0: [
                { type: "input_value", name: "TEXT", check: "String" },
                { type: "input_value", name: "VISIBLE_COUNT", check: "Number" },
                { type: "input_value", name: "MASK_CHAR", check: "String" }
            ],
            output: "String",
            colour: "#2ecc71",
            tooltip: "Censure la fin d'un texte en remplaçant la suite par un symbole (ex: '•')."
        },
        {
            type: "text_pad",
            message0: "remplir le texte %1 au %2 jusqu'à une longueur de %3 avec le caractère %4",
            args0: [
                { type: "input_value", name: "TEXT", check: "String" },
                {
                    type: "field_dropdown",
                    name: "POSITION",
                    options: [
                        ["début (gauche)", "START"],
                        ["fin (droite)", "END"]
                    ]
                },
                { type: "input_value", name: "MAX_LEN", check: "Number" },
                { type: "input_value", name: "PAD_STR", check: "String" }
            ],
            output: "String",
            colour: "#2ecc71",
            tooltip: "Complète un texte avec un caractère pour atteindre une taille fixe."
        },
        {
            type: "text_generate_random",
            message0: "générer un texte aléatoire unique (longueur: %1)",
            args0: [{ type: "input_value", name: "LENGTH", check: "Number" }],
            output: "String",
            colour: "#16a085", 
            tooltip: "Génère un identifiant alphanumérique unique sécurisé."
        },
        {
            type: "text_clean_mentions",
            message0: "sécuriser %1 en désactivant les mentions de rôles/everyone",
            args0: [{ type: "input_value", name: "TEXT", check: "String" }],
            output: "String",
            colour: "#16a085",
            tooltip: "Remplace les symboles @ pour empêcher les abus de mentions."
        },

        // ==========================================
        // 6. EXPRESSIONS RÉGULIÈRES (REGEXP)
        // ==========================================
        {
            type: "text_regex_match",
            message0: "le texte %1 correspond à la RegExp /%2/ %3 ?",
            args0: [
                { type: "input_value", name: "TEXT", check: "String" },
                { type: "input_value", name: "PATTERN", check: "String" },
                {
                    type: "field_dropdown",
                    name: "FLAGS",
                    options: [
                        ["sensible à la casse", ""],
                        ["insensible à la casse (i)", "i"]
                    ]
                }
            ],
            output: "Boolean",
            colour: "#2ecc71",
            tooltip: "Vérifie si un texte respecte le schéma d'une expression régulière."
        },
        {
            type: "text_regex_replace",
            message0: "dans %1 remplacer la RegExp /%2/ par %3 (option: %4)",
            args0: [
                { type: "input_value", name: "TEXT", check: "String" },
                { type: "input_value", name: "PATTERN", check: "String" },
                { type: "input_value", name: "REPLACEMENT", check: "String" },
                {
                    type: "field_dropdown",
                    name: "FLAGS",
                    options: [
                        ["premier trouvé", ""],
                        ["tous (g)", "g"],
                        ["tous insensible (gi)", "gi"]
                    ]
                }
            ],
            output: "String",
            colour: "#2ecc71",
            tooltip: "Remplace une ou plusieurs occurrences via une RegExp par un nouveau texte."
        }
    ],

    generators: {
        "text_get_length": function(block, generator) {
            const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
            return [`String(${text}).length`, generator.ORDER_ATOMIC];
        },

        "text_get_char_at": function(block, generator) {
            const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || "1";
            const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
            return [`String(${text}).charAt(Math.max(0, Math.floor(Number(${index})) - 1))`, generator.ORDER_ATOMIC];
        },

        "text_case_convert": function(block, generator) {
            const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
            const mode = block.getFieldValue('MODE');
            let code = (mode === "UPPER") ? `String(${text}).toUpperCase()` : 
                       (mode === "LOWER") ? `String(${text}).toLowerCase()` : 
                       `(() => { const s = String(${text}); return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(); })()`;
            return [code, generator.ORDER_ATOMIC];
        },

        "text_trim": function(block, generator) {
            const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
            return [`String(${text}).trim()`, generator.ORDER_ATOMIC];
        },

        "text_is_empty": function(block, generator) {
            const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
            return [`(!${text} || String(${text}).trim().length === 0)`, generator.ORDER_ATOMIC];
        },

        "text_includes_condition": function(block, generator) {
            const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
            const operator = block.getFieldValue('OPERATOR');
            const search = generator.valueToCode(block, 'SEARCH', generator.ORDER_ATOMIC) || "''";
            let code = (operator === "CONTAINS") ? `String(${text}).includes(String(${search}))` :
                       (operator === "STARTS_WITH") ? `String(${text}).startsWith(String(${search}))` :
                       `String(${text}).endsWith(String(${search}))`;
            return [code, generator.ORDER_ATOMIC];
        },

        "text_count_occurrences": function(block, generator) {
            const search = generator.valueToCode(block, 'SEARCH', generator.ORDER_ATOMIC) || "''";
            const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
            const code = `(() => { const s = String(${search}); if(!s) return 0; return String(${text}).split(s).length - 1; })()`;
            return [code, generator.ORDER_ATOMIC];
        },

        "text_to_list": function(block, generator) {
            const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
            const delimiter = generator.valueToCode(block, 'DELIMITER', generator.ORDER_ATOMIC) || "' '";
            return [`String(${text}).split(String(${delimiter}))`, generator.ORDER_ATOMIC];
        },

        "list_to_text": function(block, generator) {
            const list = generator.valueToCode(block, 'LIST', generator.ORDER_ATOMIC) || "[]";
            const delimiter = generator.valueToCode(block, 'DELIMITER', generator.ORDER_ATOMIC) || "','";
            return [`(Array.isArray(${list}) ? ${list}.join(String(${delimiter})) : '')`, generator.ORDER_ATOMIC];
        },

        "text_split_get_index": function(block, generator) {
            const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || "1";
            const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
            const delimiter = generator.valueToCode(block, 'DELIMITER', generator.ORDER_ATOMIC) || "' '";
            const code = `(() => { const parts = String(${text}).split(String(${delimiter})); const idx = Math.floor(Number(${index})) - 1; return (parts[idx] !== undefined) ? parts[idx] : ''; })()`;
            return [code, generator.ORDER_ATOMIC];
        },

        "text_substring": function(block, generator) {
            const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
            const start = generator.valueToCode(block, 'START', generator.ORDER_ATOMIC) || "1";
            const end = generator.valueToCode(block, 'END', generator.ORDER_ATOMIC) || "1";
            return [`String(${text}).slice(Math.max(0, Math.floor(Number(${start})) - 1), Math.floor(Number(${end})))`, generator.ORDER_ATOMIC];
        },

        "text_reverse": function(block, generator) {
            const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
            return [`String(${text}).split('').reverse().join('')`, generator.ORDER_ATOMIC];
        },

        "text_simple_replace": function(block, generator) {
            const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
            const oldStr = generator.valueToCode(block, 'OLD', generator.ORDER_ATOMIC) || "''";
            const newStr = generator.valueToCode(block, 'NEW', generator.ORDER_ATOMIC) || "''";
            return [`String(${text}).replace(String(${oldStr}), String(${newStr}))`, generator.ORDER_ATOMIC];
        },

        "text_repeat": function(block, generator) {
            const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
            const times = generator.valueToCode(block, 'TIMES', generator.ORDER_ATOMIC) || "1";
            return [`String(${text}).repeat(Math.max(0, Math.floor(Number(${times}))))`, generator.ORDER_ATOMIC];
        },

        "text_obscure": function(block, generator) {
            const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
            const visibleCount = generator.valueToCode(block, 'VISIBLE_COUNT', generator.ORDER_ATOMIC) || "3";
            const maskChar = generator.valueToCode(block, 'MASK_CHAR', generator.ORDER_ATOMIC) || "'•'";
            const code = `(() => { const str = String(${text}); const vis = Math.max(0, Math.floor(Number(${visibleCount}))); const char = String(${maskChar}) || '•'; if (str.length <= vis) return str; return str.slice(0, vis) + char.repeat(str.length - vis); })()`;
            return [code, generator.ORDER_ATOMIC];
        },

        "text_pad": function(block, generator) {
            const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
            const position = block.getFieldValue('POSITION');
            const maxLen = generator.valueToCode(block, 'MAX_LEN', generator.ORDER_ATOMIC) || "0";
            const padStr = generator.valueToCode(block, 'PAD_STR', generator.ORDER_ATOMIC) || "' '";
            let code = (position === "START") ? `String(${text}).padStart(Math.floor(Number(${maxLen})), String(${padStr}))` : `String(${text}).padEnd(Math.floor(Number(${maxLen})), String(${padStr}))`;
            return [code, generator.ORDER_ATOMIC];
        },

        "text_generate_random": function(block, generator) {
            const length = generator.valueToCode(block, 'LENGTH', generator.ORDER_ATOMIC) || "8";
            const code = `(() => { const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; let res = ''; const len = Math.max(1, Math.floor(Number(${length}))); for(let i=0; i<len; i++) { res += chars.charAt(Math.floor(Math.random() * chars.length)); } return res; })()`;
            return [code, generator.ORDER_ATOMIC];
        },

        "text_clean_mentions": function(block, generator) {
            const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
            return [`String(${text}).replace(/@/g, '@​')`, generator.ORDER_ATOMIC]; 
        },

        "text_regex_match": function(block, generator) {
            const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
            const pattern = generator.valueToCode(block, 'PATTERN', generator.ORDER_ATOMIC) || "''";
            const flags = block.getFieldValue('FLAGS');
            return [`(new RegExp(String(${pattern}), "${flags}")).test(String(${text}))`, generator.ORDER_ATOMIC];
        },

        "text_regex_replace": function(block, generator) {
            const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
            const pattern = generator.valueToCode(block, 'PATTERN', generator.ORDER_ATOMIC) || "''";
            const replacement = generator.valueToCode(block, 'REPLACEMENT', generator.ORDER_ATOMIC) || "''";
            const flags = block.getFieldValue('FLAGS');
            return [`String(${text}).replace(new RegExp(String(${pattern}), "${flags}"), String(${replacement}))`, generator.ORDER_ATOMIC];
        }
    }
});

