import { describe, it, expect } from "vitest";
import { simulateTrafficLights } from "../problems/assignment2";

describe("simulateTrafficLights", () => {
  it("starts with all lights red when no commands given", () => {
    const result = simulateTrafficLights([]);
    expect(result).toEqual({
      north: "red",
      south: "red",
      east: "red",
      west: "red",
    });
  });

  it("allows a single light to turn green", () => {
    const commands = [{ direction: "north", state: "green" }];
    const result = simulateTrafficLights(commands);
    expect(result.north).toBe("green");
    expect(result.south).toBe("red");
    expect(result.east).toBe("red");
    expect(result.west).toBe("red");
  });

  it("rejects command that would create two green lights", () => {
    const commands = [
      { direction: "north", state: "green" },
      { direction: "south", state: "green" }, // should be rejected
    ];
    const result = simulateTrafficLights(commands);
    expect(result.north).toBe("green");
    expect(result.south).toBe("red");
  });

  it("allows transitioning green to yellow to red", () => {
    const commands = [
      { direction: "north", state: "green" },
      { direction: "north", state: "yellow" },
      { direction: "north", state: "red" },
    ];
    const result = simulateTrafficLights(commands);
    expect(result.north).toBe("red");
  });

  it("allows changing multiple lights to red simultaneously", () => {
    const commands = [
      { direction: "north", state: "green" },
      { direction: ["north", "south"], state: "red" },
    ];
    const result = simulateTrafficLights(commands);
    expect(result.north).toBe("red");
    expect(result.south).toBe("red");
  });

  it("allows another light to turn green after previous green turns yellow", () => {
    const commands = [
      { direction: "north", state: "green" },
      { direction: "north", state: "yellow" },
      { direction: "east", state: "green" },
    ];
    const result = simulateTrafficLights(commands);
    expect(result.north).toBe("yellow");
    expect(result.east).toBe("green");
  });

  it("allows multiple lights to be yellow simultaneously", () => {
    const commands = [
      { direction: "north", state: "yellow" },
      { direction: "south", state: "yellow" },
    ];
    const result = simulateTrafficLights(commands);
    expect(result.north).toBe("yellow");
    expect(result.south).toBe("yellow");
  });

  it("handles complex realistic scenario", () => {
    const commands = [
      { direction: "north", state: "green" }, // north green
      { direction: "south", state: "green" }, // rejected
      { direction: "north", state: "yellow" }, // north yellow
      { direction: "east", state: "green" }, // east green
      { direction: "west", state: "green" }, // rejected
      { direction: "east", state: "yellow" }, // east yellow
      { direction: ["north", "east"], state: "red" }, // both red
      { direction: "west", state: "green" }, // west green
    ];
    const result = simulateTrafficLights(commands);
    expect(result.north).toBe("red");
    expect(result.south).toBe("red");
    expect(result.east).toBe("red");
    expect(result.west).toBe("green");
  });

  it("continues processing after rejected command", () => {
    const commands = [
      { direction: "north", state: "green" },
      { direction: "south", state: "green" }, // rejected
      { direction: "east", state: "yellow" }, // should still process
    ];
    const result = simulateTrafficLights(commands);
    expect(result.north).toBe("green");
    expect(result.east).toBe("yellow");
  });
});
