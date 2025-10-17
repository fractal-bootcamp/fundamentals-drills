import { describe, it, expect } from 'vitest';
import { findTopStudent } from '../problems/assignment1';

describe('findTopStudent', () => {
  it('should find student with highest average', () => {
    const students = [
      { name: "Alice", scores: [85, 90, 78] },
      { name: "Bob", scores: [92, 88] }
    ];
    expect(findTopStudent(students)).toBe("Bob");
  });

  it('should return first student in case of tie', () => {
    const students = [
      { name: "Charlie", scores: [80] },
      { name: "Dana", scores: [80, 80] }
    ];
    expect(findTopStudent(students)).toBe("Charlie");
  });

  it('should handle single student', () => {
    const students = [
      { name: "Eve", scores: [95, 87, 92] }
    ];
    expect(findTopStudent(students)).toBe("Eve");
  });

  it('should handle students with single scores', () => {
    const students = [
      { name: "Frank", scores: [75] },
      { name: "Grace", scores: [85] },
      { name: "Henry", scores: [80] }
    ];
    expect(findTopStudent(students)).toBe("Grace");
  });

  it('should handle students with different numbers of scores', () => {
    const students = [
      { name: "Ivy", scores: [70, 80, 90, 85] },
      { name: "Jack", scores: [95, 85] },
      { name: "Kate", scores: [88] }
    ];
    expect(findTopStudent(students)).toBe("Jack");
  });

  it('should handle empty scores array', () => {
    const students = [
      { name: "Leo", scores: [] },
      { name: "Mia", scores: [75, 85] }
    ];
    expect(findTopStudent(students)).toBe("Mia");
  });

  it('should handle all students with empty scores', () => {
    const students = [
      { name: "Nina", scores: [] },
      { name: "Oscar", scores: [] }
    ];
    expect(findTopStudent(students)).toBe("Nina");
  });

  it('should handle large class with various scores', () => {
    const students = [
      { name: "Alice", scores: [78, 82, 85] },
      { name: "Bob", scores: [90, 88, 92, 87] },
      { name: "Charlie", scores: [95] },
      { name: "Diana", scores: [85, 88] },
      { name: "Edward", scores: [76, 79, 81, 84, 88] }
    ];
    expect(findTopStudent(students)).toBe("Charlie");
  });

  it('should throw error for empty array', () => {
    expect(() => findTopStudent([])).toThrow('No students provided');
  });

  it('should handle perfect scores', () => {
    const students = [
      { name: "Perfect", scores: [100, 100, 100] },
      { name: "AlmostPerfect", scores: [99, 100, 99] }
    ];
    expect(findTopStudent(students)).toBe("Perfect");
  });
});