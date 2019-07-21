import "phaser";
import "../consts/consts";
import { UIScene } from "./uiscene";
import { GameState } from "../gameobjects/gamestate";
import { HackMan, HackManWalkDirection } from "../gameobjects/hackman";
import { Ghost, GhostState, GhostWalkDirection } from "../gameobjects/ghost";
import { config } from "../config/config";
import { hackManGame } from "..";

// const hackmanSprites = "hackmanSprites";

let maxsprite: number;
let scale: number;

export class GameScene extends Phaser.Scene {
  private _uiscene: UIScene;
  private _gameState: GameState;

  private _statusText: Phaser.GameObjects.BitmapText;
  private _hackman: HackMan;
  private _hackmanGroup: Phaser.Physics.Arcade.Group;
  private _ghostGroup: Phaser.Physics.Arcade.Group;

  private _maskShape: Phaser.GameObjects.Graphics;
  private _mask: Phaser.Display.Masks.GeometryMask;
  private _backgroundImage: Phaser.GameObjects.Image;
  private _mapLayerBackgroundMask: Phaser.Tilemaps.DynamicTilemapLayer;
  private _mapLayerWalls: Phaser.Tilemaps.DynamicTilemapLayer;

  get UIScene(): UIScene {
    if (!this._uiscene)
      return (this._uiscene = <UIScene>this.scene.get(Consts.Scenes.UIScene));
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
    console.log(`GameScene::constructor() : ${hackManGame.Version}`);

    window.onresize = () => {
      this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight);
    };
  }

  init() {
    if (this.sys.game.device.os.desktop) {
      scale = Consts.Game.ScaleDesktop;
      maxsprite = Consts.Game.MaxSpriteDesktop;
    } else {
      scale = Consts.Game.ScaleMobile;
      maxsprite = Consts.Game.MaxSpriteMobile;
    }
  }

  preload() {
    console.log(`GameScene::preload() : ${hackManGame.Version}`);

    // HackMan.load(this);
    Ghost.load(this);

    this.load.tilemapTiledJSON(
      "attractLevel",
      require("../assets/levels/attract.json")
    );
    this.load.image(
      "defaultTiles",
      require("../assets/images/tiles/default.padded.png")
    );
    this.load.image(
      "stars1",
      require("../assets/images/backgrounds/stars1.jpg")
    );
  }

  create() {
    console.log(`GameScene::create() : ${hackManGame.Version}`);

    this._hackmanGroup = this.physics.add.group({
      immovable: true,
      bounceX: 1,
      bounceY: 1,
    });

    this._ghostGroup = this.physics.add.group({
      immovable: true,
      bounceX: 1,
      bounceY: 1,
    });

    let attractLevel = this.add.tilemap("attractLevel");
    let attractTiles = attractLevel.addTilesetImage(
      "default",
      "defaultTiles",
      16,
      16,
      1,
      2
    );

    this._maskShape = this.make.graphics(config);
    this._maskShape.setScrollFactor(Consts.MagicNumbers.Half);
    this._mask = this._maskShape.createGeometryMask();

    this._backgroundImage = this.add
      .image(0, 0, "stars1")
      .setDepth(5)
      // .setAlpha(Consts.MagicNumbers.Half)
      .setMask(this._mask)
      .setScrollFactor(Consts.MagicNumbers.Quarter)
      .setScale(scale / 2);

    let mapLayerBackground = attractLevel
      .createStaticLayer("Background", attractTiles, -256 * scale, -256 * scale)
      .setDepth(3)
      .setScale(scale)
      .setScrollFactor(Consts.MagicNumbers.Half);

    let mapLayerWalls = attractLevel
      .createDynamicLayer("Walls", attractTiles, 0, 0)
      .setDepth(5)
      .setScale(scale)
      .setCollisionByExclusion([-1], true, true);

    let mapLayerShadows = attractLevel
      .createBlankDynamicLayer(
        "Shadows",
        attractTiles,
        Consts.Game.ShadowOffset * scale,
        Consts.Game.ShadowOffset * scale
      )
      .setAlpha(Consts.MagicNumbers.Quarter)
      .setDepth(4)
      .setScale(scale);

    let wallTiles = mapLayerWalls.getTilesWithin(0, 0);

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

      mapLayerShadows.putTileAt(tile, tile.x, tile.y).index +=
        Consts.Game.TileShadowOffset;
    });

    let mapLayerPills = attractLevel
      .createDynamicLayer("Pills", attractTiles, 0, 0)
      .setOriginFromFrame()
      .setDepth(7)
      .setScale(scale);

    let pillTiles = mapLayerPills.getTilesWithin(0, 0);

    pillTiles.map((tile: Phaser.Tilemaps.Tile) => {
      if (tile.index != -1) {
        mapLayerShadows.putTileAt(tile.index, tile.x, tile.y).index +=
          Consts.Game.TileShadowOffset;
      }
    });

    this.physics.add.overlap(
      this._hackmanGroup,
      mapLayerPills,
      (hackman: HackMan, tile: any) => {
        if (!hackman.anims.currentFrame.isFirst) return;
        if (tile.index != -1) {
          // console.log("Overlap : ", hackman, tile);

          this._maskShape.fillStyle(Consts.Colours.White);
          this._maskShape.beginPath();
          this._maskShape.fillRect(
            (tile.x - 8) * 32 * scale,
            (tile.y - 8) * 32 * scale,
            32 * scale,
            32 * scale
          );
          this._maskShape.closePath();

          if (tile.index === Consts.Game.PowerPillTile) {
            this.FrightenGhosts(10 * Consts.Times.MilliSecondsInSecond);
          }

          if (tile.index === Consts.Game.SpeedPillTile) {
            this._hackmanGroup.children.iterate((hackman: HackMan) =>
              hackman.speedUp(5 * Consts.Times.MilliSecondsInSecond)
            );
          }

          mapLayerPills.removeTileAt(tile.x, tile.y);
          mapLayerShadows.removeTileAt(tile.x, tile.y);
        }
      }
    );

    this.physics.add.collider(
      this._hackmanGroup,
      mapLayerWalls,
      (hackman: HackMan, tile: Phaser.GameObjects.GameObject) => {
        // hackman.walk(hackman.WalkDirection + Phaser.Math.Between(-1, 1));
        hackman.hitWall(tile);
      }
    );

    this.physics.add.collider(
      this._ghostGroup,
      mapLayerWalls,
      (ghost: Ghost, tile: Phaser.GameObjects.TileSprite) => {
        ghost.hitWall(tile);
      }
    );

    this.physics.add.collider(
      this._hackmanGroup,
      this._ghostGroup,
      (hackman: HackMan, ghost: Ghost) => {
        // console.log("Collide : ", hackman, ghost);

        if (ghost.GhostState === GhostState.Eaten) return;

        if (ghost.GhostState === GhostState.Frightened) {
          ghost.GhostState = GhostState.Eaten;
        } else {
          this._ghostGroup.remove(ghost);
          ghost.kill();
          ghost.destroy();
        }
      }
    );

    // this.physics.add.collider(
    //   this._ghostGroup,
    //   this._ghostGroup,
    //   (ghost1: Ghost, ghost2: Ghost) => {
    //     // console.log("Collide : ", ghost1, ghost2);
    //   }
    // );

    this._hackman = new HackMan(
      this,
      mapLayerWalls,
      (8 + Consts.Game.HackManXStart * 16) * scale,
      (8 + Consts.Game.HackManYStart * 16) * scale
    ).setScale(scale);
    this._hackmanGroup.runChildUpdate = true;
    this._hackmanGroup.add(this._hackman);

    this._hackman
      .setOffset(2, 2)
      .setCircle(6)
      .setCollideWorldBounds(true, 1, 1)
      .walk(HackManWalkDirection.Right);

    this.physics.world.setBounds(
      0,
      0,
      attractLevel.widthInPixels * (scale >> 1),
      attractLevel.heightInPixels * (scale >> 1)
    );

    this.cameras.main.setBackgroundColor(Consts.Colours.Black);
    this.cameras.main.startFollow(
      this._hackman,
      false,
      Consts.MagicNumbers.Tenth,
      Consts.MagicNumbers.Tenth
    );

    // this._ghosts = new Array<Ghost>(maxsprite);

    /** Add bitmap text object to ui scene for our status text. */
    this._statusText = this.UIScene.addBitmapText(
      4 * scale,
      4 * scale,
      "<Placeholder>",
      8,
      0
    );

    this._ghostGroup.runChildUpdate = true;

    for (let i = 0; i < maxsprite; i++) {
      this._ghostGroup.add(
        new Ghost(
          this,
          mapLayerWalls,
          0,
          0,
          Phaser.Math.Between(0, Ghost.MaxGhostNo()),
          GhostWalkDirection.Down
        ).setScale(scale),
        true
      );
    }

    // this._ghosts.map((ghost: Ghost) => {
    //   ghost
    //     .setPosition(
    //       (8 +
    //         Phaser.Math.Between(
    //           Consts.Game.GhostXStart - 1,
    //           Consts.Game.GhostXStart + 2
    //         ) *
    //           16) *
    //         scale,
    //       (8 +
    //         Phaser.Math.Between(
    //           Consts.Game.GhostYStart - 1,
    //           Consts.Game.GhostYStart + 1
    //         ) *
    //           16) *
    //         scale
    //     )
    //     .setCollideWorldBounds(true)
    //     .setOffset(1, 1);

    //   ghost.setCircle(7);
    //   ghost.walk(3);
    // });

    this._ghostGroup.children.each((ghost: Ghost) => {
      ghost
        .setPosition(
          (8 +
            Phaser.Math.Between(
              Consts.Game.GhostXStart - 1,
              Consts.Game.GhostXStart + 2
            ) *
              16) *
            scale,
          (8 +
            Phaser.Math.Between(
              Consts.Game.GhostYStart - 1,
              Consts.Game.GhostYStart + 1
            ) *
              16) *
            scale
        )
        .setCollideWorldBounds(true)
        .setOffset(2, 2)
        .setCircle(6)
        .walk(3);
    }, this);
  }

  update(timestamp: number, elapsed: number) {
    if (this._statusText) {
      this._statusText.setText(
        `${(timestamp / Consts.Times.MilliSecondsInSecond).toFixed(
          0
        )}s ${elapsed.toFixed(2)}ms ${
          this.sys.game.device.os.desktop ? "Desktop" : "Mobile"
        }`
      );
    }

    // if (Phaser.Math.Between(0, 256) === 1) {
    //   this._hackman.walk(Phaser.Math.Between(0, HackMan.MaxDirections));
    // }
  }
}
