import "phaser";
import { Version } from "../version";

const GREEN = 0x00ff00;
const CYAN = 0x00ffff;

let scale: number;

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

    if (this.sys.game.device.os.desktop) {
      scale = Consts.Game.ScaleDesktop;
    } else {
      scale = Consts.Game.ScaleMobile;
    }
  }

  create() {
    console.log(`UIScene::create() : ${Version}`);

    this._versionText = this.add
      .bitmapText(
        8 * scale,
        window.innerHeight - 8 * scale,
        "press-start-2p",
        `Version : ${Version}`,
        8,
        Phaser.GameObjects.BitmapText.ALIGN_RIGHT
      )
      .setScrollFactor(0, 0)
      .setTint(GREEN, GREEN, CYAN, CYAN)
      .setScale(scale >> 1);
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
      .setScrollFactor(0, 0)
      .setScale(scale >> 1);
  }

  update() {
    this._versionText.setPosition(4 * scale, window.innerHeight - 8 * scale);
  }
}
