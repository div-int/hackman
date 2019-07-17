import "phaser";
import { Version } from "../version";

export class LevelScene extends Phaser.Scene {
  private _level: number;

  constructor(level: number) {
    super("LevelScene");
    console.log(`LevelScene::constructor(level = ${level}) : ${Version}`);

    this._level = level;

    window.onresize = () => {
      this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight);
    };
  }

  preload() {}

  create() {
    //TODO: Load level @param level
  }

  update() {}
}
