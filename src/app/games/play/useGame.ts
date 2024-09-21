import { useCallback, useState } from "react"
import { Game, GameConfig } from "../game"
import { CellData, useGrid } from "../useGrid";

export const useGameGrid = (config: GameConfig) => {
  const {game, move: applyMove, reset: resetGame} = useGame(config);
  const {grid, toggle, reset: resetGrid} = useGrid(config.gridSize);

  const move = useCallback((cell: CellData) => {
    const move = cell.x + cell.y * config.gridSize;
    try {
      const p1Turn = game.GetState().p1Turn;
      applyMove(move);
      toggle(cell, p1Turn ? "red" : "blue");
    } catch (e) {
      console.error("failed to move", e);
    }
  }, [config.gridSize, game, toggle, applyMove]);

  const reset = useCallback(() => {
    resetGame();
    resetGrid();
  }, [resetGame, resetGrid]);
  
  return {
    grid,
    move,
    reset,
    result: game.GetState().result,
  }
}

export const useGame = (config: GameConfig) => {
  const [game, setGame] = useState<Game>(new Game(config));

  const move = useCallback((move: number) => {
    try {
      setGame(game.Move(move));
    } catch (e) {
      console.error("failed to move", e);
    }
  }, [game]);

  const reset = useCallback(() => {
    setGame(new Game(config))
  }, [config, setGame]);

  return {
    game,
    move,
    reset
  };
}
