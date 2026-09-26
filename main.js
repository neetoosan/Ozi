/**
 * Main 3D Game Engine for Ozioma Goodness Ezenyi's Love Website
 * Emotion-Driven Dynamic Experience + Daily Rotating Quotes + Push Notifications
 * Works globally with THREE.js, soundEngine, DAILY_QUOTES_ENGINE, and loveNotificationManager
 */

// ============================================================================
// Personalization Configuration for Ozioma Goodness Ezenyi
// ============================================================================
const CONFIG = {
  crushFullName: "Ozioma Goodness Ezenyi",
  crushName: "Ozioma",
  whatsappNumber: "2349055401776",
  moods: {
    // 💖 1. ROMANTIC & DREAMY
    romantic: {
      name: "Romantic",
      emoji: "💖",
      skyColor: 0x14052b,
      fogColor: 0x1c093a,
      ambientColor: 0xffd5e5,
      dirLightColor: 0xffe6f0,
      rimColor: 0xff4d8d,
      particleColor: 0xff75a0,
      particleSize: 0.45,
      letter: {
        p1: "Ozioma Goodness Ezenyi, my love for you runs deeper than the oceans and higher than all the stars in this sky.",
        p2: "You are the poetry in my thoughts and the gentle rhythm in my heartbeat. Walking through life with you by my side would be my greatest blessing.",
        highlight: "Will you make me the happiest person in the universe and be mine forever, Ozioma? 💖"
      },
      whatsappMessage: "Hey! 💖 I just finished your 3D Quest and found all 5 hearts! My mood today is Romantic & Dreamy ✨ And my answer is YES! Forever & always! 🥰 — Ozioma Goodness"
    },

    // 🌸 2. STRESSED / NEEDS COMFORT & WARMTH
    comfort: {
      name: "Need Comfort",
      emoji: "🌸",
      skyColor: 0x220c1e,
      fogColor: 0x2d1228,
      ambientColor: 0xffe4d6,
      dirLightColor: 0xffeedb,
      rimColor: 0xff9966,
      particleColor: 0xffc4a8,
      particleSize: 0.5,
      letter: {
        p1: "Ozioma Goodness Ezenyi, you work so hard and give so much love to the world, but today I want you to feel deeply cherished.",
        p2: "I want to be the one who brings you peace after a long day, the one who listens to your quietest thoughts, and holds your hand through everything.",
        highlight: "Will you let me love, protect, and stand by your side forever, Ozioma? 🌸"
      },
      whatsappMessage: "Hey! 🌸 I just finished your 3D Quest and found all 5 hearts! I was feeling a bit stressed/needed comfort, and your messages warmed my heart so much. My answer is YES! 🤍 — Ozioma"
    },

    // 🌟 3. JOYFUL & ENERGETIC
    joyful: {
      name: "Joyful",
      emoji: "🌟",
      skyColor: 0x1f0b3d,
      fogColor: 0x29104f,
      ambientColor: 0xfff0cc,
      dirLightColor: 0xfff6dd,
      rimColor: 0xffcc00,
      particleColor: 0xffd700,
      particleSize: 0.45,
      letter: {
        p1: "Ozioma, every single moment with you feels like an exciting adventure filled with pure sunshine!",
        p2: "Your joyful laugh is my favorite melody, and your happiness means everything to me. I want to celebrate you every single day, Goodness.",
        highlight: "Let's make countless magical memories together. Will you be mine forever, Ozioma? 🌟"
      },
      whatsappMessage: "Hey! 🌟 I just completed your 3D Quest! I'm feeling super joyful & energetic today! Loved every single reason, and my answer is YES! ✨💖 — Ozioma Goodness Ezenyi"
    },

    // 😜 4. PLAYFUL & MISCHIEVOUS
    playful: {
      name: "Playful",
      emoji: "😜",
      skyColor: 0x09142f,
      fogColor: 0x0f1c3f,
      ambientColor: 0xd4f0ff,
      dirLightColor: 0xe6f7ff,
      rimColor: 0x00d4ff,
      particleColor: 0xff3df2,
      particleSize: 0.5,
      letter: {
        p1: "Ozioma Goodness Ezenyi, you've completely conquered my thoughts, and honestly, I wouldn't have it any other way!",
        p2: "You bring so much fun, color, and laughter into my world. There's no escaping this—we're an unbeatable team, Ozi.",
        highlight: "Resistance is futile, Ozioma! Will you say YES and be my partner-in-crime forever? 😜💖"
      },
      whatsappMessage: "Hey! 😜 I just finished your 3D Quest and caught all 5 hearts! You're the real heart stealer here haha! My answer is YES! Partner in crime forever! 🎉💖 — Ozioma"
    }
  }
};

