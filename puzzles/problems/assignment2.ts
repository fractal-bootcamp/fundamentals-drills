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

interface Stop {
  id: string;
  x: number;
  y: number;
  weight: number;
}

interface Output {
  trips: string[][];
  totalDistance: number;
}

function distance(a: [number, number], b: [number, number]) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

export function optimizeDeliveryRoute(capacity: number, stops: Stop[]): Output {
  const result: Output = { trips: [], totalDistance: 0 };

  let truckPos: [number, number] = [0, 0];
  let currentWeight = 0;
  let trip: string[] = [];

  while (stops.length > 0) {
    const currPackage = stops.sort(
      (a, b) => distance(truckPos, [a.x, a.y]) - distance(truckPos, [b.x, b.y])
    )[0];
    // package will fit
    const canFit = currentWeight + currPackage.weight <= capacity;

    console.log("CLOSEST PACKAGE: " + JSON.stringify(currPackage));

    if (!canFit) {
      result.totalDistance += distance(truckPos, [0, 0]);
      if (trip.length > 0) result.trips.push(trip);
      trip = [];
      truckPos = [0, 0];
      currentWeight = 0;
      continue;
    }

    result.totalDistance += distance(truckPos, [currPackage.x, currPackage.y]);
    trip.push(currPackage.id);
    truckPos = [currPackage.x, currPackage.y];
    currentWeight += currPackage.weight;
    stops = stops.filter((s) => s.id !== currPackage.id);
  }

  if (trip.length > 0) {
    result.totalDistance += distance(truckPos, [0, 0]);
    result.trips.push(trip);
  }
  console.log("OUTPUT: " + JSON.stringify(result));
  return result;
}
