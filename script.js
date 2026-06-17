const STORAGE_KEY = "pocketCatLifeSave";
const DAY_MS = 24 * 60 * 60 * 1000;
const EVENT_INTERVAL_MS = 45000;

const catActionClasses = [
  "cat-pet",
  "cat-feed",
  "cat-play",
  "cat-sleep",
  "cat-clean",
  "cat-work"
];

const roomActionClasses = [
  "room-action-pet",
  "room-action-feed",
  "room-action-play",
  "room-action-sleep",
  "room-action-clean",
  "room-action-work"
];

const catStateClasses = [
  "happy",
  "sad",
  "sleepy",
  "cat-happy",
  "cat-sad",
  "cat-sleepy",
  "cat-hungry",
  "cat-dirty"
];

const actionDurations = {
  pet: 900,
  feed: 1600,
  play: 1300,
  sleep: 2300,
  clean: 1000,
  work: 1300
};

const defaultState = {
  hunger: 82,
  happiness: 84,
  cleanliness: 86,
  energy: 78,
  bond: 0,
  level: 1,
  coins: 60,
  owned: [],
  lastSaved: Date.now(),
  message: "Your cat is happy to see you.",
  dailyDate: todayKey(),
  dailyTasks: [],
  counters: {
    feed: 0,
    pet: 0,
    clean: 0,
    sleep: 0,
    play: 0,
    work: 0
  },
  achievements: [],
  activeEvent: null,
  nextEventAt: Date.now() + EVENT_INTERVAL_MS,
  checkin: {
    lastDate: "",
    streak: 0,
    claimedToday: false
  },
  diaryEntries: [],
  inventory: {},
  lastDiaryDate: ""
};

const checkinRewards = [
  { day: 1, coins: 20, label: "20 C" },
  { day: 2, coins: 25, label: "25 C" },
  { day: 3, coins: 30, label: "30 C" },
  { day: 4, coins: 40, label: "40 C" },
  { day: 5, coins: 55, label: "55 C" },
  { day: 6, coins: 75, label: "75 C" },
  { day: 7, coins: 120, itemId: "rare_collar", label: "120 C + Rare Collar" }
];

const dailyTaskPool = [
  { id: "feed_3", action: "feed", label: "Feed Mochi 3 times", target: 3, reward: 30 },
  { id: "pet_5", action: "pet", label: "Pet Mochi 5 times", target: 5, reward: 35 },
  { id: "work_2", action: "work", label: "Work 2 times", target: 2, reward: 45 },
  { id: "clean_2", action: "clean", label: "Clean Mochi 2 times", target: 2, reward: 30 },
  { id: "play_3", action: "play", label: "Play 3 times", target: 3, reward: 40 },
  { id: "sleep_2", action: "sleep", label: "Let Mochi nap 2 times", target: 2, reward: 28 }
];

const achievementDefs = [
  {
    id: "firstFeed",
    name: "First Feed",
    description: "Feed Mochi for the first time.",
    isUnlocked: () => state.counters.feed >= 1
  },
  {
    id: "coins100",
    name: "100 Coins",
    description: "Hold at least 100 coins.",
    isUnlocked: () => state.coins >= 100
  },
  {
    id: "level5",
    name: "Level 5",
    description: "Reach Bond Level 5.",
    isUnlocked: () => state.level >= 5
  },
  {
    id: "happyCat",
    name: "Happy Cat",
    description: "Raise happiness to 100.",
    isUnlocked: () => state.happiness >= 100
  }
];

const randomEvents = [
  {
    id: "foundCoins",
    title: "Tiny Treasure",
    text: "Mochi found coins under the soft blanket.",
    button: "Collect",
    apply: () => {
      const reward = randomInt(14, 28);
      state.coins += reward;
      gainBond(2);
      setMessage(`Mochi found ${reward} coins and looks very proud.`);
    }
  },
  {
    id: "messyRoom",
    title: "Messy Room",
    text: "Mochi played too hard and scattered fluff everywhere.",
    button: "Tidy Up",
    apply: () => {
      adjustStats({ cleanliness: 14, happiness: 4 });
      gainBond(3);
      setMessage("You tidied the room together. Mochi feels understood.");
    }
  },
  {
    id: "cuddleWish",
    title: "Cuddle Request",
    text: "Mochi is rubbing against your hand and wants affection.",
    button: "Cuddle",
    apply: () => {
      adjustStats({ happiness: 12 });
      gainBond(7);
      incrementActionProgress("pet");
      setMessage("Mochi melted into your hand. Tiny trust, big feeling.");
    }
  }
];

