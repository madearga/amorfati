// Life Grid state — localStorage + defaults

const STORAGE_KEY = 'life-grid-state';

export type Granularity = 'day' | 'week' | 'month' | 'year';

export interface LifeGridState {
  birthdate: string | null;
  expectancy: number;
  granularity: Granularity;
  notifyTime: string;
  onboarded: boolean;
}

const DEFAULTS: LifeGridState = {
  birthdate: null,
  expectancy: 70,
  granularity: 'week',
  notifyTime: '21:00',
  onboarded: false,
};

export function getState(): LifeGridState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveState(partial: Partial<LifeGridState>): LifeGridState {
  const state = { ...getState(), ...partial };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}
