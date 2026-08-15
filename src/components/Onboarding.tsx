'use client';

import { useState } from 'react';
import { saveState, type Granularity } from '@/lib/state';

interface Props {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: Props) {
  const [birthdate, setBirthdate] = useState('');
  const [expectancy, setExpectancy] = useState('70');
  const [granularity, setGranularity] = useState<Granularity>('week');
  const [notifyTime, setNotifyTime] = useState('21:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveState({
      birthdate,
      expectancy: parseInt(expectancy),
      granularity,
      notifyTime,
      onboarded: true,
    });
    onComplete();
  };

  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="mb-2 text-3xl font-bold">Life Grid</h1>
        <p className="mb-8 leading-relaxed text-zinc-400">
          Every box is a moment. See how many you&apos;ve lived — and how many remain.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col gap-1.5 text-sm text-zinc-400">
            When were you born?
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              required
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-2.5 text-base text-zinc-100"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-zinc-400">
            Life expectancy
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={expectancy}
                onChange={(e) => setExpectancy(e.target.value)}
                min={30}
                max={120}
                required
                className="w-24 rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-2.5 text-base text-zinc-100"
              />
              <span>years</span>
            </div>
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-zinc-400">
            Default view
            <select
              value={granularity}
              onChange={(e) => setGranularity(e.target.value as Granularity)}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-2.5 text-base text-zinc-100"
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-zinc-400">
            Nightly reminder
            <input
              type="time"
              value={notifyTime}
              onChange={(e) => setNotifyTime(e.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-2.5 text-base text-zinc-100"
            />
          </label>
          <button
            type="submit"
            className="mt-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500"
          >
            Begin
          </button>
        </form>
      </div>
    </div>
  );
}
