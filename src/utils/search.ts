export type SearchMode = "contains" | "startsWith" | "endsWith";

/**
 * Centralized search function — supports multiple search modes
 */
export function checkPlayerMatch(
  playerName: string,
  term: string,
  mode: SearchMode,
): boolean {
  if (!term.trim()) return true;
  
  const name = playerName.toLowerCase();
  const search = term.toLowerCase();
  
  switch (mode) {
    case "startsWith":
      return name.startsWith(search);
    case "endsWith":
      return name.endsWith(search);
    case "contains":
    default:
      return name.includes(search);
  }
}
