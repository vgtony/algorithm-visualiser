// Types for visualization algorithms

export interface Point {
  x: number;
  y: number;
}

export interface RandomWalkState {
  path: Point[];
  currentPosition: Point;
  isRunning: boolean;
  stepCount: number;
}
