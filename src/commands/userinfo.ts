import type { ChatInputCommandInteraction, GuildMember, User, TextChannel, Activity } from "discord.js";
import type { BotClient } from "../structures/BotClient";
import type { Command } from "../types/Command";
import { createCommand } from "../utils/commandManager/CommandFactory";
import { Logger } from "../utils/loggerManager/Logger";
import { createEmbed } from "../utils/embedManager/EmbedFactory";


const userInfo: Command = createCommand({
    name: "userinfo",
    description: "Affiche les informations sur un utilisateur ou via un ID",
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

        const userId = input.match(/^<@!?(\d+)>$/)?.[1] ?? input;
        const user = (await client.users.fetch(userId).catch(() => null)) || null;

        if (!user) {
            await interaction.reply({
                content: `❌ Aucun utilisateur trouvé pour \`${input}\``,
                ephemeral: true,
            });
            return;
        }

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

        const embed = await buildUserEmbed(client, user, member, isBanned);

        // Si un salon est précisé, on y envoie le message
        if (targetChannel && targetChannel.isTextBased()) {
            await targetChannel.send({ embeds: [embed] });
            await interaction.reply({
                content: `✅ Commande envoyée dans ${targetChannel}`,
                ephemeral: false,
            });
            Logger.command(`(${interaction.guild}) - Commande ${interaction.commandName} exécutée par ${interaction.user.tag} dans #${targetChannel.name}.`);
        } else {
            // Sinon, on envoie dans le salon actuel
            await interaction.reply({ embeds: [embed] });
        }

        const channel = interaction.channel as TextChannel;
        Logger.command(`(${interaction.guild}) - Commande ${interaction.commandName} exécutée par ${interaction.user.tag} dans #${channel.name}.`);
    },
});

export default userInfo;

// ===================== //
// ====== EMBED ======== //
// ===================== //

export async function buildUserEmbed(
  client: BotClient,
  user: User,
  member: GuildMember | null,
  isBanned = false
) {
  // Rafraîchir le user pour avoir les flags / banner à jour
  const fetchedUser = await client.users.fetch(user.id).catch(() => user);

  // Flags / badges
  const badges = fetchedUser.flags?.toArray?.() ?? [];

  // Banner et accent
  const bannerUrl = fetchedUser.bannerURL?.({ size: 1024 }) ?? null;
  const accentColor = fetchedUser.accentColor ?? undefined;

  // Presence / activités (uniquement si membre et intents)
  const presence = member?.presence;
  const status = presence?.status ?? "offline";
  const activities = presence?.activities ?? [];

  const activityText = activities.length
    ? activities
        .map(a => {
          const name = a.name ?? "";
          const type = a.type !== undefined ? a.type.toString() : "";
          const details = (a as Activity).details ? ` — ${(a as Activity).details}` : "";
          const state = (a as Activity).state ? ` (${(a as Activity).state})` : "";
          return `${name}${type}${details}${state}`;
        })
        .join("\n")
    : "Aucune activité détectée";

  // Roles & permissions si membre
  const roles = member
    ? member.roles.cache
        .filter(r => r.id !== member.guild.id)
        .map(r => `<@&${r.id}>`)
        .join(", ") || "Aucun rôle"
    : "Utilisateur non membre du serveur";

  const perms = member ? member.permissions.toArray().join(", ") || "Aucune permission spéciale" : "N/A";

  // Vocal
  const voiceChannel = member?.voice?.channel ? `<#${member.voice.channel.id}>` : "Pas en vocal";

  // Timestamps
  const createdTs = Math.floor(fetchedUser.createdTimestamp / 1000);
  const joinedTs = member?.joinedTimestamp ? Math.floor(member.joinedTimestamp / 1000) : null;

  const fields = [
    { name: "🆔 ID", value: fetchedUser.id, inline: true },
    { name: "🏷️ Tag", value: fetchedUser.tag, inline: true },
    { name: "🤖 Bot ?", value: fetchedUser.bot ? "Oui" : "Non", inline: false },
    { name: "📅 Compte créé le", value: `<t:${createdTs}:F> (<t:${createdTs}:R>)`, inline: false },
    { name: "🚫 Banni du serveur ?", value: isBanned ? "Oui" : "Non", inline: false },
  ];

  if (!isBanned) {
    fields.push(
        { name: "📥 Rejoint le serveur", value: joinedTs ? `<t:${joinedTs}:F> (<t:${joinedTs}:R>)` : "N/A", inline: false },
        { name: "📂 Rôles", value: roles, inline: false },
        { name: "🔒 Permissions (guild)", value: perms, inline: false },
        { name: "🎨 Couleur affichée", value: member?.displayHexColor ?? (accentColor ? `#${accentColor.toString(16)}` : "N/A"), inline: true },
        { name: "🧩 Statut", value: status, inline: true },
        { name: "🎮 Activité", value: activityText, inline: true },
        { name: "🔊 Vocal", value: voiceChannel, inline: true },
    );
  }

  fields.push({ name: "🏷️ Badges", value: badges.length ? badges.join(", ") : "Aucun", inline: false });

  const embed = createEmbed({
    title: `👤 Informations sur ${fetchedUser.tag}`,
    thumbnail: fetchedUser.displayAvatarURL({ size: 1024 }),
    color: member?.displayHexColor ?? accentColor ?? 0x5865f2,
    fields,
    image: bannerUrl ?? undefined,
    timestamp: true,
  });

  return embed;
}