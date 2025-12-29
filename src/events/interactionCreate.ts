import { Events } from "discord.js";
import type { Interaction } from "discord.js";
import type { BotClient } from "../structures/BotClient";
import { PermissionHandler } from "../utils/permissionManager/PermissionHandler";

export default {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction, client: BotClient){
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        // 🔑 Vérification permissions via le handler
        if (await PermissionHandler.ensurePermissions(interaction, command.permissions)) return;

        try {
            await command.execute(client, interaction);
        } catch(err) {
            console.error(err);
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply("❌ Une erreur est survenue.");
            } else {
                await interaction.reply({ content: "❌ Une erreur est survenue.", ephemeral: true });
            }
        }
    },
};