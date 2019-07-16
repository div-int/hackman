import 'phaser';
import config from './config/config';
import GameScene from './scenes/gamescene';

let game: Phaser.Game;

class MyGame extends Phaser.Game {
  private version: string;

  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);

    this.scene.add('GameScene', GameScene);
    this.scene.start('GameScene');
  }

  getVersion() {
    return this.version;
  }
}

window.onload = function() {
  game = new MyGame(config);
};
