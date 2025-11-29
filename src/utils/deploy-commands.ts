import "dotenv/config";
import { REST, Routes } from "discord.js";
import type { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import type { Command } from "../types/Command";

import * as Commands  from "../commands";

export async function deployCommandsGlobal() {
    // ⚙️ Récupère les infos du .env
    const token = process.env.DISCORD_TOKEN!;
    const clientId = process.env.CLIENT_ID!;

    // Crée une instance du REST client Discord
    const rest = new REST({ version: "10" }).setToken(token);

    // 📁 Charge toutes les commandes
    const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];

    for (const mod of Object.values(Commands)) {
    const command = mod as Command;
    if (command?.data && typeof command.execute === "function") {
      commands.push(command.data.toJSON());
    }
  }

    // 🚀 Déploie les commandes
    try {
        console.log(`🔁 Déploiement de ${commands.length} commandes...`);
        const data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands }
        );
        console.log(`✅ ${Array.isArray(data) ? data.length : 0} commandes enregistrées !`);
    } catch (error) {
        console.error("❌ Erreur de déploiement :", error);
    }
};