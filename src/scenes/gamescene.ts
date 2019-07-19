import "phaser";
import "../consts/consts";
import { Version } from "../version";
import { UIScene } from "./uiscene";
import { LevelScene } from "./levelscene";
import { GameState } from "../gameobjects/gamestate";
import { HackMan, HackManWalkDirection } from "../gameobjects/hackman";
import { Ghost } from "../gameobjects/ghost";
import { config } from "../config/config";

const hackmanSprites = "hackmanSprites";

let maxsprite: number;
let scale: number;

export class GameScene extends Phaser.Scene {
  private _uiscene: UIScene;
  private _levelscene: LevelScene;
  private _gameState: GameState;

  private _statusText: Phaser.GameObjects.BitmapText;
  private _hackman: HackMan;
  private _ghosts: Ghost[];
  private _hackmanGroup: Phaser.Physics.Arcade.Group;
  private _ghostGroup: Phaser.Physics.Arcade.Group;

  private _maskShape: Phaser.GameObjects.Graphics;
  private _mask: Phaser.Display.Masks.GeometryMask;
  private _backgroundImage: Phaser.GameObjects.Image;
  private _mapLayerBackgroundMask: Phaser.Tilemaps.DynamicTilemapLayer;
  private _mapLayerWalls: Phaser.Tilemaps.DynamicTilemapLayer;

