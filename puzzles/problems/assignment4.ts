/**
 * # Package Delivery Route Optimizer
 * 
 * You are building a system to optimize package delivery routes. Given a list of 
 * delivery stops with their coordinates and package weights, determine the optimal 
 * delivery sequence that minimizes total distance while respecting weight constraints.
 * 
 * Rules:
 * - The delivery truck starts at the depot (0, 0) with a weight capacity
 * - Each stop has coordinates (x, y) and a package weight
 * - The truck must return to depot when capacity is reached or exceeded
 * - After returning, the truck can make another trip with full capacity
 * - Within each trip, visit stops in order of closest-first (greedy nearest neighbor)
 * - Distance is Manhattan distance: |x1 - x2| + |y1 - y2|
 * - If multiple stops are equidistant, choose the one that appears first in the input
 * 
 * start at 000
 * find closest stop
 * if combined weight exceeds capacity, go to depot
 *     input: location/weight, trip, trips
 *     set 000
 *     end trip, push to 'trips'
 *     output: location/weight, trip, trips
 * otherwise
 *     set new location, weight to stop location, weight
 *     input: location/weight, stop location/weight
 *     output: location/weight, trip, trips
 * Input: 
 * - capacity: number (max weight per trip, > 0)
 * - stops: array of {id: string, x: number, y: number, weight: number}
 * 
 * Output:
 * - trips: array of arrays, where each inner array contains stop IDs in visit order
 * - totalDistance: total Manhattan distance traveled (including returns to depot)
 * 
 * Examples:
 * 
 * Input: capacity=10, stops=[{id:"A",x:1,y:1,weight:5}, {id:"B",x:2,y:2,weight:6}]
 * Output: {trips:[["A"],["B"]], totalDistance:12}
 * Explanation: A is weight 5, B is weight 6. Can't fit both (11>10).
 * Trip 1: depot(0,0)->A(1,1)->depot(0,0) = 2+2=4
 * Trip 2: depot(0,0)->B(2,2)->depot(0,0) = 4+4=8
 * Total: 12
 * 
 * Input: capacity=15, stops=[{id:"A",x:3,y:0,weight:5}, {id:"B",x:0,y:4,weight:5}]
 * Output: {trips:[["A","B"]], totalDistance:14}
 * Explanation: Both fit in one trip (10<=15).
 * depot(0,0)->A(3,0) = 3, A(3,0)->B(0,4) = 7, B(0,4)->depot(0,0) = 4
 * Total: 14
 */

type Stop = { id: string, x: number, y: number, weight: number }
type Input = { capacity: number, stops: Stop[] }
type Trip = string[]
type TravelRecord = { trips: Trip[], totalDistance: number }

type TravelState = {
  x: number;
  y: number;
  weight: number;
  currentTrip: Trip;
  trips: Trip[];
}

const createInitialTravelState = (): TravelState => {
  return {
    x: 0,
    y: 0,
    weight: 0,
    currentTrip: [],
    trips: [],
  };
}

const findClosestStopId = (currentLocation, remainingStops) => {
  // if equidistance, choose first stop.
  // use currentTruck x/y and each stop x/y
  // for each, create object/key {stopId: distance}
  console.log("currentLocation", currentLocation, "remainingStops", remainingStops)
  const stopDistances = {}
  for (let i = 0; i < remainingStops.length; i++) {
    const currentStop = remainingStops[i]
    const distance = Math.abs(currentLocation.x - currentStop.x) + Math.abs(currentLocation.y - currentStop.y)
    stopDistances[currentStop.id] = distance
  }
  const distances = Object.values(stopDistances)
  const minDistance = Math.min(...distances)
  const closestStopId = Object.keys(stopDistances).find(key => stopDistances[key] === minDistance)
  return closestStopId
}

// const processTravel = (nextStop, currentLocation) => {

// }

export function optimizeDeliveryRoute(capacity: number, stops: Stop[]): TravelRecord {
  // * - The delivery truck starts at the depot (0, 0) with a weight capacity
  const currentLocation = { x: 0, y: 0, weight: 0 }
  let remainingStops = stops
  const pastTrips = []
  let totalDistance = 0
  while (pastTrips.length < stops.length) {
    // find closest stop
    const closestStopId = findClosestStopId(currentLocation, remainingStops)
    const closestStop = remainingStops.find(stop => stop.id === closestStopId)
    let nextStop
    let currentTrip = []
    // if truck is full, next stop is depot
    // if closest stop would exceed, next stop is depot
    if (currentLocation.weight + closestStop.weight > capacity) {
      nextStop = { x: 0, y: 0 }
      currentLocation.x = 0
      currentLocation.y = 0
      currentLocation.weight = 0
      pastTrips.push(currentTrip)
      currentTrip = []
    } else {
      nextStop = closestStop
      // remove stop from remainingStops
      remainingStops = remainingStops.filter(stop => stop.id !== closestStopId)
      // if next stop not depot, add stopId to past trips
      currentTrip.push(closestStopId)
      // add to total distance
      const distance = Math.abs(currentLocation.x - closestStop.x) + Math.abs(currentLocation.y - closestStop.y)
      totalDistance += distance
      // add weight
      currentLocation.weight += nextStop.weight
      // set currentTruck location
      currentLocation.x = nextStop?.x
      currentLocation.y = nextStop.y
    }
  }
  // const result = processTravel(nextStop, currentLocation)

  // * - Each stop has coordinates (x, y) and a package weight

  // * - The truck must return to depot when capacity is reached or exceeded

  // * - After returning, the truck can make another trip with full capacity

  // * - Within each trip, visit stops in order of closest-first (greedy nearest neighbor)

  // * - Distance is Manhattan distance: |x1 - x2| + |y1 - y2|

  // * - If multiple stops are equidistant, choose the one that appears first in the input

  return { trips: pastTrips, totalDistance }
}

// console.log(optimizeDeliveryRoute(10, [{ id: "A", x: 1, y: 1, weight: 5 }, { id: "B", x: 2, y: 2, weight: 6 }]))
// console.log(optimizeDeliveryRoute(15, [{id:"A",x:3,y:0,weight:5}, {id:"B",x:0,y:4,weight:5}]))
console.log(optimizeDeliveryRoute(10, [{ id: 'EXACT', x: 5, y: 5, weight: 10 }]))