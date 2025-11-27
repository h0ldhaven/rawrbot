import { EmbedBuilder, APIEmbedField } from "discord.js";

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
  const setters: Record<string, (value: any) => void> = {
    title: (v: string) => embed.setTitle(v),
    description: (v: string) => embed.setDescription(v),
    thumbnail: (v: string) => embed.setThumbnail(v),
    image: (v: string) => embed.setImage(v),
    footer: (v: { text: string; iconURL?: string }) => embed.setFooter(v),
  };

  for (const [key, value] of Object.entries(options)) {
    if (value == null) continue;

    if (key === "color") {
      if (typeof value === "string" && value.startsWith("#")) {
        embed.setColor(parseInt(value.slice(1), 16));
      } else {
        embed.setColor(value as number);
      }
    } else if (key === "fields") {
      const formattedFields = (value as any[]).map(f =>
        "name" in f && "value" in f ? f : { name: f.name, value: f.value, inline: f.inline ?? false }
      );
      embed.addFields(formattedFields);
    } else if (key === "timestamp") {
      embed.setTimestamp(value === true ? undefined : (value as Date));
    } else if (setters[key]) {
      setters[key](value);
    }
  }

  return embed;
}