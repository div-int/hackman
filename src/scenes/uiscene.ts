import "phaser";
import { Version } from "../version";

const GREEN = 0x00ff00;
const CYAN = 0x00ffff;

export class UIScene extends Phaser.Scene {
  private _versionText: Phaser.GameObjects.BitmapText;

  constructor() {
    super("UIScene");
    console.log(`UIScene::constructor() : ${Version}`);
  }

  preload() {
    console.log(`UIScene::preload() : ${Version}`);

    this.load.bitmapFont(
      "press-start-2p",
      require("../assets/fonts/press-start-2p_0.png"),
      require("../assets/fonts/press-start-2p.xml")
    );
  }

  create() {
    console.log(`UIScene::create() : ${Version}`);

    this._versionText = this.add
      .bitmapText(
        16,
        window.innerHeight - 32,
        "press-start-2p",
        `Version : ${Version}`,
        16,
        Phaser.GameObjects.BitmapText.ALIGN_RIGHT
      )
      .setScrollFactor(0, 0)
      .setTint(GREEN, GREEN, CYAN, CYAN);
  }

  addBitmapText(
    x: number,
    y: number,
    text?: string | string[],
    size?: number,
    align?: number
  ): Phaser.GameObjects.BitmapText {
    return this.add
      .bitmapText(x, y, "press-start-2p", text, size, align)
      .setScrollFactor(0, 0);
  }

  update() {
    this._versionText.setPosition(16, window.innerHeight - 32);
  }
}
