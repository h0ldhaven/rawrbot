import type { Command } from "../types/Command";
import { buildSlashCommand, CommandOption } from "./SlashCommandBuilder";

export function createCommand(command: Omit<Command, "data"> & { options?: CommandOption[] }): Command {
    return {
        ...command,
        data: buildSlashCommand(command),
    };
}