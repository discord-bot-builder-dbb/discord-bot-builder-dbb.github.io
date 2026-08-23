/**
 * Discord Bot Builder (DBB) - Extension Native : Graphismes & Images
 * Version : 1.0.0 (Génération de cartes d'XP, Bienvenue & Canvas)
 */

DBB.registerExtension({
    id: "core_graphics",
    name: "Graphismes & Images",
    color: "#9b59b6", // Violet améthyste pour le design et la création active
    
    blocks: [
        // ==========================================
        // 1. INITIALISATION ET CONFIGURATION
        // ==========================================
        {
            type: "canvas_create",
            message0: "créer une zone de dessin (Canvas) Largeur: %1 Hauteur: %2",
            args0: [
                { type: "input_value", name: "WIDTH", check: "Number" },
                { type: "input_value", name: "HEIGHT", check: "Number" }
            ],
            output: "Canvas",
            colour: "#9b59b6",
            tooltip: "Initialise un nouvel espace de dessin vierge aux dimensions indiquées."
        },

        // ==========================================
        // 2. DESSIN DE FORMES ET CHERGER DES IMAGES
        // ==========================================
        {
            type: "canvas_draw_background",
            message0: "sur le canvas %1 dessiner un fond de couleur Hex: %2",
            args0: [
                { type: "input_value", name: "CANVAS", check: "Canvas" },
                { type: "field_input", name: "COLOR", text: "#2c3e50" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#9b59b6",
            tooltip: "Remplit l'intégralité du fond de l'image avec une couleur unie."
        },
        {
            type: "canvas_draw_image",
            message0: "sur le canvas %1 incruster l'image (URL/Chemin) %2 à X: %3 Y: %4 Largeur: %5 Hauteur: %6",
            args0: [
                { type: "input_value", name: "CANVAS", check: "Canvas" },
                { type: "input_value", name: "IMAGE_SRC", check: "String" },
                { type: "input_value", name: "X", check: "Number" },
                { type: "input_value", name: "Y", check: "Number" },
                { type: "input_value", name: "W", check: "Number" },
                { type: "input_value", name: "H", check: "Number" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#9b59b6",
            tooltip: "Télécharge et superpose une image externe (ex: l'avatar d'un membre ou un fond pré-enregistré)."
        },

        // ==========================================
        // 3. TEXTE ET TYPOGRAPHIE
        // ==========================================
        {
            type: "canvas_draw_text",
            message0: "sur le canvas %1 écrire le texte %2 à X: %3 Y: %4 avec la police %5 Taille: %6px Couleur Hex: %7",
            args0: [
                { type: "input_value", name: "CANVAS", check: "Canvas" },
                { type: "input_value", name: "TEXT", check: "String" },
                { type: "input_value", name: "X", check: "Number" },
                { type: "input_value", name: "Y", check: "Number" },
                { type: "field_input", name: "FONT", text: "sans-serif" },
                { type: "input_value", name: "FONT_SIZE", check: "Number" },
                { type: "field_input", name: "COLOR", text: "#ffffff" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#9b59b6",
            tooltip: "Ajoute du texte personnalisé sur ta création graphique."
        },

        // ==========================================
        // 4. RENDU ET EXPORTATION (COMPATIBLE DISCORD)
        // ==========================================
        {
            type: "canvas_to_buffer",
            message0: "générer le fichier final (Buffer) depuis le canvas %1",
            args0: [{ type: "input_value", name: "CANVAS", check: "Canvas" }],
            output: "Buffer",
            colour: "#9b59b6",
            tooltip: "Convertit le dessin en données binaires brutes (Buffer PNG), directement exploitable par Discord ou l'extension Fichiers."
        }
    ],

    generators: {
        // --- Création du Canvas ---
        "canvas_create": function(block, generator) {
            const w = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || "800";
            const h = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || "600";
            
            const code = `(() => {\n  const { createCanvas } = require('canvas');\n  const cv = createCanvas(${w}, ${h});\n  cv.ctx = cv.getContext('2d');\n  return cv;\n})()`;
            return [code, generator.ORDER_ATOMIC];
        },

        // --- Remplissage de fond ---
        "canvas_draw_background": function(block, generator) {
            const canvas = generator.valueToCode(block, 'CANVAS', generator.ORDER_ATOMIC) || "null";
            const color = block.getFieldValue('COLOR');

            return `if (${canvas} && ${canvas}.ctx) {\n  ${canvas}.ctx.fillStyle = '${color}';\n  ${canvas}.ctx.fillRect(0, 0, ${canvas}.width, ${canvas}.height);\n}\n`;
        },

        // --- Incrustation d'images (Asynchrone via loadImage) ---
        "canvas_draw_image": function(block, generator) {
            const canvas = generator.valueToCode(block, 'CANVAS', generator.ORDER_ATOMIC) || "null";
            const src = generator.valueToCode(block, 'IMAGE_SRC', generator.ORDER_ATOMIC) || "''";
            const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || "0";
            const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || "0";
            const w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || "100";
            const h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || "100";

            // Utilisation de loadImage() fourni par le module canvas de Node.js
            return `if (${canvas} && ${canvas}.ctx && ${src}) {\n  try {\n    const { loadImage } = require('canvas');\n    const img = await loadImage(${src});\n    ${canvas}.ctx.drawImage(img, ${x}, ${y}, ${w}, ${h});\n  } catch(err) {\n    console.error('[DBB Canvas Image Error]', err.message);\n  }\n}\n`;
        },

        // --- Ajout de texte ---
        "canvas_draw_text": function(block, generator) {
            const canvas = generator.valueToCode(block, 'CANVAS', generator.ORDER_ATOMIC) || "null";
            const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || "''";
            const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || "0";
            const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || "0";
            const fontName = block.getFieldValue('FONT');
            const fontSize = generator.valueToCode(block, 'FONT_SIZE', generator.ORDER_ATOMIC) || "24";
            const color = block.getFieldValue('COLOR');

            return `if (${canvas} && ${canvas}.ctx) {\n  ${canvas}.ctx.fillStyle = '${color}';\n  ${canvas}.ctx.font = \`\${${fontSize}}px "${fontName}"\`;\n  ${canvas}.ctx.fillText(String(${text}), ${x}, ${y});\n}\n`;
        },

        // --- Export vers Buffer PNG ---
        "canvas_to_buffer": function(block, generator) {
            const canvas = generator.valueToCode(block, 'CANVAS', generator.ORDER_ATOMIC) || "null";
            
            const code = `(${canvas} ? ${canvas}.toBuffer('image/png') : Buffer.alloc(0))`;
            return [code, generator.ORDER_ATOMIC];
        }
    }
});
