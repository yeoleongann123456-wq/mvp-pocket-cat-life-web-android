# Pocket Cat Life

Pocket Cat Life is a cozy virtual pet MVP built with plain HTML, CSS, and JavaScript. You care for Mochi the cat, earn coins, decorate the room, complete daily tasks, unlock achievements, install it as a PWA, and build a long-term bond over time.

Version 6 adds game-feel and retention systems: first-run tutorial, cat naming, mood status, sound effects, stronger floating feedback, level-up celebration, a home daily-goal tracker, and a Settings page.

Version 5 visual polish now rebuilds the main experience as a mobile game UI: a warm 3D-style room scene, a larger glossy toy-like cat, dark glass stat HUD, circular 3D action buttons, a game-style bottom tab bar, pastel task/shop/diary/bag screens, and shop categories for Food, Toys, Decor, and Collar items.

## How to Run

You can still open `index.html` directly in a browser to play the game.

For full PWA behavior, including service worker offline caching and install prompts, run it from a local web server or HTTPS hosting:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

On a real phone, host the folder on HTTPS or access a development server from the same network. Service workers do not register from plain `file://` pages.

## Version 6 Game Feel + Retention

- First-run tutorial:
  - Step 1 welcomes the player.
  - Step 2 teaches Feed and Pet.
  - Step 3 points players to Daily Tasks.
  - Tutorial can be skipped and is saved in `localStorage`.
- Cat naming:
  - First launch asks for a cat name.
  - Default name is `Mochi`.
  - The name appears on the Home screen and in mood/task text.
  - Settings allows renaming later.
- Mood system:
  - Home displays one current mood: Very Happy, Normal, Hungry, Tired, Dirty, or Sad.
  - Mood copy updates from Hunger, Happiness, Energy, and Cleanliness.
- Sound effects:
  - Web Audio API creates lightweight sounds without external files.
  - Click, feed, pet/play, coin, level-up, and deny sounds are supported.
  - Settings includes mute/unmute.
- Stronger feedback:
  - Actions show floating text.
  - Coin gains show flying coin animation.
  - Status and bond bars remain smoothly animated.
  - Level up opens a celebration modal.
- Daily goal:
  - Home shows daily task completion progress.
  - When all tasks are claimed, it shows `All tasks completed today!`.
- Settings:
  - Rename cat.
  - Toggle sound.
  - Reset game with two confirmations.

## localStorage Save Data

All save data is stored under:

```text
pocketCatLifeSave
```

The saved object includes:

- Core stats: `hunger`, `happiness`, `cleanliness`, `energy`
- Progression: `bond`, `level`, `coins`, `owned`
- Daily systems: `dailyDate`, `dailyTasks`, `checkin`
- Counters and unlocks: `counters`, `achievements`
- Events: `activeEvent`, `nextEventAt`
- Diary and bag: `diaryEntries`, `lastDiaryDate`, `inventory`
- Version 6 fields: `catName`, `namePrompted`, `tutorialComplete`, `soundMuted`
- Save timing: `lastSaved`

Existing saves migrate automatically. The storage key stays the same, so Version 1-5 saves are preserved.

## Testing Version 6

- Tutorial/name flow:
  - Open DevTools.
  - Run `localStorage.removeItem("pocketCatLifeSave")`.
  - Reload the page.
  - The name modal should appear first, followed by the 3-step tutorial.
- Reset:
  - Open Settings.
  - Tap `Reset Game`.
  - Confirm both browser dialogs.
  - The name modal and tutorial should return.
- Sound:
  - Open Settings.
  - Toggle Sound Off and confirm buttons no longer play sounds.
  - Toggle Sound On and tap Feed/Pet/Work to hear generated Web Audio effects.
- Daily goal:
  - Complete and claim all three daily tasks.
  - Home should show `All tasks completed today!`.

## Version 5 Cat Action Animation System

- Idle animation:
  - Gentle breathing
  - Slow tail sway
  - Occasional blinking
- Pet animation:
  - Mochi jumps happily
  - Eyes become happy curves
  - Floating heart effect appears
- Feed animation:
  - Food bowl appears
  - Mochi dips down to eat
  - Lick-mouth detail appears after eating
  - Hunger increases
- Play animation:
  - Yarn ball appears
  - Mochi pounces left and right
  - Happiness increases
  - Energy decreases
- Sleep animation:
  - Mochi lies down
  - Eyes close
  - Zzz floats upward
  - Energy restores in small timed steps
- Clean animation:
  - Bubbles appear
  - Mochi shakes
  - Cleanliness increases
- Work animation:
  - Mochi wears a small work hat and bag
  - Coins pop upward
  - Energy decreases
  - Coins increase
- State animation classes:
  - Hungry: low-energy posture
  - Dirty: dust spots appear
  - Sleepy: half-closed eyes
  - Happy: bouncier idle and faster tail
  - Sad: lowered head and sad mouth

## Version 5 Mobile Game UI

- Home screen:
  - Top HUD shows coins, bond level, growth stage, and bond progress.
  - Central 3D-style room includes a window, sunlight, curtains, rug, cat bed, wood floor, dresser, plant, and wall decor.
  - Mochi is rebuilt with layered CSS pieces, gradients, highlights, shadows, blush, paws, tail, collar, and action props.
  - Stats are shown in a dark glass card with colored progress bars.
  - Feed, Pet, Play, Sleep, Clean, and Work use circular 3D icon buttons with press bounce.