  constructor() {
    super("GameScene");
    console.log(`GameScene::constructor() : ${Version}`);

    this._uiscene = new UIScene();
    this._levelscene = new LevelScene(0);
    this._gameState = new GameState();

    window.onresize = () => {
      this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight);
    };
  }

  preload() {
    console.log(`GameScene::preload() : ${Version}`);

    if (this.sys.game.device.os.desktop) {
      scale = Consts.Game.ScaleDesktop;
      maxsprite = Consts.Game.MaxSpriteDesktop;
    } else {
      scale = Consts.Game.ScaleMobile;
      maxsprite = Consts.Game.MaxSpriteMobile;
    }

    console.log(
      this.load.spritesheet(
        hackmanSprites,
        require("../assets/images/sprites/hackman.padded.png"),
        {
          frameWidth: 16,
          frameHeight: 16,
          margin: 1,
          spacing: 2,
        }
      )
    );

    HackMan.load(this);
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

    // Add UI scene object and start it.
    this.game.scene.add("UIScene", this._uiscene);
    this.game.scene.start("UIScene");

    // Add Level scene object but don't start it yet.
    this.game.scene.add("LevelScene", this._levelscene);
  }

  create() {
    console.log(`GameScene::create() : ${Version}`);

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

    this._maskShape.fillStyle(Consts.Colours.White);
    this._maskShape.beginPath();
    this._maskShape.fillRect(0, 0, 128, 128);
    this._maskShape.fillRect(256, 256, 128, 128);
    this._maskShape.fillRect(512, 256, 128, 128);
    this._maskShape.fillRect(256, 512, 128, 128);
    this._maskShape.fillRect(1024, 512, 256, 256);
    this._maskShape.setScrollFactor(Consts.MagicNumbers.Half);

    this._mask = this._maskShape.createGeometryMask();

    this._backgroundImage = this.add
      .image(0, 0, "stars1")
      .setDepth(5)
      // .setAlpha(Consts.MagicNumbers.Half)
      .setMask(this._mask)
      .setScrollFactor(Consts.MagicNumbers.Quarter)
      .setScale(scale >> 1);

    let mapLayerBackground = attractLevel
      .createStaticLayer("Background", attractTiles)
      .setDepth(3)
      .setScale(scale)
      .setScrollFactor(Consts.MagicNumbers.Half);

    let mapLayerWalls = attractLevel
      .createDynamicLayer("Walls", attractTiles)
      .setDepth(5)
      .setScale(scale)
      .setCollisionByExclusion([-1], true, true);

    let mapLayerShadows = attractLevel
      .createBlankDynamicLayer(
        "Shadows",
        attractTiles,
        Consts.Game.ShadowOffset,
        Consts.Game.ShadowOffset
      )
      .setAlpha(Consts.MagicNumbers.Quarter)
      .setDepth(4)
      .setScale(scale);

    let wallTiles = mapLayerWalls.getTilesWithin(0, 0);

    wallTiles.map((tile: Phaser.Tilemaps.Tile) => {
      if (tile.index != -1) {
        mapLayerShadows.putTileAt(tile, tile.x, tile.y).index += 5;
      }
    });

    let mapLayerPills = attractLevel
      .createDynamicLayer("Pills", attractTiles)
      .setOriginFromFrame()
      .setDepth(7)
      .setScale(scale);

    let pillTiles = mapLayerPills.getTilesWithin(0, 0);

    pillTiles.map((tile: Phaser.Tilemaps.Tile) => {
      if (tile.index != -1) {
        mapLayerShadows.putTileAt(tile.index + 5, tile.x, tile.y);
      }
    });

    this.physics.add.overlap(
      this._hackmanGroup,
      mapLayerPills,
      (hackman: HackMan, tile: any) => {
        if (tile.index != -1) {
          console.log("Overlap : ", hackman, tile);

          mapLayerPills.removeTileAt(tile.x, tile.y);
          mapLayerShadows.removeTileAt(tile.x, tile.y);
        }
      }
    );

    this.physics.add.collider(
      this._hackmanGroup,
      mapLayerWalls,
      (hackman: HackMan, tile: Phaser.GameObjects.TileSprite) => {
        console.log("Collide : ", hackman, tile);

        hackman.walk(hackman.WalkDirection() + Phaser.Math.Between(-1, 1));
      }
    );

    this.physics.add.collider(
      this._ghostGroup,
      mapLayerWalls,
      (ghost: Ghost, tile: Phaser.GameObjects.TileSprite) => {
        console.log("Collide : ", ghost, tile);
      }
    );

    // this.physics.add.collider(
    //   this._hackmanGroup,
    //   this._ghostGroup,
    //   (hackman: HackMan, ghost: Ghost) => {
    //     console.log("Collide : ", hackman, ghost);
    //   }
    // );

    this.physics.add.collider(
      this._ghostGroup,
      this._ghostGroup,
      (ghost1: Ghost, ghost2: Ghost) => {
        console.log("Collide : ", ghost1, ghost2);
      }
    );

    this._hackman = new HackMan(
      this,
      window.innerWidth >> 1,
      window.innerHeight >> 1
    );

    this._hackman.add(this);
    this._hackman
      .setScale(scale)
      .setRandomPosition(512, 512, 1024, 1024)
      .setCollideWorldBounds(true, 1, 1)
      .setBounce(1)
      .setSize(16, 16)
      .setOffset(0, 0)
      .walk(HackManWalkDirection.Up);

    this._hackmanGroup.add(this._hackman);

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

    this._ghosts = new Array<Ghost>(maxsprite);

    /** Add bitmap text object to ui scene for our status text. */
    this._statusText = this._uiscene.addBitmapText(
      16,
      16,
      "<Placeholder>",
      16,
      0
    );

    for (let i = 0; i < maxsprite; i++) {
      this._ghosts[i] = new Ghost(
        this,
        window.innerWidth >> 1,
        window.innerHeight >> 1,
        Phaser.Math.Between(0, Ghost.MaxGhostNo())
      ).setScale(scale);
      this._ghosts[i].add(this);
    }

    this._ghosts.map((ghost: Ghost) => {
      ghost
        .setRandomPosition(512, 512, 1024, 1024)
        .setCollideWorldBounds(true)
        .setBounce(1)
        .setSize(16, 16)
        .setOffset(0, 0)
        .walk(Phaser.Math.Between(0, Ghost.MaxDirections()));

      this._ghostGroup.add(ghost);
    });
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

    let ghost: Ghost = this._ghosts[
      Phaser.Math.Between(0, this._ghosts.length - 1)
    ];

    ghost.walk(Phaser.Math.Between(0, Ghost.MaxDirections()));

    if (Phaser.Math.Between(0, 1024) === 1) {
      this._hackman.walk(Phaser.Math.Between(0, HackMan.MaxDirections()));
    }
    this._hackman
      .setDepth(this._hackman.x + this._hackman.y * window.innerWidth)
      .update();

    this._ghosts.map(ghost => {
      ghost.setDepth(ghost.x + ghost.y * window.innerWidth).update();
    });
  }
}
