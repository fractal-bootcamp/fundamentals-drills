import { describe, it, expect } from 'vitest';
import { navigateRobot } from '../problems/assignment2solution';

describe('navigateRobot', () => {
  it('handles empty command string', () => {
    const result = navigateRobot('');
    expect(result).toEqual({
      position: [0, 0],
      direction: 'N',
      visited: 1
    });
  });

  it('handles single forward movement', () => {
    const result = navigateRobot('F');
    expect(result).toEqual({
      position: [0, 1],
      direction: 'N',
      visited: 2
    });
  });

  it('handles turning without moving', () => {
    const result = navigateRobot('R R L');
    expect(result).toEqual({
      position: [0, 0],
      direction: 'E',
      visited: 1
    });
  });

  it('handles forward and backward movements', () => {
    const result = navigateRobot('F F B');
    expect(result).toEqual({
      position: [0, 1],
      direction: 'N',
      visited: 2
    });
  });

  it('handles full rotation cycle', () => {
    const result = navigateRobot('R R R R');
    expect(result).toEqual({
      position: [0, 0],
      direction: 'N',
      visited: 1
    });
  });

  it('handles movement in all four directions', () => {
    const result = navigateRobot('F R F R F R F');
    expect(result).toEqual({
      position: [0, 0],
      direction: 'W',
      visited: 5
    });
  });

  it('handles backward movement correctly', () => {
    const result = navigateRobot('R B B');
    expect(result).toEqual({
      position: [-2, 0],
      direction: 'E',
      visited: 3
    });
  });

  it('counts revisited positions only once', () => {
    const result = navigateRobot('F R F R F R F R');
    expect(result).toEqual({
      position: [0, 0],
      direction: 'N',
      visited: 5
    });
  });

  it('handles marking and going to waypoint', () => {
    const result = navigateRobot('F F M checkpoint F F G checkpoint');
    expect(result).toEqual({
      position: [0, 2],
      direction: 'N',
      visited: 4
    });
  });

  it('handles waypoint teleportation without changing direction', () => {
    const result = navigateRobot('F M start R F F L G start');
    expect(result).toEqual({
      position: [0, 1],
      direction: 'N',
      visited: 4
    });
  });

  it('throws error when going to unmarked waypoint', () => {
    expect(() => navigateRobot('G nonexistent')).toThrow();
  });

  it('handles waypoint labels with spaces', () => {
    const result = navigateRobot('F F M my special place F G my special place');
    expect(result).toEqual({
      position: [0, 2],
      direction: 'N',
      visited: 3
    });
  });

  it('handles overwriting waypoint at same position', () => {
    const result = navigateRobot('F M first M second F G second');
    expect(result).toEqual({
      position: [0, 1],
      direction: 'N',
      visited: 2
    });
  });

  it('handles complex navigation scenario', () => {
    const result = navigateRobot('F F R F M east R F L F G east L B');
    expect(result).toEqual({
      position: [1, 3],
      direction: 'W',
      visited: 7
    });
  });

  it('handles marking at starting position', () => {
    const result = navigateRobot('M home F F F G home');
    expect(result).toEqual({
      position: [0, 0],
      direction: 'N',
      visited: 4
    });
  });

  it('correctly tracks visited squares with waypoint usage', () => {
    // Move in a path, mark middle, go far away, return via waypoint
    const result = navigateRobot('F M mid F F F F G mid');
    expect(result).toEqual({
      position: [0, 1],
      direction: 'N',
      visited: 5
    });
  });
});