/**
 * Elevator Simulator
 * 
 * You are simulating a single elevator in a building. The elevator starts at floor 1
 * and processes a queue of requests. Each request specifies a person's starting floor
 * and destination floor.
 * 
 * Rules:
 * - The elevator processes requests in the order they appear in the queue
 * - For each request, the elevator must:
 *   1. Move to the pickup floor (if not already there)
 *   2. Pick up the passenger
 *   3. Move to the destination floor
 *   4. Drop off the passenger
 * - The elevator can only carry one passenger at a time
 * - Moving between adjacent floors costs 1 move
 * - Picking up or dropping off a passenger costs 0 moves
 * 
 * Input: An array of requests, where each request is [pickupFloor, destinationFloor]
 * Output: The total number of floor moves the elevator made
 * 
 * Examples:
 * - [[3, 7], [2, 5]] starting at floor 1:
 *   Move 1→3 (2 moves), pickup, move 3→7 (4 moves), dropoff,
 *   move 7→2 (5 moves), pickup, move 2→5 (3 moves), dropoff
 *   Total: 2 + 4 + 5 + 3 = 14 moves
 * 
 * - [[1, 1]] starting at floor 1:
 *   Already at floor 1, pickup, already at floor 1, dropoff
 *   Total: 0 moves
 * 
 * Edge cases:
 * - Empty request queue returns 0
 * - Requests where pickup equals destination still require travel
 * - Floors are positive integers
 */

type Elevator = {
  currentFloor: number
  floorsMoved: number
}

type Request = [pickupFloor: number, destinationFloor: number]

export function simulateElevator(requests: Array<Request>): number {
  const elevator: Elevator = {
    currentFloor: 1,
    floorsMoved: 0,
  }

  for (let req of requests) {
    const pickupFloor = req[0]
    const destinationFloor = req[1]
    console.log(`pickup at floor ${pickupFloor}, dropping of at floor ${destinationFloor}`)
    const movingToPickupFloor = getFloorMovement(elevator.currentFloor, pickupFloor)
    console.log(`moving from floor ${elevator.currentFloor} to pickup at floor ${pickupFloor}`)
    elevator.floorsMoved += movingToPickupFloor
    const movingToDestinationFloor = getFloorMovement(pickupFloor, destinationFloor)
    elevator.floorsMoved += movingToDestinationFloor
    elevator.currentFloor = destinationFloor
    console.log(`stopping at floor ${elevator.currentFloor}`)
  }

  return elevator.floorsMoved
}

function getFloorMovement(currentFloor: number, nextFloor: number): number {
  return Math.abs(currentFloor - nextFloor)
}

// done at (0935 - 0950)