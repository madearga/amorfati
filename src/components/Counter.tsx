'use client';

import { useState, useEffect } from 'react';
import { computeCells } from '@/lib/grid';
import type { LifeGridState } from '@/lib/state';

const MESSAGES = [
  'You will never be this young again.',
  'This moment is all there ever is.',
  'The days are long, but the years are short.',
  'What would you do if this were your last week?',
  'Time is the only currency you cannot earn back.',
  'Every cell you see empty — someone older would trade anything for it.',
  'You are not running out of time. You are filling it.',
  'Memento mori. Remember you must die.',
  'The graveyard is the richest place on earth — full of unwritten books, unlaunched businesses, unsaid words.',
  'One day, someone will say your name for the last time.',
  'Stop waiting. Start now.',
  'The best time to plant a tree was 20 years ago. The second best time is now.',
  'Amor fati — love your fate. Every cell, filled or empty, is yours.',
];

interface Props {
  state: LifeGridState;
}

export default function Counter({ state }: Props) {
  const { remaining } = computeCells(state, state.granularity);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setMsg(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
  }, [state.granularity]);

  return (
    <div className="text-center">
      <p className="text-xl">
        <span className="font-bold text-blue-500">{remaining.toLocaleString()}</span>{' '}
        {state.granularity}s remaining
      </p>
      {msg && (
        <p className="mt-2 text-sm italic text-zinc-500">{msg}</p>
      )}
    </div>
  );
}
