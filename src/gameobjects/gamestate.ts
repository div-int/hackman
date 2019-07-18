export class GameState {
  public playing: boolean;
  public level: number;
  public players: number;
  public playerStates: {
    [index: number]: { playerState: PlayerState };
  };

  constructor() {
    this.playing = false;
    this.level = 0;
    this.players = 0;
    this.playerStates = {};
  }
}

export enum PlayerState {
  Starting,
  Alive,
  Attacking,
  Attacked,
  Dieing,
  Dead,
  PoweredUp,
}