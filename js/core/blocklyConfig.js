const DBB_Config = {
    workspace: null,

    toolboxBase: {
        kind: "categoryToolbox",
        contents: []
    },

    init: function() {
        try {
            const customDarkTheme = Blockly.Theme.defineTheme('dbb_dark', {
                'base': Blockly.Themes && Blockly.Themes.Classic ? Blockly.Themes.Classic : null,
                'categoryStyles': {
                    'logic_category':      { 'colour': '#5b80a5' },
                    'loop_category':       { 'colour': '#5ba55b' },
                    'math_category':       { 'colour': '#5b67a5' },
                    'text_category':       { 'colour': '#5ba58c' },
                    'lists_category':      { 'colour': '#745ba5' },
                    'colour_category':     { 'colour': '#a55b80' },
                    'variables_category':  { 'colour': '#a55b5b' },
                    'procedures_category': { 'colour': '#9a5ba5' }
                },
                'blockStyles': {},
                'componentStyles': {
                    'workspaceBackgroundColour': '#1e1e1e',
                    'toolboxBackgroundColour':   '#1a1b1e',
                    'toolboxForegroundColour':   '#ffffff',
                    'flyoutBackgroundColour':    '#2d2d30',
                    'flyoutForegroundColour':    '#ffffff',
                    'scrollbarColour':           '#515151',
                    'scrollbarOpacity':          0.7
                }
            });

            this.workspace = Blockly.inject('blocklyDiv', {
                toolbox: this.toolboxBase,
                renderer: 'zelos',
                theme: customDarkTheme,
                grid: { spacing: 25, length: 0, colour: '#3d3d3d', snap: true },
                zoom: { controls: true, wheel: true, startScale: 0.85, maxScale: 2, minScale: 0.5, scaleSpeed: 1.2 },
                trashcan: true
            });

            // Masque la toolbox native immédiatement après inject,
            // AVANT que le navigateur ne peigne quoi que ce soit.
            // On accède à HtmlDiv (propriété publique Blockly) et on la neutralise.
            this._hideNativeToolbox();

            console.log("[DBB] Moteur Zelos injecté.");
        } catch (error) {
            console.error("[DBB] Échec du thème personnalisé :", error);
            this.workspace = Blockly.inject('blocklyDiv', { toolbox: this.toolboxBase, trashcan: true });
            this._hideNativeToolbox();
        }
    },

    _hideNativeToolbox: function() {
        if (!this.workspace) return;
        const toolbox = this.workspace.getToolbox();
        if (!toolbox) return;

        // HtmlDiv est l'élément DOM racine de la toolbox Blockly
        const div = toolbox.HtmlDiv;
        if (!div) return;

        // On remplace tout le style inline par width:0 — Blockly ne le remet
        // jamais en place car il ne surveille pas son propre HtmlDiv après inject.
        div.setAttribute('style',
            'width:0!important;min-width:0!important;max-width:0!important;' +
            'overflow:hidden!important;padding:0!important;border:none!important;' +
            'position:absolute!important;pointer-events:none!important'
        );

        // Applique aussi une règle CSS au cas où Blockly réécrierait le style
        // lors d'un updateToolbox() — la règle CSS sur l'ID est plus spécifique
        // que les règles génériques de Blockly.
        const id = 'dbb-hide-tb';
        if (!document.getElementById(id)) {
            const s = document.createElement('style');
            s.id = id;
            // On cible l'élément par sa classe ET son parent pour maximiser la spécificité
            s.textContent = `
                #blocklyDiv > .blocklyToolboxDiv,
                #blocklyDiv .blocklyToolboxDiv {
                    width: 0 !important;
                    min-width: 0 !important;
                    max-width: 0 !important;
                    overflow: hidden !important;
                    padding: 0 !important;
                    border: none !important;
                    pointer-events: none !important;
                }
            `;
            document.head.appendChild(s);
        }

        // Blockly recalcule la position du workspace SVG en fonction de la toolbox.
        // On force un resize pour qu'il prenne en compte la largeur 0.
        setTimeout(() => Blockly.svgResize(this.workspace), 0);
    },

    updateToolbox: function(newCategories) {
        if (!this.workspace) return;
        this.workspace.updateToolbox({ kind: "categoryToolbox", contents: [...newCategories] });
        // updateToolbox() peut remettre le style de HtmlDiv — on le neutralise à nouveau
        this._hideNativeToolbox();
    },

    // Appelé par notre UI custom pour ouvrir le flyout d'une catégorie
    selectCategory: function(categoryName) {
        if (!this.workspace) return;
        const toolbox = this.workspace.getToolbox();
        if (!toolbox) return;
        const items = toolbox.getToolboxItems ? toolbox.getToolboxItems() : [];
        for (const item of items) {
            if (item.getName && item.getName() === categoryName) {
                toolbox.setSelectedItem(item);
                return;
            }
        }
    }
};

