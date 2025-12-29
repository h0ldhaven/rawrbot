import type { BotEvent } from "./types/Event";
import type { Command } from "./types/Command";
import type { ClientEvents } from "discord.js";

import "dotenv/config";
import { BotClient } from "./structures/BotClient";
import { Logger } from "./utils/loggerManager/Logger";

import * as Commands from "./commands";
import * as Events from "./events";

import { deployCommandsGlobal } from "./utils/commandManager/deploy-commands";

const client = new BotClient();

function hasOnce<K extends keyof ClientEvents>(
  evt: BotEvent<K>
): evt is BotEvent<K> & { once: true } {
  return evt.once === true;
}

async function main() {
  await deployCommandsGlobal();
  
  // ====== COMMANDES ======
  for (const cmd of Object.values(Commands) as Command[]) {
    if (cmd?.data) {
      client.commands.set(cmd.data.name, cmd);
      Logger.command(`Commande chargée: ${cmd.data.name}`);
    }
  }

  // ====== EVENTS ======
  for (const evt of Object.values(Events) as BotEvent<keyof ClientEvents>[]) {
    if (!evt || !evt.name || !evt.execute) continue;
    if (hasOnce(evt)) {
      client.once(evt.name, (...args) => evt.execute(...args, client));
    } else {
      client.on(evt.name, (...args) => evt.execute(...args, client));
    }
  }

  client.login(process.env.DISCORD_TOKEN);
}

main().catch(console.error);