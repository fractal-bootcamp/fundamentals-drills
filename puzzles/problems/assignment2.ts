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
  //TODO
  let successfulReservations = [];
  let finalTheater = structuredClone(initialTheater);
  for (const request of requests) {


    if (request.seatsNeeded) {
      //find how many group of seats in teh leftmost in row
      let row = finalTheater[request["row"]]
      let findIndex = row.findIndex((elem) => elem === "A");

      let findIndexR = row.findIndex((elem) => elem === "R");
      let findIndexB = row.findIndex((elem) => elem === "B");

      

  

      let findMin;

      if (findIndexR == -1 && findIndexB != -1) {
        findMin = findIndexR;
      }
      if (findIndexR != -1 && findIndexB == -1) {
        findMin = findIndexB;
      }

      if (findIndexR != -1 && findIndexB != -1) {
        findMin = Math.min(findIndexR, findIndexB);
      }


      console.log(findIndex)
      console.log(findMin);

    
      if (findMin) {
        //infinity for findMin?
        if ((findMin - findIndex) <= request.seatsNeeded ){ 
          //book
          successfulReservations.push({customerId: request.customerId, row: request.row, startSeat: findMin, endSeat: findIndex});
          finalTheater[request.row].fill("R", findMin, findMin);
        }
      } else {
        // console.log(request)
        successfulReservations.push({customerId: request.customerId, row: request.row, startSeat: findMin, endSeat: findIndex});
        finalTheater[request.row].fill("R", findMin, findMin);
      }
    } 
  
    return {
      successfulReservations, 
      finalTheater
    }
  }
}