import { describe, it, expect } from 'vitest';
import { uniqueActiveNames } from '../problems/assignment1';

describe('uniqueActiveNames', () => {
  it('returns empty for empty input or all inactive', () => {
    expect(uniqueActiveNames([])).toEqual([]);
    expect(
      uniqueActiveNames([
        { id: '1', name: 'Ana', active: false },
        { id: '2', name: 'Bob', active: false },
      ])
    ).toEqual([]);
  });

  it('collects unique active names and sorts ascending', () => {
    const input = [
      { id: 'a', name: 'Charlie', active: true },
      { id: 'b', name: 'Ana', active: true },
      { id: 'c', name: 'Bob', active: true },
    ];
    expect(uniqueActiveNames(input)).toEqual(['Ana', 'Bob', 'Charlie']);
  });

  it('deduplicates names when multiple active records exist', () => {
    const input = [
      { id: '1', name: 'Ana', active: true },
      { id: '2', name: 'Ana', active: true },
      { id: '3', name: 'Ana', active: true },
    ];
    expect(uniqueActiveNames(input)).toEqual(['Ana']);
  });

  it('ignores inactive entries and only considers active ones', () => {
    const input = [
      { id: '1', name: 'Dana', active: false },
      { id: '2', name: 'Eli', active: true },
      { id: '3', name: 'Dana', active: true },
      { id: '4', name: 'Eli', active: false },
    ];
    expect(uniqueActiveNames(input)).toEqual(['Dana', 'Eli']);
  });

  it('is case-sensitive for uniqueness and sorting', () => {
    const input = [
      { id: '1', name: 'alice', active: true },
      { id: '2', name: 'Alice', active: true },
    ];
    expect(uniqueActiveNames(input)).toEqual(['Alice', 'alice']);
  });

  it('property-like: order of input does not change result', () => {
    const cases = [
      [
        { id: '1', name: 'Ana', active: true },
        { id: '2', name: 'Bob', active: true },
        { id: '3', name: 'Ana', active: true },
      ],
      [
        { id: '3', name: 'Ana', active: true },
        { id: '2', name: 'Bob', active: true },
        { id: '1', name: 'Ana', active: true },
      ],
    ];
    const expected = ['Ana', 'Bob'];
    for (const arr of cases) {
      expect(uniqueActiveNames(arr)).toEqual(expected);
    }
  });
});
