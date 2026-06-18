# Mochi - The Cat That Cares

Tagline: **Not a pet. A cat that cares.**

Mochi is a mobile-first wellness companion. The user does not take care of the cat. The cat helps take care of the user with gentle reminders, daily health check-ins, tiny tasks, and a growing emotional relationship.

The original Pocket Cat Life prototype is preserved as `legacy-pocket-cat.html`, but the main product direction is now the React MVP in `src/`.

## Features

- First-launch onboarding
  - Explains the Mochi concept
  - Lets the user choose a cat breed
  - Lets the user name the cat, defaulting to `Mochi`
- Cat breeds
  - Orange Cat
  - Ragdoll
  - British Shorthair
  - Black Cat
  - Munchkin
  - Each breed has different colors, personality, reminder tone, and dialogue style
- Home screen
  - Cozy 3D-style room
  - Chosen cat and cat name
  - Relationship level
  - Today's care summary: Water, Sleep, Steps, Mood, Next Reminder
- Cat dialogue
  - Time-of-day greeting
  - Breed-aware caring tone
  - Dialogue reacts to water and mood check-in status
- Health companion trackers
  - Water tracker
  - Sleep input
  - Step input
  - Mood check-in
- Tasks
  - Add tasks
  - Complete tasks
  - Completing tasks increases relationship
- Reminders
  - Add title, date, time, repeat option
  - Save reminders in `localStorage`
  - Show upcoming reminders
- Notifications
  - Does not ask on first launch
  - Mochi gently asks before requesting permission
  - Uses Browser Notification API if allowed
  - Falls back to in-app reminders
- Relationship system
  - Stranger
  - Friend
  - Best Friend
  - Family
  - Soul Companion
  - Relationship increases when the user drinks water, checks mood, completes tasks, logs sleep, and returns daily

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- React Router
- React Icons
- Framer Motion
- Firebase SDK preparation
- Firebase Cloud Messaging structure
- Capacitor readiness
- PWA support

## Project Structure

```text
src/
  assets/
  components/
  features/
    cat/
    health/
    relationship/
    reminders/
    tasks/
  hooks/
  pages/
  services/
    firebase/
    health/
    notifications/
    openai/
  store/
  styles/
  types/
  utils/
```

Important files:

```text
index.html                 React app entry
legacy-pocket-cat.html     Archived Pocket Cat Life prototype
service-worker.js          PWA cache worker
firebase-messaging-sw.js   FCM placeholder service worker
manifest.json              PWA manifest
capacitor.config.ts        Capacitor config
vite.config.ts             Vite + GitHub Pages build config
docs/                      Built GitHub Pages output
```

## Data Storage

Mochi uses `localStorage` for now.

Main key:

```text
mochiCareSave
```

Stored data:

- user profile
- cat breed
- cat name
- relationship points
- health logs
- tasks
- reminders
- notification preference

The older Pocket Cat save key, `pocketCatLifeSave`, is not deleted automatically.

## How to Run

Install dependencies:

```bash
pnpm install
```

Start development server:

```bash
pnpm dev
```

Build production files:

```bash
pnpm build
```

Preview production build:

```bash
pnpm preview
```

If pnpm prompts in a non-interactive environment:

```bash
CI=true pnpm install
./node_modules/.bin/tsc --noEmit
./node_modules/.bin/vite build
```

## How to Test Notifications

1. Run the app from `localhost` or HTTPS.
2. Complete onboarding.
3. Open the `Reminders` tab.
4. Tap `Allow Notifications` only when Mochi asks.
5. Add a reminder for the next few minutes.
6. Keep the tab open for in-app scheduling.

Notes:

- Browser notifications require permission.
- Some mobile browsers restrict scheduled web notifications.
- If permission is denied, Mochi continues with in-app reminders.
- Firebase Cloud Messaging structure exists, but production FCM credentials are not configured yet.

## GitHub Pages Deployment

Build:

```bash
pnpm build
```

Commit the generated `docs/` folder:

```bash
git add .
git commit -m "Reboot Mochi MVP"
git push origin main
```

GitHub Pages should use:

```text
Branch: main
Folder: /docs
```

## Capacitor

The project is ready for mobile wrapping:

```bash
pnpm cap:sync
pnpm cap:open:android
pnpm cap:open:ios
```

Native HealthKit, Health Connect, push notifications, and widgets still need platform-specific implementation.

## Future Roadmap

- Firebase sync
- AI cat chat
- Apple Health
- Android Health Connect
- Home screen widget
- Apple Watch companion
- Smarter recurring reminders
- Long-term emotional memory
- Breed-specific dialogue packs
- Cloud backup and account login
