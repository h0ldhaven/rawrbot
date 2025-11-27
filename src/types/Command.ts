import type { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import type { BotClient } from "../structures/BotClient";

export interface Command {
  name: string;
  description: string;
  
  data: SlashCommandBuilder;
  permissions: (keyof typeof PermissionFlagsBits)[];

  execute: (client: BotClient, interaction: ChatInputCommandInteraction) => Promise<void>;
}