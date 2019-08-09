import 'phaser';

export class Sprite extends Phaser.Physics.Arcade.Sprite {
  private _shadow: boolean;
  private _shadowSprite: Phaser.GameObjects.Sprite;

  private _colliderType: Sprite.ColliderType;
  private _colliderGroup: Phaser.Physics.Arcade.Group;
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

  public get colliderGroup(): Phaser.Physics.Arcade.Group {
    return this._colliderGroup;
  }

  public get canMoveLeft(): boolean {
    return this._colliders[0].canMove;
  }

  public get canMoveRight(): boolean {
    return this._colliders[1].canMove;
  }

  public get canMoveUp(): boolean {
    return this._colliders[2].canMove;
  }

  public get canMoveDown(): boolean {
    return this._colliders[3].canMove;
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
    // console.log(scene, x, y, texture, frame, shadow, colliderType);

    this.shadow = shadow;
    this._colliderType = colliderType;

    if (shadow) {
      this._shadowSprite = new Phaser.GameObjects.Sprite(scene, x, y, texture, frame)
        .setDepth(4)
        .setTint(0)
        .setAlpha(1); //Consts.MagicNumbers.Quarter);
    }

    switch (colliderType) {
      case Sprite.ColliderType.LeftRight: {
        this._colliderGroup = scene.physics.add.group({
          immovable: true,
          bounceX: 0,
          bounceY: 0,
        });
        this._collideLeftSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideRightSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._colliderGroup.add(this._collideLeftSprite);
        this._colliderGroup.add(this._collideRightSprite);
        break;
      }
      case Sprite.ColliderType.UpDown: {
        this._colliderGroup = scene.physics.add.group({
          immovable: true,
          bounceX: 0,
          bounceY: 0,
        });
        this._collideUpSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideDownSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._colliderGroup.add(this._collideUpSprite);
        this._colliderGroup.add(this._collideDownSprite);
        break;
      }
      case Sprite.ColliderType.LeftRightUpDown: {
        this._colliderGroup = scene.physics.add.group({
          immovable: true,
          bounceX: 0,
          bounceY: 0,
        });
        this._collideLeftSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideRightSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideUpSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideDownSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._colliderGroup.add(this._collideLeftSprite);
        this._colliderGroup.add(this._collideRightSprite);
        this._colliderGroup.add(this._collideUpSprite);
        this._colliderGroup.add(this._collideDownSprite);
        break;
      }
      case Sprite.ColliderType.All: {
        this._colliderGroup = scene.physics.add.group({
          immovable: true,
          bounceX: 0,
          bounceY: 0,
        });
        this._collideLeftSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideRightSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideUpSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideDownSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideLeftUpSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideRightUpSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideLeftDownSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._collideRightDownSprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, '');
        this._colliderGroup.add(this._collideLeftSprite);
        this._colliderGroup.add(this._collideRightSprite);
        this._colliderGroup.add(this._collideUpSprite);
        this._colliderGroup.add(this._collideDownSprite);
        this._colliderGroup.add(this._collideLeftUpSprite);
        this._colliderGroup.add(this._collideRightUpSprite);
        this._colliderGroup.add(this._collideLeftDownSprite);
        this._colliderGroup.add(this._collideRightDownSprite);
        break;
      }
    }

    this._colliders = [
      { colliderSprite: this._collideLeftSprite, offsetX: -1, offsetY: 0, canMove: false, canMoveNext: false },
      { colliderSprite: this._collideRightSprite, offsetX: +1, offsetY: 0, canMove: false, canMoveNext: false },
      { colliderSprite: this._collideUpSprite, offsetX: 0, offsetY: -1, canMove: false, canMoveNext: false },
      { colliderSprite: this._collideDownSprite, offsetX: 0, offsetY: +1, canMove: false, canMoveNext: false },
      { colliderSprite: this._collideLeftUpSprite, offsetX: -1, offsetY: -1, canMove: false, canMoveNext: false },
      { colliderSprite: this._collideRightUpSprite, offsetX: +1, offsetY: -1, canMove: false, canMoveNext: false },
      { colliderSprite: this._collideLeftDownSprite, offsetX: -1, offsetY: +1, canMove: false, canMoveNext: false },
      { colliderSprite: this._collideRightDownSprite, offsetX: +1, offsetY: +1, canMove: false, canMoveNext: false },
    ];

    if (this._collideLeftSprite) this._collideLeftSprite.setData('collider', this._colliders[0]);
    if (this._collideRightSprite) this._collideRightSprite.setData('collider', this._colliders[1]);
    if (this._collideUpSprite) this._collideUpSprite.setData('collider', this._colliders[2]);
    if (this._collideDownSprite) this._collideDownSprite.setData('collider', this._colliders[3]);
    if (this._collideLeftUpSprite) this._collideLeftUpSprite.setData('collider', this._colliders[4]);
    if (this._collideRightUpSprite) this._collideRightUpSprite.setData('collider', this._colliders[5]);
    if (this._collideLeftDownSprite) this._collideLeftDownSprite.setData('collider', this._colliders[6]);
    if (this._collideRightDownSprite) this._collideRightDownSprite.setData('collider', this._colliders[7]);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    if (this._shadowSprite) {
      scene.add.existing(this._shadowSprite);
    }

    this.setCircle((this.width + this.height) >> 2, 0, 0);

    this._colliders.map(collider => {
      if (collider.colliderSprite) {
        scene.physics.add.existing(collider.colliderSprite);
      }
    }, this);
  }

  updateShadowSprite() {
    if (this._shadowSprite) {
      this._shadowSprite.scale = this.scale;
      this._shadowSprite.alpha = this.alpha * Consts.MagicNumbers.Quarter;
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
          .setX(this.x)
          .setY(this.y)
          .setScale(this.scale)
          .setCircle(radius)
          .setOffset(
            this.body.offset.x + collider.offsetX * this.width + (this.width >> 1),
            this.body.offset.y + collider.offsetY * this.height + (this.height >> 1)
          );

        if (collider.canMove) {
          collider.colliderSprite.setDebug(true, false, Consts.Colours.Green);
        } else {
          if (collider.canMoveNext) {
            collider.canMove = true;
            collider.colliderSprite.setDebug(true, false, Consts.Colours.Green);
          } else {
            collider.colliderSprite.setDebug(true, false, Consts.Colours.Red);
            collider.canMoveNext = true;
          }
        }
      }
    }, this);
  }

  colliderCallback(colliderSprite: Phaser.Physics.Arcade.Sprite, object2: any) {
    if (object2.index !== -1) {
      colliderSprite.data.values.collider.canMove = false;
      colliderSprite.data.values.collider.canMoveNext = false;
    }
  }

  update() {
    this.updateShadowSprite();
    this.updateColliderSprites();
  }

  destroy() {
    // console.log('Sprite.destroy() : ', this._shadowSprite);
    this._shadowSprite.visible = false;
    this._shadowSprite.destroy();
    this._shadowSprite = undefined;

    this._colliders.map(collider => {
      if (collider.colliderSprite) {
        collider.colliderSprite.destroy();
        collider.colliderSprite = undefined;
      }
    }, this);
    super.destroy();
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
    canMove: boolean;
    canMoveNext: boolean;
  }
}
