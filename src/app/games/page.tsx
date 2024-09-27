"use client";

import { PageBody } from '../ui/PageBody';
import { GameCard } from '../ui/GameCard';
import { useMemo } from 'react';
import { GameRoutes, useGameRouter } from './navigation';
import { GameConfig } from './game';
import oxImg from './images/ox.png';
import oxImgL from './images/ox_L.png';
import oxImgCorner from './images/ox_corner.png';
import Image, {StaticImageData} from "next/image";

type GameItem = {
  img: StaticImageData;
  config: GameConfig;
  description?: string;
  stats?: string;
}

export default function Games() {
  const router = useGameRouter();
  const games = useMemo<GameItem[]>(() => [
    {
      img: oxImg,
      config: {
        name: "Naughts and Crosses",
        gridSize: 3,
        winningStates: [73,146,292,7,56,448,273,84],
      },
      description: "Standard rules of Naughts and Crosses. The first player to get 3 in a row wins.",
      stats: "Win rate: 59%, Loss rate: 29%, Draw rate: 12%"
    },
    {
      img: oxImgL,
      config: {
        name: "Naughts and Crosses (L)",
        gridSize: 3,
        winningStates: [11,88,22,176,200,25,400,50,416,52,208,26,38,19,152,304],
      },
      description: "A modified games of Naughts and Crosses. A player must now make an L shape in any orientation to win.",
      stats: "Win rate: 61%, Loss rate: 35%, Draw rate: 4%"
    },
    {
      img: oxImgCorner,
      config: {
        name: "Naughts and Crosses corners-only",
        gridSize: 3,
        winningStates: [11,38,416,200],
      },
      description: "A modified games of Naughts and Crosses. A player must now make an L shape in a corner to win.",
      stats: "Win rate: 38%, Loss rate: 16%, Draw rate: 46%"
    },
  ], []);

  return (
    <PageBody title="Games">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {games.map(game => (
        <div key={game.config.name} className="col">
          <GameCard 
            title={game.config.name} 
            img={<Image src={game.img} className="img-fluid rounded-start" alt="..." />} 
            description={game.description}
            stats={game.stats}
            onClick={() => router.push(GameRoutes.View, game.config)}
          />
        </div>
        ))}
      </div>
    </PageBody>
  );
}