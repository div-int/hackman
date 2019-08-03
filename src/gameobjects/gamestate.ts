import '../consts/consts';

export class GameState {
  private _playing: boolean;
  private _attract: boolean;
  private _level: number;
  private _score: number;
  private _lives: number;
  private _highScore: number;

  public get playing(): boolean {
    return this._playing;
  }

  public get attract(): boolean {
    return this._attract;
  }
  public get level(): number {
    return this._level;
  }
  public get score(): number {
    return this._score;
  }
  public get lives(): number {
    return this._lives;
  }
  public get highScore(): number {
    return this._highScore;
  }

  public set playing(value: boolean) {
    this._playing = value;
    this._attract = !value;
  }

  public set attract(value: boolean) {
    this._attract = value;
    this._playing = !value;
  }

  public set level(value: number) {
    if (value > 0) this._level = value;
  }

  public set score(value: number) {
    if (value > 0) {
      this._score = value;
      if (this.score > this.highScore) this._highScore = this.score;
    }
  }

  public set lives(value: number) {
    if (value >= 0) this._lives = value;
  }

  constructor() {
    this.reset();
  }

  public reset() {
    this._playing = false;
    this._attract = true;
    this._level = 0;
    this._score = 0;
    this._lives = Consts.Game.StartLives;
    this._highScore = Consts.Game.StartHighScore;
  }
}
