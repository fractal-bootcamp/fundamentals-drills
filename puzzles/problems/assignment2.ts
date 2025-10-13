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

  let suc_res: { customerId: string, row: number, seatsNeeded: number }[] = []

  let result = {
    successfulReservations: suc_res,
    finalTheater: []
  }

  let totalRows = initialTheater.length
  let modifiedTheater = structuredClone(initialTheater)


  if (requests.length === 0) {

    result.successfulReservations = requests
    result.finalTheater = initialTheater
    return result
  }

  if (initialTheater.length == 0) {

    result.successfulReservations = [],
      result.finalTheater = initialTheater
    return result
  }

  for (const req of requests) {

    //Handle invalid row numbers
    if (req.row < 0 || req.row >= totalRows) {
      result.successfulReservations = []
      result.finalTheater = initialTheater
      return result
    }


    let consec_free = 0
    for (const seat of modifiedTheater[req.row]) {

      //seat is not available
      if (seat === 'R' || seat == 'B') {
        consec_free = 0
        continue
      }

      //seat is available
      consec_free += 1

      //request can be granted
      if (consec_free === req.seatsNeeded) {
        result.successfulReservations.push(req)
      }

    }

  }


  return result


}

// let initialTheater = []
// let Request = { customerId: "customer1", row: 0, seatsNeeded: 2 }



