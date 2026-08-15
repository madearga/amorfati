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
  'You could leave life right now. Let that determine what you do and say and think.',
  'It is not that we have a short time to live, but that we waste a lot of it.',
  'Death is not the opposite of life, but a part of it.',
  'Live as if you were living already for the second time.',
  'How many people are missed when they are gone? Be one of them.',
  'The fear of death follows from the fear of life. A man who lives fully is prepared to die at any time.',
  'You are a ghost driving a meat-covered skeleton made of stardust. What are you afraid of?',
  'We have two lives. The second begins when we realize we only have one.',
  'No one knows whether death may not be the greatest of all blessings.',
  'Do not act as if you were going to live ten thousand years. Death hangs over you.',
  'Begin at once to live, and count each separate day as a separate life.',
  'The trouble is, you think you have time.',
  'Your days are numbered. Use them to throw open the windows of your soul.',
  'Every man dies. Not every man really lives.',
  'Time is a created thing. To say "I don\'t have time" is to say "I don\'t want to."',
  'In the end, it\'s not the years in your life that count. It\'s the life in your years.',
  'Tell me, what is it you plan to do with your one wild and precious life?',
  'The greatest gift you may ever give is your own life well-lived.',
  'When you arise in the morning, think of what a privilege it is to be alive — to breathe, to think, to enjoy, to love.',
  'Let each thing you would do, say, or intend be like that of a dying person.',
  'Dwell on the beauty of life. Watch the stars, and see yourself running with them.',
  'You are not a drop in the ocean. You are the entire ocean in a drop.',
  'What we do in life echoes in eternity.',
  'How we spend our days is, of course, how we spend our lives.',
  'Do not go gentle into that good night. Rage, rage against the dying of the light.',
  'If you are not willing to risk the unusual, you will have to settle for the ordinary.',
  'The two most important days in your life are the day you are born and the day you find out why.',
  'Do not postpone joy until you have learned all you think you need to know.',
  'The meaning of life is to give life meaning.',
  'We are here to awaken from the illusion of our separateness.',
  'You think this is just another day in your life. It is not just another day. It is the one day that is given to you today.',
  'It is only possible to live happily ever after on a day-to-day basis.',
  'Life can only be understood backwards, but it must be lived forwards.',
  'Be here now.',
  'Every morning we are born again. What we do today is what matters most.',
  'If you want to find the secrets of the universe, think in terms of energy, frequency, and vibration.',
  'You are what you love, not what loves you back.',
  'And in the end, the love you take is equal to the love you make.',
  'To live is the rarest thing in the world. Most people exist, that is all.',
  'The unexamined life is not worth living.',
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
        <p className="mt-2 text-sm italic leading-relaxed text-zinc-500">{msg}</p>
      )}
    </div>
  );
}
