import type { ChatInputCommandInteraction, TextChannel } from "discord.js";
import type { BotClient } from "../structures/BotClient";
import type { Command } from "../types/Command";
import { Logger } from "../utils/Logger";
import { createCommand } from "../utils/CommandFactory";
import { createEmbed } from "../utils/EmbedFactory";

const about: Command = createCommand({
    name: "about",
    description: "Affiche les informations à propos du bot",
    permissions: ["SendMessages"],
    options: [
        {
            type: "channel",
            name: "salon",
            description: "Salon où envoyer le message (optionnel)",
            required: false,
        },
    ],
    execute: async (client: BotClient, interaction: ChatInputCommandInteraction) => {
        const targetChannel = interaction.options.getChannel("salon") as TextChannel | null;

        const embed = await buildEmbed(client);

        // Si un salon est précisé, on y envoie le message
        if (targetChannel && targetChannel.isTextBased()) {
            await targetChannel.send({ embeds: [embed] });
            await interaction.reply({
                content: `✅ Commande envoyées dans ${targetChannel}`,
                ephemeral: false,
            });
            Logger.command(`(${interaction.guild}) - Commande ${interaction.commandName} exécutée par ${interaction.user.tag} dans #${targetChannel.name}.`);
        } else {
            const channel = interaction.channel as TextChannel;
            // Sinon, on envoie dans le salon actuel
            await interaction.reply({ embeds: [embed] });
            Logger.command(`(${interaction.guild}) - Commande ${interaction.commandName} exécutée par ${interaction.user.tag} dans #${channel.name}.`);
        }
    },
});

export default about;

function buildEmbed(client: BotClient){
    if (!client.user) throw new Error("Le bot n'est pas prêt.");

    const bot = client.user;
    const createdTs = Math.floor(bot.createdTimestamp / 1000);

    const fields = [
      { name: "🏷️ Tag", value: bot.tag, inline: true },
      { name: "📅 Créé le", value: `<t:${createdTs}:F> (<t:${createdTs}:R>)`, inline: true },
    ];

    const embed = createEmbed({
        title: `🤖 À propos de ${bot.username}`,
        description: "Je suis un bot multifonction pour Discord, conçu pour gérer le serveur, afficher des informations utiles sur les membres, et automatiser certaines tâches.\n\nCréé par **h0ldhaven**.",
        color: 0x5865f2,
        thumbnail: bot.displayAvatarURL({ size: 1024 }),
        fields,
        timestamp: true,
    });
    return embed;
}