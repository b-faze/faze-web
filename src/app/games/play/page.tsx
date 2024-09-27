"use client";

import { Suspense } from "react";
import Grid from "../create/Grid";
import { GameConfig, GameResult } from "../game";
import { GameRoutes, useGameData, useGameRouter } from "../navigation";
import { useGameGrid } from "./useGame";
import { PageBody } from "@/app/ui/PageBody";
import { Button } from "@/app/ui/Button";

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
    <PageBody title={data?.name ?? ""}>
        <GameGrid config={data} />
        <Button 
          onClick={() => router.push(GameRoutes.Create, data)}>
          Edit
        </Button>
        <Button 
          onClick={() => router.push(GameRoutes.View, data)}>
          View
        </Button>
     </PageBody>
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
        onClick={() => reset()}>
        Reset
      </Button>
    </div>
  );
}
