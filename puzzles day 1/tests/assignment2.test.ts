import { describe, it, expect } from 'vitest';
import { processReservations } from '../problems/assignment2';

describe('processReservations', () => {
  it('should reserve seats in basic case', () => {
    const theater = [["A", "A", "A", "A"]];
    const requests = [{ customerId: "customer1", row: 0, seatsNeeded: 2 }];

    const result = processReservations(theater, requests);

    expect(result.successfulReservations).toEqual([
      { customerId: "customer1", row: 0, startSeat: 0, endSeat: 1 }
    ]);
    expect(result.finalTheater).toEqual([["R", "R", "A", "A"]]);
  });

  it('should handle blocked seats', () => {
    const theater = [["A", "A", "B", "A", "A"]];
    const requests = [{ customerId: "customer1", row: 0, seatsNeeded: 2 }];

    const result = processReservations(theater, requests);

    expect(result.successfulReservations).toEqual([
      { customerId: "customer1", row: 0, startSeat: 0, endSeat: 1 }
    ]);
    expect(result.finalTheater).toEqual([["R", "R", "B", "A", "A"]]);
  });

  it('should deny request when not enough consecutive seats', () => {
    const theater = [["A", "R", "A", "R", "A"]];
    const requests = [{ customerId: "customer1", row: 0, seatsNeeded: 3 }];

    const result = processReservations(theater, requests);

    expect(result.successfulReservations).toEqual([]);
    expect(result.finalTheater).toEqual([["A", "R", "A", "R", "A"]]);
  });

  it('should process multiple successful requests', () => {
    const theater = [
      ["A", "A", "A", "A", "A"],
      ["A", "A", "A", "A", "A"]
    ];
    const requests = [
      { customerId: "customer1", row: 0, seatsNeeded: 2 },
      { customerId: "customer2", row: 1, seatsNeeded: 3 }
    ];

    const result = processReservations(theater, requests);

    expect(result.successfulReservations).toEqual([
      { customerId: "customer1", row: 0, startSeat: 0, endSeat: 1 },
      { customerId: "customer2", row: 1, startSeat: 0, endSeat: 2 }
    ]);
    expect(result.finalTheater).toEqual([
      ["R", "R", "A", "A", "A"],
      ["R", "R", "R", "A", "A"]
    ]);
  });

  it('should handle invalid row numbers', () => {
    const theater = [["A", "A", "A"]];
    const requests = [
      { customerId: "customer1", row: -1, seatsNeeded: 2 },
      { customerId: "customer2", row: 5, seatsNeeded: 1 }
    ];

    const result = processReservations(theater, requests);

    expect(result.successfulReservations).toEqual([]);
    expect(result.finalTheater).toEqual([["A", "A", "A"]]);
  });

  it('should handle empty theater', () => {
    const theater = [];
    const requests = [{ customerId: "customer1", row: 0, seatsNeeded: 1 }];

    const result = processReservations(theater, requests);

    expect(result.successfulReservations).toEqual([]);
    expect(result.finalTheater).toEqual([]);
  });

  it('should handle no requests', () => {
    const theater = [["A", "A", "A"]];
    const requests = [];

    const result = processReservations(theater, requests);

    expect(result.successfulReservations).toEqual([]);
    expect(result.finalTheater).toEqual([["A", "A", "A"]]);
  });

  it('should find leftmost available group', () => {
    const theater = [["R", "A", "A", "B", "A", "A", "A"]];
    const requests = [{ customerId: "customer1", row: 0, seatsNeeded: 2 }];

    const result = processReservations(theater, requests);

    expect(result.successfulReservations).toEqual([
      { customerId: "customer1", row: 0, startSeat: 1, endSeat: 2 }
    ]);
    expect(result.finalTheater).toEqual([["R", "R", "R", "B", "A", "A", "A"]]);
  });

  it('should handle complex theater with multiple rows and blocked seats', () => {
    const theater = [
      ["A", "B", "A", "A", "A"],
      ["R", "R", "A", "A", "A"],
      ["A", "A", "A", "B", "B"]
    ];
    const requests = [
      { customerId: "family1", row: 0, seatsNeeded: 3 },
      { customerId: "couple1", row: 1, seatsNeeded: 2 },
      { customerId: "single1", row: 2, seatsNeeded: 1 },
      { customerId: "group1", row: 2, seatsNeeded: 4 }
    ];

    const result = processReservations(theater, requests);

    expect(result.successfulReservations).toEqual([
      { customerId: "family1", row: 0, startSeat: 2, endSeat: 4 },
      { customerId: "couple1", row: 1, startSeat: 2, endSeat: 3 },
      { customerId: "single1", row: 2, startSeat: 0, endSeat: 0 }
    ]);
    expect(result.finalTheater).toEqual([
      ["A", "B", "R", "R", "R"],
      ["R", "R", "R", "R", "A"],
      ["R", "A", "A", "B", "B"]
    ]);
  });

  it('should handle requests for single seats', () => {
    const theater = [["A", "R", "A", "B", "A"]];
    const requests = [
      { customerId: "person1", row: 0, seatsNeeded: 1 },
      { customerId: "person2", row: 0, seatsNeeded: 1 }
    ];

    const result = processReservations(theater, requests);

    expect(result.successfulReservations).toEqual([
      { customerId: "person1", row: 0, startSeat: 0, endSeat: 0 },
      { customerId: "person2", row: 0, startSeat: 2, endSeat: 2 }
    ]);
    expect(result.finalTheater).toEqual([["R", "R", "R", "B", "A"]]);
  });
});