import { drawFrameOrigin } from "engine/context.js";
import { Entity } from "engine/Entity.js";
import {
	animations,
	BombermanStateType,
	frames,
} from "game/constants/bomberman.js";
import { Direction } from "game/constants/entities.js";
import { FRAME_TIME, HALF_TILE_SIZE, TILE_SIZE } from "game/constants/game.js";

export class Bomberman extends Entity {
	image = document.querySelector("img#bomberman");

	direction = Direction.DOWN;
	baseSpeedTime = 1.2;
	speedMultiplier = 1;
	animation = animations.moveAnimations[this.direction];

	constructor(position, time) {
		super({
			x: position.x * TILE_SIZE + HALF_TILE_SIZE,
			y: position.y * TILE_SIZE + HALF_TILE_SIZE,
		});

		this.state = {
			[BombermanStateType.IDLE]: {
				type: BombermanStateType.IDLE,
				init: this.handleIdleInit,
				update: this.handleIdleState,
			},
		};

		this.changeState(BombermanStateType.IDLE, time);
	}

	changeState(newState, time) {
		this.currentState = this.state[newState];
		this.animationFrame = 0;
		this.animationTimer =
			time.previous + this.animation[this.animationFrame] * FRAME_TIME;

		this.currentState.init(time);
	}

	handleIdleInit = () => {
		this.velocity = { x: 0, y: 0 };
	};

	handleIdleState = () => {};

	update(time) {
		this.currentState.update(time);
	}

	draw(context, camera) {
		const [frameKey] = this.animation[this.animationFrame];
		const frame = frames.get(frameKey);

		drawFrameOrigin(
			context,
			this.image,
			frame,
			Math.floor(this.position.x - camera.position.x),
			Math.floor(this.position.y - camera.position.y),
			[this.direction === Direction.RIGHT ? -1 : 1, 1]
		);
	}
}
