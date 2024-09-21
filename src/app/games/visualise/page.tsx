"use client";

import { Suspense } from "react";
import { useGameData } from "../navigation";
import { Canvas } from "./Canvas";

export default function Visualise() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <Page />
    </Suspense>
  );
}

const Page = () => {
  const data = useGameData();

  return (
    <div>
      <h1>{data?.name}</h1>
      <div className="grid items-center justify-items-center">
        {data && (
          <Canvas config={data} />
        )}
      </div>    
    </div>
  );
}
