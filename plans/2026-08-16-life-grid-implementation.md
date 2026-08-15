# Life Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-screen PWA that visualizes time lived vs remaining as a grid, with nightly push notifications for reflection.

**Architecture:** Vanilla HTML/CSS/JS with a service worker for push notifications. All data in localStorage. No backend, no framework, no build step. Open `index.html` directly or serve with any static server.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript (ES2022+), Service Worker API, Push API, Web App Manifest.

## Global Constraints

- Zero dependencies — no npm, no framework, no CDN
- All data client-side only (localStorage)
- Must work as PWA (installable, offline grid rendering)
- Push notifications via service worker
- Single file per concern (HTML, CSS, JS, SW)

---

## File Structure

- Create: `index.html` — onboarding form + main grid view, toggled by JS
- Create: `styles.css` — all visual styling, dark mode via `prefers-color-scheme`
- Create: `app.js` — state management, grid rendering, onboarding logic, notification scheduling
- Create: `sw.js` — service worker: push event handling, notification display
- Create: `manifest.json` — PWA manifest for installability

---

### Task 1: Project scaffold + onboarding form

**Files:**
- Create: `index.html`
- Create: `styles.css`

**Interfaces:**
- Produces: HTML structure with `#onboarding` and `#grid` containers, CSS custom properties for theming

- [ ] **Step 1: Create index.html with onboarding form**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Life Grid</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="manifest" href="manifest.json">
</head>
<body>
  <div id="onboarding" class="screen">
    <h1>Life Grid</h1>
    <p>Every box is a moment. See how many you've lived — and how many remain.</p>
    <form id="onboarding-form">
      <label>
        When were you born?
        <input type="date" id="birthdate" required>
      </label>
      <label>
        Life expectancy
        <input type="number" id="expectancy" value="70" min="30" max="120" required>
        <span>years</span>
      </label>
      <label>
        Default view
        <select id="default-granularity">
          <option value="day">Daily</option>
          <option value="week" selected>Weekly</option>
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
        </select>
      </label>
      <label>
        Nightly reminder
        <input type="time" id="notify-time" value="21:00">
      </label>
      <button type="submit">Begin</button>
    </form>
  </div>

  <div id="grid-view" class="screen hidden">
    <header>
      <h1>Life Grid</h1>
      <div class="granularity-tabs">
        <button data-granularity="day">Day</button>
        <button data-granularity="week" class="active">Week</button>
        <button data-granularity="month">Month</button>
        <button data-granularity="year">Year</button>
      </div>
    </header>
    <div id="counter"></div>
    <div id="grid-container"></div>
    <button id="settings-btn" class="icon-btn">⚙</button>
  </div>

  <div id="settings-panel" class="screen hidden">
    <h2>Settings</h2>
    <form id="settings-form">
      <label>
        Life expectancy
        <input type="number" id="settings-expectancy" min="30" max="120" required>
      </label>
      <label>
        Notification time
        <input type="time" id="settings-notify-time">
      </label>
      <button type="submit">Save</button>
    </form>
    <button id="settings-close">← Back</button>
  </div>

  <script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create styles.css with dark theme and grid layout**

