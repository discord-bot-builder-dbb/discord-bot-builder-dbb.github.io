/**
 * Discord Bot Builder (DBB) - Extension Native : Mes Blocs
 * Version : Optimisation Asynchrone Stable & Correction Mutateurs
 */
(function() {

    // --- Icônes avec marges transparentes intégrées (44x44px) pour augmenter la zone tactile ---
    const ICON_ADD = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none"><rect width="44" height="44" fill="none"/><circle cx="22" cy="22" r="10" fill="%23749bc2"/><line x1="22" y1="17" x2="22" y2="27" stroke="white" stroke-width="2.5" stroke-linecap="round"/><line x1="17" y1="22" x2="27" y2="22" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>';
    const ICON_REM = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none"><rect width="44" height="44" fill="none"/><circle cx="22" cy="22" r="10" fill="%23e74c3c"/><line x1="17" y1="22" x2="27" y2="22" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>';

    /* ==========================================================================
       1. ENREGISTREMENT DES VRAIS MUTATEURS DANS LE COEUR DE BLOCKLY
       ========================================================================== */

    // --- Mutateur 1 : Le Chapeau (Déclaration de la fonction) ---
    if (!Blockly.Extensions.isRegistered('procedures_def_mutator')) {
        Blockly.Extensions.registerMutator('procedures_def_mutator',
            {
                updateShape_: function() {
                    let stackConnection = this.getInput('STACK') ? this.getInput('STACK').connection.targetConnection : null;
                    
                    let i = 0;
                    while (this.getInput('ARG_INPUT_' + i)) {
                        this.removeInput('ARG_INPUT_' + i);
                        i++;
                    }
                    if (this.getInput('STACK')) this.removeInput('STACK');

                    for (let j = 0; j < this.argCount_; j++) {
                        let fieldName = this.getFieldValue('ARG_NAME_' + j) || ('param_' + (j + 1));
                        this.appendDummyInput('ARG_INPUT_' + j)
                            .appendField('   ➔  recevoir valeur nommée :')
                            .appendField(new Blockly.FieldTextInput(fieldName), 'ARG_NAME_' + j);
                    }

                    this.appendStatementInput('STACK')
                        .appendField('faire');

                    if (stackConnection) {
                        this.getInput('STACK').connection.connect(stackConnection);
                    }

                    this.initSvg();
                    this.render();
                },

                addArg: function() {
                    this.argCount_++;
                    this.updateShape_();
                    this.notifyWorkspaceChanged_();
                },

                removeArg: function() {
                    if (this.argCount_ === 0) return;
                    this.argCount_--;
                    this.updateShape_();
                    this.notifyWorkspaceChanged_();
                },

                notifyWorkspaceChanged_: function() {
                    if (this.workspace && !this.workspace.isDragging()) {
                        setTimeout(() => {
                            let blocks = this.workspace.getAllBlocks(false);
                            let myName = this.getFieldValue('PROC_NAME');
                            blocks.forEach(b => {
                                if ((b.type === 'procedure_call_action_stable' || b.type === 'procedure_call_expression_stable') && b.getFieldValue('PROC_NAME') === myName) {
                                    if (b.updateShape_) b.updateShape_();
                                }
                            });
                        }, 50);
                    }
                },

                mutationToDom: function() {
                    let container = Blockly.utils.xml.createElement('mutation');
                    container.setAttribute('args', this.argCount_ || 0);
                    return container;
                },

                domToMutation: function(xmlElement) {
                    this.argCount_ = parseInt(xmlElement.getAttribute('args'), 10) || 0;
                    this.updateShape_();
                }
            },
            function() {
                this.argCount_ = 0;
                let block = this;
                
                let ctrlInput = this.getInput('MUTATOR_CONTROLS');
                if (ctrlInput) {
                    ctrlInput.appendField(new Blockly.FieldImage(ICON_ADD, 44, 44, '+', () => {
                        setTimeout(() => { block.addArg(); }, 0);
                    }), 'BTN_ADD_ARG');
                    
                    ctrlInput.appendField(new Blockly.FieldLabel('Ajouter paramètre  '));
                    
                    ctrlInput.appendField(new Blockly.FieldImage(ICON_REM, 44, 44, '-', () => {
                        setTimeout(() => { block.removeArg(); }, 0);
                    }), 'BTN_REM_ARG');
                }
            }
        );
    }

    // --- Mutateur 2 : Les Appelants (Synchronisation des arguments) ---
    if (!Blockly.Extensions.isRegistered('procedures_call_mutator')) {
        Blockly.Extensions.registerMutator('procedures_call_mutator',
            {
                updateShape_: function() {
                    let connections = [];
                    let i = 0;
                    while (this.getInput('ARG_VAL_' + i)) {
                        connections.push(this.getInput('ARG_VAL_' + i).connection.targetConnection);
                        this.removeInput('ARG_VAL_' + i);
                        i++;
                    }

                    let defBlock = this.findDeclarationBlock_();
                    this.argCount_ = defBlock ? (defBlock.argCount_ || 0) : 0;

                    for (let j = 0; j < this.argCount_; j++) {
                        let label = 'avec ';
                        if (defBlock) {
                            label += (defBlock.getFieldValue('ARG_NAME_' + j) || ('param_' + (j + 1)));
                        } else {
                            label += ('param_' + (j + 1));
                        }
                        label += ' =';

                    this.appendValueInput('ARG_VAL_' + j)
                        .setCheck(null)
                        .appendField('   ' + label);
                    }

                    for (let j = 0; j < connections.length; j++) {
                        if (connections[j] && this.getInput('ARG_VAL_' + j)) {
                            this.getInput('ARG_VAL_' + j).connection.connect(connections[j]);
                        }
                    }
                    this.initSvg();
                    this.render();
                },

                findDeclarationBlock_: function() {
                    if (!this.workspace) return null;
                    let myName = this.getFieldValue('PROC_NAME');
                    let blocks = this.workspace.getAllBlocks(false);
                    for (let b of blocks) {
                        if (b.type === 'procedure_def_stable' && b.getFieldValue('PROC_NAME') === myName) {
                            return b;
                        }
                    }
                    return null;
                },

                mutationToDom: function() {
                    let container = Blockly.utils.xml.createElement('mutation');
                    container.setAttribute('args', this.argCount_ || 0);
                    return container;
                },

                domToMutation: function(xmlElement) {
                    this.argCount_ = parseInt(xmlElement.getAttribute('args'), 10) || 0;
                    this.updateShape_();
                }
            },
            function() {
                this.argCount_ = 0;
                let block = this;
                
                this.getField('PROC_NAME').setValidator(function(newValue) {
                    setTimeout(() => { block.updateShape_(); }, 50);
                    return newValue;
                });
            }
        );
    }

    /* ==========================================================================
       2. CONFIGURATION DE L'EXTENSION COMPLETE
       ========================================================================== */
    if (window.DBB) {
        window.DBB.registerExtension({
            id: "core_procedures",
            name: "Mes Blocs",
            color: "#9a5ba5",

            blocks: [
                {
                    "type": "procedure_def_stable",
                    "message0": "Créer le bloc : %1 %2",
                    "args0": [
                        { "type": "field_input", "name": "PROC_NAME", "text": "mon_bloc" },
                        { "type": "input_dummy", "name": "MUTATOR_CONTROLS" }
                    ],
                    "message1": "%1",
                    "args1": [
                        { "type": "input_statement", "name": "STACK" }
                    ],
                    "mutator": "procedures_def_mutator",
                    "colour": "#9a5ba5",
                    "tooltip": "Définit une fonction asynchrone réutilisable."
                },
                {
                    "type": "procedure_call_action_stable",
                    "message0": "Exécuter : %1",
                    "args0": [
                        { "type": "field_input", "name": "PROC_NAME", "text": "mon_bloc" }
                    ],
                    "previousStatement": null,
                    "nextStatement": null,
                    "mutator": "procedures_call_mutator",
                    "colour": "#9a5ba5",
                    "tooltip": "Appelle et attend (await) un bloc personnalisé."
                },
                {
                    "type": "procedure_call_expression_stable",
                    "message0": "Résultat de : %1",
                    "args0": [
                        { "type": "field_input", "name": "PROC_NAME", "text": "mon_bloc" }
                    ],
                    "output": null,
                    "mutator": "procedures_call_mutator",
                    "colour": "#9a5ba5",
                    "tooltip": "Appelle un bloc de manière asynchrone et extrait sa valeur."
                },
                {
                    "type": "procedure_arg_getter_stable",
                    "message0": "valeur de %1",
                    "args0": [
                        { "type": "field_input", "name": "ARG_NAME", "text": "param_1" }
                    ],
                    "output": null,
                    "colour": "#b07cb9",
                    "tooltip": "Récupère la valeur d'un paramètre."
                },
                {
                    "type": "procedure_return_stable",
                    "message0": "renvoyer la valeur %1",
                    "args0": [
                        { "type": "input_value", "name": "RET_VAL" }
                    ],
                    "previousStatement": null,
                    "colour": "#9a5ba5",
                    "tooltip": "Met fin à la fonction asynchrone et retourne un résultat."
                }
            ],

            /* ==========================================================================
               3. GENERATEURS JAVASCRIPT ASYNCHRONES
               ========================================================================== */
            generators: {
                "procedure_def_stable": function(block, generator) {
                    const rawName = block.getFieldValue('PROC_NAME') || 'mon_bloc';
                    const funcName = rawName.replace(/[^a-zA-Z0-9_]/g, ''); 
                    
                    const argCount = block.argCount_ || 0;
                    let argsList = [];
                    for (let i = 0; i < argCount; i++) {
                        let argFieldName = block.getFieldValue('ARG_NAME_' + i) || ('param_' + (i + 1));
                        let cleanArgName = argFieldName.replace(/[^a-zA-Z0-9_]/g, '');
                        argsList.push(cleanArgName);
                    }
                    const cleanArgs = argsList.join(', ');

                    const branchCode = generator.statementToCode(block, 'STACK');
                    // Déclaration en global.fonction sous forme d'une fonction asynchrone
                    return `global.${funcName} = async function(${cleanArgs}) {\n${branchCode}};\n`;
                },

                "procedure_call_action_stable": function(block, generator) {
                    const rawName = block.getFieldValue('PROC_NAME') || 'mon_bloc';
                    const funcName = rawName.replace(/[^a-zA-Z0-9_]/g, '');
                    
                    const argCount = block.argCount_ || 0;
                    let valsList = [];
                    for (let i = 0; i < argCount; i++) {
                        let valCode = generator.valueToCode(block, 'ARG_VAL_' + i, generator.ORDER_NONE) || "undefined";
                        valsList.push(valCode);
                    }
                    const cleanVals = valsList.join(', ');

                    // Utilisation obligatoire de await pour ne pas bloquer le fil d'exécution de DBB
                    return `if (typeof global.${funcName} === 'function') await global.${funcName}(${cleanVals});\n`;
                },

                "procedure_call_expression_stable": function(block, generator) {
                    const rawName = block.getFieldValue('PROC_NAME') || 'mon_bloc';
                    const funcName = rawName.replace(/[^a-zA-Z0-9_]/g, '');
                    
                    const argCount = block.argCount_ || 0;
                    let valsList = [];
                    for (let i = 0; i < argCount; i++) {
                        let valCode = generator.valueToCode(block, 'ARG_VAL_' + i, generator.ORDER_NONE) || "undefined";
                        valsList.push(valCode);
                    }
                    const cleanVals = valsList.join(', ');

                    // Une IIFE asynchrone ou un await direct entouré de parenthèses
                    const code = `(typeof global.${funcName} === 'function' ? await global.${funcName}(${cleanVals}) : undefined)`;
                    return [code, generator.ORDER_AWAIT || 0];
                },

                "procedure_arg_getter_stable": function(block, generator) {
                    const rawArgName = block.getFieldValue('ARG_NAME') || 'undefined';
                    const argName = rawArgName.replace(/[^a-zA-Z0-9_]/g, '');
                    return [argName, generator.ORDER_ATOMIC];
                },
                
                "procedure_return_stable": function(block, generator) {
                    const retValue = generator.valueToCode(block, 'RET_VAL', generator.ORDER_NONE) || "undefined";
                    return `return ${retValue};\n`;
                }
            }
        });
    }
})();

