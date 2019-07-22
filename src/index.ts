import "phaser";
import "./consts/consts";
import { Version } from "./version";
import { config } from "./config/config";
import { GameScene } from "./scenes/gamescene";
import { UIScene } from "./scenes/uiscene";
import "./gameobjects/gamestate";

export let hackManGame: HackManGame;

class HackManGame extends Phaser.Game {
  private _version: string;

  get Version() {
    if (!this._version) return (this._version = Version);
    else return this._version;
  }

  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);

    this.scene.add(Consts.Scenes.UIScene, UIScene, true);
    this.scene.add(Consts.Scenes.GameScene, GameScene, true);
  }
}

window.onload = function() {
  hackManGame = new HackManGame(config);
};
