import 'phaser';
import { Version } from '../version';
import { UIScene } from './uiscene';
import { LevelScene } from './levelscene';
import { GameState } from './gamestate';
import '../gameobjects/hackman';
import { HackMan } from '../gameobjects/hackman';

const MAXSPRITE = 5000;
const WHITE = 0xffffff;
export class GameScene extends Phaser.Scene {
  private _uiscene: UIScene;
  private _levelscene: LevelScene;
  private _gameState: GameState;

  private _statusText: Phaser.GameObjects.BitmapText;
  private _hackman: HackMan[] = new Array<HackMan>(MAXSPRITE);

  constructor() {
    super('GameScene');
    console.log(`GameScene::constructor() : ${Version}`);

    this._uiscene = new UIScene();
    this._levelscene = new LevelScene(0);
    this._gameState = new GameState();

    window.onresize = () => {
      this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight);
    };
  }

  preload() {
    console.log(`GameScene::preload() : ${Version}`);
    HackMan.load(this);
  }

  create() {
    console.log(`GameScene::create() : ${Version}`);

    // Add UI scene object and start it.
    this.game.scene.add('UIScene', this._uiscene);
    this.game.scene.start('UIScene');

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

    for (let i = 0; i < this._hackman.length; i++) {
      this._hackman[i] = new HackMan(this, 0, 0, 0);
      this._hackman[i].add(this);
    }

    this._hackman.map((hackman: HackMan) => {
      console.log(hackman);
      hackman
        .setScale(4)
        .setRandomPosition()
        .setCollideWorldBounds(true, 1, 1)
        .setVelocity(
          Phaser.Math.Between(-256, 256),
          Phaser.Math.Between(-256, 256)
        )
        .anims.play('hackmanWalk', true, Phaser.Math.Between(0, 4));
    });

    // this._hackman.map(hackman => {
    //   hackman.sprite().anims.play('hackmanWalk');
    // });
  }

  update(timestamp: number, elapsed: number) {
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

    for (let i = 0; i < this._hackman.length >> 8; i++) {
      const r = Phaser.Math.Between(1, 255);
      const g = Phaser.Math.Between(1, 255);
      const b = Phaser.Math.Between(1, 255);
      const rgb = (r << 16) | (g << 8) | b;
      this._hackman[Phaser.Math.Between(0, this._hackman.length - 1)]
        .setVelocity(
          Phaser.Math.Between(-256, 256),
          Phaser.Math.Between(-256, 256)
        )
        .setTint(rgb, rgb, WHITE, WHITE);
    }
  }
}
