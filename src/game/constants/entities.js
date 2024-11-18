export const Direction = {
	DOWN: "direction-down",
	LEFT: "direction-left",
	RIGHT: "direction-right",
	UP: "direction-up",
};

export const MovementLookup = {
	[Direction.DOWN]: { x: 0, y: 1 },
	[Direction.LEFT]: { x: -1, y: 0 },
	[Direction.RIGHT]: { x: 1, y: 0 },
	[Direction.UP]: { x: 0, y: -1 },
};

export const CounterDirectionsLookup = {
	[Direction.DOWN]: [Direction.RIGHT, Direction.LEFT],
	[Direction.LEFT]: [Direction.DOWN, Direction.UP],
	[Direction.RIGHT]: [Direction.DOWN, Direction.UP],
	[Direction.UP]: [Direction.RIGHT, Direction.LEFT],
};
