// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { simulateEditor } from '../problems/assignment2';

describe('simulateEditor', () => {
  it('returns empty string for empty operations', () => {
    expect(simulateEditor([])).toBe('');
  });

  it('types plain text', () => {
    expect(simulateEditor([{ op: 'type', text: 'abc' }])).toBe('abc');
    expect(simulateEditor([{ op: 'type', text: '' }])).toBe('');
  });

  it('movement beyond boundaries has no effect', () => {
    expect(
      simulateEditor([
        { op: 'type', text: 'ab' },
        { op: 'left', count: 5 },
        { op: 'right', count: 5 }
      ])
    ).toBe('ab');
  });

  it('inserts in the middle using left move', () => {
    const result = simulateEditor([
      { op: 'type', text: 'ab' },
      { op: 'left', count: 1 },
      { op: 'type', text: 'X' }
    ]);
    expect(result).toBe('aXb');
  });

  it('backspace deletes to the left of the cursor', () => {
    const result = simulateEditor([
      { op: 'type', text: 'abc' },
      { op: 'backspace', count: 1 }
    ]);
    expect(result).toBe('ab');
  });

  it('delete removes at the cursor', () => {
    const result = simulateEditor([
      { op: 'type', text: 'abc' },
      { op: 'left', count: 2 },
      { op: 'delete', count: 1 }
    ]);
    expect(result).toBe('ac');
  });

  it('handles multi-step realistic scenario (forces two-stack abstraction)', () => {
    const result = simulateEditor([
      { op: 'type', text: 'hello' },
      { op: 'left', count: 2 }, // hel|lo
      { op: 'type', text: 'X' }, // helX|lo
      { op: 'right', count: 1 }, // helXl|o
      { op: 'delete', count: 1 }, // helXl|
      { op: 'left', count: 10 }, // |helXl
      { op: 'type', text: 'A' }, // A|helXl
      { op: 'right', count: 3 }, // Ahe|lXl
      { op: 'backspace', count: 2 } // A|lXl
    ]);
    expect(result).toBe('AlXl');
  });

  it('property-like: zero-count operations do not change result', () => {
    const base = [
      { op: 'type', text: 'cat' },
      { op: 'left', count: 1 },
      { op: 'type', text: 's' }
    ];
    const withZeros = [
      { op: 'left', count: 0 },
      ...base,
      { op: 'right', count: 0 },
      { op: 'backspace', count: 0 },
      { op: 'delete', count: 0 }
    ];
    expect(simulateEditor(base)).toBe('csat');
    expect(simulateEditor(withZeros)).toBe('csat');
  });
});

