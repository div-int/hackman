import 'phaser';
import { Scene } from 'phaser';

enum ColliderType {
  None,
  LeftRight,
  UpDown,
  LeftRightUpDown,
  All,
}

export class Sprite extends Phaser.Physics.Arcade.Sprite {
  private _scene: Phaser.Scene;
  private _startX: number;
  private _startY: number;
  private _frame: number | string;

  private _shadow: boolean;
  private _shadowAlpha: number;
  private _shadowSprite: Phaser.Physics.Arcade.Sprite;

  private _colliderType: ColliderType;
  private _collideLeftSprite: Phaser.Physics.Arcade.Sprite;
  private _collideRightSprite: Phaser.Physics.Arcade.Sprite;
  private _collideUpSprite: Phaser.Physics.Arcade.Sprite;
  private _collideDownSprite: Phaser.Physics.Arcade.Sprite;
  private _collideLeftUpSprite: Phaser.Physics.Arcade.Sprite;
  private _collideRightUpSprite: Phaser.Physics.Arcade.Sprite;
  private _collideLeftDownSprite: Phaser.Physics.Arcade.Sprite;
  private _collideRightDownSprite: Phaser.Physics.Arcade.Sprite;

  static ColliderType = ColliderType;

  public get scene(): Phaser.Scene {
    return this._scene;
  }

  public get startX(): number {
    return this._startX;
  }

  public get startY(): number {
    return this._startY;
  }

  public get shadow(): boolean {
    return this._shadow;
  }

  public set shadow(value: boolean) {
    this._shadow = value;
  }

  public get shadowAlpha(): number {
    return this._shadowAlpha;
  }

  public set shadowAlpha(value: number) {
    this._shadowAlpha = value;
  }

  public get shadowSprite(): Phaser.Physics.Arcade.Sprite {
    return this._shadowSprite;
  }

  public get colliderType(): ColliderType {
    return this._colliderType;
  }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number,
    shadow: boolean = false,
    colliderType: ColliderType = ColliderType.None
  ) {
    super(scene, x, y, texture, frame ? frame : 0);

    this._scene = scene;
    this._startX = x;
    this._startY = y;
    this._shadow = shadow;
    this._colliderType = colliderType;

    switch (colliderType) {
      case ColliderType.LeftRight: {
        this._collideLeftSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideRightSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        break;
      }
      case ColliderType.UpDown: {
        this._collideUpSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideDownSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        break;
      }
      case ColliderType.LeftRightUpDown: {
        this._collideLeftSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideRightSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideUpSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideDownSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        break;
      }
      case ColliderType.All: {
        this._collideLeftSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideRightSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideUpSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideDownSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideLeftUpSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideRightUpSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideLeftDownSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideRightDownSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        break;
      }
    }

    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  destroy() {}

  update() {}
}
