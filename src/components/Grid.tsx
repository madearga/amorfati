'use client';

import { computeCells } from '@/lib/grid';
import type { LifeGridState, Granularity } from '@/lib/state';
import Counter from './Counter';

interface Props {
  state: LifeGridState;
  onGranularityChange: (g: Granularity) => void;
  onOpenSettings: () => void;
}

const GRANULARITIES = ['day', 'week', 'month', 'year'] as const;

export default function Grid({ state, onGranularityChange, onOpenSettings }: Props) {
  const { total, lived } = computeCells(state, state.granularity);

  return (
    <div className="flex min-h-dvh flex-col p-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">Life Grid</h1>
        <div className="flex gap-1">
          {GRANULARITIES.map((g) => (
            <button
              key={g}
              onClick={() => onGranularityChange(g)}
              className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition ${
                state.granularity === g
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>
      </header>

      <Counter state={state} />

      <div className="mt-5 flex flex-wrap justify-center gap-0.5 overflow-y-auto px-2 pb-4">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`h-2.5 w-2.5 rounded-sm ${
              i < lived ? 'bg-blue-500' : 'bg-zinc-800'
            }`}
          />
        ))}
      </div>

      <button
        onClick={onOpenSettings}
        className="fixed bottom-6 right-6 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-lg hover:bg-zinc-700"
      >
        ⚙
      </button>
    </div>
  );
}
