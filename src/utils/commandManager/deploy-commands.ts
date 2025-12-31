import "dotenv/config";
import { REST, Routes } from "discord.js";
import type { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import type { Command } from "../../types/Command";

import { hashCommand } from "./commandHash";
import { getDeployedHash, setDeployedHash } from "./commandState";

import * as Commands  from "../../commands";

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

    const currentHash = hashCommand(commands);
    const deployedHash = getDeployedHash();

    if (currentHash === deployedHash) {
      console.log(`⏩ Commandes inchangées, aucun déploiement nécessaire (${commands.length} commandes)`);
      return;
    }

    console.log(`🔁 Changements détectés, déploiement de ${commands.length} commandes…`);

    await rest.put(Routes.applicationCommands(clientId),{
      body: commands
    });

    setDeployedHash(currentHash);
    console.log("✅ Commandes déployées et hash mis à jour");
};