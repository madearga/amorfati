'use client';

import { useEffect, useState } from 'react';
import { getState, saveState, type LifeGridState, type Granularity } from '@/lib/state';
import { scheduleLocalNotification } from '@/lib/grid';
import Onboarding from '@/components/Onboarding';
import Grid from '@/components/Grid';
import Settings from '@/components/Settings';

type Screen = 'loading' | 'onboarding' | 'grid' | 'settings';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('loading');
  const [appState, setAppState] = useState<LifeGridState>(getState);

  useEffect(() => {
    const state = getState();
    setAppState(state);
    if (state.onboarded && state.birthdate) {
      setScreen('grid');
      scheduleLocalNotification(state);
    } else {
      setScreen('onboarding');
    }
  }, []);

  const handleOnboardingComplete = () => {
    const state = getState();
    setAppState(state);
    setScreen('grid');
    scheduleLocalNotification(state);

    // Try register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  const handleGranularityChange = (granularity: Granularity) => {
    const state = saveState({ granularity });
    setAppState(state);
  };

  const handleOpenSettings = () => setScreen('settings');

  const handleCloseSettings = () => {
    setAppState(getState());
    setScreen('grid');
  };

  if (screen === 'loading') return null;

  if (screen === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (screen === 'settings') {
    return <Settings state={appState} onClose={handleCloseSettings} />;
  }

  return (
    <Grid
      state={appState}
      onGranularityChange={handleGranularityChange}
      onOpenSettings={handleOpenSettings}
    />
  );
}
