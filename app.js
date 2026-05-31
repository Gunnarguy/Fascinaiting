const ASSET_VERSION = "20260531c";

function forceFreshStylesheet() {
  const versionedHref = `styles.css?v=${ASSET_VERSION}`;
  const hasVersionedSheet = Array.from(document.styleSheets).some((sheet) => {
    try {
      return sheet.href && sheet.href.includes(versionedHref);
    } catch {
      return false;
    }
  });

  if (hasVersionedSheet) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = versionedHref;
  document.head.appendChild(link);
}

forceFreshStylesheet();

// Project Metadata for the Fascinaiting multi-repo showcase
const PROJECTS = [
  {
    id: "orhub",
    tag: "ops",
    title: "ORHub",
    status: "active",
    statusClass: "pulse",
    desc: "SwiftUI operations console for live operating-room activity, combining a status dashboard, an interactive 2D floor map, and a LiDAR-backed AR overlay.",
    tech: ["SwiftUI", "WebSockets", "REST API", "RealityKit", "LiDAR"],
    stats: {
      "Surface Modes": "Live hub + map + AR overlay",
      "Data Feeds": "REST and WebSocket room updates",
      "Clinical Context": "VA operating-room visibility",
      "Device Target": "LiDAR iPhone/iPad for AR",
    },
    features: [
      "Live room-state dashboard with connectivity indicators and drill-in detail views.",
      "Tappable 2D floor-plan visualization shading rooms by current status.",
      "RealityKit overlay that anchors room telemetry to a LiDAR scan.",
      "Launch-time endpoint switching between bundled sample data and live services.",
    ],
    diagram: `[REST + WebSocket feeds] ──> [Shared AppState] ──> [Live Hub + Floor Map]
                                                     │
                                                     ▼
                                            [RealityKit AR Overlay]`,
    link: "https://github.com/Gunnarguy/ORHub",
    linkLabel: "View ORHub Source",
  },
  {
    id: "pushapp",
    tag: "native",
    title: "PushApp",
    status: "active",
    statusClass: "pulse",
    desc: "Production-grade iOS implementation of the Pushscroll concept: block addictive apps with Screen Time shields, then require camera-verified push-ups to unlock them.",
    tech: [
      "SwiftUI",
      "Vision",
      "FamilyControls",
      "ManagedSettings",
      "SwiftData",
    ],
    stats: {
      "Unlock Loop": "Camera-verified push-up reps",
      "OS Hooks": "FamilyControls + DeviceActivity",
      Architecture: "3-extension Screen Time stack",
      "Language Mode": "Swift 6 strict concurrency",
    },
    features: [
      "Pose-validation state machine built on VNDetectHumanBodyPoseRequest.",
      "Native iOS shields and activity monitors that relock apps after earned time expires.",
      "Analytics-ready architecture spanning the full restriction-to-reward funnel.",
      "End-to-end SwiftUI product surface instead of a prototype or concept demo.",
    ],
    diagram: `[Blocked apps] ──> [FamilyControls Shield] ──> [Vision Pose Validator]
                                                      │
                                                      ▼
                                             [Earned Unlock Minutes]`,
    link: "https://github.com/Gunnarguy/PushApp",
    linkLabel: "View PushApp Source",
  },
  {
    id: "linkedout",
    tag: "sandbox",
    title: "LinkedOut",
    status: "streaming",
    statusClass: "pulse",
    desc: "Swipe-based job discovery app that ingests listings from five remote boards, scores them with LLMs against a user profile, and ranks the best matches in a native iOS deck.",
    tech: ["SwiftUI", "FastAPI", "Gemini", "OpenAI", "Render"],
    stats: {
      "Job Sources": "5 remote APIs",
      "Ranking Layer": "Gemini / OpenAI scoring",
      "Client UX": "Swipe deck + saved matches",
      Backend: "FastAPI dedup and ingest",
    },
    features: [
      "Aggregates roles from Remotive, Himalayas, HN, Jobicy, and RemoteOK.",
      "Deduplicates inbound listings before LLM relevance scoring runs.",
      "Packages the results into a native swipe UI instead of a static job board.",
      "Keeps the matching logic open to prompt tuning and profile experimentation.",
    ],
    diagram: `[5 job APIs] ──> [Dedup + Ingest Pipeline] ──> [LLM Match Score]
                                              │
                                              ▼
                                     [Native Swipe Deck]`,
    link: "https://github.com/Gunnarguy/LinkedOut",
    linkLabel: "View LinkedOut Source",
  },
  {
    id: "chickenplans",
    tag: "ops",
    title: "ChickenPlans",
    status: "active",
    statusClass: "pulse",
    desc: "Live-data weekend planner built for dog-friendly exploration, combining maps, Overpass API discovery, GPX imports, weather-aware scheduling, and Fi collar context.",
    tech: ["Python", "Flask", "Leaflet", "Overpass API", "Fi"],
    stats: {
      "Map Stack": "Leaflet explorer UI",
      Discovery: "Overpass API live queries",
      Planner: "Weather-aware trip scheduler",
      "Dog Signal": "Fi collar telemetry",
    },
    features: [
      "Interactive map for trails, parks, dog parks, boutiques, and weekend stops.",
      "Zero-hardcoded discovery driven by live POI queries instead of a static list.",
      "Imports GPX or CSV history and renders elevation-aware adventure context.",
      "Adds dog-first details like leash rules, off-leash status, and pet suitability.",
    ],
    diagram: `[Overpass API + GPX] ──> [Flask Planner] ──> [Leaflet Explorer]
                                                 │
                                                 ▼
                                       [Dog-friendly trip picks]`,
    link: "https://github.com/Gunnarguy/ChickenPlans",
    linkLabel: "View ChickenPlans Source",
  },
  {
    id: "ddg-pct",
    tag: "ops",
    title: "DDG-PCT Mission Control",
    status: "ready",
    statusClass: "blue",
    desc: "Interactive planning dashboard for a Burney Falls to Castle Crags PCT section hike, turning an original route document into GPS-accurate logistics and daily visual breakdowns.",
    tech: ["Vite", "GPX", "Elevation Data", "Maps", "Planning"],
    stats: {
      "Route Span": "Burney Falls to Castle Crags",
      "Plan Length": "52 miles over 6 days",
      "Source Input": "Original hike planning doc",
      Focus: "GPS-accurate logistics",
    },
    features: [
      "Transforms a family planning document into a navigable mission-control dashboard.",
      "Tracks day-by-day mileage, route segments, and terrain expectations.",
      "Keeps logistics grounded in GPX-derived route data instead of rough estimates.",
      "Packages a personal outdoor plan like an operational briefing tool.",
    ],
    diagram: `[Planning doc + GPX] ──> [Route Visualizer] ──> [Daily breakdown]
                                                   │
                                                   ▼
                                        [Logistics + elevation checks]`,
    link: "https://github.com/Gunnarguy/DDG-PCT",
    linkLabel: "View DDG-PCT Source",
  },
  {
    id: "audio-clean-check",
    tag: "native",
    title: "AudioCleanCheck",
    status: "active",
    statusClass: "pulse",
    desc: "Guided microphone quality tester for iPhone, iPad, and Apple Watch that compares before-and-after recordings to quantify whether cleaning the ports improved clarity.",
    tech: ["Vite", "Web Audio", "DSP", "Drag and Drop", "Apple Watch"],
    stats: {
      "Test Flow": "Before / after recording compare",
      "Output Lock": "Built-in speakers enforced",
      Modes: "iPhone + Apple Watch panels",
      Delivery: "Vite web interface",
    },
    features: [
      "Guided workflow for generating a repeatable before-and-after microphone test.",
      "Locks the Mac output path to prevent AirPods or external devices from skewing the result.",
      "Includes a dedicated Apple Watch path for importing and comparing voice memos.",
      "Surfaces audible cleanliness changes as a measurable frequency-response difference.",
    ],
    diagram: `[Reference signal] ──> [Before/After recordings] ──> [Frequency comparison]
                                                      │
                                                      ▼
                                             [Cleaning delta]`,
    link: "https://github.com/Gunnarguy/audio-clean-check",
    linkLabel: "View AudioCleanCheck Source",
  },
  {
    id: "visionbud",
    tag: "sandbox",
    title: "VisionBud",
    status: "dormant",
    statusClass: "orange",
    desc: "Edge computer vision experiments for Raspberry Pi and Apple hardware, focused on live object tracking, YOLO inference, and hardware-triggered automation loops.",
    tech: ["Python", "OpenCV", "YOLOv8", "Raspberry Pi", "CoreML"],
    stats: {
      Runtime: "Realtime edge inference",
      Hardware: "Pi 4 + Apple Silicon",
      Loop: "Object detection and triggers",
      Focus: "Computer-vision automation",
    },
    features: [
      "Realtime camera parsing with OpenCV pre-processing and accelerated inference paths.",
      "YOLO-driven object detection loops tuned for lightweight edge environments.",
      "GPIO or automation trigger flow based on matched objects in the camera frame.",
      "Explores the boundary between hobby robotics and practical local AI utilities.",
    ],
    diagram: `[Camera feed] ──> [OpenCV prep] ──> [YOLOv8 inference]
                                            │
                                            ▼
                                 [Trigger or automation output]`,
    link: "https://github.com/Gunnarguy/VisionBud",
    linkLabel: "View VisionBud Source",
  },
  {
    id: "wowca",
    tag: "native",
    title: "Classic Era Assistant",
    status: "ready",
    statusClass: "blue",
    desc: "Offline-first item and spell database for Classic Era, shipping a SwiftUI client plus a reproducible data pipeline that generates the app's local SQLite bundle.",
    tech: ["SwiftUI", "SQLite", "Offline Search", "visionOS", "Data Pipeline"],
    stats: {
      Mode: "Offline-first game reference",
      Platforms: "iOS, iPadOS, visionOS",
      "Data Store": "Generated SQLite bundle",
      Lookup: "Instant local search",
    },
    features: [
      "Keeps a large item and spell corpus available with zero network dependency.",
      "Pairs the native client with a rebuildable content pipeline instead of hand-managed data.",
      "Targets Apple platforms beyond iPhone, including iPad and visionOS.",
      "Treats a game companion app with the same rigor as a serious utility product.",
    ],
    diagram: `[Game data pipeline] ──> [SQLite bundle] ──> [SwiftUI reference client]
                                                     │
                                                     ▼
                                            [Offline search + lookup]`,
    link: "https://github.com/Gunnarguy/WoWCA",
    linkLabel: "View Classic Era Assistant",
  },
  {
    id: "warcraftlogs",
    tag: "native",
    title: "WarcraftLogs Client",
    status: "ready",
    statusClass: "blue",
    desc: "Native iOS client for browsing WarcraftLogs raid data with OAuth, biometrics, bookmarks, widgets, and share-extension entry points.",
    tech: ["SwiftUI", "OAuth", "WidgetKit", "Biometrics", "Notifications"],
    stats: {
      Auth: "OAuth + Face ID / Touch ID",
      "Entry Points": "App, widget, share extension",
      Focus: "Raid-log browsing",
      Platform: "Native iOS",
    },
    features: [
      "Wraps WarcraftLogs browsing in native navigation rather than a plain web wrapper.",
      "Adds authentication hardening through biometrics and session handling.",
      "Supports bookmarks and recents for faster return to active logs.",
      "Extends the experience with widgets, notifications, and URL share intake.",
    ],
    diagram: `[WarcraftLogs API] ──> [OAuth session] ──> [Native browse + bookmarks]
                                                  │
                                                  ▼
                                         [Widgets + share extension]`,
    link: "https://github.com/Gunnarguy/WarcraftLogs",
    linkLabel: "View WarcraftLogs Source",
  },
];

