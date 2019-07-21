import "phaser";

const defaultFrame = 0;

const walkRight = 0;
const walkDown = 16;
const walkLeft = 32;
const walkUp = 48;

const walkStart = 0;
const walkEnd = 4;

export enum HackManWalkDirection {
  Right,
  Down,
  Left,
  Up,
}

const hackManWalkDirectionValues = [
  { direction: "Right", velocity: { x: 80, y: 0 } },
  { direction: "Down", velocity: { x: 0, y: 80 } },
  { direction: "Left", velocity: { x: -80, y: 0 } },
  { direction: "Up", velocity: { x: 0, y: -80 } },
];

export class HackMan extends Phaser.Physics.Arcade.Sprite {
  private _scene: Phaser.Scene;
  private _mapLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  private _walkDirection: HackManWalkDirection;
  private _faceDirection: HackManWalkDirection;
  private _shadowSprite: Phaser.Physics.Arcade.Sprite;
  private _previousX: number;
  private _previousY: number;

  static get MaxDirections(): number {
    return 3;
  }

  get WalkDirection() {
    return this._walkDirection;
  }

  set WalkDirection(walkDirection: HackManWalkDirection) {
    this._walkDirection = walkDirection % (HackMan.MaxDirections + 1);

    if (walkDirection < 0) this._walkDirection += HackMan.MaxDirections + 1;
  }

  get FaceDirection() {
    return this._faceDirection;
  }

  set FaceDirection(faceDirection: HackManWalkDirection) {
    this._faceDirection = faceDirection % (HackMan.MaxDirections + 1);

    if (faceDirection < 0) this._faceDirection += HackMan.MaxDirections + 1;
  }

  constructor(
    scene: Phaser.Scene,
    mapLayer: Phaser.Tilemaps.DynamicTilemapLayer,
    x: number,
    y: number
  ) {
    super(scene, x, y, Consts.Resources.HackManSprites, defaultFrame);

    this._scene = scene;
    this._mapLayer = mapLayer;

    this._shadowSprite = new Phaser.Physics.Arcade.Sprite(
      scene,
      x,
      y,
      Consts.Resources.HackManSprites,
      defaultFrame
    )
      .setDepth(4)
      .setTint(0)
      .setAlpha(Consts.MagicNumbers.Quarter);

    scene.anims.create({
      key: "hackmanWalkRight",
      frames: scene.anims.generateFrameNumbers(
        Consts.Resources.HackManSprites,
        {
          start: walkStart + walkRight,
          end: walkEnd + walkRight,
        }
      ),
      frameRate: Consts.Game.HackmanFrameRate,
      yoyo: true,
      repeat: -1,
    });

    scene.anims.create({
      key: "hackmanWalkDown",
      frames: scene.anims.generateFrameNumbers(
        Consts.Resources.HackManSprites,
        {
          start: walkStart + walkDown,
          end: walkEnd + walkDown,
        }
      ),
      frameRate: Consts.Game.HackmanFrameRate,
      yoyo: true,
      repeat: -1,
    });
    scene.anims.create({
      key: "hackmanWalkLeft",
      frames: scene.anims.generateFrameNumbers(
        Consts.Resources.HackManSprites,
        {
          start: walkStart + walkLeft,
          end: walkEnd + walkLeft,
        }
      ),
      frameRate: Consts.Game.HackmanFrameRate,
      yoyo: true,
      repeat: -1,
    });
    scene.anims.create({
      key: "hackmanWalkUp",
      frames: scene.anims.generateFrameNumbers(
        Consts.Resources.HackManSprites,
        {
          start: walkStart + walkUp,
          end: walkEnd + walkUp,
        }
      ),
      frameRate: Consts.Game.HackmanFrameRate,
      yoyo: true,
      repeat: -1,
    });

    scene.anims.create({
      key: "hackmanWalkRightBlink",
      frames: scene.anims.generateFrameNumbers(
        Consts.Resources.HackManSprites,
        {
          start: 5,
          end: 9,
        }
      ),
      frameRate: Consts.Game.HackmanFrameRate,
      yoyo: true,
      repeat: 0,
    });

    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.add.existing(this._shadowSprite);
  }

