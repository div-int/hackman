import "phaser";
import { Version } from "../version";
import { UIScene } from "./uiscene";
import { LevelScene } from "./levelscene";
import { GameState } from "../gameobjects/gamestate";
import { HackMan } from "../gameobjects/hackman";
import { Ghost, GhostWalkDirection } from "../gameobjects/ghost";

const hackmanSprites = "hackmanSprites";

const SECSMILLISECS = 1000.0;
const MAXSPRITEDESKTOP = 128;
const MAXSPRITEMOBILE = 128;
const WHITE = 0xffffff;

let maxsprite: number;
let scale: number;

export class GameScene extends Phaser.Scene {
  private _uiscene: UIScene;
  private _levelscene: LevelScene;
  private _gameState: GameState;

  private _statusText: Phaser.GameObjects.BitmapText;
  private _hackman: HackMan[];
  private _ghosts: Ghost[];

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
      scale = 4;
      maxsprite = MAXSPRITEDESKTOP;
    } else {
      scale = 2;
      maxsprite = MAXSPRITEMOBILE;
    }

    this.load.spritesheet(
      hackmanSprites,
      require("../assets/images/sprites/hackman.png"),
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );

    HackMan.load(this);
    Ghost.load(this);

    this.load.tilemapTiledJSON(
      "attractLevel",
      require("../assets/levels/attract.json")
    );
    this.load.image(
      "defaultTiles",
      require("../assets/images/tiles/default.png")
    );
  }

  create() {
    console.log(`GameScene::create() : ${Version}`);

    let attractLevel = this.add.tilemap("attractLevel");
    let defaultTiles = attractLevel.addTilesetImage("default", "defaultTiles");
    let mapLayerWalls = attractLevel
      .createStaticLayer("Walls", defaultTiles)
      .setScale(scale);
    let mapLayerPills = attractLevel
      .createDynamicLayer("Pills", defaultTiles)
      .setScale(scale);

    this.cameras.main.setBackgroundColor("#888888");

    this._hackman = new Array<HackMan>(maxsprite);
    this._ghosts = new Array<Ghost>(maxsprite);

    // Add UI scene object and start it.
    this.game.scene.add("UIScene", this._uiscene);
    this.game.scene.start("UIScene");

    /** Add bitmap text object to ui scene for our status text.
     * Use an event handler when complete as the ui scene has not been created yet.
     */

    this._uiscene.load.on("complete", () => {
      this._statusText = this._uiscene.addBitmapText(
        16,
        48,
        "<Placeholder>",
        16,
        0
      );
    });

    // Add Level scene object but don't start it yet.
    // this.game.scene.add("LevelScene", this._levelscene);

    for (let i = 0; i < maxsprite; i++) {
      this._hackman[i] = new HackMan(this, 0, 0).setScale(scale);
      this._hackman[i].add(this);
      this._ghosts[i] = new Ghost(
        this,
        window.innerWidth >> 1,
        window.innerHeight >> 1,
        Phaser.Math.Between(0, Ghost.MaxGhostNo())
      ).setScale(scale);
      this._ghosts[i].add(this);
    }

    this._hackman.map((hackman: HackMan) => {
      hackman
        .setRandomPosition()
        .setCollideWorldBounds(true, 1, 1)
        .setVelocity(
          Phaser.Math.Between(-256, 256),
          Phaser.Math.Between(-256, 256)
        )
        .setBounce(1)
        .anims.play("hackmanWalkLeft", true, Phaser.Math.Between(0, 4));
    });

    this._ghosts.map((ghost: Ghost) => {
      ghost
        .setRandomPosition()
        .setCollideWorldBounds(true)
        .setBounce(1)
        .walk(Phaser.Math.Between(0, Ghost.MaxDirections()));
    });
  }

  update(timestamp: number, elapsed: number) {
    if (this._statusText) {
      this._statusText.setText(
        `${(timestamp / SECSMILLISECS).toFixed(0)}s ${elapsed.toFixed(2)}ms ${
          this.sys.game.device.os.desktop ? "Desktop" : "Mobile"
        }`
      );
    }

    for (let i = 0; i < maxsprite >> 6; i++) {
      let hackman: HackMan = this._hackman[
        Phaser.Math.Between(0, this._hackman.length - 1)
      ];
      let ghost: Ghost = this._ghosts[
        Phaser.Math.Between(0, this._ghosts.length - 1)
      ];

      hackman.walk(Phaser.Math.Between(0, HackMan.MaxDirections()));
      ghost.walk(Phaser.Math.Between(0, Ghost.MaxDirections()));
    }

    this._hackman.map(hackman => {
      hackman.setDepth(hackman.x + hackman.y * window.innerWidth).update();
    });

    this._ghosts.map(ghost => {
      ghost.setDepth(ghost.x + ghost.y * window.innerWidth).update();
    });
  }
}