// Island Configurations (x, y, z, radius)
const islandConfigs = [
  { x: 0, y: 0, z: 0, r: 12 },       // Central Main Island (Top Y = 0.6)
  { x: -18, y: 2, z: -10, r: 7 },     // North-West Island (Top Y = 2.6)
  { x: 18, y: 3, z: -8, r: 7.5 },     // North-East Island (Top Y = 3.6)
  { x: -16, y: 1.5, z: 14, r: 6.5 },   // South-West Island (Top Y = 2.1)
  { x: 16, y: 2.5, z: 12, r: 7 }      // South-East Island (Top Y = 3.1)
];

// Connection Bridges / Stepping Stones
const connections = [
  { from: { x: 0, z: 0 }, to: { x: -18, z: -10 } },
  { from: { x: 0, z: 0 }, to: { x: 18, z: -8 } },
  { from: { x: 0, z: 0 }, to: { x: -16, z: 14 } },
  { from: { x: 0, z: 0 }, to: { x: 16, z: 12 } }
];

// Game State
const state = {
  currentMood: 'romantic',
  collectedHearts: 0,
  totalHearts: 5,
  collectedSet: new Set(),
  isGameActive: false,
  isModalOpen: false,
  stage: 1, // 1: Explore, 2: Citadel Finale
  keys: { forward: false, backward: false, left: false, right: false },
  joystickDir: { x: 0, y: 0 },
  // Jump & Gravity Physics State
  playerVelocityY: 0,
  isJumping: false,
  gravity: -24,
  jumpForce: 9.5,
  lastTouchTime: 0,
  todayReasons: []
};

// Three.js Core Variables
let scene, camera, renderer, clock;
let ambientLight, dirLight, rimLight;
let player, playerLight;
let collectibles = [];
let islands = [];
let particleSystems = [];
let fireworks = [];

// Dynamic Ground Height Calculator
function getGroundHeightAt(x, z) {
  let targetGroundY = -20;

  for (let cfg of islandConfigs) {
    const dist = Math.hypot(x - cfg.x, z - cfg.z);
    if (dist <= cfg.r) {
      const islandGround = cfg.y + 0.6 + 0.7;
      if (islandGround > targetGroundY) {
        targetGroundY = islandGround;
      }
    }
  }

  connections.forEach((conn) => {
    const steps = 4;
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const sx = THREE.MathUtils.lerp(conn.from.x, conn.to.x, t);
      const sz = THREE.MathUtils.lerp(conn.from.z, conn.to.z, t);
      const sy = 0.4 + Math.sin(t * Math.PI) * 0.8;

      const dist = Math.hypot(x - sx, z - sz);
      if (dist <= 1.6) {
        const stoneGround = sy + 0.2 + 0.7;
        if (stoneGround > targetGroundY) {
          targetGroundY = stoneGround;
        }
      }
    }
  });

  return targetGroundY;
}

// Initialization & Setup
function init() {
  if (typeof THREE === 'undefined') {
    console.error("Three.js not loaded yet. Retrying in 100ms...");
    setTimeout(init, 100);
    return;
  }

  const container = document.getElementById('canvas-container');
  if (!container) return;

  // 1. Initialize Daily Quotes Preview
  updateDailyQuoteBanner();
  refreshTodayReasons();

  // 2. Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(CONFIG.moods.romantic.skyColor);
  scene.fog = new THREE.FogExp2(CONFIG.moods.romantic.fogColor, 0.022);

  // 3. Camera
  camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 18, 26);

  // 4. Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  clock = new THREE.Clock();

  // 5. Lights
  setupLighting();

  // 6. Build 3D World (Floating Islands, Trees, Flowers, Collectibles)
  buildWorld();

  // 7. Create Player Star Avatar
  createPlayer();

  // 8. Ambient Particle Stars & Floating Elements
  createAmbientParticles();

  // 9. Event Listeners
  setupEventListeners();

  // 10. Start Render Loop
  animate();
}

function updateDailyQuoteBanner() {
  if (window.DAILY_QUOTES_ENGINE) {
    const today = window.DAILY_QUOTES_ENGINE.getTodayFeaturedQuote();
    const dateEl = document.getElementById('daily-quote-date');
    if (dateEl) dateEl.textContent = today.dateStr;
    const prevEl = document.getElementById('daily-quote-preview');
    if (prevEl) prevEl.textContent = `"${today.quote}"`;

    const modalDate = document.getElementById('quote-modal-date');
    if (modalDate) modalDate.textContent = `${today.dateStr} (Day #${today.dayNumber})`;
    const modalBody = document.getElementById('quote-modal-body');
    if (modalBody) modalBody.textContent = `"${today.quote}"`;
  }
}