  hitWall(tile: Phaser.GameObjects.GameObject) {
    if (Math.random() >= Consts.MagicNumbers.Half) {
      this.walk(this.WalkDirection + 1);
    } else {
      this.walk(this.WalkDirection - 1);
    }
  }

  walk(walkDirection: HackManWalkDirection) {
    if (this.WalkDirection === walkDirection) return;

    this.WalkDirection = walkDirection;
    this.setVelocity(
      hackManWalkDirectionValues[this.WalkDirection].velocity.x * this.scaleX,
      hackManWalkDirectionValues[this.WalkDirection].velocity.y * this.scaleY
    );
    this.face(this.WalkDirection);
  }

  face(faceDirection: HackManWalkDirection) {
    if (faceDirection > HackMan.MaxDirections || faceDirection < 0) {
      faceDirection = faceDirection % (HackMan.MaxDirections + 1);
    }
    this._faceDirection = faceDirection;
    this.anims.play(
      `hackmanWalk${hackManWalkDirectionValues[faceDirection].direction}`,
      true,
      0
    );
  }

  update() {
    this.depth = this.x + this.y * window.innerWidth;

    this._shadowSprite.scale = this.scale;
    this._shadowSprite.x = this.x + Consts.Game.ShadowOffset;
    this._shadowSprite.y = this.y + Consts.Game.ShadowOffset;
    this._shadowSprite.frame = this.frame;

    let x = this.x;
    let y = this.y;
    let w = (this.displayWidth >> 1) - 8;
    let h = (this.displayHeight >> 1) - 8;
    let tile1 = this._mapLayer.getTileAtWorldXY(x - w, y - h, true);
    let tile2 = this._mapLayer.getTileAtWorldXY(x + w, y - h, true);
    let tile3 = this._mapLayer.getTileAtWorldXY(x + w, y + h, true);
    let tile4 = this._mapLayer.getTileAtWorldXY(x - w, y + h, true);

    if (tile1.x === tile2.x && tile2.x === tile3.x && tile3.x === tile4.x) {
      if (tile1.y === tile2.y && tile2.y === tile3.y && tile3.y === tile4.y) {
        if (tile1.x != this._previousX || tile1.y != this._previousY) {
          let x = tile1.x;
          let y = tile1.y;
          this._previousX = x;
          this._previousY = y;

          if (
            this.WalkDirection == HackManWalkDirection.Up ||
            this.WalkDirection == HackManWalkDirection.Down
          ) {
            if (this._mapLayer.getTileAt(x - 1, y, true).index === -1) {
              if (Math.random() >= Consts.MagicNumbers.Half)
                this.walk(HackManWalkDirection.Left);
            } else {
              if (this._mapLayer.getTileAt(x + 1, y, true).index === -1) {
                if (Math.random() >= Consts.MagicNumbers.Half)
                  this.walk(HackManWalkDirection.Right);
              }
            }
          } else {
            if (
              this.WalkDirection == HackManWalkDirection.Left ||
              this.WalkDirection == HackManWalkDirection.Right
            ) {
              if (this._mapLayer.getTileAt(x, y - 1, true).index === -1) {
                if (Math.random() >= Consts.MagicNumbers.Half)
                  this.walk(HackManWalkDirection.Up);
              } else {
                if (this._mapLayer.getTileAt(x, y + 1, true).index === -1) {
                  if (Math.random() >= Consts.MagicNumbers.Half)
                    this.walk(HackManWalkDirection.Down);
                }
              }
            }
          }

          // console.log(
          //   this._mapLayer.getTileAt(x - 1, y, true).index,
          //   this._mapLayer.getTileAt(x + 1, y, true).index,
          //   this._mapLayer.getTileAt(x, y - 1, true).index,
          //   this._mapLayer.getTileAt(x, y + 1, true).index
          // );
        }
      }
    }
  }
}
