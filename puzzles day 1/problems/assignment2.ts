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

type Seat = 'A' | 'B' | 'R'
type Theater = string[][]
type Request = {
  customerId: string,
  row: number,
  seatsNeeded: number
}
type Requests = Request[]
type Reservation = {
  customerId: string,
  row: number,
  startSeat: number,
  endSeat: number
}
type Reservations = Reservation[]
type Result = {
  'successfulReservations': Reservations,
  'finalTheater': Theater
}

function getReservation(request: Request, theater: Theater) {
  console.log('REQUEST received by getReservation', request)
  console.log('THEATER received by getReservation', theater)

  const {customerId, row, seatsNeeded} = request
  const theaterRow = theater[row]
  let counter = 0
  let reservation: Reservation = {
    customerId: '',
    row: 0,
    startSeat: 0,
    endSeat: 0
  }

  for (let i = 0; i < theaterRow.length; i++) {

    if (theaterRow[i] === 'A') {

      counter += 1
      if (counter === seatsNeeded) {
        reservation.customerId = customerId
        reservation.row = row
        reservation.startSeat = i - counter + 1
        reservation.endSeat = i
        break
      }

    } else if (theaterRow[i] === 'B' || theaterRow[i] === 'R') {
      counter = 0
    }
    console.log('i+c', i, counter)
  }

  if (reservation.customerId != '') {
    return reservation
  } else {
    return undefined
  }

}

function markSeatsReserved(theater: Theater, reservation: Reservation) {
  for (let i = reservation.startSeat; i < reservation.endSeat + 1; i++) {
    console.log('I', i)
    theater[reservation.row][i] = 'R'
  }
  return theater
}

function rowValidityCheck(theater: Theater, requests: Requests) {
  let result = true
  for (let i = 0; i < requests.length; i++) {
    if (theater[requests[i].row] === undefined) {
      result = false
    }
  }
  return result
}

export function processReservations(initialTheater: Theater, requests: Requests): Result {
  console.log('IT', initialTheater)
  console.log('RE', requests)

  let theater: Theater = initialTheater
  let reservations: Reservations = []

  if (theater.length != 0 && rowValidityCheck(theater, requests)) {
    for (let i = 0; i < requests.length; i++) {
      const reservation = getReservation(requests[i], theater)
      if (reservation != undefined) {
        reservations.push(reservation)
        console.log('FRESH RESERVATION', reservation)
        theater = markSeatsReserved(theater, reservation)
      }
    }
  }

  const result = {
    'successfulReservations': reservations,
    'finalTheater': theater
  }
  console.log(result)

  return result
}