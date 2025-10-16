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

type Direction = 'N' | 'E' | 'S' | 'W';

interface Position {
  x: number;
  y: number;
}

export function navigateRobot(commands: string) {
  const position: Position = { x: 0, y: 0 };
  let direction: Direction = 'N';
  const visited = new Set<string>();
  const waypoints = new Map<string, Position>();

  visited.add('0,0');

  if (commands.trim() === '') {
    return {
      position: [position.x, position.y],
      direction,
      visited: visited.size
    };
  }

  const tokens = tokenizeCommands(commands);
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];

    if (token === 'F') {
      moveForward(position, direction);
      visited.add(`${position.x},${position.y}`);
      i++;
    } else if (token === 'B') {
      moveBackward(position, direction);
      visited.add(`${position.x},${position.y}`);
      i++;
    } else if (token === 'L') {
      direction = turnLeft(direction);
      i++;
    } else if (token === 'R') {
      direction = turnRight(direction);
      i++;
    } else if (token === 'M') {
      const label = extractLabel(tokens, i + 1);
      waypoints.set(label, { x: position.x, y: position.y });
      i += label.split(' ').length + 1;
    } else if (token === 'G') {
      const label = extractLabel(tokens, i + 1);
      const waypoint = waypoints.get(label);
      if (!waypoint) {
        throw new Error(`Waypoint "${label}" not found`);
      }
      position.x = waypoint.x;
      position.y = waypoint.y;
      visited.add(`${position.x},${position.y}`);
      i += label.split(' ').length + 1;
    } else {
      i++;
    }
  }

  return {
    position: [position.x, position.y],
    direction,
    visited: visited.size
  };
}

function tokenizeCommands(commands: string): string[] {
  return commands.trim().split(/\s+/);
}

function extractLabel(tokens: string[], startIndex: number): string {
  const labelParts: string[] = [];
  let i = startIndex;
  
  while (i < tokens.length && !['F', 'B', 'L', 'R', 'M', 'G'].includes(tokens[i])) {
    labelParts.push(tokens[i]);
    i++;
  }
  
  return labelParts.join(' ');
}

function moveForward(position: Position, direction: Direction): void {
  const deltas = getDirectionDeltas(direction);
  position.x += deltas.dx;
  position.y += deltas.dy;
}

function moveBackward(position: Position, direction: Direction): void {
  const deltas = getDirectionDeltas(direction);
  position.x -= deltas.dx;
  position.y -= deltas.dy;
}

function getDirectionDeltas(direction: Direction): { dx: number; dy: number } {
  switch (direction) {
    case 'N': return { dx: 0, dy: 1 };
    case 'E': return { dx: 1, dy: 0 };
    case 'S': return { dx: 0, dy: -1 };
    case 'W': return { dx: -1, dy: 0 };
  }
}

function turnLeft(direction: Direction): Direction {
  const turns: Record<Direction, Direction> = {
    'N': 'W',
    'W': 'S',
    'S': 'E',
    'E': 'N'
  };
  return turns[direction];
}

function turnRight(direction: Direction): Direction {
  const turns: Record<Direction, Direction> = {
    'N': 'E',
    'E': 'S',
    'S': 'W',
    'W': 'N'
  };
  return turns[direction];
}