import 'phaser';
import { Version } from '../version';

const pressStart2PPNG = require('../assets/fonts/press-start-2p_0.png');
const pressStart2PXML = require('../assets/fonts/press-start-2p.xml');

export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
    console.log(`UIScene::constructor() : ${Version}`);
  }

  preload() {
    console.log(`UIScene::preload() : ${Version}`);

    this.load.bitmapFont('press-start-2p', pressStart2PPNG, pressStart2PXML);
  }

  create() {
    console.log(`UIScene::create() : ${Version}`);

    this.add
      .bitmapText(16, 16, 'press-start-2p', `Version : ${Version}`, 16, 0)
      .setScrollFactor(0, 0)
      .setTint(0x00ff00, 0x00ff00, 0x00ffff, 0x00ffff);
  }

  addBitmapText(
    x: number,
    y: number,
    text?: string | string[],
    size?: number,
    align?: number
  ): Phaser.GameObjects.BitmapText {
    return this.add
      .bitmapText(x, y, 'press-start-2p', text, size, align)
      .setScrollFactor(0, 0);
  }

  update() {}
}