function refreshTodayReasons() {
  if (window.DAILY_QUOTES_ENGINE) {
    state.todayReasons = window.DAILY_QUOTES_ENGINE.getTodayInGameHearts(state.currentMood);
  }
}

// Lighting Setup
function setupLighting() {
  const m = CONFIG.moods[state.currentMood];

  ambientLight = new THREE.AmbientLight(m.ambientColor, 0.75);
  scene.add(ambientLight);

  dirLight = new THREE.DirectionalLight(m.dirLightColor, 1.2);
  dirLight.position.set(20, 40, 20);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 150;
  const d = 35;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  scene.add(dirLight);

  rimLight = new THREE.DirectionalLight(m.rimColor, 0.85);
  rimLight.position.set(-20, 10, -20);
  scene.add(rimLight);
}

// 3D World Geometry Construction
function buildWorld() {
  islandConfigs.forEach((cfg) => {
    createFloatingIsland(cfg.x, cfg.y, cfg.z, cfg.r);
  });

  createSteppingStones();

  islandConfigs.forEach((cfg) => {
    decorateIsland(cfg.x, cfg.y, cfg.z, cfg.r);
  });

  const collectibleLocations = [
    { x: -18, y: 4.2, z: -10 },
    { x: 18, y: 5.2, z: -8 },
    { x: -16, y: 3.7, z: 14 },
    { x: 16, y: 4.7, z: 12 },
    { x: 0, y: 2.2, z: -8 }
  ];

  collectibleLocations.forEach((loc, index) => {
    createHeartCollectible(loc.x, loc.y, loc.z, index);
  });
}

function createFloatingIsland(x, y, z, radius) {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  const topGeo = new THREE.CylinderGeometry(radius, radius * 0.95, 1.2, 16);
  const topMat = new THREE.MeshStandardMaterial({
    color: 0x4a2366,
    roughness: 0.6,
    metalness: 0.1
  });
  const topMesh = new THREE.Mesh(topGeo, topMat);
  topMesh.receiveShadow = true;
  topMesh.castShadow = true;
  group.add(topMesh);

  const botGeo = new THREE.ConeGeometry(radius * 0.95, radius * 1.5, 12);
  const botMat = new THREE.MeshStandardMaterial({
    color: 0x1f0b33,
    roughness: 0.9
  });
  const botMesh = new THREE.Mesh(botGeo, botMat);
  botMesh.position.y = -radius * 0.75 - 0.6;
  botMesh.rotation.x = Math.PI;
  botMesh.castShadow = true;
  group.add(botMesh);

  const pLight = new THREE.PointLight(0xff75a0, 0.6, radius * 2.5);
  pLight.position.y = -2;
  group.add(pLight);

  scene.add(group);
  islands.push({ group, radius, x, y, z, light: pLight });
}

function createSteppingStones() {
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x6b3ba7, roughness: 0.5 });

  connections.forEach((conn) => {
    const steps = 4;
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const sx = THREE.MathUtils.lerp(conn.from.x, conn.to.x, t);
      const sz = THREE.MathUtils.lerp(conn.from.z, conn.to.z, t);
      const sy = 0.4 + Math.sin(t * Math.PI) * 0.8;

      const sGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.4, 8);
      const stone = new THREE.Mesh(sGeo, stoneMat);
      stone.position.set(sx, sy, sz);
      stone.castShadow = true;
      stone.receiveShadow = true;
      scene.add(stone);
    }
  });
}

function decorateIsland(ix, iy, iz, radius) {
  const treeCount = Math.floor(radius / 2);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2019 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0xff75a0, roughness: 0.4 });
  const leafMat2 = new THREE.MeshStandardMaterial({ color: 0xb19ffb, roughness: 0.4 });

  for (let i = 0; i < treeCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = (Math.random() * 0.65 + 0.15) * radius;
    const tx = ix + Math.cos(angle) * dist;
    const tz = iz + Math.sin(angle) * dist;

    if (Math.hypot(tx - ix, tz - iz) < 1.5 && ix === 0) continue;

    const treeGroup = new THREE.Group();
    treeGroup.position.set(tx, iy + 0.6, tz);

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.35, 1.8, 6), trunkMat);
    trunk.position.y = 0.9;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    const leaves = new THREE.Mesh(
      new THREE.ConeGeometry(1.4, 2.8, 6),
      i % 2 === 0 ? leafMat : leafMat2
    );
    leaves.position.y = 2.6;
    leaves.castShadow = true;
    treeGroup.add(leaves);

    scene.add(treeGroup);
  }
}

