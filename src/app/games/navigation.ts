import { useCallback, useMemo } from "react";
import { GameConfig } from "./game";
import { useRouter, useSearchParams } from "next/navigation";

export enum GameRoutes {
  Create = "/games/create",
  Play = "/games/play",
  Visualise = "/games/visualise"
}

export const useGameRouter = () => {
  const router = useRouter();

  const push = useCallback((route: GameRoutes, data?: GameConfig) => {
    if (data !== undefined) {
      router.push(route + "?data=" + toUrl(data));
    } else {
      router.push(route);
    }

  }, [router]);

  return {
    push: push,
  };
};

export const useGameData = (): GameConfig | undefined => {
  const params = useSearchParams();

  return useMemo(() => {
    const dataStr = params.get("data");
    return dataStr ? fromUrl(dataStr) : undefined;
  }, [params]);
}

const toUrl = (data: GameConfig): string => {
  return encodeURIComponent(btoa(JSON.stringify(data)));
}

const fromUrl = (dataStr: string): GameConfig | undefined => {
  try {
    return JSON.parse(atob(decodeURIComponent(dataStr)));
  } catch (e) {
    console.error("failed to parse game data", e);
    return undefined;
  }
}