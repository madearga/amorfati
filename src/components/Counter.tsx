'use client';

import { computeCells } from '@/lib/grid';
import type { LifeGridState } from '@/lib/state';

interface Props {
  state: LifeGridState;
}

export default function Counter({ state }: Props) {
  const { remaining } = computeCells(state, state.granularity);
  return (
    <p className="text-center text-xl">
      <span className="font-bold text-blue-500">{remaining.toLocaleString()}</span>{' '}
      {state.granularity}s remaining
    </p>
  );
}
