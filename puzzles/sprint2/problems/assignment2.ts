/**
 * Grid-Based Robot Navigation
 * 
 * You are controlling a robot on an infinite 2D grid. The robot starts at position (0, 0)
 * facing North. You will receive a sequence of commands that the robot must execute.
 * 
 * Commands:
 * - "F" (forward): Move one unit in the current direction
 * - "B" (backward): Move one unit opposite to the current direction
 * - "L" (left): Turn 90 degrees counterclockwise (does not move)
 * - "R" (right): Turn 90 degrees clockwise (does not move)
 * - "M <x> <y>": Mark the current position with label <x> <y> (a waypoint name)
 * - "G <x> <y>": Move directly to the marked waypoint labeled <x> <y> without changing direction
 * 
 * Directions: North (up), East (right), South (down), West (left)
 * 
 * Input: A string containing space-separated commands
 * Output: An object with:
 *   - position: [x, y] coordinates of final position
 *   - direction: final direction as "N" | "E" | "S" | "W"
 *   - visited: number of unique grid positions visited (including start)
 * 
 * Examples:
 * - "F F R F": Start at (0,0) facing N, move to (0,1), then (0,2), turn to face E, move to (1,2)
 *   Result: { position: [1, 2], direction: "E", visited: 4 }
 * 
 * - "F L F R R F": Move (0,1), turn W, move (-1,1), turn N, turn E, move (0,1)
 *   Result: { position: [0, 1], direction: "E", visited: 3 }
 * 
 * - "F M checkpoint F F G checkpoint": Move to (0,1), mark it, move to (0,2), move to (0,3),
 *   teleport back to (0,1). Result: { position: [0, 1], direction: "N", visited: 4 }
 * 
 * Edge cases:
 * - Empty command string returns start position
 * - Going to an unmarked waypoint throws an error
 * - Multiple marks at the same position overwrite previous marks
 * - Waypoint labels can contain spaces and are case-sensitive
 */
// start at (1006)

type Robot = {
  position: [number, number],
  direction: Direction,
  visited: number
}

type Direction = "N" | "E" | "S" | "W"

// (1130) back from walk; add deep copy to track tiles, instead of position reference.
export function navigateRobot(commands: string): Robot {
  const initialTile: [number, number] = [0, 0]
  const tiles = new Set()
  tiles.add(structuredClone(initialTile))
  const robot: Robot = {
    position: initialTile,
    direction: "N",
    visited: tiles.size
  }
  console.log(robot)
  const waypoints = []

  const commandArray = commands.split(' ')
  console.log(commandArray)

  // simple case: move the robot
  // break down into changing direction and changing position (done at 1040, 7 pass)
  for (let command of commandArray) {
    console.log('now handling command:', command)
    if (command === "F" || command === "B") {
      robot.position = moveRobot(command, robot)
      // console.log('robot moving to:', robot.position)
      const unloggedPosition = tiles.has(robot.position)
      // console.log('current tiles:', tiles)
      // console.log('position in tiles:', unloggedPosition)
      if (!tiles.has(robot.position)) {
        // console.log('moving to new space:', robot.position)
        tiles.add(structuredClone(robot.position))
        // console.log('tiles visited now:', tiles)
        robot.visited += 1
      }
    } if (command === "L" || command === "R") {
      robot.direction = turnRobot(command, robot)
    } if (command === "M") {

    }
  }

  return robot;
}

function moveRobot(command: string, robot: Robot): [number, number] {
  const newPosition = robot.position
  if (command === "F") {
    switch (robot.direction) {
      case "N":
        newPosition[1] += 1
        break
      case "S":
        newPosition[1] -= 1
        break
      case "E":
        newPosition[0] += 1
        break
      case "W":
        newPosition[0] -= 1
        break
    }
  } else if (command === "B") {
    switch (robot.direction) {
      case "N":
        newPosition[1] -= 1
        break
      case "S":
        newPosition[1] += 1
        break
      case "E":
        newPosition[0] -= 1
        break
      case "W":
        newPosition[0] += 1
        break
    }
  }
  return newPosition
}

function turnRobot(command: string, robot: Robot): Direction {
  if (command === "L") {
    switch (robot.direction) {
      case "N":
        return "W"
      case "W":
        return "S"
      case "S":
        return "E"
      case "E":
        return "N"
    }
  } else if (command === "R") {
    switch (robot.direction) {
      case "N":
        return "E"
      case "E":
        return "S"
      case "S":
        return "W"
      case "W":
        return "N"
    }
  }
  return robot.direction
}