const inventoryItems = {
  food_snack: {
    name: "Warm Snack",
    type: "Food",
    rarity: "Common",
    description: "Use to restore 18 hunger.",
    action: "Use"
  },
  toy_mouse: {
    name: "Tiny Mouse Toy",
    type: "Toy",
    rarity: "Common",
    description: "Use to restore 14 happiness.",
    action: "Use"
  },
  decor_cloud: {
    name: "Cloud Cushion",
    type: "Decor",
    rarity: "Rare",
    description: "A soft prize for the room shelf.",
    action: "Place"
  },
  rare_collar: {
    name: "Moonbell Collar",
    type: "Collar",
    rarity: "Super Rare",
    description: "A rare collar from a lucky day.",
    action: "Equip"
  }
};

const lotteryPrizes = [
  { kind: "coins", name: "Coin Pouch", rarity: "Common", weight: 52, coins: 18 },
  { kind: "item", itemId: "food_snack", rarity: "Common", weight: 26 },
  { kind: "item", itemId: "toy_mouse", rarity: "Rare", weight: 14 },
  { kind: "item", itemId: "decor_cloud", rarity: "Rare", weight: 6 },
  { kind: "item", itemId: "rare_collar", rarity: "Super Rare", weight: 2 }
];

const shopItems = [
  {
    id: "bed",
    name: "Soft Cat Bed",
    description: "A cozy bed for slow afternoons.",
    cost: 45,
    unlockLevel: 1,
    icon: "B"
  },
  {
    id: "toy",
    name: "Mint Yarn Ball",
    description: "A tiny toy for brighter moods.",
    cost: 70,
    unlockLevel: 2,
    icon: "Y"
  },
  {
    id: "collar",
    name: "Rose Collar",
    description: "A gentle ribbon with a bell.",
    cost: 95,
    unlockLevel: 3,
    icon: "R"
  },
  {
    id: "decor",
    name: "Flower Wall Decor",
    description: "Makes the room feel loved.",
    cost: 130,
    unlockLevel: 4,
    icon: "F"
  },
  {
    id: "sunset",
    name: "Sunset Wallpaper",
    description: "Warm light for peaceful evenings.",
    cost: 170,
    unlockLevel: 5,
    icon: "S"
  }
];

let state = loadState();
let catActionTimer = null;
let sleepRecoveryTimer = null;

const els = {
  coinsText: document.getElementById("coinsText"),
  levelText: document.getElementById("levelText"),
  stageText: document.getElementById("stageText"),
  bondText: document.getElementById("bondText"),
  bondProgress: document.getElementById("bondProgress"),
  statusMessage: document.getElementById("statusMessage"),
  cat: document.getElementById("cat"),
  room: document.getElementById("room"),
  shopList: document.getElementById("shopList"),
  dailyDate: document.getElementById("dailyDate"),
  dailyTaskList: document.getElementById("dailyTaskList"),
  checkinStreak: document.getElementById("checkinStreak"),
  checkinRewards: document.getElementById("checkinRewards"),
  checkinButton: document.getElementById("checkinButton"),
  achievementCount: document.getElementById("achievementCount"),
  achievementList: document.getElementById("achievementList"),
  drawButton: document.getElementById("drawButton"),
  drawResult: document.getElementById("drawResult"),
  diaryCount: document.getElementById("diaryCount"),
  diaryList: document.getElementById("diaryList"),
  inventoryCount: document.getElementById("inventoryCount"),
  inventoryList: document.getElementById("inventoryList"),
  eventPanel: document.getElementById("eventPanel"),
  eventTitle: document.getElementById("eventTitle"),
  eventText: document.getElementById("eventText"),
  eventButton: document.getElementById("eventButton"),
  toast: document.getElementById("toast"),
  resetButton: document.getElementById("resetButton"),
  catBed: document.getElementById("catBed"),
  catToy: document.getElementById("catToy"),
  collar: document.getElementById("collar"),
  wallDecor: document.getElementById("wallDecor"),
  stats: {
    hunger: {
      value: document.getElementById("hungerValue"),
      bar: document.getElementById("hungerBar")
    },
    happiness: {
      value: document.getElementById("happinessValue"),
      bar: document.getElementById("happinessBar")
    },
    cleanliness: {
      value: document.getElementById("cleanlinessValue"),
      bar: document.getElementById("cleanlinessBar")
    },
    energy: {
      value: document.getElementById("energyValue"),
      bar: document.getElementById("energyBar")
    }
  }
};

