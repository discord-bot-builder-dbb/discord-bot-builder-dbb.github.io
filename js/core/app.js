document.addEventListener("DOMContentLoaded", async () => {
    // 1. Initialiser l'interface Blockly
    DBB_Config.init();

    // 2. Chargement de l'infrastructure builtin
    await DBB.loadExtensionsFromMap();

    // 3. Export
    document.getElementById("btn-export").addEventListener("click", () => {
        DBB_ProjectManager.exportProject();
    });

    // 4. Import projet
    const fileInput = document.getElementById("file-import");
    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            DBB_ProjectManager.importProject(file);
            fileInput.value = '';
        }
    });

    // 5. Ajout d'extension manuelle (Blindage Total)
    const extInput = document.getElementById("file-ext");
    extInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // [FIX SEC-A] Taille max pour les extensions uploadées manuellement (512 KB)
        const MAX_EXT_SIZE = 512 * 1024;
        if (file.size > MAX_EXT_SIZE) {
            DBB.showExtensionErrorNotif(
                `⚠️ Extension "${file.name}" rejetée : fichier trop volumineux (max 512 Ko).`
            );
            extInput.value = '';
            return;
        }

        // [FIX SEC-B] Validation de l'extension de fichier
        if (!file.name.endsWith('.js')) {
            DBB.showExtensionErrorNotif(
                `⚠️ Extension "${file.name}" rejetée : seuls les fichiers .js sont acceptés.`
            );
            extInput.value = '';
            return;
        }

        const reader = new FileReader();

        reader.onload = function(e) {
            const originalRegister = DBB.registerExtension;
            const oldCategoriesCount = DBB.toolboxCategories.length;

            try {
                DBB.registerExtension = function(extensionDef) {
                    originalRegister.call(DBB, extensionDef, true); // true = DYNAMIQUE
                };

                // [FIX SEC-C] Mode strict injecté dans le code utilisateur
                const secureExecutionTask = new Function('"use strict";\n' + e.target.result);
                secureExecutionTask();

                if (DBB.toolboxCategories.length > oldCategoriesCount) {
                    DBB_Config.updateToolbox(DBB.toolboxCategories);
                }

            } catch (err) {
                // [FIX ML-A] Rollback des catégories si l'extension a partiellement muté la toolbox
                if (DBB.toolboxCategories.length > oldCategoriesCount) {
                    DBB.toolboxCategories.splice(oldCategoriesCount);
                }

                console.error("[DBB Sandbox] Échec de l'extension externe :", err);

                if (typeof DBB.showExtensionErrorNotif === 'function') {
                    const errorMessage = err.message || "Erreur de syntaxe ou fichier corrompu.";
                    DBB.showExtensionErrorNotif(
                        `💥 Extension "${file.name}" rejetée : ${errorMessage}`
                    );
                }
            } finally {
                // Restauration obligatoire du comportement racine
                DBB.registerExtension = originalRegister;
            }
        };

        // [FIX ML-B] Gestion d'erreur FileReader manquante dans l'original
        reader.onerror = function() {
            DBB.showExtensionErrorNotif(
                `⚠️ Impossible de lire le fichier "${file.name}".`
            );
        };

        reader.readAsText(file);
        extInput.value = '';
    });

    console.log("[DBB] Moteur central initialisé et prêt.");
});
