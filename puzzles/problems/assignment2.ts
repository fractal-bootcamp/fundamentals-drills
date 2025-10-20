/*
 * Package Delivery Route Simulator
 *
 * You are building a package delivery route simulator. A delivery driver starts at a warehouse
 * at position (0, 0) on a grid, facing North. The driver receives a series of instructions
 * to pick up and deliver packages at various locations.
 *
 * Instructions can be:
 * - "forward X" - move X units in the current direction
 * - "left" - turn 90 degrees left
 * - "right" - turn 90 degrees right
 * - "pickup P" - pick up a package with ID P at current location
 * - "deliver P" - deliver package P at current location (remove from inventory)
 *
 * Return an object containing:
 * - finalPosition: [x, y] coordinates where the driver ends
 * - finalDirection: "North" | "East" | "South" | "West"
 * - undeliveredPackages: array of package IDs still in the truck (sorted alphabetically)
 * - deliveryLocations: object mapping package IDs to [x, y] where they were delivered
 *
 * Rules:
 * - Driver starts at (0, 0) facing North
 * - North is +Y, East is +X, South is -Y, West is -X
 * - Can only deliver packages that have been picked up - test
 * - Attempting to deliver a package not in inventory is ignored - test
 * - Multiple packages can be picked up or delivered at the same location - test
 * - Package IDs are case-sensitive strings
 *
 * Example 1:
 * Input: ["forward 5", "pickup A", "right", "forward 3", "deliver A"]
 * Output: {
 *   finalPosition: [3, 5],
 *   finalDirection: "East",
 *   undeliveredPackages: [],
 *   deliveryLocations: { A: [3, 5] }
 * }
 *
 * Example 2:
 * Input: ["pickup X", "forward 2", "pickup Y", "left", "forward 1", "deliver X"]
 * Output: {
 *   finalPosition: [-1, 2],
 *   finalDirection: "West",
 *   undeliveredPackages: ["Y"],
 *   deliveryLocations: { X: [-1, 2] }
 * }
 */

type Direction = "North" | "East" | "South" | "West"

// (1458) start
// (1554) DONE.
export function simulateDeliveryRoute(instructions: Array<string>) {
  let finalPosition: [number, number] = [0, 0]
  let finalDirection: Direction = 'North'
  let undeliveredPackages: Array<string> = []
  let deliveryLocations: Record<string, [number, number]> = {}

  for (let instruction of instructions) {
    if (!instruction || instruction.length === 0) {
      continue
    }

    const command = instruction.split(' ')
    if (command[0] !== 'left' && command[0] !== 'right' && command[0] !== 'pickup' && command[0] !== 'forward' && command[0] !== 'deliver') {
      continue;
    }

    // (1528) DONE
    if (command.length === 1 && (command[0] === 'left' || command[0] === 'right')) {
      finalDirection = turnDriver(command[0], finalDirection)
      console.log('turning to:', finalDirection)
    }

    // (1541) DONE, 5 passing
    if (command.length === 2) {
      if (command[0] === 'forward') {
        const unitsForward = Number(command[1])
        finalPosition = moveDriver(finalPosition, finalDirection, unitsForward)
        console.log('moving to:', finalPosition)
      } else if (command[0] === 'pickup') {
        const packageId = command[1]
        undeliveredPackages.push(packageId)
        undeliveredPackages = undeliveredPackages.sort() // (1554) sorting alphabet edge. DONE.
        console.log('package picked up! now carrying:', undeliveredPackages)
        // (1552) DONE, 13 passing
      } else if (command[0] === 'deliver') {
        const delivering = command[1]
        if (undeliveredPackages.includes(delivering)) {
          undeliveredPackages = undeliveredPackages.filter(id => id !== delivering)
          deliveryLocations[delivering] = finalPosition
          console.log('package delivered! updating locations to:', deliveryLocations)
        }
      }
    }
  }
  return {
    finalPosition, finalDirection, undeliveredPackages, deliveryLocations
  };
}

function moveDriver(position: [number, number], direction: Direction, unitsForward: number): [number, number] {
  const DIRECTION_VECTORS: Record<Direction, [number, number]> = {
    'North': [0, 1],
    'East': [1, 0],
    'South': [0, -1],
    'West': [-1, 0]
  }

  const units = DIRECTION_VECTORS[direction].map(v => v * unitsForward)
  console.log('moving truck in units:', units)
  return [position[0] + units[0], position[1] + units[1]]
}

function turnDriver(command: string, direction: Direction): Direction {
  if (command === 'left') {
    switch (direction) {
      case "North": return 'West'
      case "East": return 'North'
      case "South": return 'East'
      case "West": return 'South'
    }
  }
  switch (direction) {
    case "North": return 'East'
    case "East": return 'South'
    case "South": return 'West'
    case "West": return 'North'
  }
}
