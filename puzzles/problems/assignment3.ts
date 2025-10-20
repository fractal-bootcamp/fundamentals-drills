/**
 * Programming Puzzle — Library Book Returns
 *
 * You will implement a function that simulates the daily operation of a library’s
 * return and shelving system.
 *
 * Every day, books are returned in a random order. Each book belongs to a specific
 * section (e.g., "fiction", "science", "history") and must be shelved in that section.
 *
 * The shelving system can only hold a limited number of books per section per day.
 * If the section is full, the returned book waits in an overflow bin until the next day.
 *
 * You must process multiple days of returns and produce the final shelf and overflow states.
 *
 * ---
 * Input:
 *   {
 *     sections: {
 *       [sectionName: string]: {
 *         capacity: number;
 *         books: string[];
 *       };
 *     };
 *     days: {
 *       [day: string]: string[]; // list of book titles returned that day
 *     };
 *     bookSections: {
 *       [bookTitle: string]: string; // which section the book belongs to
 *     };
 *   }
 *
 * Rules:
 *   - Books from the overflow bin are processed first each day, before new returns.
 *   - If a section’s shelf is full, the extra books wait in overflow.
 *   - If a book's section does not exist, discard it.
 *   - Maintain the order of arrival for overflow books (FIFO).
 *
 * ---
 * Output:
 *   {
 *     sections: {
 *       [sectionName: string]: string[]; // final books on shelves
 *     };
 *     overflow: string[]; // any books still waiting after the final day
 *   }
 *
 * ---
 * Example:
 *
 * Input:
 * {
 *   sections: {
 *     fiction: { capacity: 2, books: ["A"] },
 *     science: { capacity: 1, books: [] }
 *   },
 *   days: {
 *     Monday: ["B", "C", "D"],
 *     Tuesday: ["E"]
 *   },
 *   bookSections: {
 *     A: "fiction",
 *     B: "fiction",
 *     C: "science",
 *     D: "fiction",
 *     E: "science"
 *   }
 * }
 *
 * Output:
 * {
 *   sections: {
 *     fiction: ["A", "B"],
 *     science: ["C"]
 *   },
 *   overflow: ["D", "E"]
 * }
 */

export function processLibraryReturns(input: {
	sections: {
		[sectionName: string]: {
			capacity: number;
			books: string[];
		};
	};
	days: {
		[day: string]: string[];
	};
	bookSections: {
		[bookTitle: string]: string;
	};
}): {
	sections: {
		[sectionName: string]: string[];
	};
	overflow: string[];
} {
	// Your code here
	throw new Error("Not implemented");
}
