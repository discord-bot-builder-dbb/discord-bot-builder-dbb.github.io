# 📘 Documentation Technique : Discord Bot Builder (DBB)
Bienvenue dans la documentation de **Discord Bot Builder (DBB)**, un environnement de développement visuel open-source, 100% exécuté côté client, conçu pour générer des bots Discord modernes utilisant la librairie discord.js v14+.
L'objectif principal de DBB est de fournir une interface modulaire basée sur **Google Blockly** où chaque fonctionnalité du bot est encapsulée dans une extension interchangeable et standardisée.
## 1. Principes Fondamentaux de l'Architecture
DBB repose sur une philosophie **zéro-backend**. Toutes les opérations — de la structuration des blocs à la compilation de l'arbre syntaxique abstrait (AST) jusqu'au packaging sous forme d'archive .zip — se font au sein du bac à sable (sandbox) du navigateur web de l'utilisateur.
### Flux de Données Événementiel
 1. **Chargement (App Initialization) :** Le cœur charge la configuration de base, puis interroge le fichier de mapping des extensions natives (extmap.ext.html).
 2. **Injection Dynamique (Plugin Loading) :** Les scripts des extensions sont injectés à la volée, enregistrant leurs configurations JSON et leurs générateurs de code au sein du registre global window.DBB.
 3. **Édition Graphique (Workspace Interaction) :** L'utilisateur assemble ses blocs. Blockly maintient l'état du projet sous forme de modèle DOM en mémoire.
 4. **Compilation & Packaging (Exporting) :** Le gestionnaire de projet extrait le code source JavaScript pur généré par Blockly, injecte le boilerplate (structures de contrôle, intents et partials Discord), sérialise l'espace de travail en XML, et assemble le tout à l'aide de JSZip.
## 2. Spécifications des Composants du Cœur (Core Engine)
Le framework est divisé en quatre modules JavaScript natifs (ES6) distincts et hautement couplés :
```
[ index.html ] ── (Orchestre) ──> [ app.js ]
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         ▼                                                     ▼
 [ blocklyConfig.js ] <── (Met à jour la Toolbox) ── [ pluginLoader.js ]
         │                                                     ▲
         ▼                                                     │
 [ projectManager.js ] <─────── (Lit / Écrit l'état) ──────────┘

```
### A. Le Registre Global & Plugin Loader (pluginLoader.js)
Ce module expose l'interface de programmation (API) window.DBB. Il sert de passerelle entre les scripts d'extensions tiers et l'instance Blockly isolée.
 * **Méthode registerExtension(config) :** Reçoit l'objet de configuration d'une extension. Elle parse les schémas JSON pour créer l'identité visuelle des blocs via Blockly.defineBlocksWithJsonArray, puis greffe les fonctions de traduction de code sur l'objet de dictionnaire Blockly.JavaScript.forBlock. Finalement, elle génère dynamiquement l'objet de catégorie requis pour l'arborescence de la boîte à outils (Toolbox).
 * **Méthode loadExtensionsFromMap() :** Effectue une requête HTTP asynchrone (fetch) pour obtenir le fichier extmap.ext.html. Il utilise l'API DOMParser pour isoler les balises <script> déclarées et gère une file d'attente de promesses (Promise.all) pour garantir un chargement ordonné et non-bloquant avant l'affichage du plan de travail.
### B. Configuration de l'Espace de Travail (blocklyConfig.js)
Ce module initialise l'instance de l'éditeur Blockly (Blockly.inject) en définissant l'agencement graphique de l'application : la grille magnétique de positionnement, les paramètres de zoom dynamique au défilement, et la structure de base réactive de la Toolbox.
 * Grâce à la méthode encapsulée updateToolbox(), la boîte à outils graphique peut être reconstruite dynamiquement en temps réel sans nécessiter la destruction ou le rafraîchissement de l'état des blocs déjà disposés par l'utilisateur sur le plan de travail.
### C. Le Gestionnaire de Projet (projectManager.js)
Ce module orchestre la sérialisation bidirectionnelle des données (Import et Export).
 * **Processus d'Exportation :** 1. Il invoque Blockly.Xml.workspaceToDom pour convertir l'agencement logique des blocs en une chaîne textuelle structurée XML.
   2. Il appelle Blockly.JavaScript.workspaceToCode pour transpiler l'arbre de blocs en code JavaScript natif.
   3. Il injecte ce code au sein d'un modèle (boilerplate) contenant l'instanciation de la classe Client de discord.js, configurée par défaut avec le cumul binaire de la totalité des privilèges d'accès (GatewayIntentBits calculés sur l'index d'intents 3276799 pour éviter les erreurs d'omission de l'utilisateur débutant).
   4. Il génère à la volée un fichier descripteur Node.js package.json listant la dépendance stricte vers discord.js.
   5. Il assemble l'arborescence requise (/, /extensions/builtin/, /extensions/community/) au sein d'un blob binaire compressé via JSZip et déclenche une action de téléchargement automatique via le DOM.
 * **Processus d'Importation :** Il intercepte le fichier binaire .zip fourni par l'utilisateur, utilise JSZip pour extraire exclusivement la chaîne de caractères du fichier workspace.xml, convertit cette chaîne en nœuds DOM via Blockly.Xml.textToDom, réinitialise le plan de travail actif et réhydrate l'espace via Blockly.Xml.domToWorkspace.
