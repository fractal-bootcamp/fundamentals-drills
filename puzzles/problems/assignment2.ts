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
  const successfulReservations = []
  const finalTheater = structuredClone(initialTheater)

  for (const request of requests) {
    const { row, customerId, seatsNeeded } = request
    // Check if row is valid
    if (row >= 0 && row < finalTheater.length) {
      // Turn the request row into a string
      const stringOfRow = finalTheater[row].join('')
      let seatsNeededString = ''
      for (let i = 0; i < seatsNeeded; i++) {
        seatsNeededString += 'A'
      }
      // Find where the first instance of the string of needed seats (eg AAA) occurs
      const startingIndexOfSeatsNeeded = stringOfRow.indexOf(seatsNeededString)
      if (startingIndexOfSeatsNeeded !== -1) {
        let endSeatIndex = startingIndexOfSeatsNeeded
        for (let i = 0; i < seatsNeeded; i++) {
          finalTheater[row][startingIndexOfSeatsNeeded + i] = 'R'
          endSeatIndex = startingIndexOfSeatsNeeded + i
        }
        successfulReservations.push({
          customerId: customerId, 
          row: row,
          startSeat: startingIndexOfSeatsNeeded, 
          endSeat: endSeatIndex
        })
      }
    }
  }
  return {successfulReservations: successfulReservations, finalTheater: finalTheater}
}