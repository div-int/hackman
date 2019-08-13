namespace Consts {
  export const enum Scenes {
    TitleScene = 'TitleScene',
    UIScene = 'UIScene',
    GameScene = 'GameScene',
    LevelScene = 'LevelScene',
    GameOverScene = 'GameOver',
  }

  export const enum Scores {
    FoodPill = 10,
    PowerPill = 50,
  }

  export const enum MagicNumbers {
    Zero = 0,
    Tenth = 0.1,
    Quarter = 0.25,
    Half = 0.5,
    ThreeQuarters = 0.75,
    One = 1,
  }

  export const enum Colours {
    Off = 0,
    On = 1,
    Black = 0x000000,
    Red = 0xff0000,
    Green = 0x00ff00,
    Yellow = 0xffff00,
    Cyan = 0x00ffff,
    Blue = 0x0000ff,
    White = 0xffffff,
  }

  export const enum UI {
    Margin = 4,
    StatusTextSize = 8,
    TextSize = 16,
  }

  export const enum Times {
    MilliSecondsInSecond = 1000.0,
  }

  export const enum Resources {
    HackManSprites = 'HackManSprites',
  }

  export const enum Game {
    StartLives = 3,
    StartHighScore = 10000,

    GameOverFlashRate = 0.5,

    MaxSpriteDesktop = 16,
    MaxSpriteMobile = 16,
    ScaleDesktop = 4,
    ScaleMobile = 2,

    TileShadowOffset = 8,

    ShadowOffset = 4,

    GhostXStart = 15,
    GhostYStart = 12,
    GhostFrameRate = 5,
    GhostSpeed = 48,

    GhostGateTileUp = 52,
    GhostGateTileRight = 53,
    GhostGateTileLeft = 54,

    HackManXStart = 15,
    HackManYStart = 15,
    HackManFrameRate = 20,
    HackManSpeed = 64,
    HackManSpeedUpMultiplier = 1.5,
    HackManJumpHeight = 32,
    HackManJumpZoom = 1.25,
    HackManOnFloorHeight = 8,

    FoodPillTile = 49,
    PowerPillTile = 50,
    SpeedPillTile = 51,

    GoFullScreen = 254,
    LeaveFullScreen = 255,
  }
}
