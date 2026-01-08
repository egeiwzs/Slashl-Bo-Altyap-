const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Botun ping değerlerini gösterir'),
        
    async execute(interaction) {
        const start = Date.now();

        const loadingEmbed = new EmbedBuilder()
            .setColor('#2F3136')
            .setAuthor({
                name: 'Ping Ölçülüyor...',
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            })
            .setDescription('Lütfen bekleyin, ping değerleri hesaplanıyor...')
            .setTimestamp();

        try {
            await interaction.reply({ embeds: [loadingEmbed] });

            const reply = await interaction.fetchReply();
            const botLatency = Date.now() - start; // round-trip
            const messageLatency = reply.createdTimestamp - interaction.createdTimestamp; // mesaj gecikmesi
            const wsPing = Math.round(interaction.client.ws.ping);

            // Durum ve renk belirleme
            let durumEmoji = '🟢';
            let color = '#57F287'; // yeşil
            const worst = Math.max(botLatency, messageLatency, wsPing);
            if (worst >= 200) {
                durumEmoji = '🔴';
                color = '#ED4245';
            } else if (worst >= 100) {
                durumEmoji = '🟠';
                color = '#FAA61A';
            }

            const resultEmbed = new EmbedBuilder()
                .setColor(color)
                .setAuthor({
                    name: 'Ping Değerleri',
                    iconURL: interaction.client.user.displayAvatarURL({ dynamic: true })
                })
                .setDescription(`${durumEmoji} Genel Durum: **${worst < 100 ? 'İyi' : worst < 200 ? 'Orta' : 'Kötü'}**`)
                .addFields(
                    { name: '📊 Bot Gecikmesi', value: `\`${botLatency} ms\``, inline: true },
                    { name: '🌐 Web İletişim Ping', value: `\`${wsPing} ms\``, inline: true },
                    { name: '✉️ Karşılık ( Mesaj Gecikmesi kısaca ) Gecikmesi', value: `\`${messageLatency} ms\``, inline: true },
                )
                .setFooter({
                    text: `${interaction.user.tag} tarafından istendi`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                })
                .setTimestamp();

            await interaction.editReply({ embeds: [resultEmbed] });
        } catch (error) {
            // Basit hata yönetimi
            try {
                await interaction.editReply({ content: 'Ping ölçülürken bir hata oluştu.', embeds: [] });
            } catch {
                await interaction.followUp({ content: 'Ping ölçülürken bir hata oluştu.', ephemeral: true });
            }
            console.error('Ping komutu hatası:', error);
        }
    },
};