import "phaser";
import "./consts/consts";
import { Version } from "./version";
import { config } from "./config/config";
import { GameScene } from "./scenes/gamescene";
import { UIScene } from "./scenes/uiscene";
import { GameState } from "./gameobjects/gamestate";

export let hackManGame: HackManGame;

class HackManGame extends Phaser.Game {
  private _version: string;
  private _gameState: GameState;

  get version() {
    if (!this._version) return (this._version = Version);
    else return this._version;
  }

  get gameState() {
    if (!this._gameState) return (this._gameState = new GameState());
    else return this._gameState;
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