// Simulated Terminal Engine
class TerminalSimulator {
  constructor(elementId, inputId) {
    this.body = document.getElementById(elementId);
    this.input = document.getElementById(inputId);
    this.history = [];
    this.historyIndex = -1;

    this.commands = {
      help: {
        desc: "List all available terminal commands",
        action: () => this.showHelp(),
      },
      about: {
        desc: "Print information about the systems creator",
        action: () => this.showAbout(),
      },
      projects: {
        desc: "Print the current showcase matrix",
        action: () => this.showProjects(),
      },
      telemetry: {
        desc: "Read showcase telemetry and repo signals",
        action: () => this.showTelemetry(),
      },
      clear: {
        desc: "Clear console terminal history lines",
        action: () => this.clear(),
      },
      ping: {
        desc: "Send network ping request to host servers",
        action: () => this.ping(),
      },
    };

    this.init();
  }

  init() {
    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const cmdText = this.input.value.trim();
        this.execute(cmdText);
        this.input.value = "";
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex];
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          this.input.value = "";
        }
      }
    });

    // Print initial welcome banner
    this.printWelcome();
  }

  writeLine(text, cssClass = "") {
    const line = document.createElement("div");
    line.className = `term-line ${cssClass}`;
    line.innerHTML = text;
    this.body.insertBefore(line, this.body.lastElementChild);
    this.body.scrollTop = this.body.scrollHeight;
  }

  printWelcome() {
    this.writeLine(
      "Initializing Fascinaiting Core v3.5...",
      "term-output-system",
    );
    this.writeLine(
      "System Status: <span class='term-output-green'>ONLINE</span>",
      "term-output-system",
    );
    this.writeLine("Local Memory Indexing: Complete", "term-output-system");
    this.writeLine("--------------------------------------------");
    this.writeLine(
      "Welcome to the multi-repo systems showcase.",
      "term-output-accent",
    );
    this.writeLine(
      "Type <span class='term-output-accent'>help</span> to view available operations, or click project cards on the right.",
    );
    this.writeLine("--------------------------------------------");
  }

  execute(cmdString) {
    if (!cmdString) return;

    this.writeLine(`$ ${cmdString}`, "term-output-info");
    this.history.push(cmdString);
    this.historyIndex = this.history.length;

    const tokens = cmdString.toLowerCase().split(" ");
    const baseCmd = tokens[0];

    if (this.commands[baseCmd]) {
      this.commands[baseCmd].action(tokens.slice(1));
    } else {
      this.writeLine(
        `Command not found: '${baseCmd}'. Type 'help' for support.`,
        "term-output-error",
      );
    }
  }

  showHelp() {
    this.writeLine("Available Operations:", "term-output-accent");
    for (const [name, info] of Object.entries(this.commands)) {
      this.writeLine(
        `  <span class='term-output-green'>${name.padEnd(12)}</span> - ${info.desc}`,
      );
    }
  }

  showAbout() {
    this.writeLine("CREATOR: Gunnar Hostetler", "term-output-accent");
    this.writeLine(
      "NIGHTS : Building Swift apps, ops dashboards, and weirdly practical prototypes.",
    );
    this.writeLine(
      "DAYS   : Hospital Operations & Stryker intraoperative VA specialist.",
    );
    this.writeLine(
      "GOAL   : Ship original software that feels specific, useful, and unmistakably mine.",
    );
    this.writeLine(
      "GitHub : <a href='https://github.com/Gunnarguy' target='_blank' style='color:#00f2fe;'>github.com/Gunnarguy</a>",
    );
  }

  showProjects() {
    this.writeLine("FETCHING LOCAL REPOS DATA...", "term-output-system");
    this.writeLine(
      "-------------------------------------------------------------------------------------",
      "term-output-system",
    );
    this.writeLine(
      " PROJECT NAME             │ CATEGORY             │ STATUS     │ TECH",
      "term-output-system",
    );
    this.writeLine(
      "----------------──────────┼──────────────────────┼────────────┼──────────────────────",
      "term-output-system",
    );
    PROJECTS.forEach((p) => {
      const title = p.title.padEnd(24).substring(0, 24);
      const tag = p.tag.padEnd(20).substring(0, 20);
      const status = p.status.toUpperCase().padEnd(10).substring(0, 10);
      const mainTech = p.tech[0] + ", " + p.tech[1];
      this.writeLine(` ${title} │ ${tag} │ ${status} │ ${mainTech}`);
    });
    this.writeLine(
      "-------------------------------------------------------------------------------------",
      "term-output-system",
    );
  }

  showTelemetry() {
    const cpu = Math.floor(Math.random() * 25) + 5;
    const memory = (Math.random() * 2 + 1.2).toFixed(1);
    const temp = Math.floor(Math.random() * 15) + 38;
    this.writeLine("READING SHOWCASE TELEMETRY...", "term-output-system");
    this.writeLine(
      `  [Ops Dashboards]     : 3 indexed (ORHub, ChickenPlans, DDG-PCT)`,
      "term-output-info",
    );
    this.writeLine(
      `  [Native Clients]     : 4 indexed (PushApp, AudioCleanCheck, WoWCA, WCL)`,
      "term-output-info",
    );
    this.writeLine(
      `  [Sandbox Queue]      : 2 staged (LinkedOut, VisionBud)`,
      "term-output-info",
    );
    this.writeLine(
      `  [Remote Feeds]       : job APIs, GPX routes, and OR sockets nominal`,
      "term-output-info",
    );
    this.writeLine(
      `  [Host CPU Engine]    : ${cpu}% active dashboard load`,
      "term-output-info",
    );
    this.writeLine(
      `  [Memory Cache]       : ${memory} MB indexed metadata`,
      "term-output-info",
    );
    this.writeLine(
      `  [Core Temperature]   : ${temp}°C (ANE passive)`,
      "term-output-info",
    );

    // Randomly update stats bar values in UI
    updateStatsWidget(cpu, memory);
  }

  ping() {
    this.writeLine(
      "PING github.com (140.82.112.3): 56 data bytes",
      "term-output-info",
    );
    let i = 0;
    const interval = setInterval(() => {
      const time = (Math.random() * 15 + 18).toFixed(1);
      this.writeLine(
        `64 bytes from 140.82.112.3: icmp_seq=${i} ttl=57 time=${time} ms`,
      );
      i++;
      if (i >= 4) {
        clearInterval(interval);
        this.writeLine(
          "--- github.com ping statistics ---",
          "term-output-info",
        );
        this.writeLine(
          "4 packets transmitted, 4 received, 0% packet loss",
          "term-output-info",
        );
        this.writeLine(
          "rtt min/avg/max = 18.2/23.4/34.9 ms",
          "term-output-info",
        );
      }
    }, 150);
  }

  clear() {
    // Remove all child nodes except the last element (which is the input line container)
    while (this.body.children.length > 1) {
      this.body.removeChild(this.body.firstChild);
    }
  }
}

