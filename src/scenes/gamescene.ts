import 'phaser';
import '../consts/consts';
import { UIScene } from './uiscene';
import { GameState } from '../gameobjects/gamestate';
import { HackMan, HackManWalkDirection, HackManState } from '../gameobjects/hackman';
import { Ghost, GhostState, GhostWalkDirection } from '../gameobjects/ghost';
import { config } from '../config/config';
import { hackManGame } from '../index';

// const hackmanSprites = "hackmanSprites";

let maxsprite: number;
let scale: number;

export class GameScene extends Phaser.Scene {
  private _uiscene: UIScene;

  private _hackman: HackMan;
  private _hackmanGroup: Phaser.Physics.Arcade.Group;
  private _ghostGroup: Phaser.Physics.Arcade.Group;
  private _maskShape: Phaser.GameObjects.Graphics;
  private _mask: Phaser.Display.Masks.GeometryMask;
  private _attractLevel: Phaser.Tilemaps.Tilemap;
  private _backgroundImage: Phaser.GameObjects.Image;
  private _mapLayerBackground: Phaser.Tilemaps.StaticTilemapLayer;
  private _mapLayerBackgroundMask: Phaser.Tilemaps.DynamicTilemapLayer;
  private _mapLayerShadows: Phaser.Tilemaps.DynamicTilemapLayer;
  private _mapLayerPills: Phaser.Tilemaps.DynamicTilemapLayer;
  private _mapLayerWalls: Phaser.Tilemaps.StaticTilemapLayer;

  get UIScene(): UIScene {
    if (!this._uiscene) return (this._uiscene = <UIScene>this.scene.get(Consts.Scenes.UIScene));
    else return this._uiscene;
  }

  async FrightenGhosts(timeToFrighten: number) {
    this._ghostGroup.children.each(async (ghost: Ghost) => {
      ghost.GhostState = GhostState.Frightened;
    }, this);

    this.time.delayedCall(
      timeToFrighten,
      () => {
        this._ghostGroup.children.each((ghost: Ghost) => {
          ghost.GhostState = GhostState.Chase;
        });
      },
      [],
      this
    );
  }

  constructor() {
    super(Consts.Scenes.GameScene);
    console.log(`GameScene::constructor() : ${hackManGame.version}`);
  }

  init() {
    if (this.sys.game.device.os.desktop) {
      scale = Consts.Game.ScaleDesktop;
      maxsprite = Consts.Game.MaxSpriteDesktop;
    } else {
      scale = Consts.Game.ScaleMobile;
      maxsprite = Consts.Game.MaxSpriteMobile;
    }

    hackManGame.gameState.reset();
  }

  preload() {
    console.log(`GameScene::preload() : ${hackManGame.version}`);

    Ghost.load(this);

    this.load.tilemapTiledJSON('attractLevel', require('../assets/levels/attract.json'));
    this.load.image('defaultTiles', require('../assets/images/tiles/default.padded.png'));
    this.load.image('pyramidTiles', require('../assets/images/tiles/pyramids.padded.png'));
    this.load.image('blockTiles', require('../assets/images/tiles/blocks.padded.png'));
    this.load.image('stars1', require('../assets/images/backgrounds/stars1.jpg'));
  }

