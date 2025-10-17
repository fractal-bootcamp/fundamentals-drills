import { describe, it, expect } from 'vitest';
import { manageStorage } from "../problems/assignment2";

describe('manageStorage — minimal and edge cases', () => {
  it('empty quotas and no requests -> empty state', () => {
    const out = manageStorage({}, []);
    expect(out.accepted).toEqual([]);
    expect(out.rejected).toEqual([]);
    expect(out.state).toEqual({});
  });

  it('unknown users have quota 0; zero-byte add allowed but second is duplicate', () => {
    const out = manageStorage({}, [
      { type: 'add', user: 'u', file: 'f', bytes: 0 },
      { type: 'add', user: 'u', file: 'f', bytes: 0 },
    ]);
    expect(out.accepted).toEqual([{ user: 'u', file: 'f' }]);
    expect(out.rejected).toEqual([
      { user: 'u', file: 'f', reason: 'duplicate' },
    ]);
    expect(out.state).toEqual({ u: { used: 0, files: { f: 0 } } });
  });
});

describe('manageStorage — enforces quota (forces abstraction)', () => {
  it('rejects add that would exceed quota based on current used', () => {
    const out = manageStorage({ a: 5 }, [
      { type: 'add', user: 'a', file: 'x', bytes: 2 },
      { type: 'add', user: 'a', file: 'y', bytes: 2 },
      { type: 'add', user: 'a', file: 'z', bytes: 2 }, // exceeds (2+2+2>5)
    ]);
    expect(out.accepted).toEqual([
      { user: 'a', file: 'x' },
      { user: 'a', file: 'y' },
    ]);
    expect(out.rejected).toEqual([
      { user: 'a', file: 'z', reason: 'quota_exceeded' },
    ]);
    expect(out.state).toEqual({ a: { used: 4, files: { x: 2, y: 2 } } });
  });
});

describe('manageStorage — realistic flow', () => {
  it('mix of add/remove, duplicates, freeing and re-adding', () => {
    const out = manageStorage({ alice: 5, bob: 3 }, [
      { type: 'add', user: 'alice', file: 'a.txt', bytes: 3 },
      { type: 'add', user: 'alice', file: 'a.txt', bytes: 3 }, // duplicate
      { type: 'add', user: 'alice', file: 'b.txt', bytes: 3 }, // exceeds
      { type: 'remove', user: 'alice', file: 'a.txt' },        // free 3
      { type: 'add', user: 'alice', file: 'b.txt', bytes: 3 }, // now ok
      { type: 'add', user: 'bob', file: 'x', bytes: 1 },
      { type: 'add', user: 'bob', file: 'y', bytes: 2 },
      { type: 'add', user: 'bob', file: 'z', bytes: 1 },       // exceeds
      { type: 'remove', user: 'bob', file: 'x' },              // free 1
      { type: 'add', user: 'bob', file: 'z', bytes: 1 },       // now ok
    ]);

    expect(out.accepted).toEqual([
      { user: 'alice', file: 'a.txt' },
      { user: 'alice', file: 'b.txt' },
      { user: 'bob', file: 'x' },
      { user: 'bob', file: 'y' },
      { user: 'bob', file: 'z' },
    ]);

    expect(out.rejected).toEqual([
      { user: 'alice', file: 'a.txt', reason: 'duplicate' },
      { user: 'alice', file: 'b.txt', reason: 'quota_exceeded' },
      { user: 'bob', file: 'z', reason: 'quota_exceeded' },
    ]);

    expect(out.state).toEqual({
      alice: { used: 3, files: { 'b.txt': 3 } },
      bob: { used: 3, files: { y: 2, z: 1 } },
    });
  });
});

describe('manageStorage — table checks (deterministic)', () => {
  it('final used equals sum of file sizes per user across variants', () => {
    const quotas = { u: 10 };
    const variants = [
      [
        { type: 'add', user: 'u', file: 'a', bytes: 4 },
        { type: 'add', user: 'u', file: 'b', bytes: 6 },
      ],
      [
        { type: 'add', user: 'u', file: 'b', bytes: 6 },
        { type: 'add', user: 'u', file: 'a', bytes: 4 },
      ],
      [
        { type: 'add', user: 'u', file: 'a', bytes: 7 }, // exceeds later
        { type: 'add', user: 'u', file: 'a', bytes: 7 }, // duplicate
        { type: 'add', user: 'u', file: 'a', bytes: 4 },
        { type: 'add', user: 'u', file: 'b', bytes: 6 },
      ],
    ];

    for (const reqs of variants) {
      const out = manageStorage(quotas, reqs as any);
      const sum = Object.values(out.state.u?.files ?? {}).reduce((s: number, n: number) => s + n, 0);
      expect(out.state.u?.used ?? 0).toBe(sum);
      expect(out.state.u?.used ?? 0).toBeLessThanOrEqual(10);
    }
  });
});
