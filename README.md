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
  - Lucky Dragon Cat
  - Each breed has different colors, personality, reminder tone, and dialogue style
- Home screen
  - Sticky Pet Society-style cozy room, so the cat stays visible while actions are used
  - Cute toy-like 3D CSS cat with breed colors, expressions, collar, tail, and reactions
  - Chosen cat, cat name, relationship level, and stars
  - Relationship level
  - Today's care summary: Water, Sleep, Steps, Mood, Next Reminder
- Game feel actions
  - Compact icon actions near the cat: Water, Pet, Play, Sleep, Clean, Focus
  - Floating reward text and animated cat reactions
- Mochi Visual Rework V3
  - Plush mascot proportions: oversized head, tiny body, glossy eyes, soft cheeks, paws, fluffy tail
  - Breed-specific silhouettes, markings, tail types, and idle poses
  - Cat interactions: tap, double tap, long press, and drag with relationship feedback
  - Pet Society-style room depth with wall, floor, sunlight, rug, furniture, and item placement
- Mochi Audio Upgrade V1
  - Web Audio sound system with no autoplay before user interaction
  - Cat sounds: meow, purr, sleepy cat, happy cat, eating
  - UI sounds: button click, reward, task complete, level up-style chimes, purchase
  - Ambient loops: day, night, rain
  - Background music loops: cozy piano, soft lofi, relaxing
  - Sound on/off toggle, music volume slider, SFX volume slider, music/ambience selectors
- Cat collection
  - Locked and unlocked cat preview cards
  - Unlock goals for Ragdoll, British Shorthair, Black Cat, Munchkin, and Lucky Dragon Cat
  - Switch between unlocked cats
- Shop preview
  - Clear item cards with large preview, category, price, description, and before/after text
  - Purchased room items appear inside the room, including rugs, plants, cat beds, toys, windows, shelves, and collars
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
- stars
- owned shop items
- audio settings: enabled, music volume, SFX volume, music track, ambience track
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

Then open:

```text
http://localhost:5173/app.html
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

## How to Test Cat Switching

1. Open the `Cat` tab.
2. Scroll to `Cat Collection`.
3. The Orange Cat is unlocked by default.
4. Tap `Use Cat` on any unlocked cat.
5. Return to `Home`; the sticky room should immediately show the selected cat.
6. Locked cats stay visible as faded preview cards with their unlock condition.

## How to Test Cat Interactions

1. Open `Home`.
2. Tap the cat once: Mochi smiles and gives love feedback.
3. Double tap the cat: Mochi jumps and relationship/stars increase.
4. Long press the cat: Mochi purrs with closed, happy energy.
5. Lightly drag the cat: Mochi follows slightly and returns smoothly.
6. Use action buttons: `Pet`, `Water`, `Play`, `Sleep`, `Clean`, and `Focus` change the cat's expression and animation.

## How to Test Audio

1. Open the app in Safari or Chrome.
2. Tap any button once. Audio starts only after this user gesture.
3. Open the `Sound` panel near the top of the app.
4. Toggle sound on/off.
5. Adjust `Music Volume` and `SFX Volume`.
6. Try music tracks: `Cozy Piano`, `Soft Lofi`, `Relaxing`.
7. Try ambience: `Day`, `Night`, `Rain`, `Off`.
8. Tap Mochi, pet Mochi, use Water/Play/Sleep, buy a shop item, and complete a task to hear different SFX.

Audio is synthesized with the browser Web Audio API, so no large audio files are required and the PWA remains offline-friendly.

Unlock examples:

- Ragdoll: complete 3 days of health check-in.
- British Shorthair: complete 10 tasks.
- Black Cat: record care on 7 different days.
- Munchkin: hit the water goal on 5 days.
- Lucky Dragon Cat: build a long relationship streak.

## How to Test Shop Preview

1. Open the `Cat` tab.
2. Use the category chips: `Room`, `Furniture`, `Cat Bed`, `Rug`, `Window`, `Plants`, `Collar`, `Toys`.
3. Each item card shows a large preview, description, before/after effect, price, and status.
4. Tap `Buy` if you have enough stars.
5. Return to `Home`; bought room items should appear in the room.
6. Buying the rose collar should make the cat wear it in the room.

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

The build also copies the generated app shell to root `index.html` as a fallback for Pages cache/source changes.

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
