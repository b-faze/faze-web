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

  const onTileChange = useCallback((tile: Tile, action?: TileAction) => {
    const { active, pressed } = tile;
    const siblingsSelectable = subgrid || !active;
    if (action === TileAction.Confirmed && tile.active && subgrid) {
      // confirm selection, so reset
      setTiles(ts => ts.map(t => ({...t, selectable: true, pressed: false, active: false })));
    } else {
      setTiles(ts => {
        const newTs = ts.map(t => ({...t, selectable: siblingsSelectable && !t.active, pressed: t.active && active && pressed && action === TileAction.Confirming }));
        newTs[tile.index] = tile;
        return newTs;
      });
    }
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

enum TileAction {
  Confirming = "confirming",
  Confirmed = "confirmed"
}

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
  onChange: (tile: Tile, action?: TileAction) => void;
}
const Tile = ({isSubgrid, tile, onChange}: TileProps) => {
  const minSubgridSize = 2;
  const [subgridSize, setSubgridSize] = useState(minSubgridSize);
  const {x, y, selectable, active, pressed} = tile;
  const selectableClass = selectable ? "selectable" : "";
  const pressedClass = pressed ? "pressed" : "";
  const activeClass = active ? "active" : "";

  const onPress = useCallback<MouseEventHandler<HTMLDivElement>>((e) => {
    if (e.button === 0) {
      onChange({
        ...tile,
        pressed: true
      }, TileAction.Confirming);
    } else if (e.button === 2 && tile.active) {
      onChange({
        ...tile,
        pressed: true
      });
    }
  }, [onChange, tile]);

  const onAuxRelease = useCallback<MouseEventHandler<HTMLDivElement>>((e) => {
    if (!tile.selectable && !tile.active) return;

    e.preventDefault();
    if (tile.active) {
      e.stopPropagation();
    }

    if (e.button === 1) {
      setSubgridSize(subgridSize + 1);
    } else if (e.button === 2) {
      if (tile.active) {
        onChange({
          ...tile,
          active: false,
          selectable: true,
          pressed: false,
        });
      } else if (subgridSize > minSubgridSize) {
        setSubgridSize(subgridSize - 1);
      }
    }

  }, [subgridSize, onChange, tile]);

  const onRelease = useCallback<MouseEventHandler<HTMLDivElement>>((e) => {
    if (e.button === 0) {
      if (!tile.selectable && !tile.active) return;
      e.preventDefault();
      e.stopPropagation();
      
      console.log("released");
      onChange({
        ...tile,
        active: true,
        selectable: false,
        pressed: false
      }, tile.active ? TileAction.Confirmed : undefined);
    } else {
      onAuxRelease(e);
    }
  }, [tile, onAuxRelease]);

  return (
    <div 
      className={`tile ${selectableClass} ${pressedClass} ${activeClass}`}
      style={{
        gridColumn: x + 1,
        gridRow: y + 1,
      }}
      onMouseDown={onPress}
      onMouseUp={onRelease}>
        <div className="body">
          {active && !isSubgrid && (
            <Grid subgrid cols={subgridSize} rows={subgridSize} />
          )}
        </div>
    </div>
  );
}