document.querySelectorAll("[data-tab]").forEach((button) => {
  button.addEventListener("click", () => switchTab(button.dataset.tab));
});

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => performAction(button.dataset.action));
});

els.resetButton.addEventListener("click", () => {
  const shouldReset = confirm("Reset Pocket Cat Life and start again?");
  if (!shouldReset) return;
  state = createFreshState();
  saveState();
  render();
});

els.eventButton.addEventListener("click", resolveActiveEvent);
els.checkinButton.addEventListener("click", claimCheckin);
els.drawButton.addEventListener("click", drawLottery);

ensureCheckinState();
ensureDiaryEntry();
checkAchievements();
saveState();
render();
registerServiceWorker();
setInterval(tick, 6000);

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return createFreshState();

  try {
    const parsed = JSON.parse(saved);
    const merged = migrateState(parsed);
    const elapsedMinutes = Math.max(0, (Date.now() - (merged.lastSaved || Date.now())) / 60000);
    applyOfflineDecay(merged, elapsedMinutes);
    ensureDailyTasks(merged);
    merged.lastSaved = Date.now();
    return merged;
  } catch {
    return createFreshState();
  }
}

function createFreshState() {
  const fresh = structuredCloneFallback(defaultState);
  fresh.lastSaved = Date.now();
  fresh.dailyDate = todayKey();
  fresh.dailyTasks = createDailyTasks(fresh.dailyDate);
  fresh.nextEventAt = Date.now() + EVENT_INTERVAL_MS;
  fresh.diaryEntries = [];
  fresh.inventory = {};
  return fresh;
}

function migrateState(savedState) {
  const migrated = {
    ...structuredCloneFallback(defaultState),
    ...savedState,
    counters: {
      ...defaultState.counters,
      ...(savedState.counters || {})
    },
    achievements: Array.isArray(savedState.achievements) ? savedState.achievements : [],
    owned: Array.isArray(savedState.owned) ? savedState.owned : [],
    activeEvent: savedState.activeEvent || null,
    nextEventAt: savedState.nextEventAt || Date.now() + EVENT_INTERVAL_MS,
    checkin: {
      ...defaultState.checkin,
      ...(savedState.checkin || {})
    },
    diaryEntries: Array.isArray(savedState.diaryEntries) ? savedState.diaryEntries : [],
    inventory: savedState.inventory && typeof savedState.inventory === "object" ? savedState.inventory : {},
    lastDiaryDate: savedState.lastDiaryDate || ""
  };

  if (!Array.isArray(migrated.dailyTasks)) {
    migrated.dailyTasks = [];
  }

  return migrated;
}

