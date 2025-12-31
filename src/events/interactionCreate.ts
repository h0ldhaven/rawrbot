import { Events } from "discord.js";
import type { Interaction } from "discord.js";
import type { BotClient } from "../structures/BotClient";
import { PermissionHandler } from "../utils/permissionManager/PermissionHandler";
import { sendInteractionMessage } from "../utils/messageManager/InteractionMessage";
import { Logger } from "../utils/loggerManager/Logger";

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
            Logger.error(`Erreur: ${err}`);
            await sendInteractionMessage({
                target: interaction,
                content: "❌ Une erreur est survenue.",
                flags: ["Ephemeral"]
            });
        }
    },
};