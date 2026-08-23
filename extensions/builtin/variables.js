
/**
 * Discord Bot Builder (DBB) - Extension Native : Variables Dynamiques SaaS (Popup Custom & Placeholder Intelligent)
 */

// Injection dynamique des styles CSS pour la popup personnalisée si non présents
if (!document.getElementById('dbb-variable-modal-style')) {
    const style = document.createElement('style');
    style.id = 'dbb-variable-modal-style';
    style.innerHTML = `
        .dbb-custom-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.7); display: flex; align-items: center;
            justify-content: center; z-index: 10000; font-family: sans-serif;
        }
        .dbb-custom-modal {
            background: #1e1e24; border: 2px solid #a55b5b; border-radius: 8px;
            padding: 20px; width: 350px; color: #ffffff; box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        }
        .dbb-custom-modal h3 { margin-top: 0; color: #a55b5b; font-size: 18px; margin-bottom: 15px; }
        .dbb-custom-modal p { font-size: 14px; color: #ccc; margin-bottom: 15px; }
        .dbb-custom-modal input {
            width: 100%; padding: 8px; background: #2d2d35; border: 1px solid #555;
            border-radius: 4px; color: #fff; box-sizing: border-box; margin-bottom: 20px;
        }
        .dbb-custom-modal input:focus { border-color: #a55b5b; outline: none; }
        .dbb-custom-modal .dbb-modal-btns { display: flex; justify-content: flex-end; gap: 10px; }
        .dbb-custom-modal button {
            padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;
        }
        .dbb-custom-modal .btn-confirm { background: #a55b5b; color: white; }
        .dbb-custom-modal .btn-confirm:hover { background: #be6b6b; }
        .dbb-custom-modal .btn-cancel { background: #444; color: #ccc; }
        .dbb-custom-modal .btn-cancel:hover { background: #555; color: #fff; }
    `;
    document.head.appendChild(style);
}

