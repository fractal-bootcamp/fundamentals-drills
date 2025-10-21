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
  // filter players who scored > 10
  // const filteredPlayers = players.filter((player) => player.points > 10)
  // find sum of points based on filteredPlayers
  // return filteredPlayers.reduce((total, player) => total + player.points, 0)

  return players
    .filter((player) => player.points > 10)
    .reduce((total, player) => total + player.points, 0);
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

export function premiumProductNames(products: { name: string; price: number; quantity: number }[]): string[] {
  return products
    .filter((product) => product.quantity > 0 && product.price >= 100)
    .map((product) => product.name)
    .sort()
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
  const ordersGoodArr = orders.filter(
    (order) => order.status === "shipped" || order.status === "delivered",
  );

  if (ordersGoodArr.length === orders.length) {
    return true;
  } else {
    return false;
  }
}

// console.log(allOrdersComplete([{ orderId: "B1", status: "shipped" }, { orderId: "B2", status: "pending" }]))

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

export function groupCitiesByCountry(cities: { city: string; country: string }[]): Record<string, string[]> {
  // return -> {key: countryName, value: [cityName]}

  return cities.reduce((newCountryObj, currentCity) => {
    if (newCountryObj[currentCity.country] === undefined) {
        newCountryObj[currentCity.country] = [currentCity.city]
    } else {
      newCountryObj[currentCity.country].push(currentCity.city)
    }
  return newCountryObj;
  }, {});
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
  return employees
    .filter((employee) => employee.department === "engineering")
    .reduce((total, currEmployee) => total + currEmployee.salary, 0);
}
