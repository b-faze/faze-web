import { useCallback, useState } from "react";

export type Grid = {
  cells: CellData[][];
}

export type CellData = {
  x: number;
  y: number;
  color: string;
  active: boolean;
  baseColor: string;
  count: number;
}

export const useGrid = (size: number) => {
  const [grid, setGrid] = useState<Grid>(createGrid(size));

  const toggle = useCallback((cell: CellData, color?: string) => {
    setGrid(grid => {
      const newCells = grid.cells.slice(0);
      newCells[cell.x][cell.y] = {
        x: cell.x,
        y: cell.y,
        color: color ?? "green",
        active: !cell.active,
        baseColor: "white",
        count: 0,
      }
      return {
        cells: newCells,
      };
    })
  }, []);

  const reset = useCallback(() => {
    setGrid(createGrid(size));
  }, [size]);

  return {
    grid: grid,
    toggle: toggle,
    reset: reset,
  };
};

export const useWinningStates = (defaultStates: number[]) => {
  const [states, setStates] = useState<number[]>(defaultStates);

  const add = useCallback((grid: Grid) => {
    setStates(s => s?.concat([calcState(grid)]));
  }, []);

  const reset = useCallback(() => {
    setStates([]);
  }, []);

  return {
    states,
    add,
    reset
  };
}

const calcState = (grid: Grid): number => {
  const size = grid.cells.length;
  let state = 0;
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const cell = grid.cells[x][y];
      if (!cell.active) continue;

      const bitwiseMove = 1 << (x + size * y);
      state |= bitwiseMove;
    }
  }

  return state;
}

export const createGrid = (size: number): Grid => {
  const rows: CellData[][] = [];
  
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      const cell: CellData = {
        x: i,
        y: j,
        color: "grey",
        active: false,
        baseColor: "white",
        count: 0,
      }
      row.push(cell);
    }
    rows.push(row);
  }

  return {
    cells: rows
  };
}
