/**
 * Extension DBB Pro Edition - Contrôles
 * Version : Thématique Scratch (Couleur #FFAB19) & Accessibilité Mobile (Zone tactile 44x44px)
 */
(function() {

    // --- Icônes avec marges transparentes intégrées (44x44px) pour augmenter la zone tactile ---
    const ICON_ADD = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none"><rect width="44" height="44" fill="none"/><circle cx="22" cy="22" r="10" fill="%23FFAB19"/><line x1="22" y1="17" x2="22" y2="27" stroke="white" stroke-width="2.5" stroke-linecap="round"/><line x1="17" y1="22" x2="27" y2="22" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>';
    const ICON_REM = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none"><rect width="44" height="44" fill="none"/><circle cx="22" cy="22" r="10" fill="%23e74c3c"/><line x1="17" y1="22" x2="27" y2="22" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>';

    /* ==========================================================================
       1. ENREGISTREMENT DU MUTATEUR PAR CLICS (ZONE MOBILE OPTIMISÉE)
       ========================================================================= */
    if (!Blockly.Extensions.isRegistered('logic_advanced_click_mutator')) {
        Blockly.Extensions.registerMutator('logic_advanced_click_mutator',
            {
                updateShape_: function() {
                    let connections = {};

                    if (this.getInput('ELSE')) {
                        connections['ELSE'] = this.getInput('ELSE').connection.targetConnection;
                    }
                    let i = 1;
                    while (this.getInput('IF' + i)) {
                        connections['IF' + i] = this.getInput('IF' + i).connection.targetConnection;
                        connections['DO' + i] = this.getInput('DO' + i).connection.targetConnection;
                        i++;
                    }

                    i = 1;
                    while (this.getInput('IF' + i)) {
                        this.removeInput('IF' + i);
                        this.removeInput('DO' + i);
                        i++;
                    }
                    if (this.getInput('ELSE')) {
                        this.removeInput('ELSE');
                    }

                    for (let j = 1; j <= this.elseifCount_; j++) {
                        this.appendValueInput('IF' + j)
                            .setCheck('Boolean')
                            .appendField('sinon si');
                        this.appendStatementInput('DO' + j);
                    }

                    this.appendStatementInput('ELSE')
                        .appendField('sinon');

                    for (let key in connections) {
                        if (connections[key] && this.getInput(key)) {
                            this.getInput(key).connection.connect(connections[key]);
                        }
                    }

                    this.initSvg();
                    this.render();
                },

                addElseIf: function() {
                    this.elseifCount_++;
                    this.updateShape_();
                },
                removeElseIf: function() {
                    if (this.elseifCount_ === 0) return;
                    this.elseifCount_--;
                    this.updateShape_();
                },

                mutationToDom: function() {
                    let container = Blockly.utils.xml.createElement('mutation');
                    container.setAttribute('elseif', this.elseifCount_ || 0);
                    container.setAttribute('else', 1);
                    return container;
                },
                domToMutation: function(xmlElement) {
                    this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10) || 0;
                    this.updateShape_();
                }
            },
            function() {
                this.elseifCount_ = 0;
                let block = this;
                
                let ctrlInput = this.getInput('MUTATOR_CONTROLS');
                if (ctrlInput) {
                    ctrlInput.appendField(new Blockly.FieldImage(ICON_ADD, 44, 44, '+', () => {
                        setTimeout(() => { block.addElseIf(); }, 0);
                    }), 'BTN_ADD_IF');
                    
                    ctrlInput.appendField(new Blockly.FieldLabel('Ajouter Sinon Si  '));
                    
                    ctrlInput.appendField(new Blockly.FieldImage(ICON_REM, 44, 44, '-', () => {
                        setTimeout(() => { block.removeElseIf(); }, 0);
                    }), 'BTN_REM_IF');
                }
            }
        );
    }

    /* ==========================================================================
       2. DEFINITION DES BLOCS ET GENERATEURS
       ========================================================================== */
    const extensionDef = {
        id: "core_logic_advanced",
        name: "Contrôles",
        color: "#FFAB19",

        blocks: [
            {
                "type": "logic_advanced_if",
                "message0": "si %1 alors %2",
                "args0": [
                    { "type": "input_value", "name": "IF0", "check": "Boolean" },
                    { "type": "input_dummy", "name": "MUTATOR_CONTROLS" }
                ],
                "message1": "%1",
                "args1": [
                    { "type": "input_statement", "name": "DO0" }
                ],
                "mutator": "logic_advanced_click_mutator",
                "previousStatement": null,
                "nextStatement": null,
                "colour": "#FFAB19",
                "tooltip": "Structure conditionnelle compatible asynchrone."
            },
            {
                "type": "logic_advanced_switch",
                "message0": "évaluer la variable %1",
                "args0": [{ "type": "input_value", "name": "SWITCH_VAL" }],
                "message1": "%1",
                "args1": [{ "type": "input_statement", "name": "CASES" }],
                "previousStatement": null,
                "nextStatement": null,
                "colour": "#FFAB19"
            },
            {
                "type": "logic_advanced_case",
                "message0": "cas %1 :",
                "args0": [{ "type": "input_value", "name": "CASE_VAL" }],
                "message1": "faire %1",
                "args1": [{ "type": "input_statement", "name": "CASE_DO" }],
                "previousStatement": null,
                "nextStatement": null,
                "colour": "#FFAB19"
            },
            {
                "type": "logic_advanced_default",
                "message0": "par défaut :",
                "message1": "faire %1",
                "args1": [{ "type": "input_statement", "name": "DEFAULT_DO" }],
                "previousStatement": null,
                "colour": "#FFAB19"
            },
            {
                "type": "logic_advanced_try_catch",
                "message0": "essayer de faire",
                "message1": "%1",
                "args1": [{ "type": "input_statement", "name": "TRY" }],
                "message2": "si erreur capturée (nommée %1 )",
                "args2": [{ "type": "field_variable", "name": "ERROR_VAR", "variable": "erreur" }],
                "message3": "faire %1",
                "args3": [{ "type": "input_statement", "name": "CATCH" }],
                "previousStatement": null,
                "nextStatement": null,
                "colour": "#E69500"
            }
        ],

        generators: {
            "logic_advanced_if": function(block, generator) {
                let n = 0;
                let code = '';
                const conditionCode = generator.valueToCode(block, 'IF' + n, generator.ORDER_NONE) || 'false';
                const branchCode = generator.statementToCode(block, 'DO' + n);
                code += `if (${conditionCode}) {\n${branchCode}}`;
                
                const elseifCount = block.elseifCount_ || 0;
                for (n = 1; n <= elseifCount; n++) {
                    const elseifConditionCode = generator.valueToCode(block, 'IF' + n, generator.ORDER_NONE) || 'false';
                    const elseifBranchCode = generator.statementToCode(block, 'DO' + n);
                    code += ` else if (${elseifConditionCode}) {\n${elseifBranchCode}}`;
                }
                
                const elseBranchCode = generator.statementToCode(block, 'ELSE');
                if (elseBranchCode) {
                    code += ` else {\n${elseBranchCode}}`;
                }
                
                return code + '\n';
            },
            "logic_advanced_switch": function(block, generator) {
                const switchVal = generator.valueToCode(block, 'SWITCH_VAL', generator.ORDER_NONE) || 'null';
                const casesCode = generator.statementToCode(block, 'CASES');
                return `switch (${switchVal}) {\n${casesCode}}\n`;
            },
            "logic_advanced_case": function(block, generator) {
                const caseVal = generator.valueToCode(block, 'CASE_VAL', generator.ORDER_NONE) || 'null';
                const caseDo = generator.statementToCode(block, 'CASE_DO');
                return `    case ${caseVal}:\n${caseDo}        break;\n`;
            },
            "logic_advanced_default": function(block, generator) {
                const defaultDo = generator.statementToCode(block, 'DEFAULT_DO');
                return `    default:\n${defaultDo}        break;\n`;
            },
            "logic_advanced_try_catch": function(block, generator) {
                const tryBranch = generator.statementToCode(block, 'TRY');
                const errorVar = generator.getVariableName(block.getFieldValue('ERROR_VAR'));
                const catchBranch = generator.statementToCode(block, 'CATCH');
                return `try {\n${tryBranch}} catch (${errorVar}) {\n${catchBranch}}\n`;
            }
        }
    };

    if (window.DBB) {
        window.DBB.registerExtension(extensionDef);
    }
})();

