// Problem 1: Team Score Summary
// Given an array of player scores, calculate the total team score but only
// count scores from players who scored above 10 points.
// Input: Array of objects with { name: string, points: number }
// Output: number (sum of qualifying scores)
// Examples:
// [{ name: "alice", points: 15 }, { name: "bob", points: 8 }] => 15
// [{ name: "charlie", points: 12 }, { name: "diana", points: 20 }] => 32
// [] => 0

export function teamScoreSummary(players: { name: string; points: number }[]): number {
  // const runningTotal = 0
  // for each player in players
  //    if player.points > 10
  //        runningTotal = runningTotal + player.points
  let runningTotal = 0;

  for (const player of players) {
    if (player.points > 10) {
      runningTotal = runningTotal + player.points;
    }
  }

  return runningTotal;
}

// Problem 2: Premium Product Names
// Given an array of products, return the names of all products that are both
// in stock (quantity > 0) and expensive (price >= 100), sorted alphabetically.
// Input: Array of objects with { name: string, price: number, quantity: number }
// Output: string[] (sorted alphabetically)
// Examples:
// [{ name: "laptop", price: 999, quantity: 5 }, { name: "mouse", price: 25, quantity: 10 }] => ["laptop"]
// [{ name: "keyboard", price: 150, quantity: 0 }, { name: "monitor", price: 200, quantity: 3 }] => ["monitor"]
// [] => []

export function premiumProductNames(
  products: { name: string; price: number; quantity: number }[],
): string[] {
  // let productnames: Array<string> = []
  // for each product in products
  // if product.quantity > 0 && product.price >= 100
  // return productNames.sort()

  const productNames: Array<string> = [];

  for (const product of products) {
    if (product.quantity > 0 && product.price >= 100) {
      productNames.push(product.name);
    }
  }
  return productNames.sort();
}

// Problem 3: All Orders Complete
// Given an array of orders, return true if every order has a status of "shipped" or "delivered".
// Input: Array of objects with { orderId: string, status: string }
// Output: boolean
// Examples:
// [{ orderId: "A1", status: "shipped" }, { orderId: "A2", status: "delivered" }] => true
// [{ orderId: "B1", status: "shipped" }, { orderId: "B2", status: "pending" }] => false
// [] => true

export function allOrdersComplete(
  orders: { orderId: string; status: string }[],
): boolean {
  for (const order of orders) {
    if (order.status !== "shipped" && order.status !== "delivered") {
      return false;
    }
  }
  return true;
}

// Problem 4: Group Cities by Country
// Given an array of city objects, return an object where keys are country names
// and values are arrays of city names from that country.
// Input: Array of objects with { city: string, country: string }
// Output: Record<string, string[]> (object mapping country to city names)
// Examples:
// [{ city: "Paris", country: "France" }, { city: "Lyon", country: "France" }]
//   => { France: ["Paris", "Lyon"] }
// [{ city: "Tokyo", country: "Japan" }, { city: "Berlin", country: "Germany" }]
//   => { Japan: ["Tokyo"], Germany: ["Berlin"] }
// [] => {}

export function groupCitiesByCountry(
  cities: { city: string; country: string }[],
): Record<string, string[]> {
  const countryObject: Record<string, Array<string>> = {};

  for (let i = 0; i < cities.length; i++) {
    if (!countryObject[cities[i].country]) {
      countryObject[cities[i].country] = [];
    }
    countryObject[cities[i].country].push(cities[i].city);
  }
  return countryObject;
}

// Problem 5: Calculate Department Budget
// Given an array of employees with departments and salaries, calculate the
// total budget needed for the "engineering" department only.
// Input: Array of objects with { name: string, department: string, salary: number }
// Output: number (total salary for engineering dept)
// Examples:
// [{ name: "alice", department: "engineering", salary: 100000 }, { name: "bob", department: "sales", salary: 80000 }] => 100000
// [{ name: "charlie", department: "engineering", salary: 95000 }, { name: "diana", department: "engineering", salary: 105000 }] => 200000
// [] => 0

export function calculateDepartmentBudget(
  employees: { name: string; department: string; salary: number }[],
): number {
  // store a new var = filter all objects whose departments are eng
  const filteredForEng = employees.filter(
    (employee) => employee.department === "engineering",
  );

  // store a new var = reduce all salaries in this new array
  const reducedSalaries = filteredForEng.reduce(
    (totalSalaries, currentEmployee) => totalSalaries + currentEmployee.salary,
    0,
  );
  return reducedSalaries;
}
