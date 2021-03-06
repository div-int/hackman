import 'phaser';
import '../consts/consts';
import { hackManGame } from '../index';

let scale: number;

const enum Orientation {
  Portrait,
  Landscape,
}

export class UIScene extends Phaser.Scene {
  private _isMobile: boolean;
  private _orientation: Orientation;
  private _fullScreenButton: Phaser.GameObjects.Image;
  private _statusContainer: Phaser.GameObjects.Container;
  private _versionText: Phaser.GameObjects.BitmapText;
  private _statusText: Phaser.GameObjects.BitmapText;
  private _windowText: Phaser.GameObjects.BitmapText;
  private _score1UPLabel: Phaser.GameObjects.BitmapText;
  private _score2UPLabel: Phaser.GameObjects.BitmapText;
  private _score1UPText: Phaser.GameObjects.BitmapText;
  private _score2UPText: Phaser.GameObjects.BitmapText;
  private _highScoreText: Phaser.GameObjects.BitmapText;
  private _livesText: Phaser.GameObjects.BitmapText;
  private _gameStateContainer: Phaser.GameObjects.Container;

  public get isMobile() {
    return this._isMobile;
  }

  public get orientation(): Orientation {
    return this._orientation;
  }

  public set orientation(orientation: Orientation) {
    this._orientation = orientation;
  }

  public get versionText() {
    return this._versionText.text;
  }

  public get statusText() {
    return this._statusText.text;
  }

  public get windowText() {
    return this._windowText.text;
  }

  public set versionPosition(value: number) {
    this._versionText.setX(value);
  }

  public set statusText(value: string | string[]) {
    this._statusText.setText(value);
    this._statusText.setX(-(this._statusText.getTextBounds(false).global.width >> 1));
  }

  public set windowText(value: string | string[]) {
    this._windowText.setText(value);
    this._windowText.setX(window.innerWidth - Consts.UI.Margin - this._statusText.getTextBounds(false).global.width);
  }

  public set windowPosition(value: number) {
    this._windowText.setX(value - this._windowText.getTextBounds(false).global.width);
  }

  public set score1UPText(value: number) {
    this._score1UPText.text = value.toFixed(0).padStart(6, '000000');
  }

  public set score1UPPosition(value: number) {
    this._score1UPLabel.setPosition(
      value - (this._score1UPLabel.getTextBounds(false).global.width >> 1),
      2 * scale + (this.orientation === Orientation.Portrait ? Consts.UI.TextSize * scale : 0)
    );
    this._score1UPText.setPosition(
      value - (this._score1UPText.getTextBounds(false).global.width >> 1),
      Consts.UI.TextSize * scale + (this.orientation === Orientation.Portrait ? Consts.UI.TextSize * scale : 0)
    );
  }

  public set score2UPPosition(value: number) {
    this._score2UPLabel.setPosition(
      value - (this._score2UPLabel.getTextBounds(false).global.width >> 1),
      2 * scale + (this.orientation === Orientation.Portrait ? Consts.UI.TextSize * scale : 0)
    );
    this._score2UPText.setPosition(
      value - (this._score2UPText.getTextBounds(false).global.width >> 1),
      Consts.UI.TextSize * scale + (this.orientation === Orientation.Portrait ? Consts.UI.TextSize * scale : 0)
    );
  }

  public set score2UPText(value: number) {
    this._score2UPText.text = value.toFixed(0).padStart(6, '000000');
  }

  public set highScoreText(value: number) {
    this._highScoreText.text = value.toFixed(0).padStart(6, '000000');
  }

  public set livesText(value: number) {
    let tmp = '';

    if (value > 0) {
      for (let i = 0; i < value; i++) {
        tmp += '\x01';
      }
    }

    this._livesText.text = tmp;
  }

  public addBitmapText(
    x: number,
    y: number,
    text?: string | string[],
    size?: number,
    align?: number
  ): Phaser.GameObjects.BitmapText {
    let value = this.add
      .bitmapText(x, y, 'press-start-2p', text, size, align)
      .setScrollFactor(0, 0)
      .setScale(scale >> 1);

    if (align === 1) value.setX(x - (value.getTextBounds(false).global.width >> 1));
    else if (align === 2) value.setX(x - value.getTextBounds(false).global.width);

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
      'press-start-2p',
      require('../assets/fonts/press-start-2p_0.png'),
      require('../assets/fonts/press-start-2p.xml')
    );

