import { useCallback, useState } from "react"
import { Game, GameConfig } from "../gameConfig"
import { CellData, useGrid } from "../create/useGrid";

export const useGameGrid = (config: GameConfig) => {
  const [game, setGame] = useState<Game>(new Game(config));
  const {grid, toggle, reset: resetGrid} = useGrid(config.gridSize);

  const move = useCallback((cell: CellData) => {
    const move = cell.x + cell.y * config.gridSize;
    try {
      const p1Turn = game.GetState().p1Turn;
      const newGame = game.Move(move);
      setGame(newGame);
      toggle(cell, p1Turn ? "red" : "blue");
    } catch (e) {
      console.error("failed to move", e);
    }
  }, [config, game, toggle]);

  const reset = useCallback(() => {
    setGame(new Game(config))
    resetGrid();
  }, [config, setGame, resetGrid]);
  
  return {
    grid,
    move,
    reset,
    result: game.GetState().result,
  }
}
