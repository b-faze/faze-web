"use client";

import { Input, Field, Label, Description, Button } from '@headlessui/react'
import { Suspense, useCallback, useState } from 'react';
import Grid from './Grid';
import { GameRoutes, useGameData, useGameRouter } from '../navigation';
import { useGrid, useWinningStates } from './useGrid';

export default function Create() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <Page />
    </Suspense>
  );
}

const Page = () => {
  const data = useGameData();
  const router = useGameRouter();
  const [name, setName] = useState(data?.name ?? "New game");
  const [size] = useState(data?.gridSize ?? 3);
  const {grid, toggle, reset: resetGrid} = useGrid(size);
  const {states, add, reset: resetStates} = useWinningStates(data?.winningStates ?? []);

  const onAdd = useCallback(() => {
    add(grid);
    resetGrid();
  }, [grid, add, resetGrid]);

  const onPlay = useCallback(() => {
    router.push(GameRoutes.Play, {
      name: name,
      gridSize: size,
      winningStates: states,
    })
  }, [router, name, size, states]);

  return (
    <div className="">
      <main className="">
        <TextInput label="Name" defaultValue={name} onChange={setName} />

        <div className="flex">
          <Grid cells={grid.cells} onClick={toggle} />
          <Button 
            onClick={() => onAdd()}
            className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
            Add
          </Button>
          <div style={{padding: 16}}>
            {states.map(s => (
              <p key={s}>{s}</p>
            ))}
          </div>
          <Button 
            onClick={() => resetStates()}
            className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
            Reset
          </Button>
        </div>


        <Button 
          onClick={onPlay}
          className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
          Play
        </Button>
      </main>
    </div>
  );
};

type TextInputProps = {
  label: string;
  description?: string;
  defaultValue?: string;
  onChange: (value: string) => void;
};
const TextInput = ({label, description, defaultValue, onChange}: TextInputProps) => {
  return (
    <Field>
      <Label className="text-sm/6 font-medium">{label}</Label>
      {!!description && (
        <Description className="text-sm/6">
          {description}
        </Description>
      )}
      <Input
        defaultValue={defaultValue}
        onChange={e => onChange(e.currentTarget.value)}
        className="mt-3 block w-full rounded-lg bg-black/5 py-1.5 px-3 text-sm/6 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2"
      />
    </Field>
  );
};