function createHeartCollectible(x, y, z, index) {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, 0);
  heartShape.bezierCurveTo(0, 0.5, -0.8, 1, -1.2, 0.5);
  heartShape.bezierCurveTo(-1.6, 0, -1.2, -0.8, 0, -1.6);
  heartShape.bezierCurveTo(1.2, -0.8, 1.6, 0, 1.2, 0.5);
  heartShape.bezierCurveTo(0.8, 1, 0, 0.5, 0, 0);

  const extrudeSettings = { depth: 0.4, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.15, bevelThickness: 0.15 };
  const geo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
  geo.center();

  const mat = new THREE.MeshStandardMaterial({
    color: 0xff3377,
    emissive: 0xff1a66,
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0.3
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.scale.set(0.6, 0.6, 0.6);
  mesh.castShadow = true;
  group.add(mesh);

  const pLight = new THREE.PointLight(0xff3377, 1.5, 6);
  group.add(pLight);

  scene.add(group);

  collectibles.push({
    group,
    mesh,
    light: pLight,
    index,
    x, y, z,
    collected: false,
    baseY: y
  });
}

function createPlayer() {
  player = new THREE.Group();
  const initialGround = getGroundHeightAt(0, 6);
  player.position.set(0, initialGround, 6);

  const geo = new THREE.IcosahedronGeometry(0.7, 1);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    emissive: 0xffaa00,
    emissiveIntensity: 0.8,
    roughness: 0.1,
    metalness: 0.5
  });
  const body = new THREE.Mesh(geo, mat);
  body.castShadow = true;
  player.add(body);

  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1a052e });
  const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), eyeMat);
  leftEye.position.set(-0.22, 0.15, 0.58);
  const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), eyeMat);
  rightEye.position.set(0.22, 0.15, 0.58);
  player.add(leftEye, rightEye);

  playerLight = new THREE.PointLight(0xffd700, 1.2, 8);
  playerLight.position.set(0, 0, 0);
  player.add(playerLight);

  scene.add(player);
}

function createAmbientParticles() {
  particleSystems.forEach(ps => scene.remove(ps));
  particleSystems = [];

  const m = CONFIG.moods[state.currentMood];
  const particleCount = 220;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 80;
    positions[i + 1] = Math.random() * 32 + 1;
    positions[i + 2] = (Math.random() - 0.5) * 80;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    size: m.particleSize || 0.45,
    color: m.particleColor,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  const pSystem = new THREE.Points(geo, mat);
  scene.add(pSystem);
  particleSystems.push(pSystem);
}

// Apply Mood Theme to 3D World in Real-Time
function applyMoodTheme(moodKey) {
  state.currentMood = moodKey;
  refreshTodayReasons();
  const m = CONFIG.moods[moodKey] || CONFIG.moods.romantic;

  if (scene) {
    scene.background = new THREE.Color(m.skyColor);
    scene.fog = new THREE.FogExp2(m.fogColor, 0.022);
  }

  if (ambientLight) ambientLight.color.setHex(m.ambientColor);
  if (dirLight) dirLight.color.setHex(m.dirLightColor);
  if (rimLight) rimLight.color.setHex(m.rimColor);

  createAmbientParticles();

  const hudEmoji = document.getElementById('hud-mood-emoji');
  if (hudEmoji) hudEmoji.textContent = m.emoji;
  const hudText = document.getElementById('hud-mood-text');
  if (hudText) hudText.textContent = m.name;

  if (window.soundEngine) {
    window.soundEngine.setMood(moodKey);
  }
}

// Trigger Jump Helper Action
function triggerPlayerJump() {
  if (!state.isJumping && state.isGameActive && !state.isModalOpen && state.stage === 1) {
    state.playerVelocityY = state.jumpForce;
    state.isJumping = true;
    if (window.soundEngine) {
      window.soundEngine.playJumpSFX();
    }
  }
}

