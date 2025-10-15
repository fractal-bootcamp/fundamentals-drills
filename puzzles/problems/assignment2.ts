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

type theater = string[][]

type reservationRequest = {
  customerId: string,
  row: number,
  seatsNeeded: number
}

type successReservation = {
  customerId: string,
  row: number,
  startSeat: number,
  endSeat: number
}


type finalResult = {
  successfulReservations: successReservation[]
  finalTheater: theater
}

export function processReservations(initialTheater, requests): any {

  let finalTheater = structuredClone(initialTheater)
  let updatedResult: finalResult = {
    successfulReservations: [],
    finalTheater: finalTheater
  }

  for (const request of requests) {
    const validRequest = isValidRequest(request, finalTheater)
    if (!validRequest) return updatedResult

    const space = hasSpace(request, finalTheater)
    console.log('start processing at: ', space)
    if (space < 0) return updatedResult

    updatedResult = processReservation(request, space, updatedResult)
  }
  return updatedResult
}

function processReservation(req: reservationRequest, space: number, result: finalResult): finalResult {
  let success: successReservation = { customerId: req.customerId, row: req.row, startSeat: space, endSeat: space + req.seatsNeeded - 1 }

  for (let i = space; i < space + req.seatsNeeded; i++) {
    result.finalTheater[req.row][i] = "R"
  }

  result.successfulReservations.push(success)
  return result
}

function hasSpace(req: reservationRequest, finalTheater: theater): number {
  let needed = req.seatsNeeded
  const row = finalTheater[req.row]

  for (let i = 0; i < row.length; i++) {
    if (row[i] == 'A') {
      needed -= 1
    } else {
      needed = req.seatsNeeded
    }
    if (needed == 0) return i - req.seatsNeeded + 1
  }
  return -1
}


function isValidRequest(req: reservationRequest, finalTheater): boolean {
  if (req.row < 0) return false
  if (req.row > finalTheater.length) return false
  if (finalTheater.length == 0 ) return false
  return true
}

