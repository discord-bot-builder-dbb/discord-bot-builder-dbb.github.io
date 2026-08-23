/**
 * Discord Bot Builder (DBB) - Extension Native : Bases de Données & Persistance (Édition Intégrale)
 * Version : 1.3.0 (JSON Local, SQLite avec WAL auto, MongoDB, MySQL, MariaDB & PostgreSQL)
 * Optimisation : Toutes les configurations acceptent désormais des blocs valeurs / variables de texte.
 */

DBB.registerExtension({
    id: "core_databases",
    name: "Bases de Données",
    color: "#e74c3c", // Rouge brique
    
    blocks: [
        // ==========================================
        // 1. STOCKAGE JSON / KEY-VALUE (LOCAL RAPIDE)
        // ==========================================
        {
            type: "db_json_set",
            message0: "dans la DB locale stocker sous la clé %1 la valeur %2",
            args0: [
                { type: "input_value", name: "KEY", check: "String" },
                { type: "input_value", name: "VALUE" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#e74c3c",
            tooltip: "Sauvegarde instantanément une donnée dans le fichier JSON local sous une clé unique."
        },
        {
            type: "db_json_get",
            message0: "depuis la DB locale obtenir la clé %1",
            args0: [{ type: "input_value", name: "KEY", check: "String" }],
            output: null,
            colour: "#e74c3c",
            tooltip: "Récupère la valeur de la clé spécifiée. Renvoie undefined si elle n'existe pas."
        },
        {
            type: "db_json_delete",
            message0: "dans la DB locale supprimer la clé %1",
            args0: [{ type: "input_value", name: "KEY", check: "String" }],
            previousStatement: null,
            nextStatement: null,
            colour: "#e74c3c",
            tooltip: "Supprime définitivement une clé et sa valeur du fichier JSON local."
        },

        // ==========================================
        // 2. SQLITE (FICHIER RELATIONNEL INTEGRÉ)
        // ==========================================
        {
            type: "db_sqlite_init",
            message0: "initialiser SQLite sur le fichier %1",
            args0: [{ type: "input_value", name: "FILE", check: "String" }],
            previousStatement: null,
            nextStatement: null,
            colour: "#d35400",
            tooltip: "Ouvre ou crée une base de données SQLite locale avec optimisation des performances (WAL)."
        },
        {
            type: "db_sqlite_execute",
            message0: "SQLite exécuter la requête %1",
            args0: [{ type: "input_value", name: "SQL", check: "String" }],
            previousStatement: null,
            nextStatement: null,
            colour: "#d35400",
            tooltip: "Exécute une requête SQL de type CREATE TABLE, INSERT, UPDATE ou DELETE."
        },
        {
            type: "db_sqlite_query",
            message0: "SQLite récupérer la liste de la requête %1 avec les paramètres %2",
            args0: [
                { type: "input_value", name: "SQL", check: "String" },
                { type: "input_value", name: "PARAMS", check: "Array" }
            ],
            output: "Array",
            colour: "#d35400",
            tooltip: "Exécute une requête SELECT sécurisée et renvoie une liste de résultats."
        },

        // ==========================================
        // 3. MONGODB (NO-SQL CLOUD / DISTANT)
        // ==========================================
        {
            type: "db_mongo_connect",
            message0: "MongoDB se connecter à l'URI %1",
            args0: [{ type: "input_value", name: "URI", check: "String" }],
            previousStatement: null,
            nextStatement: null,
            colour: "#27ae60",
            tooltip: "Établit une connexion asynchrone persistante avec votre cluster MongoDB (ex: Atlas)."
        },
        {
            type: "db_mongo_insert",
            message0: "MongoDB dans la collection %1 insérer le document %2",
            args0: [
                { type: "input_value", name: "COLL", check: "String" },
                { type: "input_value", name: "DOC" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#27ae60",
            tooltip: "Ajoute un nouvel objet ou document JSON dans la collection spécifiée."
        },
        {
            type: "db_mongo_find",
            message0: "MongoDB dans %1 chercher les documents filtrés par %2",
            args0: [
                { type: "input_value", name: "COLL", check: "String" },
                { type: "input_value", name: "FILTER" }
            ],
            output: "Array",
            colour: "#27ae60",
            tooltip: "Recherche des documents correspondants aux critères de filtrage et renvoie une liste."
        },

        // ==========================================
        // 4. MYSQL & MARIADB (RELATIONNEL DISTANT)
        // ==========================================
        {
            type: "db_mysql_connect",
            message0: "MySQL connecter Hôte: %1 Utilisateur: %2 Mot de passe: %3 Base de données: %4",
            args0: [
                { type: "input_value", name: "HOST", check: "String" },
                { type: "input_value", name: "USER", check: "String" },
                { type: "input_value", name: "PASS", check: "String" },
                { type: "input_value", name: "DBNAME", check: "String" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#2980b9",
            tooltip: "Initialise un Pool de connexions géré de manière asynchrone vers MySQL ou MariaDB."
        },
        {
            type: "db_mysql_execute_raw",
            message0: "MySQL exécuter la requête SQL brute %1",
            args0: [{ type: "input_value", name: "SQL", check: "String" }],
            previousStatement: null,
            nextStatement: null,
            colour: "#2980b9",
            tooltip: "Exécute une commande directe d'écriture ou altération de table SQL."
        },
        {
            type: "db_mysql_query",
            message0: "MySQL récupérer les résultats de %1 avec les paramètres %2",
            args0: [
                { type: "input_value", name: "SQL", check: "String" },
                { type: "input_value", name: "PARAMS", check: "Array" }
            ],
            output: "Array",
            colour: "#2980b9",
            tooltip: "Exécute une requête préparée et sécurisée contre les injections SQL et retourne les lignes."
        },

        // ==========================================
        // 5. POSTGRESQL (NOUVEAU - RELATIONNEL CLOUD AVANCÉ)
        // ==========================================
        {
            type: "db_postgres_connect",
            message0: "PostgreSQL connecter Hôte: %1 Utilisateur: %2 Mot de passe: %3 Base de données: %4 Port: %5 SSL (vrai/faux): %6",
            args0: [
                { type: "input_value", name: "HOST", check: "String" },
                { type: "input_value", name: "USER", check: "String" },
                { type: "input_value", name: "PASS", check: "String" },
                { type: "input_value", name: "DBNAME", check: "String" },
                { type: "input_value", name: "PORT", check: "Number" },
                { type: "input_value", name: "SSL", check: "Boolean" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#336791",
            tooltip: "Initialise un Pool de connexions asynchrone sécurisé vers une base PostgreSQL."
        },
        {
            type: "db_postgres_execute",
            message0: "PostgreSQL exécuter la requête %1",
            args0: [{ type: "input_value", name: "SQL", check: "String" }],
            previousStatement: null,
            nextStatement: null,
            colour: "#336791",
            tooltip: "Exécute une commande d'écriture (INSERT, UPDATE, DELETE) sur la base PostgreSQL."
        },
        {
            type: "db_postgres_query",
            message0: "PostgreSQL récupérer les résultats de %1 avec les paramètres %2",
            args0: [
                { type: "input_value", name: "SQL", check: "String" },
                { type: "input_value", name: "PARAMS", check: "Array" }
            ],
            output: "Array",
            colour: "#336791",
            tooltip: "Exécute une requête paramétrée SELECT sur PostgreSQL et renvoie un tableau de lignes."
        }
    ],

    generators: {
        // ==========================================
        // GENERATEURS JSON LOCAL
        // ==========================================
        "db_json_set": function(block, generator) {
            const key = generator.valueToCode(block, 'KEY', generator.ORDER_NONE) || "''";
            const val = generator.valueToCode(block, 'VALUE', generator.ORDER_NONE) || "null";
            return `const fs = require('fs');\nlet currentDb = {};\ntry { if(fs.existsSync('./database.json')) currentDb = JSON.parse(fs.readFileSync('./database.json','utf8')); } catch(e){}\ncurrentDb[${key}] = ${val};\nfs.writeFileSync('./database.json', JSON.stringify(currentDb, null, 2));\n`;
        },
        "db_json_get": function(block, generator) {
            const key = generator.valueToCode(block, 'KEY', generator.ORDER_NONE) || "''";
            const code = `(() => { const fs = require('fs'); try { if(!fs.existsSync('./database.json')) return undefined; const db = JSON.parse(fs.readFileSync('./database.json','utf8')); return db[${key}]; } catch(e){ return undefined; } })()`;
            return [code, generator.ORDER_ATOMIC];
        },
        "db_json_delete": function(block, generator) {
            const key = generator.valueToCode(block, 'KEY', generator.ORDER_NONE) || "''";
            return `const fs = require('fs');\ntry {\n  if(fs.existsSync('./database.json')) {\n    let db = JSON.parse(fs.readFileSync('./database.json','utf8'));\n    delete db[${key}];\n    fs.writeFileSync('./database.json', JSON.stringify(db, null, 2));\n  }\n} catch(e){}\n`;
        },

        // ==========================================
        // GENERATEURS SQLITE
        // ==========================================
        "db_sqlite_init": function(block, generator) {
            const file = generator.valueToCode(block, 'FILE', generator.ORDER_NONE) || "'database.db'";
            return `const sqlite3 = require('better-sqlite3');\ntry {\n  global.dbSqlite = new sqlite3(${file});\n  global.dbSqlite.pragma('journal_mode = WAL');\n  console.log('[DBB SQLite] Base chargée en mode WAL.');\n} catch(e) {\n  console.error('[DBB SQLite Error]', e.message);\n}\n`;
        },
        "db_sqlite_execute": function(block, generator) {
            const sql = generator.valueToCode(block, 'SQL', generator.ORDER_NONE) || "''";
            return `if (global.dbSqlite) {\n  try {\n    global.dbSqlite.prepare(${sql}).run();\n  } catch(e) {\n    console.error('[SQLite Exec Error]', e.message);\n  }\n}\n`;
        },
        "db_sqlite_query": function(block, generator) {
            const sql = generator.valueToCode(block, 'SQL', generator.ORDER_NONE) || "''";
            const params = generator.valueToCode(block, 'PARAMS', generator.ORDER_NONE) || "[]";
            const code = `(global.dbSqlite ? (() => { try { return global.dbSqlite.prepare(${sql}).all(...${params}); } catch(e) { console.error('[SQLite Query Error]', e.message); return []; } })() : [])`;
            return [code, generator.ORDER_ATOMIC];
        },

        // ==========================================
        // GENERATEURS MONGODB
        // ==========================================
        "db_mongo_connect": function(block, generator) {
            const uri = generator.valueToCode(block, 'URI', generator.ORDER_NONE) || "''";
            return `const { MongoClient } = require('mongodb');\ntry {\n  const client = new MongoClient(${uri});\n  await client.connect();\n  global.dbMongo = client.db();\n  console.log('[DBB MongoDB] Connecté avec succès.');\n} catch(e) {\n  console.error('[DBB MongoDB Error]', e.message);\n}\n`;
        },
        "db_mongo_insert": function(block, generator) {
            const coll = generator.valueToCode(block, 'COLL', generator.ORDER_NONE) || "''";
            const doc = generator.valueToCode(block, 'DOC', generator.ORDER_NONE) || "{}";
            return `if (global.dbMongo) {\n  try {\n    await global.dbMongo.collection(${coll}).insertOne(${doc});\n  } catch(e) {\n    console.error('[MongoDB Insert Error]', e.message);\n  }\n}\n`;
        },
        "db_mongo_find": function(block, generator) {
            const coll = generator.valueToCode(block, 'COLL', generator.ORDER_NONE) || "''";
            const filter = generator.valueToCode(block, 'FILTER', generator.ORDER_NONE) || "{}";
            const code = `await (async () => {\n  if (!global.dbMongo) return [];\n  try {\n    return await global.dbMongo.collection(${coll}).find(${filter}).toArray();\n  } catch(e) {\n    console.error('[MongoDB Find Error]', e.message);\n    return [];\n  }\n})()`;
            return [code, generator.ORDER_AWAIT || 0];
        },

        // ==========================================
        // GENERATEURS MYSQL / MARIADB
        // ==========================================
        "db_mysql_connect": function(block, generator) {
            const host = generator.valueToCode(block, 'HOST', generator.ORDER_NONE) || "''";
            const user = generator.valueToCode(block, 'USER', generator.ORDER_NONE) || "''";
            const pass = generator.valueToCode(block, 'PASS', generator.ORDER_NONE) || "''";
            const dbname = generator.valueToCode(block, 'DBNAME', generator.ORDER_NONE) || "''";
            return `const mysql = require('mysql2/promise');\ntry {\n  global.dbMysql = mysql.createPool({\n    host: ${host}, user: ${user}, password: ${pass}, database: ${dbname},\n    waitForConnections: true, connectionLimit: 10\n  });\n  console.log('[DBB MySQL] Pool de connexion initialisé.');\n} catch(e) {\n  console.error('[DBB MySQL Error]', e.message);\n}\n`;
        },
        "db_mysql_execute_raw": function(block, generator) {
            const sql = generator.valueToCode(block, 'SQL', generator.ORDER_NONE) || "''";
            return `if (global.dbMysql) {\n  try {\n    await global.dbMysql.query(${sql});\n  } catch(e) {\n    console.error('[MySQL Raw Query Error]', e.message);\n  }\n}\n`;
        },
        "db_mysql_query": function(block, generator) {
            const sql = generator.valueToCode(block, 'SQL', generator.ORDER_NONE) || "''";
            const params = generator.valueToCode(block, 'PARAMS', generator.ORDER_NONE) || "[]";
            const code = `await (async () => {\n  if (!global.dbMysql) return [];\n  try {\n    const [rows] = await global.dbMysql.execute(${sql}, ${params});\n    return rows;\n  } catch(e) {\n    console.error('[MySQL Prepared Query Error]', e.message);\n    return [];\n  }\n})()`;
            return [code, generator.ORDER_AWAIT || 0];
        },

        // ==========================================
        // GENERATEURS POSTGRESQL
        // ==========================================
        "db_postgres_connect": function(block, generator) {
            const host = generator.valueToCode(block, 'HOST', generator.ORDER_NONE) || "''";
            const user = generator.valueToCode(block, 'USER', generator.ORDER_NONE) || "''";
            const pass = generator.valueToCode(block, 'PASS', generator.ORDER_NONE) || "''";
            const dbname = generator.valueToCode(block, 'DBNAME', generator.ORDER_NONE) || "''";
            const port = generator.valueToCode(block, 'PORT', generator.ORDER_NONE) || "5432";
            const ssl = generator.valueToCode(block, 'SSL', generator.ORDER_NONE) || "false";
            
            return `const { Pool } = require('pg');\ntry {\n  global.dbPostgres = new Pool({\n    host: ${host},\n    user: ${user},\n    password: ${pass},\n    database: ${dbname},\n    port: parseInt(${port}),\n    ssl: ${ssl} ? { rejectUnauthorized: false } : false,\n    max: 10,\n    idleTimeoutMillis: 30000\n  });\n  console.log('[DBB PostgreSQL] Pool de connexion initialisé.');\n} catch(e) {\n  console.error('[DBB PostgreSQL Error]', e.message);\n}\n`;
        },
        "db_postgres_execute": function(block, generator) {
            const sql = generator.valueToCode(block, 'SQL', generator.ORDER_NONE) || "''";
            return `if (global.dbPostgres) {\n  try {\n    await global.dbPostgres.query(${sql});\n  } catch(e) {\n    console.error('[PostgreSQL Exec Error]', e.message);\n  }\n}\n`;
        },
        "db_postgres_query": function(block, generator) {
            const sql = generator.valueToCode(block, 'SQL', generator.ORDER_NONE) || "''";
            const params = generator.valueToCode(block, 'PARAMS', generator.ORDER_NONE) || "[]";
            const code = `await (async () => {\n  if (!global.dbPostgres) return [];\n  try {\n    const res = await global.dbPostgres.query(${sql}, ${params});\n    return res.rows;\n  } catch(e) {\n    console.error('[PostgreSQL Query Error]', e.message);\n    return [];\n  }\n})()`;
            return [code, generator.ORDER_AWAIT || 0];
        }
    }
});