function triggerCitadelFinale() {
  state.stage = 2;
  const m = CONFIG.moods[state.currentMood];

  const citadelGroup = new THREE.Group();
  citadelGroup.position.set(0, 1.2, -12);

  const altarGeo = new THREE.CylinderGeometry(5, 5.5, 1.5, 16);
  const altarMat = new THREE.MeshStandardMaterial({
    color: 0xff4d8d,
    emissive: 0xff2a70,
    emissiveIntensity: 0.5
  });
  const altar = new THREE.Mesh(altarGeo, altarMat);
  altar.castShadow = true;
  citadelGroup.add(altar);

  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, 0);
  heartShape.bezierCurveTo(0, 0.5, -0.8, 1, -1.2, 0.5);
  heartShape.bezierCurveTo(-1.6, 0, -1.2, -0.8, 0, -1.6);
  heartShape.bezierCurveTo(1.2, -0.8, 1.6, 0, 1.2, 0.5);
  heartShape.bezierCurveTo(0.8, 1, 0, 0.5, 0, 0);

  const extrudeSettings = { depth: 0.8, bevelEnabled: true, bevelSegments: 4, bevelSize: 0.25, bevelThickness: 0.25 };
  const hGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
  hGeo.center();

  const hMat = new THREE.MeshStandardMaterial({
    color: 0xff0055,
    emissive: 0xff0044,
    emissiveIntensity: 0.8,
    roughness: 0.1,
    metalness: 0.4
  });

  const giantHeart = new THREE.Mesh(hGeo, hMat);
  giantHeart.scale.set(2.2, 2.2, 2.2);
  giantHeart.position.y = 4.5;
  citadelGroup.add(giantHeart);

  const cLight = new THREE.PointLight(0xff0055, 3, 20);
  cLight.position.y = 4.5;
  citadelGroup.add(cLight);

  scene.add(citadelGroup);

  // Populate dynamic proposal love letter
  const letterP1 = document.getElementById('letter-para-1');
  if (letterP1) letterP1.textContent = m.letter.p1;
  const letterP2 = document.getElementById('letter-para-2');
  if (letterP2) letterP2.textContent = m.letter.p2;
  const letterHl = document.getElementById('letter-highlight-text');
  if (letterHl) letterHl.textContent = m.letter.highlight;

  smoothCameraMoveTo({ x: 0, y: 12, z: 4 }, { x: 0, y: 4, z: -12 }, 2500, () => {
    document.getElementById('proposal-modal').classList.remove('hidden');
    if (window.soundEngine) window.soundEngine.playVictoryFanfare();
  });

  setInterval(create3DFirework, 600);
}

function smoothCameraMoveTo(targetCamPos, lookAtPos, duration, onComplete) {
  const startCamPos = camera.position.clone();
  const startTime = performance.now();

  function updateCam() {
    const elapsed = performance.now() - startTime;
    const t = Math.min(elapsed / duration, 1);
    const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    camera.position.lerpVectors(startCamPos, new THREE.Vector3(targetCamPos.x, targetCamPos.y, targetCamPos.z), easeT);
    camera.lookAt(lookAtPos.x, lookAtPos.y, lookAtPos.z);

    if (t < 1) {
      requestAnimationFrame(updateCam);
    } else if (onComplete) {
      onComplete();
    }
  }

  updateCam();
}

