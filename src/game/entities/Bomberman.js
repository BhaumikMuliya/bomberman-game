import { drawFrameOrigin } from "engine/context.js";
import { Entity } from "engine/Entity.js";
import * as control from "engine/inputHandler.js";
import {
	animations,
	BombermanStateType,
	frames,
	WALK_SPEED,
} from "game/constants/bomberman.js";
import { Direction } from "game/constants/entities.js";
import { FRAME_TIME, HALF_TILE_SIZE, TILE_SIZE } from "game/constants/game.js";
import { isZero } from "game/utils/utils.js";

export class Bomberman extends Entity {
	image = document.querySelector("img#bomberman");

	id = 0;
	direction = Direction.DOWN;
	baseSpeedTime = 1.2;
	speedMultiplier = 1;
	animation = animations.moveAnimations[this.direction];

	constructor(position, time) {
		super({
			x: position.x * TILE_SIZE + HALF_TILE_SIZE,
			y: position.y * TILE_SIZE + HALF_TILE_SIZE,
		});

		this.states = {
			[BombermanStateType.IDLE]: {
				type: BombermanStateType.IDLE,
				init: this.handleIdleInit,
				update: this.handleIdleState,
			},
			[BombermanStateType.MOVING]: {
				type: BombermanStateType.IDLE,
				init: this.handleMovingInit,
				update: this.handleMovingState,
			},
		};

		this.changeState(BombermanStateType.IDLE, time);
	}

	changeState(newState, time) {
		this.currentState = this.states[newState];
		this.animationFrame = 0;
		this.animationTimer =
			time.previous + this.animation[this.animationFrame] * FRAME_TIME;

		this.currentState.init(time);
	}

	getMovement() {
		if (control.isDown(this.id)) {
			return [Direction.DOWN, { x: 0, y: WALK_SPEED }];
		} else if (control.isRight(this.id)) {
			return [Direction.RIGHT, { x: WALK_SPEED, y: 0 }];
		} else if (control.isUp(this.id)) {
			return [Direction.UP, { x: 0, y: -WALK_SPEED }];
		} else if (control.isLeft(this.id)) {
			return [Direction.LEFT, { x: -WALK_SPEED, y: 0 }];
		} else {
			return [this.direction, { x: 0, y: 0 }];
		}
	}

	handleIdleInit = () => {
		this.velocity = { x: 0, y: 0 };
	};

	handleMovingInit = () => {
		this.animationFrame = 1;
	};

	handleGeneralState = () => {
		const [direction, velocity] = this.getMovement();

		this.animation = animations.moveAnimations[direction];
		this.direction = direction;

		return { x: velocity.x, y: velocity.y };
	};

	handleIdleState = (time) => {
		const velocity = this.handleGeneralState();
		if (isZero(velocity)) {
			return;
		} else {
			this.changeState(BombermanStateType.MOVING, time);
		}
	};

	handleMovingState = (time) => {
		this.velocity = this.handleGeneralState();
		if (!isZero(this.velocity)) {
			return;
		} else {
			this.changeState(BombermanStateType.IDLE, time);
		}
	};

	updatePosition(time) {
		this.position.x +=
			this.velocity.x *
			this.speedMultiplier *
			this.baseSpeedTime *
			time.secondsPassed;
		this.position.y +=
			this.velocity.y *
			this.speedMultiplier *
			this.baseSpeedTime *
			time.secondsPassed;
	}

	updateAnimation(time) {
		if (time.previous < this.animationTimer) return;
		else {
			this.animationFrame += 1;

			if (this.animationFrame >= this.animation.length) {
				this.animationFrame = 0;
			}

			this.animationTimer =
				time.previous + this.animation[this.animationFrame][1] * FRAME_TIME;
		}
	}

	update(time) {
		this.updatePosition(time);
		this.currentState.update(time);
		this.updateAnimation(time);
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
