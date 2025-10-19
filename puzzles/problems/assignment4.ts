

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

function stringToArray(line: string): string[] {
    let finalArray = []
    let currentWord = ""

    for (let i = 0; i < line.length; i++) {
        if (line[i] != " ") {
            currentWord = currentWord.concat(line[i])


        } else {
            finalArray.push(currentWord)
            currentWord = ""
        }
    }



    finalArray.push(currentWord)
    return finalArray

}

function getWayPointName(i: number, array: string[]): string {
    const letters = ["F", "G", "L", "R", "B", "M"]

    let wayPointName = ""
    for (let j = i + 1; j < array.length; j++) {
        if (!letters.includes(array[j])) {
            wayPointName += array[j]
        } else {
            break;
        }

    }

    return wayPointName
}

type output = {
    position: number[];
    direction: string;
    visited: number
}

export function navigateRobot(commands: string): output {

    const directions = stringToArray(commands)
    let previousSquares = [[0, 0]]
    let uniqueSpotsVisited = 1
    let finalPositionX = 0
    let finalPositionY = 0
    let finalDirection = "N"
    let pointNames: string[] = []
    let pointLocations = []

    for (let i = 0; i < directions.length; i++) {
        const currentDirection = directions[i]
        if (currentDirection === "M") {
            const wayPoint = getWayPointName(i, directions)
            pointNames.push(wayPoint)
            pointLocations.push([finalPositionX, finalPositionY])
            continue


        }

        if (currentDirection === "G") {
            const wayPoint = getWayPointName(i, directions)
            if (pointNames.includes(wayPoint)) {
                const point = pointLocations[pointNames.indexOf(wayPoint)]
                finalPositionX = point[0]
                finalPositionY = point[1]
            } else {
                throw ("Waypoint not found")
            }

            continue

        }
        if (currentDirection === "F") {

            if (finalDirection === "N") {
                finalPositionY += 1

            } else if (finalDirection === "S") {
                finalPositionY -= 1

            } else if (finalDirection === "E") {
                finalPositionX += 1
            } else if (finalDirection === "W") {
                finalPositionX -= 1
            }

        } else if (currentDirection === "B") {

            if (finalDirection === "N") {
                finalPositionY -= 1

            } else if (finalDirection === "S") {
                finalPositionY += 1

            } else if (finalDirection === "E") {
                finalPositionX -= 1
            } else if (finalDirection === "W") {
                finalPositionX += 1
            }

        }
        else if (currentDirection === "R") {
            finalDirection = "E"
        }

        else if (currentDirection === "L") {
            finalDirection = "E"
        }


        if (!previousSquares.some(
            ([x, y]) => x === finalPositionX && y === finalPositionY
        )) {
            uniqueSpotsVisited += 1


        }

        previousSquares.push([finalPositionX, finalPositionY])

        console.log("CURRENT", { position: [finalPositionX, finalPositionY], direction: finalDirection, visited: uniqueSpotsVisited })
    }


    return { position: [finalPositionX, finalPositionY], direction: finalDirection, visited: uniqueSpotsVisited }

}