import type { ChatInputCommandInteraction, TextChannel } from "discord.js";
import type { BotClient } from "../structures/BotClient";
import type { Command } from "../types/Command";
import { Logger } from "../utils/loggerManager/Logger";
import { createCommand } from "../utils/commandManager/CommandFactory";
import { createEmbed } from "../utils/embedManager/EmbedFactory";
import { sendInteractionMessage } from "../utils/messageManager/InteractionMessage";

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
            // send the message / embed to the targeted channel
            await sendInteractionMessage({
                target: targetChannel,
                embeds: [embed]
            });

            // reply to the user who sent the command
            await sendInteractionMessage({
                target: interaction,
                content: `✅ Commande envoyées dans ${targetChannel}`,
                flags: ["Ephemeral"]
            });

            Logger.command(`(${interaction.guild}) - Commande ${interaction.commandName} exécutée par ${interaction.user.tag} dans #${targetChannel.name}.`);
        } else {
            // send the embed into the actual channel
            await sendInteractionMessage({
                target: interaction,
                embeds: [embed]
            });
            
            const channel = interaction.channel as TextChannel;
            Logger.command(`(${interaction.guild}) - Commande ${interaction.commandName} exécutée par ${interaction.user.tag} dans #${channel.name}.`);
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