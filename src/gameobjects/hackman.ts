import "phaser";
import { runInThisContext } from "vm";

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
  { direction: "Right", velocity: { x: Consts.Game.HackManSpeed, y: 0 } },
  { direction: "Down", velocity: { x: 0, y: Consts.Game.HackManSpeed } },
  { direction: "Left", velocity: { x: -Consts.Game.HackManSpeed, y: 0 } },
  { direction: "Up", velocity: { x: 0, y: -Consts.Game.HackManSpeed } },
];

export class HackMan extends Phaser.Physics.Arcade.Sprite {
  private _scene: Phaser.Scene;
  private _mapLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private _walkDirection: HackManWalkDirection;
  private _faceDirection: HackManWalkDirection;
  private _speedMultiplier: number;
  private _jumpHeight: number;
  private _isJumping: boolean;
  private _collideGroup: Phaser.Physics.Arcade.Group;
  private _collideLeftSprite: Phaser.Physics.Arcade.Sprite;
  private _collideRightSprite: Phaser.Physics.Arcade.Sprite;
  private _collideUpSprite: Phaser.Physics.Arcade.Sprite;
  private _collideDownSprite: Phaser.Physics.Arcade.Sprite;
  private _jumpSprite: Phaser.Physics.Arcade.Sprite;
  private _shadowSprite: Phaser.Physics.Arcade.Sprite;
  private _hitWall: boolean;
  private _canTurnCount: number;

  static get MaxDirections(): number {
    return 3;
  }

  get JumpHeight() {
    return this._jumpHeight;
  }

  set JumpHeight(height: number) {
    this._jumpHeight = height;
  }

  get OnFloor() {
    return this._jumpHeight < Consts.Game.HackManOnFloorHeight;
  }

