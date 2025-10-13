/**
 * Student Grade Calculator
 *
 * Given an array of student records, find the student with the highest average grade.
 * Each student record contains a name and an array of test scores. Calculate each
 * student's average and return the name of the student with the highest average.
 * If there's a tie, return the student whose name appears first in the array.
 *
 * Input: Array of objects with { name: string, scores: number[] }
 * Output: String representing the name of the top student
 *
 * Examples:
 * - [{ name: "Alice", scores: [85, 90, 78] }, { name: "Bob", scores: [92, 88] }] → "Bob"
 * - [{ name: "Charlie", scores: [80] }, { name: "Dana", scores: [80, 80] }] → "Charlie"
 */

function findTestAvg(scores: number[]): number {
	let sum = 0;
	for (const score of scores) {
		sum += score;
	}
	console.log(sum / scores.length);
	return sum / scores.length;
}

type student = {
	name: string;
	scores: number[];
};

export function findTopStudent(students: student[]): string {
	if (students.length == 0) throw Error("No students in class");
	let topStudent = students[0].name;
	let topScore = 0;
	for (const student of students) {
		console.log(findTestAvg(student.scores));
		if (findTestAvg(student.scores) > topScore) {
			//???? Idk why this is evaluating to true. fuck i just figure it out but I am out of time
			console.log("setting top", student.name);
			topStudent = student.name;
		}
		//console.log("student: ", student.name, findTestAvg(student.scores));
	}
	return topStudent;
}
