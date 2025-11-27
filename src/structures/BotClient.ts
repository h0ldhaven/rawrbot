import { Client, Collection, GatewayIntentBits } from "discord.js";
import type { Command } from "../types/Command";

export class BotClient extends Client {
    public commands: Collection<string, Command>;

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
            ],
        });

        this.commands = new Collection();
    }
}