import type { BotClient } from "../structures/BotClient";
import type { User } from "discord.js";

const MENTION_REGEX = /^<@!?(\d+)>$/;
const ID_REGEX = /^\d+$/;

export type ResolveUserError = "INVALID_INPUT" | "NOT_FOUND";

export async function resolveUser(
    client: BotClient,
    input: string
): Promise<
  | { ok: true; user: User }
  | { ok: false; reason: ResolveUserError }
> {
    let userId: string | null = null;

    // mention <@123> ou <@!123>
    const mentionMatch = input.match(MENTION_REGEX);
    if (mentionMatch) {
        userId = mentionMatch[1];
    }

    // ID brut
    if (!userId && ID_REGEX.test(input)) {
        userId = input;
    }

    if (!userId) {
        return { ok: false, reason: "INVALID_INPUT" };
    }

    try {
        const user = await client.users.fetch(userId);
        return { ok: true, user };
    } catch {
        return { ok: false, reason: "NOT_FOUND" };
    }
}