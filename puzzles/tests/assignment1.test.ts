import { describe, it, expect } from "vitest";
import { processParkingSessions } from "../problems/assignment1";

describe("processParkingSessions", () => {
	it("handles basic valid flow", () => {
		const events = [
			{ plate: "A1", action: "enter", gate: "North" },
			{ plate: "A1", action: "exit", gate: "South" },
		];
		const result = processParkingSessions(2, events);
		expect(result.completed).toEqual([
			{ plate: "A1", enteredAtGate: "North", exitedAtGate: "South" },
		]);
		expect(result.active).toEqual({});
		expect(result.rejected).toEqual([]);
	});

	it("rejects double enter and exit without enter", () => {
		const events = [
			{ plate: "A1", action: "enter", gate: "North" },
			{ plate: "A1", action: "enter", gate: "East" },
			{ plate: "B2", action: "exit", gate: "West" },
		];
		const result = processParkingSessions(3, events);
		expect(result.rejected).toEqual([
			{
				plate: "A1",
				action: "enter",
				gate: "East",
				reason: "already inside",
			},
			{ plate: "B2", action: "exit", gate: "West", reason: "not inside" },
		]);
		expect(result.active).toHaveProperty("A1");
	});

	it("rejects when full", () => {
		const events = [
			{ plate: "A1", action: "enter", gate: "North" },
			{ plate: "B2", action: "enter", gate: "South" },
			{ plate: "C3", action: "enter", gate: "East" },
		];
		const result = processParkingSessions(2, events);
		expect(result.rejected).toEqual([
			{ plate: "C3", action: "enter", gate: "East", reason: "lot full" },
		]);
	});

	it("ignores invalid events", () => {
		const events = [
			{ plate: "X1", action: "enter", gate: "Main" },
			{ foo: "bar" }, // invalid
			{ plate: "", action: "enter", gate: "Side" }, // invalid
		];
		const result = processParkingSessions(2, events);
		expect(result.completed.length).toBe(0);
		expect(result.rejected.length).toBe(0);
		expect(result.active).toHaveProperty("X1");
	});
});
