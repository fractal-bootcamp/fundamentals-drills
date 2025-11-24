/**
 * Traffic Light Simulator
 *
 * You are simulating a simple traffic intersection with four traffic lights (North, South, East, West).
 * Each light can be in one of three states: "red", "yellow", or "green".
 *
 * The simulation starts with all lights red. You are given a sequence of time steps and commands
 * that change light states. Each command specifies which direction(s) to change and to what state.
 *
 * Rules:
 * - At any given time, at most one direction can have a green light (safety constraint)
 * - Yellow lights are transitional and don't violate the green constraint
 * - If a command would result in two green lights simultaneously, reject it and keep current state
 * - Process commands in order; if a command is rejected, continue with the next one
 * - Return the final state of all four lights after processing all commands
 *
 * Input: An initial state (optional, defaults to all red) and an array of commands
 * Each command has: { direction: string (or array of strings), state: "red" | "yellow" | "green" }
 *
 * Output: An object with the final state of each direction: { north: string, south: string, east: string, west: string }
 *
 * Examples:
 * - Starting all red, command {direction: "north", state: "green"} → north becomes green
 * - If north is green, command {direction: "south", state: "green"} → rejected (two greens)
 * - If north is green, command {direction: "north", state: "yellow"} → north becomes yellow
 * - Command {direction: ["north", "south"], state: "red"} → both become red
 *
 * Edge cases:
 * - Empty command list returns initial state
 * - Invalid direction names are ignored
 * - Multiple lights can be yellow or red simultaneously
 */

export function simulateTrafficLights(commands: any) {
  // Your implementation here
  throw new Error("Not implemented");
}
