import type { ClientEvents } from "discord.js";
import type { BotClient } from "../structures/BotClient";

export interface BotEvent<K extends keyof ClientEvents = keyof ClientEvents> {
    name: K;
    once?: boolean;
    execute: (...args: [...ClientEvents[K], BotClient]) => Promise<void>;
}