import { useCallback, useMemo, useState } from "react";

type Tile = {
  index: number;
  x: number;
  y: number;
  flip: boolean;
}

type GridProps = {
  width: number;
  height: number;
  tileSize: number;
  renderTile: (x: number, y: number) => React.ReactNode;
}
export const Grid = ({width, height, tileSize, renderTile}: GridProps) => { 
  const cols = Math.floor(width / tileSize);
  const rows = Math.floor(height / tileSize);
  const [tiles, setTiles] = useState<Tile[]>(() => Array.apply(null, Array(rows * cols)).map((_, index) => ({
      index: index,
      x: index % cols,
      y: Math.floor(index / cols),
      flip: false
    })));

  const onClick = useCallback((tile: Tile) => {
    setTiles(ts => {
      const newTs = [...ts];
      newTs[tile.index] = {...tile, flip: !tile.flip};
      return newTs;
    })
  }, []);

  return (
    <div className="tile-grid" style={{
      width: width, 
      height: height, 
      display: "grid",
      gridTemplateRows: `repeat(${rows}, ${tileSize}px)`,
      gridTemplateColumns: `repeat(${cols}, ${tileSize}px)`,
      alignContent: "center",
      justifyContent: "center",
    }}>
      {tiles.map(tile => (
          <Tile key={tile.index} tile={tile} onClick={onClick}>{renderTile(tile.x, tile.y)}</Tile>
      ))}
    </div>
  )
};

type TileProps = {
  tile: Tile;
  onClick: (tile: Tile) => void;
  children: React.ReactNode;
}
const Tile = ({tile, onClick, children}: TileProps) => {
  const {x, y, flip} = tile;
  const flipClass = flip ? "flip" : "";
  return (
    <div 
      className={`tile ${flipClass}`}
      style={{
        gridColumn: x + 1,
        gridRow: y + 1,
      }}
      onClick={() => onClick(tile)}>
        <div className="body">
          <div className="back">
            {children}
          </div>
          <div className="front">

          </div>
        </div>
    </div>
  );
}