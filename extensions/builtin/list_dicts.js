/**
 * Discord Bot Builder (DBB) - Extension Native : Listes & Dictionnaires
 * Version : 1.0.0 (Gestion Tableaux et Objets JSON)
 */

DBB.registerExtension({
    id: "core_lists_dicts",
    name: "Listes & Dictionnaires",
    color: "#4a90e2", // Bleu roi pour différencier des variables et des capteurs
    
    blocks: [
        // ==========================================
        // 1. BLOCS POUR LES LISTES (TABLEAUX)
        // ==========================================
        
        // Créer une liste vide
        {
            type: "lists_create_empty",
            message0: "une liste vide",
            output: "Array",
            colour: "#4a90e2",
            tooltip: "Initialise un tableau vide []."
        },
        // Obtenir la taille d'une liste
        {
            type: "lists_length",
            message0: "taille de la liste %1",
            args0: [{ type: "input_value", name: "LIST", check: "Array" }],
            output: "Number",
            colour: "#4a90e2",
            tooltip: "Renvoie le nombre d'éléments dans la liste."
        },
        // Ajouter un élément à la fin (Push)
        {
            type: "lists_push",
            message0: "dans la liste %1 ajouter %2",
            args0: [
                { type: "input_value", name: "LIST", check: "Array" },
                { type: "input_value", name: "ITEM" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#4a90e2",
            tooltip: "Ajoute un élément à la toute fin de la liste."
        },
        // Récupérer un élément par son index
        {
            type: "lists_get_index",
            message0: "dans %1 obtenir l'élément n° %2",
            args0: [
                { type: "input_value", name: "LIST", check: "Array" },
                { type: "input_value", name: "INDEX", check: "Number" }
            ],
            output: null,
            colour: "#4a90e2",
            tooltip: "Récupère l'élément situé à l'index donné (Attention : le premier élément est à l'index 0)."
        },

        // ==========================================
        // 2. BLOCS POUR LES DICTIONNAIRES (OBJECTS JSON)
        // ==========================================
        
        // Créer un dictionnaire vide
        {
            type: "dicts_create_empty",
            message0: "un dictionnaire vide",
            output: "Object",
            colour: "#4a90e2",
            tooltip: "Initialise un objet JSON/dictionnaire vide {}."
        },
        // Définir/Créer une clé dans un dictionnaire
        {
            type: "dicts_set_key",
            message0: "dans le dictionnaire %1 associer à la clé %2 la valeur %3",
            args0: [
                { type: "input_value", name: "DICT", check: "Object" },
                { type: "input_value", name: "KEY", check: "String" },
                { type: "input_value", name: "VALUE" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#4a90e2",
            tooltip: "Ajoute ou remplace une propriété clé-valeur dans le dictionnaire."
        },
        // Obtenir la valeur d'une clé
        {
            type: "dicts_get_key",
            message0: "dans %1 obtenir la clé %2",
            args0: [
                { type: "input_value", name: "DICT", check: "Object" },
                { type: "input_value", name: "KEY", check: "String" }
            ],
            output: null,
            colour: "#4a90e2",
            tooltip: "Renvoie la valeur associée à cette clé. Renvoie 'undefined' si elle n'existe pas."
        },
        // Vérifier si une clé existe (Retourne un booléen)
        {
            type: "dicts_has_key",
            message0: "le dictionnaire %1 contient la clé %2 ?",
            args0: [
                { type: "input_value", name: "DICT", check: "Object" },
                { type: "input_value", name: "KEY", check: "String" }
            ],
            output: "Boolean",
            colour: "#4a90e2",
            tooltip: "Vérifie si la clé existe dans l'objet (vrai/faux)."
        },
        
        // ==========================================
        // 3. BLOCS DE CONVERSION & PARSING
        // ==========================================
        
        // Convertir une liste/dictionnaire en texte JSON stringifié
        {
            type: "json_stringify",
            message0: "convertir %1 en texte (JSON)",
            args0: [{ type: "input_value", name: "DATA" }],
            output: "String",
            colour: "#4a90e2",
            tooltip: "Transforme un tableau ou un dictionnaire en texte brut, idéal pour l'écriture de fichiers ou les logs."
        },
        // Parser du texte JSON en vraie variable exploitable
        {
            type: "json_parse",
            message0: "lire le texte %1 comme un dictionnaire/liste",
            args0: [{ type: "input_value", name: "TEXT", check: "String" }],
            output: null,
            colour: "#4a90e2",
            tooltip: "Prend du texte au format JSON et le convertit en structure de données exploitable par les autres blocs."
        }
    ],

    generators: {
        // --- Générateurs des Listes ---
        "lists_create_empty": function(block, generator) {
            return ["[]", generator.ORDER_ATOMIC];
        },
        
        "lists_length": function(block, generator) {
            const list = generator.valueToCode(block, 'LIST', generator.ORDER_ATOMIC) || "[]";
            return [`Array.isArray(${list}) ? ${list}.length : 0`, generator.ORDER_ATOMIC];
        },
        
        "lists_push": function(block, generator) {
            const list = generator.valueToCode(block, 'LIST', generator.ORDER_ATOMIC) || "null";
            const item = generator.valueToCode(block, 'ITEM', generator.ORDER_ATOMIC) || "undefined";
            return `if (Array.isArray(${list})) ${list}.push(${item});\n`;
        },
        
        "lists_get_index": function(block, generator) {
            const list = generator.valueToCode(block, 'LIST', generator.ORDER_ATOMIC) || "[]";
            const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || "0";
            return [`(Array.isArray(${list}) ? ${list}[${index}] : undefined)`, generator.ORDER_ATOMIC];
        },

        // --- Générateurs des Dictionnaires ---
        "dicts_create_empty": function(block, generator) {
            return ["{}", generator.ORDER_ATOMIC];
        },
        
        "dicts_set_key": function(block, generator) {
            const dict = generator.valueToCode(block, 'DICT', generator.ORDER_ATOMIC) || "null";
            const key = generator.valueToCode(block, 'KEY', generator.ORDER_ATOMIC) || "''";
            const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || "undefined";
            
            // Sécurité bracket-notation pour accepter les clés contenant des espaces ou des caractères spéciaux
            return `if (${dict} && typeof ${dict} === 'object') {\n  ${dict}[${key}] = ${value};\n}\n`;
        },
        
        "dicts_get_key": function(block, generator) {
            const dict = generator.valueToCode(block, 'DICT', generator.ORDER_ATOMIC) || "{}";
            const key = generator.valueToCode(block, 'KEY', generator.ORDER_ATOMIC) || "''";
            return [`(${dict} && typeof ${dict} === 'object' ? ${dict}[${key}] : undefined)`, generator.ORDER_ATOMIC];
        },
        
        "dicts_has_key": function(block, generator) {
            const dict = generator.valueToCode(block, 'DICT', generator.ORDER_ATOMIC) || "{}";
            const key = generator.valueToCode(block, 'KEY', generator.ORDER_ATOMIC) || "''";
            return [`(typeof ${dict} === 'object' && ${dict} !== null ? Object.prototype.hasOwnProperty.call(${dict}, ${key}) : false)`, generator.ORDER_ATOMIC];
        },

        // --- Générateurs JSON Utilities ---
        "json_stringify": function(block, generator) {
            const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || "{}";
            return [`JSON.stringify(${data})`, generator.ORDER_ATOMIC];
        },
        
        "json_parse": function(block, generator) {
            const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
            
            // Un try-catch inline pour éviter que le bot crash si le texte fourni n'est pas du JSON valide
            const code = `(() => { try { return JSON.parse(${text}); } catch(e) { return {}; } })()`;
            return [code, generator.ORDER_ATOMIC];
        }
    }
});
