/**
 * Assignment 1 — Unique Active Names
 *
 * Context:
 * You are given a list of user records and need to produce a clean list of
 * unique names for users who are currently active. This is a common data
 * cleaning step before reporting or further processing.
 *
 * Input:
 *  - users: Array<{ id: string; name: string; active: boolean }>
 *    The array may be empty and can contain duplicate names and ids.
 * Output:
 *  - string[] — unique names of users where active === true, sorted ascending
 *    (case-sensitive, standard lexicographic order).
 *
 * Examples:
 *  - uniqueActiveNames([{id:'1',name:'Ana',active:true},{id:'2',name:'Ana',active:true}]) -> ['Ana']
 *  - uniqueActiveNames([]) -> []
 */
export function uniqueActiveNames(
  users: Array<{ id: string; name: string; active: boolean }>): string[] {
  let uniqueName: Array<string> = [];

  if (users.length === 0) return [];
  // filter only active members
  let activeMember =
    users
      .filter(user => (user.active === true))
      .map(n => n.name)

  let dedupped = Array.from(new Set(activeMember))
  return dedupped;
}
