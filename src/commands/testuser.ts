import type { ChatInputCommandInteraction, GuildMember, User, TextChannel } from "discord.js";
import type { BotClient } from "../structures/BotClient";
import type { Command } from "../types/Command";
import { createCommand } from "../utils/commandManager/CommandFactory";
import { Logger } from "../utils/loggerManager/Logger";
import { createEmbed } from "../utils/embedManager/EmbedFactory";
import { resolveUser } from "../utils/userManager/userResolver";
import { sendInteractionMessage } from "../utils/messageManager/InteractionMessage";


const testUser: Command = createCommand({
    name: "testuser",
    description: "Test un utilisateur et retourne ses info de base si trouvé",
    permissions: ["BanMembers"],
    options: [
        {
            type: "string",
            name: "target",
            description: "Mentionne un utilisateur ou entre son ID",
            required: true,
        },
        {
            type: "channel",
            name: "salon",
            description: "Salon où envoyer l'information (optionnel)",
            required: false,
        },
    ],

    execute: async (client: BotClient, interaction: ChatInputCommandInteraction) => {
        const input = interaction.options.getString("target", true);
        const targetChannel = interaction.options.getChannel("salon") as TextChannel | null;
        
        const result = await resolveUser(client, input);

        if (!result.ok) {
            const message = result.reason === "INVALID_INPUT"
                ? "❌ Format invalide. Utilise une mention ou un ID."
                : `❌ Aucun utilisateur trouvé pour \`${input}\``;

            await sendInteractionMessage({
                target: interaction,
                content: message,
                flags: ["Ephemeral"]
            });
            
            return;
        }

        const user = result.user;

        const member = (await interaction.guild?.members
            .fetch(user.id)
            .catch(() => null)) ?? null;

        // Vérification si banni
        let isBanned = false;
        if (interaction.guild) {
            isBanned = await interaction.guild.bans.fetch(user.id)
                .then(() => true)
                .catch(() => false);
        }

        const embed = await buildUserTestEmbed(user, member, isBanned);

        if (targetChannel && targetChannel.isTextBased()) {
            // send the message / embed to the targeted channel
            await sendInteractionMessage({
                target: targetChannel,
                embeds: [embed]
            });

            // reply to the user who sent the command
            await sendInteractionMessage({
                target: interaction,
                content: `✅ Commande envoyée dans ${targetChannel}`,
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

export default testUser;

// ===================== //
// ====== EMBED ======== //
// ===================== //

export async function buildUserTestEmbed(
  user: User,
  member: GuildMember | null,
  isBanned = false
) {

  // Banner et accent
  const bannerUrl = user.bannerURL?.({ size: 1024 }) ?? null;
  const accentColor = user.accentColor ?? undefined;


  // Timestamps
  const createdTs = Math.floor(user.createdTimestamp / 1000);

  const fields = [
    { name: "🆔 ID", value: user.id, inline: true },
    { name: "🏷️ Tag", value: user.tag, inline: true },
    { name: "🚫 Banni du serveur ?", value: isBanned ? "Oui" : "Non", inline: false },
    { name: "🤖 Bot ?", value: user.bot ? "Oui" : "Non", inline: true },
    { name: "📅 Compte créé le", value: `<t:${createdTs}:F> (<t:${createdTs}:R>)`, inline: false },
  ];

  const embed = createEmbed({
    title: `👤 Utilisateur trouvé : ${user.tag}`,
    thumbnail: user.displayAvatarURL({ size: 1024 }),
    color: member?.displayHexColor ?? accentColor ?? 0x5865f2,
    fields,
    image: bannerUrl ?? undefined,
    timestamp: true,
  });

  return embed;
}