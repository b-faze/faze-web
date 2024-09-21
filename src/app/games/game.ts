export type GameConfig = {
  name: string;
  gridSize: number;
  winningStates: number[];
}

export enum GameResult {
  Win = "win",
  Loss = "loss",
  Draw = "draw"
}

export type GameState = {
  p1Turn: boolean;
  p1Moves: number;
  p2Moves: number;
  result?: GameResult;
}

export class Game {
  private config: GameConfig;
  private state: GameState;

  constructor(config: GameConfig) {
    this.config = config;
    this.state = {
      p1Turn: true,
      p1Moves: 0,
      p2Moves: 0
    }
  }

  GetState = (): GameState => {
    return this.state;
  }

  GetAvailableMoves(): number[] {
    const availableMoves: number[] = [];
    if (this.state.result) return availableMoves;

    const allMoves = this.state.p1Moves | this.state.p2Moves;

    for (let move = 0; move < this.config.gridSize * this.config.gridSize; move++) {
      const bitwiseMove = 1 << move;
      if ((allMoves & bitwiseMove) !== bitwiseMove) {
        availableMoves.push(move);
      }
    }
    return availableMoves;
  }

  Move = (move: number): Game => {
    const state = this.state;
    if (state.result !== undefined) {
      throw new Error("the game already has a result");
    }
  
    if (move < 0 || move > this.config.gridSize * this.config.gridSize) {
      throw new Error("invalid move " + move);
    }

    let newP1Moves = state.p1Moves;
    let newP2Moves = state.p2Moves;
    const bitwiseMove = 1 << move;
  
    if (state.p1Turn) {
      newP1Moves |= bitwiseMove;
    } else {
      newP2Moves |= bitwiseMove;
    }

    if (newP1Moves === state.p1Moves && newP2Moves === state.p2Moves) {
      throw new Error("no change")
    }
    if ((newP1Moves & newP2Moves) !== 0) {
      throw new Error("move has been taken")
    }
  
    const newGame = this.clone();
    newGame.state = {
      p1Turn: !state.p1Turn,
      p1Moves: newP1Moves,
      p2Moves: newP2Moves,
      result: Game.checkResult(newP1Moves, newP2Moves, this.config)
    };
    return newGame;
  }

  private clone = () => {
    const newGame = new Game(this.config);
    newGame.state = {
      p1Turn: this.state.p1Turn,
      p1Moves: this.state.p1Moves,
      p2Moves: this.state.p2Moves,
      result: this.state.result
    }
    return newGame;
  }

  private static checkResult = (p1Moves: number, p2Moves: number, config: GameConfig): GameResult | undefined => {   
    for (let i = 0; i < config.winningStates.length; i++) {
      const state = config.winningStates[i];
      if ((p1Moves & state) === state) {
        return GameResult.Win;
      }

      if ((p2Moves & state) === state) {
        return GameResult.Loss;
      }
    };

    const maxMoves = config.gridSize * config.gridSize;
    if ((p1Moves | p2Moves) === (Math.pow(2, maxMoves) - 1)) {
      return GameResult.Draw;
    }

    return undefined;
  }
}
