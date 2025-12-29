import type {
    ChatInputCommandInteraction, 
    InteractionReplyOptions, 
    InteractionEditReplyOptions, 
    EmbedBuilder, 
    MessageActionRowComponent,
    TextBasedChannel,
    MessageCreateOptions,
    Message
} from "discord.js";
import { MessageFlags } from "discord.js";

type MessageTarget =
  | ChatInputCommandInteraction
  | TextBasedChannel;

interface SendMessageParams {
    target: MessageTarget;
    content?: string;
    flags?: (keyof typeof MessageFlags)[];
    embeds?: EmbedBuilder[];
    components?: MessageActionRowComponent[];
}

/**
 * Type guard permettant de déterminer si une cible est une
 * ChatInputCommandInteraction.
 *
 * Après validation, TypeScript sait que la cible :
 * - supporte reply()
 * - supporte editReply()
 * - expose les états replied / deferred
 *
 * À utiliser pour distinguer une réponse d'interaction
 * d'un envoi de message classique (channel.send).
 *
 * @param target Cible inconnue à tester
 * @returns true si la cible est une ChatInputCommandInteraction
 */
function isInteraction(target: unknown): target is ChatInputCommandInteraction {
  return (typeof target === "object" && target !== null && "reply" in target && "editReply" in target);
}

/**
 * Type guard permettant de déterminer si une cible est un
 * canal textuel capable d'envoyer un message via send().
 *
 * Après validation, TypeScript sait que la cible :
 * - supporte send(MessageCreateOptions)
 * - retourne une Promise<Message>
 *
 * Compatible avec :
 * - TextChannel
 * - ThreadChannel
 * - DMChannel
 * - tout canal textuel Discord.js implémentant send()
 *
 * @param target Cible inconnue à tester
 * @returns true si la cible peut envoyer un message
 */
function isSendableChannel(target: unknown): target is TextBasedChannel & { send(options: MessageCreateOptions): Promise<Message> } {
    return (typeof target === "object" && target !== null && "send" in target && typeof (target as { send?: unknown}).send === "function");
}

/**
 * Helper générique pour répondre à une interaction.
 * Gère reply / editReply automatiquement.
 * @param target Interaction à répondre
 * @param content Texte du message
 * @param flags Tableau des flags à appliquer (ex: ["Ephemeral", "Crossposted"])
 */
export async function sendInteractionMessage(params: SendMessageParams): Promise<Message> {
    const { target, content, flags, embeds, components } = params;

    // Convertir les noms de flags en BitField
    const resolvedFlags = flags?.reduce((acc, flag) => acc | Number(MessageFlags[flag]), 0);

    if (isInteraction(target)) {
        if (target.replied || target.deferred) {
            const editOptions: InteractionEditReplyOptions = { content, embeds, components };
            await target.editReply(editOptions);
        } else {
            const replyOptions: InteractionReplyOptions = { 
                content,
                embeds,
                components,
                flags: resolvedFlags
            };
            await target.reply(replyOptions);
        }
        return await target.fetchReply();
    } else if (isSendableChannel(target)) {
        return await target.send({
            content,
            embeds,
            components
        });
    } else {
        throw new Error("Target incompatible avec sendInteractionMessage");
    }
}