- Tasks screen:
  - Daily check-in, daily tasks, and achievements use warm pastel cards.
  - Daily tasks include progress bars and clear reward buttons.
- Shop screen:
  - Cozy Market categories: All, Food, Toys, Decor, Collar.
  - Food purchases add items to the bag.
  - Decor/collar purchases keep using the existing room ownership system.
- Diary screen:
  - Recent mood entries are displayed as cream/pink diary cards with a cat avatar.
- Bag screen:
  - Inventory is displayed as a two-column game item grid with rarity styling.

## Animation Class Names

- Idle: `cat-idle`
- Pet: `cat-pet`
- Feed: `cat-feed`
- Play: `cat-play`
- Sleep: `cat-sleep`
- Clean: `cat-clean`
- Work: `cat-work`
- Hungry: `cat-hungry`
- Dirty: `cat-dirty`
- Sleepy: `cat-sleepy`
- Happy: `cat-happy`
- Sad: `cat-sad`
- Room prop classes:
  - Pet props: `room-action-pet`
  - Feed props: `room-action-feed`
  - Play props: `room-action-play`
  - Sleep props: `room-action-sleep`
  - Clean props: `room-action-clean`
  - Work props: `room-action-work`

## Version 4 Features

- Bottom navigation:
  - Home
  - Tasks
  - Shop
  - Diary
  - Bag
- Daily check-in system:
  - 7-day reward track
  - Different coin rewards from Day 1 to Day 7
  - Day 7 special reward: extra coins plus a rare collar
  - Missed check-ins reset the streak back to Day 1
- Cat mood diary:
  - Automatically creates one diary entry per day
  - Updates based on care actions such as feeding, petting, playing, and checking in
  - Shows the most recent 7 diary entries
- Lucky draw system:
  - Costs coins per draw
  - Prize rarities: Common, Rare, Super Rare
  - Possible rewards: coins, food, toys, decor, rare collar
- Inventory:
  - Drawn items go into the bag
  - Duplicate items show quantities
  - Food and toys can be used
  - Decor can be placed
  - Rare collar can be equipped

## Version 3 PWA Features

- `manifest.json`
- `service-worker.js`
- App icons:
  - `icons/icon-192.png`
  - `icons/icon-512.png`
- Offline cache for:
  - `index.html`
  - `style.css`
  - `script.js`
  - `manifest.json`
  - app icons
- Android Chrome Add to Home Screen / Install app support
- iPhone Safari Add to Home Screen support
- Apple mobile web app meta tags
- `theme-color`
- Safe-area friendly mobile layout

## Install on Android

1. Open the hosted game in Chrome for Android.
2. Wait for the page to finish loading once.
3. Open the Chrome menu.
4. Tap **Add to Home screen** or **Install app**.
5. Launch **Pocket Cat** from the home screen.

## Install on iPhone

1. Open the hosted game in Safari on iPhone.
2. Tap the Share button.
3. Tap **Add to Home Screen**.
4. Confirm the name **Pocket Cat**.
5. Launch the game from the home screen icon.

## PWA Notes

- A PWA is not an APK.
- It is still a website, but it can feel close to an app when launched from the home screen.
- After the first successful online load, the game can open offline from the same installed PWA.
- Save data still uses the same `localStorage` key: `pocketCatLifeSave`.
- Existing Version 1-6 saves are preserved through migration.

## Earlier Game Features

- Mobile-friendly web layout
- CSS-drawn pastel cat
- Persistent save data with `localStorage`
- Cat stats:
  - Hunger
  - Happiness
  - Cleanliness
  - Energy
  - Bond
  - Coins
- Player actions:
  - Feed: increases hunger and costs coins
  - Pet: increases happiness and bond
  - Clean: increases cleanliness
  - Sleep: restores energy
  - Play: increases happiness and uses energy
  - Work: earns coins and uses energy
- Stats slowly change over time
- Offline stat decay/recovery when the player returns later
- Cat expression changes when needs are low or energy is low
- Shop with unlockable decorations
- Purchased items appear in the room
- Bond level system with coin rewards and decoration unlocks
- Daily task system with 3 tasks per day
- Cat growth stages:
  - Level 1-3: Kitten
  - Level 4-7: Young Cat
  - Level 8+: Adult Cat
- Random events
- Achievement system
- Reset button for starting a fresh save

## Next Step: Package as Android APK

The cleanest next step is Capacitor:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Pocket Cat Life" "com.example.pocketcatlife"
npx cap add android
npx cap sync android
npx cap open android
```

Then build and sign the APK or AAB in Android Studio.

For a production mobile release, also add splash screens, adaptive icons, safe-area testing, app signing, privacy notes, and QA on real devices.

## Next Stage Ideas

- More diary personalities
- Weekly check-in rewards
- Limited-time gacha banners
- More inventory item effects
- Item rarity collection screen
- Cat naming screen
- Daily login streak achievements
- More cat moods and animations
- More growth stages with visual changes
- Mini games for earning coins
- Sound effects and soft background music
- Multiple cats
- Cloud save and account login
