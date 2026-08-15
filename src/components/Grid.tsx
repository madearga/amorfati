'use client';

import { useMemo } from 'react';
import { computeCells } from '@/lib/grid';
import type { LifeGridState, Granularity } from '@/lib/state';
import Counter from './Counter';

interface Props {
  state: LifeGridState;
  onGranularityChange: (g: Granularity) => void;
  onOpenSettings: () => void;
}

const GRANULARITIES = ['day', 'week', 'month', 'year'] as const;

// Dynamic cell size: fill ~90vw with ~52 cols (year) up to dense (day)
function cellPx(g: Granularity): number {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 390;
  const cols = g === 'year' ? 52 : g === 'month' ? 52 : g === 'week' ? 52 : 36;
  const gap = 2;
  const available = vw * 0.92 - cols * gap;
  const size = Math.floor(available / cols);
  return Math.max(4, Math.min(14, size));
}

export default function Grid({ state, onGranularityChange, onOpenSettings }: Props) {
  const { total, lived } = computeCells(state, state.granularity);
  const size = useMemo(() => cellPx(state.granularity), [state.granularity]);

  return (
    <div className="flex min-h-dvh flex-col px-4 pt-4 pb-safe">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">Amor Fati</h1>
        <div className="flex gap-1">
          {GRANULARITIES.map((g) => (
            <button
              key={g}
              onClick={() => onGranularityChange(g)}
              className={`min-h-[36px] min-w-[44px] rounded-md border px-2.5 py-1.5 text-xs font-medium transition ${
                state.granularity === g
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-zinc-700 bg-zinc-800 text-zinc-400 active:bg-zinc-700'
              }`}
            >
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>
      </header>

      <Counter state={state} />

      <div
        className="grid-scroll mt-4 flex-1 overflow-y-auto px-1 pb-16"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2px',
          alignContent: 'flex-start',
        }}
      >
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            style={{ width: size, height: size }}
            className={`rounded-sm ${
              i < lived ? 'bg-blue-500' : 'bg-zinc-800'
            }`}
          />
        ))}
      </div>

      <button
        onClick={onOpenSettings}
        className="fixed bottom-6 right-6 z-10 flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 text-lg active:bg-zinc-700"
        style={{ bottom: 'max(24px, env(safe-area-inset-bottom, 0px) + 16px)' }}
        aria-label="Settings"
      >
        ⚙
      </button>
    </div>
  );
}

      <p className="mt-auto pb-2 text-center text-xs text-zinc-600">
        Created by{' '}
        <a
          href="https://argakuka.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-500 underline underline-offset-2 hover:text-zinc-400"
        >
          @argakuka
        </a>
      </p>
