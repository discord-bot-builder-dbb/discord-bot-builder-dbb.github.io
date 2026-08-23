{
    /**
     * Discord Bot Builder (DBB) - Extension Native : Capteurs Système, Télémétrie & API (Version Maximisée)
     * Spécification : Évaluation de données, métriques RAM/CPU, stats Discord, Environnement et Temps
     */

    DBB.registerExtension({
        id: "core_sensors",
        name: "Capteurs",
        color: "#00bbdd", // Cyan électrique pour évoquer la télémétrie/mesure
        blocks: [
            // --- 1. CAPTEURS SYSTÈME (NODE.JS & OS) ---
            {
                type: "sensor_ram_usage",
                message0: "Utilisation RAM du Bot (Mo)",
                output: "Number",
                colour: "#00bbdd",
                tooltip: "Renvoie la mémoire RAM actuellement consommée par le processus du bot en Mo."
            },
            {
                type: "sensor_system_ram",
                message0: "Mémoire Machine Hôte : %1 (Go)",
                args0: [
                    {
                        type: "field_dropdown",
                        name: "METRIC",
                        options: [
                            ["RAM Totale", "TOTAL"],
                            ["RAM Libre", "FREE"]
                        ]
                    }
                ],
                output: "Number",
                colour: "#00bbdd",
                tooltip: "Renvoie la mémoire RAM globale de la machine physique (Totale ou Libre) convertie en Gigaoctets (Go)."
            },
            {
                type: "sensor_cpu_load",
                message0: "Charge CPU Moyenne (1 min %)",
                output: "Number",
                colour: "#00bbdd",
                tooltip: "Renvoie une estimation du taux de charge du processeur de la machine sur la dernière minute."
            },
            {
                type: "sensor_uptime",
                message0: "Temps d'activité du Bot (Uptime en sec)",
                output: "Number",
                colour: "#00bbdd",
                tooltip: "Renvoie le temps écoulé depuis le démarrage du bot en secondes."
            },
            {
                type: "sensor_platform",
                message0: "Système d'exploitation (OS)",
                output: "String",
                colour: "#00bbdd",
                tooltip: "Renvoie l'OS hôte (ex: 'linux', 'win32', 'darwin')."
            },
            {
                type: "sensor_sys_arch",
                message0: "Architecture CPU",
                output: "String",
                colour: "#00bbdd",
                tooltip: "Renvoie l'architecture du processeur de la machine (ex: 'x64', 'arm64')."
            },
            {
                type: "sensor_node_version",
                message0: "Version de Node.js",
                output: "String",
                colour: "#00bbdd",
                tooltip: "Renvoie la version courante de l'environnement Node.js qui exécute le bot."
            },

            // --- 2. CAPTEURS DISCORD (API / CLIENT METRICS) ---
            {
                type: "sensor_discord_ping",
                message0: "Latence API Discord (ms)",
                output: "Number",
                colour: "#00bbdd",
                tooltip: "Renvoie le ping de l'API WebSocket Discord en millisecondes."
            },
            {
                type: "sensor_guild_count",
                message0: "Nombre total de serveurs joints",
                output: "Number",
                colour: "#00bbdd",
                tooltip: "Renvoie la quantité de serveurs Discord sur lesquels le bot est présent."
            },
            {
                type: "sensor_user_count",
                message0: "Nombre total d'utilisateurs en cache",
                output: "Number",
                colour: "#00bbdd",
                tooltip: "Renvoie la quantité totale d'utilisateurs Discord que le bot garde actuellement en mémoire cache."
            },
            {
                type: "sensor_channel_count",
                message0: "Nombre total de salons suivis",
                output: "Number",
                colour: "#00bbdd",
                tooltip: "Renvoie le nombre cumulé de salons (textuels, vocaux, etc.) auxquels le bot a accès."
            },
            {
                type: "sensor_emoji_count",
                message0: "Nombre total d'émojis personnalisés",
                output: "Number",
                colour: "#00bbdd",
                tooltip: "Renvoie le nombre d'émojis globaux issus de tous les serveurs rejoints."
            },

            // --- 3. CAPTEURS D'ENVIRONNEMENT & CONTEXTE ---
            {
                type: "sensor_env_mode",
                message0: "Est-ce que le bot tourne en mode %1 ?",
                args0: [
                    {
                        type: "field_dropdown",
                        name: "MODE",
                        options: [
                            ["Production", "production"],
                            ["Développement (Dev)", "development"]
                        ]
                    }
                ],
                output: "Boolean",
                colour: "#00bbdd",
                tooltip: "Vérifie la variable d'environnement NODE_ENV pour savoir si le bot tourne en mode stable ou dev."
            },
            {
                type: "sensor_cwd",
                message0: "Dossier d'exécution actuel (CWD)",
                output: "String",
                colour: "#00bbdd",
                tooltip: "Renvoie le chemin absolu du dossier système dans lequel le processus du bot a été lancé."
            },

            // --- 4. VALEURS BOOLÉENNES ET CONSTANTES ---
            {
                type: "sensor_boolean",
                message0: "%1",
                args0: [
                    {
                        type: "field_dropdown",
                        name: "BOOL",
                        options: [["Vrai (true)", "true"], ["Faux (false)", "false"]]
                    }
                ],
                output: "Boolean",
                colour: "#00bbdd",
                tooltip: "Renvoie une valeur booléenne fixe (Vrai ou Faux)."
            },

            // --- 5. GESTION DU TEMPS ---
            {
                type: "sensor_date_local",
                message0: "%1 actuel (local)",
                args0: [
                    {
                        type: "field_dropdown",
                        name: "UNIT",
                        options: [
                            ["milliseconde", "MILLISECOND"],
                            ["seconde", "SECOND"],
                            ["minute", "MINUTE"],
                            ["heure", "HOUR"],
                            ["jour du mois", "DAY"],
                            ["jour de la semaine (0-6)", "WEEKDAY"],
                            ["mois (1-12)", "MONTH"],
                            ["année", "YEAR"]
                        ]
                    }
                ],
                output: "Number",
                colour: "#00bbdd",
                tooltip: "Renvoie l'unité de temps sélectionnée basée sur l'horloge locale du serveur (Dimanche = 0, Lundi = 1...)."
            },
            {
                type: "sensor_date_utc",
                message0: "%1 actuel (UTC)",
                args0: [
                    {
                        type: "field_dropdown",
                        name: "UNIT",
                        options: [
                            ["milliseconde", "MILLISECOND"],
                            ["seconde", "SECOND"],
                            ["minute", "MINUTE"],
                            ["heure", "HOUR"],
                            ["jour du mois", "DAY"],
                            ["jour de la semaine (0-6)", "WEEKDAY"],
                            ["mois (1-12)", "MONTH"],
                            ["année", "YEAR"]
                        ]
                    }
                ],
                output: "Number",
                colour: "#00bbdd",
                tooltip: "Renvoie l'unité de temps sélectionnée basée sur le temps universel (UTC / GMT)."
            },
            {
                type: "sensor_timestamp_unix",
                message0: "Timestamp Unix en %1",
                args0: [
                    {
                        type: "field_dropdown",
                        name: "FORMAT",
                        options: [
                            ["millisecondes (ms)", "MS"],
                            ["secondes (s)", "S"]
                        ]
                    }
                ],
                output: "Number",
                colour: "#00bbdd",
                tooltip: "Renvoie le temps UNIX absolu (Temps écoulé depuis le 1er Janvier 1970)."
            },
            {
                type: "sensor_time_advanced_check",
                message0: "Est-ce que %1 ?",
                args0: [
                    {
                        type: "field_dropdown",
                        name: "CHECK",
                        options: [
                            ["c'est le Week-end (Samedi/Dimanche)", "WEEKEND"],
                            ["l'année actuelle est bissextile", "LEAP"]
                        ]
                    }
                ],
                output: "Boolean",
                colour: "#00bbdd",
                tooltip: "Analyse calendaire avancée basée sur l'instant présent."
            },
            {
                type: "sensor_timezone",
                message0: "Fuseau horaire de l'hôte (offset min)",
                output: "Number",
                colour: "#00bbdd",
                tooltip: "Renvoie la différence en minutes par rapport à l'heure UTC (ex: -60 ou -120 en France selon l'heure d'été)."
            }
        ],
        generators: {
            // --- Générateurs Système ---
            "sensor_ram_usage": function(block, generator) {
                const code = `Math.round(process.memoryUsage().heapUsed / 1024 / 1024)`;
                return [code, generator.ORDER_ATOMIC];
            },

            "sensor_system_ram": function(block, generator) {
                const metric = block.getFieldValue('METRIC');
                const targetMethod = metric === 'TOTAL' ? 'totalmem' : 'freemem';
                const code = `Math.round(require('os').${targetMethod}() / 1024 / 1024 / 1024 * 100) / 100`;
                return [code, generator.ORDER_ATOMIC];
            },

            "sensor_cpu_load": function(block, generator) {
                // Utilise os.loadavg() [0] qui renvoie la charge sur 1 min, rapportée au nombre de CPU logiques
                const code = `Math.round((require('os').loadavg()[0] / require('os').cpus().length) * 100)`;
                return [code, generator.ORDER_ATOMIC];
            },

            "sensor_uptime": function(block, generator) {
                const code = `Math.round(process.uptime())`;
                return [code, generator.ORDER_ATOMIC];
            },

            "sensor_platform": function(block, generator) {
                const code = `process.platform`;
                return [code, generator.ORDER_ATOMIC];
            },

            "sensor_sys_arch": function(block, generator) {
                const code = `process.arch`;
                return [code, generator.ORDER_ATOMIC];
            },

            "sensor_node_version": function(block, generator) {
                const code = `process.version`;
                return [code, generator.ORDER_ATOMIC];
            },

            // --- Générateurs Discord ---
            "sensor_discord_ping": function(block, generator) {
                const code = `(client.ws ? client.ws.ping : 0)`;
                return [code, generator.ORDER_ATOMIC];
            },

            "sensor_guild_count": function(block, generator) {
                const code = `(client.guilds ? client.guilds.cache.size : 0)`;
                return [code, generator.ORDER_ATOMIC];
            },

            "sensor_user_count": function(block, generator) {
                const code = `(client.users ? client.users.cache.size : 0)`;
                return [code, generator.ORDER_ATOMIC];
            },

            "sensor_channel_count": function(block, generator) {
                const code = `(client.channels ? client.channels.cache.size : 0)`;
                return [code, generator.ORDER_ATOMIC];
            },

            "sensor_emoji_count": function(block, generator) {
                const code = `(client.emojis ? client.emojis.cache.size : 0)`;
                return [code, generator.ORDER_ATOMIC];
            },

            // --- Générateurs Contexte / Environnement ---
            "sensor_env_mode": function(block, generator) {
                const mode = block.getFieldValue('MODE');
                const code = `(process.env.NODE_ENV === '${mode}')`;
                return [code, generator.ORDER_ATOMIC];
            },

            "sensor_cwd": function(block, generator) {
                const code = `process.cwd()`;
                return [code, generator.ORDER_ATOMIC];
            },

            // --- Générateur Booléen ---
            "sensor_boolean": function(block, generator) {
                const code = block.getFieldValue('BOOL');
                return [code, generator.ORDER_ATOMIC];
            },

            // --- Générateurs de Temps ---
            "sensor_date_local": function(block, generator) {
                const unit = block.getFieldValue('UNIT');
                let code = "new Date()";

                if (unit === "MILLISECOND") code += ".getMilliseconds()";
                else if (unit === "SECOND")      code += ".getSeconds()";
                else if (unit === "MINUTE")      code += ".getMinutes()";
                else if (unit === "HOUR")        code += ".getHours()";
                else if (unit === "DAY")         code += ".getDate()";
                else if (unit === "WEEKDAY")     code += ".getDay()";
                else if (unit === "MONTH")       code += "(.getMonth() + 1)"; 
                else if (unit === "YEAR")        code += ".getFullYear()";

                return [code, generator.ORDER_ATOMIC];
            },

            "sensor_date_utc": function(block, generator) {
                const unit = block.getFieldValue('UNIT');
                let code = "new Date()";

                if (unit === "MILLISECOND") code += ".getUTCMilliseconds()";
                else if (unit === "SECOND")      code += ".getUTCSeconds()";
                else if (unit === "MINUTE")      code += ".getUTCMinutes()";
                else if (unit === "HOUR")        code += ".getUTCHours()";
                else if (unit === "DAY")         code += ".getUTCDate()";
                else if (unit === "WEEKDAY")     code += ".getUTCDay()";
                else if (unit === "MONTH")       code += "(.getUTCMonth() + 1)"; 
                else if (unit === "YEAR")        code += ".getUTCFullYear()";

                return [code, generator.ORDER_ATOMIC];
            },

            "sensor_timestamp_unix": function(block, generator) {
                const format = block.getFieldValue('FORMAT');
                let code = "Date.now()";
                if (format === "S") {
                    code = "Math.floor(Date.now() / 1000)";
                }
                return [code, generator.ORDER_ATOMIC];
            },

            "sensor_time_advanced_check": function(block, generator) {
                const check = block.getFieldValue('CHECK');
                let code = "false";
                if (check === "WEEKEND") {
                    code = `([0, 6].includes(new Date().getDay()))`;
                } else if (check === "LEAP") {
                    code = `((y => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0)(new Date().getFullYear()))`;
                }
                return [code, generator.ORDER_ATOMIC];
            },

            "sensor_timezone": function(block, generator) {
                const code = `new Date().getTimezoneOffset()`;
                return [code, generator.ORDER_ATOMIC];
            }
        }
    });
}