  create() {
    console.log(`GameScene::create() : ${hackManGame.version}`);

    this._hackmanGroup = this.physics.add.group({
      immovable: true,
      bounceX: 0,
      bounceY: 0,
    });

    this._ghostGroup = this.physics.add.group({
      immovable: true,
      bounceX: 0,
      bounceY: 0,
    });

    this._attractLevel = this.add.tilemap('attractLevel');
    let attractTiles = this._attractLevel.addTilesetImage('default', 'defaultTiles', 16, 16, 1, 2);

    this._maskShape = this.make.graphics(config);
    this._maskShape.setScrollFactor(Consts.MagicNumbers.Half);
    this._mask = this._maskShape.createGeometryMask();

    this._backgroundImage = this.add
      .image(0, 0, 'stars1')
      .setDepth(5)
      .setMask(this._mask)
      .setScrollFactor(Consts.MagicNumbers.Quarter)
      .setScale(scale / 2);

    let mapLayerBackground = this._attractLevel
      .createStaticLayer('Background', attractTiles, -256 * scale, -256 * scale)
      .setDepth(3)
      .setScale(scale)
      .setScrollFactor(Consts.MagicNumbers.Half);

    this._mapLayerWalls = this._attractLevel
      .createStaticLayer('Walls', attractTiles, 0, 0)
      .setDepth(5)
      .setScale(scale)
      .setCollisionByExclusion([-1], true, true);

    this._mapLayerShadows = this._attractLevel
      .createBlankDynamicLayer(
        'Shadows',
        attractTiles,
        Consts.Game.ShadowOffset * scale,
        Consts.Game.ShadowOffset * scale
      )
      .setAlpha(Consts.MagicNumbers.Quarter)
      .setDepth(4)
      .setScale(scale);

    let wallTiles = this._mapLayerWalls.getTilesWithin(0, 0);

    wallTiles.map((tile: Phaser.Tilemaps.Tile) => {
      if (tile.index == -1) return;
      if (tile.index === Consts.Game.GhostGateTileUp) {
        tile.collideUp = true;
        tile.collideDown = false;
        tile.visible = false;
        return;
      }
      if (tile.index === Consts.Game.GhostGateTileRight) {
        tile.collideRight = true;
        tile.collideLeft = false;
        tile.visible = false;
        return;
      }
      if (tile.index === Consts.Game.GhostGateTileLeft) {
        tile.collideLeft = true;
        tile.collideRight = false;
        tile.visible = false;
        return;
      }

      this._mapLayerShadows.putTileAt(tile, tile.x, tile.y).index += Consts.Game.TileShadowOffset;
    });

    this._mapLayerPills = this._attractLevel
      .createDynamicLayer('Pills', attractTiles, 0, 0)
      .setOriginFromFrame()
      .setDepth(7)
      .setScale(scale);

    let pillTiles = this._mapLayerPills.getTilesWithin(0, 0);

    pillTiles.map((tile: Phaser.Tilemaps.Tile) => {
      if (tile.index != -1) {
        this._mapLayerShadows.putTileAt(tile.index, tile.x, tile.y).index += Consts.Game.TileShadowOffset;
      }
    });

    this.physics.add.overlap(this._hackmanGroup, this._mapLayerPills, (hackman: HackMan, tile: any) => {
      if (!hackman.anims.currentFrame.isFirst && !hackman.isJumping) return;
      if (!hackman.OnFloor) return;

      if (tile.index != -1) {
        this._maskShape.fillStyle(Consts.Colours.White);
        this._maskShape.beginPath();
        this._maskShape.fillRect((tile.x - 8) * 32 * scale, (tile.y - 8) * 32 * scale, 32 * scale, 32 * scale);
        this._maskShape.closePath();

        if (tile.index === Consts.Game.FoodPillTile) hackManGame.gameState.score += Consts.Scores.FoodPill;

        if (tile.index === Consts.Game.PowerPillTile) {
          hackManGame.gameState.score += Consts.Scores.PowerPill;
          this.FrightenGhosts(10 * Consts.Times.MilliSecondsInSecond);
        }

        if (tile.index === Consts.Game.SpeedPillTile) {
          this._hackmanGroup.children.iterate((hackman: HackMan) =>
            hackman.speedUp(5 * Consts.Times.MilliSecondsInSecond)
          );
        }

        this._mapLayerPills.removeTileAt(tile.x, tile.y);
        this._mapLayerShadows.removeTileAt(tile.x, tile.y);
      }
    });

    this.physics.add.collider(this._hackmanGroup, this._mapLayerWalls, (hackman: HackMan, tile: any) => {
      hackman.hitWall(tile);
    });

    this.physics.add.collider(
      this._ghostGroup,
      this._mapLayerWalls,
      (ghost: Ghost, tile: Phaser.GameObjects.TileSprite) => {
        ghost.hitWall(tile);
      }
    );

    this.physics.add.collider(this._hackmanGroup, this._ghostGroup, (hackman: HackMan, ghost: Ghost) => {
      if (!this._hackman.OnFloor) return;
      if (this._hackman.state === HackManState.Dieing || this._hackman.state === HackManState.Dead) return;
      this._hackman.state = HackManState.Dieing;

      if (ghost.GhostState === GhostState.Eaten) return;

      if (ghost.GhostState === GhostState.Frightened) {
        ghost.GhostState = GhostState.Eaten;
      } else {
        this._hackman.HackManState = HackManState.Paused;
        this._ghostGroup.children.iterate((ghost: Ghost) => {
          ghost.GhostState = GhostState.Paused;
        });
        this.time.delayedCall(
          Consts.Times.MilliSecondsInSecond * Consts.MagicNumbers.Half,
          () => {
            this._ghostGroup.children.iterate((ghost: Ghost) => {
              ghost.visible = false;
            });
            this._hackman.HackManState = HackManState.Dead;
          },
          [],
          this
        );
        this.tweens.add({
          targets: this._hackman,
          alpha: 0,
          delay: Consts.Times.MilliSecondsInSecond * Consts.MagicNumbers.Half,
          duration: Consts.Times.MilliSecondsInSecond * 2,
          ease: 'Power2',
          loop: 0,
          onComplete: () => {
            this.lostLife(hackManGame.gameState.lives--);
          },
        });
      }
    });

    this.createHackMan();

    this.cameras.main.setBackgroundColor(Consts.Colours.Black);
    this.cameras.main.startFollow(this._hackman, false, Consts.MagicNumbers.Tenth, Consts.MagicNumbers.Tenth);

    this._ghostGroup.runChildUpdate = true;

    for (let i = 0; i < maxsprite; i++) {
      this._ghostGroup.add(
        new Ghost(
          this,
          this._mapLayerWalls,
          0,
          0,
          Phaser.Math.Between(0, Ghost.MaxGhostNo()),
          GhostWalkDirection.Down
        ).setScale(scale),
        true
      );
    }

    this._ghostGroup.children.each((ghost: Ghost) => {
      ghost
        .setPosition(
          (8 + Phaser.Math.Between(Consts.Game.GhostXStart - 1, Consts.Game.GhostXStart + 2) * 16) * scale,
          (8 + Phaser.Math.Between(Consts.Game.GhostYStart - 1, Consts.Game.GhostYStart + 1) * 16) * scale
        )
        .setCollideWorldBounds(true)
        .setOffset(2, 2)
        .setCircle(6)
        .add(this)
        .walk(3);
    }, this);
  }

