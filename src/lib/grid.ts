import type { LifeGridState, Granularity } from './state';

const msPerUnit: Record<Granularity, number> = {
  day: 86400000,
  week: 604800000,
  month: 2629800000,
  year: 31557600000,
};

export interface GridData {
  total: number;
  lived: number;
  remaining: number;
}

export function computeCells(state: LifeGridState, granularity: Granularity): GridData {
  const birth = new Date(state.birthdate!);
  const now = new Date();
  const expectancyDate = new Date(birth);
  expectancyDate.setFullYear(birth.getFullYear() + state.expectancy);

  const ms = msPerUnit[granularity];
  const total = Math.ceil((expectancyDate.getTime() - birth.getTime()) / ms);
  const lived = Math.max(0, Math.ceil((now.getTime() - birth.getTime()) / ms));
  const remaining = Math.max(0, total - lived);

  return { total, lived, remaining };
}

export function scheduleLocalNotification(state: LifeGridState) {
  const existing = (window as any).__lifeGridNotifyTimer;
  if (existing) clearTimeout(existing);

  const [hours, minutes] = state.notifyTime.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);

  const delay = target.getTime() - now.getTime();
  (window as any).__lifeGridNotifyTimer = setTimeout(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Life Grid', {
        body: 'Time to reflect.',
        tag: 'life-grid-nightly',
      });
    }
    scheduleLocalNotification(state);
  }, delay);
}
