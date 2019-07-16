import 'phaser';
import { Version } from '../version';
import UIScene from './uiscene';
import LevelScene from './levelscene';
import { GameState } from './gamestate';

export default class GameScene extends Phaser.Scene {
  private _uiscene: UIScene;
  private _levelscene: LevelScene;
  private _gameState: GameState;

  private _statusText: Phaser.GameObjects.BitmapText;

  constructor() {
    super('GameScene');
    console.log(`GameScene::constructor() : ${Version}`);

    this._uiscene = new UIScene();
    this._levelscene = new LevelScene(0);
    this._gameState = new GameState();
  }

  preload() {
    console.log(`GameScene::preload() : ${Version}`);

    // Add UI scene object and start it.
    this.game.scene.add('UIScene', this._uiscene);
    this.game.scene.start('UIScene');
  }

  create() {
    console.log(`GameScene::create() : ${Version}`);

    /** Add bitmap text object to ui scene for our status text.
     * Use an event handler when complete as the ui scene has not been created yet.
     */

    this._uiscene.load.on('complete', () => {
      this._statusText = this._uiscene.addBitmapText(
        16,
        48,
        '<Placeholder>',
        16,
        0
      );
    });

    // Add Level scene object but don't start it yet.
    this.game.scene.add('LevelScene', this._levelscene);
  }

  update(timestamp: any, elapsed: any) {
    if (this._statusText) {
      this._statusText.setText(
        `${(timestamp / 1000.0).toFixed(0)}s ${elapsed.toFixed(2)}ms`
      );
    }

    this.cameras.main.backgroundColor.setTo(
      Phaser.Math.Between(0, 255),
      Phaser.Math.Between(0, 255),
      Phaser.Math.Between(0, 255),
      Phaser.Math.Between(0, 255),
      true
    );
  }
}