// Global UI Update Handlers
let terminal;

document.addEventListener("DOMContentLoaded", () => {
  // Initial UI Elements
  terminal = new TerminalSimulator("terminalBody", "terminalInput");

  // Initial telemetry bar load
  setTimeout(() => {
    updateStatsWidget(8, 2.1);
  }, 500);

  // Initial project grid render
  renderProjects("all");

  // Event listeners
  setupFilters();
  setupModal();
  setupShortcuts();
});

// Setup Tags Filter
function setupFilters() {
  const filterTags = document.querySelectorAll(".filter-tag");
  filterTags.forEach((tag) => {
    tag.addEventListener("click", () => {
      filterTags.forEach((t) => t.classList.remove("active"));
      tag.classList.add("active");

      const category = tag.dataset.category;
      renderProjects(category);
      terminal.writeLine(
        `$ filter-grid --category=${category}`,
        "term-output-info",
      );
    });
  });
}

// Render Project Grid
function renderProjects(category) {
  const grid = document.getElementById("projectGrid");
  grid.innerHTML = "";

  const filtered =
    category === "all" ? PROJECTS : PROJECTS.filter((p) => p.tag === category);

  filtered.forEach((p) => {
    const card = document.createElement("div");
    card.className = `project-card ${p.status === "active" || p.status === "streaming" ? "active-run" : ""}`;
    card.dataset.id = p.id;

    const techHTML = p.tech
      .map((t) => `<span class="tech-tag">${t}</span>`)
      .join("");

    card.innerHTML = `
            <div class="card-top">
                <div class="project-meta">
                    <span class="project-tag-pill">${p.tag.replace("-", " ")}</span>
                    <h3 class="project-title">${p.title}</h3>
                </div>
                <div class="project-status-indicator">
                    <span class="led ${p.statusClass} ${p.status === "active" || p.status === "streaming" ? "pulse" : ""}"></span>
                    <span>${p.status}</span>
                </div>
            </div>
            <p class="project-desc">${p.desc}</p>
            <div class="project-tech-stack">
                ${techHTML}
            </div>
            <div class="card-footer">
                <span>click for details</span>
                <span class="card-footer-action">Diagnostics ↗</span>
            </div>
        `;

    card.addEventListener("click", () => openProjectModal(p.id));
    grid.appendChild(card);
  });
}

