import "phaser";
import "../consts/consts";
import { hackManGame } from "../index";

let scale: number;

export class UIScene extends Phaser.Scene {
  private _fullScreenButton: Phaser.GameObjects.Image;
  private _versionText: Phaser.GameObjects.BitmapText;

  constructor() {
    super(Consts.Scenes.UIScene);
    console.log(`UIScene::constructor() : ${hackManGame.Version}`);
  }

  init() {
    if (this.sys.game.device.os.desktop) {
      scale = Consts.Game.ScaleDesktop;
    } else {
      scale = Consts.Game.ScaleMobile;
    }
  }

  preload() {
    console.log(`UIScene::preload() : ${hackManGame.Version}`);

    this.load.bitmapFont(
      "press-start-2p",
      require("../assets/fonts/press-start-2p_0.png"),
      require("../assets/fonts/press-start-2p.xml")
    );

    this.load.spritesheet(
      Consts.Resources.HackManSprites,
      require("../assets/images/sprites/hackman.padded.png"),
      {
        frameWidth: 16,
        frameHeight: 16,
        margin: 1,
        spacing: 2,
      }
    );
  }

  create() {
    console.log(`UIScene::create() : ${hackManGame.Version}`);

    this.scene.bringToTop();

    this._fullScreenButton = this.add
      .image(
        window.innerWidth - 4 * scale,
        4 * scale,
        Consts.Resources.HackManSprites,
        Consts.Game.GoFullScreen
      )
      .setDepth(256 * 256 * 256)
      .setScale(scale)
      .setScrollFactor(0, 0)
      .setOrigin(1, 0)
      .setInteractive();

    this._fullScreenButton.on(
      "pointerup",
      () => {
        this.scene.pause(Consts.Scenes.GameScene);
        if (this.scale.isFullscreen) {
          this._fullScreenButton.setFrame(Consts.Game.GoFullScreen);
          try {
            this.scale.stopFullscreen();
          } catch (e) {
            console.error(e);
          }
        } else {
          this._fullScreenButton.setFrame(Consts.Game.LeaveFullScreen);
          try {
            this.scale.startFullscreen();
          } catch (e) {
            console.error(e);
          }
        }
        this.scene.resume(Consts.Scenes.GameScene);
      },
      this
    );

    this._versionText = this.add
      .bitmapText(
        8 * scale,
        window.innerHeight - 8 * scale,
        "press-start-2p",
        `Version : ${hackManGame.Version}`,
        8,
        Phaser.GameObjects.BitmapText.ALIGN_RIGHT
      )
      .setScrollFactor(0, 0)
      .setTint(
        Consts.Colours.Green,
        Consts.Colours.Green,
        Consts.Colours.Cyan,
        Consts.Colours.Cyan
      )
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
    this._fullScreenButton.setPosition(
      window.innerWidth - 4 * scale,
      4 * scale
    );
  }
}
