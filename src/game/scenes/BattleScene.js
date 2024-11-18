import { Scene } from "engine/Scene.js";
import { HALF_TILE_SIZE, STAGE_OFFSET_Y } from "game/constants/game.js";
import { BattleHud } from "game/entities/BattleHud.js";
import { LevelMap } from "game/entities/LevelMap.js";

export class BattleScene extends Scene {
	constructor(time, camera) {
		super();

		this.stage = new LevelMap();
		this.hud = new BattleHud();

		camera.position = { x: HALF_TILE_SIZE, y: -STAGE_OFFSET_Y };
	}

	update(time, context, camera) {
		// Add your main update calls here
	}

	draw(context, camera) {
		this.stage.draw(context, camera);
		this.hud.draw(context);
	}

	cleanUp() {
		// Can be used to clean
	}
}
