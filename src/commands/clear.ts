import type { ChatInputCommandInteraction, TextChannel } from "discord.js";
import type { BotClient } from "../structures/BotClient";
import type { Command } from "../types/Command";
import { createCommand } from "../utils/commandManager/CommandFactory";
import { Logger } from "../utils/loggerManager/Logger";
import { createEmbed } from "../utils/embedManager/EmbedFactory";
import { sendInteractionMessage } from "../utils/messageManager/InteractionMessage";

const clearCommand: Command = createCommand({
    name: "clear",
    description: "Supprime un nombre défini de messages dans le salon actuel",
    permissions: ["ManageMessages"],
    options: [
        {
            type: "integer",
            name: "nombre",
            description: "Nombre de messages à supprimer (max 100)",
            required: true,
            minValue: 1,
            maxValue: 100,
        }
    ],
    execute: async (client: BotClient, interaction: ChatInputCommandInteraction) => {
        const amount = interaction.options.getInteger("nombre", true);

        if (!interaction.channel || !interaction.channel.isTextBased()) {
            await sendInteractionMessage({
                target: interaction,
                content: "❌ Impossible de supprimer des messages ici.",
                flags: ["Ephemeral"]
            });
            return;
        }

        const channel = interaction.channel as TextChannel;

        try {
            await channel.bulkDelete(amount, true); // true pour ignorer les messages >14 jours
            
            // retreive bot info for embed
            const bot = client.user;

            // Embed to show how message have been deleted
            const embed = await createEmbed({
                title: `${bot?.username}`,
                description: `✅ ${amount} messages supprimés.`,
                color: 0x5865f2,
                thumbnail: bot?.displayAvatarURL({ size: 1024 }),
                timestamp: true,
            });

            // send the embed
            const deleteMessage = await sendInteractionMessage({
                target: interaction,
                embeds: [embed]
            });

            // remove the message after 5 seconds
            setTimeout(() => deleteMessage?.delete().catch(console.error), 5000);

            Logger.command(`(${interaction.guild}) - Commande ${interaction.commandName} exécutée par ${interaction.user.tag} dans #${channel.name}.`);
        } catch (err) {
            Logger.error(`Error: ${err}`);
            await sendInteractionMessage({
                target: interaction,
                content: "❌ Impossible de supprimer les messages.",
                flags: ["Ephemeral"]
            });
        }
    },
});

export default clearCommand;