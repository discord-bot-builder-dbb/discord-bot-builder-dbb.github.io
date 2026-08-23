{
    /**
     * Discord Bot Builder (DBB) - Extension Native : Opérateurs (Version Formules d'IA décomposées)
     * Spécification : Logique, Arithmétique, et Briques Élémentaires pour Probabilités, Matrices et Algorithmes d'IA
     */

    DBB.registerExtension({
        id: "core_operators",
        name: "Opérateurs",
        color: "#5cb85c", 
        blocks: [
            // --- 1. ENTRÉES BRUTES & CONSTANTES ---
            {
                type: "operator_string_raw",
                message0: "\" %1 \"",
                args0: [{ type: "field_input", name: "TEXT", text: "texte" }],
                output: "String",
                colour: "#5cb85c"
            },
            {
                type: "operator_number_raw",
                message0: "%1",
                args0: [{ type: "field_number", name: "NUM", value: 0 }],
                output: "Number",
                colour: "#5cb85c"
            },
            {
                type: "operator_constant_math",
                message0: "constante %1",
                args0: [
                    {
                        type: "field_dropdown",
                        name: "CONSTANT",
                        options: [
                            ["π (Pi)", "PI"],
                            ["e (Euler)", "E"],
                            ["Infinity (Infini)", "Infinity"]
                        ]
                    }
                ],
                output: "Number",
                colour: "#5cb85c"
            },

            // --- 2. OPÉRATEURS ARITHMÉTIQUES ---
            {
                type: "operator_math_arithmetic",
                message0: "%1 %2 %3",
                args0: [
                    { type: "input_value", name: "A", check: "Number" },
                    {
                        type: "field_dropdown",
                        name: "OP",
                        options: [
                            ["+", "+"],
                            ["-", "-"],
                            ["×", "*"],
                            ["÷", "/"],
                            ["modulo", "%"],
                            ["puissance", "**"]
                        ]
                    },
                    { type: "input_value", name: "B", check: "Number" }
                ],
                output: "Number",
                colour: "#5cb85c"
            },

            // --- 3. ALÉATOIRE, BORNES ET ARRONDIS ---
            {
                type: "operator_random_int",
                message0: "nombre aléatoire entre %1 et %2",
                args0: [
                    { type: "input_value", name: "MIN", check: "Number" },
                    { type: "input_value", name: "MAX", check: "Number" }
                ],
                output: "Number",
                colour: "#5cb85c"
            },
            {
                type: "operator_math_min_max",
                message0: "%1 entre %2 et %3",
                args0: [
                    {
                        type: "field_dropdown",
                        name: "MODE",
                        options: [
                            ["le plus petit", "min"],
                            ["le plus grand", "max"]
                        ]
                    },
                    { type: "input_value", name: "A", check: "Number" },
                    { type: "input_value", name: "B", check: "Number" }
                ],
                output: "Number",
                colour: "#5cb85c"
            },

            // --- 4. FUNCTIONS MATHÉMATIQUES D'IA (LOGARITHMES, EXPONENTIELLES, SQUASH) ---
            {
                type: "operator_math_advanced_ia",
                message0: "%1 de %2",
                args0: [
                    {
                        type: "field_dropdown",
                        name: "OP",
                        options: [
                            ["racine carrée (sqrt)", "sqrt"],
                            ["valeur absolue (abs)", "abs"],
                            ["logarithme népérien (ln)", "log"],
                            ["logarithme base 10 (log10)", "log10"],
                            ["exponentielle (e^x)", "exp"],
                            ["sigmoïde (activation IA)", "sigmoid"]
                        ]
                    },
                    { type: "input_value", name: "NUM", check: "Number" }
                ],
                output: "Number",
                colour: "#5cb85c",
                tooltip: "Fonctions cruciales pour le calcul des probabilités conditionnelles (Bayes) et des réseaux de neurones (Sigmoïde)."
            },

            // --- 5. LOGIQUE, COMPARATEURS ET VÉRIFICATIONS ---
            {
                type: "operator_compare",
                message0: "%1 %2 %3",
                args0: [
                    { type: "input_value", name: "A" },
                    {
                        type: "field_dropdown",
                        name: "OP",
                        options: [
                            ["=", "==="], ["≠", "!=="], ["<", "<"], ["≤", "<="], [">", ">"], ["≥", ">="]
                        ]
                    },
                    { type: "input_value", name: "B" }
                ],
                output: "Boolean",
                colour: "#5cb85c"
            },
            {
                type: "operator_and_or_not",
                message0: "%1 %2 %3",
                args0: [
                    { type: "input_value", name: "A", check: "Boolean" },
                    {
                        type: "field_dropdown",
                        name: "OP",
                        options: [["et", "&&"], ["ou", "||"]]
                    },
                    { type: "input_value", name: "B", check: "Boolean" }
                ],
                output: "Boolean",
                colour: "#5cb85c"
            },

            // --- 6. MANIPULATION DE TEXTE ELEMENTAIRE ---
            {
                type: "operator_text_join",
                message0: "regrouper %1 et %2",
                args0: [
                    { type: "input_value", name: "A" },
                    { type: "input_value", name: "B" }
                ],
                output: "String",
                colour: "#5cb85c",
                tooltip: "Assemble deux chaînes de caractères ou variables textuelles ensemble."
            },
            {
                type: "operator_text_split_tokens",
                message0: "extraire les mots (jetons) du texte %1",
                args0: [{ type: "input_value", name: "TEXT", check: "String" }],
                output: "Array",
                colour: "#4a90e2",
                tooltip: "Découpe une phrase proprement en enlevant la ponctuation pour l'analyse de données (Tokenization)."
            },

            // --- 7. BRIQUES DE PROBABILITÉS & STATISTIQUES (AU COEUR DE L'IA) ---
            {
                type: "operator_stat_sum",
                message0: "somme de toutes les valeurs de la liste %1",
                args0: [{ type: "input_value", name: "LIST", check: "Array" }],
                output: "Number",
                colour: "#9b59b6",
                tooltip: "Calcule la sommation (Σ) d'un ensemble numérique."
            },
            {
                type: "operator_stat_dot_product",
                message0: "produit scalaire de la liste X %1 et Y %2",
                args0: [
                    { type: "input_value", name: "LIST_X", check: "Array" },
                    { type: "input_value", name: "LIST_Y", check: "Array" }
                ],
                output: "Number",
                colour: "#9b59b6",
                tooltip: "Multiplie les éléments correspondants de deux listes et en fait la somme. Crucial pour les régressions et les neurones."
            },
            {
                type: "operator_freq_counter",
                message0: "créer un dictionnaire de fréquences depuis la liste de mots %1",
                args0: [{ type: "input_value", name: "WORDS", check: "Array" }],
                output: "Object",
                colour: "#9b59b6",
                tooltip: "Compte combien de fois chaque mot apparaît dans l'ensemble (Calcul des probabilités de base pour Naive Bayes)."
            },
            {
                type: "operator_freq_get",
                message0: "dans le dictionnaire %1 obtenir la fréquence de %2",
                args0: [
                    { type: "input_value", name: "FREQ_OBJ", check: "Object" },
                    { type: "input_value", name: "KEY", check: "String" }
                ],
                output: "Number",
                colour: "#9b59b6",
                tooltip: "Renvoie le nombre d'occurrences enregistrées pour ce mot-clé (retourne 0 si absent)."
            },
            {
                type: "operator_stat_argmax",
                message0: "trouver la clé avec le plus grand score dans l'objet %1",
                args0: [{ type: "input_value", name: "SCORES_OBJ", check: "Object" }],
                output: "String",
                colour: "#9b59b6",
                tooltip: "Parcourt un objet { catégorie: score } et extrait le nom de la catégorie gagnante (Argmax)."
            }
        ],
        generators: {
            // --- Entrées ---
            "operator_string_raw": function(block, generator) {
                const text = block.getFieldValue('TEXT');
                return [`'${text.replace(/'/g, "\\'")}'`, generator.ORDER_ATOMIC];
            },
            "operator_number_raw": function(block, generator) {
                const num = Number(block.getFieldValue('NUM')) || 0;
                return [String(num), generator.ORDER_ATOMIC];
            },
            "operator_constant_math": function(block, generator) {
                const constant = block.getFieldValue('CONSTANT');
                let code = constant === 'PI' ? 'Math.PI' : (constant === 'E' ? 'Math.E' : 'Infinity');
                return [code, generator.ORDER_ATOMIC];
            },

            // --- Arithmétique & Extrêmes ---
            "operator_math_arithmetic": function(block, generator) {
                const valA = generator.valueToCode(block, 'A', generator.ORDER_ATOMIC) || "0";
                const op = block.getFieldValue('OP');
                const valB = generator.valueToCode(block, 'B', generator.ORDER_ATOMIC) || "0";
                return [`(${valA} ${op} ${valB})`, generator.ORDER_ATOMIC];
            },
            "operator_random_int": function(block, generator) {
                const min = generator.valueToCode(block, 'MIN', generator.ORDER_ATOMIC) || "0";
                const max = generator.valueToCode(block, 'MAX', generator.ORDER_ATOMIC) || "0";
                return [`(Math.floor(Math.random() * (${max} - ${min} + 1)) + ${min})`, generator.ORDER_ATOMIC];
            },
            "operator_math_min_max": function(block, generator) {
                const mode = block.getFieldValue('MODE');
                const valA = generator.valueToCode(block, 'A', generator.ORDER_ATOMIC) || "0";
                const valB = generator.valueToCode(block, 'B', generator.ORDER_ATOMIC) || "0";
                return [`Math.${mode}(${valA}, ${valB})`, generator.ORDER_ATOMIC];
            },

            // --- Formules IA de base (Log, Exp, Sigmoid) ---
            "operator_math_advanced_ia": function(block, generator) {
                const op = block.getFieldValue('OP');
                const num = generator.valueToCode(block, 'NUM', generator.ORDER_ATOMIC) || "0";
                let code;
                if (op === 'sigmoid') {
                    code = `(1 / (1 + Math.exp(-(${num}))))`;
                } else {
                    code = `Math.${op}(${num})`;
                }
                return [code, generator.ORDER_ATOMIC];
            },

            // --- Logique ---
            "operator_compare": function(block, generator) {
                const valA = generator.valueToCode(block, 'A', generator.ORDER_ATOMIC) || "0";
                const op = block.getFieldValue('OP');
                const valB = generator.valueToCode(block, 'B', generator.ORDER_ATOMIC) || "0";
                return [`(${valA} ${op} ${valB})`, generator.ORDER_ATOMIC];
            },
            "operator_and_or_not": function(block, generator) {
                const valA = generator.valueToCode(block, 'A', generator.ORDER_ATOMIC) || "false";
                const op = block.getFieldValue('OP');
                const valB = generator.valueToCode(block, 'B', generator.ORDER_ATOMIC) || "false";
                return [`(${valA} ${op} ${valB})`, generator.ORDER_ATOMIC];
            },

            // --- Manipulation de texte ---
            "operator_text_join": function(block, generator) {
                // Utilise String() pour forcer la concaténation saine même si les entrées sont indéfinies ou numériques
                const valA = generator.valueToCode(block, 'A', generator.ORDER_ATOMIC) || "''";
                const valB = generator.valueToCode(block, 'B', generator.ORDER_ATOMIC) || "''";
                return [`(String(${valA}) + String(${valB}))`, generator.ORDER_ATOMIC];
            },
            "operator_text_split_tokens": function(block, generator) {
                const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
                const code = `(String(${text}).toLowerCase().match(/\\b\\w+\\b/g) || [])`;
                return [code, generator.ORDER_ATOMIC];
            },

            // --- Décomposition mathématique des Probabilités (Σ, Dictionnaires, Argmax) ---
            "operator_stat_sum": function(block, generator) {
                const list = generator.valueToCode(block, 'LIST', generator.ORDER_ATOMIC) || "[]";
                const code = `(Array.isArray(${list}) ? ${list}.reduce((acc, v) => acc + (Number(v) || 0), 0) : 0)`;
                return [code, generator.ORDER_ATOMIC];
            },

            "operator_stat_dot_product": function(block, generator) {
                const listX = generator.valueToCode(block, 'LIST_X', generator.ORDER_ATOMIC) || "[]";
                const listY = generator.valueToCode(block, 'LIST_Y', generator.ORDER_ATOMIC) || "[]";
                const code = `((lx, ly) => {
                    const arrX = Array.isArray(lx) ? lx : [];
                    const arrY = Array.isArray(ly) ? ly : [];
                    let sum = 0;
                    for(let i = 0; i < Math.min(arrX.length, arrY.length); i++) {
                        sum += (Number(arrX[i]) || 0) * (Number(arrY[i]) || 0);
                    }
                    return sum;
                })(${listX}, ${listY})`;
                return [code, generator.ORDER_ATOMIC];
            },

            "operator_freq_counter": function(block, generator) {
                const words = generator.valueToCode(block, 'WORDS', generator.ORDER_ATOMIC) || "[]";
                const code = `(Array.isArray(${words}) ? ${words}.reduce((acc, w) => { acc[w] = (acc[w] || 0) + 1; return acc; }, {}) : {})`;
                return [code, generator.ORDER_ATOMIC];
            },

            "operator_freq_get": function(block, generator) {
                const freqObj = generator.valueToCode(block, 'FREQ_OBJ', generator.ORDER_ATOMIC) || "{}";
                const key = generator.valueToCode(block, 'KEY', generator.ORDER_ATOMIC) || "''";
                return [`((${freqObj})[${key}] || 0)`, generator.ORDER_ATOMIC];
            },

            "operator_stat_argmax": function(block, generator) {
                const scoresObj = generator.valueToCode(block, 'SCORES_OBJ', generator.ORDER_ATOMIC) || "{}";
                const code = `((obj) => {
                    let bestKey = 'neutre';
                    let maxScore = -Infinity;
                    for(const key in obj) {
                        if(obj[key] > maxScore) { maxScore = obj[key]; bestKey = key; }
                    }
                    return bestKey;
                })(${scoresObj})`;
                return [code, generator.ORDER_ATOMIC];
            }
        }
    });
}

