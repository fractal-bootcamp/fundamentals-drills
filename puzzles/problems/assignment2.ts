/**
 * Movie Theater Seating System
 *
 * You are implementing a movie theater seating system. The theater has rows of seats,
 * and customers can request to reserve seats. You need to process reservation requests
 * and determine the final seating arrangement.
 *
 * The theater is represented as a grid where each seat can be "available", "reserved",
 * or "blocked" (unusable). Customers request seats by specifying their preferred row
 * and the number of consecutive seats they need.
 *
 * Rules:
 * - Seats must be consecutive in the same row
 * - Choose the leftmost available group of seats in the requested row
 * - If the requested row doesn't have enough consecutive seats, deny the request
 * - Blocked seats cannot be reserved and break consecutiveness
 *
 * Input: Theater layout (2D array) and list of reservation requests
 * Theater: "A" = available, "R" = reserved, "B" = blocked
 * Requests: { customerId: string, row: number, seatsNeeded: number }
 *
 * Return: Object with successful reservations and final theater state
 *
 * Example:
 * Initial theater: [["A", "A", "B", "A", "A"], ["A", "A", "A", "A", "A"]]
 * Request: { customerId: "customer1", row: 0, seatsNeeded: 2 }
 * Result: Seats 0-1 in row 0 reserved, seats 3-4 still available
 */

export function processReservations(initialTheater, requests): any {
  // if customer requests one seat, cycle through the theater [i], first row, find where row[i] === A, set as R, return
  // if customer requests "x" multiple, check if x consecutive are "A"?
  const theatre = initialTheater
  let conseqSeats = []
  const succReservations = []
  for (let i = 0; i < requests.length; i++) {
    if (requests.seatsNeeded > initialTheater[0].length) throw new Error("too many seats")
    const seatsNeeded = requests[i].seatsNeeded.length
    const reqRow = requests[i].row
    initialTheater[reqRow].forEach((seat, index) => {
      for (let j = 0; j < seatsNeeded; j++) {
        if (conseqSeats.length === seatsNeeded) {
          break
        } 
        if (seat === "A") {
          const openSeat = [reqRow, index]
          conseqSeats.push(openSeat)
        } else {
          conseqSeats = []
        }
      }
    })
    if (conseqSeats.length === seatsNeeded) {
      conseqSeats.forEach((seat) => {
        theatre[seat[0][1]] = "R"
      })
    }
    const string = `Seats ${conseqSeats[0][1]}-${conseqSeats[conseqSeats.length - 1][1]} in row ${reqRow} reserved`
    succReservations.push(string)
  }

  return {succReservations, theatre}
}

console.log(processReservations([["A", "A", "B", "A", "A"], ["A", "A", "A", "A", "A"]],[{ customerId: "customer1", row: 0, seatsNeeded: 2 }]))