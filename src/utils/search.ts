export type SearchMode = "contains" | "startsWith" | "endsWith" | "id";

/**
 * Centralized search function — supports multiple search modes
 */
export function checkPlayerMatch(
  player: { name: string; id: number | string },
  term: string,
  mode: SearchMode,
): boolean {
  if (!term.trim()) return true;

  const search = term.toLowerCase();

  if (mode === "id") {
    return player.id.toString() === term.trim();
  }

  const name = player.name.toLowerCase();
  switch (mode) {
    case "startsWith":
      return name.startsWith(search);
    case "endsWith":
      return name.endsWith(search);
    default:
      return name.includes(search);
  }
}
