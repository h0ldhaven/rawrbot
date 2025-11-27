import "dotenv/config";
import { readdirSync } from "fs";
import path from "path";
import { BotClient } from "./structures/BotClient";
import { Logger } from "./utils/Logger";

const client = new BotClient();

async function main() {
  // ====== COMMANDES ======
  const commandFiles = readdirSync(path.join(__dirname, "commands")).filter(f => f.endsWith(".ts"));
  for (const file of commandFiles) {
    const cmd = await import(`./commands/${file}`);
    if (cmd.default?.data && cmd.default?.execute) {
      client.commands.set(cmd.default.data.name, cmd.default);
      Logger.command(`Commande chargée: ${cmd.default.data.name}`);
    }
  }

  // ====== EVENTS ======
  const eventFiles = readdirSync(path.join(__dirname, "events")).filter(f => f.endsWith(".ts"));
  for (const file of eventFiles) {
    const event = await import(`./events/${file}`);
    if (event.default.once) {
      client.once(event.default.name, (...args) => event.default.execute(...args, client));
    } else {
      client.on(event.default.name, (...args) => event.default.execute(...args, client));
    }
  }

  client.login(process.env.DISCORD_TOKEN);
}

main().catch(console.error);