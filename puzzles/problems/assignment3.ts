/**
 * ## Parking Lot Simulation
 * 
 * You are managing a multi-level parking lot. Each level has a fixed number of spots,
 * and vehicles arrive/depart throughout the day. You must process a sequence of events
 * and determine the final state of the lot.
 * 
 * **Rules:**
 * - Events are processed in order
 * - `park` events assign a vehicle to the lowest available spot number across all levels
 * - `depart` events free up the spot where that vehicle is parked
 * - If a vehicle tries to park but the lot is full, ignore that event
 * - If a vehicle tries to depart but isn't in the lot, ignore that event
 * - Spot numbering: level 1 has spots 1..n, level 2 has spots (n+1)..(2n), etc.
 * 
 * **Input:**
 * - `levelsConfig`: array where each element is the number of spots on that level (e.g., [10, 10, 5])
 * - `events`: array of event objects with `type` ("park" | "depart") and `vehicleId` (string)
 * 
 * **Output:**
 * - Object mapping each parked vehicleId to its spot number
 * 
 * **Examples:**
 * ```
 * Input: levelsConfig = [2, 2], events = [{type: "park", vehicleId: "A"}, {type: "park", vehicleId: "B"}]
 * Output: {A: 1, B: 2}
 * 
 * Input: levelsConfig = [2], events = [{type: "park", vehicleId: "A"}, {type: "park", vehicleId: "B"}, {type: "depart", vehicleId: "A"}, {type: "park", vehicleId: "C"}]
 * Output: {B: 2, C: 1}
 * ```
 */

// spots per level
type LevelsConfig = number[]

type EventType = "park" | "depart"

type VehicleId = string

type Event = { 'type': EventType, vehicleId: VehicleId }

type Events = Event[]

type VehicleMap = { [vehicleId: VehicleId]: number }

// PARK: 
const processPark = (vehicleMap, spots, vehicleId): VehicleMap => {
  const vehiclesInLot = Object.keys(vehicleMap)
  if (vehiclesInLot.includes(vehicleId)) {
    return vehicleMap
  }
  // assign vehicle to lowest spot. 
  // check each spot to see if taken
  // get all values out of vehicle map
  const takenSpots = Object.values(vehicleMap)
  for (let i = 1; i <= spots; i++) {
    // check lowest spot on each level
    // if not, check next-lowest spot
    if (takenSpots.includes(i)) {
      continue
    } else {
      // first open spot, add vehicle and spot to vehicleMap
      vehicleMap[vehicleId] = i
      break
    }
  }
  // if lot is full, ignore event
  return vehicleMap
}

// DEPART: 
const processDepart = (vehicleMap, vehicleId) => {
  const vehiclesInLot = Object.keys(vehicleMap)
  if (vehiclesInLot.includes(vehicleId)) {
    // free up vehicle's spot
    delete vehicleMap[vehicleId]
  }
  // if vehicle isn't in log, ignore event
  return vehicleMap
}

export const simulateParkingLot = (
  levelsConfig: LevelsConfig,
  events: Events
): VehicleMap => {
  let vehicleMap: VehicleMap = {}

  // get list of spots (just array of numbers 1-sum(levels))
  // SPOTS ARE NUMBERED: level 1 has spots 1..n, level 2 has spots (n+1)..(2n), etc.
  let spots = 0
  levelsConfig.forEach((level) => {
    spots += level
  })

  // for each event
  for (let i = 0; i < events.length; i++) {
    const event = events[i]
    const eventType = event.type
    const vehicleId = event.vehicleId
    if (eventType === "park") {
      const result = processPark(vehicleMap, spots, vehicleId)

    } else if (eventType === "depart") {
      processDepart(vehicleMap, vehicleId)
    }
  }
  //  return a map of parked vehicles and their spots
  return vehicleMap
}

// console.log(simulateParkingLot([2], [{type: "park", vehicleId: "A"}, {type: "park", vehicleId: "B"}, {type: "depart", vehicleId: "A"}, {type: "park", vehicleId: "C"}]))
console.log(simulateParkingLot([2, 2], [{type: "park", vehicleId: "A"}, {type: "park", vehicleId: "B"}]))