'use client';

import { useState } from 'react';
import { saveState, type LifeGridState } from '@/lib/state';

interface Props {
  state: LifeGridState;
  onClose: () => void;
}

export default function Settings({ state, onClose }: Props) {
  const [expectancy, setExpectancy] = useState(String(state.expectancy));
  const [notifyTime, setNotifyTime] = useState(state.notifyTime);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveState({
      expectancy: parseInt(expectancy),
      notifyTime,
    });
    onClose();
  };

  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-8">
      <div className="w-full max-w-sm">
        <h2 className="mb-6 text-2xl font-bold">Settings</h2>
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <label className="flex flex-col gap-1.5 text-sm text-zinc-400">
            Life expectancy
            <input
              type="number"
              value={expectancy}
              onChange={(e) => setExpectancy(e.target.value)}
              min={30}
              max={120}
              required
              className="h-12 rounded-xl border border-zinc-700 bg-zinc-800 px-4 text-zinc-100"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-zinc-400">
            Notification time
            <input
              type="time"
              value={notifyTime}
              onChange={(e) => setNotifyTime(e.target.value)}
              className="h-12 rounded-xl border border-zinc-700 bg-zinc-800 px-4 text-zinc-100"
            />
          </label>
          <button
            type="submit"
            className="h-12 rounded-xl bg-blue-600 text-base font-semibold text-white active:bg-blue-500"
          >
            Save
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-4 h-12 w-full rounded-xl border border-zinc-700 bg-zinc-800 text-base text-zinc-300 active:bg-zinc-700"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
