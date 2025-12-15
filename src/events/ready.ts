import type { ActivityType, PresenceData } from "discord.js";
import { Events } from "discord.js";
import type { BotClient } from "../structures/BotClient";
import { Logger } from "../utils/Logger";

interface BotConfig {
  username?: string;
  avatarUrl?: string;
  status?: "online" | "idle" | "dnd" | "invisible";
  activity?: {
    name?: string;
    type?: ActivityType | number;
    state?: string;
  };
}

const BOT_VERSION_PREFIX: string = process.env.BOT_VERSION_PREFIX ?? "Version";
const BOT_VERSION_NUMBER: string = process.env.BOT_VERSION_NUMBER ?? "_._._";
const BOT_VERSION_MESSAGE: string = process.env.BOT_VERSION_MESSAGE ?? "Hi, I'm a good bot !";

const activityLabel = `${BOT_VERSION_PREFIX} ${BOT_VERSION_NUMBER} — ${BOT_VERSION_MESSAGE}`;

const botConfig: BotConfig = {
    status: "online",
    activity: {
        name: activityLabel,
        type: 4,
    },
};

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client: BotClient) {
        if (!client.user) return;
        const status = botConfig.status ?? "online";

        try {
            // Construire directement le tableau d'activités
            const activities = botConfig.activity?.name && botConfig.activity?.type
                ? [{ name: botConfig.activity.name, type: botConfig.activity.type }]
                : [];

            const presenceData: PresenceData = {
                status,
                activities,
            };

            await client.user.setPresence(presenceData);

            Logger.info(`💡 Status défini sur "${status}"`);

            if (botConfig.activity) {
                Logger.info(`🎮 Activité définie : ${botConfig.activity.type}, ${botConfig.activity.name}`);
            }

            console.log("change this text 1");
            console.log("change this text 2");
            console.log("Server Started");
            Logger.info(`✅ Connecté en tant que ${client.user?.tag}`);

        } catch (err) {
            Logger.error(`Erreur lors de la configuration du bot : ${err}`);
        }
    },
};