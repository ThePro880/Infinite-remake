(() => {
  if (window.__INFINITE_REMAKE_LOADED__) return;
  window.__INFINITE_REMAKE_LOADED__ = true;

  const PREFIX = "ir-";
  const STORAGE_KEY = "infiniteRemakeStateV1";
  const DB_NAME = "InfiniteRemakeAudioDB";
  const DB_VERSION = 2;
  const DB_STORE = "tracks";

  const THEMES = [
    { id: "original", name: "Original", preview: ["#ffffff", "#f1f5f9", "#111111"] },
    { id: "grid_paper", name: "Grid Paper", preview: ["#fdfefe", "#dbeafe", "#2563eb"] },
    { id: "parchment", name: "Parchment", preview: ["#f5ecd7", "#e6d5b2", "#78350f"] },
    { id: "chalkboard", name: "Dark Chalkboard", preview: ["#181c20", "#252b31", "#f8fafc"] },
    { id: "blueprint", name: "Blueprint", preview: ["#0b2545", "#134074", "#93c5fd"] },
    { id: "neon_lab", name: "Neon Lab", preview: ["#0d0a1a", "#1c1438", "#22d3ee"] }
  ];

  const WORKSPACE_SWATCHES = [
    "#ffffff", "#e0f2fe", "#dcfce7", "#fef3c7",
    "#fce7f3", "#ede9fe", "#1e293b", "#09090b"
  ];

  const PARTICLE_STYLES = [
    { id: "sparks", name: "Sparks" },
    { id: "stars", name: "Stars" },
    { id: "pixels", name: "Retro Pixels" },
    { id: "bubbles", name: "Bubbles" }
  ];

  const DEFAULT_CHALLENGES = [
    // Easy
    { id: "c_pizza", diff: "easy", text: "Craft: Pizza", type: "word", keywords: ["pizza"] },
    { id: "c_volcano", diff: "easy", text: "Craft: Volcano", type: "word", keywords: ["volcano"] },
    { id: "c_rainbow", diff: "easy", text: "Craft: Rainbow", type: "word", keywords: ["rainbow"] },
    { id: "c_castle", diff: "easy", text: "Craft: Castle", type: "word", keywords: ["castle"] },
    { id: "c_dino", diff: "easy", text: "Craft: Dinosaur", type: "word", keywords: ["dinosaur"] },
    { id: "c_robot", diff: "easy", text: "Craft: Robot", type: "word", keywords: ["robot"] },
    // Medium
    { id: "c_mc", diff: "medium", text: "Craft: Minecraft", type: "word", keywords: ["minecraft"] },
    { id: "c_dragon", diff: "medium", text: "Craft: Dragon", type: "word", keywords: ["dragon"] },
    { id: "c_pirate", diff: "medium", text: "Craft: Pirate", type: "word", keywords: ["pirate"] },
    { id: "c_zombie", diff: "medium", text: "Craft: Zombie", type: "word", keywords: ["zombie"] },
    { id: "c_3words", diff: "medium", text: "Craft an element with 3+ words", type: "words3", keywords: [] },
    { id: "c_5new", diff: "medium", text: "Discover 5 new elements in one run", type: "new5", keywords: [] },
    // Hard
    { id: "c_fd2", diff: "hard", text: "Get 1 First Discovery in under 2 min", type: "first_discovery_2m", keywords: [] },
    { id: "c_timemachine", diff: "hard", text: "Craft: Time Machine", type: "word", keywords: ["time machine"] },
    { id: "c_blackhole", diff: "hard", text: "Craft: Black Hole", type: "word", keywords: ["black hole"] },
    { id: "c_quantum", diff: "hard", text: "Craft: Quantum Computer", type: "word", keywords: ["quantum computer"] },
    { id: "c_4words", diff: "hard", text: "Craft an element with 4+ words", type: "words4", keywords: [] }
  ];

  const ACHIEVEMENTS = [
    { id: "first_merge", name: "First Step", desc: "Perform your first merge with Infinite Remake." },
    { id: "merges_25", name: "Active Alchemist", desc: "Reach 25 recorded merges." },
    { id: "streak_5", name: "Creative Streak", desc: "Discover 5 new elements in a single session." },
    { id: "first_fd", name: "Unique Hunter", desc: "Get your first First Discovery with the extension." },
    { id: "fd_3", name: "Uncharted Legend", desc: "Collect 3 First Discoveries." },
    { id: "speed_2m", name: "Speedrunner", desc: "Complete a wheel challenge in under 2 minutes." },
    { id: "retos_3", name: "Challenge Master", desc: "Complete 3 wheel challenges." },
    { id: "long_word", name: "Word Architect", desc: "Craft an element with 3 or more words." },
    { id: "lab_style", name: "Lab Stylist", desc: "Customize the workspace with a theme or background." },
    { id: "dj_craft", name: "Alchemist DJ", desc: "Play MP3 music while crafting." }
  ];

  const DEFAULT_STATE = {
    fab: {
      v1Pos: null
    },
    hud: {
      show: true,
      cleanView: false,
      pos: { x: 16, y: 62 }
    },
    visual: {
      theme: "original",
      bgColor: "",
      bgImage: "",
      bgDim: 25,
      autoSyncDark: true,
      hideDots: false,
      particles: true,
      particleStyle: "sparks",
      particleRainbow: true,
      particleColor: "#3b82f6",
      confetti: true,
      sfx: true,
      sfxVolume: 0.55
    },
    challenge: {
      activeId: null,
      difficulty: "all",
      streak: 0,
      bestStreak: 0,
      lastCompleted: "",
      customList: [],
      records: [],
      completedCount: 0
    },
    stats: {
      totalMerges: 0,
      firstDiscoveries: 0,
      bestSessionNew: 0,
      lastDiscoveryName: "",
      unlocked: {}
    },
    audio: {
      volume: 0.65,
      speed: 1.0,
      loop: true
    }
  };

  let state = JSON.parse(JSON.stringify(DEFAULT_STATE));
  let activeTab = "challenges";

  // Live session & speedrun variables
  let timerRunning = false;
  let timerStart = 0;
  let timerElapsed = 0;
  let runSteps = 0;
  let runNewCount = 0;
  let sessionNewCount = 0;
  let spinning = false;
  let completingChallenge = false;
  let lastPointer = { x: window.innerWidth * 0.4, y: window.innerHeight * 0.5, time: 0 };
  let lastDblClickAt = 0;
  let lastSidebarDownAt = 0;
  let recentRemovedInstanceAt = 0;
  let lastStepAt = 0;
  let lastFdAt = 0;
  let knownElementTexts = new Set();
  let lsInitialized = false;
  const instanceTextMap = new WeakMap();

  // Audio state
  const audioEl = new Audio();
  let tracks = [];
  let currentTrackIdx = -1;
  let audioCtx = null;

  // Particles state
  let fxCanvas = null;
  let fxCtx = null;
  let particles = [];
  let fxAnimating = false;

  function deepMerge(target, src) {
    if (!src || typeof src !== "object") return target;
    const out = Array.isArray(target) ? target.slice() : { ...target };
    for (const k of Object.keys(src)) {
      if (src[k] && typeof src[k] === "object" && !Array.isArray(src[k]) && out[k] && typeof out[k] === "object") {
        out[k] = deepMerge(out[k], src[k]);
      } else {
        out[k] = src[k];
      }
    }
    return out;
  }

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function normText(s) {
    return String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isDarkHex(hex) {
    if (!hex || typeof hex !== "string") return false;
    const m = hex.trim().match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!m) return false;
    const r = parseInt(m[1], 16);
    const g = parseInt(m[2], 16);
    const b = parseInt(m[3], 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) < 130;
  }

  function extractInstanceText(el) {
    if (!el) return "";
    return (el.textContent || "").replace(/first\s+discovery/ig, "").trim();
  }

  function isInstanceNode(node) {
    return node instanceof HTMLElement && (
      node.classList.contains("instance") || node.classList.contains("item-instance")
    );
  }

  function formatTime(ms) {
    const total = Math.max(0, Math.floor(ms));
    const mins = Math.floor(total / 60000);
    const secs = Math.floor((total % 60000) / 1000);
    const d = Math.floor((total % 1000) / 100);
    return String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0") + "." + d;
  }

  function getCurrentTimerMs() {
    return timerRunning ? timerElapsed + (performance.now() - timerStart) : timerElapsed;
  }

  function getAllChallenges() {
    return [...(state.challenge.customList || []), ...DEFAULT_CHALLENGES];
  }

  function getFilteredChallenges() {
    const diff = state.challenge.difficulty || "all";
    const all = getAllChallenges();
    if (diff === "all") return all;
    const filtered = all.filter((c) => (c.diff || "medium") === diff);
    return filtered.length ? filtered : all;
  }

  function getActiveChallenge() {
    if (!state.challenge.activeId) return null;
    return getAllChallenges().find((c) => c.id === state.challenge.activeId) || null;
  }

  function loadState(cb) {
    try {
      chrome.storage.local.get([STORAGE_KEY], (res) => {
        if (res && res[STORAGE_KEY]) {
          state = deepMerge(DEFAULT_STATE, res[STORAGE_KEY]);
        }
        if (cb) cb();
      });
    } catch (e) {
      if (cb) cb();
    }
  }

  function saveState(cb) {
    try {
      chrome.storage.local.set({ [STORAGE_KEY]: state }, () => { if (cb) cb(); });
    } catch (e) {
      if (cb) cb();
    }
  }

  // Export & Import JSON Backup
  function exportBackupJson() {
    try {
      const payload = {
        app: "Infinite Remake",
        version: "1.0.0",
        exportedAt: new Date().toISOString(),
        state
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "infinite-remake-backup-" + new Date().toISOString().slice(0, 10) + ".json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      showToast("Backup .json exported!");
    } catch (e) {
      showToast("Could not export backup.", "err");
    }
  }

  function importBackupJson(file) {
    if (!file) return;
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const parsed = JSON.parse(String(rd.result || "{}"));
        const incoming = parsed && parsed.state && typeof parsed.state === "object" ? parsed.state : parsed;
        if (!incoming || typeof incoming !== "object" || (!incoming.stats && !incoming.visual && !incoming.challenge)) {
          showToast("Invalid Infinite Remake backup file.", "err");
          return;
        }
        state = deepMerge(DEFAULT_STATE, incoming);
        saveState(() => {
          applyVisualTheme();
          applyFabPosition();
          updateHudDisplay();
          applyAudioSettings();
          renderPanel();
          showToast("Backup restored successfully!", "gold");
        });
      } catch (e) {
        showToast("Invalid JSON file.", "err");
      }
    };
    rd.readAsText(file);
  }

  // Downloadable First Discovery / Speedrun Trophy Card (.PNG)
  function downloadTrophyCard(customName) {
    const title = String(customName || state.stats.lastDiscoveryName || "First Discovery").trim() || "First Discovery";
    const W = 900, H = 500;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d");

    const drawRoundRect = (x, y, w, h, r) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0f172a");
    bg.addColorStop(1, "#1e293b");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(148, 163, 184, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 32) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 32) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    drawRoundRect(36, 36, W - 72, H - 72, 22);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#facc15";
    ctx.stroke();

    ctx.save();
    ctx.translate(W / 2, 118);
    ctx.fillStyle = "#fef9c3";
    ctx.beginPath(); ctx.arc(0, 0, 42, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#eab308"; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = "#eab308";
    ctx.beginPath();
    ctx.moveTo(-18, -18); ctx.lineTo(18, -18); ctx.lineTo(13, 6); ctx.lineTo(-13, 6);
    ctx.closePath(); ctx.fill();
    ctx.fillRect(-4, 6, 8, 10);
    ctx.fillRect(-13, 15, 26, 6);
    ctx.strokeStyle = "#eab308"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(-18, -8, 8, Math.PI * 0.5, Math.PI * 1.5); ctx.stroke();
    ctx.beginPath(); ctx.arc(18, -8, 8, -Math.PI * 0.5, Math.PI * 0.5); ctx.stroke();
    ctx.restore();

    drawRoundRect(W / 2 - 125, 174, 250, 32, 999);
    ctx.fillStyle = "#111111";
    ctx.fill();
    ctx.fillStyle = "#fde047";
    ctx.font = "700 14px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("FIRST DISCOVERY TROPHY", W / 2, 190);

    let fontSize = 44;
    ctx.font = `800 ${fontSize}px 'Segoe UI', Arial, sans-serif`;
    while (ctx.measureText(title).width > 700 && fontSize > 22) {
      fontSize -= 2;
      ctx.font = `800 ${fontSize}px 'Segoe UI', Arial, sans-serif`;
    }
    const pillW = Math.min(760, Math.max(280, ctx.measureText(title).width + 64));
    drawRoundRect(W / 2 - pillW / 2, 224, pillW, 76, 14);
    ctx.fillStyle = "#f8fafc";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#cbd5e1";
    ctx.stroke();

    ctx.fillStyle = "#0f172a";
    ctx.fillText(title, W / 2, 262);

    const stats = [
      { k: "TIME", v: formatTime(getCurrentTimerMs()) },
      { k: "STEPS", v: String(runSteps) },
      { k: "FIRST DISCOVERIES", v: String(state.stats.firstDiscoveries || 0) },
      { k: "STREAK", v: String(state.challenge.streak || 0) }
    ];
    const boxW = 172, gap = 16;
    const totalW = stats.length * boxW + (stats.length - 1) * gap;
    let sx = (W - totalW) / 2;
    stats.forEach((stItem) => {
      drawRoundRect(sx, 326, boxW, 68, 12);
      ctx.fillStyle = "#f1f5f9";
      ctx.fill();
      ctx.fillStyle = "#64748b";
      ctx.font = "700 11px 'Segoe UI', Arial, sans-serif";
      ctx.fillText(stItem.k, sx + boxW / 2, 348);
      ctx.fillStyle = "#0f172a";
      ctx.font = "800 22px Consolas, 'Segoe UI', monospace";
      ctx.fillText(stItem.v, sx + boxW / 2, 374);
      sx += boxW + gap;
    });

    ctx.fillStyle = "#64748b";
    ctx.font = "600 13px 'Segoe UI', Arial, sans-serif";
    ctx.fillText("Infinite Remake v1.0.0  •  " + new Date().toLocaleDateString(), W / 2, 430);

    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    const safeName = normText(title).replace(/\s+/g, "_") || "discovery";
    a.download = "infinite_remake_" + safeName + ".png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast("Trophy Card (.png) downloaded!", "gold");
  }

  // IndexedDB for persistent MP3 tracks
  function openAudioDb() {
    return new Promise((resolve, reject) => {
      try {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(DB_STORE)) {
            db.createObjectStore(DB_STORE, { keyPath: "id" });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      } catch (e) {
        reject(e);
      }
    });
  }

  async function loadTracksFromDb() {
    try {
      const db = await openAudioDb();
      const tx = db.transaction(DB_STORE, "readonly");
      const req = tx.objectStore(DB_STORE).getAll();
      return await new Promise((resolve) => {
        req.onsuccess = () => {
          resolve((req.result || []).map((t) => ({
            id: t.id,
            name: t.name,
            url: URL.createObjectURL(t.blob)
          })));
        };
        req.onerror = () => resolve([]);
      });
    } catch (e) {
      return [];
    }
  }

  async function addTrackToDb(file) {
    const id = "trk_" + Date.now() + "_" + Math.floor(Math.random() * 999);
    const entry = { id, name: file.name.replace(/\.[^/.]+$/, ""), blob: file };
    try {
      const db = await openAudioDb();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(DB_STORE, "readwrite");
        tx.objectStore(DB_STORE).put(entry);
        tx.oncomplete = resolve;
        tx.onerror = reject;
      });
    } catch (e) {}
    return { id: entry.id, name: entry.name, url: URL.createObjectURL(file) };
  }

  async function deleteTrackFromDb(id) {
    try {
      const db = await openAudioDb();
      await new Promise((resolve) => {
        const tx = db.transaction(DB_STORE, "readwrite");
        tx.objectStore(DB_STORE).delete(id);
        tx.oncomplete = resolve;
        tx.onerror = resolve;
      });
    } catch (e) {}
  }

  // Synthesized SFX via Web Audio API
  function playSfx(type) {
    if (!state.visual.sfx) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === "suspended") audioCtx.resume();

      const vol = Math.max(0.05, Math.min(1, Number(state.visual.sfxVolume ?? 0.55))) * 0.25;
      const now = audioCtx.currentTime;

      const tone = (freq, start, dur, wave, gainMult) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = wave || "triangle";
        osc.frequency.setValueAtTime(freq, now + start);
        gain.gain.setValueAtTime(0.001, now + start);
        gain.gain.exponentialRampToValueAtTime(vol * (gainMult || 1), now + start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + start);
        osc.stop(now + start + dur + 0.02);
      };

      if (type === "merge") {
        tone(523.25, 0, 0.09, "sine", 0.7);
        tone(659.25, 0.04, 0.11, "triangle", 0.6);
      } else if (type === "achievement") {
        tone(587.33, 0, 0.12, "triangle", 0.9);
        tone(880.0, 0.1, 0.24, "triangle", 1.0);
      } else if (type === "discovery") {
        tone(523.25, 0, 0.12, "triangle", 0.9);
        tone(659.25, 0.09, 0.12, "triangle", 0.9);
        tone(783.99, 0.18, 0.14, "triangle", 0.95);
        tone(1046.5, 0.28, 0.42, "sine", 1.1);
      }
    } catch (e) {}
  }

  // Particles & Confetti Engine (Sparks, Stars, Retro Pixels, Bubbles)
  function ensureFxCanvas() {
    if (fxCanvas) return;
    fxCanvas = document.createElement("canvas");
    fxCanvas.id = PREFIX + "fx-canvas";
    fxCanvas.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:2147483638;";
    document.body.appendChild(fxCanvas);
    fxCtx = fxCanvas.getContext("2d");
    const resize = () => {
      fxCanvas.width = window.innerWidth;
      fxCanvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
  }

  function drawStar(ctx, r) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a1 = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const a2 = a1 + Math.PI / 5;
      const x1 = Math.cos(a1) * r, y1 = Math.sin(a1) * r;
      const x2 = Math.cos(a2) * (r * 0.45), y2 = Math.sin(a2) * (r * 0.45);
      if (i === 0) ctx.moveTo(x1, y1);
      else ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
    }
    ctx.closePath();
    ctx.fill();
  }

  function startFxLoop() {
    if (fxAnimating) return;
    fxAnimating = true;
    const step = () => {
      if (!fxCtx || !fxCanvas) { fxAnimating = false; return; }
      fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.g;
        p.vx *= p.drag;
        p.rot += p.vrot;
        p.life -= p.decay;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        fxCtx.save();
        fxCtx.globalAlpha = Math.max(0, Math.min(1, p.life));
        fxCtx.translate(p.x, p.y);
        fxCtx.rotate(p.rot);
        fxCtx.fillStyle = p.color;
        if (p.shape === "circle") {
          fxCtx.beginPath();
          fxCtx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          fxCtx.fill();
        } else if (p.shape === "star") {
          drawStar(fxCtx, p.size * 0.65);
        } else if (p.shape === "bubble") {
          fxCtx.strokeStyle = p.color;
          fxCtx.lineWidth = 2;
          fxCtx.beginPath();
          fxCtx.arc(0, 0, p.size * 0.65, 0, Math.PI * 2);
          fxCtx.stroke();
          fxCtx.fillStyle = "rgba(255,255,255,0.65)";
          fxCtx.beginPath();
          fxCtx.arc(-p.size * 0.2, -p.size * 0.2, p.size * 0.16, 0, Math.PI * 2);
          fxCtx.fill();
        } else if (p.shape === "pixel") {
          const s = Math.round(p.size);
          fxCtx.fillRect(-s / 2, -s / 2, s, s);
        } else {
          fxCtx.fillRect(-p.size / 2, -p.h / 2, p.size, p.h);
        }
        fxCtx.restore();
      }
      if (particles.length > 0) {
        requestAnimationFrame(step);
      } else {
        fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
        fxAnimating = false;
      }
    };
    requestAnimationFrame(step);
  }

  function spawnMergeSparks(x, y) {
    if (!state.visual.particles) return;
    ensureFxCanvas();
    const rainbow = ["#3b82f6", "#22c55e", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"];
    const style = state.visual.particleStyle || "sparks";
    const useRainbow = state.visual.particleRainbow !== false;
    const customCol = state.visual.particleColor || "#3b82f6";
    const cx = x || lastPointer.x || window.innerWidth * 0.4;
    const cy = y || lastPointer.y || window.innerHeight * 0.5;

    const shapeMap = { sparks: "circle", stars: "star", pixels: "pixel", bubbles: "bubble" };
    const shape = shapeMap[style] || "circle";
    const count = style === "bubbles" ? 12 : 16;

    for (let i = 0; i < count; i++) {
      const ang = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const spd = style === "bubbles" ? (1.2 + Math.random() * 2.2) : (2 + Math.random() * 3.8);
      particles.push({
        x: cx, y: cy,
        vx: Math.cos(ang) * spd,
        vy: style === "bubbles" ? (Math.sin(ang) * spd - 1.8) : (Math.sin(ang) * spd),
        g: style === "bubbles" ? -0.04 : 0.08,
        drag: 0.95,
        size: style === "stars" || style === "bubbles" ? (7 + Math.random() * 5) : (4 + Math.random() * 4),
        h: 5,
        rot: style === "pixels" ? 0 : Math.random() * Math.PI,
        vrot: style === "pixels" ? 0 : (Math.random() - 0.5) * 0.2,
        life: 1,
        decay: style === "bubbles" ? 0.022 : (0.028 + Math.random() * 0.02),
        color: useRainbow ? rainbow[i % rainbow.length] : customCol,
        shape
      });
    }
    startFxLoop();
  }

  function spawnConfettiBurst(originX, originY) {
    if (!state.visual.confetti) return;
    ensureFxCanvas();
    const colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#a855f7", "#ec4899", "#facc15"];
    const cx = originX ?? window.innerWidth * 0.42;
    const cy = originY ?? window.innerHeight * 0.35;
    for (let i = 0; i < 85; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 3 + Math.random() * 9.5;
      particles.push({
        x: cx + (Math.random() - 0.5) * 60,
        y: cy + (Math.random() - 0.5) * 30,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 4.5,
        g: 0.19, drag: 0.985,
        size: 7 + Math.random() * 6,
        h: 4 + Math.random() * 4,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.28,
        life: 1.2 + Math.random() * 0.4,
        decay: 0.012 + Math.random() * 0.008,
        color: colors[i % colors.length],
        shape: "rect"
      });
    }
    startFxLoop();
  }

  function showToast(msg, kind) {
    let t = document.getElementById(PREFIX + "toast");
    if (!t && document.body) {
      t = document.createElement("div");
      t.id = PREFIX + "toast";
      document.body.appendChild(t);
    }
    if (!t) return;
    t.textContent = msg;
    t.className = "show " + (kind || "ok");
    clearTimeout(t._tm);
    t._tm = setTimeout(() => t.classList.remove("show"), 3000);
  }

  function unlockAchievement(id) {
    if (state.stats.unlocked[id]) return;
    const ach = ACHIEVEMENTS.find((a) => a.id === id);
    if (!ach) return;
    state.stats.unlocked[id] = Date.now();
    saveState();
    playSfx("achievement");
    showToast("Achievement unlocked: " + ach.name, "gold");
    if (activeTab === "achievements") renderPanel();
  }

  function checkAchievements() {
    if (state.stats.totalMerges >= 1) unlockAchievement("first_merge");
    if (state.stats.totalMerges >= 25) unlockAchievement("merges_25");
    if (sessionNewCount >= 5) unlockAchievement("streak_5");
    if (state.stats.firstDiscoveries >= 1) unlockAchievement("first_fd");
    if (state.stats.firstDiscoveries >= 3) unlockAchievement("fd_3");
    if (state.challenge.completedCount >= 3) unlockAchievement("retos_3");
  }

  function completeActiveChallenge(autoReason) {
    const ch = getActiveChallenge();
    if (!ch || completingChallenge) return;
    completingChallenge = true;

    const elapsed = getCurrentTimerMs();
    timerRunning = false;
    timerElapsed = elapsed;

    state.challenge.activeId = null;
    state.challenge.completedCount = (state.challenge.completedCount || 0) + 1;
    state.challenge.streak = (state.challenge.streak || 0) + 1;
    if (state.challenge.streak > (state.challenge.bestStreak || 0)) {
      state.challenge.bestStreak = state.challenge.streak;
    }

    const record = {
      id: "rec_" + Date.now(),
      title: ch.text,
      diff: ch.diff || "custom",
      timeMs: elapsed,
      timeStr: formatTime(elapsed),
      steps: runSteps,
      date: new Date().toLocaleDateString()
    };
    state.challenge.lastCompleted = ch.text + " • " + record.timeStr;
    state.challenge.records.unshift(record);
    if (state.challenge.records.length > 30) state.challenge.records.pop();

    if (elapsed > 0 && elapsed < 120000) unlockAchievement("speed_2m");
    checkAchievements();
    saveState();

    spawnConfettiBurst();
    playSfx("discovery");
    showToast((autoReason ? "Challenge completed! " : "Challenge logged! ") + record.timeStr + " • Streak: " + state.challenge.streak, "gold");
    updateHudDisplay();
    if (activeTab === "challenges") renderPanel();

    setTimeout(() => { completingChallenge = false; }, 600);
  }

  function evaluateCraftedItem(rawText, isNewElement, isFirstDiscovery) {
    const clean = String(rawText || "").trim();
    if (!clean) return;
    const normalized = normText(clean);

    const wordCount = normalized ? normalized.split(" ").length : 0;
    if (wordCount >= 3) unlockAchievement("long_word");

    const ch = getActiveChallenge();
    if (!ch || completingChallenge) return;

    if (ch.type === "word" && Array.isArray(ch.keywords) && ch.keywords.length) {
      const matched = ch.keywords.some((kw) => {
        const nk = normText(kw);
        return nk && normalized === nk;
      });
      if (matched) completeActiveChallenge(true);
    } else if (ch.type === "words3" && wordCount >= 3) {
      completeActiveChallenge(true);
    } else if (ch.type === "words4" && wordCount >= 4) {
      completeActiveChallenge(true);
    } else if (ch.type === "first_discovery_2m" && isFirstDiscovery && getCurrentTimerMs() <= 120000) {
      completeActiveChallenge(true);
    } else if (ch.type === "new5" && isNewElement) {
      runNewCount++;
      if (runNewCount >= 5) completeActiveChallenge(true);
    }
  }

  function handleFirstDiscoveryEvent(itemName) {
    const now = Date.now();
    if (now - lastFdAt < 2000) return;
    lastFdAt = now;
    state.stats.firstDiscoveries = (state.stats.firstDiscoveries || 0) + 1;
    if (itemName) state.stats.lastDiscoveryName = itemName;
    spawnConfettiBurst();
    playSfx("discovery");
    showToast("FIRST DISCOVERY!" + (itemName ? " " + itemName : ""), "gold");
    checkAchievements();
    saveState();
    evaluateCraftedItem(itemName || "First Discovery", true, true);
    if (activeTab === "achievements") renderPanel();
  }

  function registerMergeStep(x, y, craftedText) {
    const now = Date.now();
    if (now - lastStepAt < 350) return;
    lastStepAt = now;

    if (getActiveChallenge() && !timerRunning && timerElapsed === 0) {
      timerStart = performance.now();
      timerRunning = true;
    }

    state.stats.totalMerges = (state.stats.totalMerges || 0) + 1;
    if (timerRunning || getActiveChallenge()) runSteps++;
    spawnMergeSparks(x, y);
    playSfx("merge");
    checkAchievements();
    saveState();
    updateHudDisplay();
    if (craftedText) evaluateCraftedItem(craftedText, false, false);
  }

  function readInfiniteCraftStorage() {
    try {
      const raw = localStorage.getItem("infinite-craft-data");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.elements)) return parsed.elements;
    } catch (e) {}
    return null;
  }

  function startCraftWatchers() {
    const initList = readInfiniteCraftStorage();
    if (initList) {
      initList.forEach((el) => {
        if (el && el.text) knownElementTexts.add(el.text);
      });
      lsInitialized = true;
    }

    document.querySelectorAll(".instance, .item-instance").forEach((el) => {
      instanceTextMap.set(el, extractInstanceText(el));
    });

    window.addEventListener("pointerdown", (e) => {
      if (e.target && e.target.closest && e.target.closest(".sidebar")) {
        lastSidebarDownAt = Date.now();
      }
    }, true);

    window.addEventListener("dblclick", (e) => {
      if (e.target && e.target.closest && e.target.closest(".instance, .item-instance")) {
        lastDblClickAt = Date.now();
      }
    }, true);

    window.addEventListener("pointerup", (e) => {
      if (e.target && e.target.closest && e.target.closest("#" + PREFIX + "panel, #" + PREFIX + "fab, #" + PREFIX + "hud")) return;
      lastPointer = { x: e.clientX, y: e.clientY, time: Date.now() };
    }, true);

    setInterval(() => {
      const list = readInfiniteCraftStorage();
      if (!list) return;
      if (!lsInitialized) {
        list.forEach((el) => { if (el && el.text) knownElementTexts.add(el.text); });
        lsInitialized = true;
        return;
      }

      const newlyAdded = [];
      for (const el of list) {
        if (el && el.text && !knownElementTexts.has(el.text)) {
          knownElementTexts.add(el.text);
          newlyAdded.push(el);
        }
      }

      if (newlyAdded.length) {
        newlyAdded.forEach((el) => {
          sessionNewCount++;
          if (sessionNewCount > (state.stats.bestSessionNew || 0)) {
            state.stats.bestSessionNew = sessionNewCount;
          }
          const isFd = Boolean(el.discovered || el.isNew);
          if (Date.now() - lastStepAt > 900) {
            registerMergeStep(lastPointer.x, lastPointer.y, el.text);
          }
          if (isFd) {
            handleFirstDiscoveryEvent(el.text);
          } else {
            evaluateCraftedItem(el.text, true, false);
          }
        });
      }
    }, 650);

    const observer = new MutationObserver((mutations) => {
      const now = Date.now();
      const recentDrop = now - lastPointer.time < 3200;
      const isDoubleClickDup = now - lastDblClickAt < 500;

      const addedInstances = [];
      let removedInstancesCount = 0;
      const mutatedInstances = new Set();

      for (const m of mutations) {
        if (m.target && m.target.closest && m.target.closest("#" + PREFIX + "panel, #" + PREFIX + "hud, #" + PREFIX + "toast")) continue;

        if (m.type === "childList") {
          for (const node of m.removedNodes) {
            if (isInstanceNode(node)) {
              removedInstancesCount++;
              recentRemovedInstanceAt = now;
            }
          }
          for (const node of m.addedNodes) {
            if (!(node instanceof HTMLElement)) continue;
            if (node.id && node.id.startsWith(PREFIX)) continue;

            const txt = (node.textContent || "").trim();
            if (/first\s+discovery/i.test(txt)) {
              handleFirstDiscoveryEvent("");
            }

            if (isInstanceNode(node)) {
              instanceTextMap.set(node, extractInstanceText(node));
              addedInstances.push(node);
            } else {
              const parentInst = m.target instanceof HTMLElement ? m.target.closest(".instance, .item-instance") : null;
              if (parentInst) mutatedInstances.add(parentInst);
            }
          }
        } else if (m.type === "characterData") {
          const parent = m.target.parentElement;
          const box = parent && parent.closest ? parent.closest(".instance, .item-instance") : null;
          if (box) mutatedInstances.add(box);
        }
      }

      if (isDoubleClickDup) return;

      for (const box of mutatedInstances) {
        const prevTxt = instanceTextMap.get(box);
        const nextTxt = extractInstanceText(box);
        if (prevTxt && nextTxt && normText(prevTxt) !== normText(nextTxt)) {
          instanceTextMap.set(box, nextTxt);
          const rect = box.getBoundingClientRect();
          registerMergeStep(rect.left + rect.width / 2, rect.top + rect.height / 2, nextTxt);
          return;
        }
        if (nextTxt) instanceTextMap.set(box, nextTxt);
      }

      const hadRecentRemoval = removedInstancesCount > 0 || (now - recentRemovedInstanceAt < 180);
      const justDraggedFromSidebar = (now - lastSidebarDownAt < 350) && removedInstancesCount === 0;
      if (recentDrop && hadRecentRemoval && !justDraggedFromSidebar && addedInstances.length > 0) {
        const resultNode = addedInstances[addedInstances.length - 1];
        const rect = resultNode.getBoundingClientRect();
        const cleanTxt = extractInstanceText(resultNode);
        if (cleanTxt) {
          recentRemovedInstanceAt = 0;
          registerMergeStep(rect.left + rect.width / 2, rect.top + rect.height / 2, cleanTxt);
        }
      }
    });

    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    }
  }

  // Controls
  function toggleTimer() {
    if (timerRunning) {
      timerElapsed += performance.now() - timerStart;
      timerRunning = false;
      showToast("Timer paused: " + formatTime(timerElapsed));
    } else {
      timerStart = performance.now();
      timerRunning = true;
      showToast("Speedrun started! (F8 pause / F9 reset)");
    }
    updateHudDisplay();
    if (activeTab === "challenges") renderPanel();
  }

  function resetRun() {
    timerRunning = false;
    timerElapsed = 0;
    runSteps = 0;
    runNewCount = 0;
    updateHudDisplay();
    showToast("Run reset");
    if (activeTab === "challenges") renderPanel();
  }

  function toggleCleanView() {
    state.hud.cleanView = !state.hud.cleanView;
    updateHudDisplay();
    saveState();
    showToast(state.hud.cleanView ? "Clean View ON (Alt+H to restore)" : "Clean View OFF");
    if (activeTab === "challenges") renderPanel();
  }

  function toggleRadioPlayPause() {
    if (!tracks.length) { showToast("Upload at least one MP3 file first.", "err"); return; }
    if (currentTrackIdx === -1) { playTrack(0); return; }
    if (audioEl.paused) {
      applyAudioSettings();
      audioEl.play().then(() => unlockAchievement("dj_craft")).catch(() => {});
      showToast("Radio playing: " + tracks[currentTrackIdx].name);
    } else {
      audioEl.pause();
      showToast("Radio paused");
    }
    if (activeTab === "radio") renderPanel();
  }

  function applyAudioSettings() {
    audioEl.volume = Math.max(0, Math.min(1, Number(state.audio.volume ?? 0.65)));
    audioEl.playbackRate = Math.max(0.5, Math.min(2.0, Number(state.audio.speed ?? 1.0)));
    audioEl.loop = Boolean(state.audio.loop && tracks.length <= 1);
  }

  function playTrack(idx) {
    if (!tracks.length) return;
    currentTrackIdx = ((idx % tracks.length) + tracks.length) % tracks.length;
    audioEl.src = tracks[currentTrackIdx].url;
    applyAudioSettings();
    audioEl.play().then(() => unlockAchievement("dj_craft")).catch(() => {});
    if (activeTab === "radio") renderPanel();
  }

  audioEl.addEventListener("ended", () => {
    if (!tracks.length) return;
    if (state.audio.loop) playTrack(currentTrackIdx + 1);
  });

  // Base CSS matching Infinite Craft clean card aesthetic
  function ensureBaseStyles() {
    if (document.getElementById(PREFIX + "base-style")) return;
    const st = document.createElement("style");
    st.id = PREFIX + "base-style";
    st.textContent = `
      #${PREFIX}fab, #${PREFIX}panel, #${PREFIX}hud, #${PREFIX}toast {
        font-family: 'Roboto', 'Segoe UI', system-ui, -apple-system, sans-serif !important;
      }

      /* Draggable Floating Button (Default: Bottom-Left right above Menu & Trophy) */
      #${PREFIX}fab {
        position: fixed; left: 12px; bottom: 62px;
        z-index: 2147483640;
        display: flex; align-items: center; gap: 7px;
        background: #ffffff; color: #111111;
        border: 1px solid #c8c8c8; border-radius: 8px;
        padding: 7px 13px; cursor: grab;
        font-size: 13.5px; font-weight: 600;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
        user-select: none; touch-action: none;
        transition: background .12s, border-color .12s, box-shadow .12s;
      }
      #${PREFIX}fab:hover {
        background: linear-gradient(0deg, #eff6ff, #ffffff 70%);
        border-color: #94a3b8;
      }
      #${PREFIX}fab.dragging {
        cursor: grabbing;
        border-color: #111111;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
      }

      /* Compact Speedrun HUD */
      #${PREFIX}hud {
        position: fixed; z-index: 2147483635;
        display: flex; align-items: center; gap: 9px;
        background: rgba(255, 255, 255, 0.94); color: #111111;
        border: 1px solid #c8c8c8; border-radius: 8px;
        padding: 6px 11px; font-size: 12.5px; font-weight: 600;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        cursor: move; user-select: none; max-width: min(500px, 78vw);
      }
      #${PREFIX}hud .mission {
        max-width: 210px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        color: #111111; font-weight: 700;
      }
      #${PREFIX}hud .sep { width: 1px; height: 14px; background: #d4d4d8; }
      #${PREFIX}hud .time { font-family: 'Consolas', monospace; font-weight: 700; color: #2563eb; }
      #${PREFIX}hud .steps { color: #52525b; }
      #${PREFIX}hud .hbtn {
        background: #f4f4f5; color: #111111; border: 1px solid #d4d4d8;
        border-radius: 5px; padding: 2px 7px; font-size: 11px; font-weight: 700;
        cursor: pointer;
      }
      #${PREFIX}hud .hbtn:hover { background: #e4e4e7; }

      /* Main Panel */
      #${PREFIX}panel {
        position: fixed; top: 58px; left: 50%; transform: translateX(-50%);
        z-index: 2147483645;
        width: min(430px, 94vw); max-height: 82vh; display: none; flex-direction: column;
        background: #ffffff; color: #111111;
        border: 1px solid #c8c8c8; border-radius: 10px;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
        overflow: hidden;
      }
      #${PREFIX}panel.open { display: flex; }
      #${PREFIX}panel * { box-sizing: border-box; }

      .${PREFIX}hdr {
        display: flex; align-items: center; justify-content: space-between;
        padding: 10px 14px; background: #fafafa;
        border-bottom: 1px solid #e4e4e7; cursor: move; user-select: none;
      }
      .${PREFIX}hdr h3 {
        margin: 0; font-size: 14px; font-weight: 700; color: #111111;
        display: flex; align-items: center; gap: 7px;
      }
      .${PREFIX}hdr-r { display: flex; align-items: center; gap: 5px; }
      .${PREFIX}x {
        background: transparent; color: #52525b; border: 1px solid transparent;
        border-radius: 6px; padding: 3px 8px; font-size: 13px; font-weight: 700; cursor: pointer;
      }
      .${PREFIX}x:hover { background: #fee2e2; color: #dc2626; border-color: #fecaca; }

      .${PREFIX}tabs {
        display: flex; gap: 5px; padding: 8px 10px;
        background: #fafafa; border-bottom: 1px solid #e4e4e7;
      }
      .${PREFIX}tab {
        flex: 1; background: #ffffff; color: #3f3f46;
        border: 1px solid #d4d4d8; border-radius: 6px;
        padding: 6px 4px; font-size: 11.5px; font-weight: 600; cursor: pointer;
        transition: background .12s, border-color .12s, color .12s;
      }
      .${PREFIX}tab:hover { background: #f4f4f5; }
      .${PREFIX}tab.on {
        background: #111111; color: #ffffff; border-color: #111111;
      }

      .${PREFIX}body {
        padding: 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;
      }
      .${PREFIX}body::-webkit-scrollbar { width: 7px; }
      .${PREFIX}body::-webkit-scrollbar-track { background: #fafafa; }
      .${PREFIX}body::-webkit-scrollbar-thumb { background: #d4d4d8; border-radius: 6px; }

      .${PREFIX}lbl {
        font-size: 11px; font-weight: 700; color: #71717a;
        text-transform: uppercase; letter-spacing: 0.4px; margin-top: 2px;
      }

      .${PREFIX}card {
        background: #fafafa; border: 1px solid #e4e4e7;
        border-radius: 8px; padding: 10px;
        display: flex; flex-direction: column; gap: 7px;
      }

      .${PREFIX}row {
        display: flex; align-items: center; justify-content: space-between; gap: 8px;
        background: #ffffff; border: 1px solid #e4e4e7;
        border-radius: 7px; padding: 7px 10px;
        font-size: 12.5px; font-weight: 500; color: #18181b;
      }

      #${PREFIX}panel input[type='checkbox'] {
        appearance: none; -webkit-appearance: none; flex-shrink: 0;
        width: 36px; height: 20px; border-radius: 999px; position: relative;
        background: #d4d4d8; border: 0; cursor: pointer; transition: background .15s;
      }
      #${PREFIX}panel input[type='checkbox']::after {
        content: ""; position: absolute; top: 2.5px; left: 2.5px;
        width: 15px; height: 15px; border-radius: 50%;
        background: #ffffff; box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        transition: transform .15s;
      }
      #${PREFIX}panel input[type='checkbox']:checked { background: #111111; }
      #${PREFIX}panel input[type='checkbox']:checked::after { transform: translateX(16px); }

      #${PREFIX}panel input[type='range'] {
        flex: 1; max-width: 145px; cursor: pointer; accent-color: #111111;
      }

      .${PREFIX}inp, .${PREFIX}sel {
        width: 100%; background: #ffffff; color: #111111;
        border: 1px solid #d4d4d8; border-radius: 7px;
        padding: 7px 9px; font-size: 12.5px; outline: none;
      }
      .${PREFIX}inp:focus, .${PREFIX}sel:focus { border-color: #111111; }

      .${PREFIX}btn {
        background: #ffffff; color: #111111; border: 1px solid #c8c8c8;
        border-radius: 7px; padding: 7px 10px;
        font-size: 12px; font-weight: 600; cursor: pointer;
        transition: background .12s, border-color .12s;
      }
      .${PREFIX}btn:hover { background: #f4f4f5; border-color: #a1a1aa; }
      .${PREFIX}btn:disabled { opacity: .55; cursor: not-allowed; }
      .${PREFIX}btn.primary { background: #111111; color: #ffffff; border-color: #111111; }
      .${PREFIX}btn.primary:hover { background: #27272a; }
      .${PREFIX}btn.green { background: #16a34a; color: #ffffff; border-color: #16a34a; }
      .${PREFIX}btn.green:hover { background: #15803d; }
      .${PREFIX}btn.red { background: #ffffff; color: #dc2626; border-color: #fca5a5; }
      .${PREFIX}btn.red:hover { background: #fef2f2; }

      .${PREFIX}acts { display: flex; gap: 6px; flex-wrap: wrap; }
      .${PREFIX}acts .${PREFIX}btn { flex: 1; min-width: 68px; }

      .${PREFIX}pills { display: flex; gap: 4px; }
      .${PREFIX}pill {
        flex: 1; background: #ffffff; color: #52525b; border: 1px solid #d4d4d8;
        border-radius: 6px; padding: 5px 4px; font-size: 11px; font-weight: 700;
        cursor: pointer; text-transform: uppercase;
      }
      .${PREFIX}pill.on { background: #111111; color: #ffffff; border-color: #111111; }

      .${PREFIX}grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }

      .${PREFIX}swgrid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 5px; }
      .${PREFIX}swatch {
        height: 26px; border-radius: 6px; border: 1.5px solid #cbd5e1;
        cursor: pointer; transition: transform .08s, border-color .1s;
      }
      .${PREFIX}swatch:hover { transform: scale(1.08); border-color: #111111; }
      .${PREFIX}swatch.on { border-color: #111111; box-shadow: inset 0 0 0 1.5px #111111; }

      .${PREFIX}wheel {
        background: #ffffff; border: 1px solid #c8c8c8; border-radius: 8px;
        padding: 13px 10px; text-align: center; min-height: 56px;
        display: flex; align-items: center; justify-content: center;
        font-size: 13.5px; font-weight: 700; color: #111111; line-height: 1.35;
        transition: border-color .15s, background .15s;
      }
      .${PREFIX}wheel.spin { background: #eff6ff; border-color: #3b82f6; color: #1d4ed8; }
      .${PREFIX}wheel.ready { border-color: #16a34a; background: #f0fdf4; }

      .${PREFIX}tbtn {
        display: flex; align-items: center; gap: 8px;
        background: #ffffff; color: #111111; border: 1px solid #d4d4d8;
        border-radius: 7px; padding: 7px 9px; font-size: 12px; font-weight: 600;
        cursor: pointer; text-align: left;
      }
      .${PREFIX}tbtn.on { border-color: #111111; box-shadow: inset 0 0 0 1px #111111; background: #f4f4f5; }
      .${PREFIX}pal { display: inline-flex; gap: 2px; flex-shrink: 0; }
      .${PREFIX}pal i { display: block; width: 9px; height: 14px; border: 1px solid rgba(0,0,0,0.2); border-radius: 2px; }

      .${PREFIX}ach {
        display: flex; align-items: center; gap: 10px;
        background: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px;
        padding: 8px 10px; opacity: 0.58;
      }
      .${PREFIX}ach.done { opacity: 1; border-color: #16a34a; background: #f0fdf4; }
      .${PREFIX}ach-ico {
        width: 30px; height: 30px; border-radius: 7px; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        background: #f4f4f5; border: 1px solid #d4d4d8;
      }
      .${PREFIX}ach.done .${PREFIX}ach-ico { background: #dcfce7; border-color: #86efac; }

      .${PREFIX}pbar {
        width: 100%; height: 7px; background: #e4e4e7; border-radius: 999px; overflow: hidden;
      }
      .${PREFIX}pbar > i { display: block; height: 100%; background: #111111; transition: width .2s; }

      .${PREFIX}badge {
        font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 5px;
        background: #f4f4f5; color: #18181b; border: 1px solid #d4d4d8;
      }
      .${PREFIX}note { font-size: 11.5px; color: #71717a; line-height: 1.4; }

      /* Toast */
      #${PREFIX}toast {
        position: fixed; bottom: 18px; left: 50%; transform: translateX(-50%) translateY(16px);
        z-index: 2147483647; background: #111111; color: #ffffff;
        border: 1px solid #3f3f46; border-radius: 8px;
        padding: 9px 15px; font-size: 12.5px; font-weight: 600;
        opacity: 0; pointer-events: none; transition: opacity .18s, transform .18s;
        box-shadow: 0 6px 20px rgba(0,0,0,0.22);
      }
      #${PREFIX}toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
      #${PREFIX}toast.gold { background: #111111; border-color: #facc15; color: #fef08a; }
      #${PREFIX}toast.err { background: #dc2626; border-color: #b91c1c; color: #ffffff; }
    `;
    (document.head || document.documentElement).appendChild(st);
  }

  function tagWorkspaceContainers() {
    const sidebar = document.querySelector(".sidebar");
    const targets = document.querySelectorAll(
      "body > div, #__nuxt, #__nuxt > div, #__layout, #__layout > div, .container, .instances, .workspace, main"
    );
    targets.forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      if (el.id && el.id.startsWith(PREFIX)) return;
      if (sidebar && (el === sidebar || sidebar.contains(el))) return;
      if (el.classList.contains("item") || el.classList.contains("instance") || el.classList.contains("sidebar")) return;
      const rect = el.getBoundingClientRect();
      if (rect.width >= window.innerWidth * 0.45 && rect.height >= window.innerHeight * 0.45) {
        el.classList.add(PREFIX + "ws-layer");
      }
    });
  }

  function applyVisualTheme() {
    tagWorkspaceContainers();

    let st = document.getElementById(PREFIX + "theme-style");
    if (!st) {
      st = document.createElement("style");
      st.id = PREFIX + "theme-style";
      (document.head || document.documentElement).appendChild(st);
    }

    const v = state.visual;
    const hasCustomSurface = v.theme !== "original" || Boolean(v.bgColor) || Boolean(v.bgImage);
    let bgColor = v.bgColor || "";
    let bgImageCss = "";
    let bgSizeCss = "";
    let extraCss = "";

    const darkSidebarCss = `
      .sidebar { background: #181b20 !important; border-color: #2f3540 !important; color: #f1f5f9 !important; }
      .sidebar-input { background: #101216 !important; color: #ffffff !important; border-color: #2f3540 !important; }
      .item, .instance { background: #222730 !important; border-color: #3d4554 !important; color: #f8fafc !important; }
      .item:hover { background: #2c3340 !important; }
    `;

    if (v.theme === "grid_paper") {
      if (!bgColor) bgColor = "#fdfefe";
      bgImageCss = "linear-gradient(rgba(59, 130, 246, 0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.16) 1px, transparent 1px)";
      bgSizeCss = "26px 26px";
    } else if (v.theme === "parchment") {
      if (!bgColor) bgColor = "#f4ead2";
      bgImageCss = "radial-gradient(rgba(120, 53, 15, 0.1) 1px, transparent 0)";
      bgSizeCss = "20px 20px";
      extraCss = `
        .sidebar { background: #efe1c1 !important; border-color: #cbb68a !important; }
        .item, .instance { background: #fbf5e6 !important; border-color: #bfa675 !important; color: #3b2310 !important; }
      `;
    } else if (v.theme === "chalkboard") {
      if (!bgColor) bgColor = "#16191d";
      bgImageCss = "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 0)";
      bgSizeCss = "22px 22px";
      extraCss = darkSidebarCss;
    } else if (v.theme === "blueprint") {
      if (!bgColor) bgColor = "#0b2545";
      bgImageCss = "linear-gradient(rgba(147, 197, 253, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(147, 197, 253, 0.18) 1px, transparent 1px)";
      bgSizeCss = "28px 28px";
      extraCss = `
        .sidebar { background: #0f2f57 !important; border-color: #2c5b94 !important; color: #e0f2fe !important; }
        .sidebar-input { background: #091d36 !important; color: #e0f2fe !important; border-color: #2c5b94 !important; }
        .item, .instance { background: #133c6e !important; border-color: #60a5fa !important; color: #ffffff !important; }
        .item:hover { background: #1b4d8a !important; }
      `;
    } else if (v.theme === "neon_lab") {
      if (!bgColor) bgColor = "#0d0a1a";
      bgImageCss = "linear-gradient(rgba(34, 211, 238, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.12) 1px, transparent 1px)";
      bgSizeCss = "32px 32px";
      extraCss = `
        .sidebar { background: #130e26 !important; border-color: #3b2a6e !important; color: #f5f3ff !important; }
        .sidebar-input { background: #0b0817 !important; color: #ffffff !important; border-color: #3b2a6e !important; }
        .item, .instance { background: #1a1333 !important; border-color: #22d3ee !important; color: #ffffff !important; }
        .item:hover { background: #261c4a !important; }
      `;
    }

    if (v.autoSyncDark !== false && v.bgColor && isDarkHex(v.bgColor) && !extraCss) {
      extraCss = darkSidebarCss;
    }

    let css = "";

    if (hasCustomSurface) {
      let rootBg = "";
      if (bgColor) rootBg += `background-color: ${bgColor} !important;`;
      if (v.bgImage) {
        const dim = Math.max(0, Math.min(85, Number(v.bgDim ?? 25))) / 100;
        rootBg += `
          background-image: linear-gradient(rgba(0,0,0,${dim}), rgba(0,0,0,${dim})), url("${v.bgImage}") !important;
          background-size: cover !important;
          background-position: center !important;
          background-repeat: no-repeat !important;
          background-attachment: fixed !important;
        `;
      } else if (bgImageCss) {
        rootBg += `
          background-image: ${bgImageCss} !important;
          background-size: ${bgSizeCss} !important;
          background-attachment: fixed !important;
        `;
      } else {
        rootBg += `background-image: none !important;`;
      }

      css += `
        html, body { ${rootBg} }
        .${PREFIX}ws-layer, #__nuxt, #__layout, .container, .instances {
          background-color: transparent !important;
          background-image: none !important;
        }
        ${extraCss}
      `;
    }

    if (v.hideDots) {
      css += `
        canvas.particles, .particles, canvas:not(#${PREFIX}fx-canvas) {
          opacity: 0 !important;
        }
      `;
    }

    st.textContent = css;
  }

  function applyFabPosition() {
    const fab = document.getElementById(PREFIX + "fab");
    if (!fab) return;
    const pos = state.fab && state.fab.v1Pos;
    if (pos && typeof pos.x === "number" && typeof pos.y === "number") {
      const maxX = Math.max(8, window.innerWidth - (fab.offsetWidth || 150) - 8);
      const maxY = Math.max(8, window.innerHeight - (fab.offsetHeight || 36) - 8);
      fab.style.transform = "none";
      fab.style.bottom = "auto";
      fab.style.left = Math.max(8, Math.min(maxX, pos.x)) + "px";
      fab.style.top = Math.max(8, Math.min(maxY, pos.y)) + "px";
    } else {
      fab.style.transform = "none";
      fab.style.top = "auto";
      fab.style.left = "12px";
      fab.style.bottom = "62px";
    }
  }

  function setupDraggableFab(fab, panel) {
    let down = false;
    let moved = false;
    let suppressClick = false;
    let startX = 0, startY = 0, origLeft = 0, origTop = 0;

    fab.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      down = true;
      moved = false;
      const r = fab.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      origLeft = r.left;
      origTop = r.top;
      if (fab.setPointerCapture) {
        try { fab.setPointerCapture(e.pointerId); } catch (err) {}
      }
    });

    fab.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!moved && Math.hypot(dx, dy) > 5) {
        moved = true;
        fab.classList.add("dragging");
      }
      if (!moved) return;
      const maxX = Math.max(8, window.innerWidth - fab.offsetWidth - 8);
      const maxY = Math.max(8, window.innerHeight - fab.offsetHeight - 8);
      const nx = Math.max(8, Math.min(maxX, origLeft + dx));
      const ny = Math.max(8, Math.min(maxY, origTop + dy));
      fab.style.transform = "none";
      fab.style.bottom = "auto";
      fab.style.left = nx + "px";
      fab.style.top = ny + "px";
    });

    const finishDrag = () => {
      if (!down) return;
      down = false;
      fab.classList.remove("dragging");
      if (moved) {
        suppressClick = true;
        setTimeout(() => { suppressClick = false; }, 120);
        state.fab.v1Pos = {
          x: Math.round(parseFloat(fab.style.left) || 12),
          y: Math.round(parseFloat(fab.style.top) || (window.innerHeight - 98))
        };
        saveState();
      }
    };

    fab.addEventListener("pointerup", finishDrag);
    fab.addEventListener("pointercancel", finishDrag);

    fab.addEventListener("click", () => {
      if (suppressClick) return;
      panel.classList.toggle("open");
      if (panel.classList.contains("open")) renderPanel();
    });
  }

  function updateHudDisplay() {
    const hud = document.getElementById(PREFIX + "hud");
    if (!hud) return;
    const visible = Boolean(state.hud.show) && !Boolean(state.hud.cleanView);
    hud.style.display = visible ? "flex" : "none";
    hud.style.left = (state.hud.pos?.x ?? 16) + "px";
    hud.style.top = (state.hud.pos?.y ?? 62) + "px";

    const ch = getActiveChallenge();
    const mEl = document.getElementById(PREFIX + "hud-mission");
    const tEl = document.getElementById(PREFIX + "hud-time");
    const sEl = document.getElementById(PREFIX + "hud-steps");
    const bEl = document.getElementById(PREFIX + "hud-go");
    if (mEl) {
      mEl.textContent = ch
        ? ch.text
        : (state.challenge.lastCompleted ? "Done: " + state.challenge.lastCompleted : "No active challenge");
    }
    if (tEl) tEl.textContent = formatTime(getCurrentTimerMs());
    if (sEl) sEl.textContent = runSteps + " steps";
    if (bEl) bEl.textContent = timerRunning ? "Pause" : "Start";
  }

  function makeDraggable(el, handle, onEnd) {
    let dragging = false, ox = 0, oy = 0;
    (handle || el).addEventListener("mousedown", (e) => {
      if (e.target.closest("button, input, select")) return;
      dragging = true;
      const r = el.getBoundingClientRect();
      ox = e.clientX - r.left;
      oy = e.clientY - r.top;
      el.style.transform = "none";
      el.style.left = r.left + "px";
      el.style.top = r.top + "px";
      e.preventDefault();
    });
    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      const nx = Math.max(6, Math.min(window.innerWidth - 80, e.clientX - ox));
      const ny = Math.max(6, Math.min(window.innerHeight - 40, e.clientY - oy));
      el.style.left = nx + "px";
      el.style.top = ny + "px";
    });
    window.addEventListener("mouseup", () => {
      if (!dragging) return;
      dragging = false;
      if (onEnd) {
        onEnd({
          x: Math.round(parseFloat(el.style.left) || 16),
          y: Math.round(parseFloat(el.style.top) || 62)
        });
      }
    });
  }

  function stopKeyLeak(el) {
    ["keydown", "keyup", "keypress"].forEach((ev) => {
      el.addEventListener(ev, (e) => e.stopPropagation());
    });
  }

  function renderPanel() {
    const panel = document.getElementById(PREFIX + "panel");
    if (!panel) return;
    panel.querySelectorAll("." + PREFIX + "tab").forEach((b) => {
      b.classList.toggle("on", b.getAttribute("data-t") === activeTab);
    });
    const cleanHdrBtn = panel.querySelector("#" + PREFIX + "clean-btn");
    if (cleanHdrBtn) {
      cleanHdrBtn.textContent = state.hud.cleanView ? "Show HUD" : "Clean View";
    }
    const body = panel.querySelector("." + PREFIX + "body");
    body.innerHTML = "";

    // TAB 1: CHALLENGES & SPEEDRUN
    if (activeTab === "challenges") {
      const ch = getActiveChallenge();
      const diff = state.challenge.difficulty || "all";
      const wheelLabel = ch
        ? ch.text
        : (state.challenge.lastCompleted
          ? "Completed! " + state.challenge.lastCompleted + " — Spin for next"
          : "Pick a difficulty and click Spin Wheel");

      body.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;gap:6px">
          <span class="${PREFIX}badge">Streak: <b>${state.challenge.streak || 0}</b></span>
          <span class="${PREFIX}badge">Best Streak: <b>${state.challenge.bestStreak || 0}</b></span>
          <label style="display:flex;align-items:center;gap:6px;font-size:11.5px;font-weight:600">
            <span>HUD</span>
            <input type="checkbox" id="${PREFIX}c-hud"${state.hud.show && !state.hud.cleanView ? " checked" : ""}>
          </label>
        </div>

        <div class="${PREFIX}lbl">Mission Wheel & Difficulty</div>
        <div class="${PREFIX}card">
          <div class="${PREFIX}pills">
            <button type="button" class="${PREFIX}pill${diff === "all" ? " on" : ""}" data-df="all">All</button>
            <button type="button" class="${PREFIX}pill${diff === "easy" ? " on" : ""}" data-df="easy">Easy</button>
            <button type="button" class="${PREFIX}pill${diff === "medium" ? " on" : ""}" data-df="medium">Medium</button>
            <button type="button" class="${PREFIX}pill${diff === "hard" ? " on" : ""}" data-df="hard">Hard</button>
          </div>
          <div class="${PREFIX}wheel${ch ? " ready" : ""}" id="${PREFIX}wheel-box">
            ${esc(wheelLabel)}
          </div>
          <div class="${PREFIX}acts">
            <button type="button" class="${PREFIX}btn primary" id="${PREFIX}w-spin">Spin Wheel</button>
            <button type="button" class="${PREFIX}btn green" id="${PREFIX}w-done"${ch ? "" : " disabled"}>Completed</button>
            <button type="button" class="${PREFIX}btn red" id="${PREFIX}w-skip"${ch ? "" : " disabled"}>Skip</button>
          </div>
          <div style="display:flex;gap:5px">
            <input class="${PREFIX}inp" id="${PREFIX}w-custom" placeholder="Add custom challenge (e.g. Craft: Pikachu)">
            <button type="button" class="${PREFIX}btn" id="${PREFIX}w-add">+</button>
          </div>
          <div class="${PREFIX}note">Hotkeys: <b>F8</b> Pause • <b>F9</b> Reset • <b>Alt+R</b> Panel • <b>Alt+H</b> Clean View • <b>Alt+M</b> Radio</div>
        </div>

        <div class="${PREFIX}lbl">Timer & Steps</div>
        <div class="${PREFIX}card">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span style="font:700 22px/1 Consolas,monospace;color:#111111" id="${PREFIX}p-time">${formatTime(getCurrentTimerMs())}</span>
            <span class="${PREFIX}badge">Steps: <b id="${PREFIX}p-steps">${runSteps}</b></span>
          </div>
          <div class="${PREFIX}acts">
            <button type="button" class="${PREFIX}btn ${timerRunning ? "" : "primary"}" id="${PREFIX}t-go">${timerRunning ? "Pause" : "Start"}</button>
            <button type="button" class="${PREFIX}btn" id="${PREFIX}t-rst">Reset</button>
            <button type="button" class="${PREFIX}btn" id="${PREFIX}t-step">+1 Step</button>
          </div>
        </div>

        <div class="${PREFIX}lbl">Challenge Records (${(state.challenge.records || []).length})</div>
        <div id="${PREFIX}rec-list" style="display:flex;flex-direction:column;gap:5px"></div>
      `;

      const customInp = body.querySelector("#" + PREFIX + "w-custom");
      stopKeyLeak(customInp);

      body.querySelector("#" + PREFIX + "c-hud").addEventListener("change", (e) => {
        state.hud.show = e.target.checked;
        if (e.target.checked) state.hud.cleanView = false;
        updateHudDisplay();
        saveState();
      });

      body.querySelectorAll("[data-df]").forEach((b) => {
        b.addEventListener("click", () => {
          state.challenge.difficulty = b.getAttribute("data-df");
          saveState(renderPanel);
        });
      });

      const spinBtn = body.querySelector("#" + PREFIX + "w-spin");
      const wheelBox = body.querySelector("#" + PREFIX + "wheel-box");
      spinBtn.addEventListener("click", () => {
        const pool = getFilteredChallenges();
        if (!pool.length || spinning) return;
        spinning = true;
        spinBtn.disabled = true;
        wheelBox.classList.remove("ready");
        wheelBox.classList.add("spin");

        let step = 0;
        const total = 15;
        const tick = () => {
          const pick = pool[Math.floor(Math.random() * pool.length)];
          wheelBox.textContent = pick.text;
          step++;
          if (step < total) {
            setTimeout(tick, 45 + step * 10);
          } else {
            spinning = false;
            spinBtn.disabled = false;
            wheelBox.classList.remove("spin");
            wheelBox.classList.add("ready");
            state.challenge.activeId = pick.id;
            state.challenge.lastCompleted = "";
            timerElapsed = 0;
            runSteps = 0;
            runNewCount = 0;
            timerStart = performance.now();
            timerRunning = true;
            saveState();
            updateHudDisplay();
            showToast("Challenge active! Timer running");
            renderPanel();
          }
        };
        tick();
      });

      body.querySelector("#" + PREFIX + "w-done").addEventListener("click", () => completeActiveChallenge(false));
      body.querySelector("#" + PREFIX + "w-skip").addEventListener("click", () => {
        if (!getActiveChallenge()) return;
        state.challenge.activeId = null;
        state.challenge.streak = 0;
        timerRunning = false;
        timerElapsed = 0;
        runSteps = 0;
        saveState(() => {
          updateHudDisplay();
          showToast("Challenge skipped (streak reset)", "err");
          renderPanel();
        });
      });

      body.querySelector("#" + PREFIX + "w-add").addEventListener("click", () => {
        const raw = customInp.value.trim();
        if (!raw) return;
        const target = raw.replace(/^craft\s*:\s*/i, "").trim();
        const item = {
          id: "cust_" + Date.now(),
          diff: "medium",
          text: /^craft\s*:/i.test(raw) ? raw : ("Craft: " + raw),
          type: "word",
          keywords: [target]
        };
        state.challenge.customList.unshift(item);
        state.challenge.activeId = item.id;
        state.challenge.lastCompleted = "";
        timerElapsed = 0;
        runSteps = 0;
        runNewCount = 0;
        timerStart = performance.now();
        timerRunning = true;
        saveState(() => {
          updateHudDisplay();
          showToast("Challenge added! Timer running");
          renderPanel();
        });
      });

      body.querySelector("#" + PREFIX + "t-go").addEventListener("click", toggleTimer);
      body.querySelector("#" + PREFIX + "t-rst").addEventListener("click", resetRun);
      body.querySelector("#" + PREFIX + "t-step").addEventListener("click", () => {
        runSteps++;
        updateHudDisplay();
        renderPanel();
      });

      const recList = body.querySelector("#" + PREFIX + "rec-list");
      const recs = state.challenge.records || [];
      if (!recs.length) {
        recList.innerHTML = `<div class="${PREFIX}note">No challenges completed yet. Spin the wheel to start.</div>`;
      } else {
        recs.forEach((r) => {
          const row = document.createElement("div");
          row.className = PREFIX + "row";
          row.innerHTML = `
            <div style="overflow:hidden">
              <div style="font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(r.title)}</div>
              <div class="${PREFIX}note">${esc(r.steps)} steps • ${esc(r.date)}</div>
            </div>
            <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
              <span class="${PREFIX}badge">${esc(r.timeStr)}</span>
              <button type="button" class="${PREFIX}btn red" style="padding:2px 7px;font-size:10.5px">X</button>
            </div>
          `;
          row.querySelector("button").addEventListener("click", () => {
            state.challenge.records = state.challenge.records.filter((x) => x.id !== r.id);
            saveState(renderPanel);
          });
          recList.appendChild(row);
        });
      }
      return;
    }

    // TAB 2: ACHIEVEMENTS & TROPHY CARD
    if (activeTab === "achievements") {
      const doneCount = ACHIEVEMENTS.filter((a) => state.stats.unlocked[a.id]).length;
      const pct = Math.round((doneCount / ACHIEVEMENTS.length) * 100);
      const medalSvg = (on) => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${on ? "#16a34a" : "#71717a"}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M8.5 14.5L7 22l5-2.5L17 22l-1.5-7.5"/></svg>`;

      body.innerHTML = `
        <div class="${PREFIX}card">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <b style="font-size:13px">Achievement Progress</b>
            <span class="${PREFIX}badge">${doneCount} / ${ACHIEVEMENTS.length} (${pct}%)</span>
          </div>
          <div class="${PREFIX}pbar"><i style="width:${pct}%"></i></div>
          <div style="display:flex;justify-content:space-between" class="${PREFIX}note">
            <span>Merges: <b>${state.stats.totalMerges || 0}</b></span>
            <span>First Discoveries: <b>${state.stats.firstDiscoveries || 0}</b></span>
            <span>Challenges: <b>${state.challenge.completedCount || 0}</b></span>
          </div>
        </div>

        <div class="${PREFIX}lbl">First Discovery Trophy Card (.PNG)</div>
        <div class="${PREFIX}card">
          <div style="display:flex;gap:5px">
            <input class="${PREFIX}inp" id="${PREFIX}tc-name" placeholder="Element name for card..." value="${esc(state.stats.lastDiscoveryName || "")}">
            <button type="button" class="${PREFIX}btn primary" id="${PREFIX}tc-dl" style="white-space:nowrap">Download .PNG</button>
          </div>
          <div class="${PREFIX}note">Exports a shareable trophy image with your discovery, timer, steps, and streak.</div>
        </div>

        <div class="${PREFIX}lbl">Medals</div>
        <div id="${PREFIX}ach-list" style="display:flex;flex-direction:column;gap:6px"></div>
      `;

      const tcInp = body.querySelector("#" + PREFIX + "tc-name");
      stopKeyLeak(tcInp);
      body.querySelector("#" + PREFIX + "tc-dl").addEventListener("click", () => {
        const val = tcInp.value.trim();
        if (val) {
          state.stats.lastDiscoveryName = val;
          saveState();
        }
        downloadTrophyCard(val);
      });

      const list = body.querySelector("#" + PREFIX + "ach-list");
      ACHIEVEMENTS.forEach((a) => {
        const done = Boolean(state.stats.unlocked[a.id]);
        const card = document.createElement("div");
        card.className = PREFIX + "ach" + (done ? " done" : "");
        card.innerHTML = `
          <div class="${PREFIX}ach-ico">${medalSvg(done)}</div>
          <div>
            <div style="font-size:12.5px;font-weight:700;color:#111111">${esc(a.name)} ${done ? "<span style='color:#16a34a;font-size:11px'>✓</span>" : ""}</div>
            <div class="${PREFIX}note">${esc(a.desc)}</div>
          </div>
        `;
        list.appendChild(card);
      });
      return;
    }

    // TAB 3: VISUAL LAB, PARTICLES & BACKUP
    if (activeTab === "lab") {
      const v = state.visual;
      const themesHtml = THEMES.map((t) => {
        const on = v.theme === t.id;
        return `<button type="button" class="${PREFIX}tbtn${on ? " on" : ""}" data-th="${t.id}">
          <span class="${PREFIX}pal"><i style="background:${t.preview[0]}"></i><i style="background:${t.preview[1]}"></i><i style="background:${t.preview[2]}"></i></span>
          <span>${t.name}</span>
        </button>`;
      }).join("");

      const swatchesHtml = WORKSPACE_SWATCHES.map((hex) => {
        const on = (v.bgColor || "").toLowerCase() === hex.toLowerCase();
        return `<button type="button" class="${PREFIX}swatch${on ? " on" : ""}" data-col="${hex}" style="background:${hex}" title="${hex}"></button>`;
      }).join("");

      const pStyleOpts = PARTICLE_STYLES.map((p) => `<option value="${p.id}">${p.name}</option>`).join("");

      body.innerHTML = `
        <div class="${PREFIX}lbl">Crafting Area Color</div>
        <div class="${PREFIX}card">
          <div class="${PREFIX}swgrid">${swatchesHtml}</div>
          <div style="display:flex;align-items:center;gap:6px;margin-top:2px">
            <input type="color" id="${PREFIX}bg-col" value="${v.bgColor || "#ffffff"}" style="width:38px;height:30px;border:1px solid #cbd5e1;border-radius:6px;background:transparent;cursor:pointer">
            <span style="flex:1;font-size:12px;color:#52525b">Custom color: <b>${esc(v.bgColor || "Theme default")}</b></span>
            <button type="button" class="${PREFIX}btn" id="${PREFIX}bg-col-rst">Reset</button>
          </div>
          <label class="${PREFIX}row" style="border:0;padding:2px 0;background:transparent">
            <span>Auto-sync dark sidebar & cards</span>
            <input type="checkbox" id="${PREFIX}v-sync"${v.autoSyncDark !== false ? " checked" : ""}>
          </label>
          <label class="${PREFIX}row" style="border:0;padding:2px 0;background:transparent">
            <span>Hide default background lines</span>
            <input type="checkbox" id="${PREFIX}v-dots"${v.hideDots ? " checked" : ""}>
          </label>
        </div>

        <div class="${PREFIX}lbl">Notebook & Lab Themes</div>
        <div class="${PREFIX}grid2">${themesHtml}</div>

        <div class="${PREFIX}lbl">Crafting Area Image / GIF</div>
        <div class="${PREFIX}card">
          <div class="${PREFIX}acts">
            <button type="button" class="${PREFIX}btn primary" id="${PREFIX}bg-up">Upload Image/GIF</button>
            <button type="button" class="${PREFIX}btn red" id="${PREFIX}bg-clr">Remove</button>
          </div>
          <div class="${PREFIX}row" style="border:0;padding:2px 0;background:transparent">
            <span>Darken image (<b id="${PREFIX}bg-dv">${v.bgDim}%</b>)</span>
            <input type="range" id="${PREFIX}bg-dim" min="0" max="80" value="${v.bgDim}">
          </div>
          <input type="file" id="${PREFIX}bg-file" accept="image/*" style="display:none">
        </div>

        <div class="${PREFIX}lbl">Merge Particles, Confetti & Sounds</div>
        <div class="${PREFIX}card">
          <label class="${PREFIX}row" style="border:0;padding:2px 0;background:transparent">
            <span>Enable merge particles</span>
            <input type="checkbox" id="${PREFIX}v-part"${v.particles ? " checked" : ""}>
          </label>
          <div class="${PREFIX}row" style="border:0;padding:2px 0;background:transparent">
            <span>Particle Style</span>
            <select class="${PREFIX}sel" id="${PREFIX}v-pstyle" style="width:145px;padding:4px 6px">${pStyleOpts}</select>
          </div>
          <div class="${PREFIX}row" style="border:0;padding:2px 0;background:transparent">
            <span>Rainbow colors</span>
            <input type="checkbox" id="${PREFIX}v-prain"${v.particleRainbow !== false ? " checked" : ""}>
          </div>
          <div class="${PREFIX}row" style="border:0;padding:2px 0;background:transparent">
            <span>Custom particle color</span>
            <input type="color" id="${PREFIX}v-pcol" value="${v.particleColor || "#3b82f6"}" style="width:36px;height:26px;border:1px solid #cbd5e1;border-radius:6px;background:transparent;cursor:pointer">
          </div>
          <label class="${PREFIX}row" style="border:0;padding:2px 0;background:transparent">
            <span>Confetti on First Discovery & Challenges</span>
            <input type="checkbox" id="${PREFIX}v-conf"${v.confetti ? " checked" : ""}>
          </label>
          <label class="${PREFIX}row" style="border:0;padding:2px 0;background:transparent">
            <span>Sound effects & fanfare</span>
            <input type="checkbox" id="${PREFIX}v-sfx"${v.sfx ? " checked" : ""}>
          </label>
          <div class="${PREFIX}row" style="border:0;padding:2px 0;background:transparent">
            <span>SFX Volume (<b id="${PREFIX}v-sfv">${Math.round((v.sfxVolume ?? 0.55) * 100)}%</b>)</span>
            <input type="range" id="${PREFIX}v-sfr" min="10" max="100" value="${Math.round((v.sfxVolume ?? 0.55) * 100)}">
          </div>
          <div class="${PREFIX}acts">
            <button type="button" class="${PREFIX}btn" id="${PREFIX}v-testp">Test Particles</button>
            <button type="button" class="${PREFIX}btn" id="${PREFIX}v-test">Test Confetti</button>
          </div>
        </div>

        <div class="${PREFIX}lbl">Backup & Position</div>
        <div class="${PREFIX}card">
          <div class="${PREFIX}acts">
            <button type="button" class="${PREFIX}btn primary" id="${PREFIX}bk-exp">Export .JSON</button>
            <button type="button" class="${PREFIX}btn" id="${PREFIX}bk-imp">Import .JSON</button>
            <button type="button" class="${PREFIX}btn" id="${PREFIX}fab-rst">Reset Button</button>
          </div>
          <input type="file" id="${PREFIX}bk-file" accept=".json,application/json" style="display:none">
        </div>
      `;

      const pSel = body.querySelector("#" + PREFIX + "v-pstyle");
      pSel.value = v.particleStyle || "sparks";
      pSel.addEventListener("change", () => {
        state.visual.particleStyle = pSel.value;
        saveState();
        spawnMergeSparks(window.innerWidth * 0.5, window.innerHeight * 0.45);
      });

      body.querySelector("#" + PREFIX + "v-prain").addEventListener("change", (e) => {
        state.visual.particleRainbow = e.target.checked; saveState();
      });
      body.querySelector("#" + PREFIX + "v-pcol").addEventListener("input", (e) => {
        state.visual.particleColor = e.target.value;
        state.visual.particleRainbow = false;
        const rainChk = body.querySelector("#" + PREFIX + "v-prain");
        if (rainChk) rainChk.checked = false;
        saveState();
      });

      body.querySelectorAll("[data-col]").forEach((b) => {
        b.addEventListener("click", () => {
          const hex = b.getAttribute("data-col");
          state.visual.bgColor = hex;
          state.visual.bgImage = "";
          unlockAchievement("lab_style");
          applyVisualTheme();
          saveState(renderPanel);
        });
      });

      body.querySelector("#" + PREFIX + "bg-col").addEventListener("input", (e) => {
        state.visual.bgColor = e.target.value;
        state.visual.bgImage = "";
        unlockAchievement("lab_style");
        applyVisualTheme();
        saveState();
      });

      body.querySelector("#" + PREFIX + "bg-col-rst").addEventListener("click", () => {
        state.visual.bgColor = "";
        applyVisualTheme();
        saveState(() => { showToast("Background color reset"); renderPanel(); });
      });

      body.querySelector("#" + PREFIX + "v-sync").addEventListener("change", (e) => {
        state.visual.autoSyncDark = e.target.checked;
        applyVisualTheme();
        saveState();
      });

      body.querySelector("#" + PREFIX + "v-dots").addEventListener("change", (e) => {
        state.visual.hideDots = e.target.checked;
        applyVisualTheme();
        saveState();
      });

      body.querySelectorAll("[data-th]").forEach((b) => {
        b.addEventListener("click", () => {
          const id = b.getAttribute("data-th");
          state.visual.theme = id;
          state.visual.bgColor = "";
          if (id !== "original") unlockAchievement("lab_style");
          applyVisualTheme();
          saveState(renderPanel);
        });
      });

      const bgFile = body.querySelector("#" + PREFIX + "bg-file");
      body.querySelector("#" + PREFIX + "bg-up").addEventListener("click", () => bgFile.click());
      body.querySelector("#" + PREFIX + "bg-clr").addEventListener("click", () => {
        state.visual.bgImage = "";
        applyVisualTheme();
        saveState(() => showToast("Custom image removed"));
      });
      body.querySelector("#" + PREFIX + "bg-dim").addEventListener("input", (e) => {
        state.visual.bgDim = Number(e.target.value);
        body.querySelector("#" + PREFIX + "bg-dv").textContent = e.target.value + "%";
        applyVisualTheme();
        saveState();
      });
      bgFile.addEventListener("change", () => {
        const f = bgFile.files && bgFile.files[0];
        if (!f) return;
        if (f.size > 3.5 * 1024 * 1024) { showToast("File too large (max 3.5 MB)", "err"); return; }
        const rd = new FileReader();
        rd.onload = () => {
          state.visual.bgImage = String(rd.result || "");
          unlockAchievement("lab_style");
          applyVisualTheme();
          saveState(() => showToast("Workspace background applied!"));
        };
        rd.readAsDataURL(f);
      });

      body.querySelector("#" + PREFIX + "v-part").addEventListener("change", (e) => { state.visual.particles = e.target.checked; saveState(); });
      body.querySelector("#" + PREFIX + "v-conf").addEventListener("change", (e) => { state.visual.confetti = e.target.checked; saveState(); });
      body.querySelector("#" + PREFIX + "v-sfx").addEventListener("change", (e) => { state.visual.sfx = e.target.checked; saveState(); });
      body.querySelector("#" + PREFIX + "v-sfr").addEventListener("input", (e) => {
        state.visual.sfxVolume = Number(e.target.value) / 100;
        body.querySelector("#" + PREFIX + "v-sfv").textContent = e.target.value + "%";
        saveState();
      });
      body.querySelector("#" + PREFIX + "v-testp").addEventListener("click", () => {
        spawnMergeSparks(window.innerWidth * 0.5, window.innerHeight * 0.45);
        playSfx("merge");
      });
      body.querySelector("#" + PREFIX + "v-test").addEventListener("click", () => {
        spawnConfettiBurst();
        playSfx("discovery");
      });

      const bkFile = body.querySelector("#" + PREFIX + "bk-file");
      body.querySelector("#" + PREFIX + "bk-exp").addEventListener("click", exportBackupJson);
      body.querySelector("#" + PREFIX + "bk-imp").addEventListener("click", () => bkFile.click());
      bkFile.addEventListener("change", () => {
        const f = bkFile.files && bkFile.files[0];
        if (f) importBackupJson(f);
        bkFile.value = "";
      });

      body.querySelector("#" + PREFIX + "fab-rst").addEventListener("click", () => {
        state.fab.v1Pos = null;
        applyFabPosition();
        saveState(() => showToast("Button returned above Menu"));
      });
      return;
    }

    // TAB 4: MP3 RADIO
    const nowPlaying = currentTrackIdx >= 0 && tracks[currentTrackIdx]
      ? tracks[currentTrackIdx].name
      : "No track loaded";

    body.innerHTML = `
      <div class="${PREFIX}lbl">Background MP3 Radio (Alt+M Play/Pause)</div>
      <div class="${PREFIX}card">
        <div style="font-size:13px;font-weight:700;color:#111111;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(nowPlaying)}</div>
        <div class="${PREFIX}acts">
          <button type="button" class="${PREFIX}btn" id="${PREFIX}au-prev">&lt;&lt;</button>
          <button type="button" class="${PREFIX}btn primary" id="${PREFIX}au-play">${audioEl.paused ? "Play" : "Pause"}</button>
          <button type="button" class="${PREFIX}btn" id="${PREFIX}au-next">&gt;&gt;</button>
        </div>
        <div class="${PREFIX}row">
          <span>Volume (<b id="${PREFIX}au-volv">${Math.round((state.audio.volume ?? 0.65) * 100)}%</b>)</span>
          <input type="range" id="${PREFIX}au-vol" min="0" max="100" value="${Math.round((state.audio.volume ?? 0.65) * 100)}">
        </div>
        <div class="${PREFIX}row">
          <span>Speed (<b id="${PREFIX}au-spdv">${Number(state.audio.speed ?? 1).toFixed(2)}x</b>)</span>
          <input type="range" id="${PREFIX}au-spd" min="50" max="200" step="5" value="${Math.round((state.audio.speed ?? 1) * 100)}">
        </div>
        <button type="button" class="${PREFIX}btn green" id="${PREFIX}au-up">+ Upload MP3 Files</button>
        <input type="file" id="${PREFIX}au-file" accept="audio/*" multiple style="display:none">
      </div>
      <div id="${PREFIX}au-list" style="display:flex;flex-direction:column;gap:5px"></div>
    `;

    body.querySelector("#" + PREFIX + "au-play").addEventListener("click", toggleRadioPlayPause);
    body.querySelector("#" + PREFIX + "au-prev").addEventListener("click", () => playTrack(currentTrackIdx - 1));
    body.querySelector("#" + PREFIX + "au-next").addEventListener("click", () => playTrack(currentTrackIdx + 1));

    body.querySelector("#" + PREFIX + "au-vol").addEventListener("input", (e) => {
      state.audio.volume = Number(e.target.value) / 100;
      body.querySelector("#" + PREFIX + "au-volv").textContent = e.target.value + "%";
      applyAudioSettings();
      saveState();
    });
    body.querySelector("#" + PREFIX + "au-spd").addEventListener("input", (e) => {
      state.audio.speed = Number(e.target.value) / 100;
      body.querySelector("#" + PREFIX + "au-spdv").textContent = state.audio.speed.toFixed(2) + "x";
      applyAudioSettings();
      saveState();
    });

    const auFile = body.querySelector("#" + PREFIX + "au-file");
    body.querySelector("#" + PREFIX + "au-up").addEventListener("click", () => auFile.click());
    auFile.addEventListener("change", async () => {
      const files = Array.from(auFile.files || []);
      if (!files.length) return;
      for (const f of files) {
        const added = await addTrackToDb(f);
        tracks.push(added);
      }
      if (currentTrackIdx === -1 && tracks.length) playTrack(0);
      else renderPanel();
      showToast(files.length + " track(s) saved!");
    });

    const auList = body.querySelector("#" + PREFIX + "au-list");
    tracks.forEach((tr, idx) => {
      const row = document.createElement("div");
      row.className = PREFIX + "row";
      const isCur = idx === currentTrackIdx;
      row.innerHTML = `
        <span style="cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:${isCur ? "700" : "500"};color:${isCur ? "#16a34a" : "#111111"}">${isCur ? "> " : ""}${esc(tr.name)}</span>
        <button type="button" class="${PREFIX}btn red" style="padding:2px 7px;font-size:10.5px">X</button>
      `;
      row.querySelector("span").addEventListener("click", () => playTrack(idx));
      row.querySelector("button").addEventListener("click", async () => {
        await deleteTrackFromDb(tr.id);
        URL.revokeObjectURL(tr.url);
        tracks.splice(idx, 1);
        if (idx === currentTrackIdx) {
          audioEl.pause();
          currentTrackIdx = tracks.length ? 0 : -1;
        } else if (idx < currentTrackIdx) {
          currentTrackIdx--;
        }
        renderPanel();
      });
      auList.appendChild(row);
    });
  }

  function mountUI() {
    if (!document.body || document.getElementById(PREFIX + "fab")) return;
    ensureBaseStyles();

    const flaskSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6"/><path d="M10 3v6l-5.2 9A2 2 0 0 0 6.5 21h11a2 2 0 0 0 1.7-3L14 9V3"/><path d="M7.5 15h9"/></svg>`;

    const fab = document.createElement("button");
    fab.id = PREFIX + "fab";
    fab.type = "button";
    fab.title = "Drag to move | Click to open (Alt+R)";
    fab.innerHTML = `${flaskSvg}<span>Infinite Remake</span>`;
    document.body.appendChild(fab);

    const hud = document.createElement("div");
    hud.id = PREFIX + "hud";
    hud.innerHTML = `
      <span class="mission" id="${PREFIX}hud-mission">No active challenge</span>
      <span class="sep"></span>
      <span class="time" id="${PREFIX}hud-time">00:00.0</span>
      <span class="steps" id="${PREFIX}hud-steps">0 steps</span>
      <button type="button" class="hbtn" id="${PREFIX}hud-go">Start</button>
      <button type="button" class="hbtn" id="${PREFIX}hud-hide" title="Clean View (Alt+H)">Hide</button>
    `;
    document.body.appendChild(hud);
    makeDraggable(hud, hud, (pos) => { state.hud.pos = pos; saveState(); });
    hud.querySelector("#" + PREFIX + "hud-go").addEventListener("click", toggleTimer);
    hud.querySelector("#" + PREFIX + "hud-hide").addEventListener("click", toggleCleanView);

    const panel = document.createElement("div");
    panel.id = PREFIX + "panel";
    panel.innerHTML = `
      <div class="${PREFIX}hdr">
        <h3>${flaskSvg}<span>Infinite Remake v1.0.0</span></h3>
        <div class="${PREFIX}hdr-r">
          <button type="button" class="${PREFIX}btn" id="${PREFIX}clean-btn" style="padding:3px 8px;font-size:11px">Clean View</button>
          <button type="button" class="${PREFIX}x">X</button>
        </div>
      </div>
      <div class="${PREFIX}tabs">
        <button type="button" class="${PREFIX}tab on" data-t="challenges">Challenges</button>
        <button type="button" class="${PREFIX}tab" data-t="achievements">Achievements</button>
        <button type="button" class="${PREFIX}tab" data-t="lab">Lab</button>
        <button type="button" class="${PREFIX}tab" data-t="radio">Radio</button>
      </div>
      <div class="${PREFIX}body"></div>
    `;
    document.body.appendChild(panel);
    makeDraggable(panel, panel.querySelector("." + PREFIX + "hdr"));

    setupDraggableFab(fab, panel);
    applyFabPosition();
    window.addEventListener("resize", applyFabPosition);

    panel.querySelector("#" + PREFIX + "clean-btn").addEventListener("click", toggleCleanView);
    panel.querySelector("." + PREFIX + "x").addEventListener("click", () => panel.classList.remove("open"));
    panel.querySelectorAll("." + PREFIX + "tab").forEach((tab) => {
      tab.addEventListener("click", () => { activeTab = tab.getAttribute("data-t"); renderPanel(); });
    });

    // Global hotkeys
    window.addEventListener("keydown", (e) => {
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.code === "F8") { e.preventDefault(); toggleTimer(); }
      else if (e.code === "F9") { e.preventDefault(); resetRun(); }
      else if (e.altKey && e.code === "KeyR") {
        e.preventDefault();
        panel.classList.toggle("open");
        if (panel.classList.contains("open")) renderPanel();
      } else if (e.altKey && e.code === "KeyH") {
        e.preventDefault();
        toggleCleanView();
      } else if (e.altKey && e.code === "KeyM") {
        e.preventDefault();
        toggleRadioPlayPause();
      }
    }, true);

    function loop() {
      if (timerRunning) {
        const txt = formatTime(getCurrentTimerMs());
        const t1 = document.getElementById(PREFIX + "hud-time");
        const t2 = document.getElementById(PREFIX + "p-time");
        if (t1) t1.textContent = txt;
        if (t2) t2.textContent = txt;
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    applyVisualTheme();
    setTimeout(applyVisualTheme, 900);
    setTimeout(applyVisualTheme, 2200);
    updateHudDisplay();
    startCraftWatchers();
  }

  loadState(async () => {
    tracks = await loadTracksFromDb();
    mountUI();
  });
})();