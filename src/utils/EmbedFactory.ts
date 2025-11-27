import type { APIEmbedField } from "discord.js";
import { EmbedBuilder } from "discord.js";

interface EmbedOptions {
  title?: string;
  description?: string;
  color?: number | `#${string}`;
  thumbnail?: string;
  image?: string;
  fields?: (APIEmbedField | { name: string; value: string; inline?: boolean })[];
  timestamp?: boolean | Date;
  footer?: { text: string; iconURL?: string };
}

export function createEmbed(options: EmbedOptions): EmbedBuilder {
  const embed = new EmbedBuilder();

  // Mappage automatique des propriétés sur les méthodes EmbedBuilder
  const setters: Record<
    keyof Omit<EmbedOptions, "color" | "fields" | "timestamp">,
    (value: string | { text: string; iconURL?: string }) => void
  > = {
    title: v => embed.setTitle(v as string),
    description: v => embed.setDescription(v as string),
    thumbnail: v => embed.setThumbnail(v as string),
    image: v => embed.setImage(v as string),
    footer: v => embed.setFooter(v as { text: string; iconURL?: string }),
  };

  type SimpleField = {
    name: string; 
    value: string; 
    inline?: boolean
  };

  function isSimpleField(f: APIEmbedField | SimpleField): f is SimpleField {
    return "name" in f && "value" in f;
  }

  for (const [key, value] of Object.entries(options)) {
    if (value == null) continue;

    if (key === "color") {
      if (typeof value === "string" && value.startsWith("#")) {
        embed.setColor(parseInt(value.slice(1), 16));
      } else {
        embed.setColor(value as number);
      }
    } else if (key === "fields") {
      const formattedFields = (value as (APIEmbedField | SimpleField)[]).map(f =>
        isSimpleField(f) ? { name: f.name, value: f.value, inline: f.inline ?? false } : f
      );
      embed.addFields(formattedFields);
    } else if (key === "timestamp") {
      embed.setTimestamp(value === true ? undefined : (value as Date));
    } else if (key in setters) {
      setters[key as keyof typeof setters](value as string | { text: string; iconURL?: string });
    }
  }

  return embed;
}