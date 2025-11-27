import { 
  SlashCommandBuilder,
  ApplicationCommandOptionBase,
  SlashCommandNumberOption,
  SlashCommandIntegerOption,
  SlashCommandStringOption,
  PermissionFlagsBits,
} from "discord.js";
import type { Command } from "../types/Command";

export type CommandOption = {
  type: 
    | "string" 
    | "user" 
    | "number" 
    | "integer" 
    | "boolean" 
    | "channel" 
    | "role" 
    | "mentionable" 
    | "attachment";
  name: string;
  description: string;
  required?: boolean;
  minValue?: number;
  maxValue?: number;
  choices?: { name: string; value: string | number }[];
};

export function buildSlashCommand(
  cmd: Pick<Command, "name" | "description" | "permissions"> & { options?: CommandOption[] }
): SlashCommandBuilder {

    const builder = new SlashCommandBuilder()
      .setName(cmd.name)
      .setDescription(cmd.description);

    if (cmd.permissions?.length) {
      const bitfield = cmd.permissions
        .map(p => PermissionFlagsBits[p])
        .reduce((acc, curr) => acc | curr, 0n);
        builder.setDefaultMemberPermissions(bitfield);
    }

    if (cmd.options) {
      for (const opt of cmd.options) {
        switch (opt.type) {
          case "user":
            builder.addUserOption(o => baseOption(o, opt));
            break;
          case "string":
            builder.addStringOption(o => baseOption(o, opt));
            break;
          case "number":
            builder.addNumberOption(o => baseOption(o, opt));
            break;
          case "integer":
            builder.addIntegerOption(o => baseOption(o, opt));
            break;
          case "boolean":
            builder.addBooleanOption(o => baseOption(o, opt));
            break;
          case "channel":
            builder.addChannelOption(o => baseOption(o, opt));
            break;
          case "role":
            builder.addRoleOption(o => baseOption(o, opt));
            break;
          case "mentionable":
            builder.addMentionableOption(o => baseOption(o, opt));
            break;
          case "attachment":
            builder.addAttachmentOption(o => baseOption(o, opt));
            break;
        }
      }
    }
    return builder;

}

function baseOption<T extends ApplicationCommandOptionBase>(
  option: T,
  opt: CommandOption
): T {
  option
    .setName(opt.name)
    .setDescription(opt.description)
    .setRequired(opt.required ?? true);

  // Min/Max pour number/integer
  if (opt.type === "number" || opt.type === "integer") {
    const numOption = option as unknown as
      | SlashCommandNumberOption
      | SlashCommandIntegerOption;

    if (opt.minValue !== undefined) numOption.setMinValue(opt.minValue);
    if (opt.maxValue !== undefined) numOption.setMaxValue(opt.maxValue);
  }

  // Choices
  if (opt.choices?.length) {
    switch (opt.type) {
      case "string": {
        const strOption = option as unknown as SlashCommandStringOption;
        strOption.addChoices(
          ...opt.choices.map(c => ({ name: c.name, value: c.value as string }))
        );
        break;
      }
      case "number":
      case "integer": {
        const numOption = option as unknown as
          | SlashCommandNumberOption
          | SlashCommandIntegerOption;
        numOption.addChoices(
          ...opt.choices.map(c => ({ name: c.name, value: c.value as number }))
        );
        break;
      }
    }
  }

  return option;
}