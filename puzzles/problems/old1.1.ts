// puzzles/problems/assignment1.ts

/**
 * Problem: Frequent Element Finder
 *
 * Given an array of integers, find the element that occurs most frequently.
 * If multiple elements are tied for the most frequent, return the smallest one.
 *
 * Input:
 *   - numbers: number[] — array of integers, may be empty
 * Output:
 *   - number | null — the most frequent element, or null if input is empty
 *
 * Examples:
 *   frequentElement([1,2,2,3,3,3,2]) => 2
 *   frequentElement([]) => null
 */
export function frequentElement(numbers: number[]): number | null {
	if (numbers.length === 0) {
		return null;
	}
	const frequency = new Map();
	for (const n of numbers) {
		if (!frequency.has(n)) {
			frequency.set(n, 1);
		} else {
			const add = frequency.get(n) + 1;
			frequency.set(n, add);
		}
	}
	let mostFrequent = numbers[0];
	frequency.forEach((value, key) => {
		console.log(key, value);
		if (value > frequency.get(mostFrequent)) {
			mostFrequent = key;
		}
		if (value === frequency.get(mostFrequent)) {
			mostFrequent = key < mostFrequent ? key : mostFrequent;
		}
	});
	return mostFrequent;
}

// console.log(frequentElement([1, 2, 2, 3, 3, 3, 2]));