  get isJumping() {
    return this._isJumping;
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
    mapLayer: Phaser.Tilemaps.StaticTilemapLayer,
    x: number,
    y: number
  ) {
    super(scene, x, y, Consts.Resources.HackManSprites, defaultFrame);

    this._scene = scene;
    this._mapLayer = mapLayer;
    this._speedMultiplier = 1;
    this._canTurnCount = 0;

    this._collideLeftSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, "");
    this._collideRightSprite = new Phaser.Physics.Arcade.Sprite(
      scene,
      x,
      y,
      ""
    );
    this._collideUpSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, "");
    this._collideDownSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, "");

    this._jumpHeight = 0;
    this._jumpSprite = new Phaser.Physics.Arcade.Sprite(
      scene,
      x,
      y,
      Consts.Resources.HackManSprites,
      defaultFrame
    ).setVisible(false);

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
      frameRate: Consts.Game.HackManFrameRate,
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
      frameRate: Consts.Game.HackManFrameRate,
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
      frameRate: Consts.Game.HackManFrameRate,
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
      frameRate: Consts.Game.HackManFrameRate,
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
      frameRate: Consts.Game.HackManFrameRate,
      yoyo: true,
      repeat: 0,
    });

    this._collideGroup = scene.physics.add.group({
      immovable: true,
      bounceX: 0,
      bounceY: 0,
    });

    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.add.existing(this._shadowSprite);
    scene.add.existing(this._jumpSprite);

    scene.physics.add.existing(this._collideLeftSprite);
    scene.physics.add.existing(this._collideRightSprite);
    scene.physics.add.existing(this._collideUpSprite);
    scene.physics.add.existing(this._collideDownSprite);

    this._collideGroup.addMultiple([
      this._collideLeftSprite,
      this._collideRightSprite,
      this._collideUpSprite,
      this._collideDownSprite,
    ]);

    this.setOffset(2, 2)
      .setBounce(0, 0)
      .setCircle(((this.width + this.height) >> 2) - 2)
      //.setSize(this.width - 2, this.height - 2)
      .setCollideWorldBounds(true, 1, 1);

    this._collideLeftSprite
      .setOffset(10, 10)
      .setCircle(((this.width + this.height) >> 2) - 2)
      .setData("blocked", false);
    this._collideRightSprite
      .setOffset(10, 10)
      .setCircle(((this.width + this.height) >> 2) - 2)
      .setData("blocked", false);
    this._collideUpSprite
      .setOffset(10, 10)
      .setCircle(((this.width + this.height) >> 2) - 2)
      .setData("blocked", false);
    this._collideDownSprite
      .setOffset(10, 10)
      .setCircle(((this.width + this.height) >> 2) - 2)
      .setData("blocked", false);

    scene.physics.add.overlap(
      this._collideGroup,
      this._mapLayer,
      (colliderSprite: Phaser.Physics.Arcade.Sprite, tile: any) => {
        if (tile.index != -1) {
          colliderSprite.body.debugBodyColor = Consts.Colours.Red;
          colliderSprite.setData("blocked", true);
        }
      },
      null,
      this
    );
  }

  speedUp(time: number) {
    this._speedMultiplier = Consts.Game.HackManSpeedUpMultiplier;
    this.setVelocity(
      hackManWalkDirectionValues[this.WalkDirection].velocity.x *
        this.scaleX *
        this._speedMultiplier,
      hackManWalkDirectionValues[this.WalkDirection].velocity.y *
        this.scaleY *
        this._speedMultiplier
    );
    this.anims.msPerFrame =
      Consts.Times.MilliSecondsInSecond /
      (Consts.Game.HackManFrameRate * this._speedMultiplier);

    this.scene.time.delayedCall(
      time,
      () => {
        this._speedMultiplier = 1;
        this.setVelocity(
          hackManWalkDirectionValues[this.WalkDirection].velocity.x *
            this.scaleX *
            this._speedMultiplier,
          hackManWalkDirectionValues[this.WalkDirection].velocity.y *
            this.scaleY *
            this._speedMultiplier
        );
        this.anims.msPerFrame =
          Consts.Times.MilliSecondsInSecond /
          (Consts.Game.HackManFrameRate * this._speedMultiplier);
      },
      [],
      this
    );
  }

  jump(height?: number) {
    if (this._isJumping) return;

    this._isJumping = true;
    this.scene.tweens.add({
      targets: this,
      JumpHeight: height
        ? height * this.scale
        : Consts.Game.HackManJumpHeight * this.scale,
      duration: 500,
      ease: "Sine.easeOut",
      yoyo: true,
      loop: 0,
      onComplete: () => {
        this.scene.tweens.add({
          targets: this,
          JumpHeight: height
            ? (height / 4) * this.scale
            : (Consts.Game.HackManJumpHeight / 4) * this.scale,
          duration: 250,
          ease: "Sine.easeOut",
          yoyo: true,
          loop: 0,
          onComplete: () => {
            this._isJumping = false;
          },
        });
      },
    });
  }

  hitWall(tile: Phaser.GameObjects.GameObject) {
    console.log(`HackMan.hitWall(tile=${tile})`);
    this._hitWall = true;
    return;
  }

  walk(walkDirection: HackManWalkDirection) {
    if (this.WalkDirection === walkDirection) return;

    if (this._canTurnCount > 0) {
      this._canTurnCount--;
      return;
    }

    this._canTurnCount = 4;
    this.WalkDirection = walkDirection;

    this.setVelocity(
      hackManWalkDirectionValues[this.WalkDirection].velocity.x *
        this.scaleX *
        this._speedMultiplier,
      hackManWalkDirectionValues[this.WalkDirection].velocity.y *
        this.scaleY *
        this._speedMultiplier
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
    this.anims.msPerFrame =
      Consts.Times.MilliSecondsInSecond /
      (Consts.Game.HackManFrameRate * this._speedMultiplier);
  }

  update() {
    this.depth = this.x + this.y * window.innerWidth;

    let tile = this._mapLayer.getTileAtWorldXY(this.x, this.y, true);

    if (
      this.WalkDirection === HackManWalkDirection.Up ||
      this.WalkDirection === HackManWalkDirection.Down
    ) {
      this.x =
        ((tile.width >> 1) + tile.x * tile.width) * this._mapLayer.scaleX;
    }

    if (
      this.WalkDirection === HackManWalkDirection.Left ||
      this.WalkDirection === HackManWalkDirection.Right
    ) {
      this.y =
        ((tile.height >> 1) + tile.y * tile.height) * this._mapLayer.scaleY;
    }

    if (this._jumpHeight > 0) {
      this._jumpSprite.scale = this.scale;
      this._jumpSprite.x = this.x;
      this._jumpSprite.y = this.y - this._jumpHeight;
      this._jumpSprite.frame = this.frame;
      this._jumpSprite.depth = this.depth;
      this.visible = false;
      this._jumpSprite.visible = true;
      this._shadowSprite.scale = this.scale * (1 - this._jumpHeight / 128);
      this._shadowSprite.setAlpha(
        (1 - this._jumpHeight / 128) * Consts.MagicNumbers.Quarter
      );
    } else {
      this.visible = true;
      this._jumpSprite.visible = false;
      this._shadowSprite.scale = this.scale;
      this._shadowSprite.setAlpha(Consts.MagicNumbers.Quarter);
    }

    this._shadowSprite.x = this.x + Consts.Game.ShadowOffset * this.scale;
    this._shadowSprite.y = this.y + Consts.Game.ShadowOffset * this.scale;
    this._shadowSprite.frame = this.frame;

    this._collideLeftSprite.scale = this._collideRightSprite.scale = this._collideUpSprite.scale = this._collideDownSprite.scale = this.scale;

    this._collideLeftSprite.x = this.x - this.displayWidth;
    this._collideRightSprite.x = this.x + this.displayWidth;
    this._collideUpSprite.x = this.x;
    this._collideDownSprite.x = this.x;

    this._collideLeftSprite.y = this.y;
    this._collideRightSprite.y = this.y;
    this._collideUpSprite.y = this.y - this.displayHeight;
    this._collideDownSprite.y = this.y + this.displayHeight;

    // let x = this.x;
    // let y = this.y;
    // let w = this.displayWidth >> 1;
    // let h = this.displayHeight >> 1;

    // let tileLeft = this._mapLayer.getTileAtWorldXY(this.x - w, this.y - h, true);
    // let tileRight = this._mapLayer.getTileAtWorldXY(this.x + w, this.y - h, true);
    // let tileUp = this._mapLayer.getTileAtWorldXY(this.x + w, this.y + h, true);
    // let tileDown = this._mapLayer.getTileAtWorldXY(this.x - w, this.y + h, true);

    let moveLeft = !this._collideLeftSprite.data.values.blocked;
    let moveRight = !this._collideRightSprite.data.values.blocked;
    let moveUp = !this._collideUpSprite.data.values.blocked;
    let moveDown = !this._collideDownSprite.data.values.blocked;

    if (moveLeft) {
      this._collideLeftSprite.body.debugBodyColor = Consts.Colours.Green;
    }
    if (moveRight) {
      this._collideRightSprite.body.debugBodyColor = Consts.Colours.Green;
    }
    if (moveUp) {
      this._collideUpSprite.body.debugBodyColor = Consts.Colours.Green;
    }
    if (moveDown) {
      this._collideDownSprite.body.debugBodyColor = Consts.Colours.Green;
    }

    this._collideLeftSprite.data.values.blocked = false;
    this._collideRightSprite.data.values.blocked = false;
    this._collideUpSprite.data.values.blocked = false;
    this._collideDownSprite.data.values.blocked = false;

    if (this._hitWall) {
      console.log(`HackMan.update() : _hitWall === true`);
      this._hitWall = false;
      this._canTurnCount = 0;
      if (Math.random() > Consts.MagicNumbers.Quarter && moveLeft)
        this.walk(HackManWalkDirection.Left);
      else if (Math.random() > Consts.MagicNumbers.Quarter && moveRight)
        this.walk(HackManWalkDirection.Right);
      else if (Math.random() > Consts.MagicNumbers.Quarter && moveUp)
        this.walk(HackManWalkDirection.Up);
      else if (Math.random() > Consts.MagicNumbers.Quarter && moveDown)
        this.walk(HackManWalkDirection.Down);
      else this.walk(this.WalkDirection + 2);
    }

    // if (tile1.x === tile2.x && tile2.x === tile3.x && tile3.x === tile4.x) {
    //   if (tile1.y === tile2.y && tile2.y === tile3.y && tile3.y === tile4.y) {
    //     if (tile1.x != this._previousX || tile1.y != this._previousY) {
    //       let x = tile1.x;
    //       let y = tile1.y;
    //       this._previousX = x;
    //       this._previousY = y;

    if (
      this.WalkDirection == HackManWalkDirection.Up ||
      this.WalkDirection == HackManWalkDirection.Down
    ) {
      if (moveLeft) {
        if (Math.random() >= Consts.MagicNumbers.Half) {
          //this.y =
          //  ((tile.height >> 1) + tile.y * tile.height) * this._mapLayer.scaleY;
          this.walk(HackManWalkDirection.Left);
        }
      } else {
        if (moveRight) {
          if (Math.random() >= Consts.MagicNumbers.Quarter) {
            //this.y =
            //  ((tile.height >> 1) + tile.y * tile.height) * this._mapLayer.scaleY;
            this.walk(HackManWalkDirection.Right);
          }
        }
      }
    } else {
      if (
        this.WalkDirection == HackManWalkDirection.Left ||
        this.WalkDirection == HackManWalkDirection.Right
      ) {
        if (moveUp) {
          if (Math.random() >= Consts.MagicNumbers.Half) {
            //this.x =
            //  ((tile.width >> 1) + tile.x * tile.width) * this._mapLayer.scaleX;
            this.walk(HackManWalkDirection.Up);
          }
        } else {
          if (moveDown) {
            if (Math.random() >= Consts.MagicNumbers.Quarter) {
              //this.x =
              //  ((tile.width >> 1) + tile.x * tile.width) * this._mapLayer.scaleX;
              this.walk(HackManWalkDirection.Down);
            }
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
    //     }
    //   }
    // }
  }
}
