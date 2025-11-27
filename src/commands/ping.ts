import { ChatInputCommandInteraction, TextChannel } from "discord.js";
import type { BotClient } from "../structures/BotClient";
import type { Command } from "../types/Command";
import { Logger } from "../utils/Logger";
import { createCommand } from '../utils/CommandFactory';
import { createEmbed } from "../utils/EmbedFactory";

const PingCommand: Command = createCommand({
    name: "ping",
    description: "Affiche la latence du bot et de l'API",
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

        if (targetChannel && targetChannel.isTextBased()) {
            await targetChannel.send({ embeds: [embed] });
            
            await interaction.reply({
                content: `✅ Informations envoyées dans ${targetChannel}`,
                ephemeral: false,
            });

            Logger.command(`Commande /ping exécutée par ${interaction.user.tag} dans #${targetChannel}.`);
        } else {
            // Sinon, on envoie dans le salon actuel
            await interaction.reply({ embeds: [embed] });
            
            const channel = interaction.channel as TextChannel;
            Logger.command(`Commande /ping exécutée par ${interaction.user.tag} dans #${channel.name}.`);
        }
    },
});

export default PingCommand;

function buildEmbed(client: BotClient) {
    if (!client.user) throw new Error("Le bot n'est pas prêt.");

    const bot = client.user;
    const start = Date.now();

    const fields = [
        { name: "Latence API", value: `${client.ws.ping}ms`, inline: true },
        { name: "Latence Bot", value: `${Date.now() - start}ms`, inline: true },
        { name: "Uptime Bot", value: `<t:${Math.floor(client.readyTimestamp! / 1000)}:R>` }
    ];

    const embed = createEmbed({
        title: `${bot.username}`,
        description: "🏓 Pong !",
        color: 0x5865f2,
        thumbnail: bot.displayAvatarURL({ size: 1024 }),
        fields,
        timestamp: true,
    });
    return embed;
}