```css
:root {
  --bg: #0d0d0d;
  --surface: #1a1a1a;
  --text: #e0e0e0;
  --text-muted: #888;
  --filled: #4a9eff;
  --empty: #2a2a2a;
  --accent: #4a9eff;
  --radius: 8px;
  --gap: 2px;
  color-scheme: dark;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.screen {
  width: 100%;
  max-width: 480px;
  padding: 24px;
}

.hidden { display: none !important; }

#onboarding h1 {
  font-size: 2rem;
  margin-bottom: 8px;
}

#onboarding p {
  color: var(--text-muted);
  margin-bottom: 32px;
  line-height: 1.5;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.85rem;
  color: var(--text-muted);
}

input, select, button {
  background: var(--surface);
  color: var(--text);
  border: 1px solid #333;
  border-radius: var(--radius);
  padding: 10px 14px;
  font-size: 1rem;
  font-family: inherit;
}

button {
  cursor: pointer;
  background: var(--accent);
  color: #fff;
  border: none;
  font-weight: 600;
}

.icon-btn {
  background: var(--surface);
  color: var(--text);
  border: 1px solid #333;
  font-size: 1.2rem;
  padding: 8px 12px;
  border-radius: var(--radius);
}

#grid-view header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

#grid-view header h1 { font-size: 1.2rem; }

.granularity-tabs {
  display: flex;
  gap: 4px;
}

.granularity-tabs button {
  background: var(--surface);
  color: var(--text-muted);
  border: 1px solid #333;
  padding: 6px 10px;
  font-size: 0.75rem;
}

.granularity-tabs button.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

#counter {
  text-align: center;
  font-size: 1.4rem;
  margin-bottom: 20px;
}

#counter span { color: var(--accent); font-weight: 700; }

#grid-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap);
  justify-content: center;
  max-height: 60dvh;
  overflow-y: auto;
  padding: 8px;
}

.cell {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: var(--empty);
}

.cell.filled { background: var(--filled); }

#settings-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
}

#settings-panel button { margin-top: 16px; }
```

- [ ] **Step 3: Verify the page renders**

Open `index.html` in a browser. Confirm onboarding form is visible, dark theme applied, form fields styled.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: scaffold onboarding form and dark theme styles"
```

---

### Task 2: Core state + onboarding logic

**Files:**
- Create: `app.js`

**Interfaces:**
- Produces: `getState()`, `saveState(state)`, `showScreen(name)` — used by all later tasks

- [ ] **Step 1: Write state management and screen switching**

```js
// app.js — Life Grid state & navigation

const STORAGE_KEY = 'life-grid-state';

const DEFAULTS = {
  birthdate: null,       // ISO date string
  expectancy: 70,
  granularity: 'week',
  notifyTime: '21:00',
  onboarded: false,
};

function getState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

function saveState(partial) {
  const state = { ...getState(), ...partial };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(el => el.classList.add('hidden'));
  const target = document.getElementById(name === 'onboarding' ? 'onboarding' :
                    name === 'settings' ? 'settings-panel' : 'grid-view');
  target.classList.remove('hidden');
}

// Onboarding form handler
document.getElementById('onboarding-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const state = saveState({
    birthdate: document.getElementById('birthdate').value,
    expectancy: parseInt(document.getElementById('expectancy').value),
    granularity: document.getElementById('default-granularity').value,
    notifyTime: document.getElementById('notify-time').value,
    onboarded: true,
  });
  showScreen('grid');
  renderGrid(state);
  scheduleNotification(state);
});

// Initialize
const state = getState();
if (state.onboarded && state.birthdate) {
  showScreen('grid');
  renderGrid(state);
} else {
  showScreen('onboarding');
}
```

- [ ] **Step 2: Verify onboarding flow**

Open `index.html`, fill form, submit. Confirm localStorage has the saved state. Refresh — should go straight to grid view (grid won't render yet, but screen should switch).

- [ ] **Step 3: Commit**

```bash
git add app.js
git commit -m "feat: add state management and onboarding flow"
```

---

### Task 3: Grid rendering engine

**Files:**
- Modify: `app.js` — add `renderGrid(state)`, `computeCells(state)`

**Interfaces:**
- Consumes: `getState()` from Task 2
- Produces: `renderGrid(state)`, `computeCells(state, granularity)` — called by granularity toggle (Task 4)

- [ ] **Step 1: Add grid computation and rendering**

```js
// Insert after DEFAULTS, before event listeners

function computeCells(state, granularity) {
  const birth = new Date(state.birthdate);
  const now = new Date();
  const expectancyDate = new Date(birth);
  expectancyDate.setFullYear(birth.getFullYear() + state.expectancy);

  const msPerUnit = {
    day: 86400000,
    week: 604800000,
    month: 2629800000,  // avg
    year: 31557600000,  // 365.25 days
  };

  const total = Math.ceil((expectancyDate - birth) / msPerUnit[granularity]);
  const lived = Math.max(0, Math.ceil((now - birth) / msPerUnit[granularity]));
  const remaining = Math.max(0, total - lived);

  return { total, lived, remaining };
}

