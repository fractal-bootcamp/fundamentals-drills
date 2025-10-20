// Given an array of numbers, return the sum of all odd numbers.
// Examples:
// [1, 2, 3, 4, 5] => 9 (1 + 3 + 5)
// [2, 4, 6] => 0
// [11, 13] => 24

export function sumOddNumbers(numbers: number[]): number {
  let sum = 0;

  for (const num of numbers) {
    if (num % 2 !== 0) {
      sum += num;
    }
  }

  return sum;
}

// Given an array of strings, return the longest string.
// If there are multiple strings with the same longest length, return the first one.
// Examples:
// ["cat", "elephant", "dog"] => "elephant"
// ["hi", "yo"] => "hi"
// ["a", "bb", "cc", "d"] => "bb"

export function findLongestString(strings: string[]): string {
  let longestString = strings[0];

  for (const str of strings) {
    if (str.length > longestString.length) {
      longestString = str;
    }
  }

  return longestString;
}

// Given an array of objects representing books with title and pages,
// return an array of titles for books that have more than 200 pages.
// Examples:
// [{title: "Short", pages: 100}, {title: "Long", pages: 300}] => ["Long"]
// [{title: "A", pages: 50}, {title: "B", pages: 150}] => []
// [{title: "Epic", pages: 500}, {title: "Novel", pages: 250}] => ["Epic", "Novel"]

export function findLongBooks(books: { title: string; pages: number }[]): string[] {
  const longBookTitles: string[] = [];

  for (const book of books) {
    if (book.pages > 200) {
      longBookTitles.push(book.title);
    }
  }

  return longBookTitles;
}

// Given an array of numbers, return true if all numbers are positive (greater than 0).
// An empty array should return true.
// Examples:
// [1, 2, 3] => true
// [1, -1, 3] => false
// [] => true

export function allPositive(numbers: number[]): boolean {
  for (const num of numbers) {
    if (num <= 0) {
      return false;
    }
  }

  return true;
}

// Given an array of shopping items with name and price,
// return the total cost of all items.
// Examples:
// [{name: "apple", price: 1.5}, {name: "bread", price: 2.5}] => 4.0
// [{name: "milk", price: 3.0}] => 3.0
// [] => 0

export function calculateTotal(items: { name: string; price: number }[]): number {
  let total = 0;

  for (const item of items) {
    total += item.price;
  }

  return total;
}