function create3DFirework() {
  const count = 60;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const velocities = [];

  const originX = (Math.random() - 0.5) * 30;
  const originY = Math.random() * 10 + 12;
  const originZ = (Math.random() - 0.5) * 30 - 10;

  for (let i = 0; i < count; i++) {
    positions[i * 3] = originX;
    positions[i * 3 + 1] = originY;
    positions[i * 3 + 2] = originZ;

    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const speed = Math.random() * 0.35 + 0.15;

    velocities.push({
      x: Math.sin(phi) * Math.cos(theta) * speed,
      y: Math.cos(phi) * speed,
      z: Math.sin(phi) * Math.sin(theta) * speed
    });
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const colors = [0xff4d8d, 0xffd700, 0xb19ffb, 0xff75a0, 0x00d4ff];
  const mat = new THREE.PointsMaterial({
    size: 0.5,
    color: colors[Math.floor(Math.random() * colors.length)],
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending
  });

  const fwSystem = new THREE.Points(geo, mat);
  scene.add(fwSystem);

  fireworks.push({ system: fwSystem, velocities, age: 0, maxAge: 50 });
}

// Event Listeners
function setupEventListeners() {
  window.addEventListener('resize', onWindowResize);

  // Desktop Keyboard Listener (WASD + Space for Jump)
  window.addEventListener('keydown', (e) => {
    if (!state.isGameActive || state.isModalOpen) return;
    switch (e.key.toLowerCase()) {
      case 'w': case 'arrowup': state.keys.forward = true; break;
      case 's': case 'arrowdown': state.keys.backward = true; break;
      case 'a': case 'arrowleft': state.keys.left = true; break;
      case 'd': case 'arrowright': state.keys.right = true; break;
      case ' ': case 'spacebar':
        e.preventDefault();
        triggerPlayerJump();
        break;
    }
  });

  window.addEventListener('keyup', (e) => {
    switch (e.key.toLowerCase()) {
      case 'w': case 'arrowup': state.keys.forward = false; break;
      case 's': case 'arrowdown': state.keys.backward = false; break;
      case 'a': case 'arrowleft': state.keys.left = false; break;
      case 'd': case 'arrowright': state.keys.right = false; break;
    }
  });

  // Mobile Double Tap Listener
  window.addEventListener('touchstart', (e) => {
    if (!state.isGameActive || state.isModalOpen || state.stage !== 1) return;

    if (e.target.closest('#hud') || e.target.closest('.modal-card') || e.target.closest('#touch-controls') || e.target.closest('.glass-card')) {
      return;
    }

    const now = performance.now();
    const timeDiff = now - state.lastTouchTime;

    if (timeDiff > 30 && timeDiff < 350) {
      triggerPlayerJump();
    }
    state.lastTouchTime = now;
  }, { passive: true });

  // Mood Selector Cards Click Handler
  const moodCards = document.querySelectorAll('.mood-card');
  moodCards.forEach(card => {
    card.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playClickSFX();
      moodCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const selectedMood = card.getAttribute('data-mood');
      applyMoodTheme(selectedMood);
    });
  });

  // Daily Quote Banner & HUD Button Click Handler
  const openDailyQuote = () => {
    if (window.soundEngine) window.soundEngine.playClickSFX();
    updateDailyQuoteBanner();
    const modal = document.getElementById('daily-quote-modal');
    if (modal) modal.classList.remove('hidden');
  };

  const bannerTrigger = document.getElementById('daily-quote-trigger');
  if (bannerTrigger) bannerTrigger.addEventListener('click', openDailyQuote);

  const hudQuoteBtn = document.getElementById('hud-quote-btn');
  if (hudQuoteBtn) hudQuoteBtn.addEventListener('click', openDailyQuote);

  const closeQuote = () => {
    if (window.soundEngine) window.soundEngine.playClickSFX();
    const modal = document.getElementById('daily-quote-modal');
    if (modal) modal.classList.add('hidden');
  };

  const closeQuoteBtn = document.getElementById('close-quote-btn');
  if (closeQuoteBtn) closeQuoteBtn.addEventListener('click', closeQuote);

  const quoteModalCloseBtn = document.getElementById('quote-modal-close-btn');
  if (quoteModalCloseBtn) quoteModalCloseBtn.addEventListener('click', closeQuote);

  // Notification Reminder Permission Handlers
  const handleNotifEnable = async () => {
    if (window.soundEngine) window.soundEngine.playClickSFX();
    if (window.loveNotificationManager) {
      const granted = await window.loveNotificationManager.requestPermission();
      const notifBtn = document.getElementById('enable-notif-btn');
      if (notifBtn) {
        notifBtn.innerHTML = granted ? '<span>✅ Reminders Active (4x a day)</span>' : '<span>🔔 Enable Daily Love Reminders</span>';
      }
    }
  };

  const enableNotifBtn = document.getElementById('enable-notif-btn');
  if (enableNotifBtn) enableNotifBtn.addEventListener('click', handleNotifEnable);

  const hudNotifBtn = document.getElementById('hud-notif-btn');
  if (hudNotifBtn) hudNotifBtn.addEventListener('click', handleNotifEnable);

  // Dedicated Mobile Jump Button Event Listener
  const mobileJumpBtn = document.getElementById('mobile-jump-btn');
  if (mobileJumpBtn) {
    const handleMobileJump = (e) => {
      e.preventDefault();
      e.stopPropagation();
      triggerPlayerJump();
    };
    mobileJumpBtn.addEventListener('click', handleMobileJump);
    mobileJumpBtn.addEventListener('touchstart', handleMobileJump);
  }

  // Start Quest Action function
  const startQuestAction = () => {
    if (window.soundEngine) {
      window.soundEngine.playClickSFX();
      window.soundEngine.startMusic();
    }
    const overlay = document.getElementById('start-overlay');
    if (overlay) {
      overlay.classList.add('hidden');
      overlay.style.display = 'none';
    }
    const hud = document.getElementById('hud');
    if (hud) {
      hud.classList.remove('hidden');
    }

    if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
      const touchCtrl = document.getElementById('touch-controls');
      if (touchCtrl) touchCtrl.classList.remove('hidden');
      setupMobileJoystick();
    }

    state.isGameActive = true;
  };

  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', startQuestAction);
    startBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      startQuestAction();
    });
  }

  const musicBtn = document.getElementById('music-btn');
  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      if (window.soundEngine) {
        window.soundEngine.playClickSFX();
        const playing = window.soundEngine.toggleMusic();
        const icon = document.getElementById('music-icon');
        if (icon) icon.textContent = playing ? '🎵' : '🔇';
      }
    });
  }

  const closeCard = () => {
    if (window.soundEngine) window.soundEngine.playClickSFX();
    const modal = document.getElementById('card-modal');
    if (modal) modal.classList.add('hidden');
    state.isModalOpen = false;

    if (state.collectedHearts >= state.totalHearts && state.stage === 1) {
      const trans = document.getElementById('transition-modal');
      if (trans) trans.classList.remove('hidden');
    }
  };

  const closeCardBtn = document.getElementById('close-card-btn');
  if (closeCardBtn) closeCardBtn.addEventListener('click', closeCard);

  const cardContBtn = document.getElementById('card-continue-btn');
  if (cardContBtn) cardContBtn.addEventListener('click', closeCard);

  const transBtn = document.getElementById('trans-btn');
  if (transBtn) {
    transBtn.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playClickSFX();
      const trans = document.getElementById('transition-modal');
      if (trans) trans.classList.add('hidden');
      triggerCitadelFinale();
    });
  }

  const noBtn = document.getElementById('no-btn');
  if (noBtn) {
    const dodgeNoBtn = () => {
      const parentRect = noBtn.parentElement.getBoundingClientRect();
      const maxX = parentRect.width - noBtn.offsetWidth - 20;
      const maxY = parentRect.height - noBtn.offsetHeight - 20;

      const randomX = (Math.random() - 0.5) * maxX * 1.5;
      const randomY = (Math.random() - 0.5) * maxY * 1.5;

      noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
    };

    noBtn.addEventListener('mouseover', dodgeNoBtn);
    noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); dodgeNoBtn(); });
  }

  // YES! Proposal Button Click -> Open WhatsApp with Mood Message for Ozioma
  const yesBtn = document.getElementById('yes-btn');
  if (yesBtn) {
    yesBtn.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playVictoryFanfare();
      
      const propModal = document.getElementById('proposal-modal');
      if (propModal) propModal.classList.add('hidden');
      const celOverlay = document.getElementById('celebration-overlay');
      if (celOverlay) celOverlay.classList.remove('hidden');

      // WhatsApp Dynamic URL Construction
      const m = CONFIG.moods[state.currentMood] || CONFIG.moods.romantic;
      const waMsg = m.whatsappMessage;
      const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(waMsg)}`;

      // Update link on celebration screen
      const waShareBtn = document.getElementById('whatsapp-share-btn');
      if (waShareBtn) {
        waShareBtn.href = whatsappUrl;
      }

      // Automatically launch WhatsApp chat
      window.open(whatsappUrl, '_blank');
    });
  }

  const replayBtn = document.getElementById('replay-btn');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      location.reload();
    });
  }
}

function setupMobileJoystick() {
  const zone = document.getElementById('joystick-zone');
  const handle = document.getElementById('joystick-handle');
  if (!zone || !handle) return;

  let active = false;
  let startX = 0, startY = 0;

  zone.addEventListener('touchstart', (e) => {
    active = true;
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
  });

  zone.addEventListener('touchmove', (e) => {
    if (!active) return;
    const touch = e.touches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    const dist = Math.hypot(dx, dy);
    const maxDist = 40;

    const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(dist, maxDist);

    const hx = Math.cos(angle) * clampedDist;
    const hy = Math.sin(angle) * clampedDist;

    handle.style.transform = `translate(calc(-50% + ${hx}px), calc(-50% + ${hy}px))`;

    state.joystickDir.x = hx / maxDist;
    state.joystickDir.y = hy / maxDist;
  });

  const endJoystick = () => {
    active = false;
    handle.style.transform = 'translate(-50%, -50%)';
    state.joystickDir = { x: 0, y: 0 };
  };

  zone.addEventListener('touchend', endJoystick);
  zone.addEventListener('touchcancel', endJoystick);
}

function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  if (!clock) return;
  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  if (state.isGameActive && !state.isModalOpen && state.stage === 1) {
    updatePlayerMovement(delta);
  }

  if (player && player.children[0]) {
    player.children[0].rotation.y += 0.015;
    if (!state.isJumping) {
      player.children[0].position.y = Math.sin(time * 3) * 0.15;
    }
  }

  collectibles.forEach((c) => {
    if (!c.collected) {
      c.group.rotation.y += 0.02;
      c.group.position.y = c.baseY + Math.sin(time * 2.5 + c.index) * 0.25;

      if (player && state.stage === 1) {
        const dist = player.position.distanceTo(c.group.position);
        if (dist < 1.8) {
          collectHeart(c);
        }
      }
    }
  });

  particleSystems.forEach((ps) => {
    ps.rotation.y += 0.0005;
  });

  for (let i = fireworks.length - 1; i >= 0; i--) {
    const fw = fireworks[i];
    const pos = fw.system.geometry.attributes.position.array;

    for (let j = 0; j < fw.velocities.length; j++) {
      pos[j * 3] += fw.velocities[j].x;
      pos[j * 3 + 1] += fw.velocities[j].y;
      pos[j * 3 + 2] += fw.velocities[j].z;
      fw.velocities[j].y -= 0.004;
    }

    fw.system.geometry.attributes.position.needsUpdate = true;
    fw.age++;

    if (fw.age > fw.maxAge) {
      scene.remove(fw.system);
      fw.system.geometry.dispose();
      fw.system.material.dispose();
      fireworks.splice(i, 1);
    }
  }

  if (player && state.stage === 1 && camera) {
    const targetCamPos = new THREE.Vector3(
      player.position.x,
      player.position.y + 14,
      player.position.z + 18
    );
    camera.position.lerp(targetCamPos, 0.05);
    camera.lookAt(player.position.x, player.position.y, player.position.z);
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

function updatePlayerMovement(delta) {
  if (!player) return;
  const moveSpeed = 9.0 * delta;
  let moveX = 0;
  let moveZ = 0;

  if (state.keys.forward) moveZ -= 1;
  if (state.keys.backward) moveZ += 1;
  if (state.keys.left) moveX -= 1;
  if (state.keys.right) moveX += 1;

  if (state.joystickDir.x !== 0 || state.joystickDir.y !== 0) {
    moveX = state.joystickDir.x;
    moveZ = state.joystickDir.y;
  }

  if (moveX !== 0 || moveZ !== 0) {
    const dir = new THREE.Vector3(moveX, 0, moveZ).normalize();
    player.position.x += dir.x * moveSpeed;
    player.position.z += dir.z * moveSpeed;

    const angle = Math.atan2(dir.x, dir.z);
    player.rotation.y = THREE.MathUtils.lerp(player.rotation.y, angle, 0.2);

    player.position.x = THREE.MathUtils.clamp(player.position.x, -26, 26);
    player.position.z = THREE.MathUtils.clamp(player.position.z, -22, 22);
  }

  const currentGroundY = getGroundHeightAt(player.position.x, player.position.z);

  if (state.isJumping || player.position.y > currentGroundY + 0.1 || currentGroundY <= -10) {
    state.playerVelocityY += state.gravity * delta;
    player.position.y += state.playerVelocityY * delta;

    if (player.position.y <= currentGroundY && currentGroundY > -10 && state.playerVelocityY <= 0) {
      player.position.y = currentGroundY;
      state.playerVelocityY = 0;
      state.isJumping = false;
    }
  } else if (!state.isJumping && currentGroundY > -10) {
    player.position.y = THREE.MathUtils.lerp(player.position.y, currentGroundY, 0.25);
  }

  if (player.position.y < -12) {
    const respawnGround = getGroundHeightAt(0, 6);
    player.position.set(0, respawnGround, 6);
    state.playerVelocityY = 0;
    state.isJumping = false;
  }
}

function collectHeart(item) {
  item.collected = true;
  scene.remove(item.group);

  if (window.soundEngine) window.soundEngine.playHeartCollectSFX();

  state.collectedHearts++;
  const countEl = document.getElementById('collected-count');
  if (countEl) countEl.textContent = state.collectedHearts;

  // Use today's dynamically loaded reason
  const reason = state.todayReasons[item.index] || {
    number: `Heart #${item.index + 1}`,
    emoji: "💖",
    heading: "A Beautiful Reason",
    text: "You make every day brighter, Ozioma!"
  };

  if (reason) {
    const numEl = document.getElementById('card-number');
    if (numEl) numEl.textContent = reason.number;
    const emojiEl = document.getElementById('card-emoji');
    if (emojiEl) emojiEl.textContent = reason.emoji;
    const headEl = document.getElementById('card-heading');
    if (headEl) headEl.textContent = reason.heading;
    const textEl = document.getElementById('card-text');
    if (textEl) textEl.textContent = reason.text;
  }

  const modal = document.getElementById('card-modal');
  if (modal) modal.classList.remove('hidden');
  state.isModalOpen = true;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
