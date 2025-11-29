import type { ActivityType, PresenceData } from "discord.js";
import { Events } from "discord.js";
import type { BotClient } from "../structures/BotClient";

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

const botConfig: BotConfig = {
    status: "online",
    activity: {
        name: "Version 0.3.0 — En cours de développement ⚙️",
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

            console.log(`💡 Status défini sur ${status}`);
            if (botConfig.activity) {
                console.log(
                `🎮 Activité définie : ${botConfig.activity.type} ${botConfig.activity.name}`
                );
            }

            console.log("change this text 1");
            console.log("change this text 2");
            console.log("Server Started");
            console.log(`✅ Connecté en tant que ${client.user?.tag}`);

        } catch (err) {
            console.error("Erreur lors de la configuration du bot :", err);
        }
    },
};