import { describe, it, expect } from "vitest";
import { processLibraryReturns } from "../problems/assignment3";

describe("processLibraryReturns", () => {
	it("shelves books correctly with available space", () => {
		const input = {
			sections: {
				fiction: { capacity: 3, books: [] },
				history: { capacity: 2, books: [] },
			},
			days: {
				Monday: ["A", "B", "C"],
			},
			bookSections: {
				A: "fiction",
				B: "fiction",
				C: "history",
			},
		};
		const result = processLibraryReturns(input);
		expect(result).toEqual({
			sections: {
				fiction: ["A", "B"],
				history: ["C"],
			},
			overflow: [],
		});
	});

	it("handles overflow correctly when capacity exceeded", () => {
		const input = {
			sections: {
				science: { capacity: 1, books: [] },
			},
			days: {
				Monday: ["A", "B"],
			},
			bookSections: {
				A: "science",
				B: "science",
			},
		};
		const result = processLibraryReturns(input);
		expect(result).toEqual({
			sections: {
				science: ["A"],
			},
			overflow: ["B"],
		});
	});

	it("processes overflow before new returns on subsequent days", () => {
		const input = {
			sections: {
				fiction: { capacity: 2, books: [] },
			},
			days: {
				Monday: ["A", "B", "C"],
				Tuesday: ["D"],
			},
			bookSections: {
				A: "fiction",
				B: "fiction",
				C: "fiction",
				D: "fiction",
			},
		};
		const result = processLibraryReturns(input);
		expect(result).toEqual({
			sections: {
				fiction: ["A", "B"],
			},
			overflow: ["C", "D"],
		});
	});

	it("discards books that belong to nonexistent sections", () => {
		const input = {
			sections: {
				history: { capacity: 1, books: [] },
			},
			days: {
				Monday: ["A", "B"],
			},
			bookSections: {
				A: "history",
				B: "unknown",
			},
		};
		const result = processLibraryReturns(input);
		expect(result).toEqual({
			sections: {
				history: ["A"],
			},
			overflow: [],
		});
	});

	it("maintains overflow order (FIFO)", () => {
		const input = {
			sections: {
				fiction: { capacity: 2, books: [] },
			},
			days: {
				Monday: ["A", "B", "C"],
				Tuesday: ["D", "E"],
			},
			bookSections: {
				A: "fiction",
				B: "fiction",
				C: "fiction",
				D: "fiction",
				E: "fiction",
			},
		};
		const result = processLibraryReturns(input);
		expect(result).toEqual({
			sections: {
				fiction: ["A", "B"],
			},
			overflow: ["C", "D", "E"],
		});
	});
});
