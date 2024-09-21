"use client";

import { Suspense } from "react";
import Grid from "../create/Grid";
import { GameConfig, GameResult } from "../game";
import { GameRoutes, useGameData, useGameRouter } from "../navigation";
import { useGameGrid } from "./useGame";
import { Button } from "@headlessui/react";

export default function Play() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <Page />
    </Suspense>
  );
}

const Page = () => {
  const data = useGameData();
  const router = useGameRouter();

  if (!data) {
    return (
      <div className="">
        <main className="">
          <h1>ERROR</h1>
        </main>
      </div>
    );
  }


  return (
    <div className="">
      <main className="">
        <h1>NAME: {data.name}</h1>
        <GameGrid config={data} />
        <Button 
          onClick={() => router.push(GameRoutes.Create, data)}
          className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
          Edit
        </Button>
        <Button 
          onClick={() => router.push(GameRoutes.View, data)}
          className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
          View
        </Button>
      </main>
    </div>
  );
};

type GameGridProps = {
  config: GameConfig;
}
const GameGrid = ({config}: GameGridProps) => {
  const {grid, move, reset, result} = useGameGrid(config);

  return (
    <div className="flex">
      <Grid cells={grid.cells} onClick={move} />
      <div style={{padding: 16}}>
        {result === GameResult.Win && (
          <p>Player 1 Wins!</p>
        )}
        {result === GameResult.Loss && (
          <p>Player 2 Wins!</p>
        )}
        {result === GameResult.Draw && (
          <p>It&apos;s a draw!</p>
        )}
      </div>
      <Button 
        onClick={() => reset()}
        className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
        Reset
      </Button>
    </div>
  );
}
