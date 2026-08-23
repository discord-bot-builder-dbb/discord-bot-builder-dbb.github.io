/**
 * Extension DBB Pro Edition - Boucles & Temps Asynchrones
 * Thématique : Vert Boucles (Couleur #5ba55b) & Accessibilité Mobile
 */
(function() {

    const extensionDef = {
        id: "core_loops_async",
        name: "Boucles & Temps (async)",
        color: "#5ba55b",

        blocks: [
            {
                "type": "loop_async_wait",
                "message0": "attendre %1 millisecondes",
                "args0": [
                    { "type": "input_value", "name": "DELAY", "check": "Number" }
                ],
                "previousStatement": null,
                "nextStatement": null,
                "colour": "#5ba55b",
                "tooltip": "Met en pause l'exécution du script pendant la durée spécifiée sans bloquer le bot."
            },
            {
                "type": "loop_async_while",
                "message0": "répéter indéfiniment chaque %1 ms",
                "args0": [
                    { "type": "input_value", "name": "INTERVAL", "check": "Number" }
                ],
                "message1": "faire %1",
                "args1": [
                    { "type": "input_statement", "name": "DO" }
                ],
                "previousStatement": null,
                "nextStatement": null,
                "colour": "#5ba55b",
                "tooltip": "Exécute en boucle continue les blocs avec une pause de sécurité entre chaque itération."
            },
            {
                "type": "loop_async_for_each",
                "message0": "pour chaque élément %1 dans la liste %2",
                "args0": [
                    { "type": "field_variable", "name": "ITEM_VAR", "variable": "élément" },
                    { "type": "input_value", "name": "LIST", "check": "Array" }
                ],
                "message1": "faire %1",
                "args1": [
                    { "type": "input_statement", "name": "DO" }
                ],
                "previousStatement": null,
                "nextStatement": null,
                "colour": "#4ca14c",
                "tooltip": "Parcourt une liste de manière asynchrone, élément par élément."
            },
            {
                "type": "loop_async_count",
                "message0": "compter avec %1 de %2 à %3 par pas de %4",
                "args0": [
                    { "type": "field_variable", "name": "INDEX_VAR", "variable": "i" },
                    { "type": "input_value", "name": "FROM", "check": "Number" },
                    { "type": "input_value", "name": "TO", "check": "Number" },
                    { "type": "input_value", "name": "STEP", "check": "Number" }
                ],
                "message1": "faire %1",
                "args1": [
                    { "type": "input_statement", "name": "DO" }
                ],
                "previousStatement": null,
                "nextStatement": null,
                "colour": "#5ba55b",
                "tooltip": "Boucle numérique standard compatible avec le code asynchrone."
            }
        ],

        generators: {
            "loop_async_wait": function(block, generator) {
                const delay = generator.valueToCode(block, 'DELAY', generator.ORDER_NONE) || '1000';
                // Génère une promesse d'attente résolue avec await
                return `await new Promise(resolve => setTimeout(resolve, ${delay}));\n`;
            },

            "loop_async_while": function(block, generator) {
                const interval = generator.valueToCode(block, 'INTERVAL', generator.ORDER_NONE) || '1000';
                const branchCode = generator.statementToCode(block, 'DO');
                
                // On utilise un 'while(true)' contenant un await à la fin pour simuler un setInterval non bloquant
                return `while (true) {\n${branchCode}    await new Promise(resolve => setTimeout(resolve, ${interval}));\n}\n`;
            },

            "loop_async_for_each": function(block, generator) {
                const itemVar = generator.getVariableName(block.getFieldValue('ITEM_VAR'));
                const listCode = generator.valueToCode(block, 'LIST', generator.ORDER_NONE) || '[]';
                const branchCode = generator.statementToCode(block, 'DO');

                // Utilisation de la structure moderne et asynchrone for...of
                return `for (const ${itemVar} of ${listCode}) {\n${branchCode}}\n`;
            },

            "loop_async_count": function(block, generator) {
                const indexVar = generator.getVariableName(block.getFieldValue('INDEX_VAR'));
                const fromVal = generator.valueToCode(block, 'FROM', generator.ORDER_NONE) || '0';
                const toVal = generator.valueToCode(block, 'TO', generator.ORDER_NONE) || '10';
                const stepVal = generator.valueToCode(block, 'STEP', generator.ORDER_NONE) || '1';
                const branchCode = generator.statementToCode(block, 'DO');

                // Boucle for traditionnelle enveloppant le code utilisateur
                return `for (let ${indexVar} = ${fromVal}; ${indexVar} <= ${toVal}; ${indexVar} += ${stepVal}) {\n${branchCode}}\n`;
            }
        }
    };

    if (window.DBB) {
        window.DBB.registerExtension(extensionDef);
    }
})();
