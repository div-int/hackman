import "phaser";
import "../consts/consts";
import { hackManGame } from "../index";

let scale: number;

export class UIScene extends Phaser.Scene {
  private _isMobile: boolean;
  private _fullScreenButton: Phaser.GameObjects.Image;
  private _statusContainer: Phaser.GameObjects.Container;
  private _versionText: Phaser.GameObjects.BitmapText;
  private _statusText: Phaser.GameObjects.BitmapText;
  private _score1UPLabel: Phaser.GameObjects.BitmapText;
  private _score2UPLabel: Phaser.GameObjects.BitmapText;
  private _score1UPText: Phaser.GameObjects.BitmapText;
  private _score2UPText: Phaser.GameObjects.BitmapText;
  private _highScoreText: Phaser.GameObjects.BitmapText;
  private _gameStateContainer: Phaser.GameObjects.Container;

  public get isMobile() {
    return this._isMobile;
  }

  public get versionText() {
    return this._versionText.text;
  }

  public get statusText() {
    return this._statusText.text;
  }

  public set statusText(value: string | string[]) {
    this._statusText.setText(value);
    this._statusText.setX(
      -(this._statusText.getTextBounds(false).global.width >> 1)
    );
  }

  public set score1UPText(value: number) {
    this._score1UPText.text = value.toFixed(0).padStart(8, "00000000");
  }

  public set score2UPText(value: number) {
    this._score2UPText.text = value.toFixed(0).padStart(8, "00000000");
  }

  public set highScoreText(value: number) {
    this._highScoreText.text = value.toFixed(0).padStart(8, "00000000");
  }

  public addBitmapText(
    x: number,
    y: number,
    text?: string | string[],
    size?: number,
    align?: number
  ): Phaser.GameObjects.BitmapText {
    let value = this.add
      .bitmapText(x, y, "press-start-2p", text, size, align)
      .setScrollFactor(0, 0)
      .setScale(scale >> 1);

    if (align === 1)
      value.setX(x - (value.getTextBounds(false).global.width >> 1));
    else if (align === 2)
      value.setX(x - value.getTextBounds(false).global.width);

    return value;
  }

  constructor() {
    super(Consts.Scenes.UIScene);
    console.log(`UIScene::constructor() : ${hackManGame.version}`);
  }

  init() {
    if (this.sys.game.device.os.desktop) {
      scale = Consts.Game.ScaleDesktop;
      this._isMobile = false;
    } else {
      scale = Consts.Game.ScaleMobile;
      this._isMobile = true;
    }
  }

  preload() {
    console.log(`UIScene::preload() : ${hackManGame.version}`);

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
    console.log(`UIScene::create() : ${hackManGame.version}`);

    this.scene.bringToTop();

    if (this.isMobile) {
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
    }

    this._statusContainer = this.scene.scene.add.container(
      window.innerWidth >> 1,
      window.innerHeight
    );
    this._statusContainer.visible = true;

    this._statusContainer.add([
      (this._versionText = this.addBitmapText(
        -(window.innerWidth >> 1) + 2 * scale,
        -6 * scale,
        `${hackManGame.version}`,
        8,
        0
      )
        .setScrollFactor(0, 0)
        .setTint(
          Consts.Colours.Green,
          Consts.Colours.Green,
          Consts.Colours.Cyan,
          Consts.Colours.Cyan
        )),
      (this._statusText = this.addBitmapText(
        0,
        -6 * scale,
        "<Placeholder>",
        8,
        1
      )),
    ]);

    this._gameStateContainer = this.scene.scene.add.container(
      window.innerWidth >> 1,
      0
    );

    this._gameStateContainer.visible = false;
    this._gameStateContainer.add([
      this.addBitmapText(0, 2 * scale, "HIGH SCORE", 16, 1),
      (this._highScoreText = this.addBitmapText(
        0,
        16 * scale,
        "00000000",
        16,
        1
      )),
      (this._score1UPLabel = this.addBitmapText(
        -window.innerWidth >> 2,
        2 * scale,
        "1-UP",
        16,
        1
      )),
      (this._score1UPText = this.addBitmapText(
        -window.innerWidth >> 2,
        16 * scale,
        "00000000",
        16,
        1
      )),
      (this._score2UPLabel = this.addBitmapText(
        window.innerWidth >> 2,
        2 * scale,
        "2-UP",
        16,
        1
      )),
      (this._score2UPText = this.addBitmapText(
        window.innerWidth >> 2,
        16 * scale,
        "00000000",
        16,
        1
      )),
    ]);
  }

  resize() {
    if (this.isMobile) {
      this._fullScreenButton.setPosition(
        window.innerWidth - 4 * scale,
        4 * scale
      );
    }

    this._statusContainer.setPosition(
      window.innerWidth >> 1,
      window.innerHeight
    );

    this._versionText.setX(-(window.innerWidth >> 1) + 2 * scale);

    this._gameStateContainer.setPosition(window.innerWidth >> 1, 0);

    this._score1UPLabel.setPosition(
      (-window.innerWidth >> 2) -
        (this._score1UPLabel.getTextBounds(false).global.width >> 1),
      16 * scale
    );
    this._score1UPText.setPosition(
      (-window.innerWidth >> 2) -
        (this._score1UPText.getTextBounds(false).global.width >> 1),
      30 * scale
    );
    this._score2UPLabel.setPosition(
      (window.innerWidth >> 2) -
        (this._score2UPLabel.getTextBounds(false).global.width >> 1),
      16 * scale
    );
    this._score2UPText.setPosition(
      (window.innerWidth >> 2) -
        (this._score2UPText.getTextBounds(false).global.width >> 1),
      30 * scale
    );
  }

  update() {
    this.resize();

    if (hackManGame.gameState.playing || hackManGame.gameState.attract) {
      this._gameStateContainer.visible = true;
    } else {
      this._gameStateContainer.visible = false;
    }

    this.score1UPText = hackManGame.gameState.score;
    this.highScoreText = hackManGame.gameState.highScore;
  }
}
