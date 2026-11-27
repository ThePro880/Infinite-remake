(() => {
  if (window.__INFINITE_REMAKE_LOADED__) return;
  window.__INFINITE_REMAKE_LOADED__ = true;

  const P = "ir-", KEY = "infiniteRemakeStateV1", DB_NAME = "InfiniteRemakeAudioDB", DB_VER = 2, DB_ST = "tracks";

  const THEMES = [
    { id: "original", name: "Original", p: ["#ffffff", "#f1f5f9", "#111111"] },
    { id: "grid_paper", name: "Grid Paper", p: ["#fdfefe", "#dbeafe", "#2563eb"] },
    { id: "parchment", name: "Parchment", p: ["#f5ecd7", "#e6d5b2", "#78350f"] },
    { id: "chalkboard", name: "Dark Chalkboard", p: ["#181c20", "#252b31", "#f8fafc"] },
    { id: "blueprint", name: "Blueprint", p: ["#0b2545", "#134074", "#93c5fd"] },
    { id: "neon_lab", name: "Neon Lab", p: ["#0d0a1a", "#1c1438", "#22d3ee"] }
  ];

  const SWATCHES = ["#ffffff", "#e0f2fe", "#dcfce7", "#fef3c7", "#fce7f3", "#ede9fe", "#1e293b", "#09090b"];
  const P_STYLES = [
    { id: "sparks", name: "Sparks" }, { id: "stars", name: "Stars" },
    { id: "pixels", name: "Retro Pixels" }, { id: "bubbles", name: "Bubbles" }
  ];

  const CURSORS = {
    wand: { hot: "3 3", svg: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"><line x1="6" y1="6" x2="21" y2="21" stroke="#78350f" stroke-width="3.2" stroke-linecap="round"/><polygon points="6,1 7.6,4.4 11,6 7.6,7.6 6,11 4.4,7.6 1,6 4.4,4.4" fill="#facc15" stroke="#a16207" stroke-width="1"/></svg>` },
    flask: { hot: "12 4", svg: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"><path d="M9 3h6M10 3v5l-5 10a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3L14 8V3" fill="#fff" stroke="#111" stroke-width="1.8"/><path d="M7.2 15h9.6l1.4 3a1 1 0 0 1-.9 1.5H6.7a1 1 0 0 1-.9-1.5z" fill="#38bdf8"/></svg>` },
    gold_ptr: { hot: "2 2", svg: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"><polygon points="3,2 20,10 12,12 9,21" fill="#facc15" stroke="#854d0e" stroke-width="1.8" stroke-linejoin="round"/></svg>` },
    neon_cross: { hot: "13 13", svg: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="none" stroke="#111" stroke-width="3.2"/><circle cx="12" cy="12" r="7" fill="none" stroke="#22d3ee" stroke-width="1.6"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5" stroke="#22d3ee" stroke-width="2" stroke-linecap="round"/></svg>` }
  };

  const SHOP_ITEMS = [
    { id: "th_galaxy", cat: "themes", val: "galaxy", name: "Galaxy Theme", desc: "Deep cosmic purple workspace", price: 50, rarity: "Rare", ico: `<svg width="24" height="24" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" fill="#171033"/><circle cx="8" cy="8" r="1.5" fill="#fff"/><circle cx="15" cy="14" r="2.4" fill="#a855f7"/><circle cx="16" cy="7" r="1" fill="#38bdf8"/></svg>` },
    { id: "th_sakura", cat: "themes", val: "sakura", name: "Sakura Pastel", desc: "Soft pink blossom cards & board", price: 40, rarity: "Common", ico: `<svg width="24" height="24" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" fill="#ffe4ee"/><circle cx="12" cy="8" r="2.6" fill="#f472b6"/><circle cx="15.5" cy="11.5" r="2.6" fill="#f472b6"/><circle cx="8.5" cy="11.5" r="2.6" fill="#f472b6"/><circle cx="12" cy="15" r="2.6" fill="#f472b6"/><circle cx="12" cy="12" r="2" fill="#fde047"/></svg>` },
    { id: "th_lava", cat: "themes", val: "lava_core", name: "Lava Core", desc: "Molten ember dark workspace", price: 65, rarity: "Rare", ico: `<svg width="24" height="24" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" fill="#1a0b09"/><path d="M12 5c2.5 3.5 5 5.6 5 9a5 5 0 0 1-10 0c0-3.4 2.5-5.5 5-9z" fill="#f97316"/><path d="M12 10c1.3 1.8 2.5 2.8 2.5 4.5a2.5 2.5 0 0 1-5 0c0-1.7 1.2-2.7 2.5-4.5z" fill="#fde047"/></svg>` },
    { id: "th_matrix", cat: "themes", val: "matrix_code", name: "Matrix Code", desc: "Green hacker terminal grid", price: 85, rarity: "Epic", ico: `<svg width="24" height="24" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" fill="#030f06"/><path d="M6 6h12M6 12h12M6 18h12M12 6v12" stroke="#22c55e" stroke-width="1.6"/><circle cx="12" cy="12" r="2.4" fill="#4ade80"/></svg>` },
    { id: "cur_wand", cat: "cursors", val: "wand", name: "Alchemist Wand", desc: "Magic star wand cursor", price: 35, rarity: "Common", ico: `<svg width="24" height="24" viewBox="0 0 24 24"><line x1="7" y1="7" x2="20" y2="20" stroke="#78350f" stroke-width="3" stroke-linecap="round"/><polygon points="7,2 8.5,5.5 12,7 8.5,8.5 7,12 5.5,8.5 2,7 5.5,5.5" fill="#facc15" stroke="#a16207" stroke-width="1"/></svg>` },
    { id: "cur_flask", cat: "cursors", val: "flask", name: "Pixel Flask", desc: "Mini potion flask pointer", price: 45, rarity: "Common", ico: `<svg width="24" height="24" viewBox="0 0 24 24"><path d="M9 3h6M10 3v5l-5 10a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3L14 8V3" fill="#fff" stroke="#111" stroke-width="1.8"/><path d="M7.5 15h9l1.2 3H6.3z" fill="#38bdf8"/></svg>` },
    { id: "cur_gold", cat: "cursors", val: "gold_ptr", name: "Golden Pointer", desc: "Sleek golden speedrun arrow", price: 60, rarity: "Rare", ico: `<svg width="24" height="24" viewBox="0 0 24 24"><polygon points="5,3 20,10 12.5,12.5 10,20" fill="#facc15" stroke="#854d0e" stroke-width="1.8" stroke-linejoin="round"/></svg>` },
    { id: "cur_neon", cat: "cursors", val: "neon_cross", name: "Neon Crosshair", desc: "Precision cyan target cursor", price: 75, rarity: "Epic", ico: `<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="none" stroke="#0891b2" stroke-width="2"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5" stroke="#06b6d4" stroke-width="2" stroke-linecap="round"/></svg>` },
    { id: "pt_hearts", cat: "particles", val: "hearts", name: "Hearts Burst", desc: "Floating pink hearts on merge", price: 30, rarity: "Common", ico: `<svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 20s-7-4.6-8.6-8.8A4.8 4.8 0 0 1 12 6.8a4.8 4.8 0 0 1 8.6 4.4C19 15.4 12 20 12 20z" fill="#ec4899" stroke="#9d174d" stroke-width="1.3"/></svg>` },
    { id: "pt_lightning", cat: "particles", val: "lightning", name: "Lightning Bolts", desc: "Electric sparks on merge", price: 45, rarity: "Rare", ico: `<svg width="24" height="24" viewBox="0 0 24 24"><polygon points="13,2 4,14 11,14 10,22 20,10 13,10" fill="#facc15" stroke="#a16207" stroke-width="1.4" stroke-linejoin="round"/></svg>` },
    { id: "pt_fireflies", cat: "particles", val: "fireflies", name: "Fireflies", desc: "Soft glowing orbs drift upward", price: 55, rarity: "Rare", ico: `<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#1e293b"/><circle cx="9" cy="10" r="3" fill="#fde047"/><circle cx="15.5" cy="14" r="2.2" fill="#a3e635"/></svg>` },
    { id: "pt_gold", cat: "particles", val: "gold_burst", name: "Golden Confetti", desc: "Gold shards burst on merge", price: 90, rarity: "Epic", ico: `<svg width="24" height="24" viewBox="0 0 24 24"><rect x="4" y="6" width="6" height="4" transform="rotate(-25 7 8)" fill="#facc15" stroke="#a16207"/><rect x="13" y="5" width="6" height="4" transform="rotate(20 16 7)" fill="#fde047" stroke="#a16207"/><rect x="10" y="13" width="7" height="4.5" transform="rotate(-15 13 15)" fill="#f59e0b" stroke="#92400e"/></svg>` },
    { id: "fr_gold", cat: "frames", val: "gold", name: "Golden Frame", desc: "Gold border on Button & HUD", price: 70, rarity: "Rare", ico: `<svg width="24" height="24" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="4" fill="#fefce8" stroke="#eab308" stroke-width="3"/></svg>` },
    { id: "fr_rainbow", cat: "frames", val: "rainbow", name: "Rainbow Frame", desc: "Animated prismatic border", price: 120, rarity: "Epic", ico: `<svg width="24" height="24" viewBox="0 0 24 24"><defs><linearGradient id="irg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ef4444"/><stop offset="40%" stop-color="#facc15"/><stop offset="75%" stop-color="#22c55e"/><stop offset="100%" stop-color="#8b5cf6"/></linearGradient></defs><rect x="3" y="6" width="18" height="12" rx="4" fill="#fff" stroke="url(#irg)" stroke-width="3.2"/></svg>` }
  ];

  const CHALLENGES = [
    { id: "c_pizza", diff: "easy", text: "Craft: Pizza", type: "word", kw: ["pizza"] },
    { id: "c_volcano", diff: "easy", text: "Craft: Volcano", type: "word", kw: ["volcano"] },
    { id: "c_rainbow", diff: "easy", text: "Craft: Rainbow", type: "word", kw: ["rainbow"] },
    { id: "c_castle", diff: "easy", text: "Craft: Castle", type: "word", kw: ["castle"] },
    { id: "c_dino", diff: "easy", text: "Craft: Dinosaur", type: "word", kw: ["dinosaur"] },
    { id: "c_robot", diff: "easy", text: "Craft: Robot", type: "word", kw: ["robot"] },
    { id: "c_mc", diff: "medium", text: "Craft: Minecraft", type: "word", kw: ["minecraft"] },
    { id: "c_dragon", diff: "medium", text: "Craft: Dragon", type: "word", kw: ["dragon"] },
    { id: "c_pirate", diff: "medium", text: "Craft: Pirate", type: "word", kw: ["pirate"] },
    { id: "c_zombie", diff: "medium", text: "Craft: Zombie", type: "word", kw: ["zombie"] },
    { id: "c_3words", diff: "medium", text: "Craft an element with 3+ words", type: "words3", kw: [] },
    { id: "c_5new", diff: "medium", text: "Discover 5 new elements in one run", type: "new5", kw: [] },
    { id: "c_fd2", diff: "hard", text: "Get 1 First Discovery in under 2 min", type: "fd2m", kw: [] },
    { id: "c_tm", diff: "hard", text: "Craft: Time Machine", type: "word", kw: ["time machine"] },
    { id: "c_bh", diff: "hard", text: "Craft: Black Hole", type: "word", kw: ["black hole"] },
    { id: "c_qc", diff: "hard", text: "Craft: Quantum Computer", type: "word", kw: ["quantum computer"] },
    { id: "c_4words", diff: "hard", text: "Craft an element with 4+ words", type: "words4", kw: [] }
  ];

  const ACHS = [
    { id: "first_merge", name: "First Step", desc: "Perform your first merge." },
    { id: "merges_25", name: "Active Alchemist", desc: "Reach 25 recorded merges." },
    { id: "streak_5", name: "Creative Streak", desc: "Discover 5 new elements in one session." },
    { id: "first_fd", name: "Unique Hunter", desc: "Get your first First Discovery." },
    { id: "fd_3", name: "Uncharted Legend", desc: "Collect 3 First Discoveries." },
    { id: "speed_2m", name: "Speedrunner", desc: "Finish a challenge in under 2 minutes." },
    { id: "retos_3", name: "Challenge Master", desc: "Complete 3 wheel challenges." },
    { id: "long_word", name: "Word Architect", desc: "Craft an element with 3+ words." },
    { id: "lab_style", name: "Lab Stylist", desc: "Customize the workspace theme or color." },
    { id: "dj_craft", name: "Alchemist DJ", desc: "Play MP3 music while crafting." },
    { id: "first_buy", name: "First Purchase", desc: "Buy your first item from the Shop." },
    { id: "rich_alch", name: "Rich Alchemist", desc: "Hold 100+ Craft Coins at once." },
    { id: "daily_3", name: "Daily Collector", desc: "Claim the Daily Chest 3 times." },
    { id: "shop_master", name: "Full Collection", desc: "Own at least 6 Shop items." }
  ];

  const DEF = {
    fab: { v1Pos: null },
    hud: { show: true, cleanView: false, pos: { x: 16, y: 62 } },
    visual: { theme: "original", bgColor: "", bgImage: "", bgDim: 25, autoSyncDark: true, hideDots: false, hidePlayersCompleted: true, cursor: "default", frame: "none", particles: true, particleStyle: "sparks", particleRainbow: true, particleColor: "#3b82f6", confetti: true, sfx: true, sfxVolume: 0.55 },
    economy: { coins: 0, xp: 0, owned: {}, lastDailyDate: "", dailyStreak: 0, dailyClaims: 0 },
    recipes: [],
    challenge: { activeId: null, difficulty: "all", streak: 0, bestStreak: 0, lastCompleted: "", customList: [], records: [], completedCount: 0 },
    stats: { totalMerges: 0, firstDiscoveries: 0, bestSessionNew: 0, lastDiscoveryName: "", unlocked: {} },
    audio: { volume: 0.65, speed: 1.0, loop: true }
  };

  let state = JSON.parse(JSON.stringify(DEF));
  let activeTab = "challenges", shopCat = "all", recipeSearch = "";
  let shopMsg = "Welcome! Browse the wooden shelf below.";

  let timerRunning = false, timerStart = 0, timerElapsed = 0, runSteps = 0, runNewCount = 0, sessionNewCount = 0;
  let spinning = false, completing = false, comboCount = 0, comboTimer = null;
  let lastPointer = { x: window.innerWidth * 0.4, y: window.innerHeight * 0.5, time: 0 };
  let lastDblAt = 0, lastSbAt = 0, lastRemAt = 0, lastStepAt = 0, lastFdAt = 0, lsInit = false;
  const knownTexts = new Set(), instMap = new WeakMap();

  const audioEl = new Audio();
  let tracks = [], curTrack = -1, audioCtx = null;
  let fxCanvas = null, fxCtx = null, fxList = [], fxOn = false;

  const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  const fmt = (ms) => { const t = Math.max(0, Math.floor(ms)); return String(Math.floor(t / 60000)).padStart(2, "0") + ":" + String(Math.floor((t % 60000) / 1000)).padStart(2, "0") + "." + Math.floor((t % 1000) / 100); };
  const nowMs = () => timerRunning ? timerElapsed + (performance.now() - timerStart) : timerElapsed;
  const dayKey = (off = 0) => { const d = new Date(Date.now() + off * 86400000); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  const isInst = (n) => n instanceof HTMLElement && (n.classList.contains("instance") || n.classList.contains("item-instance"));
  const instTxt = (el) => el ? (el.textContent || "").replace(/first\s+discovery/ig, "").trim() : "";
  const isDark = (hex) => { const m = String(hex || "").trim().match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i); return m ? (0.299 * parseInt(m[1], 16) + 0.587 * parseInt(m[2], 16) + 0.114 * parseInt(m[3], 16)) < 130 : false; };

  function mergeObj(t, s) {
    if (!s || typeof s !== "object") return t;
    const o = Array.isArray(t) ? t.slice() : { ...t };
    for (const k of Object.keys(s)) o[k] = (s[k] && typeof s[k] === "object" && !Array.isArray(s[k]) && o[k] && typeof o[k] === "object") ? mergeObj(o[k], s[k]) : s[k];
    return o;
  }

  function lvlInfo(xp) {
    let rem = Math.max(0, Math.floor(xp || 0)), lv = 1;
    while (rem >= lv * 100) { rem -= lv * 100; lv++; }
    const need = lv * 100, rank = lv >= 16 ? "Infinite Legend" : lv >= 12 ? "Grandmaster" : lv >= 8 ? "Master Alchemist" : lv >= 5 ? "Alchemist" : lv >= 3 ? "Apprentice" : "Novice";
    return { lv, rank, rem, need, pct: Math.min(100, Math.round((rem / need) * 100)) };
  }

  const comboMult = () => comboCount >= 6 ? 3 : comboCount >= 3 ? 2 : 1;
  function bumpCombo() { comboCount++; clearTimeout(comboTimer); comboTimer = setTimeout(() => { comboCount = 0; updateHud(); }, 10000); }
  function updCoins() { const c = String(state.economy.coins || 0); const a = document.getElementById(P + "hdr-coins"), b = document.getElementById(P + "shop-coins"); if (a) a.textContent = c; if (b) b.textContent = c; }
  function addReward(coins, xp) {
    const prev = lvlInfo(state.economy.xp).lv;
    if (coins > 0) state.economy.coins = (state.economy.coins || 0) + Math.floor(coins);
    if (xp > 0) state.economy.xp = (state.economy.xp || 0) + Math.floor(xp);
    const cur = lvlInfo(state.economy.xp);
    if (cur.lv > prev) { playSfx("discovery"); toast("LEVEL UP! Lv." + cur.lv + " " + cur.rank, "gold"); }
    updCoins();
  }

  const allCh = () => [...(state.challenge.customList || []), ...CHALLENGES];
  const filtCh = () => { const d = state.challenge.difficulty || "all", a = allCh(); if (d === "all") return a; const f = a.filter((c) => (c.diff || "medium") === d); return f.length ? f : a; };
  const actCh = () => state.challenge.activeId ? allCh().find((c) => c.id === state.challenge.activeId) || null : null;

  function loadState(cb) { try { chrome.storage.local.get([KEY], (r) => { if (r && r[KEY]) { state = mergeObj(DEF, r[KEY]); if (!Array.isArray(state.recipes)) state.recipes = []; } cb && cb(); }); } catch { cb && cb(); } }
  function saveState(cb) { try { chrome.storage.local.set({ [KEY]: state }, () => cb && cb()); } catch { cb && cb(); } }

  // Auto-Sync Dark/Light Mode with Infinite Craft Menu
  function parseRgbLum(str) {
    const m = String(str || "").match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
    if (!m) return null;
    if (m[4] !== undefined && parseFloat(m[4]) < 0.15) return null;
    return 0.299 * Number(m[1]) + 0.587 * Number(m[2]) + 0.114 * Number(m[3]);
  }

  function detectGameDarkMode() {
    const sb = document.querySelector(".sidebar") || document.querySelector(".items") || document.querySelector(".container");
    if (sb) {
      const lum = parseRgbLum(getComputedStyle(sb).backgroundColor);
      if (lum !== null) return lum < 130;
    }
    for (const el of [document.querySelector(".container"), document.body, document.documentElement]) {
      if (!el) continue;
      if (el.classList && (el.classList.contains("dark-mode") || el.classList.contains("dark"))) return true;
      const lum = parseRgbLum(getComputedStyle(el).backgroundColor);
      if (lum !== null) return lum < 130;
    }
    return false;
  }

  function syncUiDarkMode() {
    const dark = detectGameDarkMode();
    [P + "fab", P + "hud", P + "panel", P + "shop-ov", P + "toast"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle(P + "dark", dark);
    });
  }

  // Hide "X players completed this"
  const PC_RE = /\d[\d,.\s]*[kKmM]?\s*players?\s+(?:have\s+)?completed\s+this/i;
  function hidePlayersStat(root) {
    if (!state.visual.hidePlayersCompleted) return;
    const base = root && root.nodeType === 1 ? root : document.body;
    if (!base || (base.closest && base.closest(`#${P}panel,#${P}shop-ov,#${P}hud,#${P}fab`))) return;
    try {
      const w = document.createTreeWalker(base, NodeFilter.SHOW_TEXT, null);
      let n;
      while ((n = w.nextNode())) {
        if (!n.nodeValue || !PC_RE.test(n.nodeValue)) continue;
        const p = n.parentElement;
        if (!p || (p.closest && p.closest(`#${P}panel,#${P}shop-ov,#${P}hud,#${P}fab`))) continue;
        const full = (p.textContent || "").trim();
        if (full.length <= 95 && p.children.length <= 2 && PC_RE.test(full)) { p.dataset.irHide = "1"; p.style.setProperty("display", "none", "important"); }
        else n.nodeValue = n.nodeValue.replace(/\(?[\d,.\s]+[kKmM]?\s*players?\s+(?:have\s+)?completed\s+this[.!]?\)?/ig, "").trim();
      }
    } catch {}
  }
  function showPlayersStat() { document.querySelectorAll('[data-ir-hide="1"]').forEach((el) => { el.style.removeProperty("display"); delete el.dataset.irHide; }); }

  // Backup & Trophy Card
  function exportJson() {
    try {
      const b = new Blob([JSON.stringify({ app: "Infinite Remake", version: "1.0.1", state }, null, 2)], { type: "application/json" });
      const u = URL.createObjectURL(b), a = document.createElement("a");
      a.href = u; a.download = "infinite-remake-backup-" + dayKey() + ".json";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(u), 1500); toast("Backup .json exported!");
    } catch { toast("Export failed.", "err"); }
  }
  function importJson(file) {
    if (!file) return;
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const p = JSON.parse(String(rd.result || "{}")), inc = p && p.state ? p.state : p;
        if (!inc || typeof inc !== "object" || (!inc.stats && !inc.visual && !inc.challenge)) return toast("Invalid backup file.", "err");
        state = mergeObj(DEF, inc); if (!Array.isArray(state.recipes)) state.recipes = [];
        saveState(() => { applyTheme(); applyFabPos(); updateHud(); updCoins(); applyAudio(); renderPanel(); renderShop(); toast("Backup restored!", "gold"); });
      } catch { toast("Invalid JSON file.", "err"); }
    };
    rd.readAsText(file);
  }

  function downloadTrophy(customName) {
    const title = String(customName || state.stats.lastDiscoveryName || "First Discovery").trim() || "First Discovery";
    const lv = lvlInfo(state.economy.xp), W = 900, H = 520, c = document.createElement("canvas");
    c.width = W; c.height = H; const ctx = c.getContext("2d");
    const rr = (x, y, w, h, r) => { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); };
    const bg = ctx.createLinearGradient(0, 0, W, H); bg.addColorStop(0, "#0f172a"); bg.addColorStop(1, "#1e293b");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    rr(36, 36, W - 72, H - 72, 22); ctx.fillStyle = "#fff"; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = "#facc15"; ctx.stroke();
    ctx.save(); ctx.translate(W / 2, 114); ctx.fillStyle = "#fef9c3"; ctx.beginPath(); ctx.arc(0, 0, 40, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#eab308"; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = "#eab308"; ctx.beginPath(); ctx.moveTo(-17, -17); ctx.lineTo(17, -17); ctx.lineTo(12, 6); ctx.lineTo(-12, 6); ctx.closePath(); ctx.fill();
    ctx.fillRect(-4, 6, 8, 9); ctx.fillRect(-13, 14, 26, 6); ctx.restore();
    rr(W / 2 - 155, 168, 310, 30, 999); ctx.fillStyle = "#111"; ctx.fill();
    ctx.fillStyle = "#fde047"; ctx.font = "700 13px Segoe UI,Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(`LV.${lv.lv} ${lv.rank.toUpperCase()}  •  TROPHY`, W / 2, 183);
    let fs = 44; ctx.font = `800 ${fs}px Segoe UI,Arial`;
    while (ctx.measureText(title).width > 700 && fs > 22) { fs -= 2; ctx.font = `800 ${fs}px Segoe UI,Arial`; }
    const pw = Math.min(760, Math.max(280, ctx.measureText(title).width + 64));
    rr(W / 2 - pw / 2, 218, pw, 74, 14); ctx.fillStyle = "#f8fafc"; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = "#cbd5e1"; ctx.stroke();
    ctx.fillStyle = "#0f172a"; ctx.fillText(title, W / 2, 255);
    const st = [{ k: "TIME", v: fmt(nowMs()) }, { k: "STEPS", v: String(runSteps) }, { k: "LEVEL", v: "Lv." + lv.lv }, { k: "STREAK", v: String(state.challenge.streak || 0) }];
    let sx = (W - (4 * 172 + 48)) / 2;
    st.forEach((o) => { rr(sx, 318, 172, 68, 12); ctx.fillStyle = "#f1f5f9"; ctx.fill(); ctx.fillStyle = "#64748b"; ctx.font = "700 11px Segoe UI,Arial"; ctx.fillText(o.k, sx + 86, 340); ctx.fillStyle = "#0f172a"; ctx.font = "800 22px Consolas,monospace"; ctx.fillText(o.v, sx + 86, 366); sx += 188; });
    ctx.fillStyle = "#64748b"; ctx.font = "600 13px Segoe UI,Arial"; ctx.fillText("Infinite Remake v1.0.1  •  First Discoveries: " + (state.stats.firstDiscoveries || 0), W / 2, 434);
    const a = document.createElement("a"); a.href = c.toDataURL("image/png"); a.download = "infinite_remake_" + (norm(title).replace(/\s+/g, "_") || "trophy") + ".png";
    document.body.appendChild(a); a.click(); a.remove(); toast("Trophy Card (.png) downloaded!", "gold");
  }

  // IndexedDB Audio
  const openDb = () => new Promise((res, rej) => { try { const q = indexedDB.open(DB_NAME, DB_VER); q.onupgradeneeded = () => { if (!q.result.objectStoreNames.contains(DB_ST)) q.result.createObjectStore(DB_ST, { keyPath: "id" }); }; q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); } catch (e) { rej(e); } });
  async function loadTracks() { try { const db = await openDb(), q = db.transaction(DB_ST, "readonly").objectStore(DB_ST).getAll(); return await new Promise((r) => { q.onsuccess = () => r((q.result || []).map((t) => ({ id: t.id, name: t.name, url: URL.createObjectURL(t.blob) }))); q.onerror = () => r([]); }); } catch { return []; } }
  async function addTrack(f) { const e = { id: "trk_" + Date.now() + "_" + Math.floor(Math.random() * 999), name: f.name.replace(/\.[^/.]+$/, ""), blob: f }; try { const db = await openDb(); await new Promise((r, j) => { const tx = db.transaction(DB_ST, "readwrite"); tx.objectStore(DB_ST).put(e); tx.oncomplete = r; tx.onerror = j; }); } catch {} return { id: e.id, name: e.name, url: URL.createObjectURL(f) }; }
  async function delTrack(id) { try { const db = await openDb(); await new Promise((r) => { const tx = db.transaction(DB_ST, "readwrite"); tx.objectStore(DB_ST).delete(id); tx.oncomplete = r; tx.onerror = r; }); } catch {} }

  // SFX
  function playSfx(type) {
    if (!state.visual.sfx) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext; if (!Ctx) return;
      if (!audioCtx) audioCtx = new Ctx(); if (audioCtx.state === "suspended") audioCtx.resume();
      const vol = Math.max(0.05, Math.min(1, Number(state.visual.sfxVolume ?? 0.55))) * 0.25, t0 = audioCtx.currentTime;
      const tone = (f, s, d, w, m) => { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.type = w || "triangle"; o.frequency.setValueAtTime(f, t0 + s); g.gain.setValueAtTime(0.001, t0 + s); g.gain.exponentialRampToValueAtTime(vol * (m || 1), t0 + s + 0.015); g.gain.exponentialRampToValueAtTime(0.001, t0 + s + d); o.connect(g); g.connect(audioCtx.destination); o.start(t0 + s); o.stop(t0 + s + d + 0.02); };
      if (type === "merge") { tone(523.25, 0, 0.09, "sine", 0.7); tone(659.25, 0.04, 0.11, "triangle", 0.6); }
      else if (type === "buy") { tone(987.77, 0, 0.07, "sine", 0.9); tone(1318.51, 0.07, 0.22, "triangle", 1); }
      else if (type === "achievement") { tone(587.33, 0, 0.12, "triangle", 0.9); tone(880, 0.1, 0.24, "triangle", 1); }
      else if (type === "discovery") { tone(523.25, 0, 0.12, "triangle", 0.9); tone(659.25, 0.09, 0.12, "triangle", 0.9); tone(783.99, 0.18, 0.14, "triangle", 0.95); tone(1046.5, 0.28, 0.42, "sine", 1.1); }
    } catch {}
  }

  // Particles & Confetti
  function ensureFx() {
    if (fxCanvas) return;
    fxCanvas = document.createElement("canvas"); fxCanvas.id = P + "fx-canvas";
    fxCanvas.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:2147483647;";
    document.body.appendChild(fxCanvas); fxCtx = fxCanvas.getContext("2d");
    const rz = () => { fxCanvas.width = window.innerWidth; fxCanvas.height = window.innerHeight; }; rz(); window.addEventListener("resize", rz);
  }
  function runFx() {
    if (fxOn) return; fxOn = true;
    const step = () => {
      if (!fxCtx || !fxCanvas) { fxOn = false; return; }
      fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
      for (let i = fxList.length - 1; i >= 0; i--) {
        const p = fxList[i]; p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= p.d; p.rot += p.vr; p.life -= p.dec;
        if (p.life <= 0) { fxList.splice(i, 1); continue; }
        fxCtx.save(); fxCtx.globalAlpha = Math.max(0, Math.min(1, p.life)); fxCtx.translate(p.x, p.y); fxCtx.rotate(p.rot); fxCtx.fillStyle = p.col;
        if (p.sh === "circle") { fxCtx.beginPath(); fxCtx.arc(0, 0, p.sz * 0.5, 0, Math.PI * 2); fxCtx.fill(); }
        else if (p.sh === "star") { fxCtx.beginPath(); for (let k = 0; k < 5; k++) { const a1 = k * 1.2566 - 1.5708, a2 = a1 + 0.6283; k ? fxCtx.lineTo(Math.cos(a1) * p.sz * 0.65, Math.sin(a1) * p.sz * 0.65) : fxCtx.moveTo(Math.cos(a1) * p.sz * 0.65, Math.sin(a1) * p.sz * 0.65); fxCtx.lineTo(Math.cos(a2) * p.sz * 0.29, Math.sin(a2) * p.sz * 0.29); } fxCtx.closePath(); fxCtx.fill(); }
        else if (p.sh === "heart") { const r = p.sz * 0.75; fxCtx.beginPath(); fxCtx.moveTo(0, r * 0.4); fxCtx.bezierCurveTo(-r, -r * 0.3, -r * 0.5, -r * 1.1, 0, -r * 0.45); fxCtx.bezierCurveTo(r * 0.5, -r * 1.1, r, -r * 0.3, 0, r * 0.4); fxCtx.fill(); }
        else if (p.sh === "bolt") { const r = p.sz * 0.85; fxCtx.beginPath(); fxCtx.moveTo(r * 0.15, -r); fxCtx.lineTo(-r * 0.55, 0); fxCtx.lineTo(0, 0); fxCtx.lineTo(-r * 0.15, r); fxCtx.lineTo(r * 0.55, 0); fxCtx.lineTo(0, 0); fxCtx.closePath(); fxCtx.fill(); }
        else if (p.sh === "firefly") { fxCtx.shadowColor = p.col; fxCtx.shadowBlur = 10; fxCtx.beginPath(); fxCtx.arc(0, 0, p.sz * 0.45, 0, Math.PI * 2); fxCtx.fill(); }
        else if (p.sh === "bubble") { fxCtx.strokeStyle = p.col; fxCtx.lineWidth = 2; fxCtx.beginPath(); fxCtx.arc(0, 0, p.sz * 0.65, 0, Math.PI * 2); fxCtx.stroke(); }
        else if (p.sh === "pixel") { const s = Math.round(p.sz); fxCtx.fillRect(-s / 2, -s / 2, s, s); }
        else { fxCtx.fillRect(-p.sz / 2, -p.h / 2, p.sz, p.h); }
        fxCtx.restore();
      }
      if (fxList.length) requestAnimationFrame(step); else { fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height); fxOn = false; }
    };
    requestAnimationFrame(step);
  }

  function spawnSparks(x, y, force) {
    if (!state.visual.particles && !force) return;
    ensureFx();
    const st = force || state.visual.particleStyle || "sparks", rb = ["#3b82f6", "#22c55e", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"];
    const map = { sparks: "circle", stars: "star", pixels: "pixel", bubbles: "bubble", hearts: "heart", lightning: "bolt", fireflies: "firefly", gold_burst: "rect" };
    const sh = map[st] || "circle", cnt = st === "gold_burst" ? 22 : 15, cx = x || lastPointer.x, cy = y || lastPointer.y;
    for (let i = 0; i < cnt; i++) {
      const a = (Math.PI * 2 * i) / cnt + (Math.random() - 0.5) * 0.4, sp = (st === "bubbles" || st === "fireflies") ? 1.2 + Math.random() * 2 : 2.2 + Math.random() * 4;
      let col = state.visual.particleRainbow !== false ? rb[i % rb.length] : (state.visual.particleColor || "#3b82f6");
      if (st === "gold_burst") col = ["#facc15", "#fde047", "#f59e0b"][i % 3];
      else if (st === "hearts") col = ["#ec4899", "#f43f5e", "#fb7185"][i % 3];
      else if (st === "lightning") col = i % 2 ? "#38bdf8" : "#facc15";
      else if (st === "fireflies") col = i % 2 ? "#a3e635" : "#fde047";
      fxList.push({ x: cx, y: cy, vx: Math.cos(a) * sp, vy: (st === "bubbles" || st === "fireflies" || st === "hearts") ? Math.sin(a) * sp - 1.6 : Math.sin(a) * sp, g: (st === "bubbles" || st === "fireflies") ? -0.035 : st === "hearts" ? -0.02 : 0.1, d: 0.955, sz: (st === "stars" || st === "bubbles" || st === "hearts" || st === "lightning") ? 8 + Math.random() * 4 : 5 + Math.random() * 3, h: 4.5, rot: (st === "pixels" || st === "hearts") ? 0 : Math.random() * 6, vr: (st === "pixels" || st === "hearts") ? 0 : (Math.random() - 0.5) * 0.22, life: 1, dec: 0.024 + Math.random() * 0.015, col, sh });
    }
    runFx();
  }

  function spawnConfetti(ox, oy) {
    if (!state.visual.confetti) return;
    ensureFx();
    const cols = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#a855f7", "#ec4899", "#facc15"];
    const cx = ox ?? window.innerWidth * 0.42, cy = oy ?? window.innerHeight * 0.35;
    for (let i = 0; i < 80; i++) {
      const a = Math.random() * Math.PI * 2, sp = 3 + Math.random() * 9;
      fxList.push({ x: cx + (Math.random() - 0.5) * 60, y: cy + (Math.random() - 0.5) * 30, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 4.5, g: 0.19, d: 0.985, sz: 7 + Math.random() * 5, h: 4 + Math.random() * 4, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.28, life: 1.2 + Math.random() * 0.4, dec: 0.013 + Math.random() * 0.008, col: cols[i % cols.length], sh: "rect" });
    }
    runFx();
  }

  function toast(msg, kind) {
    let t = document.getElementById(P + "toast");
    if (!t && document.body) { t = document.createElement("div"); t.id = P + "toast"; document.body.appendChild(t); }
    if (!t) return;
    t.textContent = msg; t.className = (detectGameDarkMode() ? P + "dark " : "") + "show " + (kind || "ok");
    clearTimeout(t._tm); t._tm = setTimeout(() => t.classList.remove("show"), 3200);
  }

  function unlockAch(id) {
    if (state.stats.unlocked[id]) return;
    const a = ACHS.find((x) => x.id === id); if (!a) return;
    state.stats.unlocked[id] = Date.now();
    addReward(20, 30); saveState(); playSfx("achievement");
    toast("Achievement unlocked: " + a.name + " (+20 Coins)", "gold");
    if (activeTab === "achievements") renderPanel();
  }

  function checkAchs() {
    if (state.stats.totalMerges >= 1) unlockAch("first_merge");
    if (state.stats.totalMerges >= 25) unlockAch("merges_25");
    if (sessionNewCount >= 5) unlockAch("streak_5");
    if (state.stats.firstDiscoveries >= 1) unlockAch("first_fd");
    if (state.stats.firstDiscoveries >= 3) unlockAch("fd_3");
    if (state.challenge.completedCount >= 3) unlockAch("retos_3");
    const owned = Object.keys(state.economy.owned || {}).filter((k) => state.economy.owned[k]).length;
    if (owned >= 1) unlockAch("first_buy");
    if (owned >= 6) unlockAch("shop_master");
    if ((state.economy.coins || 0) >= 100) unlockAch("rich_alch");
    if ((state.economy.dailyClaims || 0) >= 3) unlockAch("daily_3");
  }

  function completeCh(auto) {
    const ch = actCh(); if (!ch || completing) return;
    completing = true;
    const el = nowMs(); timerRunning = false; timerElapsed = el;
    state.challenge.activeId = null;
    state.challenge.completedCount = (state.challenge.completedCount || 0) + 1;
    state.challenge.streak = (state.challenge.streak || 0) + 1;
    if (state.challenge.streak > (state.challenge.bestStreak || 0)) state.challenge.bestStreak = state.challenge.streak;
    const base = ch.diff === "hard" ? 50 : ch.diff === "easy" ? 15 : 30;
    const rew = base + Math.min(25, (state.challenge.streak - 1) * 5);
    addReward(rew, 40);
    const rec = { id: "rec_" + Date.now(), title: ch.text, timeStr: fmt(el), steps: runSteps, date: new Date().toLocaleDateString() };
    state.challenge.lastCompleted = ch.text + " • " + rec.timeStr;
    state.challenge.records.unshift(rec); if (state.challenge.records.length > 30) state.challenge.records.pop();
    if (el > 0 && el < 120000) unlockAch("speed_2m");
    checkAchs(); saveState(); spawnConfetti(); playSfx("discovery");
    toast((auto ? "Challenge done! " : "Logged! ") + rec.timeStr + " (+" + rew + " Coins)", "gold");
    updateHud(); if (activeTab === "challenges") renderPanel();
    setTimeout(() => { completing = false; }, 600);
  }

  function evalCraft(raw, isNew, isFd) {
    const n = norm(raw); if (!n) return;
    const wc = n.split(" ").length; if (wc >= 3) unlockAch("long_word");
    const ch = actCh(); if (!ch || completing) return;
    if (ch.type === "word" && ch.kw && ch.kw.some((k) => norm(k) === n)) completeCh(true);
    else if (ch.type === "words3" && wc >= 3) completeCh(true);
    else if (ch.type === "words4" && wc >= 4) completeCh(true);
    else if (ch.type === "fd2m" && isFd && nowMs() <= 120000) completeCh(true);
    else if (ch.type === "new5" && isNew) { runNewCount++; if (runNewCount >= 5) completeCh(true); }
  }

  function onFirstDisc(name) {
    const t = Date.now(); if (t - lastFdAt < 2000) return; lastFdAt = t;
    state.stats.firstDiscoveries = (state.stats.firstDiscoveries || 0) + 1;
    if (name) state.stats.lastDiscoveryName = name;
    addReward(35, 75); spawnConfetti(); playSfx("discovery");
    toast("FIRST DISCOVERY!" + (name ? " " + name : "") + " (+35 Coins)", "gold");
    checkAchs(); saveState(); evalCraft(name || "First Discovery", true, true);
    if (activeTab === "achievements") renderPanel();
  }

  function onMerge(x, y, txt, isNew) {
    const t = Date.now(); if (t - lastStepAt < 350) return; lastStepAt = t;
    if (actCh() && !timerRunning && timerElapsed === 0) { timerStart = performance.now(); timerRunning = true; }
    bumpCombo();
    addReward((isNew ? 5 : 1) * comboMult(), isNew ? 15 : 5);
    state.stats.totalMerges = (state.stats.totalMerges || 0) + 1;
    if (timerRunning || actCh()) runSteps++;
    spawnSparks(x, y); playSfx("merge"); checkAchs(); saveState(); updateHud();
    if (txt) evalCraft(txt, Boolean(isNew), false);
  }

  function readIC() { try { const p = JSON.parse(localStorage.getItem("infinite-craft-data") || "null"); return Array.isArray(p) ? p : (p && Array.isArray(p.elements) ? p.elements : null); } catch { return null; } }

  function startWatchers() {
    const init = readIC(); if (init) { init.forEach((e) => e && e.text && knownTexts.add(e.text)); lsInit = true; }
    document.querySelectorAll(".instance,.item-instance").forEach((el) => instMap.set(el, instTxt(el)));
    window.addEventListener("pointerdown", (e) => { if (e.target?.closest?.(".sidebar")) lastSbAt = Date.now(); }, true);
    window.addEventListener("dblclick", (e) => { if (e.target?.closest?.(".instance,.item-instance")) lastDblAt = Date.now(); }, true);
    window.addEventListener("pointerup", (e) => {
      if (!e.target?.closest?.(`#${P}panel,#${P}shop-ov,#${P}fab,#${P}hud`)) lastPointer = { x: e.clientX, y: e.clientY, time: Date.now() };
      setTimeout(syncUiDarkMode, 80);
    }, true);

    setInterval(() => {
      syncUiDarkMode();
      if (state.visual.hidePlayersCompleted) hidePlayersStat(document.body);
      const list = readIC(); if (!list) return;
      if (!lsInit) { list.forEach((e) => e && e.text && knownTexts.add(e.text)); lsInit = true; return; }
      const added = list.filter((e) => e && e.text && !knownTexts.has(e.text));
      added.forEach((e) => {
        knownTexts.add(e.text); sessionNewCount++;
        if (sessionNewCount > (state.stats.bestSessionNew || 0)) state.stats.bestSessionNew = sessionNewCount;
        const fd = Boolean(e.discovered || e.isNew);
        if (Date.now() - lastStepAt > 900) onMerge(lastPointer.x, lastPointer.y, e.text, true);
        else { addReward(4 * comboMult(), 10); saveState(); }
        if (fd) onFirstDisc(e.text); else evalCraft(e.text, true, false);
      });
    }, 550);

    const obs = new MutationObserver((ms) => {
      const now = Date.now(), drop = now - lastPointer.time < 3200, dbl = now - lastDblAt < 500;
      const addI = [], mutI = new Set(); let remC = 0;
      for (const m of ms) {
        if (m.target?.closest?.(`#${P}panel,#${P}shop-ov,#${P}hud,#${P}toast`)) continue;
        if (m.type === "childList") {
          for (const n of m.removedNodes) if (isInst(n)) { remC++; lastRemAt = now; }
          for (const n of m.addedNodes) {
            if (!(n instanceof HTMLElement) || (n.id && n.id.startsWith(P))) continue;
            if (state.visual.hidePlayersCompleted) hidePlayersStat(n);
            if (/first\s+discovery/i.test(n.textContent || "")) onFirstDisc("");
            if (isInst(n)) { instMap.set(n, instTxt(n)); addI.push(n); }
            else { const pi = m.target instanceof HTMLElement ? m.target.closest(".instance,.item-instance") : null; if (pi) mutI.add(pi); }
          }
        } else if (m.type === "characterData") {
          const p = m.target.parentElement;
          if (p && state.visual.hidePlayersCompleted && PC_RE.test(m.target.nodeValue || "")) hidePlayersStat(p);
          const bx = p?.closest?.(".instance,.item-instance"); if (bx) mutI.add(bx);
        }
      }
      if (dbl) return;
      for (const bx of mutI) {
        const prev = instMap.get(bx), next = instTxt(bx);
        if (prev && next && norm(prev) !== norm(next)) {
          instMap.set(bx, next); const r = bx.getBoundingClientRect();
          onMerge(r.left + r.width / 2, r.top + r.height / 2, next, false); return;
        }
        if (next) instMap.set(bx, next);
      }
      if (drop && (remC > 0 || now - lastRemAt < 180) && !((now - lastSbAt < 350) && remC === 0) && addI.length) {
        const res = addI[addI.length - 1], r = res.getBoundingClientRect(), txt = instTxt(res);
        if (txt) { lastRemAt = 0; onMerge(r.left + r.width / 2, r.top + r.height / 2, txt, false); }
      }
    });
    if (document.body) obs.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  // Shop Logic
  const isEq = (it) => (it.cat === "themes" && state.visual.theme === it.val) || (it.cat === "cursors" && state.visual.cursor === it.val) || (it.cat === "particles" && state.visual.particleStyle === it.val) || (it.cat === "frames" && state.visual.frame === it.val);
  function toggleEquip(it) {
    const eq = isEq(it);
    if (it.cat === "themes") { state.visual.theme = eq ? "original" : it.val; if (!eq) state.visual.bgColor = ""; applyTheme(); }
    else if (it.cat === "cursors") { state.visual.cursor = eq ? "default" : it.val; applyTheme(); }
    else if (it.cat === "particles") { state.visual.particleStyle = eq ? "sparks" : it.val; if (!eq) { state.visual.particles = true; spawnSparks(window.innerWidth * 0.5, window.innerHeight * 0.45, it.val); } }
    else if (it.cat === "frames") { state.visual.frame = eq ? "none" : it.val; applyFrames(); }
    shopMsg = eq ? ("Unequipped " + it.name + ".") : ("Equipped " + it.name + "!");
    saveState(() => { renderShop(); if (activeTab === "lab") renderPanel(); });
  }
  function buyOrEquip(it) {
    if (state.economy.owned[it.id]) return toggleEquip(it);
    const c = state.economy.coins || 0;
    if (c < it.price) { shopMsg = "You need " + (it.price - c) + " more Craft Coins!"; toast("Need " + (it.price - c) + " more Coins!", "err"); return renderShop(); }
    state.economy.coins = c - it.price; state.economy.owned[it.id] = true;
    playSfx("buy"); spawnSparks(window.innerWidth * 0.5, window.innerHeight * 0.5, "gold_burst");
    toggleEquip(it); shopMsg = "Nice choice! Enjoy " + it.name + "!";
    checkAchs(); saveState(() => { updCoins(); renderShop(); }); toast("Bought " + it.name + "!", "gold");
  }
  function claimDaily() {
    const td = dayKey(); if (state.economy.lastDailyDate === td) return;
    state.economy.dailyStreak = state.economy.lastDailyDate === dayKey(-1) ? (state.economy.dailyStreak || 0) + 1 : 1;
    state.economy.lastDailyDate = td; state.economy.dailyClaims = (state.economy.dailyClaims || 0) + 1;
    const rew = Math.min(75, 20 + (state.economy.dailyStreak - 1) * 5);
    addReward(rew, 25); playSfx("discovery"); spawnConfetti(window.innerWidth * 0.5, window.innerHeight * 0.32);
    shopMsg = "Daily Chest opened! +" + rew + " Coins (Day " + state.economy.dailyStreak + " streak)";
    checkAchs(); saveState(() => { updCoins(); renderShop(); if (activeTab === "achievements") renderPanel(); });
    toast("Daily Chest: +" + rew + " Coins!", "gold");
  }

  function openShop() {
    const ov = document.getElementById(P + "shop-ov"); if (!ov) return;
    shopMsg = "Welcome! Browse the wooden shelf below.";
    syncUiDarkMode();
    ov.classList.add("open");
    renderShop();
  }
  const closeShop = () => { const o = document.getElementById(P + "shop-ov"); if (o) o.classList.remove("open"); };

  function renderShop() {
    const ov = document.getElementById(P + "shop-ov"); if (!ov) return;
    const can = state.economy.lastDailyDate !== dayKey(), lv = lvlInfo(state.economy.xp);
    ov.querySelector("#" + P + "shop-coins").textContent = String(state.economy.coins || 0);
    ov.querySelector("#" + P + "shop-lvl").textContent = "Lv." + lv.lv + " " + lv.rank;
    ov.querySelector("#" + P + "shop-msg").textContent = shopMsg;

    const chestSvg = `<svg width="22" height="22" viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="12" rx="2" fill="#b45309" stroke="#78350f" stroke-width="1.8"/><path d="M3 10h18M12 8v12" stroke="#facc15" stroke-width="2"/><rect x="9.5" y="11" width="5" height="4" rx="1" fill="#fde047" stroke="#78350f" stroke-width="1.2"/></svg>`;
    const cb = ov.querySelector("#" + P + "daily-btn");
    cb.classList.toggle("ready", can); cb.disabled = !can;
    cb.innerHTML = can ? `${chestSvg}<div><b>Daily Chest</b><small>Day ${state.economy.lastDailyDate === dayKey(-1) ? (state.economy.dailyStreak || 0) + 1 : 1} Bonus</small></div>` : `${chestSvg}<div><b>Claimed</b><small>${state.economy.dailyStreak || 1}d streak</small></div>`;

    ov.querySelectorAll("[data-sc]").forEach((b) => b.classList.toggle("on", b.getAttribute("data-sc") === shopCat));
    const g = ov.querySelector("#" + P + "shop-grid"); g.innerHTML = "";

    SHOP_ITEMS.filter((i) => shopCat === "all" || i.cat === shopCat).forEach((it) => {
      const own = Boolean(state.economy.owned[it.id]), eq = own && isEq(it), aff = (state.economy.coins || 0) >= it.price;
      const d = document.createElement("div"); d.className = P + "sitem" + (eq ? " eq" : "");
      d.innerHTML = `<div class="${P}sit-t"><div class="${P}sit-i">${it.ico}</div><div style="flex:1;min-width:0"><div class="${P}sit-n">${esc(it.name)}</div><span class="${P}rar ${it.rarity.toLowerCase()}">${it.rarity}</span></div></div><div class="${P}sit-d">${esc(it.desc)}</div><div class="${P}sit-f"><span class="${P}spr">${own ? "OWNED" : it.price + " Coins"}</span><button type="button" class="${P}sbuy ${eq ? "eq" : own ? "own" : aff ? "buy" : "lock"}">${eq ? "Equipped" : own ? "Equip" : "Buy"}</button></div>`;
      d.querySelector("button").addEventListener("click", () => buyOrEquip(it));
      g.appendChild(d);
    });
  }

  // Controls
  function toggleTimer() { if (timerRunning) { timerElapsed += performance.now() - timerStart; timerRunning = false; toast("Paused: " + fmt(timerElapsed)); } else { timerStart = performance.now(); timerRunning = true; toast("Speedrun started!"); } updateHud(); if (activeTab === "challenges") renderPanel(); }
  function resetRun() { timerRunning = false; timerElapsed = 0; runSteps = 0; runNewCount = 0; updateHud(); toast("Run reset"); if (activeTab === "challenges") renderPanel(); }
  function toggleClean() { state.hud.cleanView = !state.hud.cleanView; updateHud(); saveState(); toast(state.hud.cleanView ? "Clean View ON" : "Clean View OFF"); if (activeTab === "challenges") renderPanel(); }
  function applyAudio() { audioEl.volume = Math.max(0, Math.min(1, Number(state.audio.volume ?? 0.65))); audioEl.playbackRate = Math.max(0.5, Math.min(2, Number(state.audio.speed ?? 1))); audioEl.loop = Boolean(state.audio.loop && tracks.length <= 1); }
  function playTrack(i) { if (!tracks.length) return; curTrack = ((i % tracks.length) + tracks.length) % tracks.length; audioEl.src = tracks[curTrack].url; applyAudio(); audioEl.play().then(() => unlockAch("dj_craft")).catch(() => {}); if (activeTab === "radio") renderPanel(); }
  function toggleRadio() { if (!tracks.length) return toast("Upload an MP3 first.", "err"); if (curTrack === -1) return playTrack(0); if (audioEl.paused) { applyAudio(); audioEl.play().then(() => unlockAch("dj_craft")).catch(() => {}); toast("Playing: " + tracks[curTrack].name); } else { audioEl.pause(); toast("Radio paused"); } if (activeTab === "radio") renderPanel(); }
  audioEl.addEventListener("ended", () => { if (tracks.length && state.audio.loop) playTrack(curTrack + 1); });

  function applyFrames() { const fr = state.visual.frame || "none"; [document.getElementById(P + "fab"), document.getElementById(P + "hud")].forEach((el) => { if (!el) return; el.classList.toggle(P + "fgold", fr === "gold"); el.classList.toggle(P + "frain", fr === "rainbow"); }); }

  function ensureStyles() {
    if (document.getElementById(P + "css")) return;
    const st = document.createElement("style"); st.id = P + "css";
    st.textContent = `
      #${P}fab,#${P}panel,#${P}hud,#${P}toast,#${P}shop-ov{font-family:'Roboto','Segoe UI',system-ui,sans-serif!important}
      @keyframes ${P}rb{0%{border-color:#ef4444;box-shadow:0 0 12px #ef444488}33%{border-color:#facc15;box-shadow:0 0 12px #facc1588}66%{border-color:#22c55e;box-shadow:0 0 12px #22c55e88}100%{border-color:#ef4444;box-shadow:0 0 12px #ef444488}}
      @keyframes ${P}bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
      @keyframes ${P}blnk{0%,86%,100%{fill:#ef4444}92%{fill:#fca5a5}}
      .${P}fgold{border:2.5px solid #eab308!important;box-shadow:0 0 12px rgba(234,179,8,.55)!important}
      .${P}frain{border:2.5px solid #ef4444!important;animation:${P}rb 3s linear infinite!important}

      #${P}fab{position:fixed;left:12px;bottom:62px;z-index:2147483640;display:flex;align-items:center;gap:7px;background:#ffffff;color:#111111;border:1px solid #c8c8c8;border-radius:8px;padding:7px 13px;cursor:grab;font-size:13.5px;font-weight:600;box-shadow:0 2px 6px rgba(0,0,0,.12);user-select:none;touch-action:none;transition:background .15s,color .15s,border-color .15s}
      #${P}fab:hover{background:#f1f5f9;border-color:#94a3b8}
      #${P}fab.${P}dark{background:#111114;color:#f8fafc;border-color:#32323a;box-shadow:0 2px 10px rgba(0,0,0,.45)}
      #${P}fab.${P}dark:hover{background:#1d1d24;border-color:#52525b}
      #${P}fab.drag{cursor:grabbing;box-shadow:0 8px 20px rgba(0,0,0,.3)}

      #${P}hud{position:fixed;z-index:2147483635;display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.94);color:#111;border:1px solid #c8c8c8;border-radius:8px;padding:6px 11px;font-size:12.5px;font-weight:600;box-shadow:0 2px 10px rgba(0,0,0,.08);cursor:move;user-select:none;max-width:min(540px,84vw);transition:background .15s,color .15s}
      #${P}hud.${P}dark{background:rgba(17,17,20,.94);color:#f4f4f5;border-color:#32323a;box-shadow:0 2px 12px rgba(0,0,0,.5)}
      #${P}hud .m{max-width:190px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:700}
      #${P}hud .sep{width:1px;height:14px;background:#d4d4d8}#${P}hud.${P}dark .sep{background:#3f3f46}
      #${P}hud .tm{font-family:Consolas,monospace;font-weight:700;color:#2563eb}#${P}hud.${P}dark .tm{color:#60a5fa}
      #${P}hud .cmb{display:none;background:#fef08a;color:#854d0e;border:1px solid #eab308;border-radius:5px;padding:1px 6px;font-size:10.5px;font-weight:800}
      #${P}hud .cmb.on{display:inline-block}
      #${P}hud .hb{background:#f4f4f5;color:#111;border:1px solid #d4d4d8;border-radius:5px;padding:2px 7px;font-size:11px;font-weight:700;cursor:pointer}
      #${P}hud.${P}dark .hb{background:#23232a;color:#f4f4f5;border-color:#3f3f46}

      #${P}panel{position:fixed;top:54px;left:50%;transform:translateX(-50%);z-index:2147483644;width:min(448px,94vw);max-height:83vh;display:none;flex-direction:column;background:#fff;color:#111;border:1px solid #c8c8c8;border-radius:10px;box-shadow:0 12px 32px rgba(0,0,0,.18);overflow:hidden}
      #${P}panel.open{display:flex}#${P}panel *{box-sizing:border-box}
      .${P}hdr{display:flex;align-items:center;justify-content:space-between;padding:9px 12px;background:#fafafa;border-bottom:1px solid #e4e4e7;cursor:move;user-select:none;gap:6px}
      .${P}hdr h3{margin:0;font-size:13.5px;font-weight:700;display:flex;align-items:center;gap:6px}
      .${P}shbtn{display:inline-flex;align-items:center;gap:5px;background:#fef9c3;color:#713f12;border:1px solid #eab308;border-radius:7px;padding:4px 8px;font-size:11.5px;font-weight:700;cursor:pointer}
      .${P}x{background:transparent;color:#52525b;border:1px solid transparent;border-radius:6px;padding:3px 8px;font-size:13px;font-weight:700;cursor:pointer}
      .${P}x:hover{background:#fee2e2;color:#dc2626}
      .${P}tabs{display:flex;gap:4px;padding:7px 9px;background:#fafafa;border-bottom:1px solid #e4e4e7}
      .${P}tab{flex:1;background:#fff;color:#3f3f46;border:1px solid #d4d4d8;border-radius:6px;padding:6px 3px;font-size:11px;font-weight:600;cursor:pointer}
      .${P}tab.on{background:#111;color:#fff;border-color:#111}
      .${P}body{padding:12px;overflow-y:auto;display:flex;flex-direction:column;gap:9px}
      .${P}lbl{font-size:11px;font-weight:700;color:#71717a;text-transform:uppercase;letter-spacing:.4px}
      .${P}card{background:#fafafa;border:1px solid #e4e4e7;border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:7px}
      .${P}row{display:flex;align-items:center;justify-content:space-between;gap:8px;background:#fff;border:1px solid #e4e4e7;border-radius:7px;padding:7px 10px;font-size:12.5px}
      #${P}panel input[type=checkbox]{appearance:none;-webkit-appearance:none;flex-shrink:0;width:36px;height:20px;border-radius:999px;position:relative;background:#d4d4d8;border:0;cursor:pointer}
      #${P}panel input[type=checkbox]::after{content:"";position:absolute;top:2.5px;left:2.5px;width:15px;height:15px;border-radius:50%;background:#fff;transition:transform .15s}
      #${P}panel input[type=checkbox]:checked{background:#111}#${P}panel input[type=checkbox]:checked::after{transform:translateX(16px)}
      #${P}panel input[type=range]{flex:1;max-width:145px;accent-color:#111}
      .${P}inp,.${P}sel{width:100%;background:#fff;color:#111;border:1px solid #d4d4d8;border-radius:7px;padding:7px 9px;font-size:12.5px;outline:none}
      .${P}btn{background:#fff;color:#111;border:1px solid #c8c8c8;border-radius:7px;padding:7px 10px;font-size:12px;font-weight:600;cursor:pointer}
      .${P}btn:hover{background:#f4f4f5}.${P}btn:disabled{opacity:.5;cursor:not-allowed}
      .${P}btn.pri{background:#111;color:#fff;border-color:#111}.${P}btn.grn{background:#16a34a;color:#fff;border-color:#16a34a}.${P}btn.red{color:#dc2626;border-color:#fca5a5}
      .${P}acts{display:flex;gap:6px;flex-wrap:wrap}.${P}acts .${P}btn{flex:1;min-width:65px}
      .${P}pills{display:flex;gap:4px}.${P}pill{flex:1;background:#fff;color:#52525b;border:1px solid #d4d4d8;border-radius:6px;padding:5px 4px;font-size:11px;font-weight:700;cursor:pointer;text-transform:uppercase}.${P}pill.on{background:#111;color:#fff;border-color:#111}
      .${P}g2{display:grid;grid-template-columns:1fr 1fr;gap:6px}.${P}swg{display:grid;grid-template-columns:repeat(8,1fr);gap:5px}
      .${P}sw{height:26px;border-radius:6px;border:1.5px solid #cbd5e1;cursor:pointer}.${P}sw.on{border-color:#111;box-shadow:inset 0 0 0 1.5px #111}
      .${P}wh{background:#fff;border:1px solid #c8c8c8;border-radius:8px;padding:12px;text-align:center;min-height:54px;display:flex;align-items:center;justify-content:center;font-size:13.5px;font-weight:700}
      .${P}wh.spin{background:#eff6ff;border-color:#3b82f6;color:#1d4ed8}.${P}wh.ok{border-color:#16a34a;background:#f0fdf4;color:#14532d}
      .${P}tb{display:flex;align-items:center;gap:8px;background:#fff;color:#111;border:1px solid #d4d4d8;border-radius:7px;padding:7px 9px;font-size:12px;font-weight:600;cursor:pointer}
      .${P}tb.on{border-color:#111;background:#f4f4f5}.${P}pal{display:inline-flex;gap:2px}.${P}pal i{display:block;width:9px;height:14px;border:1px solid rgba(0,0,0,.2);border-radius:2px}
      .${P}ach{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid #e4e4e7;border-radius:8px;padding:8px 10px;opacity:.58}.${P}ach.done{opacity:1;border-color:#16a34a;background:#f0fdf4}
      .${P}pb{width:100%;height:7px;background:#e4e4e7;border-radius:999px;overflow:hidden}.${P}pb i{display:block;height:100%;background:#111}.${P}pb.xp i{background:linear-gradient(90deg,#eab308,#f59e0b)}
      .${P}bdg{font-size:11px;font-weight:700;padding:2px 7px;border-radius:5px;background:#f4f4f5;border:1px solid #d4d4d8}
      .${P}nt{font-size:11.5px;color:#71717a;line-height:1.4}
      .${P}rcp{display:flex;align-items:center;justify-content:space-between;gap:6px;background:#fff;border:1px solid #e4e4e7;border-radius:8px;padding:7px 9px}.${P}rcp.pin{border-color:#eab308;background:#fefce8}
      .${P}chip{background:#f4f4f5;border:1px solid #d4d4d8;border-radius:5px;padding:2px 6px;font-size:11.5px;font-weight:600}.${P}chip.r{background:#111;color:#fff;border-color:#111}

      #${P}panel.${P}dark{background:#141418;color:#f4f4f5;border-color:#32323a;box-shadow:0 14px 36px rgba(0,0,0,.6)}
      #${P}panel.${P}dark .${P}hdr,#${P}panel.${P}dark .${P}tabs{background:#1a1a20;border-color:#2c2c35}
      #${P}panel.${P}dark .${P}tab{background:#141418;color:#a1a1aa;border-color:#32323a}
      #${P}panel.${P}dark .${P}tab.on{background:#ffffff;color:#111111;border-color:#ffffff}
      #${P}panel.${P}dark .${P}card{background:#1a1a20;border-color:#2c2c35}
      #${P}panel.${P}dark .${P}row,#${P}panel.${P}dark .${P}tb,#${P}panel.${P}dark .${P}wh,#${P}panel.${P}dark .${P}ach,#${P}panel.${P}dark .${P}rcp{background:#121216;color:#f4f4f5;border-color:#2e2e38}
      #${P}panel.${P}dark .${P}ach.done{background:#0d2617;border-color:#16a34a}
      #${P}panel.${P}dark .${P}wh.ok{background:#0d2617;border-color:#16a34a;color:#bbf7d0}
      #${P}panel.${P}dark .${P}inp,#${P}panel.${P}dark .${P}sel{background:#0d0d11;color:#f4f4f5;border-color:#32323a}
      #${P}panel.${P}dark .${P}btn,#${P}panel.${P}dark .${P}pill,#${P}panel.${P}dark .${P}bdg,#${P}panel.${P}dark .${P}chip{background:#23232b;color:#f4f4f5;border-color:#3f3f46}
      #${P}panel.${P}dark .${P}btn.pri,#${P}panel.${P}dark .${P}pill.on,#${P}panel.${P}dark .${P}chip.r{background:#ffffff;color:#111111;border-color:#ffffff}
      #${P}panel.${P}dark .${P}btn.grn{background:#16a34a;color:#fff;border-color:#16a34a}
      #${P}panel.${P}dark .${P}btn.red{color:#f87171;border-color:#7f1d1d}
      #${P}panel.${P}dark .${P}nt,#${P}panel.${P}dark .${P}lbl{color:#a1a1aa}
      #${P}panel.${P}dark .${P}pb{background:#27272a}#${P}panel.${P}dark .${P}pb i{background:#f4f4f5}
      #${P}panel.${P}dark input[type=checkbox]{background:#3f3f46}#${P}panel.${P}dark input[type=checkbox]:checked{background:#22c55e}
      #${P}panel.${P}dark .${P}x{color:#a1a1aa}

      #${P}shop-ov{position:fixed;inset:0;z-index:2147483645;background:rgba(9,9,11,.55);backdrop-filter:blur(3px);display:none;align-items:center;justify-content:center;padding:14px}
      #${P}shop-ov.open{display:flex}#${P}shop-ov *{box-sizing:border-box}
      .${P}swin{width:min(690px,95vw);max-height:90vh;background:#ffffff;color:#111111;border:2px solid #c8c8c8;border-radius:16px;box-shadow:0 22px 60px rgba(0,0,0,.28);display:flex;flex-direction:column;overflow:hidden}
      #${P}shop-ov.${P}dark .${P}swin{background:#141418;color:#f8fafc;border-color:#34343e;box-shadow:0 24px 65px rgba(0,0,0,.72)}
      .${P}stop{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 18px;background:#ffffff;border-bottom:1px solid #e4e4e7}
      #${P}shop-ov.${P}dark .${P}stop{background:#1b1b22;border-color:#2d2d37}
      .${P}stit{font-size:22px;font-weight:800;letter-spacing:.3px;display:flex;align-items:center;gap:8px}
      .${P}cpill{display:inline-flex;align-items:center;gap:5px;background:#fefce8;color:#854d0e;border:1.5px solid #eab308;border-radius:9px;padding:4px 11px;font-size:13px;font-weight:800}
      #${P}shop-ov.${P}dark .${P}cpill{background:#231e0a;color:#fde047;border-color:#ca8a04}
      .${P}lpill{background:#f4f4f5;color:#27272a;border:1px solid #d4d4d8;border-radius:9px;padding:4px 11px;font-size:12px;font-weight:700}
      #${P}shop-ov.${P}dark .${P}lpill{background:#23232c;color:#e4e4e7;border-color:#3f3f46}
      .${P}sexit{background:linear-gradient(180deg,#ff3b3b,#dc1616);color:#fff;border:1px solid #991b1b;border-radius:8px;padding:6px 20px;font-size:14.5px;font-weight:800;cursor:pointer;box-shadow:0 3px 0 #7f1d1d}
      .${P}sexit:hover{filter:brightness(1.07)}.${P}sexit:active{transform:translateY(2px);box-shadow:0 1px 0 #7f1d1d}

      .${P}stage{position:relative;display:flex;align-items:flex-end;justify-content:center;padding:18px 18px 0;min-height:178px;background-color:#f8fafc;background-image:radial-gradient(circle at 50% 62%,rgba(250,204,21,.16),transparent 58%),radial-gradient(#cbd5e1 1.1px,transparent 1.1px);background-size:100% 100%,20px 20px;overflow:hidden}
      #${P}shop-ov.${P}dark .${P}stage{background-color:#0f0f13;background-image:radial-gradient(circle at 50% 62%,rgba(248,113,113,.16),transparent 58%),radial-gradient(#2e2e3a 1.1px,transparent 1.1px);background-size:100% 100%,20px 20px}
      .${P}bubble{position:absolute;left:16px;top:16px;max-width:215px;background:#ffffff;color:#111111;border:1px solid #c8c8c8;border-radius:11px;padding:9px 12px;font-size:12px;font-weight:600;line-height:1.38;box-shadow:0 3px 10px rgba(0,0,0,.07)}
      .${P}bubble::after{content:"";position:absolute;right:-6px;top:18px;width:10px;height:10px;background:#fff;border-right:1px solid #c8c8c8;border-top:1px solid #c8c8c8;transform:rotate(45deg)}
      #${P}shop-ov.${P}dark .${P}bubble{background:#1b1b22;color:#f4f4f5;border-color:#3a3a46;box-shadow:0 4px 14px rgba(0,0,0,.4)}
      #${P}shop-ov.${P}dark .${P}bubble::after{background:#1b1b22;border-color:#3a3a46}
      .${P}dbtn{position:absolute;right:16px;top:16px;display:flex;align-items:center;gap:8px;text-align:left;background:#f4f4f5;color:#71717a;border:1.5px solid #d4d4d8;border-radius:10px;padding:7px 11px;cursor:not-allowed;min-width:130px;font-size:12px}
      #${P}shop-ov.${P}dark .${P}dbtn{background:#1b1b22;color:#a1a1aa;border-color:#3a3a46}
      .${P}dbtn small{display:block;font-size:10px;opacity:.85}
      .${P}dbtn.ready{background:linear-gradient(180deg,#fef08a,#facc15)!important;color:#713f12!important;border-color:#ca8a04!important;cursor:pointer;box-shadow:0 4px 14px rgba(234,179,8,.38)}

      #${P}robot{width:182px;height:146px;position:relative;z-index:2;margin-bottom:-4px;user-select:none;filter:drop-shadow(0 6px 10px rgba(0,0,0,.18));animation:${P}bob 3.2s ease-in-out infinite}
      #${P}robot svg{width:100%;height:100%;overflow:visible}
      #${P}cam-led{animation:${P}blnk 2.6s infinite}

      .${P}scats{display:flex;gap:6px;padding:9px 16px;background:linear-gradient(180deg,#5c2808,#471d04);border-top:5px solid #2b1001;border-bottom:3px solid #2b1001;flex-wrap:wrap;align-items:center;box-shadow:0 3px 10px rgba(0,0,0,.35)}
      .${P}scat{background:#73320b;color:#fde68a;border:1px solid #9a4410;border-radius:7px;padding:4px 12px;font-size:11px;font-weight:700;cursor:pointer;text-transform:uppercase}
      .${P}scat:hover{background:#8c3e10;color:#fff}.${P}scat.on{background:#ffffff;color:#111111;border-color:#ffffff}

      .${P}wshelf{flex:1;min-height:0;overflow-y:auto;max-height:42vh;background:repeating-linear-gradient(180deg,#6e3009 0px,#6e3009 42px,#5e2706 42px,#5e2706 46px);box-shadow:inset 0 10px 22px rgba(0,0,0,.5);padding:14px 16px 18px}
      .${P}wshelf::-webkit-scrollbar{width:8px}.${P}wshelf::-webkit-scrollbar-track{background:#3b1702}.${P}wshelf::-webkit-scrollbar-thumb{background:#b45309;border-radius:6px}
      .${P}sgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
      @media(max-width:540px){.${P}sgrid{grid-template-columns:1fr}}
      .${P}sitem{background:linear-gradient(180deg,#f0fffb 0%,#d7faef 100%);color:#111111;border:2px solid #9ce6d0;border-radius:11px;padding:10px 12px;display:flex;flex-direction:column;gap:6px;box-shadow:0 4px 12px rgba(0,0,0,.32);transition:transform .12s,border-color .12s}
      .${P}sitem:hover{transform:translateY(-2px);border-color:#ffffff}
      .${P}sitem.eq{border-color:#16a34a;box-shadow:0 0 0 2px #22c55e,0 4px 14px rgba(0,0,0,.35)}
      .${P}sit-t{display:flex;align-items:center;gap:9px}.${P}sit-i{width:38px;height:38px;border-radius:8px;background:#fff;border:1.5px solid #bbf7d0;display:flex;align-items:center;justify-content:center;flex-shrink:0}
      .${P}sit-n{font-size:13.5px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .${P}rar{display:inline-block;font-size:10px;font-weight:800;text-transform:uppercase;padding:1px 6px;border-radius:4px}.${P}rar.common{background:#e2e8f0;color:#334155}.${P}rar.rare{background:#dbeafe;color:#1d4ed8}.${P}rar.epic{background:#f3e8ff;color:#7e22ce}
      .${P}sit-d{font-size:11.5px;color:#3f3f46;flex:1}.${P}sit-f{display:flex;align-items:center;justify-content:space-between;gap:6px}
      .${P}spr{font-size:12px;font-weight:800;color:#854d0e}
      .${P}sbuy{border:1px solid #c8c8c8;border-radius:6px;padding:5px 12px;font-size:11.5px;font-weight:800;cursor:pointer;text-transform:uppercase}
      .${P}sbuy.buy{background:#111;color:#fff;border-color:#111}.${P}sbuy.lock{background:#e4e4e7;color:#71717a}.${P}sbuy.own{background:#2563eb;color:#fff;border-color:#2563eb}.${P}sbuy.eq{background:#16a34a;color:#fff;border-color:#16a34a}

      #${P}toast{position:fixed;bottom:18px;left:50%;transform:translateX(-50%) translateY(16px);z-index:2147483647;background:#111;color:#fff;border:1px solid #3f3f46;border-radius:8px;padding:9px 15px;font-size:12.5px;font-weight:600;opacity:0;pointer-events:none;transition:opacity .18s,transform .18s}
      #${P}toast.show{opacity:1;transform:translateX(-50%) translateY(0)}#${P}toast.gold{border-color:#facc15;color:#fef08a}#${P}toast.err{background:#dc2626;border-color:#b91c1c}
    `;
    (document.head || document.documentElement).appendChild(st);
  }

  function applyTheme() {
    const sb = document.querySelector(".sidebar");
    document.querySelectorAll("body>div,#__nuxt,#__nuxt>div,#__layout,#__layout>div,.container,.instances,.workspace,main").forEach((el) => {
      if (!(el instanceof HTMLElement) || (el.id && el.id.startsWith(P)) || (sb && (el === sb || sb.contains(el))) || el.classList.contains("item") || el.classList.contains("instance")) return;
      const r = el.getBoundingClientRect(); if (r.width >= window.innerWidth * 0.45 && r.height >= window.innerHeight * 0.45) el.classList.add(P + "ws");
    });
    let st = document.getElementById(P + "th");
    if (!st) { st = document.createElement("style"); st.id = P + "th"; (document.head || document.documentElement).appendChild(st); }
    const v = state.visual, has = v.theme !== "original" || Boolean(v.bgColor) || Boolean(v.bgImage);
    let bg = v.bgColor || "", img = "", sz = "", ex = "";
    const dk = `.sidebar{background:#181b20!important;border-color:#2f3540!important;color:#f1f5f9!important}.sidebar-input{background:#101216!important;color:#fff!important;border-color:#2f3540!important}.item,.instance{background:#222730!important;border-color:#3d4554!important;color:#f8fafc!important}.item:hover{background:#2c3340!important}`;
    if (v.theme === "grid_paper") { bg = bg || "#fdfefe"; img = "linear-gradient(rgba(59,130,246,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,.16) 1px,transparent 1px)"; sz = "26px 26px"; }
    else if (v.theme === "parchment") { bg = bg || "#f4ead2"; img = "radial-gradient(rgba(120,53,15,.1) 1px,transparent 0)"; sz = "20px 20px"; ex = `.sidebar{background:#efe1c1!important;border-color:#cbb68a!important}.item,.instance{background:#fbf5e6!important;border-color:#bfa675!important;color:#3b2310!important}`; }
    else if (v.theme === "chalkboard") { bg = bg || "#16191d"; img = "radial-gradient(rgba(255,255,255,.05) 1px,transparent 0)"; sz = "22px 22px"; ex = dk; }
    else if (v.theme === "blueprint") { bg = bg || "#0b2545"; img = "linear-gradient(rgba(147,197,253,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(147,197,253,.18) 1px,transparent 1px)"; sz = "28px 28px"; ex = `.sidebar{background:#0f2f57!important;border-color:#2c5b94!important;color:#e0f2fe!important}.sidebar-input{background:#091d36!important;color:#e0f2fe!important}.item,.instance{background:#133c6e!important;border-color:#60a5fa!important;color:#fff!important}`; }
    else if (v.theme === "neon_lab") { bg = bg || "#0d0a1a"; img = "linear-gradient(rgba(34,211,238,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,.12) 1px,transparent 1px)"; sz = "32px 32px"; ex = `.sidebar{background:#130e26!important;border-color:#3b2a6e!important;color:#f5f3ff!important}.sidebar-input{background:#0b0817!important;color:#fff!important}.item,.instance{background:#1a1333!important;border-color:#22d3ee!important;color:#fff!important}`; }
    else if (v.theme === "galaxy") { bg = bg || "#0f0a24"; img = "radial-gradient(rgba(255,255,255,.28) 1px,transparent 0),radial-gradient(rgba(192,132,252,.22) 1.5px,transparent 0)"; sz = "46px 46px"; ex = `.sidebar{background:#171033!important;border-color:#4c1d95!important;color:#f5f3ff!important}.sidebar-input{background:#0e0921!important;color:#fff!important}.item,.instance{background:#21164a!important;border-color:#a855f7!important;color:#fff!important}`; }
    else if (v.theme === "sakura") { bg = bg || "#fff1f6"; img = "radial-gradient(rgba(244,114,182,.22) 1.5px,transparent 0)"; sz = "28px 28px"; ex = `.sidebar{background:#ffe4ee!important;border-color:#f9a8d4!important;color:#831843!important}.item,.instance{background:#fff!important;border-color:#f472b6!important;color:#831843!important}`; }
    else if (v.theme === "lava_core") { bg = bg || "#1a0b09"; img = "radial-gradient(rgba(249,115,22,.16) 1.5px,transparent 0)"; sz = "26px 26px"; ex = `.sidebar{background:#26100c!important;border-color:#9a3412!important;color:#ffedd5!important}.sidebar-input{background:#140806!important;color:#ffedd5!important}.item,.instance{background:#331610!important;border-color:#f97316!important;color:#fff7ed!important}`; }
    else if (v.theme === "matrix_code") { bg = bg || "#030f06"; img = "linear-gradient(rgba(34,197,94,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,.14) 1px,transparent 1px)"; sz = "22px 22px"; ex = `.sidebar{background:#05170a!important;border-color:#15803d!important;color:#bbf7d0!important}.sidebar-input{background:#020a04!important;color:#4ade80!important}.item,.instance{background:#07210e!important;border-color:#22c55e!important;color:#4ade80!important}`; }
    if (v.autoSyncDark !== false && v.bgColor && isDark(v.bgColor) && !ex) ex = dk;

    let css = "";
    if (has) {
      let rb = bg ? `background-color:${bg}!important;` : "";
      if (v.bgImage) { const dm = Math.max(0, Math.min(85, Number(v.bgDim ?? 25))) / 100; rb += `background-image:linear-gradient(rgba(0,0,0,${dm}),rgba(0,0,0,${dm})),url("${v.bgImage}")!important;background-size:cover!important;background-position:center!important;background-attachment:fixed!important;`; }
      else if (img) rb += `background-image:${img}!important;background-size:${sz}!important;background-attachment:fixed!important;`;
      else rb += `background-image:none!important;`;
      css += `html,body{${rb}}.${P}ws,#__nuxt,#__layout,.container,.instances{background-color:transparent!important;background-image:none!important}${ex}`;
    }
    if (v.cursor && v.cursor !== "default" && CURSORS[v.cursor]) {
      const c = CURSORS[v.cursor];
      css += `html,body,button,a,.item,.instance{cursor:url("data:image/svg+xml;utf8,${encodeURIComponent(c.svg)}") ${c.hot},auto!important}`;
    }
    if (v.hideDots) css += `canvas.particles,.particles,canvas:not(#${P}fx-canvas){opacity:0!important}`;
    st.textContent = css;
    applyFrames();
    syncUiDarkMode();
  }

  function applyFabPos() {
    const f = document.getElementById(P + "fab"); if (!f) return;
    const pos = state.fab?.v1Pos;
    if (pos && typeof pos.x === "number") {
      f.style.transform = "none"; f.style.bottom = "auto";
      f.style.left = Math.max(8, Math.min(window.innerWidth - 150, pos.x)) + "px";
      f.style.top = Math.max(8, Math.min(window.innerHeight - 40, pos.y)) + "px";
    } else { f.style.transform = "none"; f.style.top = "auto"; f.style.left = "12px"; f.style.bottom = "62px"; }
  }

  function updateHud() {
    const h = document.getElementById(P + "hud"); if (!h) return;
    h.style.display = (state.hud.show && !state.hud.cleanView) ? "flex" : "none";
    h.style.left = (state.hud.pos?.x ?? 16) + "px"; h.style.top = (state.hud.pos?.y ?? 62) + "px";
    const ch = actCh(), m = comboMult();
    h.querySelector("#" + P + "hm").textContent = ch ? ch.text : (state.challenge.lastCompleted ? "Done: " + state.challenge.lastCompleted : "No active challenge");
    h.querySelector("#" + P + "ht").textContent = fmt(nowMs());
    h.querySelector("#" + P + "hs").textContent = runSteps + " steps";
    const cb = h.querySelector("#" + P + "hc"); cb.textContent = "x" + m + " COMBO"; cb.classList.toggle("on", m >= 2);
    h.querySelector("#" + P + "hg").textContent = timerRunning ? "Pause" : "Start";
  }

  function dragEl(el, h, end) {
    let on = false, ox = 0, oy = 0;
    (h || el).addEventListener("mousedown", (e) => { if (e.target.closest("button,input,select")) return; on = true; const r = el.getBoundingClientRect(); ox = e.clientX - r.left; oy = e.clientY - r.top; el.style.transform = "none"; el.style.left = r.left + "px"; el.style.top = r.top + "px"; e.preventDefault(); });
    window.addEventListener("mousemove", (e) => { if (!on) return; el.style.left = Math.max(6, Math.min(window.innerWidth - 80, e.clientX - ox)) + "px"; el.style.top = Math.max(6, Math.min(window.innerHeight - 40, e.clientY - oy)) + "px"; });
    window.addEventListener("mouseup", () => { if (!on) return; on = false; end && end({ x: Math.round(parseFloat(el.style.left) || 16), y: Math.round(parseFloat(el.style.top) || 62) }); });
  }
  const noLeak = (el) => ["keydown", "keyup", "keypress"].forEach((ev) => el.addEventListener(ev, (e) => e.stopPropagation()));

  function renderPanel() {
    const p = document.getElementById(P + "panel"); if (!p) return;
    p.querySelectorAll("." + P + "tab").forEach((b) => b.classList.toggle("on", b.getAttribute("data-t") === activeTab));
    p.querySelector("#" + P + "cln").textContent = state.hud.cleanView ? "HUD" : "Clean";
    updCoins(); syncUiDarkMode();
    const b = p.querySelector("." + P + "body"); b.innerHTML = "";

    if (activeTab === "challenges") {
      const ch = actCh(), df = state.challenge.difficulty || "all";
      const lbl = ch ? ch.text : (state.challenge.lastCompleted ? "Completed! " + state.challenge.lastCompleted : "Pick a difficulty and click Spin Wheel");
      b.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span class="${P}bdg">Streak: <b>${state.challenge.streak || 0}</b></span>
          <span class="${P}bdg">Best: <b>${state.challenge.bestStreak || 0}</b></span>
          <label style="display:flex;align-items:center;gap:6px;font-size:11.5px;font-weight:600"><span>HUD</span><input type="checkbox" id="${P}ch"${state.hud.show && !state.hud.cleanView ? " checked" : ""}></label>
        </div>
        <div class="${P}lbl">Mission Wheel & Difficulty</div>
        <div class="${P}card">
          <div class="${P}pills">${["all", "easy", "medium", "hard"].map((d) => `<button type="button" class="${P}pill${df === d ? " on" : ""}" data-df="${d}">${d}</button>`).join("")}</div>
          <div class="${P}wh${ch ? " ok" : ""}" id="${P}wh">${esc(lbl)}</div>
          <div class="${P}acts"><button type="button" class="${P}btn pri" id="${P}ws">Spin Wheel</button><button type="button" class="${P}btn grn" id="${P}wd"${ch ? "" : " disabled"}>Completed</button><button type="button" class="${P}btn red" id="${P}wk"${ch ? "" : " disabled"}>Skip</button></div>
          <div style="display:flex;gap:5px"><input class="${P}inp" id="${P}wc" placeholder="Custom challenge (e.g. Craft: Pikachu)"><button type="button" class="${P}btn" id="${P}wa">+</button></div>
          <div class="${P}nt">Hotkeys: <b>F8</b> Pause • <b>F9</b> Reset • <b>Alt+R</b> Panel • <b>Alt+S</b> Shop • <b>Alt+H</b> Clean • <b>Alt+M</b> Radio</div>
        </div>
        <div class="${P}lbl">Timer & Steps</div>
        <div class="${P}card">
          <div style="display:flex;justify-content:space-between;align-items:center"><span style="font:700 22px/1 Consolas,monospace" id="${P}pt">${fmt(nowMs())}</span><span class="${P}bdg">Steps: <b>${runSteps}</b></span></div>
          <div class="${P}acts"><button type="button" class="${P}btn ${timerRunning ? "" : "pri"}" id="${P}tg">${timerRunning ? "Pause" : "Start"}</button><button type="button" class="${P}btn" id="${P}tr">Reset</button><button type="button" class="${P}btn" id="${P}ts">+1 Step</button></div>
        </div>
        <div class="${P}lbl">Records (${(state.challenge.records || []).length})</div>
        <div id="${P}rl" style="display:flex;flex-direction:column;gap:5px"></div>`;
      const ci = b.querySelector("#" + P + "wc"); noLeak(ci);
      b.querySelector("#" + P + "ch").onchange = (e) => { state.hud.show = e.target.checked; if (e.target.checked) state.hud.cleanView = false; updateHud(); saveState(); };
      b.querySelectorAll("[data-df]").forEach((x) => x.onclick = () => { state.challenge.difficulty = x.getAttribute("data-df"); saveState(renderPanel); });
      const sb = b.querySelector("#" + P + "ws"), wb = b.querySelector("#" + P + "wh");
      sb.onclick = () => {
        const pool = filtCh(); if (!pool.length || spinning) return;
        spinning = true; sb.disabled = true; wb.className = P + "wh spin";
        let s = 0; const tick = () => {
          const pk = pool[Math.floor(Math.random() * pool.length)]; wb.textContent = pk.text;
          if (++s < 15) setTimeout(tick, 45 + s * 10);
          else { spinning = false; sb.disabled = false; state.challenge.activeId = pk.id; state.challenge.lastCompleted = ""; timerElapsed = 0; runSteps = 0; runNewCount = 0; timerStart = performance.now(); timerRunning = true; saveState(); updateHud(); toast("Challenge active!"); renderPanel(); }
        }; tick();
      };
      b.querySelector("#" + P + "wd").onclick = () => completeCh(false);
      b.querySelector("#" + P + "wk").onclick = () => { state.challenge.activeId = null; state.challenge.streak = 0; timerRunning = false; timerElapsed = 0; runSteps = 0; saveState(() => { updateHud(); toast("Skipped (streak reset)", "err"); renderPanel(); }); };
      b.querySelector("#" + P + "wa").onclick = () => { const raw = ci.value.trim(); if (!raw) return; const t = raw.replace(/^craft\s*:\s*/i, "").trim(), it = { id: "cust_" + Date.now(), diff: "medium", text: /^craft\s*:/i.test(raw) ? raw : "Craft: " + raw, type: "word", kw: [t] }; state.challenge.customList.unshift(it); state.challenge.activeId = it.id; state.challenge.lastCompleted = ""; timerElapsed = 0; runSteps = 0; timerStart = performance.now(); timerRunning = true; saveState(() => { updateHud(); toast("Challenge added!"); renderPanel(); }); };
      b.querySelector("#" + P + "tg").onclick = toggleTimer; b.querySelector("#" + P + "tr").onclick = resetRun; b.querySelector("#" + P + "ts").onclick = () => { runSteps++; updateHud(); renderPanel(); };
      const rl = b.querySelector("#" + P + "rl");
      if (!(state.challenge.records || []).length) rl.innerHTML = `<div class="${P}nt">No challenges completed yet.</div>`;
      else state.challenge.records.forEach((r) => { const d = document.createElement("div"); d.className = P + "row"; d.innerHTML = `<div style="overflow:hidden"><div style="font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(r.title)}</div><div class="${P}nt">${r.steps} steps • ${esc(r.date)}</div></div><div style="display:flex;gap:5px;align-items:center"><span class="${P}bdg">${esc(r.timeStr)}</span><button type="button" class="${P}btn red" style="padding:2px 7px;font-size:10px">X</button></div>`; d.querySelector("button").onclick = () => { state.challenge.records = state.challenge.records.filter((x) => x.id !== r.id); saveState(renderPanel); }; rl.appendChild(d); });
      return;
    }

    if (activeTab === "recipes") {
      b.innerHTML = `
        <div class="${P}lbl">Pin a Recipe</div>
        <div class="${P}card">
          <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:5px;align-items:center"><input class="${P}inp" id="${P}ra" placeholder="Element A"><b style="color:#71717a">+</b><input class="${P}inp" id="${P}rb" placeholder="Element B"></div>
          <div style="display:flex;gap:5px;align-items:center"><b style="color:#71717a">=</b><input class="${P}inp" id="${P}rr" placeholder="Result"><button type="button" class="${P}btn pri" id="${P}radd" style="white-space:nowrap">Pin</button></div>
        </div>
        <div class="${P}lbl">Saved Recipes (${(state.recipes || []).length})</div>
        <input class="${P}inp" id="${P}rs" placeholder="Filter recipes..." value="${esc(recipeSearch)}">
        <div id="${P}rlist" style="display:flex;flex-direction:column;gap:5px"></div>`;
      const ia = b.querySelector("#" + P + "ra"), ib = b.querySelector("#" + P + "rb"), ir = b.querySelector("#" + P + "rr"), is = b.querySelector("#" + P + "rs");
      [ia, ib, ir, is].forEach(noLeak);
      b.querySelector("#" + P + "radd").onclick = () => { const a = ia.value.trim(), bb = ib.value.trim(), r = ir.value.trim(); if (!a || !bb || !r) return toast("Fill A, B and Result.", "err"); state.recipes.unshift({ id: "rcp_" + Date.now(), a, b: bb, res: r, pin: false }); saveState(() => { toast("Recipe pinned!"); renderPanel(); }); };
      const drawR = () => {
        const el = b.querySelector("#" + P + "rlist"); el.innerHTML = "";
        const q = norm(recipeSearch), list = [...(state.recipes || [])].sort((x, y) => Number(Boolean(y.pin)) - Number(Boolean(x.pin))).filter((r) => !q || norm(r.a + " " + r.b + " " + r.res).includes(q));
        if (!list.length) return el.innerHTML = `<div class="${P}nt">${q ? "No matches." : "No saved recipes yet."}</div>`;
        list.forEach((r) => { const d = document.createElement("div"); d.className = P + "rcp" + (r.pin ? " pin" : ""); d.innerHTML = `<div style="display:flex;flex-wrap:wrap;align-items:center;gap:4px;font-size:11.5px;font-weight:700"><span class="${P}chip">${esc(r.a)}</span>+<span class="${P}chip">${esc(r.b)}</span>=<span class="${P}chip r">${esc(r.res)}</span></div><div style="display:flex;gap:4px"><button type="button" class="${P}btn" data-a="p" style="padding:2px 6px;font-size:10px">${r.pin ? "★" : "☆"}</button><button type="button" class="${P}btn" data-a="c" style="padding:2px 6px;font-size:10px">Copy</button><button type="button" class="${P}btn red" data-a="d" style="padding:2px 6px;font-size:10px">X</button></div>`; d.querySelector('[data-a="p"]').onclick = () => { r.pin = !r.pin; saveState(drawR); }; d.querySelector('[data-a="c"]').onclick = () => { navigator.clipboard?.writeText(`${r.a} + ${r.b} = ${r.res}`); toast("Copied!"); }; d.querySelector('[data-a="d"]').onclick = () => { state.recipes = state.recipes.filter((x) => x.id !== r.id); saveState(renderPanel); }; el.appendChild(d); });
      };
      is.oninput = () => { recipeSearch = is.value; drawR(); }; drawR();
      return;
    }

    if (activeTab === "achievements") {
      const done = ACHS.filter((a) => state.stats.unlocked[a.id]).length, pct = Math.round((done / ACHS.length) * 100), lv = lvlInfo(state.economy.xp);
      b.innerHTML = `
        <div class="${P}card">
          <div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:13px">Lv.${lv.lv} ${esc(lv.rank)}</b><span class="${P}bdg">${lv.rem} / ${lv.need} XP</span></div>
          <div class="${P}pb xp"><i style="width:${lv.pct}%"></i></div>
          <div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:12px">Medals</b><span class="${P}bdg">${done} / ${ACHS.length} (${pct}%)</span></div>
          <div class="${P}pb"><i style="width:${pct}%"></i></div>
          <div style="display:flex;justify-content:space-between" class="${P}nt"><span>Merges: <b>${state.stats.totalMerges || 0}</b></span><span>First Disc.: <b>${state.stats.firstDiscoveries || 0}</b></span><span>Coins: <b>${state.economy.coins || 0}</b></span></div>
        </div>
        <div class="${P}lbl">First Discovery Trophy Card (.PNG)</div>
        <div class="${P}card"><div style="display:flex;gap:5px"><input class="${P}inp" id="${P}tcn" placeholder="Element name..." value="${esc(state.stats.lastDiscoveryName || "")}"><button type="button" class="${P}btn pri" id="${P}tcd" style="white-space:nowrap">Download .PNG</button></div></div>
        <div id="${P}al" style="display:flex;flex-direction:column;gap:6px"></div>`;
      const ti = b.querySelector("#" + P + "tcn"); noLeak(ti);
      b.querySelector("#" + P + "tcd").onclick = () => { const v = ti.value.trim(); if (v) { state.stats.lastDiscoveryName = v; saveState(); } downloadTrophy(v); };
      const al = b.querySelector("#" + P + "al");
      ACHS.forEach((a) => { const ok = Boolean(state.stats.unlocked[a.id]), d = document.createElement("div"); d.className = P + "ach" + (ok ? " done" : ""); d.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${ok ? "#16a34a" : "#71717a"}" stroke-width="2.2"><circle cx="12" cy="9" r="6"/><path d="M8.5 14.5L7 22l5-2.5L17 22l-1.5-7.5"/></svg><div><div style="font-size:12.5px;font-weight:700">${esc(a.name)} ${ok ? "<span style='color:#16a34a'>✓</span>" : ""}</div><div class="${P}nt">${esc(a.desc)}</div></div>`; al.appendChild(d); });
      return;
    }

    if (activeTab === "lab") {
      const v = state.visual, opts = [...P_STYLES, ...SHOP_ITEMS.filter((i) => i.cat === "particles" && state.economy.owned[i.id]).map((i) => ({ id: i.val, name: i.name + " (Shop)" }))];
      b.innerHTML = `
        <div class="${P}lbl">Crafting Area Color & Clean UI</div>
        <div class="${P}card">
          <div class="${P}swg">${SWATCHES.map((h) => `<button type="button" class="${P}sw${(v.bgColor || "").toLowerCase() === h ? " on" : ""}" data-col="${h}" style="background:${h}"></button>`).join("")}</div>
          <div style="display:flex;align-items:center;gap:6px"><input type="color" id="${P}bc" value="${v.bgColor || "#ffffff"}" style="width:36px;height:28px;border:1px solid #cbd5e1;border-radius:6px"><span style="flex:1;font-size:12px">Color: <b>${esc(v.bgColor || "Default")}</b></span><button type="button" class="${P}btn" id="${P}bcr">Reset</button></div>
          <label class="${P}row" style="border:0;padding:2px 0;background:transparent"><span>Auto-sync dark sidebar & cards</span><input type="checkbox" id="${P}vs"${v.autoSyncDark !== false ? " checked" : ""}></label>
          <label class="${P}row" style="border:0;padding:2px 0;background:transparent"><span>Hide default background lines</span><input type="checkbox" id="${P}vd"${v.hideDots ? " checked" : ""}></label>
          <label class="${P}row" style="border:0;padding:2px 0;background:transparent"><span>Hide "players completed this"</span><input type="checkbox" id="${P}vhp"${v.hidePlayersCompleted !== false ? " checked" : ""}></label>
        </div>
        <div class="${P}lbl">Themes</div>
        <div class="${P}g2">${THEMES.map((t) => `<button type="button" class="${P}tb${v.theme === t.id ? " on" : ""}" data-th="${t.id}"><span class="${P}pal"><i style="background:${t.p[0]}"></i><i style="background:${t.p[1]}"></i><i style="background:${t.p[2]}"></i></span><span>${t.name}</span></button>`).join("")}</div>
        <div class="${P}lbl">Custom Image / GIF</div>
        <div class="${P}card">
          <div class="${P}acts"><button type="button" class="${P}btn pri" id="${P}bu">Upload Image/GIF</button><button type="button" class="${P}btn red" id="${P}bclr">Remove</button></div>
          <div class="${P}row" style="border:0;padding:2px 0;background:transparent"><span>Darken (<b id="${P}bdv">${v.bgDim}%</b>)</span><input type="range" id="${P}bdr" min="0" max="80" value="${v.bgDim}"></div>
          <input type="file" id="${P}bf" accept="image/*" style="display:none">
        </div>
        <div class="${P}lbl">Particles, Confetti & Sounds</div>
        <div class="${P}card">
          <label class="${P}row" style="border:0;padding:2px 0;background:transparent"><span>Merge particles</span><input type="checkbox" id="${P}vp"${v.particles ? " checked" : ""}></label>
          <div class="${P}row" style="border:0;padding:2px 0;background:transparent"><span>Style</span><select class="${P}sel" id="${P}vps" style="width:160px;padding:4px">${opts.map((o) => `<option value="${o.id}">${o.name}</option>`).join("")}</select></div>
          <label class="${P}row" style="border:0;padding:2px 0;background:transparent"><span>Rainbow colors</span><input type="checkbox" id="${P}vpr"${v.particleRainbow !== false ? " checked" : ""}></label>
          <div class="${P}row" style="border:0;padding:2px 0;background:transparent"><span>Custom color</span><input type="color" id="${P}vpc" value="${v.particleColor || "#3b82f6"}" style="width:34px;height:24px;border:1px solid #cbd5e1;border-radius:5px"></div>
          <label class="${P}row" style="border:0;padding:2px 0;background:transparent"><span>Confetti bursts</span><input type="checkbox" id="${P}vc"${v.confetti ? " checked" : ""}></label>
          <label class="${P}row" style="border:0;padding:2px 0;background:transparent"><span>Sound effects</span><input type="checkbox" id="${P}vx"${v.sfx ? " checked" : ""}></label>
          <div class="${P}row" style="border:0;padding:2px 0;background:transparent"><span>SFX Vol (<b id="${P}vv">${Math.round((v.sfxVolume ?? 0.55) * 100)}%</b>)</span><input type="range" id="${P}vr" min="10" max="100" value="${Math.round((v.sfxVolume ?? 0.55) * 100)}"></div>
          <div class="${P}acts"><button type="button" class="${P}btn" id="${P}tp">Test Particles</button><button type="button" class="${P}btn" id="${P}tc">Test Confetti</button></div>
        </div>
        <div class="${P}lbl">Backup & Position</div>
        <div class="${P}card"><div class="${P}acts"><button type="button" class="${P}btn pri" id="${P}be">Export .JSON</button><button type="button" class="${P}btn" id="${P}bi">Import .JSON</button><button type="button" class="${P}btn" id="${P}fr">Reset Button</button></div><input type="file" id="${P}bkf" accept=".json,application/json" style="display:none"></div>`;
      const ps = b.querySelector("#" + P + "vps"); ps.value = opts.some((o) => o.id === v.particleStyle) ? v.particleStyle : "sparks";
      ps.onchange = () => { state.visual.particleStyle = ps.value; saveState(); spawnSparks(window.innerWidth * 0.5, window.innerHeight * 0.45); };
      b.querySelectorAll("[data-col]").forEach((x) => x.onclick = () => { state.visual.bgColor = x.getAttribute("data-col"); state.visual.bgImage = ""; unlockAch("lab_style"); applyTheme(); saveState(renderPanel); });
      b.querySelector("#" + P + "bc").oninput = (e) => { state.visual.bgColor = e.target.value; state.visual.bgImage = ""; unlockAch("lab_style"); applyTheme(); saveState(); };
      b.querySelector("#" + P + "bcr").onclick = () => { state.visual.bgColor = ""; applyTheme(); saveState(renderPanel); };
      b.querySelector("#" + P + "vs").onchange = (e) => { state.visual.autoSyncDark = e.target.checked; applyTheme(); saveState(); };
      b.querySelector("#" + P + "vd").onchange = (e) => { state.visual.hideDots = e.target.checked; applyTheme(); saveState(); };
      b.querySelector("#" + P + "vhp").onchange = (e) => { state.visual.hidePlayersCompleted = e.target.checked; if (e.target.checked) hidePlayersStat(document.body); else showPlayersStat(); saveState(); };
      b.querySelectorAll("[data-th]").forEach((x) => x.onclick = () => { state.visual.theme = x.getAttribute("data-th"); state.visual.bgColor = ""; if (state.visual.theme !== "original") unlockAch("lab_style"); applyTheme(); saveState(renderPanel); });
      const bf = b.querySelector("#" + P + "bf"); b.querySelector("#" + P + "bu").onclick = () => bf.click();
      b.querySelector("#" + P + "bclr").onclick = () => { state.visual.bgImage = ""; applyTheme(); saveState(() => toast("Image removed")); };
      b.querySelector("#" + P + "bdr").oninput = (e) => { state.visual.bgDim = Number(e.target.value); b.querySelector("#" + P + "bdv").textContent = e.target.value + "%"; applyTheme(); saveState(); };
      bf.onchange = () => { const f = bf.files?.[0]; if (!f) return; if (f.size > 3.5e6) return toast("Max 3.5 MB", "err"); const rd = new FileReader(); rd.onload = () => { state.visual.bgImage = String(rd.result || ""); unlockAch("lab_style"); applyTheme(); saveState(() => toast("Background applied!")); }; rd.readAsDataURL(f); };
      b.querySelector("#" + P + "vp").onchange = (e) => { state.visual.particles = e.target.checked; saveState(); };
      b.querySelector("#" + P + "vpr").onchange = (e) => { state.visual.particleRainbow = e.target.checked; saveState(); };
      b.querySelector("#" + P + "vpc").oninput = (e) => { state.visual.particleColor = e.target.value; state.visual.particleRainbow = false; b.querySelector("#" + P + "vpr").checked = false; saveState(); };
      b.querySelector("#" + P + "vc").onchange = (e) => { state.visual.confetti = e.target.checked; saveState(); };
      b.querySelector("#" + P + "vx").onchange = (e) => { state.visual.sfx = e.target.checked; saveState(); };
      b.querySelector("#" + P + "vr").oninput = (e) => { state.visual.sfxVolume = Number(e.target.value) / 100; b.querySelector("#" + P + "vv").textContent = e.target.value + "%"; saveState(); };
      b.querySelector("#" + P + "tp").onclick = () => { spawnSparks(window.innerWidth * 0.5, window.innerHeight * 0.45); playSfx("merge"); };
      b.querySelector("#" + P + "tc").onclick = () => { spawnConfetti(); playSfx("discovery"); };
      const bkf = b.querySelector("#" + P + "bkf"); b.querySelector("#" + P + "be").onclick = exportJson; b.querySelector("#" + P + "bi").onclick = () => bkf.click();
      bkf.onchange = () => { if (bkf.files?.[0]) importJson(bkf.files[0]); bkf.value = ""; };
      b.querySelector("#" + P + "fr").onclick = () => { state.fab.v1Pos = null; applyFabPos(); saveState(() => toast("Button reset")); };
      return;
    }

    const np = curTrack >= 0 && tracks[curTrack] ? tracks[curTrack].name : "No track loaded";
    b.innerHTML = `
      <div class="${P}lbl">Background MP3 Radio (Alt+M)</div>
      <div class="${P}card">
        <div style="font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(np)}</div>
        <div class="${P}acts"><button type="button" class="${P}btn" id="${P}ap">&lt;&lt;</button><button type="button" class="${P}btn pri" id="${P}ag">${audioEl.paused ? "Play" : "Pause"}</button><button type="button" class="${P}btn" id="${P}an">&gt;&gt;</button></div>
        <div class="${P}row"><span>Volume (<b id="${P}avv">${Math.round((state.audio.volume ?? 0.65) * 100)}%</b>)</span><input type="range" id="${P}av" min="0" max="100" value="${Math.round((state.audio.volume ?? 0.65) * 100)}"></div>
        <div class="${P}row"><span>Speed (<b id="${P}asv">${Number(state.audio.speed ?? 1).toFixed(2)}x</b>)</span><input type="range" id="${P}as" min="50" max="200" step="5" value="${Math.round((state.audio.speed ?? 1) * 100)}"></div>
        <button type="button" class="${P}btn grn" id="${P}au">+ Upload MP3 Files</button><input type="file" id="${P}af" accept="audio/*" multiple style="display:none">
      </div>
      <div id="${P}alst" style="display:flex;flex-direction:column;gap:5px"></div>`;
    b.querySelector("#" + P + "ag").onclick = toggleRadio; b.querySelector("#" + P + "ap").onclick = () => playTrack(curTrack - 1); b.querySelector("#" + P + "an").onclick = () => playTrack(curTrack + 1);
    b.querySelector("#" + P + "av").oninput = (e) => { state.audio.volume = Number(e.target.value) / 100; b.querySelector("#" + P + "avv").textContent = e.target.value + "%"; applyAudio(); saveState(); };
    b.querySelector("#" + P + "as").oninput = (e) => { state.audio.speed = Number(e.target.value) / 100; b.querySelector("#" + P + "asv").textContent = state.audio.speed.toFixed(2) + "x"; applyAudio(); saveState(); };
    const af = b.querySelector("#" + P + "af"); b.querySelector("#" + P + "au").onclick = () => af.click();
    af.onchange = async () => { const fs = Array.from(af.files || []); if (!fs.length) return; for (const f of fs) tracks.push(await addTrack(f)); if (curTrack === -1 && tracks.length) playTrack(0); else renderPanel(); toast(fs.length + " track(s) saved!"); };
    const al = b.querySelector("#" + P + "alst");
    tracks.forEach((tr, i) => { const d = document.createElement("div"); d.className = P + "row"; d.innerHTML = `<span style="cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:${i === curTrack ? 700 : 500};color:${i === curTrack ? "#16a34a" : "inherit"}">${i === curTrack ? "> " : ""}${esc(tr.name)}</span><button type="button" class="${P}btn red" style="padding:2px 7px;font-size:10px">X</button>`; d.querySelector("span").onclick = () => playTrack(i); d.querySelector("button").onclick = async () => { await delTrack(tr.id); URL.revokeObjectURL(tr.url); tracks.splice(i, 1); if (i === curTrack) { audioEl.pause(); curTrack = tracks.length ? 0 : -1; } else if (i < curTrack) curTrack--; renderPanel(); }; al.appendChild(d); });
  }

  function mountUI() {
    if (!document.body || document.getElementById(P + "fab")) return;
    ensureStyles();
    const fl = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6"/><path d="M10 3v6l-5.2 9A2 2 0 0 0 6.5 21h11a2 2 0 0 0 1.7-3L14 9V3"/><path d="M7.5 15h9"/></svg>`;
    const cn = `<svg width="14" height="14" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#facc15" stroke="#a16207" stroke-width="2"/><text x="12" y="16" text-anchor="middle" font-family="Arial" font-weight="800" font-size="12" fill="#854d0e">C</text></svg>`;

    const robotSvg = `
      <svg viewBox="0 0 180 144" xmlns="http://www.w3.org/2000/svg">
        <g id="${P}cam-stand">
          <polygon points="75,90 105,90 101,99 79,99" fill="#a1a1aa" stroke="#6b7280" stroke-width="3" stroke-linejoin="round"/>
          <polygon points="79,99 101,99 104,122 76,122" fill="#e5e7eb" stroke="#9ca3af" stroke-width="3" stroke-linejoin="round"/>
          <path d="M22,126 Q90,118 158,126 Q165,134 156,140 L24,140 Q18,133 22,126 Z" fill="#ffffff" stroke="#9ca3af" stroke-width="3.5" stroke-linejoin="round"/>
          <path d="M36,134 L36,142 L60,142 L60,134" fill="#ffffff" stroke="#9ca3af" stroke-width="3.2" stroke-linejoin="round"/>
          <path d="M120,134 L120,142 L144,142 L144,134" fill="#ffffff" stroke="#9ca3af" stroke-width="3.2" stroke-linejoin="round"/>
        </g>
        <g id="${P}cam-back">
          <polygon points="31,10 139,10 145,17 145,90 31,90" fill="#f87171" stroke="#b91c1c" stroke-width="3.5" stroke-linejoin="round"/>
          <rect x="40" y="19" width="95" height="62" fill="#b91c1c"/>
        </g>
        <g id="${P}cam-front">
          <rect x="36" y="16" width="108" height="74" fill="#ffffff" stroke="#9ca3af" stroke-width="3.5"/>
          <rect x="44" y="64" width="9" height="19" fill="#e5e7eb" stroke="#9ca3af" stroke-width="2.5"/>
          <circle id="${P}cam-led" cx="48.5" cy="25" r="3" fill="#ef4444"/>
          <rect x="64" y="32" width="56" height="40" fill="#e5e7eb" stroke="#9ca3af" stroke-width="3"/>
          <g id="${P}cam-eye">
            <circle id="${P}cam-lens" cx="92" cy="52" r="12.5" fill="#b88c88" stroke="#9ca3af" stroke-width="3"/>
            <path id="${P}cam-glint" d="M95,45 A6.5,6.5 0 0,1 99,52" fill="none" stroke="#ffe4e6" stroke-width="3.2" stroke-linecap="round"/>
          </g>
        </g>
      </svg>`;

    const fab = document.createElement("button"); fab.id = P + "fab"; fab.type = "button"; fab.title = "Drag to move | Click to open (Alt+R)"; fab.innerHTML = `${fl}<span>Infinite Remake</span>`; document.body.appendChild(fab);
    const hud = document.createElement("div"); hud.id = P + "hud"; hud.innerHTML = `<span class="m" id="${P}hm">No active challenge</span><span class="sep"></span><span class="tm" id="${P}ht">00:00.0</span><span id="${P}hs">0 steps</span><span class="cmb" id="${P}hc">x2 COMBO</span><button type="button" class="hb" id="${P}hg">Start</button><button type="button" class="hb" id="${P}hh">Hide</button>`; document.body.appendChild(hud);
    dragEl(hud, hud, (pos) => { state.hud.pos = pos; saveState(); });
    hud.querySelector("#" + P + "hg").onclick = toggleTimer; hud.querySelector("#" + P + "hh").onclick = toggleClean;

    const panel = document.createElement("div"); panel.id = P + "panel";
    panel.innerHTML = `<div class="${P}hdr"><h3>${fl}<span>Infinite Remake v1.0.1</span></h3><div style="display:flex;align-items:center;gap:5px"><button type="button" class="${P}shbtn" id="${P}osh" title="Shop (Alt+S)">${cn}<span>Shop</span><b id="${P}hdr-coins">0</b></button><button type="button" class="${P}btn" id="${P}cln" style="padding:3px 7px;font-size:11px">Clean</button><button type="button" class="${P}x">X</button></div></div><div class="${P}tabs"><button type="button" class="${P}tab on" data-t="challenges">Challenges</button><button type="button" class="${P}tab" data-t="recipes">Recipes</button><button type="button" class="${P}tab" data-t="achievements">Medals</button><button type="button" class="${P}tab" data-t="lab">Lab</button><button type="button" class="${P}tab" data-t="radio">Radio</button></div><div class="${P}body"></div>`;
    document.body.appendChild(panel); dragEl(panel, panel.querySelector("." + P + "hdr"));

    const ov = document.createElement("div"); ov.id = P + "shop-ov";
    ov.innerHTML = `
      <div class="${P}swin">
        <div class="${P}stop">
          <div class="${P}stit">${fl}<span>Shop</span></div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <span class="${P}lpill" id="${P}shop-lvl">Lv.1 Novice</span>
            <span class="${P}cpill">${cn}<b id="${P}shop-coins">0</b></span>
          </div>
          <button type="button" class="${P}sexit" id="${P}sexit">exit</button>
        </div>
        <div class="${P}stage">
          <div class="${P}bubble" id="${P}shop-msg"></div>
          <div id="${P}robot">${robotSvg}</div>
          <button type="button" class="${P}dbtn" id="${P}daily-btn"></button>
        </div>
        <div class="${P}scats">${["all", "themes", "cursors", "particles", "frames"].map((c) => `<button type="button" class="${P}scat${c === "all" ? " on" : ""}" data-sc="${c}">${c}</button>`).join("")}</div>
        <div class="${P}wshelf"><div class="${P}sgrid" id="${P}shop-grid"></div></div>
      </div>`;
    document.body.appendChild(ov);

    ov.onclick = (e) => { if (e.target === ov) closeShop(); };
    ov.querySelector("#" + P + "sexit").onclick = closeShop;
    ov.querySelector("#" + P + "daily-btn").onclick = claimDaily;
    ov.querySelectorAll("[data-sc]").forEach((b) => b.onclick = () => { shopCat = b.getAttribute("data-sc"); renderShop(); });

    ov.addEventListener("pointermove", (e) => {
      if (!ov.classList.contains("open")) return;
      const rob = document.getElementById(P + "robot"), eye = document.getElementById(P + "cam-eye");
      if (!rob || !eye) return;
      const r = rob.getBoundingClientRect(), cx = r.left + r.width * 0.51, cy = r.top + r.height * 0.36;
      const dx = e.clientX - cx, dy = e.clientY - cy, ang = Math.atan2(dy, dx), dist = Math.min(1, Math.hypot(dx, dy) / 220);
      eye.setAttribute("transform", `translate(${(Math.cos(ang) * dist * 8.5).toFixed(1)},${(Math.sin(ang) * dist * 5.2).toFixed(1)})`);
    });

    let dn = false, mv = false, sup = false, sx = 0, sy = 0, ol = 0, ot = 0;
    fab.addEventListener("pointerdown", (e) => { if (e.button !== 0 && e.pointerType === "mouse") return; dn = true; mv = false; const r = fab.getBoundingClientRect(); sx = e.clientX; sy = e.clientY; ol = r.left; ot = r.top; try { fab.setPointerCapture(e.pointerId); } catch {} });
    fab.addEventListener("pointermove", (e) => { if (!dn) return; const dx = e.clientX - sx, dy = e.clientY - sy; if (!mv && Math.hypot(dx, dy) > 5) { mv = true; fab.classList.add("drag"); } if (!mv) return; fab.style.transform = "none"; fab.style.bottom = "auto"; fab.style.left = Math.max(8, Math.min(window.innerWidth - fab.offsetWidth - 8, ol + dx)) + "px"; fab.style.top = Math.max(8, Math.min(window.innerHeight - fab.offsetHeight - 8, ot + dy)) + "px"; });
    const endF = () => { if (!dn) return; dn = false; fab.classList.remove("drag"); if (mv) { sup = true; setTimeout(() => { sup = false; }, 120); state.fab.v1Pos = { x: Math.round(parseFloat(fab.style.left) || 12), y: Math.round(parseFloat(fab.style.top) || (window.innerHeight - 98)) }; saveState(); } };
    fab.addEventListener("pointerup", endF); fab.addEventListener("pointercancel", endF);
    fab.onclick = () => { if (sup) return; panel.classList.toggle("open"); if (panel.classList.contains("open")) renderPanel(); };

    panel.querySelector("#" + P + "osh").onclick = openShop;
    panel.querySelector("#" + P + "cln").onclick = toggleClean;
    panel.querySelector("." + P + "x").onclick = () => panel.classList.remove("open");
    panel.querySelectorAll("." + P + "tab").forEach((t) => t.onclick = () => { activeTab = t.getAttribute("data-t"); renderPanel(); });

    window.addEventListener("keydown", (e) => {
      const tag = e.target?.tagName || ""; if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.code === "Escape" && ov.classList.contains("open")) closeShop();
      else if (e.code === "F8") { e.preventDefault(); toggleTimer(); }
      else if (e.code === "F9") { e.preventDefault(); resetRun(); }
      else if (e.altKey && e.code === "KeyR") { e.preventDefault(); panel.classList.toggle("open"); if (panel.classList.contains("open")) renderPanel(); }
      else if (e.altKey && e.code === "KeyS") { e.preventDefault(); ov.classList.contains("open") ? closeShop() : openShop(); }
      else if (e.altKey && e.code === "KeyH") { e.preventDefault(); toggleClean(); }
      else if (e.altKey && e.code === "KeyM") { e.preventDefault(); toggleRadio(); }
    }, true);

    const loop = () => { if (timerRunning) { const t = fmt(nowMs()), a = document.getElementById(P + "ht"), b = document.getElementById(P + "pt"); if (a) a.textContent = t; if (b) b.textContent = t; } requestAnimationFrame(loop); };
    requestAnimationFrame(loop);

    applyFabPos(); window.addEventListener("resize", applyFabPos);
    applyTheme(); setTimeout(applyTheme, 900); setTimeout(applyTheme, 2200);
    hidePlayersStat(document.body); setTimeout(() => hidePlayersStat(document.body), 1200);
    syncUiDarkMode(); setTimeout(syncUiDarkMode, 800);
    updateHud(); updCoins(); startWatchers();
  }

  loadState(async () => { tracks = await loadTracks(); mountUI(); });
})();