// Fonction utilitaire pour afficher la UI Custom de prompt/confirm
function showDbbVariableModal(title, description, isPrompt, defaultValue, callback) {
    const overlay = document.createElement('div');
    overlay.className = 'dbb-custom-modal-overlay';
    
    overlay.innerHTML = `
        <div class="dbb-custom-modal">
            <h3>${title}</h3>
            <p>${description}</p>
            ${isPrompt ? `<input type="text" id="dbb-modal-input" value="${defaultValue}" autocomplete="off">` : ''}
            <div class="dbb-modal-btns">
                <button class="btn-cancel" id="dbb-modal-cancel">Annuler</button>
                <button class="btn-confirm" id="dbb-modal-confirm">Confirmer</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    const inputEl = overlay.querySelector('#dbb-modal-input');
    if (inputEl) {
        inputEl.focus();
        inputEl.select();
        inputEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') confirmAction();
        });
    }

    function confirmAction() {
        const value = isPrompt ? (inputEl ? inputEl.value : '') : true;
        document.body.removeChild(overlay);
        callback(value);
    }

    overlay.querySelector('#dbb-modal-confirm').onclick = confirmAction;
    overlay.querySelector('#dbb-modal-cancel').onclick = () => {
        document.body.removeChild(overlay);
        callback(null);
    };
}

// Initialisation globale de la variable par défaut si nécessaire
if (typeof DBB_UI !== 'undefined') {
    if (!DBB_UI.customVariables) DBB_UI.customVariables = ['maVariable'];
}

function getVariableDropdownOptions() {
    const vars = (typeof DBB_UI !== 'undefined' && DBB_UI.customVariables && DBB_UI.customVariables.length > 0) 
        ? DBB_UI.customVariables 
        : ['maVariable'];
    
    const options = vars.map(v => [v, v]);
    
    // Actions placées exclusivement à la fin du menu déroulant
    options.push(['❌ Supprimer cette variable...', '_DELETE_ACTION_']);
    options.push(['➕ Créer une variable...', '_CREATE_ACTION_']);
    return options;
}

function handleVariableDropdownValidation(newValue) {
    const block = this.getSourceBlock();
    const previousValue = this.getValue();
    const placeholderText = "sélectionnez une variable...";

    // Interdire la sélection directe/permanente des actions ou du placeholder dans le modèle de données
    if (newValue === '_CREATE_ACTION_') {
        setTimeout(() => {
            showDbbVariableModal(
                "➕ Créer une variable", 
                "Entrez le nom de la nouvelle variable :", 
                true, 
                "nouvelleVariable", 
                (res) => {
                    if (!res) {
                        // Annulation : on repasse sur la variable précédente ou le placeholder si vide
                        block.setFieldValue(previousValue && previousValue !== '_CREATE_ACTION_' ? previousValue : placeholderText, this.name);
                        return;
                    }

                    const cleanVarName = res.trim().replace(/[^a-zA-Z0-9_]/g, '');
                    if (!cleanVarName) {
                        block.setFieldValue(previousValue && previousValue !== '_CREATE_ACTION_' ? previousValue : placeholderText, this.name);
                        return;
                    }

                    if (typeof DBB_UI !== 'undefined') {
                        if (!DBB_UI.customVariables) DBB_UI.customVariables = [];
                        
                        if (!DBB_UI.customVariables.includes(cleanVarName)) {
                            DBB_UI.customVariables.push(cleanVarName);
                            DBB_UI.customVariables.sort();
                        }
                    }

                    // Forcer la bascule immédiate sur la variable fraîchement créée
                    block.setFieldValue(cleanVarName, this.name);
                }
            );
        }, 50);
        
        // Empêche temporairement le menu de rester figé sur l'action en retournant le placeholder intermédiaire
        return previousValue === '_CREATE_ACTION_' ? placeholderText : previousValue;
    }

    if (newValue === '_DELETE_ACTION_') {
        const currentVarName = this.getValue(); 
        if (!currentVarName || currentVarName === '_CREATE_ACTION_' || currentVarName === '_DELETE_ACTION_' || currentVarName === placeholderText) {
            return previousValue;
        }

        if (typeof DBB_UI !== 'undefined') {
            setTimeout(() => {
                showDbbVariableModal(
                    "❌ Supprimer la variable", 
                    `Voulez-vous vraiment supprimer "${currentVarName}" ? Tous les blocs associés seront réassignés.`, 
                    false, 
                    "", 
                    (confirmed) => {
                        if (confirmed) {
                            // Retrait du registre de l'UI
                            DBB_UI.customVariables = DBB_UI.customVariables.filter(v => v !== currentVarName);
                            
                            // Réassignation globale de tous les blocs utilisant cette variable vers le placeholder
                            if (DBB_Config && DBB_Config.workspace) {
                                const allBlocks = DBB_Config.workspace.getAllBlocks(false);
                                
                                allBlocks.forEach(b => {
                                    const f = b.getField('VAR_NAME');
                                    if (f && f.getValue() === currentVarName) {
                                        b.setFieldValue(placeholderText, 'VAR_NAME');
                                    }
                                });
                            }
                            // Appliquer le placeholder sur le bloc initiateur
                            block.setFieldValue(placeholderText, this.name);
                        } else {
                            // Annulation : restaurer l'ancienne variable cible
                            block.setFieldValue(currentVarName, this.name);
                        }
                    }
                );
            }, 50);
        }
        return previousValue;
    }

    return newValue;
}

const extensionDef = {
    id: "core_variables",
    name: "Variables",
    color: "#a55b5b", 
    blocks: [
        {
            type: "variable_set",
            message0: "définir la variable %1 sur %2",
            args0: [
                { type: "field_dropdown", name: "VAR_NAME", options: getVariableDropdownOptions },
                { type: "input_value", name: "VALUE" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#a55b5b",
            tooltip: "Attribue une valeur à cette variable.",
            extensions: ["bind_variable_validator"]
        },
        {
            type: "variable_change",
            message0: "ajouter à la variable %1 la valeur %2",
            args0: [
                { type: "field_dropdown", name: "VAR_NAME", options: getVariableDropdownOptions },
                { type: "input_value", name: "VALUE", check: "Number" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#a55b5b",
            tooltip: "Ajoute ou soustrait un nombre à la variable choisie.",
            extensions: ["bind_variable_validator"]
        },
        {
            type: "variable_get",
            message0: "%1",
            args0: [
                { type: "field_dropdown", name: "VAR_NAME", options: getVariableDropdownOptions }
            ],
            output: null,
            colour: "#a55b5b",
            tooltip: "Renvoie la valeur stockée dans cette variable.",
            extensions: ["bind_variable_validator"]
        }
    ],
    blockExtensions: {
        "bind_variable_validator": function() {
            const field = this.getField('VAR_NAME');
            if (field) {
                field.setValidator(handleVariableDropdownValidation);
            }
        }
    },
    generators: {
        "variable_set": function(block, generator) {
            const varName = block.getFieldValue('VAR_NAME');
            if (!varName || varName === '_DELETE_ACTION_' || varName === '_CREATE_ACTION_' || varName.includes('sélectionnez')) return '';
            const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || "null";
            return `global.${varName} = ${value};\n`;
        },
        "variable_change": function(block, generator) {
            const varName = block.getFieldValue('VAR_NAME');
            if (!varName || varName === '_DELETE_ACTION_' || varName === '_CREATE_ACTION_' || varName.includes('sélectionnez')) return '';
            const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || "0";
            return `global.${varName} = (global.${varName} || 0) + ${value};\n`;
        },
        "variable_get": function(block, generator) {
            const varName = block.getFieldValue('VAR_NAME');
            if (!varName || varName === '_DELETE_ACTION_' || varName === '_CREATE_ACTION_' || varName.includes('sélectionnez')) return ['null', generator.ORDER_ATOMIC];
            return [`global.${varName}`, generator.ORDER_ATOMIC];
        }
    }
};

if (window.DBB) {
    window.DBB.registerExtension(extensionDef);
}
