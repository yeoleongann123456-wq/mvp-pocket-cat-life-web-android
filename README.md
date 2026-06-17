# Pocket Cat Life

Pocket Cat Life is a cozy virtual pet MVP built with plain HTML, CSS, and JavaScript. You care for Mochi the cat, earn coins, decorate the room, complete daily tasks, unlock achievements, install it as a PWA, and build a long-term bond over time.

Version 5 adds the Cat Action Animation System. Mochi now reacts with CSS animations when the player feeds, pets, cleans, plays, sleeps, or works.

Version 5 visual polish also pushes the Home screen closer to a 3D mobile pet game: darker app shell, warm 3D room styling, round action buttons, a larger glossy cat, and stronger shadows/highlights.

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
- Existing Version 1, Version 2, and Version 3 saves are preserved.

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