function saveState() {
  state.lastSaved = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function tick() {
  adjustStats({
    hunger: -1,
    happiness: -1,
    cleanliness: -1,
    energy: state.energy < 100 ? 1 : 0
  });

  ensureDailyTasks(state);
  ensureCheckinState();
  ensureDiaryEntry();
  maybeTriggerRandomEvent();

  if (lowestNeed() < 25 && !state.activeEvent) {
    setMessage("Your cat needs a little care right now.");
  }

  checkAchievements();
  saveState();
  render();
}

function applyOfflineDecay(targetState, elapsedMinutes) {
  if (elapsedMinutes < 1) return;

  const decay = Math.min(32, Math.floor(elapsedMinutes / 5));
  const energyRecovery = Math.min(26, Math.floor(elapsedMinutes / 7));

  targetState.hunger = clamp(targetState.hunger - decay);
  targetState.happiness = clamp(targetState.happiness - Math.floor(decay * 0.8));
  targetState.cleanliness = clamp(targetState.cleanliness - Math.floor(decay * 0.7));
  targetState.energy = clamp(targetState.energy + energyRecovery);

  if (decay > 0) {
    targetState.message = "Mochi waited for you and feels safe now.";
  }
}

function performAction(action) {
  const actions = {
    feed: () => {
      if (state.coins < 8) return failAction("You need 8 coins to buy a snack.");
      state.coins -= 8;
      adjustStats({ hunger: 18, happiness: 3 });
      gainBond(5);
      setMessage("Mochi enjoyed the snack you picked.");
      return true;
    },
    pet: () => {
      adjustStats({ happiness: 12 });
      gainBond(8);
      setMessage("Your cat feels safe with you.");
      return true;
    },
    clean: () => {
      adjustStats({ cleanliness: 20, happiness: 2 });
      gainBond(5);
      setMessage("Mochi is fresh, fluffy, and calm.");
      return true;
    },
    sleep: () => {
      adjustStats({ energy: 10, happiness: 4, hunger: -3 });
      gainBond(4);
      setMessage("Mochi had a soft little nap.");
      return true;
    },
    play: () => {
      if (state.energy < 15) return failAction("Mochi is too sleepy to play.");
      adjustStats({ happiness: 18, energy: -15, hunger: -5, cleanliness: -3 });
      gainBond(9);
      setMessage("Mochi chased imaginary butterflies.");
      return true;
    },
    work: () => {
      if (state.energy < 20) return failAction("Mochi needs rest before helping you work.");
      state.coins += 28 + state.level * 2;
      adjustStats({ energy: -20, happiness: -5, hunger: -5 });
      gainBond(2);
      setMessage("You earned coins for a cozier room.");
      return true;
    }
  };

  const succeeded = actions[action]?.() || false;
  if (succeeded) {
    incrementActionProgress(action);
    updateTodayDiary(action);
    checkAchievements();
  }

  saveState();
  render();
  if (succeeded) {
    triggerCatAction(action);
    if (action === "sleep") {
      startSleepRecovery();
    }
  }
}

function failAction(message) {
  setMessage(message);
  return false;
}

function incrementActionProgress(action) {
  state.counters[action] = (state.counters[action] || 0) + 1;
  ensureDailyTasks(state);

  state.dailyTasks.forEach((task) => {
    if (task.action !== action || task.claimed) return;
    task.progress = Math.min(task.target, task.progress + 1);
  });
}

function claimDailyTask(taskId) {
  const task = state.dailyTasks.find((entry) => entry.id === taskId);
  if (!task || task.claimed || task.progress < task.target) return;

  task.claimed = true;
  state.coins += task.reward;
  gainBond(4);
  setMessage(`Daily task complete: ${task.reward} coins earned.`);
  showToast(`Daily reward claimed: ${task.reward} coins`);
  checkAchievements();
  saveState();
  render();
}

function claimCheckin() {
  ensureCheckinState();
  if (state.checkin.claimedToday) {
    setMessage("You already checked in today. Mochi saved your warmth.");
    saveState();
    render();
    return;
  }

  const yesterday = offsetDateKey(-1);
  state.checkin.streak = state.checkin.lastDate === yesterday
    ? (state.checkin.streak >= 7 ? 1 : state.checkin.streak + 1)
    : 1;
  state.checkin.lastDate = todayKey();
  state.checkin.claimedToday = true;

  const rewardIndex = Math.max(0, Math.min(6, state.checkin.streak - 1));
  const reward = checkinRewards[rewardIndex];
  state.coins += reward.coins;

  if (reward.itemId) {
    addInventoryItem(reward.itemId, 1);
    setMessage(`Day 7 check-in! You earned ${reward.coins} coins and a rare collar.`);
    showToast("Special reward: Moonbell Collar");
  } else {
    setMessage(`Daily check-in complete: ${reward.coins} coins earned.`);
    showToast(`Check-in reward: ${reward.coins} coins`);
  }

  gainBond(5);
  updateTodayDiary("checkin");
  checkAchievements();
  saveState();
  render();
}

function ensureCheckinState() {
  const key = todayKey();
  state.checkin.claimedToday = state.checkin.lastDate === key;
}

function ensureDailyTasks(targetState) {
  const key = todayKey();
  if (targetState.dailyDate === key && targetState.dailyTasks.length === 3) return;

  targetState.dailyDate = key;
  targetState.dailyTasks = createDailyTasks(key);
}

function createDailyTasks(key) {
  const seed = Array.from(key).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const rotated = [...dailyTaskPool];

  for (let i = rotated.length - 1; i > 0; i -= 1) {
    const j = (seed + i * 7) % (i + 1);
    const temp = rotated[i];
    rotated[i] = rotated[j];
    rotated[j] = temp;
  }

  return rotated.slice(0, 3).map((task) => ({
    ...task,
    progress: 0,
    claimed: false
  }));
}

function ensureDiaryEntry() {
  const key = todayKey();
  if (state.diaryEntries.some((entry) => entry.date === key)) return;

  state.diaryEntries.unshift({
    date: key,
    text: generateDiaryText()
  });
  state.diaryEntries = state.diaryEntries.slice(0, 7);
  state.lastDiaryDate = key;
}

function updateTodayDiary(action) {
  ensureDiaryEntry();
  const entry = state.diaryEntries.find((item) => item.date === todayKey());
  if (!entry) return;

  const lines = {
    feed: "Today I felt cared for because you fed me.",
    pet: "Today I felt loved because you petted me.",
    clean: "Today I felt fresh and safe after you cleaned me.",
    sleep: "Today I rested softly because you let me nap.",
    play: "Today I felt bright because we played together.",
    work: "Today we worked hard for our cozy little room.",
    checkin: "Today you came back, and I remembered your warmth.",
    lottery: "Today a tiny surprise made our room feel lucky."
  };

  entry.text = lines[action] || generateDiaryText();
}

function generateDiaryText() {
  if (state.counters.pet > state.counters.feed) {
    return "Today I felt loved because you petted me.";
  }
  if (lowestNeed() < 35) {
    return "I waited for you today, and I am glad you came back.";
  }
  if (state.happiness > 80) {
    return "Today felt warm, like sunlight on my paws.";
  }
  return "I had a quiet day in our little room.";
}

function maybeTriggerRandomEvent() {
  if (state.activeEvent || Date.now() < state.nextEventAt) return;

  const event = randomEvents[randomInt(0, randomEvents.length - 1)];
  state.activeEvent = {
    id: event.id,
    title: event.title,
    text: event.text,
    button: event.button
  };
  if (event.id === "messyRoom") {
    adjustStats({ cleanliness: -12 });
  }
  state.nextEventAt = Date.now() + EVENT_INTERVAL_MS + randomInt(0, 20000);
  setMessage("A little surprise happened in Mochi's room.");
}

function resolveActiveEvent() {
  if (!state.activeEvent) return;

  const event = randomEvents.find((entry) => entry.id === state.activeEvent.id);
  if (!event) return;

  event.apply();
  state.activeEvent = null;
  checkAchievements();
  saveState();
  render();
}

function drawLottery() {
  const cost = 30;
  if (state.coins < cost) {
    setMessage(`You need ${cost - state.coins} more coins for a draw.`);
    saveState();
    render();
    return;
  }

  state.coins -= cost;
  const prize = pickLotteryPrize();

  if (prize.kind === "coins") {
    state.coins += prize.coins;
    els.drawResult.textContent = `${prize.rarity}: ${prize.name} gave ${prize.coins} coins.`;
    setMessage(`Lucky draw: ${prize.coins} coins came back to you.`);
  } else {
    addInventoryItem(prize.itemId, 1);
    const item = inventoryItems[prize.itemId];
    els.drawResult.textContent = `${item.rarity}: ${item.name} added to your bag.`;
    setMessage(`Lucky draw: ${item.name} joined your bag.`);
    if (item.rarity === "Super Rare") {
      showToast(`Super rare prize: ${item.name}`);
    }
  }

  gainBond(3);
  updateTodayDiary("lottery");
  checkAchievements();
  saveState();
  render();
}

function pickLotteryPrize() {
  const totalWeight = lotteryPrizes.reduce((sum, prize) => sum + prize.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const prize of lotteryPrizes) {
    roll -= prize.weight;
    if (roll <= 0) return prize;
  }

  return lotteryPrizes[0];
}

function addInventoryItem(itemId, quantity) {
  state.inventory[itemId] = (state.inventory[itemId] || 0) + quantity;
}

function useInventoryItem(itemId) {
  if (!state.inventory[itemId]) return;

  const item = inventoryItems[itemId];
  if (!item) return;

  if (itemId === "food_snack") {
    adjustStats({ hunger: 18, happiness: 3 });
    consumeInventoryItem(itemId);
    incrementActionProgress("feed");
    setMessage("Mochi enjoyed a snack from your bag.");
    triggerCatAction("feed");
  } else if (itemId === "toy_mouse") {
    adjustStats({ happiness: 14, energy: -4 });
    consumeInventoryItem(itemId);
    incrementActionProgress("play");
    setMessage("Mochi played with the tiny mouse toy.");
    triggerCatAction("play");
  } else if (itemId === "rare_collar") {
    if (!state.owned.includes("collar")) state.owned.push("collar");
    consumeInventoryItem(itemId);
    setMessage("Mochi is wearing the rare Moonbell Collar.");
    triggerCatAction("pet");
  } else if (itemId === "decor_cloud") {
    if (!state.owned.includes("decor")) state.owned.push("decor");
    consumeInventoryItem(itemId);
    setMessage("You placed the Cloud Cushion near Mochi's cozy corner.");
    triggerCatAction("clean");
  } else {
    setMessage(`${item.name} is safe in your bag for now.`);
  }

  gainBond(3);
  updateTodayDiary("play");
  checkAchievements();
  saveState();
  render();
}

function consumeInventoryItem(itemId) {
  state.inventory[itemId] -= 1;
  if (state.inventory[itemId] <= 0) {
    delete state.inventory[itemId];
  }
}

function adjustStats(changes) {
  Object.entries(changes).forEach(([key, value]) => {
    state[key] = clamp(state[key] + value);
  });
}

function gainBond(amount) {
  state.bond += amount;

  while (state.bond >= 100) {
    state.bond -= 100;
    state.level += 1;
    state.coins += 35;
    setMessage(`Bond level up! Mochi trusts you even more. Level ${state.level} unlocked.`);
    showToast(`Bond Level ${state.level} reached`);
  }
}

function buyItem(itemId) {
  const item = shopItems.find((entry) => entry.id === itemId);
  if (!item) return;

  if (state.owned.includes(item.id)) {
    setMessage(`${item.name} is already in Mochi's room.`);
    return;
  }

  if (state.level < item.unlockLevel) {
    setMessage(`${item.name} unlocks at Bond Level ${item.unlockLevel}.`);
    saveState();
    render();
    return;
  }

  if (state.coins < item.cost) {
    setMessage(`You need ${item.cost - state.coins} more coins for ${item.name}.`);
    saveState();
    render();
    return;
  }

  state.coins -= item.cost;
  state.owned.push(item.id);
  gainBond(6);
  setMessage(`${item.name} makes the room feel warmer.`);
  checkAchievements();
  saveState();
  render();
}

function checkAchievements() {
  achievementDefs.forEach((achievement) => {
    if (state.achievements.includes(achievement.id) || !achievement.isUnlocked()) return;

    state.achievements.push(achievement.id);
    showToast(`Achievement unlocked: ${achievement.name}`);
    setMessage(`Achievement unlocked: ${achievement.name}.`);
  });
}

function triggerCatAction(action) {
  const catClass = `cat-${action}`;
  const roomClass = `room-action-${action}`;
  if (!catActionClasses.includes(catClass) || !roomActionClasses.includes(roomClass)) return;

  window.clearTimeout(catActionTimer);
  els.cat.classList.remove("cat-idle", ...catActionClasses);
  els.room.classList.remove(...roomActionClasses);
  void els.cat.offsetWidth;

  els.cat.classList.add("cat-action", catClass);
  els.room.classList.add(roomClass);

  catActionTimer = window.setTimeout(() => {
    els.cat.classList.remove("cat-action", catClass);
    els.room.classList.remove(roomClass);
    els.cat.classList.add("cat-idle");
    renderCatMood();
  }, actionDurations[action] || 1000);
}

function startSleepRecovery() {
  window.clearInterval(sleepRecoveryTimer);
  let recoveryTicks = 0;

  sleepRecoveryTimer = window.setInterval(() => {
    recoveryTicks += 1;
    adjustStats({ energy: 5 });
    saveState();
    render();

    if (recoveryTicks >= 3 || state.energy >= 100) {
      window.clearInterval(sleepRecoveryTimer);
      sleepRecoveryTimer = null;
    }
  }, 520);
}

function render() {
  renderStats();
  renderCatMood();
  renderDecor();
  renderCheckin();
  renderDailyTasks();
  renderAchievements();
  renderRandomEvent();
  renderShop();
  renderDiary();
  renderInventory();

  const stage = getGrowthStage();
  els.coinsText.textContent = state.coins;
  els.levelText.textContent = `Level ${state.level}`;
  els.stageText.textContent = `${stage.name} - ${stage.copy}`;
  els.bondText.textContent = `${state.bond} / 100`;
  els.bondProgress.style.width = `${state.bond}%`;
  els.statusMessage.textContent = state.message;
}

function renderStats() {
  Object.entries(els.stats).forEach(([key, statEls]) => {
    const value = Math.round(state[key]);
    statEls.value.textContent = value;
    statEls.bar.style.width = `${value}%`;
    statEls.bar.parentElement.dataset.level = value < 30 ? "low" : value < 65 ? "mid" : "high";
  });
}

function renderCatMood() {
  els.cat.classList.remove(...catStateClasses);
  if (!els.cat.classList.contains("cat-action")) {
    els.cat.classList.add("cat-idle");
  }

  const hungry = state.hunger < 30;
  const dirty = state.cleanliness < 34;
  const sleepy = state.energy < 28;
  const sad = state.happiness < 32 || lowestNeed() < 24;
  const happy = state.happiness >= 72 && !sad && !sleepy && !hungry && !dirty;

  if (hungry) {
    els.cat.classList.add("cat-hungry");
  }

  if (dirty) {
    els.cat.classList.add("cat-dirty");
  }

  if (sleepy) {
    els.cat.classList.add("cat-sleepy", "sleepy");
  }

  if (sad) {
    els.cat.classList.add("cat-sad", "sad");
  } else if (happy) {
    els.cat.classList.add("cat-happy", "happy");
  }
}

function renderDecor() {
  toggle(els.catBed, state.owned.includes("bed"));
  toggle(els.catToy, state.owned.includes("toy"));
  toggle(els.collar, state.owned.includes("collar"));
  toggle(els.wallDecor, state.owned.includes("decor"));

  els.room.classList.remove("meadow", "sunset", "night");
  els.room.classList.add(state.owned.includes("sunset") ? "sunset" : "meadow");
}

function renderCheckin() {
  ensureCheckinState();
  const displayDay = state.checkin.claimedToday
    ? state.checkin.streak
    : state.checkin.lastDate === offsetDateKey(-1)
      ? (state.checkin.streak >= 7 ? 1 : state.checkin.streak + 1)
      : 1;

  els.checkinStreak.textContent = `Day ${displayDay}`;
  els.checkinButton.textContent = state.checkin.claimedToday ? "Checked In" : "Check In";
  els.checkinButton.disabled = state.checkin.claimedToday;
  els.checkinRewards.innerHTML = "";

  checkinRewards.forEach((reward) => {
    const node = document.createElement("article");
    const isActive = reward.day === displayDay && !state.checkin.claimedToday;
    const isClaimed = state.checkin.claimedToday && reward.day <= state.checkin.streak;
    node.className = `checkin-day ${isActive ? "active" : ""} ${isClaimed ? "claimed" : ""}`;
    node.innerHTML = `
      <strong>Day ${reward.day}</strong>
      <span>${reward.label}</span>
    `;
    els.checkinRewards.appendChild(node);
  });
}

function renderDailyTasks() {
  els.dailyDate.textContent = "Today";
  els.dailyTaskList.innerHTML = "";

  state.dailyTasks.forEach((task) => {
    const complete = task.progress >= task.target;
    const row = document.createElement("article");
    row.className = `daily-item ${task.claimed ? "claimed" : ""}`;
    row.innerHTML = `
      <div class="daily-copy">
        <strong>${task.label}</strong>
        <span>${task.progress} / ${task.target} - Reward ${task.reward} C</span>
        <div class="mini-track"><div style="width: ${(task.progress / task.target) * 100}%"></div></div>
      </div>
      <button class="daily-button" ${!complete || task.claimed ? "disabled" : ""}>
        ${task.claimed ? "Claimed" : complete ? "Claim" : "Go"}
      </button>
    `;

    row.querySelector("button").addEventListener("click", () => claimDailyTask(task.id));
    els.dailyTaskList.appendChild(row);
  });
}

function renderAchievements() {
  els.achievementCount.textContent = `${state.achievements.length} / ${achievementDefs.length}`;
  els.achievementList.innerHTML = "";

  achievementDefs.forEach((achievement) => {
    const unlocked = state.achievements.includes(achievement.id);
    const row = document.createElement("article");
    row.className = `achievement-item ${unlocked ? "unlocked" : ""}`;
    row.innerHTML = `
      <span class="achievement-mark">${unlocked ? "OK" : "--"}</span>
      <div>
        <strong>${achievement.name}</strong>
        <span>${achievement.description}</span>
      </div>
    `;
    els.achievementList.appendChild(row);
  });
}

function renderRandomEvent() {
  toggle(els.eventPanel, Boolean(state.activeEvent));
  if (!state.activeEvent) return;

  els.eventTitle.textContent = state.activeEvent.title;
  els.eventText.textContent = state.activeEvent.text;
  els.eventButton.textContent = state.activeEvent.button;
}

function renderDiary() {
  ensureDiaryEntry();
  els.diaryCount.textContent = `${state.diaryEntries.length} notes`;
  els.diaryList.innerHTML = "";

  state.diaryEntries.slice(0, 7).forEach((entry) => {
    const row = document.createElement("article");
    row.className = "diary-item";
    row.innerHTML = `
      <span>${formatShortDate(entry.date)}</span>
      <p>${entry.text}</p>
    `;
    els.diaryList.appendChild(row);
  });
}

function renderInventory() {
  const entries = Object.entries(state.inventory).filter(([, count]) => count > 0);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);
  els.inventoryCount.textContent = `${total} items`;
  els.inventoryList.innerHTML = "";

  if (!entries.length) {
    const empty = document.createElement("article");
    empty.className = "inventory-empty";
    empty.textContent = "Your bag is waiting for lucky little things.";
    els.inventoryList.appendChild(empty);
    return;
  }

  entries.forEach(([itemId, count]) => {
    const item = inventoryItems[itemId];
    if (!item) return;

    const row = document.createElement("article");
    row.className = `inventory-item ${item.rarity.toLowerCase().replaceAll(" ", "-")}`;
    row.innerHTML = `
      <div class="inventory-copy">
        <strong>${item.name} x${count}</strong>
        <span>${item.rarity} ${item.type} - ${item.description}</span>
      </div>
      <button class="inventory-button">${item.action}</button>
    `;
    row.querySelector("button").addEventListener("click", () => useInventoryItem(itemId));
    els.inventoryList.appendChild(row);
  });
}

