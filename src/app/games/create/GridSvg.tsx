import { CellData } from "../useGrid";


type GridSvgProps = {
  cells: CellData[][];
  onClick?: (data: CellData) => void;
};
export const GridSvg = ({cells, onClick}: GridSvgProps) => {
  const cellHeight = 1 / cells.length * 100;
  return (
    <svg preserveAspectRatio="xMinYMin" width="100%" height="100%" viewBox="0 0 100 100">
      {cells.map((row, y) =>  {
        const cellWidth = 1 / row.length * 100;
        return row.map((cell, x) => {
          return (
            <Cell
              key={`${x}:${y}`} 
              x={x} 
              y={y} 
              width={cellWidth} 
              height={cellHeight} 
              color={cell.active ? cell.color : cell.baseColor}
              onClick={() => onClick?.(cell)}
              />
          );
        })
      })
      }
    </svg>
  );
}

type CellProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  onClick: () => void;
}
const Cell = ({x, y, width, height, color, onClick}: CellProps) => {
  return (
    <rect 
      style={{strokeWidth: 1, stroke: "white"}}
      x={x * width + "%"}
      y={y * height + "%"}
      width={width + "%"} 
      height={height + "%"} 
      fill={color} 
      onClick={() => onClick()}
    />
  );
}
