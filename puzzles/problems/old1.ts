/**
 * Assignment 1 — Consecutive Sum Streak
 *
 * Context:
 * In analytics or signal processing, we sometimes want to detect “streaks” of rising data. Given an array of integers,
 * return the length of the longest consecutive increasing run (where each next number is exactly 1 greater).
 * For example, [1,2,3,5,6,7,8,10] has a longest streak [5,6,7,8] of length 4.
 *
 * Input:
 *   - nums: number[] — may be empty or contain duplicates.
 * Output:
 *   - number — length of the longest strictly consecutive +1 run.
 *
 * Examples:
 *   longestStreak([1,2,3,5,6,7,8,10]) -> 4
 *   longestStreak([5,5,5]) -> 1
 *   longestStreak([]) -> 0
 */
export function longestStreak(nums: number[]): number {
	if (nums.length === 0) return 0;
	let maxStreak = 1;
	let currentStreak = 1;
	for (let i = 1; i < nums.length; i++) {
		const prev = nums[i - 1];
		if (nums[i] - prev === 1) {
			currentStreak += 1;
			if (currentStreak > maxStreak) maxStreak = currentStreak;
		} else {
			currentStreak = 1;
		}
	}
	return maxStreak;
}

//the fucked reduce way
// export const longestStreak = (nums: number[]): number => {
// 	if (nums.length === 0) return 0;

// 	const [max] = nums.reduce(
// 		([max, cur], n, i, arr) => {
// 			if (i === 0) return [1, 1];
// 			if (n === arr[i - 1] + 1) {
// 				const newCur = cur + 1;
// 				return [Math.max(max, newCur), newCur];
// 			} else {
// 				return [max, 1];
// 			}
// 		},
// 		[0, 0]
// 	);

// 	return max;
// };
