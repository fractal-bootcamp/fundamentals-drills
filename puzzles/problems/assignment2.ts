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

// Defining types
type Seat = "A" | "B" | "R"
type Theater = Seat[][]
type Request = {
  customerId: string;
  row: number;
  seatsNeeded: number;
}
type SuccessfulReservations = {
  customerId: string;
  row: number;
  startSeat: number;
  endSeat: number;
}

// Check if the Theater is full
function theaterIsFull(theater: Theater): boolean {
  return theater.every((row: Seat[]) => {
    return row.every((seat: Seat) => (seat === "R") || (seat === "B"))
  })
}


export function processReservations(
  initialTheater: Theater, requests: Request[]): { successfulReservations: SuccessfulReservations[], finalTheater: Theater } {

  // deep clone the theater object that we're going to mutate TF out of
  const finalTheater = structuredClone(initialTheater)
  // 1. Check for presence of requests
  if (!requests) {
    return { finalTheater, successfulReservations: requests }
  }
  // 2. Check if there's space in the theater at all
  if (theaterIsFull(initialTheater)) {
    return { finalTheater, successfulReservations: [] }
  }

  // make an array to hold processed requests
  const successfulReservations: SuccessfulReservations[] = []

  // 4. Check requests against row
  // Huh, I need to check if there's consecutive seats available anywhere at all on the row, don't I?
  // so for ["A", "A", "B", "A", "A"] and seatsNeeded = 2
  // Count over the array, and when a "B" or "R" is reached start over until the next "A" is hit
  // Ok now this needs to happen in the requests loop

  requests.forEach(request => {
    if (request.row < 0) return
    if (!finalTheater[request.row]) return

    const { seatsNeeded } = request
    const requestedRow = finalTheater[request.row]
    let reservableSeats: number[][] = []
    let consecutiveSeatsAvailable = 0;

    // while i is less than the length of the row, iterate over the row
    for (let i = 0; i < finalTheater[request.row].length; i++) {

      // break the loop as soon as we have all the seats we need
      if (reservableSeats.length == seatsNeeded) {
        break
      }
      const currentSeat = requestedRow[i]
      // check the current seat, if it's availble, push it in to the array
      if (currentSeat === "A") {
        consecutiveSeatsAvailable++
        reservableSeats.push([request.row, i])

        // if not available, reset the count and empty the array
      } else if (currentSeat === "B" || currentSeat === "R") {
        consecutiveSeatsAvailable = 0
        reservableSeats = []
      }
    }

    // if there's not enough consecutive seats available on the row, end the loop and give up on the request
    if (consecutiveSeatsAvailable < seatsNeeded) {
      return
    }

    // 5. Update theater object
    reservableSeats.forEach(seat => {
      finalTheater[seat[0]][seat[1]] = "R"
    })

    const reservationSize = reservableSeats.length

    if (reservationSize == seatsNeeded) {
      const reservation = {
        customerId: request.customerId,
        row: request.row,
        startSeat: reservableSeats[0][1],
        endSeat: reservableSeats[reservationSize - 1][1]
      }

      successfulReservations.push(reservation)
    }

  })

  const result = { finalTheater, successfulReservations }
  return result
}