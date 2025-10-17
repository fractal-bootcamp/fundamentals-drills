/**
 
# Package Delivery Route Optimizer
You are building a system to optimize package delivery routes. Given a list of
delivery stops with their coordinates and package weights, determine the optimal
delivery sequence that minimizes total distance while respecting weight constraints.
Rules:
The delivery truck starts at the depot (0, 0) with a weight capacity
Each stop has coordinates (x, y) and a package weight
The truck must return to depot when capacity is reached or exceeded
After returning, the truck can make another trip with full capacity
Within each trip, visit stops in order of closest-first (greedy nearest neighbor)
Distance is Manhattan distance: |x1 - x2| + |y1 - y2|
If multiple stops are equidistant, choose the one that appears first in the input
Input:
capacity: number (max weight per trip, > 0)
stops: array of {id: string, x: number, y: number, weight: number}
Output:
trips: array of arrays, where each inner array contains stop IDs in visit order
totalDistance: total Manhattan distance traveled (including returns to depot)
Examples:
Input: capacity=10, stops=[{id:"A",x:1,y:1,weight:5}, {id:"B",x:2,y:2,weight:6}]
Output: {trips:[["A"],["B"]], totalDistance:12}
Explanation: A is weight 5, B is weight 6. Can't fit both (11>10).
Trip 1: depot(0,0)->A(1,1)->depot(0,0) = 2+2=4
Trip 2: depot(0,0)->B(2,2)->depot(0,0) = 4+4=8
Total: 12
Input: capacity=15, stops=[{id:"A",x:3,y:0,weight:5}, {id:"B",x:0,y:4,weight:5}]
Output: {trips:[["A","B"]], totalDistance:14}
Explanation: Both fit in one trip (10<=15).
depot(0,0)->A(3,0) = 3, A(3,0)->B(0,4) = 7, B(0,4)->depot(0,0) = 4
Total: 14*/

type Capacity = number

type Stop = { id: string, x: number, y: number, weight: number }

type StopWithDistance = { id: string, x: number, y: number, weight: number, distance: number }

type Result = {
    trips: Trip
    totalDistance: Number
}

type StopName = string

type Run = StopName[]

type Trip = Run[]

const depot: Stop = { id: "Depot", x: 0, y: 0, weight: 0 }

export function distanceToStop(start: Stop, end: Stop): number {
    //|x1 - x2| + |y1 - y2|
    const distance = Math.abs(start.x - end.x) + Math.abs(start.y - end.y)

    return distance
}


export function findShortestNextPlace(start: Stop, potentialNextStops: Stop[]) {
    let shortestDistance = 1000000
    let nextStop: Stop = {}
    for (const stop of potentialNextStops) {
        const distanceToNextStop = distanceToStop(start, stop)
        if (distanceToNextStop < shortestDistance) {
            shortestDistance = distanceToNextStop;
            nextStop = stop
        }
    }

    return nextStop
}

export function optimizeDeliveryRoute(capacity: number, stops: Stop[]): Result {
    if (stops.length === 0) {
        return { trips: [], totalDistance: 0 }
    }

    let workingCapacity = capacity
    let workingStops = stops
    let finalDistance = 0
    let finalTrips: Run[] = []












    return { trips: finalTrips, totalDistance: finalDistance }
}