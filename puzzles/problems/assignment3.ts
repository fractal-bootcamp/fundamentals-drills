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

type Sections = {
	[sectionName: string]: string[];
};

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
	sections: Sections;
	overflow: string[];
} {
	let overflow: string[] = [];

	let sections: Sections = {};
	//initialize sections from input
	for (const section in input.sections) {
		sections = { ...sections, [section]: input.sections[section].books };
	}

	const days = input.days;
	const bookSections = input.bookSections;

	for (const day in days) {
		//console.log(day);
		for (const leftoverBook of overflow) {
			//console.log("overflow");
			//console.log(leftoverBook);
			// if not valid section discard
			if (!(bookSections[leftoverBook] in sections)) {
				overflow.filter((b) => b !== leftoverBook);
			}
			// check capacity
			const thisBookSection = bookSections[leftoverBook];
			if (
				input.sections[thisBookSection].capacity <
				sections[thisBookSection].length
			) {
				sections[thisBookSection].push(leftoverBook);
				overflow.filter((b) => b !== leftoverBook);
			}
		}
		for (const book of days[day]) {
			//console.log("Regular");
			//console.log(book);

			// canBeShelved?
			// else add to overflow
			// if not valid section skip book

			if (!(bookSections[book] in sections)) {
				continue;
			}
			// check capacity
			const thisBookSection = bookSections[book];
			//console.log(input.sections[thisBookSection].capacity);
			//console.log(sections[thisBookSection].length);
			if (
				input.sections[thisBookSection].capacity >
				sections[thisBookSection].length
			) {
				sections[thisBookSection].push(book);
			} else {
				overflow.push(book);
			}
		}
	}
	return { sections, overflow };
}

const input = {
	sections: {
		fiction: { capacity: 2, books: ["A"] },
		science: { capacity: 1, books: [] },
	},
	days: {
		Monday: ["B", "C", "D"],
		Tuesday: ["E"],
	},
	bookSections: {
		A: "fiction",
		B: "fiction",
		C: "science",
		D: "fiction",
		E: "science",
	},
};

console.log(processLibraryReturns(input));
