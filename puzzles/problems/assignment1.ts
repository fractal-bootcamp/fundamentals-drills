// puzzles/problems/assignment1.ts

/**
 * Problem: Word Ladder Distance
 *
 * You are given two lowercase words of equal length and a dictionary (array) of valid words.
 * You can transform one word into another by changing exactly one letter at a time,
 * and every intermediate word must exist in the dictionary.
 *
 * Return the minimum number of transformations required to reach the target word,
 * or null if it is not possible.
 *
 * Input:
 *   - start: string — starting word (non-empty, lowercase)
 *   - end: string — target word (same length as start)
 *   - dictionary: string[] — list of lowercase words, may include start and end
 *
 * Output:
 *   - number | null — minimum steps to reach end, or null if impossible
 *
 * Examples:
 *   wordLadder("hit", "cog", ["hot","dot","dog","lot","log","cog"]) => 5
 *     (hit → hot → dot → dog → cog)
 *   wordLadder("hit", "zzz", ["hot","dot","dog"]) => null
 */

function oneLetterAway(target: string, compare: string): boolean {
	if (target === compare) return false;
	let offByOne = false;
	for (let i = 0; i < target.length; i++) {
		if (target[i] != compare[i]) {
			if (offByOne) return false;
			offByOne = true;
		}
	}
	return offByOne;
}

function getNeighbors(target: string, dict: string[]): string[] {
	let neighbors = [];
	for (const compare of dict)
		if (oneLetterAway(target, compare)) neighbors.push(compare);
	return neighbors;
}

//console.log(getNeighbors("dog", ["hot", "dot", "dog", "lot", "log", "cog"]));

// use queue
// search on layer then next layer when found return
// find non visited neighbors, and check. if === return tree depth
// else add to visited and to queue
// pop from queue and recurse

// example queue: hit - hot - dot, lot - dog - log, cog

export function wordLadder(
	start: string,
	end: string,
	dictionary: string[]
): number | null {
	if (start === end) return 0;
	let visted = [start];
	let queue: [string, number][] = [[start, 1]];
	while (queue.length > 0) {
		//console.log("QQQQQQQQQQQ:", queue);
		const [search, depth] = queue.shift()!;
		console.log("searching", search, depth);
		if (search === end) {
			//only when not start
			return depth;
		}
		const neighbors = getNeighbors(search, dictionary);
		neighbors.forEach((n) => {
			if (!visted.includes(n)) {
				visted.push(n);
				queue.push([n, depth + 1]);
			}
		});
	}
	console.log("no path");
	return null;
}
