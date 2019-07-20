import "phaser";
import "./consts/consts";
import { config } from "./config/config";
import { GameScene } from "./scenes/gamescene";

let game: Phaser.Game;

class MyGame extends Phaser.Game {
  private version: string;

  get Version() {
    return this.version;
  }

  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);

    this.scene.add(Consts.Scenes.GameScene, GameScene, false);
    this.scene.start(Consts.Scenes.GameScene);
  }
}

window.onload = function() {
  game = new MyGame(config);
};
