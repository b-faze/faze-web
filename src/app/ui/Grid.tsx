import { MouseEventHandler, useCallback, useEffect, useMemo, useState } from "react";

type Tile = {
  index: number;
  x: number;
  y: number;
  selectable: boolean;
  active: boolean;
}

type GridProps = {
  cols: number;
  rows: number;
  depth?: number;
}
export const Grid = ({cols, rows, depth = 0}: GridProps) => { 
  const maxDepth = 1;
  const [tiles, setTiles] = useState<Tile[]>(() => Array.apply(null, Array(rows * cols)).map((_, index) => ({
      index: index,
      x: index % cols,
      y: Math.floor(index / cols),
      selectable: true,
      active: false
    })));

  useEffect(() => {
    // recreate the grid tiles when the number of columns or rows change
    setTiles(Array.apply(null, Array(rows * cols)).map((_, index) => ({
      index: index,
      x: index % cols,
      y: Math.floor(index / cols),
      selectable: true,
      active: false
    })));
  }, [cols, rows]);

  const onSelect = useCallback((tile: Tile) => {
    const active = !tile.active;
    const selectable = depth === maxDepth || !active;
    setTiles(ts => {
      const newTs = ts.map(t => ({...t, selectable }));
      newTs[tile.index] = {...tile, selectable, active};
      return newTs;
    });
  }, [depth]);

  return (
    <div 
      className="tile-grid" 
      style={{
        width: "100%", 
        height: "100%", 
        display: "grid",
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        alignContent: "center",
        justifyContent: "center",
      }}
      onContextMenu={e => e.preventDefault()}>
      {tiles.map(tile => (
          <Tile key={tile.index} depth={depth + 1}tile={tile} onSelect={onSelect} />
      ))}
    </div>
  )
};

type TileProps = {
  depth: number;
  tile: Tile;
  onSelect: (tile: Tile) => void;
}
const Tile = ({depth, tile, onSelect}: TileProps) => {
  const minSubGridSize = 2;
  const [subGridSize, setSubGridSize] = useState(minSubGridSize);
  const [pressed, setPressed] = useState(false);
  const {x, y, selectable, active} = tile;
  const selectableClass = selectable ? "selectable" : "";
  const pressedClass = pressed ? "pressed" : "";
  const activeClass = active ? "active" : "";

  const onClick = useCallback<MouseEventHandler<HTMLDivElement>>((e) => {
    if (!tile.selectable) return;

    e.preventDefault();
    e.stopPropagation();
    console.log(e);
    
    onSelect(tile);
  }, [tile]);

  const onAuxClick = useCallback<MouseEventHandler<HTMLDivElement>>((e) => {
    if (!tile.selectable && !tile.active) return;

    e.preventDefault();
    if (tile.active) {
      e.stopPropagation();
    }

    if (e.button === 1) {
      setSubGridSize(subGridSize + 1);
    } else if (e.button === 2) {
      if (subGridSize > minSubGridSize) {
        setSubGridSize(subGridSize - 1);
      } else {
        onSelect(tile);
      }
    }

  }, [subGridSize, onSelect, tile]);


  return (
    <div 
      className={`tile ${selectableClass} ${pressedClass} ${activeClass}`}
      style={{
        gridColumn: x + 1,
        gridRow: y + 1,
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onAuxClick={onAuxClick}
      onClick={onClick}>
        <div className="body">
          {active && depth < 2 && (
            <Grid cols={subGridSize} rows={subGridSize} depth={depth} />
          )}
        </div>
    </div>
  );
}