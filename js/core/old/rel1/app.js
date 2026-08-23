document.addEventListener("DOMContentLoaded", async () => {
    // 1. Initialiser l'interface Blockly
    DBB_Config.init();

    // 2. Chargement de l'infrastructure builtin via Javascript pur
    await DBB.loadExtensionsFromMap();

    // 3. Attacher les événements UI (Export)
    document.getElementById("btn-export").addEventListener("click", () => {
        DBB_ProjectManager.exportProject();
    });

    // 4. Attacher les événements UI (Import)
    const fileInput = document.getElementById("file-import");
    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            DBB_ProjectManager.importProject(file);
            fileInput.value = ''; 
        }
    });

    // 5. Attacher l'événement d'ajout d'extension manuelle (Blindage Total)
    const extInput = document.getElementById("file-ext");
    extInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const originalRegister = DBB.registerExtension;
                const oldCategoriesCount = DBB.toolboxCategories.length;

                try {
                    // Surcharge temporaire pour forcer le mode dynamique
                    DBB.registerExtension = function(extensionDef) {
                        originalRegister.call(DBB, extensionDef, true); // true = DYNAMIQUE
                    };

                    // Évaluation isolée du script utilisateur externe
                    const secureExecutionTask = new Function(e.target.result);
                    secureExecutionTask();

                    // Rafraîchissement ciblé si l'extension s'est correctement enregistrée
                    if (DBB.toolboxCategories.length > oldCategoriesCount) {
                        DBB_Config.updateToolbox(DBB.toolboxCategories);
                    }

                } catch (err) {
                    // CORRECTION ICI : Si l'erreur survient en dehors ou pendant, l'UI affiche obligatoirement la notification rouge
                    console.error("[DBB Sandbox] Échec critique de l'évaluation de l'extension externe:", err);
                    
                    if (typeof DBB.showExtensionErrorNotif === 'function') {
                        // Extrait un message clair (ex: "TypeError: Cannot read properties of undefined")
                        const errorMessage = err.message || "Erreur de syntaxe ou fichier corrompu.";
                        DBB.showExtensionErrorNotif(`💥 Extension Défaillante "${file.name}" rejetée : ${errorMessage}`);
                    }
                } finally {
                    // Restauration obligatoire du comportement racine
                    DBB.registerExtension = originalRegister;
                }
            };
            reader.readAsText(file);
            extInput.value = '';
        }
    });

    console.log("[DBB] Moteur central initialisé et prêt.");
});

