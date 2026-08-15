---
artifact_contract: ce-unified-plan/v1
artifact_readiness: requirements-only
product_contract_source: ce-brainstorm
execution: code
title: Life Grid — requirements-only plan
date: 2026-08-16
type: feat
topic: life-grid
---

## Goal Capsule

**Objective:** Build "Life Grid" — a personal web app that shows a visual grid of time lived vs remaining, with nightly notifications for reflection.

**Product authority:** Self (personal tool for the builder).

**Open blockers:** None.

## Product Contract

### Summary

A single-screen web app. Onboarding captures birth date and life expectancy. The main view is a grid where each cell represents one unit of time (day/week/month/year) — filled cells = lived, empty = remaining. Toggle between granularities. One nightly push notification invites the user to open and reflect. No input, no journaling, no social features.

### Problem Frame

The user currently journals and daydreams for nightly reflection. They want a visual, ambient reminder that time is finite — something they can glance at in 10 seconds before sleep. The grid accumulates meaning through repeated viewing, not through interaction.

### Requirements

- R1. Onboarding captures birth date, life expectancy (default 70, adjustable), default granularity, and nightly notification time.
- R2. Main view renders a grid where each cell = one unit of time at the selected granularity (day / week / month / year).
- R3. Filled cells represent time already lived; empty cells represent remaining time.
- R4. Granularity toggle switches between day, week, month, and year views, recalculating the grid.
- R5. A counter below the grid displays remaining time in the active unit (e.g., "1,247 weeks remaining") and/or percentage lived.
- R6. One nightly push notification at the user's set time — tapping opens the app.
- R7. All data stored client-side (localStorage) — no backend, no account.

### Key Decisions

- KTD1. **Client-only storage** over backend + account. Trade-off: data is lost on device change but zero infrastructure cost and no auth complexity.
- KTD2. **Grid-only interaction** over grid + journaling. Journaling already happens elsewhere; this app is purely a visual lens.
- KTD3. **Multi-granularity toggle** over single fixed view. Each granularity delivers a different emotional weight.

### Scope Boundaries

**In scope:**
- Birth date input, life expectancy setting
- Time-unit grid with fill/empty states
- Granularity toggle (day/week/month/year)
- Counter showing remaining time
- One nightly push notification
- Client-side data persistence

**Deferred for later:**
- Multi-device sync or cloud backup
- Custom life expectancy per granularity
- Widget or home-screen complication
- Dark/light theme toggle (default to system preference)

**Outside this product's identity:**
- Journaling, note-taking, or any text input
- Social sharing or public profiles
- Gamification, streaks, or stats
- Death countdowns, morbid imagery, or "days until death" language

### Success Criteria

- SC1. Onboarding completes in under 60 seconds.
- SC2. Opening the app from notification shows the grid immediately (no loading spinner).
- SC3. Grid renders correctly for ages 0–100, all four granularities.
- SC4. Notification fires within ±5 minutes of the set time.
