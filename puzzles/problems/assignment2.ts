/**
 * Movie Theatre Seating System
 *
 * You are implementing a movie theatre seating system. The theatre has rows of seats,
 * and customers can request to reserve seats. You need to process reservation requests
 * and determine the final seating arrangement.
 *
 * The theatre is represented as a grid where each seat can be "available", "reserved",
 * or "blocked" (unusable). Customers request seats by specifying their preferred row
 * and the number of consecutive seats they need.
 *
 * Rules:
 * - Seats must be consecutive in the same row
 * - Choose the leftmost available group of seats in the requested row
 * - If the requested row doesn't have enough consecutive seats, deny the request
 * - Blocked seats cannot be reserved and break consecutiveness
 *
 * Input: Theatre layout (2D array) and list of reservation requests
 * Theatre: "A" = available, "R" = reserved, "B" = blocked
 * Requests: { customerId: string, row: number, seatsNeeded: number }
 *
 * Return: Object with successful reservations and final theatre state
 *
 * Example:
 * Initial theatre: [["A", "A", "B", "A", "A"], ["A", "A", "A", "A", "A"]]
 * Request: { customerId: "customer1", row: 0, seatsNeeded: 2 }
 * Result: Seats 0-1 in row 0 reserved, seats 3-4 still available
 */

type Seat = "A" | "B" | "R"
type Row = Seat[]
type Theatre = Row[]
type Request = { customerId: string; row: number; seatsNeeded: number }
type Reservation = { customerId: string, row: number, startSeat: number, endSeat: number }
type Response = { successfulReservations: Reservation[], finalTheater: Theatre }

export function processReservations(initialTheatre: Theatre, requests: Request[]): Response {
  const finalTheater = structuredClone(initialTheatre)
  const successfulReservations: Reservation[] = []
  if (finalTheater.length === 0 || requests.length === 0) return { successfulReservations, finalTheater}

  for (let i = 0; i < requests.length; i++) {
    const request: Request = requests[i]
    const requestRow: number = request.row
    const seatsNeeded: number = request.seatsNeeded
    const theatreRow: Row = finalTheater[requestRow]
    if (!theatreRow) break
    let availableSeats: number[] = []
    for (let j = 0; j < theatreRow.length; j++) {
      if (availableSeats.length === seatsNeeded) break
      if (theatreRow[j] === "A") {
        const availableSeat: number = j
        availableSeats.push(availableSeat)
      } else {
        availableSeats = []
      }
    }
    if (availableSeats.length < seatsNeeded) break
    for (let j = 0; j < availableSeats.length; j++) {
      theatreRow[availableSeats[j]] = "R"
    }
    const startSeat = availableSeats[0]
    const endSeat = availableSeats[availableSeats.length - 1]
    successfulReservations.push({ customerId: request.customerId, row: requestRow, startSeat: startSeat, endSeat: endSeat })
  }
  // i get an array of requests
  // each request has a row and a number of seats
  // for the target theatre row, I check if I can seat them in it (tbd)
  // then I return that reservation and the new table
  // after cycling through all requestions, i append the successful reservations to an array, and returnt them with the theatre
  return {successfulReservations, finalTheater}
}

console.log(processReservations([["A", "A", "A", "A"]], [{ customerId: "customer1", row: 0, seatsNeeded: 2 }]))


  // // if customer requests one seat, cycle through the theatre [i], first row, find where row[i] === A, set as R, return
  // // if customer requests "x" multiple, check if x consecutive are "A"?
  // const theatre = initialTheatre
  // const succReservations = []

  // for (let i = 0; i < requests.length; i++) {
  //   if (requests.seatsNeeded > initialTheatre[0].length) throw new Error("too many seats")

  //   const seatsNeeded = requests[i].seatsNeeded.length

  //   const reqRow = requests[i].row

  //   const conseqSeats = []
    
  //   initialTheatre[reqRow].forEach((seat, index) => {
  //     for (let j = 0; j < seatsNeeded; j++) {
  //       if (conseqSeats.length === seatsNeeded) {
  //         break
  //       } 
  //       if (seat === "A") {
  //         const openSeat = [reqRow, index]
  //         conseqSeats.push(openSeat)
  //       } else {
  //         conseqSeats = []
  //       }
  //     }
  //   })
  //   if (conseqSeats.length === seatsNeeded) {
  //     conseqSeats.forEach((seat) => {
  //       theatre[seat[0][1]] = "R"
  //     })
  //   }
  //   const string = `Seats ${conseqSeats[0][1]}-${conseqSeats[conseqSeats.length - 1][1]} in row ${reqRow} reserved`
  //   succReservations.push(string)
  // }

  // return {succReservations, theatre}
