import 'phaser';

export class Sprite extends Phaser.Physics.Arcade.Sprite {
  private _shadow: boolean;
  private _shadowSprite: Phaser.GameObjects.Sprite;

  private _colliderType: Sprite.ColliderType;
  private _collideLeftSprite: Phaser.Physics.Arcade.Sprite;
  private _collideRightSprite: Phaser.Physics.Arcade.Sprite;
  private _collideUpSprite: Phaser.Physics.Arcade.Sprite;
  private _collideDownSprite: Phaser.Physics.Arcade.Sprite;
  private _collideLeftUpSprite: Phaser.Physics.Arcade.Sprite;
  private _collideRightUpSprite: Phaser.Physics.Arcade.Sprite;
  private _collideLeftDownSprite: Phaser.Physics.Arcade.Sprite;
  private _collideRightDownSprite: Phaser.Physics.Arcade.Sprite;
  private _colliders: Sprite.Collider[];

  public get shadow(): boolean {
    return this._shadow;
  }

  public set shadow(value: boolean) {
    this._shadow = value;

    if (this._shadowSprite) this._shadowSprite.visible = value;
  }

  public get shadowSprite(): Phaser.GameObjects.Sprite {
    return this._shadowSprite;
  }

  public get colliderType(): Sprite.ColliderType {
    return this._colliderType;
  }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame: string | number = 0,
    shadow: boolean = false,
    colliderType: Sprite.ColliderType = Sprite.ColliderType.None
  ) {
    super(scene, x, y, texture, frame);
    console.log(scene, x, y, texture, frame, shadow, colliderType);

    this.shadow = shadow;
    this._colliderType = colliderType;

    if (shadow) {
      this._shadowSprite = new Phaser.GameObjects.Sprite(scene, x, y, texture, frame)
        .setDepth(4)
        .setTint(0)
        .setAlpha(Consts.MagicNumbers.Quarter);
    }

    switch (colliderType) {
      case Sprite.ColliderType.LeftRight: {
        this._collideLeftSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideRightSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        break;
      }
      case Sprite.ColliderType.UpDown: {
        this._collideUpSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideDownSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        break;
      }
      case Sprite.ColliderType.LeftRightUpDown: {
        this._collideLeftSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideRightSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideUpSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideDownSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        break;
      }
      case Sprite.ColliderType.All: {
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

    this._colliders = [
      { colliderSprite: this._collideLeftSprite, offsetX: -1, offsetY: 0 },
      { colliderSprite: this._collideRightSprite, offsetX: +1, offsetY: 0 },
      { colliderSprite: this._collideUpSprite, offsetX: 0, offsetY: -1 },
      { colliderSprite: this._collideDownSprite, offsetX: 0, offsetY: +1 },
      { colliderSprite: this._collideLeftUpSprite, offsetX: -1, offsetY: -1 },
      { colliderSprite: this._collideRightUpSprite, offsetX: +1, offsetY: -1 },
      { colliderSprite: this._collideLeftDownSprite, offsetX: -1, offsetY: +1 },
      { colliderSprite: this._collideRightDownSprite, offsetX: +1, offsetY: +1 },
    ];

    scene.add.existing(this);
    scene.physics.add.existing(this);

    if (this._shadowSprite) {
      scene.add.existing(this._shadowSprite);
    }

    this.setCircle(((this.width + this.height) >> 2) - 1, 1, 1);

    this._colliders.map(collider => {
      if (collider.colliderSprite) {
        this.scene.physics.add.existing(collider.colliderSprite);
      }
    }, this);
  }

  updateShadowSprite() {
    if (this._shadowSprite) {
      this._shadowSprite.scale = this.scale;
      this._shadowSprite.x = this.x + Consts.Game.ShadowOffset * this.scale;
      this._shadowSprite.y = this.y + Consts.Game.ShadowOffset * this.scale;
      this._shadowSprite.frame = this.frame;
    }
  }

  updateColliderSprites() {
    let radius: number;

    if (this.body) {
      radius = this.body.radius;
    } else {
      return;
    }

    this._colliders.map(collider => {
      if (collider.colliderSprite) {
        collider.colliderSprite
          .setScale(this.scale)
          .setCircle(radius)
          .setOffset(
            this.body.offset.x + collider.offsetX * this.width + (this.width >> 1),
            this.body.offset.y + collider.offsetY * this.height + (this.height >> 1)
          )
          .setDebug(true, true, Consts.Colours.White);
      }
    }, this);
  }

  update() {
    this.updateShadowSprite();
    this.updateColliderSprites();
  }

  destroy() {
    super.destroy();
    this._shadowSprite.destroy();

    this._colliders.map(collider => {
      if (collider.colliderSprite) {
        collider.colliderSprite.destroy();
        collider.colliderSprite = undefined;
      }
    }, this);
  }
}

export namespace Sprite {
  export enum ColliderType {
    None,
    LeftRight,
    UpDown,
    LeftRightUpDown,
    All,
  }

  export interface Collider {
    colliderSprite: Phaser.Physics.Arcade.Sprite;
    offsetX: number;
    offsetY: number;
  }
}
