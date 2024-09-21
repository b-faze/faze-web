"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Game, GameConfig, GameResult } from "../game";
import { Button } from "@headlessui/react";


type CanvasProps = {
  config: GameConfig;
}
export const Canvas = ({config}: CanvasProps) => {
  const {ref, worldTree, canvas, reset} = useGameCanvas(config);
  const [stats, setStats] = useState(worldTree.getStats());

  const step = useCallback(() => {
    worldTree.simulate();
    canvas?.paint(1);
    setStats({...worldTree.getStats()});
  }, [worldTree, canvas]);

  const {play, toggle, stop} = useAnimation(step);

  useEffect(() => {
    canvas?.paint(1);
  }, [canvas]);

  const onReset = useCallback(() => {
    stop();
    reset();
    setStats({wins: 0, draws: 0, loses: 0});
  }, [stop, reset]);

  return (
    <div>
      <div className="flex">
        <p style={{padding: 8}}>Wins: {stats.wins}</p>
        <p style={{padding: 8}}>Loses: {stats.loses}</p>
        <p style={{padding: 8}}>Draws: {stats.draws}</p>
      </div>
      <canvas 
        ref={ref}
        width={500} 
        height={500}  
        style={{borderWidth: 1, borderStyle: "solid"}} 
      />
      <Button 
        disabled={play}
        onClick={() => step()}
        className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
        Step
      </Button>
      <Button 
        onClick={() => toggle()}
        className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
        {play ? "Pause" : "Play"}
      </Button>
      <Button 
        onClick={() => onReset()}
        className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
        Reset
      </Button>
    </div>
  );
}

const useAnimation = (callback: () => void) => {
  const ref = useRef<number>(0);
  const [play, setPlay] = useState(false);

  const onFrame = useCallback(() => {
    callback();
    ref.current = requestAnimationFrame(onFrame);
  }, [ref, callback]);

  const stop = useCallback(() => {
    setPlay(false);
    cancelAnimationFrame(ref.current);
  }, []);

  const toggle = useCallback(() => {
    if (play) {
      stop();
    } else {
      ref.current = requestAnimationFrame(onFrame);
      setPlay(true);
    }
  }, [ref, play, stop, onFrame]);

  return {
    play,
    toggle,
    stop
  }
}

const useGameCanvas = (config: GameConfig) => {
  const {ref} = useCanvas();
  const [worldTree, setWorldTree] = useState(new WorldTree(0, new Game(config)));
  const canvasRef = ref.current;
  const canvas = useMemo(() => canvasRef ? new GameCanvas(canvasRef, worldTree) : undefined, [canvasRef, worldTree]);

  const reset = useCallback(() => {
    setWorldTree(new WorldTree(0, new Game(config)));
  }, [config]);

  return {
    ref,
    worldTree,
    canvas,
    reset
  };
}

const useCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d') ?? undefined;
    setCtx(ctx);
  }, [ref]);

  return {
    ref,
    ctx
  };
}

interface PaintedTree {
  getColor: () => [number, number, number, number];
  getChild: (move: number) => PaintedTree | undefined;
}

type GameStats = {
  wins: number;
  loses: number;
  draws: number;
}

class WorldTree implements PaintedTree {
  private move: number;
  private game: Game;
  private stats: GameStats;
	private children: Record<number, WorldTree>;

  constructor(move: number, game: Game) {
    this.move = move;
    this.game = game;
    this.stats = {wins: 0, loses: 0, draws: 0};
    this.children = {};
  }

  getStats(): GameStats {
    return this.stats;
  }

  getColor = (): [number, number, number, number] => {
    const total = this.stats.wins + this.stats.loses + this.stats.draws;
    if (total === 0) {
      return [0,0,0,0];
    }

    const winRate = this.stats.wins / total;

    const drawOffset = 1 - 2 * Math.abs(0.5-winRate);
    const r = Math.floor(255 * winRate + drawOffset * 127);
    const g = Math.floor(255 * drawOffset);
    const b = Math.floor(255 * (1 -winRate) - drawOffset * 127);

    return [r,g,b,255];
  }

  getChild = (move: number): PaintedTree | undefined => {
    let child = this.children[move];
    if (child) return child;

    try {
      const nextState = this.game.Move(move);
      child = new WorldTree(move, nextState);
      this.children[move] = child;
      return child;
    } catch {
      return undefined;
    }
  };

  simulate() {
    const stats = this.stats;

    if (Object.keys(this.children).length === 0) {
      const result = WorldTree.simulate(this.game);

      switch (result) {
        case GameResult.Win:
          stats.wins += 1;
          break;
        case GameResult.Loss:
          stats.loses += 1;
          break;
        case GameResult.Draw:
          stats.draws += 1;
          break;
      }

      return;
    }

    const children = Object.values(this.children);
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      child.simulate();
      stats.wins += child.stats.wins;
      stats.loses += child.stats.loses;
      stats.draws += child.stats.draws;
    }
  }

  private static simulate(game: Game): GameResult | undefined {
    let result = game.GetState().result;

    while (!result) {
      const availableMoves = game.GetAvailableMoves();
      const totalMoves = availableMoves.length;
      if (totalMoves === 0) {
        console.log(game);
        throw new Error("no available moves");
      }

      const rIndex = Math.floor(Math.random() * totalMoves);
      const move = availableMoves[rIndex];
      game = game.Move(move);
      result = game.GetState().result;
    }

    return result;
  }
}

class GameCanvas {
  private canvas: HTMLCanvasElement;
  private tree: PaintedTree;
  private origin: WorldPoint;

  constructor(canvas: HTMLCanvasElement, tree: PaintedTree) {
    this.canvas = canvas;
    this.tree = tree;
    this.origin = {
      d: 3,
      r: canvas.width ?? 0,
      x: 0,
      y: 0,
    };
  }

  private getCtx(): CanvasRenderingContext2D {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("no ctx");
    return ctx;
  }

  paint(depth: number) {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const ctx = this.getCtx();
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const i = (x + y * width) * 4;
        const [r, g, b, a] = this.getColor(x, y, depth);
        data[i] = r;
        data[i+1] = g;
        data[i+2] = b;
        data[i+3] = a;
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }

  private getColor = (x: number, y: number, depth: number): [number, number, number, number] => {
    let move: number;
    const points = this.sampleWorldPoints(x, y, 1);
    let point = points[0];
    let node = this.tree;

    for (let i = 0; i < depth; i++) {
      [point, move] = GameCanvas.next(point);
      const child = node.getChild(move);
      if (!child) break;

      node = child;
    }

    if (node !== this.tree) {
      return node.getColor();
    } else {
      return [0,0,0,0];
    }
  }

  private sampleWorldPoints = (x: number, y: number, n: number) => {
    const results: WorldPoint[] = [];
    for (let i = 0; i < n * n; i++) {
      const n2 = 2 * n
      const xi = n2*x + 1
      const yi = n2*y + 1
  
      results[i] = {
        d: this.origin.d,
        r: this.origin.r * n2,
        x: this.origin.x*n2 + xi,
        y: this.origin.y*n2 + yi,
      };
    }
    return results
  }

  private static next = (point: WorldPoint): [WorldPoint, number] => {
    const dx = point.x * point.d;
    const dy = point.y * point.d;
    const i = Math.floor(dx / point.r);
    const j = Math.floor(dy / point.r);
    const x = dx - i*point.r;
    const y = dy - j*point.r;
  
    return [{
      d: point.d,
      r: point.r,
      x: x,
      y: y,
    }, i + j*point.d];
  }
}

type WorldPoint = {
	d: number; // branching
	r: number; // resolution
	x: number;
	y: number;
}

