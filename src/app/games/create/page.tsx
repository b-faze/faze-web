"use client";

import { Suspense, useCallback, useEffect, useState } from 'react';
import { GameRoutes, useGameData, useGameRouter } from '../navigation';
import { Grid, useWinningStates } from '../useGrid';
import { PageBody } from '@/app/ui/PageBody';
import { Button } from '@/app/ui/Button';
import { GridSvg } from './GridSvg';

export default function Create() {
  return (
    <PageBody title="Create">
      <Suspense fallback={<p>loading...</p>}>
        <Page />
      </Suspense>
    </PageBody>
  );
}

const Page = () => {
  const data = useGameData();
  const router = useGameRouter();
  const [name, setName] = useState(data?.name ?? "New game");
  const [size, setSize] = useState(data?.gridSize ?? 3);
  const { grid, toggleActive, states, addState, reset } = useWinningStatesGrid(size, data?.winningStates);

  const onCreate = useCallback(() => {
    router.push(GameRoutes.View, {
      name: name,
      gridSize: size,
      winningStates: states,
    })
  }, [router, name, size, states]);

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-auto">
            <GridSvg cells={grid.cells} onClick={(cell) => toggleActive(cell.x, cell.y)} />
            <Button
              onClick={() => addState()}>
              Add
            </Button>
            <Button
              onClick={() => reset()}>
              Reset
            </Button>
          </div>
          <div className="col">
            <input className="form-control mb-3" placeholder="Name..." onChange={(e) => setName(e.target.value)} />
            <textarea className="form-control mb-3" placeholder="Description..."></textarea>
            <label htmlFor="customRange1" className="form-label">Size</label>
            <input 
              type="range" 
              className="form-range" 
              id="customRange1" 
              defaultValue={size} 
              onChange={(e) => setSize(parseInt(e.target.value))} 
              min={3} 
              max={5} 
              />
            <Button onClick={onCreate}>Create</Button>
          </div>
        </div>
      </div>
    </div>

  );
};

const useWinningStatesGrid = (size: number, winningStates?: number[]) => {
  const { states, add, reset: resetStates } = useWinningStates(winningStates ?? []);
  const [grid, setGrid] = useState<Grid>({cells: []});

  useEffect(() => {
    setGrid({
      cells: create2D(size, (x, y) => {
        const bitwiseMove = 1 << (x + y * size);
        const winningStatesLength = winningStates?.length ?? 0;
        const count = winningStates?.filter(s => (bitwiseMove & s) === bitwiseMove).length ?? 0;
        const f = winningStatesLength > 0 ? Math.floor(255 * count / winningStatesLength) : 0;
        return {
          x: x,
          y: y,
          color: "green",
          active: false,
          baseColor: getCellBaseColor(f),
          count: count,
        };
      })
    });
  }, [size, winningStates]);

  const toggleActive = useCallback((x: number, y: number) => {
    const newCells = [...grid.cells];
    newCells[x][y] = {...newCells[x][y], active: !newCells[x][y].active};
    setGrid({cells: newCells});
  }, [grid]);

  const reset = useCallback(() => {
    resetStates();
    setGrid({
      cells: create2D(size, (x, y) => { 
        return {
          x: x,
          y: y,
          color: "green",
          active: false,
          baseColor: getCellBaseColor(0),
          count: 0,
        };
      })
    });
  }, [resetStates, setGrid, size]);

  const addState = useCallback(() => {
    add(grid);
    const totalCount = grid.cells.reduce((a, b) => a.concat(b), []).reduce((a, b) => a + b.count, 0) + 1;
    setGrid(g => ({
      cells: create2D(size, (x, y) => { 
        const oldCell = g.cells[x][y];
        const count = oldCell.active ? oldCell.count + 1 : oldCell.count;
        const f = totalCount > 0 ? Math.floor(255 * count / totalCount) : 0;
        return {
          x: x,
          y: y,
          color: "green",
          active: false,
          baseColor: getCellBaseColor(f),
          count: count,
        };
      })
    }));
  }, [grid, add, size]);

  return {
    grid,
    toggleActive,
    reset,
    addState,
    states
  }
}

const create2D = <T,>(size: number, fn: (x: number, y: number) => T): T[][] => {
  const result: T[][] = [];
  for (let x = 0; x < size; x++) {
    const row = [];
    for (let y = 0; y < size; y++) {
      row.push(fn(x, y));
    }
    result.push(row);
  }

  return result;
}

const getCellBaseColor = (f: number) => {
  return `rgba(${f},${0},${0},255)`;
}

