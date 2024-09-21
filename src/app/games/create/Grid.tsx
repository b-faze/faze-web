"use client";

import { CellData } from "../useGrid";

type GridProps = {
  cells: CellData[][];
  onClick: (data: CellData) => void;
};
const Grid = ({cells, onClick}: GridProps) => {
  return (
    <table>
      <tbody>
        {cells.map((r, i) => (
          <Row key={i} cells={r} onClick={onClick}/>
        ))}
      </tbody>
    </table>
  );
};

type RowProps = {
  cells: CellData[];
  onClick: (data: CellData) => void;
};
const Row = ({cells, onClick}: RowProps) => {
  return (
    <tr>
      {cells.map((c, i) => (
        <Cell key={i} data={c} onClick={onClick} />
      ))}
    </tr>
  );
}

type CellProps = {
  data: CellData;
  onClick: (data: CellData) => void;
}
const Cell = ({data, onClick}: CellProps) => {
  const size = 100;
  return (
    <td
      style={{
        border: "1px solid black",
        backgroundColor: data.active ? data.color : "white",
        width: size,
        height: size
      }}
      onClick={() => onClick(data)}
    >
      
    </td>
  )
};

export default Grid;