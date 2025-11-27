import "dotenv/config";
import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import type { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import type { Command } from "../types/Command";

async function main() {
    // ⚙️ Récupère les infos du .env
    const token = process.env.DISCORD_TOKEN!;
    const clientId = process.env.CLIENT_ID!;
    const guildId = process.env.GUILD_ID!; // pour du test rapide

    // Crée une instance du REST client Discord
    const rest = new REST({ version: "10" }).setToken(token);

    // 📁 Charge toutes les commandes
    const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];

    const commandsPath = path.join(process.cwd(), "src", "commands");
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const importedModule = await import(filePath);
        const command = importedModule.default as Command;

        if (command?.data && typeof command.execute === "function") {
            commands.push(command.data.toJSON());
        } else {
            console.warn(`⚠️ Commande invalide ignorée : ${file}`);
        }
    }

    // 🚀 Déploie les commandes
    try {
        console.log(`🔁 Déploiement de ${commands.length} commandes...`);
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );
        console.log(`✅ ${Array.isArray(data) ? data.length : 0} commandes enregistrées !`);
    } catch (error) {
        console.error("❌ Erreur de déploiement :", error);
    }
}

// exécute la fonction async
main();