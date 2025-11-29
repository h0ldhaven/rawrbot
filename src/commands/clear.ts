import type { ChatInputCommandInteraction, TextChannel } from "discord.js";
import type { BotClient } from "../structures/BotClient";
import type { Command } from "../types/Command";
import { createCommand } from "../utils/CommandFactory";
import { Logger } from "../utils/Logger";
import { createEmbed } from "../utils/EmbedFactory";

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
            await interaction.reply({ content: "❌ Impossible de supprimer des messages ici.", ephemeral: true });
            return;
        }

        const channel = interaction.channel as TextChannel;

        if (!channel.permissionsFor(client.user!)?.has("ManageMessages")) {
            await interaction.reply({ content: "❌ Je n'ai pas la permission de gérer les messages.", ephemeral: true });
            return;
        }

        try {
            await channel.bulkDelete(amount, true); // true pour ignorer les messages >14 jours
            
            //const reply = await interaction.reply({ content: `✅ ${amount} messages supprimés.`, ephemeral: false });
            const bot = client.user;

            const embed = await createEmbed({
                title: `${bot?.username}`,
                description: `✅ ${amount} messages supprimés.`,
                color: 0x5865f2,
                thumbnail: bot?.displayAvatarURL({ size: 1024 }),
                timestamp: true,
            });

            const replyMessage = await interaction.reply({ embeds: [embed], ephemeral: false, fetchReply: true });
            
            // Supprime ce message après 5 secondes (5000 ms)
            setTimeout(() => replyMessage.delete().catch(() => {}), 5000);

            Logger.command(`(${interaction.guild}) - Commande ${interaction.commandName} exécutée par ${interaction.user.tag} dans #${channel.name}.`);
        } catch (err) {
            console.error(err);
            await interaction.reply({ content: "❌ Impossible de supprimer les messages.", ephemeral: true });
        }
    },
});

export default clearCommand;