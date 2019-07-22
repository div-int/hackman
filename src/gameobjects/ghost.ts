import "phaser";
import { RIGHT } from "phaser";

// const Consts.Resources.HackManSprites = "Consts.Resources.HackManSprites";
const maxGhostNo = 3;
const maxDirections = 3;

const ghost0 = 5;
const ghost1 = 6;
const ghost2 = 7;
const ghost3 = 8;
const ghostFrightened = 9;
const ghostEaten = 10;

const defaultFrame = [ghost0 * 16, ghost1 * 16, ghost2 * 16, ghost3 * 16];

const walkRightStart = 0;
const walkRightEnd = 1;
const walkDownStart = 2;
const walkDownEnd = 3;
const walkLeftStart = 4;
const walkLeftEnd = 5;
const walkUpStart = 6;
const walkUpEnd = 7;

export enum GhostWalkDirection {
  Right,
  Down,
  Left,
  Up,
}

export enum GhostState {
  Chase,
  Scatter,
  Frightened,
  Eaten,
}

const ghostWalkDirectionValues = [
  { direction: "Right", velocity: { x: Consts.Game.GhostSpeed, y: 0 } },
  { direction: "Down", velocity: { x: 0, y: Consts.Game.GhostSpeed } },
  { direction: "Left", velocity: { x: -Consts.Game.GhostSpeed, y: 0 } },
  { direction: "Up", velocity: { x: 0, y: -Consts.Game.GhostSpeed } },
];

export class Ghost extends Phaser.Physics.Arcade.Sprite {
  private _ghostNo: number;
  private _mapLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private _walkDirection: GhostWalkDirection;
  private _faceDirection: GhostWalkDirection;
  private _hitWall: boolean;
  private _speedMultiplier: number;
  private _animationPrefix: string;
  private _ghostState: GhostState;
  private _shadowSprite: Phaser.Physics.Arcade.Sprite;
  private _previousX: number;
  private _previousY: number;

  static MaxGhostNo() {
    return maxGhostNo;
  }

  static MaxDirections() {
    return maxDirections;
  }

  get GhostNo() {
    return this._ghostNo;
  }

  set GhostNo(ghostNo: number) {
    this._ghostNo = ghostNo;
  }

  get WalkDirection() {
    return this._walkDirection;
  }

  set WalkDirection(walkDirection: GhostWalkDirection) {
    this._walkDirection = walkDirection % (Ghost.MaxDirections() + 1);

    if (walkDirection < 0) this._walkDirection += Ghost.MaxDirections() + 1;
  }

  get FaceDirection() {
    return this._faceDirection;
  }

  set FaceDirection(faceDirection: GhostWalkDirection) {
    this._faceDirection = faceDirection % (Ghost.MaxDirections() + 1);

    if (faceDirection < 0) this._faceDirection += Ghost.MaxDirections() + 1;
  }

  get SpeedMultiplier() {
    return this._speedMultiplier;
  }

  set SpeedMultiplier(speedMultiplier: number) {
    Math.abs(speedMultiplier) <= 2
      ? (this._speedMultiplier = Math.abs(speedMultiplier))
      : 2;
  }

  get GhostState() {
    return this._ghostState;
  }

  set GhostState(ghostState: GhostState) {
    if (ghostState === this._ghostState) return;

    if (ghostState === GhostState.Frightened) {
      if (this._ghostState === GhostState.Eaten) return;
      this.setAlpha(Consts.MagicNumbers.ThreeQuarters);
      this.SpeedMultiplier = Consts.MagicNumbers.Half;
      this._animationPrefix = "ghostFrightened";
      this._ghostState = ghostState;
      this.updateAnimation();
      this.walk(this.WalkDirection + 2);
      return;
    }
    if (ghostState === GhostState.Eaten) {
      this.setAlpha(Consts.MagicNumbers.One);
      this.SpeedMultiplier = 2;
      this._animationPrefix = "ghostEaten";
      this._ghostState = ghostState;
      this.updateAnimation();
      this.walk(this.WalkDirection + 2);
      return;
    }

    this.setAlpha(Consts.MagicNumbers.One);
    this.SpeedMultiplier = 1;
    this._animationPrefix = `ghost${this.GhostNo}`;
    this._ghostState = ghostState;
    this.updateAnimation();
  }