function renderGrid(state) {
  const { total, lived, remaining } = computeCells(state, state.granularity);
  const container = document.getElementById('grid-container');

  // Counter
  const unitLabel = state.granularity;
  document.getElementById('counter').innerHTML =
    `<span>${remaining.toLocaleString()}</span> ${unitLabel}s remaining`;

  // Grid
  container.innerHTML = '';
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < total; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell' + (i < lived ? ' filled' : '');
    fragment.appendChild(cell);
  }
  container.appendChild(fragment);

  // Update active tab
  document.querySelectorAll('.granularity-tabs button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.granularity === state.granularity);
  });
}
```

- [ ] **Step 2: Verify grid renders**

Open the app (clear localStorage if already onboarded). Complete onboarding. Confirm grid shows filled cells (blue) and empty cells (dark) matching age. Confirm counter shows remaining count.

- [ ] **Step 3: Test edge cases**

Set birthdate to today → 0-1 cells filled. Set birthdate to 100 years ago → all cells filled. Set expectancy to 30 with birthdate 40 years ago → all cells filled, 0 remaining.

- [ ] **Step 4: Commit**

```bash
git add app.js
git commit -m "feat: add grid computation and rendering engine"
```

---

### Task 4: Granularity toggle

**Files:**
- Modify: `app.js` — add tab click handlers

**Interfaces:**
- Consumes: `renderGrid(state)` from Task 3, `getState()`, `saveState()` from Task 2

- [ ] **Step 1: Add granularity tab handlers**

```js
// Insert after renderGrid definition

document.querySelectorAll('.granularity-tabs button').forEach(btn => {
  btn.addEventListener('click', () => {
    const state = getState();
    state.granularity = btn.dataset.granularity;
    saveState({ granularity: state.granularity });
    renderGrid(state);
  });
});
```

- [ ] **Step 2: Verify toggle**

Open grid view. Click Day, Week, Month, Year tabs. Confirm grid recalculates, counter updates, active tab highlights.

- [ ] **Step 3: Commit**

```bash
git add app.js && git commit -m "feat: add granularity toggle (day/week/month/year)"
```

---

### Task 5: Settings panel

**Files:**
- Modify: `app.js` — add settings open/close/save handlers

**Interfaces:**
- Consumes: `showScreen()` from Task 2, `renderGrid()` from Task 3, `getState()`, `saveState()` from Task 2

- [ ] **Step 1: Add settings handlers**

```js
// Settings open
document.getElementById('settings-btn').addEventListener('click', () => {
  const state = getState();
  document.getElementById('settings-expectancy').value = state.expectancy;
  document.getElementById('settings-notify-time').value = state.notifyTime;
  showScreen('settings');
});

// Settings close
document.getElementById('settings-close').addEventListener('click', () => {
  showScreen('grid');
  renderGrid(getState());
});

// Settings save
document.getElementById('settings-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const state = saveState({
    expectancy: parseInt(document.getElementById('settings-expectancy').value),
    notifyTime: document.getElementById('settings-notify-time').value,
  });
  showScreen('grid');
  renderGrid(state);
  scheduleNotification(state);
});
```

- [ ] **Step 2: Verify settings flow**

Open settings from grid, change expectancy to 80, save. Confirm grid recalculates with new total. Change back. Confirm notification time persists across reload.

- [ ] **Step 3: Commit**

```bash
git add app.js && git commit -m "feat: add settings panel (expectancy + notification time)"
```

---

### Task 6: PWA + service worker + push notifications

**Files:**
- Create: `sw.js`
- Create: `manifest.json`
- Modify: `app.js` — add `scheduleNotification(state)`, service worker registration

**Interfaces:**
- Consumes: `getState()` from Task 2
- Produces: `scheduleNotification(state)` — called by onboarding submit and settings save

- [ ] **Step 1: Create manifest.json**

```json
{
  "name": "Life Grid",
  "short_name": "Life Grid",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#0d0d0d",
  "theme_color": "#0d0d0d",
  "icons": []
}
```

- [ ] **Step 2: Create service worker**

```js
// sw.js — Life Grid service worker

