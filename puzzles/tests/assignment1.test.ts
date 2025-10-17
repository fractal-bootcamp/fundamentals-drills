import { describe, it, expect } from 'vitest';
import { processTurnstileTrips } from '../problems/assignment2';

describe('processTurnstileTrips', () => {
  it('should handle empty event list', () => {
    const result = processTurnstileTrips([]);
    expect(result).toEqual({
      active: {},
      completed: [],
      rejected: [],
      stats: { entries: {}, exits: {} }
    });
  });

  // it('should process simple enter and exit sequence', () => {
  //   const events = [
  //     { id: "a", action: "enter", station: "Alpha" },
  //     { id: "a", action: "exit", station: "Beta" }
  //   ];
  //   const result = processTurnstileTrips(events);
  //   expect(result.completed).toEqual([{ id: "a", from: "Alpha", to: "Beta" }]);
  //   expect(result.active).toEqual({});
  //   expect(result.rejected).toEqual([]);
  //   expect(result.stats.entries).toEqual({ "Alpha": 1 });
  //   expect(result.stats.exits).toEqual({ "Beta": 1 });
  // });

  // it('should reject duplicate enter and exit without prior enter', () => {
  //   const events = [
  //     { id: "x", action: "enter", station: "A" },
  //     { id: "x", action: "enter", station: "B" }, // rejected: already in-system
  //     { id: "y", action: "exit", station: "A" }   // rejected: not in-system
  //   ];
  //   const result = processTurnstileTrips(events);
  //   expect(result.active).toEqual({ x: { enteredAt: "A" } });
  //   expect(result.completed).toEqual([]);
  //   expect(result.rejected).toHaveLength(2);
  //   expect(result.rejected[0]).toEqual({ id: "x", action: "enter", station: "B", reason: "already in-system" });
  //   expect(result.rejected[1]).toEqual({ id: "y", action: "exit", station: "A", reason: "not in-system" });
  //   expect(result.stats.entries).toEqual({ "A": 1 });
  //   expect(result.stats.exits).toEqual({});
  // });

  // it('should handle multiple riders with interleaved events', () => {
  //   const events = [
  //     { id: "alice", action: "enter", station: "Central" },
  //     { id: "bob", action: "enter", station: "North" },
  //     { id: "alice", action: "exit", station: "South" },
  //     { id: "charlie", action: "enter", station: "East" },
  //     { id: "bob", action: "exit", station: "West" }
  //   ];
  //   const result = processTurnstileTrips(events);
  //   expect(result.completed).toEqual([
  //     { id: "alice", from: "Central", to: "South" },
  //     { id: "bob", from: "North", to: "West" }
  //   ]);
  //   expect(result.active).toEqual({ charlie: { enteredAt: "East" } });
  //   expect(result.rejected).toEqual([]);
  //   expect(result.stats.entries).toEqual({ "Central": 1, "North": 1, "East": 1 });
  //   expect(result.stats.exits).toEqual({ "South": 1, "West": 1 });
  // });

  // it('should ignore invalid events with missing fields', () => {
  //   const events = [
  //     { id: "valid", action: "enter", station: "Station1" },
  //     { id: "", action: "enter", station: "Station2" }, // invalid: empty id
  //     { id: "valid", action: "invalid", station: "Station3" }, // invalid: bad action
  //     { id: "valid2", action: "enter" }, // invalid: missing station
  //     null, // invalid: null event
  //     { id: "valid", action: "exit", station: "Station4" }
  //   ];
  //   const result = processTurnstileTrips(events);
  //   expect(result.completed).toEqual([{ id: "valid", from: "Station1", to: "Station4" }]);
  //   expect(result.active).toEqual({});
  //   expect(result.rejected).toEqual([]);
  //   expect(result.stats.entries).toEqual({ "Station1": 1 });
  //   expect(result.stats.exits).toEqual({ "Station4": 1 });
  // });

  // it('should handle same rider multiple complete trips', () => {
  //   const events = [
  //     { id: "commuter", action: "enter", station: "Home" },
  //     { id: "commuter", action: "exit", station: "Work" },
  //     { id: "commuter", action: "enter", station: "Work" },
  //     { id: "commuter", action: "exit", station: "Home" }
  //   ];
  //   const result = processTurnstileTrips(events);
  //   expect(result.completed).toEqual([
  //     { id: "commuter", from: "Home", to: "Work" },
  //     { id: "commuter", from: "Work", to: "Home" }
  //   ]);
  //   expect(result.active).toEqual({});
  //   expect(result.rejected).toEqual([]);
  //   expect(result.stats.entries).toEqual({ "Home": 1, "Work": 1 });
  //   expect(result.stats.exits).toEqual({ "Work": 1, "Home": 1 });
  // });

  // it('should handle case-sensitive station names', () => {
  //   const events = [
  //     { id: "user1", action: "enter", station: "MAIN" },
  //     { id: "user2", action: "enter", station: "main" },
  //     { id: "user1", action: "exit", station: "EXIT" },
  //     { id: "user2", action: "exit", station: "exit" }
  //   ];
  //   const result = processTurnstileTrips(events);
  //   expect(result.completed).toEqual([
  //     { id: "user1", from: "MAIN", to: "EXIT" },
  //     { id: "user2", from: "main", to: "exit" }
  //   ]);
  //   expect(result.stats.entries).toEqual({ "MAIN": 1, "main": 1 });
  //   expect(result.stats.exits).toEqual({ "EXIT": 1, "exit": 1 });
  // });

  // it('should handle events with rejected and valid actions mixed', () => {
  //   const events = [
  //     { id: "user", action: "exit", station: "A" }, // rejected: not in-system
  //     { id: "user", action: "enter", station: "B" },
  //     { id: "user", action: "enter", station: "C" }, // rejected: already in-system
  //     { id: "user", action: "exit", station: "D" }
  //   ];
  //   const result = processTurnstileTrips(events);
  //   expect(result.completed).toEqual([{ id: "user", from: "B", to: "D" }]);
  //   expect(result.active).toEqual({});
  //   expect(result.rejected).toHaveLength(2);
  //   expect(result.rejected[0]).toEqual({ id: "user", action: "exit", station: "A", reason: "not in-system" });
  //   expect(result.rejected[1]).toEqual({ id: "user", action: "enter", station: "C", reason: "already in-system" });
  // });

  // it('should handle realistic full scenario with multiple users and stations', () => {
  //   const events = [
  //     { id: "alice", action: "enter", station: "Downtown" },
  //     { id: "bob", action: "enter", station: "Airport" },
  //     { id: "charlie", action: "enter", station: "Downtown" },
  //     { id: "alice", action: "exit", station: "Mall" },
  //     { id: "david", action: "exit", station: "Beach" }, // rejected: not in-system
  //     { id: "bob", action: "enter", station: "Mall" }, // rejected: already in-system
  //     { id: "bob", action: "exit", station: "Beach" },
  //     { id: "eve", action: "enter", station: "University" },
  //     { id: "charlie", action: "exit", station: "Airport" }
  //   ];
  //   const result = processTurnstileTrips(events);
  //   expect(result.completed).toEqual([
  //     { id: "alice", from: "Downtown", to: "Mall" },
  //     { id: "bob", from: "Airport", to: "Beach" },
  //     { id: "charlie", from: "Downtown", to: "Airport" }
  //   ]);
  //   expect(result.active).toEqual({ eve: { enteredAt: "University" } });
  //   expect(result.rejected).toHaveLength(2);
  //   expect(result.stats.entries).toEqual({ "Downtown": 2, "Airport": 1, "University": 1 });
  //   expect(result.stats.exits).toEqual({ "Mall": 1, "Beach": 1, "Airport": 1 });
  // });

  // it('should maintain rejection order as events are processed', () => {
  //   const events = [
  //     { id: "a", action: "exit", station: "X" },  // rejection 1
  //     { id: "b", action: "enter", station: "Y" },
  //     { id: "a", action: "exit", station: "Z" },  // rejection 2
  //     { id: "b", action: "enter", station: "W" }, // rejection 3
  //   ];
  //   const result = processTurnstileTrips(events);
  //   expect(result.rejected).toHaveLength(3);
  //   expect(result.rejected[0]).toEqual({ id: "a", action: "exit", station: "X", reason: "not in-system" });
  //   expect(result.rejected[1]).toEqual({ id: "a", action: "exit", station: "Z", reason: "not in-system" });
  //   expect(result.rejected[2]).toEqual({ id: "b", action: "enter", station: "W", reason: "already in-system" });
  // });
});