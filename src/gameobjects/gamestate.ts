import "../consts/consts";

export class GameState {
  private _playing: boolean;
  private _level: number;
  private _score: number;
  private _lives: number;
  private _highScore: number;

  public get playing(): boolean {
    return this._playing;
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

  public set playing(playing: boolean) {
    this._playing = playing;
  }

  public set level(level: number) {
    if (level > 0) this._level = level;
  }

  public set score(score: number) {
    if (score > 0) {
      this._score = score;
      if (this.score > this.highScore) this._highScore = this.score;
    }
  }

  public set lives(lives: number) {
    if (lives >= 0) this._lives = lives;
  }

  constructor() {
    this.reset();
  }

  public reset() {
    this._playing = false;
    this._level = 0;
    this._score = 0;
    this._lives = Consts.Game.StartLives;
    this._highScore = Consts.Game.StartHighScore;
  }
}