self.addEventListener('push', (event) => {
  const data = event.data?.json() || { title: 'Life Grid', body: 'Time to reflect.' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      requireInteraction: false,
      tag: 'life-grid-nightly',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
```

- [ ] **Step 3: Register service worker and schedule notifications in app.js**

```js
// Insert at the bottom of app.js

async function registerSW() {
  if (!('serviceWorker' in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.register('/sw.js');
    console.log('SW registered');
    return reg;
  } catch (err) {
    console.warn('SW registration failed:', err);
  }
}

async function scheduleNotification(state) {
  if (!('Notification' in window)) return;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return;

  // Cancel any existing scheduled notification
  // Native push requires a server to send — for a client-only app,
  // we use the Notification API directly with a timeout.
  scheduleLocalNotification(state);
}

function scheduleLocalNotification(state) {
  // Clear existing scheduled notification
  const existingTimer = window.__lifeGridNotifyTimer;
  if (existingTimer) clearTimeout(existingTimer);

  const [hours, minutes] = state.notifyTime.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);

  if (target <= now) target.setDate(target.getDate() + 1);

  const delay = target - now;

  window.__lifeGridNotifyTimer = setTimeout(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // If SW is active, it handles the notification
    }
    // Fallback: show directly
    new Notification('Life Grid', {
      body: 'Time to reflect.',
      icon: '/icon-192.png',
      tag: 'life-grid-nightly',
    });
    // Re-schedule for next day
    scheduleLocalNotification(state);
  }, delay);

  console.log(`Notification scheduled for ${target.toLocaleString()}`);
}

// Initialize SW registration
registerSW().then(() => {
  const state = getState();
  if (state.onboarded) scheduleLocalNotification(state);
});
```

- [ ] **Step 4: Verify PWA + notifications**

Serve with `npx serve .` (or any static server — SW requires HTTPS or localhost). Open, complete onboarding, grant notification permission. Confirm notification fires at set time. Add to home screen — confirm standalone mode works.

- [ ] **Step 5: Commit**

```bash
git add sw.js manifest.json app.js
git commit -m "feat: add PWA manifest, service worker, and nightly notifications"
```

---

### Task 7: Final integration test + polish

**Files:**
- Modify: `index.html` — add meta theme-color
- Modify: `app.js` — initialize on DOMContentLoaded

- [ ] **Step 1: Guard app.js init behind DOMContentLoaded**

Wrap the initialization block at the bottom of `app.js`:

```js
// Replace the direct init calls at the bottom with:
document.addEventListener('DOMContentLoaded', () => {
  const state = getState();
  if (state.onboarded && state.birthdate) {
    showScreen('grid');
    renderGrid(state);
  } else {
    showScreen('onboarding');
  }
});
```

- [ ] **Step 2: Add meta theme-color**

Insert in `<head>` of `index.html`:

```html
<meta name="theme-color" content="#0d0d0d">
```

- [ ] **Step 3: Full flow test**

1. Clear localStorage, open app → onboarding shown
2. Fill form: birth 1990-01-01, expectancy 70, weekly, 21:00 → grid renders
3. Toggle granularity → grid recalculates
4. Open settings → change expectancy → save → grid recalculates
5. Refresh page → grid shown directly (onboarded=true persists)
6. Notification fires at 21:00 → tap → opens app
7. Dark mode via system preference → app follows
8. Install as PWA → standalone mode works

- [ ] **Step 4: Commit**

```bash
git add index.html app.js
git commit -m "feat: DOMContentLoaded guard, theme-color meta, integration polish"
```
