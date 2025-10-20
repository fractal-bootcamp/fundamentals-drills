/**
 * Tag Popularity — Top N tags across posts
 *
 * You maintain posts that each include a set of tags. Given a list of posts and an integer N,
 * compute the top N tags by popularity. A tag counts at most once per post (duplicates within a
 * single post are ignored), and popu(larity is the number of posts containing that tag. Sort the
 * result by: (1) higher count first, then (2) tag name ascending for ties. Return at most N rows.
 * Tags are case‑sensitive strings. If N is 0 or there are no posts, return an empty array.
 *
 * Input: `posts: { id: string; tags: string[] }[]`, `n: number` (>= 0)
 * Output: `{ tag: string; count: number }[]` — top tags by the rules above.
 *
 * Examples:
 * - topTags[
 *     { id: "p1", tags: ["ts", "web", "ts", "dev"] },
 *     { id: "p2", tags: ["web", "db"] },
 *   ], 2) -> [
 *     { tag: "web", count: 2 },
 *     { tag: "ts", count: 1 },
 *   ]
 * - topTags([], 3) -> []
 */
type PostTag = { id: string, tags: string[] }
type Result = { tag: string, count: number }
export function topTags(posts: PostTag[], n: number): Result[] {
  if (n === 0 || posts.length === 0) return [];
  // 1. A tag counts at most once per post (duplicates within a single post are ignored)
  const tagsByPost = posts.map(post => Array.from(new Set(post.tags)))
  const flat = tagsByPost.flat()
  // ['ts', 'web', 'dev', 'web', 'db']
  const freq = flat.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {})
  // {ts: 1, web: 2, dev: 1, db: 1}
  // Convert freq to an array, sort, slice n, and return
  const finalResult = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    //  [['web', 2], ['ts', 1], ['dev', 1], ['db', 1]];
    .slice(0, n)
  // ['web', 2], ['ts', 1]

  let empty = []
  for (let i of finalResult) {
    empty.push(`tag: ${i[0]}, count: ${i[1]}`)
  }

  return empty;
}

console.log(topTags([
  { id: "p1", tags: ["ts", "web", "ts", "dev"] },
  { id: "p2", tags: ["web", "db"] },
], 2))