function renderShop() {
  els.shopList.innerHTML = "";

  shopItems.forEach((item) => {
    const owned = state.owned.includes(item.id);
    const locked = state.level < item.unlockLevel;
    const row = document.createElement("article");
    row.className = "shop-item";

    const buttonText = owned ? "Owned" : locked ? `Lv ${item.unlockLevel}` : `${item.cost} C`;
    const buttonClass = owned ? "owned" : locked ? "locked" : "";
    const detail = locked
      ? `Unlocks at Bond Level ${item.unlockLevel}`
      : item.description;

    row.innerHTML = `
      <div class="shop-icon" aria-hidden="true">${item.icon}</div>
      <div class="shop-copy">
        <strong>${item.name}</strong>
        <span>${detail}</span>
      </div>
      <button class="shop-button ${buttonClass}" ${owned ? "disabled" : ""}>${buttonText}</button>
    `;

    const button = row.querySelector("button");
    if (!owned) {
      button.addEventListener("click", () => buyItem(item.id));
    }

    els.shopList.appendChild(row);
  });
}

function getGrowthStage() {
  if (state.level <= 3) {
    return {
      name: "Kitten",
      copy: "tiny paws, big trust"
    };
  }

  if (state.level <= 7) {
    return {
      name: "Young Cat",
      copy: "curious, playful, brave"
    };
  }

  return {
    name: "Adult Cat",
    copy: "calm, loyal, deeply bonded"
  };
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.remove("hidden");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    els.toast.classList.add("hidden");
  }, 2600);
}

function switchTab(tabName) {
  document.querySelectorAll("[data-tab-section]").forEach((section) => {
    section.classList.toggle("active", section.dataset.tabSection === tabName);
  });

  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });
}

function setMessage(message) {
  state.message = message;
}

function lowestNeed() {
  return Math.min(state.hunger, state.happiness, state.cleanliness, state.energy);
}

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function toggle(element, isVisible) {
  element.classList.toggle("hidden", !isVisible);
}

function todayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function offsetDateKey(offset) {
  const date = new Date(Date.now() + offset * DAY_MS);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatShortDate(key) {
  const [, month, day] = key.split("-");
  return `${month}/${day}`;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function structuredCloneFallback(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || !location.protocol.startsWith("http")) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {
      // The game still works without PWA caching, so registration errors stay silent.
    });
  });
}
