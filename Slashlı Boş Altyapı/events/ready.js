const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`${client.user.tag} olarak giriş yapıldı!, Space Bilişim iyi uçuşlar diler!`);
        
        client.user.setPresence({
            activities: [{
                name: "✨ egeiwz | spacebilisim.net",
                type: ActivityType.Playing
            }],
            status: "idle"
        });
    }
};

// Space Bilişim - 2025 Tüm hakları saklıdır.