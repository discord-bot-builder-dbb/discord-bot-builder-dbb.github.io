/**
 * Discord Bot Builder (DBB) - Extension Native : Son & Salons Vocaux
 * Spécification : Connexion audio, flux réseau et contrôle du volume (Charte Scratch)
 */

DBB.registerExtension({
    id: "core_voice",
    name: "Son",
    color: "#ff66cc", // Rose/Magenta officiel de la catégorie "Son" sur Scratch
    blocks: [
        // --- 1. CONNEXION / DÉCONNEXION ---
        {
            type: "voice_join",
            message0: "rejoindre le salon vocal de l'utilisateur (depuis l'interaction)",
            previousStatement: null,
            nextStatement: null,
            colour: "#ff66cc",
            tooltip: "Connecte le bot au salon vocal où se trouve l'auteur de la commande."
        },
        {
            type: "voice_leave",
            message0: "quitter le salon vocal actuel",
            previousStatement: null,
            nextStatement: null,
            colour: "#ff66cc",
            tooltip: "Déconnecte proprement le bot du salon vocal."
        },

        // --- 2. LECTURE AUDIO ---
        {
            type: "voice_play_url",
            message0: "jouer le son depuis l'URL ou le fichier : %1",
            args0: [
                { type: "input_value", name: "AUDIO_URL", check: "String" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#ff66cc",
            tooltip: "Joue un fichier audio distant (mp3, wav) ou un flux radio dans le salon vocal."
        },

        // --- 3. CONTRÔLE DE LA LECTURE ---
        {
            type: "voice_stop",
            message0: "arrêter la musique en cours",
            previousStatement: null,
            nextStatement: null,
            colour: "#ff66cc",
            tooltip: "Stoppe la lecture audio sans pour autant faire quitter le bot."
        },
        {
            type: "voice_set_volume",
            message0: "mettre le volume à %1 %",
            args0: [
                { type: "input_value", name: "VOLUME_LEVEL", check: "Number" }
            ],
            previousStatement: null,
            nextStatement: null,
            colour: "#ff66cc",
            tooltip: "Modifie le volume du bot dans le salon (entre 0 et 100)."
        }
    ],
    generators: {
        // Générateur : Rejoindre un salon vocal
        "voice_join": function(block, generator) {
            // Le générateur s'appuie sur la structure d'interaction ou de message reçue nativement par Discord
            return `
if (interaction && interaction.member && interaction.member.voice.channelId) {
    global.voiceConnection = require('@discordjs/voice').joinVoiceChannel({
        channelId: interaction.member.voice.channel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
    });
} else if (message && message.member && message.member.voice.channelId) {
    global.voiceConnection = require('@discordjs/voice').joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
    });
}\n`;
        },

        // Générateur : Quitter le salon vocal
        "voice_leave": function(block, generator) {
            return `
if (global.voiceConnection) {
    global.voiceConnection.destroy();
    global.voiceConnection = null;
    global.audioPlayer = null;
}\n`;
        },

        // Générateur : Jouer un son (Flux / Fichier)
        "voice_play_url": function(block, generator) {
            const url = generator.valueToCode(block, 'AUDIO_URL', generator.ORDER_ATOMIC) || "''";
            
            return `
if (global.voiceConnection) {
    const { createAudioPlayer, createAudioResource } = require('@discordjs/voice');
    if (!global.audioPlayer) {
        global.audioPlayer = createAudioPlayer();
        global.voiceConnection.subscribe(global.audioPlayer);
    }
    // Création de la ressource audio (gère nativement les liens web ou locaux)
    global.audioResource = createAudioResource(${url}, { inlineVolume: true });
    global.audioPlayer.play(global.audioResource);
}\n`;
        },

        // Générateur : Arrêter le son
        "voice_stop": function(block, generator) {
            return `
if (global.audioPlayer) {
    global.audioPlayer.stop();
}\n`;
        },

        // Générateur : Réglage du volume
        "voice_set_volume": function(block, generator) {
            const volume = generator.valueToCode(block, 'VOLUME_LEVEL', generator.ORDER_ATOMIC) || "100";
            
            // Discord.js voice gère le volume de manière logarithmique entre 0.0 et 1.0 (ex: 0.5 = 50%)
            return `
if (global.audioResource && global.audioResource.volume) {
    const targetVolume = Math.min(Math.max(parseInt(${volume}) / 100, 0), 1);
    global.audioResource.volume.setVolume(targetVolume);
}\n`;
        }
    }
});
