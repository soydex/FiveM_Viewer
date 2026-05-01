/**
 * Cleans FiveM color codes from a string
 * Ex: "^2Hello ^0World" becomes "Hello World"
 */
export function cleanFiveMColors(text: string): string {
  if (!text) return "";
  return text.replace(/\^\d/g, "");
}

/**
 * Extracts Discord information from server variables
 */
export function extractDiscordLink(
  vars: Record<string, unknown> | undefined,
): string | undefined {
  if (!vars?.Discord || typeof vars.Discord !== "string") return undefined;

  // Clean color codes and extract the link
  const discordText = cleanFiveMColors(vars.Discord);
  const discordMatch = discordText.match(/https:\/\/discord\.gg\/[^\s]+/);
  return discordMatch ? discordMatch[0] : undefined;
}

/**
 * Extracts Steam/Discord information from a player's identifiers
 */
export function extractSocialLinks(identifiers: string[]): {
  steam?: string;
  discord?: string;
} {
  const links: { steam?: string; discord?: string } = {};

  if (!identifiers) return links;

  for (const id of identifiers) {
    if (id.startsWith("steam:")) {
      const steamId = id.replace("steam:", "");
      try {
        links.steam = `https://steamcommunity.com/profiles/${BigInt(
          "0x" + steamId,
        ).toString()}`;
      } catch (e) {
        console.warn("Invalid Steam ID:", steamId);
      }
    } else if (id.startsWith("discord:")) {
      const discordId = id.replace("discord:", "");
      links.discord = `https://discord.com/users/${discordId}`;
    }
  }

  return links;
}