    this.load.spritesheet(Consts.Resources.HackManSprites, require('../assets/images/sprites/hackman.padded.png'), {
      frameWidth: 16,
      frameHeight: 16,
      margin: 1,
      spacing: 2,
    });
  }

  create() {
    console.log(`UIScene::create() : ${hackManGame.version}`);

    this.scene.bringToTop();

    if (this.isMobile) {
      this._fullScreenButton = this.add
        .image(window.innerWidth - 4 * scale, 4 * scale, Consts.Resources.HackManSprites, Consts.Game.GoFullScreen)
        .setDepth(256 * 256 * 256)
        .setScale(scale)
        .setScrollFactor(0, 0)
        .setOrigin(1, 0)
        .setInteractive();

      this._fullScreenButton.on(
        'pointerup',
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

    this._statusContainer = this.scene.scene.add.container(window.innerWidth >> 1, window.innerHeight);
    this._statusContainer.visible = true;

    this._statusContainer.add([
      (this._versionText = this.addBitmapText(
        -(window.innerWidth >> 1) + Consts.UI.Margin * scale,
        -(Consts.UI.StatusTextSize - Consts.UI.Margin) * scale,
        `${hackManGame.version}`,
        Consts.UI.StatusTextSize,
        Phaser.GameObjects.BitmapText.ALIGN_LEFT
      )),
      (this._statusText = this.addBitmapText(
        0,
        -(Consts.UI.StatusTextSize - Consts.UI.Margin) * scale,
        '',
        Consts.UI.StatusTextSize,
        Phaser.GameObjects.BitmapText.ALIGN_CENTER
      )),
      (this._windowText = this.addBitmapText(
        (window.innerWidth >> 1) - Consts.UI.Margin * scale,
        -(Consts.UI.StatusTextSize - Consts.UI.Margin) * scale,
        '',
        Consts.UI.StatusTextSize,
        Phaser.GameObjects.BitmapText.ALIGN_RIGHT
      )),
    ]);

    this._gameStateContainer = this.scene.scene.add.container(window.innerWidth >> 1, 0);

    this._gameStateContainer.visible = false;
    this._gameStateContainer.add([
      this.addBitmapText(0, 2 * scale, 'HIGH SCORE', Consts.UI.TextSize, 1),
      (this._highScoreText = this.addBitmapText(0, Consts.UI.TextSize * scale, '000000', Consts.UI.TextSize, 1)),
      (this._score1UPLabel = this.addBitmapText(
        -window.innerWidth >> 2,
        Consts.UI.TextSize * scale,
        '1-UP',
        Consts.UI.TextSize,
        1
      )),
      (this._score1UPText = this.addBitmapText(
        -window.innerWidth >> 2,
        Consts.UI.TextSize * scale,
        '000000',
        Consts.UI.TextSize,
        1
      )),
      (this._score2UPLabel = this.addBitmapText(window.innerWidth >> 2, 2 * scale, '2-UP', Consts.UI.TextSize, 1)),
      (this._score2UPText = this.addBitmapText(
        window.innerWidth >> 2,
        Consts.UI.TextSize * scale,
        '000000',
        Consts.UI.TextSize,
        1
      )),
      (this._livesText = this.addBitmapText(
        -(window.innerWidth >> 1) + Consts.UI.Margin * scale,
        Consts.UI.Margin * scale,
        '\x01\x01\x01',
        Consts.UI.TextSize,
        0
      ).setTint(Consts.Colours.Yellow)),
    ]);
  }

  resize() {
    if (this.isMobile) {
      this._fullScreenButton.setPosition(window.innerWidth - 4 * scale, 4 * scale);
    }

    if (window.innerWidth < window.innerHeight) {
      // portrait mode
      this.orientation = Orientation.Portrait;
    } else {
      // landscape mode
      this.orientation = Orientation.Landscape;
    }

    this._statusContainer.setPosition(window.innerWidth >> 1, window.innerHeight);

    this.windowText = `${window.innerWidth} x ${window.innerHeight}`;
    this.versionPosition = -(window.innerWidth >> 1) + Consts.UI.Margin * scale;
    this.windowPosition = (window.innerWidth >> 1) - Consts.UI.Margin * scale;
    this._gameStateContainer.setPosition(window.innerWidth >> 1, 0);

    this.score1UPPosition = -window.innerWidth >> 2;
    this.score2UPPosition = window.innerWidth >> 2;
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
    this.livesText = hackManGame.gameState.lives;
  }
}