## 3. Guide de Développement d'Extensions (Plugin SDK)
Créer une extension pour DBB ne nécessite aucun outil de build (pas de Webpack, pas de Babel, pas de NPM). Il s'agit d'un script JavaScript pur standardisé.
### Structure d'une Extension Référence
Chaque extension doit s'enregistrer auprès du cœur via la structure normalisée suivante :
```javascript
/**
 * Extension Officielle ou Communautaire pour Discord Bot Builder
 * Nom de l'extension : Gestionnaire d'Événements Avancé
 */
DBB.registerExtension({
    // Identifiant unique de l'extension. Doit être en minuscules, sans espaces ni caractères spéciaux.
    id: "advanced_events",
    
    // Le nom de la catégorie tel qu'il apparaîtra dans la Toolbox latérale.
    name: "Événements Serveur",
    
    // Couleur thématique appliquée à tous les blocs de cette catégorie (Format HEX, RGB ou ID Blockly).
    color: "#7289DA",
    
    // Tableau contenant les définitions structurelles et visuelles de chaque bloc (Format JSON Blockly).
    blocks: [
        {
            type: "event_guild_member_add",
            message0: "Quand un membre rejoint le serveur %1 %2",
            args0: [
                { type: "input_dummy" },
                { type: "input_statement", name: "DO" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#7289DA",
            tooltip: "Déclenche les blocs internes dès qu'un utilisateur rejoint la guilde.",
            helpUrl: ""
        }
    ],
    
    // Objet contenant les fonctions de génération de code associées à chaque bloc.
    generators: {
        "event_guild_member_add": function(block, generator) {
            // Extraction récursive du code des blocs imbriqués dans l'instruction 'DO'
            const statements_do = generator.statementToCode(block, 'DO');
            
            // Construction de l'écouteur d'événement discord.js v14
            // L'argument passé à la fonction fléchée est le membre (member) fourni par l'API Discord
            const code = `
client.on('guildMemberAdd', async (member) => {
${statements_do}});
`;
            return code;
        }
    }
});

```
## 4. Règles de Génération de Code pour discord.js v14
Pour maintenir la cohérence opérationnelle du bot final généré, les développeurs d'extensions doivent impérativement se conformer aux normes architecturales de la version 14 de discord.js :
### A. Gestion de la Portée des Variables (Scoping)
Puisque le code issu de Blockly est concatené de manière linéaire, il est crucial d'éviter les collisions de variables au sein du scope global de l'écouteur d'événements.
 * **Règle :** Encapsulez systématiquement le code généré à l'intérieur de blocs d'instructions locales ou de fonctions asynchrones fléchées (async (interaction) => { ... }).
 * **Exemple :** Préférer l'utilisation constante de const et let à la place de var.
### B. Traitement des Promesses (Asynchronisme)
Presque toutes les requêtes réseau effectuées via discord.js (envoi de message, suppression, modification de rôles) retournent des Promesses JavaScript (Promise).
 * **Règle :** Les fonctions générées doivent être préfixées par le mot-clé async dès que possible, et les interactions d'API doivent inclure des instructions de capture d'erreur .catch(console.error) pour éviter le crash du processus Node.js du bot utilisateur en production.
### C. Structure des Retours des Blocs
 * **Blocs de type "Instruction" (Statements) :** Les blocs possédant des encoches de connexion supérieures et inférieures exécutent des actions. Leur fonction de génération de code **doit** retourner une chaîne de caractères (string) se terminant par un saut de ligne (\n).
 * **Blocs de type "Valeur" (Inputs/Outputs) :** Les blocs transmettant une donnée (ex: récupérer l'identifiant d'un salon) possèdent une connexion latérale. Leur fonction de génération de code **doit** impérativement retourner un tableau structuré contenant la chaîne de caractères du code ainsi que l'ordre de priorité de l'opérateur : return [code, generator.ORDER_ATOMIC];.
## 5. Déploiement et Maintenance du Système d'Extensions
### Ajout d'une extension Native (builtin)
 1. Créez le fichier de votre extension dans le dossier extensions/builtin/mon_plugin.js.
 2. Ouvrez le fichier extmap.ext.html présent à la racine de votre application.
 3. Ajoutez une nouvelle ligne pointant vers votre script :
   ```html
   <script src="/extensions/builtin/mon_plugin.js" defer></script>
   
   ```
### Ajout d'une extension Communautaire (community)
Les extensions téléchargées par les utilisateurs ou partagées par la communauté sont placées dans le répertoire /extensions/community/. Le moteur d'importation de DBB a été nativement configuré pour préserver l'arborescence complète de ces dossiers lors de la compression et de la décompression des archives projets.