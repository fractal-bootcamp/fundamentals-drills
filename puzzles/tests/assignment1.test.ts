import { describe, it, expect } from 'vitest';
import { countByExtension } from '../problems/assignment1';

describe('countByExtension', () => {
  it('counts common extensions and empty extension', () => {
    const actual = countByExtension(['a.txt', 'b.TXT', 'README']);
    expect(actual).toEqual({ txt: 2, '': 1 });
  });

  it('handles leading dot, trailing dot, and multi-dot names', () => {
    const actual = countByExtension(['.env', 'archive.tar.gz', 'name.']);
    expect(actual).toEqual({ '': 2, gz: 1 });
  });

  it('is case-insensitive on extensions', () => {
    const actual = countByExtension(['photo.JPG', 'icon.jpg', 'cover.JpG']);
    expect(actual).toEqual({ jpg: 3 });
  });

  it('trims whitespace in names', () => {
    const actual = countByExtension(['  report.PDF  ', 'draft.pdf', '  readme  ']);
    expect(actual).toEqual({ pdf: 2, '': 1 });
  });

  it('returns empty object for empty input', () => {
    expect(countByExtension([])).toEqual({});
  });

  it('property-like: total count equals input length', () => {
    const inputs = [
      [],
      ['a', 'b', 'c'],
      ['a.ts', 'b.ts', 'c.d.ts', '.config', 'file.'],
      ['X', 'Y.Z', 'Y.z', 'note', 'archive.tar.gz'],
    ];

    for (const filenames of inputs) {
      const result = countByExtension(filenames);
      const total = Object.values(result).reduce((s, n) => s + n, 0);
      expect(total).toBe(filenames.length);
    }
  });
});
