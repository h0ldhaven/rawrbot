import type { ChatInputCommandInteraction } from "discord.js";
import { PermissionFlagsBits } from "discord.js";

export class PermissionHandler {
  static checkPermissions(
    interaction: ChatInputCommandInteraction,
    requiredPerms: (keyof typeof PermissionFlagsBits)[]
  ): string[] {
    if (!interaction.memberPermissions) return requiredPerms;
    return requiredPerms.filter(perm => !interaction.memberPermissions!.has(PermissionFlagsBits[perm]));
  }

  static async ensurePermissions(
    interaction: ChatInputCommandInteraction,
    requiredPerms: (keyof typeof PermissionFlagsBits)[]
  ): Promise<boolean> {
    const missing = this.checkPermissions(interaction, requiredPerms);
    if (missing.length === 0) return false;

    await interaction.reply({
      embeds: [{
        title: "❌ Permissions insuffisantes",
        description: `Il vous manque : ${missing.join(", ")}`,
        color: 0xff0000,
      }],
      ephemeral: true,
    });

    return true; // stop la commande
  }
}