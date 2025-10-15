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
  totalTrips: Trip[];
  totalDistance: number;
  futureStops: Stop[]
  pastStops: string[]
}

const createInitialTravelState = (stops): TravelState => {
  return {
    x: 0,
    y: 0,
    weight: 0,
    currentTrip: [],
    totalTrips: [],
    totalDistance: 0,
    futureStops: stops,
    pastStops: []
  };
}

const findClosestStop = (state) => {
  const x = state.x
  const y = state.y
  const futureStops = state.futureStops
  let closestStop = {}
  let minDistance = 99999999999999999999999999999999
  futureStops.forEach((stop) => {
    const distance = Math.abs(x - stop.x) + Math.abs(y - stop.y)
    if (distance < minDistance) {
      minDistance = distance
      closestStop = stop
    }
  })
  return closestStop
}

const goToDepot = (state) => {
  // *     input: location/weight, trip, trips
  // *     set 000
  const distance = Math.abs(state.x) + Math.abs(state.y)
  const x = 0
  const y = 0
  const weight = 0
  // add distance
  const totalDistance = state.totalDistance + distance
  // push to 'trips'
  const newTrip = state.currentTrip
  // *     end trip, 
  const currentTrip = []
  // *     output: location/weight, trip, trips
  return { x, y, weight, totalDistance, totalTrips: [...state.totalTrips, newTrip], currentTrip }
}

const processStop = (state, stop) => {
  // *     input: location/weight, stop location/weight
  // *     set new location, weight to stop location, weight
  const distance = Math.abs(state.x - stop.x) + Math.abs(state.y - stop.y)
  const x = stop.x
  const y = stop.y
  const weight = state.weight + stop.weight
  // add distance
  const totalDistance = state.totalDistance + distance
  const id = stop.id
  // remove stop from futureStops
  const futureStops = state.futureStops.filter(stop => stop.id !== id)
  // *     output: location/weight, trip, trips, push to 'hit trips'
  return { x, y, weight, totalDistance, currentTrip: [...state.currentTrip, id], pastStops: [...state.pastStops, id], futureStops: futureStops }
}

export function optimizeDeliveryRoute(capacity: number, stops: Stop[]): TravelRecord {
  // * start at 000
  let state = createInitialTravelState(stops)
  while (state.pastStops.length < stops.length) {
    // * find closest stop
    const closestStop = findClosestStop(state)
    // * if combined weight exceeds capacity, go to depot
    if (state.weight + closestStop.weight > capacity) {
      const result = goToDepot(state)
      state = { ...state, ...result}
    } else {
      const result = processStop(state, closestStop)
      state = { ...state, ...result}
    }
  }
  return { trips: state.totalTrips, totalDistance: state.totalDistance }
}

console.log(optimizeDeliveryRoute(10, [{ id: "A", x: 1, y: 1, weight: 5 }, { id: "B", x: 2, y: 2, weight: 6 }]))
// console.log(optimizeDeliveryRoute(15, [{id:"A",x:3,y:0,weight:5}, {id:"B",x:0,y:4,weight:5}]))
// console.log(optimizeDeliveryRoute(10, [{ id: 'EXACT', x: 5, y: 5, weight: 10 }]))