import "phaser";
import { Version } from "../version";

export default class GameScene extends Phaser.Scene {
  private logoPNG = require("../assets/images/logo/divint-logo-256x256.png");
  private logoSprite;
  private xd: number;
  private yd: number;
  private graphics: Phaser.GameObjects.Graphics;
  private borderRect: Phaser.Geom.Rectangle = new Phaser.Geom.Rectangle();

  constructor() {
    super("GameScene");

    console.log(`GameScene::constructor() : ${Version}`);
  }

  preload() {
    this.load.image("logo", this.logoPNG);
  }

  create() {
    this.logoSprite = this.add.sprite(
      this.game.renderer.width >> 1,
      this.game.renderer.height >> 1,
      "logo"
    );
    this.xd = 1;
    this.yd = 1;

    this.graphics = this.add.graphics();
  }

  update() {
    this.borderRect.setPosition(32, 32);
    this.borderRect.setSize(
      this.game.renderer.width - 64,
      this.game.renderer.height - 64
    );

    this.graphics.clear();
    this.graphics.lineStyle(4, 0xffffff, 0.8);
    this.graphics.strokeRectShape(this.borderRect);

    this.logoSprite.x += this.xd;
    this.logoSprite.y += this.yd;

    if (this.logoSprite.x < this.logoSprite.width >> 1) {
      this.logoSprite.x = this.logoSprite.width >> 1;
      this.xd = 1;
    }
    if (this.logoSprite.y < this.logoSprite.height >> 1) {
      this.logoSprite.y = this.logoSprite.height >> 1;
      this.yd = 1;
    }
    if (
      this.logoSprite.x >
      this.game.renderer.width - (this.logoSprite.width >> 1)
    ) {
      this.logoSprite.x =
        this.game.renderer.width - (this.logoSprite.width >> 1);
      this.xd = -1;
    }
    if (
      this.logoSprite.y >
      this.game.renderer.height - (this.logoSprite.height >> 1)
    ) {
      this.logoSprite.y =
        this.game.renderer.height - (this.logoSprite.height >> 1);
      this.yd = -1;
    }
  }
}
