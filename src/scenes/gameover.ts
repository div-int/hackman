import 'phaser';
import '../consts/consts';
import { hackManGame } from '../index';
import { UIScene } from './uiscene';

export class GameOverScene extends Phaser.Scene {
  private _uiscene: UIScene;
  private _gameOverText: Phaser.GameObjects.BitmapText;

  get UIScene(): UIScene {
    if (!this._uiscene) return (this._uiscene = <UIScene>this.scene.get(Consts.Scenes.UIScene));
    else return this._uiscene;
  }

  constructor() {
    super(Consts.Scenes.GameOverScene);
    console.log(`GameOverScene::constructor() : ${hackManGame.version}`);
  }

  init() {
    console.log(`GameOverScene::init() : ${hackManGame.version}`);
  }

  preload() {
    console.log(`GameOverScene::preload() : ${hackManGame.version}`);

    this._gameOverText = this.UIScene.addBitmapText(innerWidth >> 1, innerHeight >> 1, 'G A M E  O V E R', 32, 1);
  }

  create() {
    console.log(`GameOverScene::create() : ${hackManGame.version}`);
  }

  update(timestamp: number, elapsed: number) {
    this.UIScene.statusText = `${(timestamp / Consts.Times.MilliSecondsInSecond).toFixed(0)}s ${elapsed.toFixed(2)}ms ${
      this.sys.game.device.os.desktop ? 'Desktop' : 'Mobile'
    }`;

    console.log(Math.round(timestamp / Consts.Times.MilliSecondsInSecond) % 2);
    if (Math.round(timestamp / Consts.Times.MilliSecondsInSecond) % 2) {
      this._gameOverText.visible = true;
    } else {
      this._gameOverText.visible = false;
    }

    this._gameOverText.setX((innerWidth >> 1) - (this._gameOverText.getTextBounds(false).global.width >> 1));
    this._gameOverText.setY(innerHeight >> 1);
  }
}
