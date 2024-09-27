"use client";

import { Suspense } from "react";
import { useGameData } from "../navigation";
import { Canvas } from "./Canvas";
import { PageBody } from "../../ui/PageBody";

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
    <PageBody title={data?.name ?? ""}>
        {data && (
          <Canvas config={data} />
        )}  
    </PageBody>
  );
}
