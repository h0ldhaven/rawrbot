import type { Command } from "../../types/Command";
import type { CommandOption } from "./SlashCommandBuilder";
import { buildSlashCommand } from "./SlashCommandBuilder";

export function createCommand(command: Omit<Command, "data"> & { options?: CommandOption[] }): Command {
    return {
        ...command,
        data: buildSlashCommand(command),
    };
}