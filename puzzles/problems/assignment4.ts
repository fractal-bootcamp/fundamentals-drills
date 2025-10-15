/**
 * Top Category by Total Minutes
 *
 * Context:
 * You are given a set of focused-work logs. Each log records a category label
 * (like "reading", "coding") and the number of minutes spent. Your task is to
 * find which category accumulated the most total minutes. If multiple categories
 * tie for the maximum, return the lexicographically smallest category.
 *
 * Input:
 * - tasks: Array<{ category: string; minutes: number }>
 *   - category: non-empty string (case-sensitive)
 *   - minutes: integer >= 0
 *
 * Output:
 * - string | null — the category with the highest total minutes, or null when the input is empty.
 *
 * Examples:
 * - topCategory([{category:"read",minutes:30},{category:"code",minutes:40},{category:"read",minutes:20}]) -> "read"
 * - topCategory([]) -> null
 */

//  const tasks = [
//             { category: "reading", minutes: 15 },
//             { category: "coding", minutes: 20 },
//         ];

export function topCategory(tasks: Array<{ category: string; minutes: number }>): string | null {
    // tasks[0].minutes < tasks[1].minutes
    // return tasks[1].category
    let longestTaskCategory = "";
    if (tasks.length === 0) {
        return null;
    }

    if (tasks.length === 1) {
        return tasks[0].category;
    }
    //  const tasks = [
    //      { category: "alpha", minutes: 10 },
    //      { category: "alpha", minutes: -5 }, // ignored
    //      { category: "beta", minutes: 9 },
    //  ];

    for (let i = 0; i < tasks.length - 1; i++) {
        if (tasks[i].minutes >= 0) {
            if (tasks[i].minutes > tasks[i + 1].minutes) { // 10, -5
                longestTaskCategory = tasks[i].category; // alpha
            } else {
                longestTaskCategory = tasks[i + 1].category; // beta
            }
        }

    }
    return longestTaskCategory;
}