// Setup Modal details popup
function setupModal() {
  const overlay = document.getElementById("modalOverlay");
  const closeBtn = document.getElementById("modalCloseBtn");

  closeBtn.addEventListener("click", () => {
    overlay.classList.remove("active");
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("active");
    }
  });
}

// Open Detail Drawer popup
function openProjectModal(projectId) {
  const p = PROJECTS.find((item) => item.id === projectId);
  if (!p) return;

  // Log terminal action
  terminal.writeLine(
    `[SYSTEM] FETCHING TELEMETRY FOR ${p.title.toUpperCase()}... SUCCESS.`,
    "term-output-system",
  );
  terminal.writeLine(
    `[SYSTEM] OPENING DIAGNOSTICS FOR ${p.id.toUpperCase()}`,
    "term-output-info",
  );

  const overlay = document.getElementById("modalOverlay");

  // Fill content
  document.getElementById("modalHeaderTag").textContent = p.tag.replace(
    "-",
    " ",
  );
  document.getElementById("modalHeaderTitle").textContent = p.title;
  document.getElementById("modalHeaderStatusText").innerHTML = `
        <span class="led ${p.statusClass} ${p.status === "active" || p.status === "streaming" ? "pulse" : ""}"></span>
        Status: ${p.status}
    `;

  // Fill Stats
  const statsContainer = document.getElementById("modalStatsGrid");
  statsContainer.innerHTML = "";
  for (const [key, value] of Object.entries(p.stats)) {
    statsContainer.innerHTML += `
            <div class="detail-item">
                <div class="detail-item-label">${key}</div>
                <div class="detail-item-value">${value}</div>
            </div>
        `;
  }

  // Fill Features
  const featuresContainer = document.getElementById("modalFeaturesList");
  featuresContainer.innerHTML = p.features
    .map(
      (f) => `
        <div class="key-feature">${f}</div>
    `,
    )
    .join("");

  // Fill Architecture Diagram
  document.getElementById("modalArchitectureBox").textContent = p.diagram;

  // Set Actions
  const actionBtn = document.getElementById("modalActionBtn");
  actionBtn.href = p.link;
  actionBtn.textContent = p.linkLabel;
  if (p.link.includes("apps.apple.com")) {
    actionBtn.className = "btn btn-accent";
  } else {
    actionBtn.className = "btn btn-primary";
  }

  // Activate overlay
  overlay.classList.add("active");
}

// Setup Quick Shortcut Panel Buttons
function setupShortcuts() {
  const buttons = document.querySelectorAll(".shortcut-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const command = btn.dataset.command;
      terminal.execute(command);
    });
  });
}

// Update local telemetry bar graphics
function updateStatsWidget(cpuValue, memoryValue) {
  const cpuBar = document.getElementById("cpuBar");
  const cpuVal = document.getElementById("cpuValueText");
  const memBar = document.getElementById("memBar");
  const memVal = document.getElementById("memValueText");

  if (cpuBar && cpuVal) {
    cpuBar.style.width = `${cpuValue}%`;
    cpuVal.textContent = `${cpuValue}%`;
  }

  if (memBar && memVal) {
    // Calculate percent
    const percent = ((memoryValue / 8.0) * 100).toFixed(0);
    memBar.style.width = `${percent}%`;
    memVal.textContent = `${memoryValue} GB / 8.0 GB`;
  }
}
