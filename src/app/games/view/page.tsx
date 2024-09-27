"use client";

import { Suspense } from "react";
import { GameRoutes, useGameData, useGameRouter } from "../navigation";
import { PageBody } from "@/app/ui/PageBody";
import { Button } from "@/app/ui/Button";

export default function View() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <Page />
    </Suspense>
  );
}

const Page = () => {
  const data = useGameData();
  const router = useGameRouter();

  return (
    <PageBody title={data?.name ?? ""}>
        <Button 
          onClick={() => router.push(GameRoutes.Create, data)}>
          Edit
        </Button>
        <Button 
          onClick={() => router.push(GameRoutes.Play, data)}>
          Play
        </Button>
        <Button 
          onClick={() => router.push(GameRoutes.Visualise, data)}>
          Visualise
        </Button>
    </PageBody>
  );
}