  static load(scene: Phaser.Scene) {
    scene.load.on("complete", () => {
      scene.anims.create({
        key: "ghost0WalkRight",
        frames: scene.anims.generateFrameNumbers(
          Consts.Resources.HackManSprites,
          {
            start: walkRightStart + 16 * ghost0,
            end: walkRightEnd + 16 * ghost0,
          }
        ),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost0WalkDown",
        frames: scene.anims.generateFrameNumbers(
          Consts.Resources.HackManSprites,
          {
            start: walkDownStart + 16 * ghost0,
            end: walkDownEnd + 16 * ghost0,
          }
        ),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost0WalkLeft",
        frames: scene.anims.generateFrameNumbers(
          Consts.Resources.HackManSprites,
          {
            start: walkLeftStart + 16 * ghost0,
            end: walkLeftEnd + 16 * ghost0,
          }
        ),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost0WalkUp",
        frames: scene.anims.generateFrameNumbers(
          Consts.Resources.HackManSprites,
          {
            start: walkUpStart + 16 * ghost0,
            end: walkUpEnd + 16 * ghost0,
          }
        ),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });

      scene.anims.create({
        key: "ghost1WalkRight",
        frames: scene.anims.generateFrameNumbers(
          Consts.Resources.HackManSprites,
          {
            start: walkRightStart + 16 * ghost1,
            end: walkRightEnd + 16 * ghost1,
          }
        ),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost1WalkDown",
        frames: scene.anims.generateFrameNumbers(
          Consts.Resources.HackManSprites,
          {
            start: walkDownStart + 16 * ghost1,
            end: walkDownEnd + 16 * ghost1,
          }
        ),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost1WalkLeft",
        frames: scene.anims.generateFrameNumbers(
          Consts.Resources.HackManSprites,
          {
            start: walkLeftStart + 16 * ghost1,
            end: walkLeftEnd + 16 * ghost1,
          }
        ),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost1WalkUp",
        frames: scene.anims.generateFrameNumbers(
          Consts.Resources.HackManSprites,
          {
            start: walkUpStart + 16 * ghost1,
            end: walkUpEnd + 16 * ghost1,
          }
        ),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });

      scene.anims.create({
        key: "ghost2WalkRight",
        frames: scene.anims.generateFrameNumbers(
          Consts.Resources.HackManSprites,
          {
            start: walkRightStart + 16 * ghost2,
            end: walkRightEnd + 16 * ghost2,
          }
        ),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost2WalkDown",
        frames: scene.anims.generateFrameNumbers(
          Consts.Resources.HackManSprites,
          {
            start: walkDownStart + 16 * ghost2,
            end: walkDownEnd + 16 * ghost2,
          }
        ),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost2WalkLeft",
        frames: scene.anims.generateFrameNumbers(
          Consts.Resources.HackManSprites,
          {
            start: walkLeftStart + 16 * ghost2,
            end: walkLeftEnd + 16 * ghost2,
          }
        ),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost2WalkUp",
        frames: scene.anims.generateFrameNumbers(
          Consts.Resources.HackManSprites,
          {
            start: walkUpStart + 16 * ghost2,
            end: walkUpEnd + 16 * ghost2,
          }
        ),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });

      scene.anims.create({
        key: "ghost3WalkRight",
        frames: scene.anims.generateFrameNumbers(
          Consts.Resources.HackManSprites,
          {
            start: walkRightStart + 16 * ghost3,
            end: walkRightEnd + 16 * ghost3,
          }
        ),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost3WalkDown",
        frames: scene.anims.generateFrameNumbers(
          Consts.Resources.HackManSprites,
          {
            start: walkDownStart + 16 * ghost3,
            end: walkDownEnd + 16 * ghost3,
          }
        ),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost3WalkLeft",
        frames: scene.anims.generateFrameNumbers(
          Consts.Resources.HackManSprites,
          {
            start: walkLeftStart + 16 * ghost3,
            end: walkLeftEnd + 16 * ghost3,
          }
        ),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghost3WalkUp",
        frames: scene.anims.generateFrameNumbers(
          Consts.Resources.HackManSprites,
          {
            start: walkUpStart + 16 * ghost3,
            end: walkUpEnd + 16 * ghost3,
          }
        ),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });

      scene.anims.create({
        key: "ghostFrightenedWalkRight",
        frames: scene.anims.generateFrameNumbers(
          Consts.Resources.HackManSprites,
          {
            start: walkRightStart + 16 * ghostFrightened,
            end: walkRightEnd + 16 * ghostFrightened,
          }
        ),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghostFrightenedWalkDown",
        frames: scene.anims.generateFrameNumbers(
          Consts.Resources.HackManSprites,
          {
            start: walkDownStart + 16 * ghostFrightened,
            end: walkDownEnd + 16 * ghostFrightened,
          }
        ),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghostFrightenedWalkLeft",
        frames: scene.anims.generateFrameNumbers(
          Consts.Resources.HackManSprites,
          {
            start: walkLeftStart + 16 * ghostFrightened,
            end: walkLeftEnd + 16 * ghostFrightened,
          }
        ),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghostFrightenedWalkUp",
        frames: scene.anims.generateFrameNumbers(
          Consts.Resources.HackManSprites,
          {
            start: walkUpStart + 16 * ghostFrightened,
            end: walkUpEnd + 16 * ghostFrightened,
          }
        ),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });

      scene.anims.create({
        key: "ghostEatenWalkRight",
        frames: scene.anims.generateFrameNumbers(
          Consts.Resources.HackManSprites,
          {
            start: walkRightStart + 16 * ghostEaten,
            end: walkRightEnd + 16 * ghostEaten,
          }
        ),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghostEatenWalkDown",
        frames: scene.anims.generateFrameNumbers(
          Consts.Resources.HackManSprites,
          {
            start: walkDownStart + 16 * ghostEaten,
            end: walkDownEnd + 16 * ghostEaten,
          }
        ),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghostEatenWalkLeft",
        frames: scene.anims.generateFrameNumbers(
          Consts.Resources.HackManSprites,
          {
            start: walkLeftStart + 16 * ghostEaten,
            end: walkLeftEnd + 16 * ghostEaten,
          }
        ),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
      scene.anims.create({
        key: "ghostEatenWalkUp",
        frames: scene.anims.generateFrameNumbers(
          Consts.Resources.HackManSprites,
          {
            start: walkUpStart + 16 * ghostEaten,
            end: walkUpEnd + 16 * ghostEaten,
          }
        ),
        frameRate: Consts.Game.GhostFrameRate,
        repeat: -1,
      });
    });
  }

  constructor(
    scene: Phaser.Scene,
    mapLayer: Phaser.Tilemaps.StaticTilemapLayer,
    x: number,
    y: number,
    ghostNo: number,
    walkDirection: number,
    ghostState?: GhostState
  ) {
    super(scene, x, y, Consts.Resources.HackManSprites, defaultFrame[ghostNo]);

    this._mapLayer = mapLayer;
    this._shadowSprite = new Phaser.Physics.Arcade.Sprite(
      scene,
      x,
      y,
      Consts.Resources.HackManSprites,
      defaultFrame[ghostNo]
    )
      .setDepth(4)
      .setTint(0)
      .setAlpha(Consts.MagicNumbers.Quarter);

    this._ghostNo = ghostNo;
    this._walkDirection = walkDirection;
    this._faceDirection = walkDirection;

    this.GhostNo = ghostNo;
    this.WalkDirection = walkDirection;
    this.FaceDirection = walkDirection;

    if (ghostState === undefined) this.GhostState = GhostState.Scatter;
    else this.GhostState = ghostState;
  }

  add(scene: Phaser.Scene): Ghost {
    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.add.existing(this._shadowSprite);

    return this;
  }

  updateAnimation(): Ghost {
    this.anims.play(
      `${this._animationPrefix}Walk${
        ghostWalkDirectionValues[this.FaceDirection].direction
      }`,
      true,
      0
    );

    return this;
  }

  hitWall(tile: Phaser.GameObjects.GameObject) {
    this._hitWall = true;
    return;
  }

  walk(walkDirection: GhostWalkDirection): Ghost {
    if (!this.active) return;
    if (this.WalkDirection === walkDirection) return;

    this.WalkDirection = walkDirection;

    this.setVelocity(
      ghostWalkDirectionValues[this.WalkDirection].velocity.x *
        this.scaleX *
        this.SpeedMultiplier,
      ghostWalkDirectionValues[this.WalkDirection].velocity.y *
        this.scaleY *
        this.SpeedMultiplier
    );
    this.face(walkDirection);

    return this;
  }

  face(faceDirection: GhostWalkDirection): Ghost {
    if (!this.active) return;
    if (this.FaceDirection === faceDirection) return;

    this.FaceDirection = faceDirection;
    this.updateAnimation();

    return this;
  }

  kill() {
    this.anims.stop();
    this._shadowSprite.destroy();
  }

  update() {
    this.setDepth(this.x + this.y * window.innerWidth);

    this._shadowSprite.scale = this.scale;
    this._shadowSprite.x = this.x + Consts.Game.ShadowOffset * this.scale;
    this._shadowSprite.y = this.y + Consts.Game.ShadowOffset * this.scale;
    this._shadowSprite.frame = this.frame;

    let x = this.x;
    let y = this.y;
    let w = (this.displayWidth >> 1) - 8;
    let h = (this.displayHeight >> 1) - 8;

    let tile = this._mapLayer.getTileAtWorldXY(x, y, true);

    if (
      this.WalkDirection === GhostWalkDirection.Up ||
      this.WalkDirection === GhostWalkDirection.Down
    ) {
      this.x =
        ((tile.width >> 1) + tile.x * tile.width) * this._mapLayer.scaleX;
    }

    if (
      this.WalkDirection === GhostWalkDirection.Left ||
      this.WalkDirection === GhostWalkDirection.Right
    ) {
      this.y =
        ((tile.height >> 1) + tile.y * tile.height) * this._mapLayer.scaleY;
    }
    let tile1 = this._mapLayer.getTileAtWorldXY(x - w, y - h, true);
    let tile2 = this._mapLayer.getTileAtWorldXY(x + w, y - h, true);
    let tile3 = this._mapLayer.getTileAtWorldXY(x + w, y + h, true);
    let tile4 = this._mapLayer.getTileAtWorldXY(x - w, y + h, true);

    let moveLeft =
      this._mapLayer.getTileAt(tile.x - 1, tile.y, true).index === -1;
    let moveRight =
      this._mapLayer.getTileAt(tile.x + 1, tile.y, true).index === -1;
    let moveUp =
      this._mapLayer.getTileAt(tile.x, tile.y - 1, true).index === -1;
    let moveDown =
      this._mapLayer.getTileAt(tile.x, tile.y + 1, true).index === -1;

    if (this._hitWall) {
      this._hitWall = false;
      if (Math.random() > Consts.MagicNumbers.Quarter && moveLeft)
        this.walk(GhostWalkDirection.Left);
      else if (Math.random() > Consts.MagicNumbers.Quarter && moveRight)
        this.walk(GhostWalkDirection.Right);
      else if (Math.random() > Consts.MagicNumbers.Quarter && moveUp)
        this.walk(GhostWalkDirection.Up);
      else if (Math.random() > Consts.MagicNumbers.Quarter && moveDown)
        this.walk(GhostWalkDirection.Down);
      else this.walk(this.WalkDirection + Phaser.Math.Between(1, 3));

      return;
    }

    if (tile1.x === tile2.x && tile2.x === tile3.x && tile3.x === tile4.x) {
      if (tile1.y === tile2.y && tile2.y === tile3.y && tile3.y === tile4.y) {
        if (tile1.x != this._previousX || tile1.y != this._previousY) {
          let x = tile1.x;
          let y = tile1.y;
          this._previousX = x;
          this._previousY = y;

          if (
            this.WalkDirection == GhostWalkDirection.Up ||
            this.WalkDirection == GhostWalkDirection.Down
          ) {
            if (this._mapLayer.getTileAt(x - 1, y, true).index === -1) {
              if (Math.random() >= Consts.MagicNumbers.Half)
                this.walk(GhostWalkDirection.Left);
            } else {
              if (this._mapLayer.getTileAt(x + 1, y, true).index === -1) {
                if (Math.random() >= Consts.MagicNumbers.Half)
                  this.walk(GhostWalkDirection.Right);
              }
            }
          } else {
            if (
              this.WalkDirection == GhostWalkDirection.Left ||
              this.WalkDirection == GhostWalkDirection.Right
            ) {
              if (this._mapLayer.getTileAt(x, y - 1, true).index === -1) {
                if (Math.random() >= Consts.MagicNumbers.Half)
                  this.walk(GhostWalkDirection.Up);
              } else {
                if (this._mapLayer.getTileAt(x, y + 1, true).index === -1) {
                  if (Math.random() >= Consts.MagicNumbers.Half)
                    this.walk(GhostWalkDirection.Down);
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
