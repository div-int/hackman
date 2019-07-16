import 'phaser';
import { Version } from '../version';

export default class LevelScene extends Phaser.Scene {
  private _level: number;

  constructor(level: number) {
    super('LevelScene');
    console.log(`LevelScene::constructor(level = ${level}) : ${Version}`);

    this._level = level;
  }

  preload() {}

  create() {
    //TODO: Load level @param level
  }

  update() {}
}
