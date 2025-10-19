import { describe, it, expect } from "vitest";
import { processParkingGarage } from "../problems/assignment6";

describe("processParkingGarage", () => {
  // Basic functionality tests
  it("should handle successful parking from example A", () => {
    const input = {
      garage: { capacity: 2, rates: { car: 100 } },
      sessions: [
        [["enter", "V1", "car"], ["addTime", "V1", 2], ["pay", "V1", 200], ["exit", "V1"]]
      ]
    };

    const result = processParkingGarage(input);

    expect(result.occupancy).toBe(0);
    expect(result.tickets).toEqual([{
      vehicleId: "V1",
      action: "exited",
      hoursParked: 2,
      amountDue: 200,
      amountPaid: 200,
      refund: 0,
      balance: 0,
      errors: []
    }]);
  });

  it("should handle capacity limit from example B", () => {
    const input = {
      garage: { capacity: 1, rates: { car: 100 } },
      sessions: [
        [["enter", "V1", "car"]],
        [["enter", "V2", "car"]]
      ]
    };

    const result = processParkingGarage(input);

    expect(result.occupancy).toBe(1);
    expect(result.tickets).toHaveLength(2);
    expect(result.tickets[0]).toEqual({
      vehicleId: "V1",
      action: "entered",
      hoursParked: 0,
      amountDue: 0,
      amountPaid: 0,
      refund: 0,
      balance: 0,
      errors: []
    });
    expect(result.tickets[1]).toEqual({
      vehicleId: "V2",
      action: "idle",
      hoursParked: 0,
      amountDue: 0,
      amountPaid: 0,
      refund: 0,
      balance: 0,
      errors: ["garage at capacity"]
    });
  });

  it("should handle underpayment", () => {
    const input = {
      garage: { capacity: 2, rates: { car: 100 } },
      sessions: [
        [["enter", "V1", "car"], ["addTime", "V1", 3], ["pay", "V1", 200], ["exit", "V1"]]
      ]
    };

    const result = processParkingGarage(input);

    expect(result.occupancy).toBe(0);
    expect(result.tickets).toEqual([{
      vehicleId: "V1",
      action: "exited",
      hoursParked: 3,
      amountDue: 300,
      amountPaid: 200,
      refund: 0,
      balance: -100,
      errors: []
    }]);
  });

  it("should handle overpayment with refund", () => {
    const input = {
      garage: { capacity: 2, rates: { car: 100 } },
      sessions: [
        [["enter", "V1", "car"], ["addTime", "V1", 1], ["pay", "V1", 150], ["exit", "V1"]]
      ]
    };

    const result = processParkingGarage(input);

    expect(result.occupancy).toBe(0);
    expect(result.tickets).toEqual([{
      vehicleId: "V1",
      action: "exited",
      hoursParked: 1,
      amountDue: 100,
      amountPaid: 150,
      refund: 50,
      balance: 50,
      errors: []
    }]);
  });

  it("should round up partial hours", () => {
    const input = {
      garage: { capacity: 2, rates: { car: 100 } },
      sessions: [
        [["enter", "V1", "car"], ["addTime", "V1", 0.5], ["pay", "V1", 100], ["exit", "V1"]]
      ]
    };

    const result = processParkingGarage(input);

    expect(result.occupancy).toBe(0);
    expect(result.tickets).toEqual([{
      vehicleId: "V1",
      action: "exited",
      hoursParked: 0.5,
      amountDue: 100, // 0.5 hours rounded up to 1 hour
      amountPaid: 100,
      refund: 0,
      balance: 0,
      errors: []
    }]);
  });

  it("should handle cancel with full refund", () => {
    const input = {
      garage: { capacity: 2, rates: { car: 100 } },
      sessions: [
        [["enter", "V1", "car"], ["addTime", "V1", 2], ["pay", "V1", 200], ["cancel", "V1"]]
      ]
    };

    const result = processParkingGarage(input);

    expect(result.occupancy).toBe(0);
    expect(result.tickets).toEqual([{
      vehicleId: "V1",
      action: "cancelled",
      hoursParked: 2,
      amountDue: 0,
      amountPaid: 200,
      refund: 200,
      balance: 0,
      errors: []
    }]);
  });

  it("should handle multiple vehicle types with different rates", () => {
    const input = {
      garage: { capacity: 3, rates: { car: 100, truck: 200, motorcycle: 50 } },
      sessions: [
        [["enter", "V1", "car"], ["addTime", "V1", 2], ["pay", "V1", 200], ["exit", "V1"]],
        [["enter", "V2", "truck"], ["addTime", "V2", 1], ["pay", "V2", 200], ["exit", "V2"]],
        [["enter", "V3", "motorcycle"], ["addTime", "V3", 4], ["pay", "V3", 200], ["exit", "V3"]]
      ]
    };

    const result = processParkingGarage(input);

    expect(result.occupancy).toBe(0);
    expect(result.tickets[0].amountDue).toBe(200); // car: 100 * 2
    expect(result.tickets[1].amountDue).toBe(200); // truck: 200 * 1
    expect(result.tickets[2].amountDue).toBe(200); // motorcycle: 50 * 4
  });

  it("should handle invalid vehicle type", () => {
    const input = {
      garage: { capacity: 2, rates: { car: 100 } },
      sessions: [
        [["enter", "V1", "spaceship"]]
      ]
    };

    const result = processParkingGarage(input);

    expect(result.occupancy).toBe(0);
    expect(result.tickets).toEqual([{
      vehicleId: "V1",
      action: "idle",
      hoursParked: 0,
      amountDue: 0,
      amountPaid: 0,
      refund: 0,
      balance: 0,
      errors: ["invalid vehicle type: spaceship"]
    }]);
  });

  it("should prevent duplicate vehicle entry", () => {
    const input = {
      garage: { capacity: 2, rates: { car: 100 } },
      sessions: [
        [["enter", "V1", "car"]],
        [["enter", "V1", "car"]]
      ]
    };

    const result = processParkingGarage(input);

    expect(result.occupancy).toBe(1);
    expect(result.tickets[1]).toEqual({
      vehicleId: "V1",
      action: "idle",
      hoursParked: 0,
      amountDue: 0,
      amountPaid: 0,
      refund: 0,
      balance: 0,
      errors: ["vehicle already in garage: V1"]
    });
  });

  it("should handle pay on non-existent vehicle", () => {
    const input = {
      garage: { capacity: 2, rates: { car: 100 } },
      sessions: [
        [["pay", "V1", 100]]
      ]
    };

    const result = processParkingGarage(input);

    expect(result.tickets).toEqual([{
      vehicleId: "V1",
      action: "idle",
      hoursParked: 0,
      amountDue: 0,
      amountPaid: 0,
      refund: 0,
      balance: 0,
      errors: ["vehicle not in garage: V1"]
    }]);
  });

  it("should handle addTime on non-existent vehicle", () => {
    const input = {
      garage: { capacity: 2, rates: { car: 100 } },
      sessions: [
        [["addTime", "V1", 2]]
      ]
    };

    const result = processParkingGarage(input);

    expect(result.tickets).toEqual([{
      vehicleId: "V1",
      action: "idle",
      hoursParked: 0,
      amountDue: 0,
      amountPaid: 0,
      refund: 0,
      balance: 0,
      errors: ["vehicle not in garage: V1"]
    }]);
  });

  it("should handle exit on non-existent vehicle", () => {
    const input = {
      garage: { capacity: 2, rates: { car: 100 } },
      sessions: [
        [["exit", "V1"]]
      ]
    };

    const result = processParkingGarage(input);

    expect(result.tickets).toEqual([{
      vehicleId: "V1",
      action: "idle",
      hoursParked: 0,
      amountDue: 0,
      amountPaid: 0,
      refund: 0,
      balance: 0,
      errors: ["vehicle not in garage: V1"]
    }]);
  });

  it("should handle cancel on non-existent vehicle", () => {
    const input = {
      garage: { capacity: 2, rates: { car: 100 } },
      sessions: [
        [["cancel", "V1"]]
      ]
    };

    const result = processParkingGarage(input);

    expect(result.tickets).toEqual([{
      vehicleId: "V1",
      action: "idle",
      hoursParked: 0,
      amountDue: 0,
      amountPaid: 0,
      refund: 0,
      balance: 0,
      errors: ["vehicle not in garage: V1"]
    }]);
  });

  it("should handle negative payment", () => {
    const input = {
      garage: { capacity: 2, rates: { car: 100 } },
      sessions: [
        [["enter", "V1", "car"], ["pay", "V1", -50]]
      ]
    };

    const result = processParkingGarage(input);

    expect(result.tickets).toEqual([{
      vehicleId: "V1",
      action: "entered",
      hoursParked: 0,
      amountDue: 0,
      amountPaid: 0,
      refund: 0,
      balance: 0,
      errors: ["invalid payment amount: -50"]
    }]);
  });

  it("should handle zero payment", () => {
    const input = {
      garage: { capacity: 2, rates: { car: 100 } },
      sessions: [
        [["enter", "V1", "car"], ["pay", "V1", 0]]
      ]
    };

    const result = processParkingGarage(input);

    expect(result.tickets).toEqual([{
      vehicleId: "V1",
      action: "entered",
      hoursParked: 0,
      amountDue: 0,
      amountPaid: 0,
      refund: 0,
      balance: 0,
      errors: ["invalid payment amount: 0"]
    }]);
  });

  it("should handle negative time", () => {
    const input = {
      garage: { capacity: 2, rates: { car: 100 } },
      sessions: [
        [["enter", "V1", "car"], ["addTime", "V1", -2]]
      ]
    };

    const result = processParkingGarage(input);

    expect(result.tickets).toEqual([{
      vehicleId: "V1",
      action: "entered",
      hoursParked: 0,
      amountDue: 0,
      amountPaid: 0,
      refund: 0,
      balance: 0,
      errors: ["invalid time amount: -2"]
    }]);
  });

  it("should handle zero time", () => {
    const input = {
      garage: { capacity: 2, rates: { car: 100 } },
      sessions: [
        [["enter", "V1", "car"], ["addTime", "V1", 0]]
      ]
    };

    const result = processParkingGarage(input);

    expect(result.tickets).toEqual([{
      vehicleId: "V1",
      action: "entered",
      hoursParked: 0,
      amountDue: 0,
      amountPaid: 0,
      refund: 0,
      balance: 0,
      errors: ["invalid time amount: 0"]
    }]);
  });

  it("should handle noop operations", () => {
    const input = {
      garage: { capacity: 2, rates: { car: 100 } },
      sessions: [
        [["noop"], ["enter", "V1", "car"], ["noop"], ["exit", "V1"]]
      ]
    };

    const result = processParkingGarage(input);

    expect(result.tickets).toEqual([{
      vehicleId: "V1",
      action: "exited",
      hoursParked: 0,
      amountDue: 0,
      amountPaid: 0,
      refund: 0,
      balance: 0,
      errors: []
    }]);
  });

  it("should handle unknown actions", () => {
    const input = {
      garage: { capacity: 2, rates: { car: 100 } },
      sessions: [
        [["unknown", "V1"]]
      ]
    };

    const result = processParkingGarage(input);

    expect(result.tickets).toEqual([{
      vehicleId: undefined,
      action: "idle",
      hoursParked: 0,
      amountDue: 0,
      amountPaid: 0,
      refund: 0,
      balance: 0,
      errors: ["unknown action: unknown"]
    }]);
  });

  it("should handle multiple payments", () => {
    const input = {
      garage: { capacity: 2, rates: { car: 100 } },
      sessions: [
        [["enter", "V1", "car"], ["addTime", "V1", 3], ["pay", "V1", 100], ["pay", "V1", 100], ["pay", "V1", 100], ["exit", "V1"]]
      ]
    };

    const result = processParkingGarage(input);

    expect(result.tickets).toEqual([{
      vehicleId: "V1",
      action: "exited",
      hoursParked: 3,
      amountDue: 300,
      amountPaid: 300,
      refund: 0,
      balance: 0,
      errors: []
    }]);
  });

  it("should handle multiple time additions", () => {
    const input = {
      garage: { capacity: 2, rates: { car: 100 } },
      sessions: [
        [["enter", "V1", "car"], ["addTime", "V1", 1], ["addTime", "V1", 1], ["addTime", "V1", 1], ["pay", "V1", 300], ["exit", "V1"]]
      ]
    };

    const result = processParkingGarage(input);

    expect(result.tickets).toEqual([{
      vehicleId: "V1",
      action: "exited",
      hoursParked: 3,
      amountDue: 300,
      amountPaid: 300,
      refund: 0,
      balance: 0,
      errors: []
    }]);
  });

  it("should handle empty sessions", () => {
    const input = {
      garage: { capacity: 2, rates: { car: 100 } },
      sessions: [
        []
      ]
    };

    const result = processParkingGarage(input);

    expect(result.occupancy).toBe(0);
    expect(result.tickets).toEqual([{
      vehicleId: undefined,
      action: "idle",
      hoursParked: 0,
      amountDue: 0,
      amountPaid: 0,
      refund: 0,
      balance: 0,
      errors: []
    }]);
  });

  it("should handle concurrent vehicles", () => {
    const input = {
      garage: { capacity: 3, rates: { car: 100 } },
      sessions: [
        [["enter", "V1", "car"]],
        [["enter", "V2", "car"]],
        [["enter", "V3", "car"]],
        [["exit", "V1"]],
        [["exit", "V2"]],
        [["exit", "V3"]]
      ]
    };

    const result = processParkingGarage(input);

    expect(result.occupancy).toBe(0);
    expect(result.tickets).toHaveLength(6);
  });

  it("should handle zero-hour parking", () => {
    const input = {
      garage: { capacity: 2, rates: { car: 100 } },
      sessions: [
        [["enter", "V1", "car"], ["exit", "V1"]]
      ]
    };

    const result = processParkingGarage(input);

    expect(result.tickets).toEqual([{
      vehicleId: "V1",
      action: "exited",
      hoursParked: 0,
      amountDue: 0, // 0 hours = free
      amountPaid: 0,
      refund: 0,
      balance: 0,
      errors: []
    }]);
  });

  it("should handle multiple errors in single session", () => {
    const input = {
      garage: { capacity: 2, rates: { car: 100 } },
      sessions: [
        [["pay", "V1", 100], ["addTime", "V1", 2], ["exit", "V1"], ["cancel", "V1"]]
      ]
    };

    const result = processParkingGarage(input);

    expect(result.tickets).toEqual([{
      vehicleId: "V1",
      action: "idle",
      hoursParked: 0,
      amountDue: 0,
      amountPaid: 0,
      refund: 0,
      balance: 0,
      errors: [
        "vehicle not in garage: V1",
        "vehicle not in garage: V1",
        "vehicle not in garage: V1",
        "vehicle not in garage: V1"
      ]
    }]);
  });

  it("should handle malformed input gracefully", () => {
    const input = {
      garage: null,
      sessions: null
    };

    const result = processParkingGarage(input);

    expect(result.occupancy).toBe(0);
    expect(result.tickets).toEqual([]);
  });

  it("should handle fractional hours rounding", () => {
    const input = {
      garage: { capacity: 2, rates: { car: 100 } },
      sessions: [
        [["enter", "V1", "car"], ["addTime", "V1", 2.3], ["pay", "V1", 300], ["exit", "V1"]]
      ]
    };

    const result = processParkingGarage(input);

    expect(result.tickets).toEqual([{
      vehicleId: "V1",
      action: "exited",
      hoursParked: 2.3,
      amountDue: 300, // 2.3 hours rounded up to 3
      amountPaid: 300,
      refund: 0,
      balance: 0,
      errors: []
    }]);
  });

  it("should handle free parking (zero rate)", () => {
    const input = {
      garage: { capacity: 2, rates: { car: 0 } },
      sessions: [
        [["enter", "V1", "car"], ["addTime", "V1", 5], ["exit", "V1"]]
      ]
    };

    const result = processParkingGarage(input);

    expect(result.tickets).toEqual([{
      vehicleId: "V1",
      action: "exited",
      hoursParked: 5,
      amountDue: 0,
      amountPaid: 0,
      refund: 0,
      balance: 0,
      errors: []
    }]);
  });
});
