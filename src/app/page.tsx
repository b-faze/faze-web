"use client";

import useWindowDimensions from "./hooks/useWindowDimensions";
import { Grid } from "./ui/Grid";

export default function Page() {
  const windowDimensions = useWindowDimensions();

  if (!windowDimensions) {
    return null;
  }

  return (
    <Grid width={windowDimensions.width} height={windowDimensions.height} tileSize={200} renderTile={(x, y) => <p>({x}, {y})</p>} />
  );
}
