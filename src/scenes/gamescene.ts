import "phaser";
import { Version } from "../version";
import UIScene from "./uiscene";
import LevelScene from "./levelscene";
import { PlayerState, GameState } from "./gamestate";

export default class GameScene extends Phaser.Scene {
  private _uiscene: UIScene;
  private _levelscene: LevelScene;
  private _gamestate: GameState;

  constructor() {
    super("GameScene");
    console.log(`GameScene::constructor() : ${Version}`);

    this._uiscene = new UIScene();
    this._levelscene = new LevelScene();
  }

  preload() {}

  create() {}

  update() {}
}