  createHackMan() {
    this._hackman = new HackMan(
      this,
      this._mapLayerWalls,
      (8 + Consts.Game.HackManXStart * 16) * scale,
      (8 + Consts.Game.HackManYStart * 16) * scale
    ).setScale(scale);
    this._hackmanGroup.runChildUpdate = true;
    this._hackmanGroup.add(this._hackman);

    this._hackman.walk(HackManWalkDirection.Right);

    this.physics.world.setBounds(
      0,
      0,
      this._attractLevel.widthInPixels * (scale >> 1),
      this._attractLevel.heightInPixels * (scale >> 1)
    );
  }

  removeGhosts() {
    this._ghostGroup.children.each((ghost: Ghost) => {
      ghost.destroyGhost();
      this._ghostGroup.remove(ghost, true, true);
    });
  }

  addGhosts() {
    for (let i = 0; i < maxsprite; i++) {
      this._ghostGroup.add(
        new Ghost(
          this,
          this._mapLayerWalls,
          0,
          0,
          Phaser.Math.Between(0, Ghost.MaxGhostNo()),
          GhostWalkDirection.Down
        ).setScale(scale),
        true
      );
    }

    this._ghostGroup.children.each((ghost: Ghost) => {
      ghost
        .setPosition(
          (8 + Phaser.Math.Between(Consts.Game.GhostXStart - 1, Consts.Game.GhostXStart + 2) * 16) * scale,
          (8 + Phaser.Math.Between(Consts.Game.GhostYStart - 1, Consts.Game.GhostYStart + 1) * 16) * scale
        )
        .setCollideWorldBounds(true)
        .setOffset(2, 2)
        .setCircle(6)
        .add(this)
        .walk(3);
    }, this);
  }

  lostLife(lives: number) {
    this.cameras.main.stopFollow();
    this._hackman.destroy();

    if (lives === 0) {
      this.scene.pause();
      this.scene.launch(Consts.Scenes.GameOverScene);
      return;
    }

    this.createHackMan();
    this.cameras.main.startFollow(this._hackman, false, Consts.MagicNumbers.Tenth, Consts.MagicNumbers.Tenth);

    this.removeGhosts();
    this.addGhosts();
  }

  animatePillTiles(timestamp: number): void {
    let pillTiles = this._mapLayerPills.getTilesWithin(0, 0);

    pillTiles.map((tile: Phaser.Tilemaps.Tile) => {
      if (
        tile.index === Consts.Game.FoodPillTile ||
        tile.index === Consts.Game.PowerPillTile ||
        tile.index === Consts.Game.SpeedPillTile
      ) {
        tile.pixelX += Math.sin((timestamp + (tile.x + tile.y * 64) * 256) / 256) / 16;
        tile.pixelY += Math.cos((timestamp + (tile.x + tile.y * 64) * 256) / 256) / 16;

        let shadowTile = this._mapLayerShadows.getTileAt(tile.x, tile.y, true);

        shadowTile.pixelX += Math.sin((timestamp + (tile.x + tile.y * 64) * 256) / 256) / 16;
        shadowTile.pixelY += Math.cos((timestamp + (tile.x + tile.y * 64) * 256) / 256) / 16;
      }
    });
  }

  update(timestamp: number, elapsed: number) {
    this.UIScene.statusText = `${(timestamp / Consts.Times.MilliSecondsInSecond).toFixed(0)}s ${elapsed.toFixed(2)}ms ${
      this.sys.game.device.os.desktop ? 'Desktop' : 'Mobile'
    }`;

    if (Phaser.Math.Between(0, 256) === 1) {
      this._hackmanGroup.children.iterate((hackman: HackMan) => {
        hackman.jump();
      });
    }

    this.animatePillTiles(timestamp);
  }
}
