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

type Row = string[]
type Theater = Row[]

type Request = {
  customerId: string
  row: number
  seatsNeeded: number
}


export function processReservations(initialTheater: Theater, requests: Request): any {
  const { customerId, row, seatsNeeded } = requests

  let availableConsecutiveSeats = 0
  const checkSeats = initialTheater[row].map((seat) => {
    if (seat === "A") {
      availableConsecutiveSeats = availableConsecutiveSeats + 1
    }
  })

  if (seatsNeeded > availableConsecutiveSeats) {
    return { finalTheater: initialTheater, successfulReservations: {} }
  } else {
    for (let i = 0; i < seatsNeeded; i++) {
      for (let j = 0; j < initialTheater[row].length; j++) {
        // I couldn't figure out how to properly loop through the array while keeping track of stuff
      }

    }
    
  }
}




// const newTheater = initialTheater[row].map((seat) => {
//   if (seat === "A") {
//     seat = "R"
//   }

//   if (i === seatsNeeded) {
    
//   } else
//   return 
// })