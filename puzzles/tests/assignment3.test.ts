import { describe, it, expect } from 'vitest';
import { simulateElevator } from '../problems/assignment3';

describe('simulateElevator', () => {
    it('handles empty request queue', () => {
        expect(simulateElevator([])).toBe(0);
    });

    it('handles single request from starting floor', () => {
        // Start at 1, already there, move to 5
        expect(simulateElevator([[1, 5]])).toBe(4);
    });

    it('handles single request requiring pickup travel', () => {
        // Start at 1, move to 3, then to 7
        expect(simulateElevator([[3, 7]])).toBe(2 + 4);
    });

    it('handles multiple requests with varying distances', () => {
        // Start at 1, move 1→3 (2), pickup, 3→7 (4), dropoff,
        // move 7→2 (5), pickup, 2→5 (3), dropoff
        expect(simulateElevator([[3, 7], [2, 5]])).toBe(14);
    });

    it('handles request where pickup equals destination', () => {
        // Start at 1, already there, no movement needed
        expect(simulateElevator([[1, 1]])).toBe(0);
    });

    it('handles request where pickup equals destination but not at start', () => {
        // Start at 1, move to 10, pickup and dropoff at same floor
        expect(simulateElevator([[10, 10]])).toBe(9);
    });

    it('handles downward movements', () => {
        // Start at 1, move to 8, then to 2
        expect(simulateElevator([[8, 2]])).toBe(7 + 6);
    });

    it('handles consecutive requests on same floor', () => {
        // Start at 1, move to 5 and back to 5, then to 5 and back to 5
        expect(simulateElevator([[5, 5], [5, 5]])).toBe(4 + 0 + 0 + 0);
    });

    it('handles realistic scenario with multiple passengers', () => {
        // Simulate a busy morning:
        // 1→2→10 (person from 2 to 10)
        // 10→1→8 (person from 1 to 8)
        // 8→15→3 (person from 15 to 3)
        const requests: Array<[number, number]> = [
            [2, 10],
            [1, 8],
            [15, 3]
        ];
        const moves = (1 + 8) + (9 + 7) + (7 + 12);
        expect(simulateElevator(requests)).toBe(moves);
    });

    it('calculates correct total for mixed up and down movements', () => {
        // Test a variety of movements to ensure abstraction works
        const requests: Array<[number, number]> = [
            [4, 1],   // 1→4 (3), 4→1 (3) = 6
            [6, 6],   // 1→6 (5), 6→6 (0) = 5
            [3, 9],   // 6→3 (3), 3→9 (6) = 9
            [9, 2],   // 9→9 (0), 9→2 (7) = 7
        ];
        expect(simulateElevator(requests)).toBe(6 + 5 + 9 + 7);
    });
});