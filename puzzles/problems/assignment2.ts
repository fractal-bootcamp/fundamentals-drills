/**
 * Assignment 2 — Storage Quota Manager
 *
 * Context:
 * You are building a tiny storage service that enforces per-user byte quotas. Users can add
 * files (with a name and size in bytes) or remove existing files. Adding a file must not exceed
 * the user’s quota and must not duplicate an existing filename for that user. Removing frees
 * the occupied space. Requests are processed in order.
 *
 * Input/Output (untyped on purpose — model it in your solution):
 * - Input:
 *   - quotas: Record<string, number> — max allowed bytes per user (non-negative integers).
 *   - requests: Array<
 *       | { type: 'add'; user: string; file: string; bytes: number }
 *       | { type: 'remove'; user: string; file: string }
 *     >
 *     - For 'add', `bytes` is an integer >= 0. Zero-byte files are allowed and count toward duplicates.
 * - Output:
 *   {
 *     accepted: Array<{ user: string; file: string }>; // successful adds, in order
 *     rejected: Array<{ user: string; file: string; reason: 'duplicate' | 'quota_exceeded' }>;
 *     state: Record<string, { used: number; files: Record<string, number> }>; // final per-user state
 *   }
 *
 * Rules and edge cases:
 * - Unknown users (not present in `quotas`) are treated as having quota 0.
 * - Adding a file that already exists for a user is rejected with reason 'duplicate'.
 * - An add that would exceed the user’s quota is rejected with reason 'quota_exceeded'.
 * - Removing a non-existent file is ignored (no rejection, no change).
 * - Usernames and filenames are case-sensitive.
 *
 * Examples:
 * - quotas = { alice: 5 }, requests = [
 *     { type: 'add', user: 'alice', file: 'a.txt', bytes: 3 },
 *     { type: 'add', user: 'alice', file: 'b.txt', bytes: 3 }
 *   ] -> second add rejected (quota_exceeded), state.used = 3.
 * - quotas = {}, requests = [{ type: 'add', user: 'bob', file: 'x', bytes: 0 }] -> rejected (quota_exceeded).
 */

export function manageStorage(quotas, requests) {
  // Internal state: per-user files and used bytes
  const userFiles = new Map(); // Map<string, Map<string, number>>
  const usedBytes = new Map(); // Map<string, number>

  const accepted = [];
  const rejected = [];

  const getQuota = (user) => {
    const q = quotas?.[user];
    return Number.isFinite(q) && q >= 0 ? Math.trunc(q) : 0;
  };

  const ensureUser = (user) => {
    if (!userFiles.has(user)) userFiles.set(user, new Map());
    if (!usedBytes.has(user)) usedBytes.set(user, 0);
  };

  const addFile = (user, file, bytes) => {
    ensureUser(user);
    const files = userFiles.get(user);
    const used = usedBytes.get(user) ?? 0;
    if (files.has(file)) {
      rejected.push({ user, file, reason: 'duplicate' });
      return;
    }
    const size = Math.trunc(bytes);
    if (size < 0 || !Number.isFinite(size)) {
      // Treat invalid sizes as exceeding quota (pure and deterministic without throwing)
      rejected.push({ user, file, reason: 'quota_exceeded' });
      return;
    }
    const quota = getQuota(user);
    if (used + size > quota) {
      rejected.push({ user, file, reason: 'quota_exceeded' });
      return;
    }
    files.set(file, size);
    usedBytes.set(user, used + size);
    accepted.push({ user, file });
  };

  const removeFile = (user, file) => {
    const files = userFiles.get(user);
    if (!files) return;
    if (!files.has(file)) return;
    const size = files.get(file) ?? 0;
    files.delete(file);
    usedBytes.set(user, Math.max(0, (usedBytes.get(user) ?? 0) - size));
  };

  for (const r of requests ?? []) {
    if (!r || typeof r !== 'object') continue;
    if (r.type === 'add') {
      addFile(r.user, r.file, r.bytes);
    } else if (r.type === 'remove') {
      removeFile(r.user, r.file);
    }
  }

  // Build output state as plain objects
  const state = {};
  for (const [user, filesMap] of userFiles.entries()) {
    const filesObj = {};
    for (const [fname, bytes] of filesMap.entries()) {
      filesObj[fname] = bytes;
    }
    state[user] = { used: usedBytes.get(user) ?? 0, files: filesObj };
  }

  return { accepted, rejected, state };
}
