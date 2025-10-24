import { describe, it, expect } from "vitest";
import { scheduleMeetings } from "../problems/assignment2";

describe("scheduleMeetings", () => {
  // Basic functionality tests
  it("should schedule multiple meetings in the same room", () => {
    const input = {
      rooms: [
        { name: "A", capacity: 5, hoursAvailable: 8 },
        { name: "B", capacity: 10, hoursAvailable: 4 }
      ],
      meetings: [
        { id: "m1", duration: 2, participants: 3 },
        { id: "m2", duration: 3, participants: 3 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.scheduled).toHaveLength(1);
    expect(result.scheduled[0]).toEqual({
      roomName: "A",
      capacity: 5,
      meetings: ["m1", "m2"],
      hoursUsed: 5,
      hoursAvailable: 8
    });
    expect(result.unscheduled).toEqual([]);
    expect(result.errors).toEqual([]);
  });

  it("should choose smallest capacity room when multiple qualify", () => {
    const input = {
      rooms: [
        { name: "Large", capacity: 20, hoursAvailable: 8 },
        { name: "Small", capacity: 5, hoursAvailable: 8 },
        { name: "Medium", capacity: 10, hoursAvailable: 8 }
      ],
      meetings: [
        { id: "m1", duration: 2, participants: 4 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.scheduled).toHaveLength(1);
    expect(result.scheduled[0].roomName).toBe("Small");
    expect(result.scheduled[0].capacity).toBe(5);
  });

  it("should use lexicographic ordering when capacities tie", () => {
    const input = {
      rooms: [
        { name: "Zebra", capacity: 5, hoursAvailable: 8 },
        { name: "Alpha", capacity: 5, hoursAvailable: 8 },
        { name: "Beta", capacity: 5, hoursAvailable: 8 }
      ],
      meetings: [
        { id: "m1", duration: 2, participants: 4 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.scheduled).toHaveLength(1);
    expect(result.scheduled[0].roomName).toBe("Alpha");
  });

  it("should handle equipment requirements", () => {
    const input = {
      rooms: [
        { name: "A", capacity: 5, hoursAvailable: 8, equipment: ["Projector"] },
        { name: "B", capacity: 5, hoursAvailable: 8, equipment: ["Whiteboard"] }
      ],
      meetings: [
        { id: "m1", duration: 2, participants: 3, equipmentNeeded: "Projector" }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.scheduled).toHaveLength(1);
    expect(result.scheduled[0].roomName).toBe("A");
    expect(result.scheduled[0].meetings).toEqual(["m1"]);
  });

  it("should mark meeting as unscheduled when equipment not available", () => {
    const input = {
      rooms: [
        { name: "A", capacity: 5, hoursAvailable: 8 }
      ],
      meetings: [
        { id: "m1", duration: 2, participants: 3, equipmentNeeded: "Projector" }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.scheduled).toEqual([]);
    expect(result.unscheduled).toEqual(["m1"]);
    expect(result.errors).toEqual([]);
  });

  it("should handle meetings without equipment needs", () => {
    const input = {
      rooms: [
        { name: "A", capacity: 5, hoursAvailable: 8, equipment: ["Projector"] },
        { name: "B", capacity: 5, hoursAvailable: 8 }
      ],
      meetings: [
        { id: "m1", duration: 2, participants: 3 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.scheduled).toHaveLength(1);
    expect(result.scheduled[0].roomName).toBe("A");
  });

  it("should respect hours available limit", () => {
    const input = {
      rooms: [
        { name: "A", capacity: 5, hoursAvailable: 4 }
      ],
      meetings: [
        { id: "m1", duration: 2, participants: 3 },
        { id: "m2", duration: 2, participants: 3 },
        { id: "m3", duration: 2, participants: 3 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.scheduled).toHaveLength(1);
    expect(result.scheduled[0].meetings).toEqual(["m1", "m2"]);
    expect(result.scheduled[0].hoursUsed).toBe(4);
    expect(result.unscheduled).toEqual(["m3"]);
  });

  it("should respect capacity limit", () => {
    const input = {
      rooms: [
        { name: "A", capacity: 5, hoursAvailable: 8 },
        { name: "B", capacity: 10, hoursAvailable: 8 }
      ],
      meetings: [
        { id: "m1", duration: 2, participants: 8 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.scheduled).toHaveLength(1);
    expect(result.scheduled[0].roomName).toBe("B");
    expect(result.scheduled[0].capacity).toBe(10);
  });

  it("should mark meeting as unscheduled when no room has enough capacity", () => {
    const input = {
      rooms: [
        { name: "A", capacity: 5, hoursAvailable: 8 },
        { name: "B", capacity: 10, hoursAvailable: 8 }
      ],
      meetings: [
        { id: "m1", duration: 2, participants: 15 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.scheduled).toEqual([]);
    expect(result.unscheduled).toEqual(["m1"]);
  });

  // Validation tests
  it("should reject meeting with empty id", () => {
    const input = {
      rooms: [{ name: "A", capacity: 5, hoursAvailable: 8 }],
      meetings: [
        { id: "", duration: 2, participants: 3 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.scheduled).toEqual([]);
    expect(result.unscheduled).toEqual([""]);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].id).toBe("");
    expect(result.errors[0].error).toContain("id");
  });

  it("should reject meeting with zero duration", () => {
    const input = {
      rooms: [{ name: "A", capacity: 5, hoursAvailable: 8 }],
      meetings: [
        { id: "m1", duration: 0, participants: 3 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.unscheduled).toEqual(["m1"]);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].error).toContain("duration");
  });

  it("should reject meeting with negative duration", () => {
    const input = {
      rooms: [{ name: "A", capacity: 5, hoursAvailable: 8 }],
      meetings: [
        { id: "m1", duration: -1, participants: 3 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.unscheduled).toEqual(["m1"]);
    expect(result.errors).toHaveLength(1);
  });

  it("should reject meeting with zero participants", () => {
    const input = {
      rooms: [{ name: "A", capacity: 5, hoursAvailable: 8 }],
      meetings: [
        { id: "m1", duration: 2, participants: 0 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.unscheduled).toEqual(["m1"]);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].error).toContain("participants");
  });

  it("should reject meeting with negative participants", () => {
    const input = {
      rooms: [{ name: "A", capacity: 5, hoursAvailable: 8 }],
      meetings: [
        { id: "m1", duration: 2, participants: -5 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.unscheduled).toEqual(["m1"]);
    expect(result.errors).toHaveLength(1);
  });

  it("should reject meeting with non-integer participants", () => {
    const input = {
      rooms: [{ name: "A", capacity: 5, hoursAvailable: 8 }],
      meetings: [
        { id: "m1", duration: 2, participants: 3.5 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.unscheduled).toEqual(["m1"]);
    expect(result.errors).toHaveLength(1);
  });

  it("should accept meeting with decimal duration", () => {
    const input = {
      rooms: [{ name: "A", capacity: 5, hoursAvailable: 8 }],
      meetings: [
        { id: "m1", duration: 0.5, participants: 3 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.scheduled).toHaveLength(1);
    expect(result.scheduled[0].hoursUsed).toBe(0.5);
    expect(result.errors).toEqual([]);
  });

  it("should reject meeting with Infinity duration", () => {
    const input = {
      rooms: [{ name: "A", capacity: 5, hoursAvailable: 8 }],
      meetings: [
        { id: "m1", duration: Infinity, participants: 3 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.unscheduled).toEqual(["m1"]);
    expect(result.errors).toHaveLength(1);
  });

  it("should reject meeting with NaN duration", () => {
    const input = {
      rooms: [{ name: "A", capacity: 5, hoursAvailable: 8 }],
      meetings: [
        { id: "m1", duration: NaN, participants: 3 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.unscheduled).toEqual(["m1"]);
    expect(result.errors).toHaveLength(1);
  });

  // Edge cases
  it("should handle empty meetings array", () => {
    const input = {
      rooms: [{ name: "A", capacity: 5, hoursAvailable: 8 }],
      meetings: []
    };

    const result = scheduleMeetings(input);

    expect(result.scheduled).toEqual([]);
    expect(result.unscheduled).toEqual([]);
    expect(result.errors).toEqual([]);
  });

  it("should handle empty rooms array", () => {
    const input = {
      rooms: [],
      meetings: [
        { id: "m1", duration: 2, participants: 3 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.scheduled).toEqual([]);
    expect(result.unscheduled).toEqual(["m1"]);
    expect(result.errors).toEqual([]);
  });

  it("should ignore rooms with zero capacity", () => {
    const input = {
      rooms: [
        { name: "A", capacity: 0, hoursAvailable: 8 },
        { name: "B", capacity: 5, hoursAvailable: 8 }
      ],
      meetings: [
        { id: "m1", duration: 2, participants: 1 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.scheduled).toHaveLength(1);
    expect(result.scheduled[0].roomName).toBe("B");
  });

  it("should ignore rooms with zero hours available", () => {
    const input = {
      rooms: [
        { name: "A", capacity: 5, hoursAvailable: 0 },
        { name: "B", capacity: 5, hoursAvailable: 8 }
      ],
      meetings: [
        { id: "m1", duration: 2, participants: 3 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.scheduled).toHaveLength(1);
    expect(result.scheduled[0].roomName).toBe("B");
  });

  it("should handle equipment case sensitivity", () => {
    const input = {
      rooms: [
        { name: "A", capacity: 5, hoursAvailable: 8, equipment: ["projector"] }
      ],
      meetings: [
        { id: "m1", duration: 2, participants: 3, equipmentNeeded: "Projector" }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.unscheduled).toEqual(["m1"]);
  });

  it("should handle room with no equipment array", () => {
    const input = {
      rooms: [
        { name: "A", capacity: 5, hoursAvailable: 8 }
      ],
      meetings: [
        { id: "m1", duration: 2, participants: 3, equipmentNeeded: "Projector" }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.unscheduled).toEqual(["m1"]);
  });

  it("should handle meeting without equipmentNeeded field", () => {
    const input = {
      rooms: [
        { name: "A", capacity: 5, hoursAvailable: 8, equipment: ["Projector"] }
      ],
      meetings: [
        { id: "m1", duration: 2, participants: 3 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.scheduled).toHaveLength(1);
    expect(result.scheduled[0].meetings).toEqual(["m1"]);
  });

  it("should process meetings in order", () => {
    const input = {
      rooms: [
        { name: "A", capacity: 5, hoursAvailable: 2 }
      ],
      meetings: [
        { id: "first", duration: 1, participants: 3 },
        { id: "second", duration: 1, participants: 3 },
        { id: "third", duration: 1, participants: 3 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.scheduled[0].meetings).toEqual(["first", "second"]);
    expect(result.unscheduled).toEqual(["third"]);
  });

  it("should prefer already-used rooms over new rooms", () => {
    const input = {
      rooms: [
        { name: "A", capacity: 10, hoursAvailable: 8 },
        { name: "B", capacity: 5, hoursAvailable: 8 }
      ],
      meetings: [
        { id: "m1", duration: 2, participants: 8 },
        { id: "m2", duration: 2, participants: 4 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.scheduled).toHaveLength(1);
    expect(result.scheduled[0].roomName).toBe("A");
    expect(result.scheduled[0].meetings).toEqual(["m1", "m2"]);
  });

  it("should use new room when already-used rooms don't fit", () => {
    const input = {
      rooms: [
        { name: "A", capacity: 5, hoursAvailable: 8 },
        { name: "B", capacity: 10, hoursAvailable: 8 }
      ],
      meetings: [
        { id: "m1", duration: 2, participants: 4 },
        { id: "m2", duration: 2, participants: 8 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.scheduled).toHaveLength(2);
    expect(result.scheduled[0].roomName).toBe("A");
    expect(result.scheduled[0].meetings).toEqual(["m1"]);
    expect(result.scheduled[1].roomName).toBe("B");
    expect(result.scheduled[1].meetings).toEqual(["m2"]);
  });

  it("should handle mixed valid and invalid meetings", () => {
    const input = {
      rooms: [
        { name: "A", capacity: 5, hoursAvailable: 8 }
      ],
      meetings: [
        { id: "valid", duration: 2, participants: 3 },
        { id: "invalid1", duration: 0, participants: 3 },
        { id: "valid2", duration: 1, participants: 2 },
        { id: "invalid2", duration: 2, participants: -1 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.scheduled).toHaveLength(1);
    expect(result.scheduled[0].meetings).toEqual(["valid", "valid2"]);
    expect(result.unscheduled).toEqual(["invalid1", "invalid2"]);
    expect(result.errors).toHaveLength(2);
  });

  it("should handle multiple rooms with different equipment", () => {
    const input = {
      rooms: [
        { name: "A", capacity: 5, hoursAvailable: 8, equipment: ["Projector"] },
        { name: "B", capacity: 5, hoursAvailable: 8, equipment: ["Whiteboard"] },
        { name: "C", capacity: 5, hoursAvailable: 8, equipment: ["Projector", "Whiteboard"] }
      ],
      meetings: [
        { id: "m1", duration: 2, participants: 3, equipmentNeeded: "Projector" },
        { id: "m2", duration: 2, participants: 3, equipmentNeeded: "Whiteboard" }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.scheduled).toHaveLength(2);
    expect(result.scheduled.find(r => r.roomName === "A")).toBeDefined();
    expect(result.scheduled.find(r => r.roomName === "B")).toBeDefined();
  });

  it("should handle exact capacity match", () => {
    const input = {
      rooms: [
        { name: "A", capacity: 5, hoursAvailable: 8 }
      ],
      meetings: [
        { id: "m1", duration: 2, participants: 5 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.scheduled).toHaveLength(1);
    expect(result.scheduled[0].meetings).toEqual(["m1"]);
  });

  it("should handle exact hours available match", () => {
    const input = {
      rooms: [
        { name: "A", capacity: 5, hoursAvailable: 4 }
      ],
      meetings: [
        { id: "m1", duration: 2, participants: 3 },
        { id: "m2", duration: 2, participants: 3 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.scheduled).toHaveLength(1);
    expect(result.scheduled[0].hoursUsed).toBe(4);
    expect(result.scheduled[0].meetings).toEqual(["m1", "m2"]);
  });

  it("should handle very small decimal durations", () => {
    const input = {
      rooms: [
        { name: "A", capacity: 5, hoursAvailable: 8 }
      ],
      meetings: [
        { id: "m1", duration: 0.25, participants: 3 },
        { id: "m2", duration: 0.5, participants: 3 },
        { id: "m3", duration: 0.75, participants: 3 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.scheduled).toHaveLength(1);
    expect(result.scheduled[0].hoursUsed).toBe(1.5);
    expect(result.scheduled[0].meetings).toEqual(["m1", "m2", "m3"]);
  });

  it("should not schedule when hours used plus duration exceeds available", () => {
    const input = {
      rooms: [
        { name: "A", capacity: 5, hoursAvailable: 5 }
      ],
      meetings: [
        { id: "m1", duration: 3, participants: 3 },
        { id: "m2", duration: 2.1, participants: 3 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.scheduled).toHaveLength(1);
    expect(result.scheduled[0].meetings).toEqual(["m1"]);
    expect(result.unscheduled).toEqual(["m2"]);
  });

  it("should handle room names with special characters", () => {
    const input = {
      rooms: [
        { name: "Room-A", capacity: 5, hoursAvailable: 8 },
        { name: "Room A", capacity: 5, hoursAvailable: 8 },
        { name: "Room_A", capacity: 5, hoursAvailable: 8 }
      ],
      meetings: [
        { id: "m1", duration: 2, participants: 3 }
      ]
    };

    const result = scheduleMeetings(input);

    expect(result.scheduled).toHaveLength(1);
    expect(result.scheduled[0].roomName).toBe("Room A");
  });

  it("should handle complex scheduling scenario", () => {
    const input = {
      rooms: [
        { name: "Small", capacity: 3, hoursAvailable: 4, equipment: ["Projector"] },
        { name: "Medium", capacity: 6, hoursAvailable: 8, equipment: ["Whiteboard"] },
        { name: "Large", capacity: 10, hoursAvailable: 6 }
      ],
      meetings: [
        { id: "m1", duration: 2, participants: 2, equipmentNeeded: "Projector" },
        { id: "m2", duration: 3, participants: 5 },
        { id: "m3", duration: 1, participants: 2, equipmentNeeded: "Projector" },
        { id: "m4", duration: 4, participants: 5, equipmentNeeded: "Whiteboard" },
        { id: "m5", duration: 2, participants: 8 }
      ]
    };

    const result = scheduleMeetings(input);

    const smallRoom = result.scheduled.find(r => r.roomName === "Small");
    const mediumRoom = result.scheduled.find(r => r.roomName === "Medium");
    const largeRoom = result.scheduled.find(r => r.roomName === "Large");

    expect(smallRoom?.meetings).toEqual(["m1", "m3"]);
    expect(smallRoom?.hoursUsed).toBe(3);

    expect(mediumRoom?.meetings).toContain("m2");
    expect(mediumRoom?.meetings).toContain("m4");

    expect(largeRoom?.meetings).toEqual(["m5"]);
  });
});
