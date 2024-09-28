"use client";

import useWindowDimensions from "./hooks/useWindowDimensions";
import { Grid } from "./ui/Grid";

export default function Page() {
  const windowDimensions = useWindowDimensions();

  if (!windowDimensions) {
    return null;
  }

  const { width, height } = windowDimensions;
  const tileSize = 200;
  const rw = width / tileSize;
  const rh = height / tileSize;
  const cols = Math.floor(rw);
  const rows = Math.floor(rh);
  const pw = Math.floor((width - cols * tileSize) / 2);
  const ph = Math.floor((height - rows * tileSize) / 2);

  return (
    <div style={{
      width: width,
      height: height,
      paddingTop: ph,
      paddingBottom: ph,
      paddingLeft: pw,
      paddingRight: pw
    }}>
      <Grid 
        cols={cols} 
        rows={rows} 
      />
    </div>
  );
}
