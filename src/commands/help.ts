import type { ChatInputCommandInteraction, User, TextChannel  } from "discord.js";
import type { BotClient } from "../structures/BotClient";
import type { Command } from "../types/Command";
import { PermissionFlagsBits } from "discord.js";
import { Logger } from "../utils/loggerManager/Logger";
import { createCommand } from "../utils/commandManager/CommandFactory";
import { createEmbed } from "../utils/embedManager/EmbedFactory";
import { sendInteractionMessage } from "../utils/messageManager/InteractionMessage";

const HelpCommand: Command = createCommand({
    name: "help",
    description: "Affiche la liste des commandes disponibles du bot",
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
        const embed = await buildHelpEmbed(client, interaction.user, interaction);

        if (targetChannel && targetChannel.isTextBased()) {
            // send the message / embed to the targeted channel
            await sendInteractionMessage({
                target: targetChannel,
                embeds: [embed]
            });

            // reply to the user who sent the command
            await sendInteractionMessage({
                target: interaction,
                content: `📘 Liste des commandes envoyée dans ${targetChannel}.`,
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

export default HelpCommand;

export async function buildHelpEmbed(client: BotClient, user: User, interaction?: ChatInputCommandInteraction) {
    if (!client.user) throw new Error("Le bot n'est pas prêt.");

    // Filtrer les commandes que l'utilisateur peut utiliser
    const allowedCommands = client.commands.filter(cmd => {
        if (!cmd.permissions?.length) return true; // Pas de perms requises, tout le monde peut
        if (!interaction?.memberPermissions) return false; // impossible de vérifier -> cacher
        // Vérifie que l'utilisateur possède toutes les permissions requises
        return cmd.permissions.every(p => interaction.memberPermissions!.has(PermissionFlagsBits[p]));
    });

    const fields = allowedCommands.map((cmd: Command) => {
        let usage = `/${cmd.name}`;
        const options = (cmd.data.toJSON().options ?? []).map(opt => ({
            name: opt.name,
            required: opt.required ?? false
        }));

        if (options.length) {
            const args = options.map(opt => opt.required ? `<${opt.name}>` : `[${opt.name}]`);
            usage += ` ${args.join(" ")}`;
        }

        const perms = cmd.permissions?.length
            ? cmd.permissions.map(p => `\`${p}\``).join(", ")
            : "Aucune";

        return {
            name: usage,
            value: `**Description:** ${cmd.description || "Aucune"}\n**Permissions:** ${perms}`
        };
    });

    return createEmbed({
        title: "📖 Liste des commandes disponibles",
        description: "Voici toutes les commandes que tu peux utiliser :\n`< > = obligatoire, [ ] = optionnel`",
        color: 0x5865f2,
        fields,
        footer: { text: `Demandé par ${user.username}` },
        timestamp: true
    });
}