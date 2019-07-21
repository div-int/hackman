namespace Consts {
  export const enum Scenes {
    TitleScene = "TitleScene",
    UIScene = "UIScene",
    GameScene = "GameScene",
    LevelScene = "LevelScene",
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
    Cyan = 0x00ffff,
    Blue = 0x0000ff,
    White = 0xffffff,
  }

  export const enum Times {
    MilliSecondsInSecond = 1000.0,
  }

  export const enum Resources {
    HackManSprites = "HackManSprites",
  }

  export const enum Game {
    MaxSpriteDesktop = 16,
    MaxSpriteMobile = 16,
    ScaleDesktop = 4,
    ScaleMobile = 2,

    GhostXStart = 15,
    GhostYStart = 12,

    HackManXStart = 15,
    HackManYStart = 15,

    HackmanFrameRate = 20,

    PowerPillTile = 50,
    GhostGateTileUp = 52,
    GhostGateTileRight = 53,
    GhostGateTileLeft = 54,

    GoFullScreen = 254,
    LeaveFullScreen = 255,

    TileShadowOffset = 8,

    ShadowOffset = 8,
  }
}
