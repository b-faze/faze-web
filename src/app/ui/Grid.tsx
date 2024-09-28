import { MouseEventHandler, useCallback, useEffect, useMemo, useState } from "react";

type GridProps = {
  cols: number;
  rows: number;
  subgrid?: boolean;
}
export const Grid = ({cols, rows, subgrid = false}: GridProps) => { 
  const [tiles, setTiles] = useState<Tile[]>(() => Array.apply(null, Array(rows * cols)).map((_, index) => ({
      index: index,
      x: index % cols,
      y: Math.floor(index / cols),
      selectable: true,
      active: false,
      pressed: false,
    })));

  useEffect(() => {
    // recreate the grid tiles when the number of columns or rows change
    setTiles(Array.apply(null, Array(rows * cols)).map((_, index) => ({
      index: index,
      x: index % cols,
      y: Math.floor(index / cols),
      selectable: true,
      active: false,
      pressed: false
    })));
  }, [cols, rows]);

  const onTileChange = useCallback((tile: Tile) => {
    const { active, pressed } = tile;
    const siblingsSelectable = subgrid || !active;
    setTiles(ts => {
      const newTs = ts.map(t => ({...t, selectable: !t.active && siblingsSelectable, pressed: t.active && active && pressed }));
      newTs[tile.index] = tile;
      return newTs;
    });
  }, [subgrid]);


  const subgridClass = subgrid ? "subgrid" : "";
  return (
    <div 
      className={`tile-grid ${subgridClass}`} 
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
          <Tile key={tile.index} isSubgrid={subgrid} tile={tile} onChange={onTileChange} />
      ))}
    </div>
  )
};

type Tile = {
  index: number;
  x: number;
  y: number;
  selectable: boolean;
  active: boolean;
  pressed: boolean;
}

type TileProps = {
  isSubgrid: boolean;
  tile: Tile;
  onChange: (tile: Tile) => void;
}
const Tile = ({isSubgrid, tile, onChange}: TileProps) => {
  const minSubgridSize = 2;
  const [subgridSize, setSubgridSize] = useState(minSubgridSize);
  const {x, y, selectable, active, pressed} = tile;
  const selectableClass = selectable ? "selectable" : "";
  const pressedClass = pressed ? "pressed" : "";
  const activeClass = active ? "active" : "";

  const onClick = useCallback<MouseEventHandler<HTMLDivElement>>((e) => {
    if (!tile.selectable) return;

    e.preventDefault();
    e.stopPropagation();
    console.log(e);
    
    onChange({
      ...tile,
      active: true,
      selectable: false
    });
  }, [tile]);

  const onAuxClick = useCallback<MouseEventHandler<HTMLDivElement>>((e) => {
    if (!tile.selectable && !tile.active) return;

    e.preventDefault();
    if (tile.active) {
      e.stopPropagation();
    }

    if (e.button === 1) {
      setSubgridSize(subgridSize + 1);
    } else if (e.button === 2) {
      if (subgridSize > minSubgridSize) {
        setSubgridSize(subgridSize - 1);
      } else {
        onChange({
          ...tile,
          active: false,
          selectable: true
        });
      }
    }

  }, [subgridSize, onChange, tile]);

  const onPressed = useCallback(() => {
    onChange({
      ...tile,
      pressed: true
    })
  }, [onChange, tile]);


  return (
    <div 
      className={`tile ${selectableClass} ${pressedClass} ${activeClass}`}
      style={{
        gridColumn: x + 1,
        gridRow: y + 1,
      }}
      onMouseDown={onPressed}
      onMouseUp={() => onChange({...tile, pressed: false})}
      onAuxClick={onAuxClick}
      onClick={onClick}>
        <div className="body">
          {active && !isSubgrid && (
            <Grid subgrid cols={subgridSize} rows={subgridSize} />
          )}
        </div>
    </div>
  );
}