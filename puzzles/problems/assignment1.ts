/**
 * File Extension Counter — Tally filenames by their extensions
 *
 * You are given a list of filenames and must count how many files have each extension.
 * The extension is defined as the substring after the last dot if there is at least one
 * character before that dot; otherwise, the file is considered to have no extension.
 * The empty extension is represented by the empty string "". Extensions are compared
 * case-insensitively (normalized to lowercase in the output).
 *
 * Input: `filenames: string[]` — any strings; leading/trailing spaces are ignored per name
 * Output: `Record<string, number>` — map of normalized extension => count (0 omitted)
 *
 * Examples:
 * - countByExtension(["a.txt", "b.TXT", "README"]) -> { txt: 2, "": 1 }
 * - countByExtension([".env", "archive.tar.gz", "name."]) -> { "": 2, gz: 1 }
 */
export function countByExtension(filenames: string[]): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const raw of filenames) {
    const name = raw.trim();
    // Determine extension by the last dot if there is at least one char before it
    const lastDot = name.lastIndexOf(".");
    let ext = "";

    if (lastDot > 0 && lastDot < name.length - 1) {
      ext = name.slice(lastDot + 1).toLowerCase();
    } else {
      // cases: no dot, dot is first character, or trailing dot => no extension
      ext = "";
    }

    counts[ext] = (counts[ext] ?? 0) + 1;
  }

  return counts;
}
