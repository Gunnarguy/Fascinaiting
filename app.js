const ASSET_VERSION = "20260531d";

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

// Public presence routes for the Fascinaiting hub
const PROJECTS = [
  {
    id: "portfolio-main",
    tag: "portfolio",
    title: "Portfolio Homepage",
    status: "active",
    statusClass: "pulse",
    desc: "The main professional portfolio: first-person career story, healthcare operations context, and the most relevant shipped software work.",
    tech: ["Portfolio", "Career Narrative", "Case Studies", "GitHub Pages"],
    stats: {
      "Primary URL": "gunnarguy.me",
      "Audience": "Recruiters, collaborators, hiring teams",
      "Signal": "Clinical ops plus iOS/AI shipping proof",
      "Best Entry": "Start here",
    },
    features: [
      "Frames Gunnar's work through healthcare operations, shipped iOS apps, and practical AI tooling.",
      "Keeps the polished public case studies in one place instead of exposing every side experiment.",
      "Links out to App Store, GitHub, and contact surfaces from the cleaner main portfolio.",
      "Serves as the default link for anyone who needs the full professional context quickly.",
    ],
    diagram: "[Visitor] -> [Portfolio homepage] -> [Career story + selected shipped work]\n                                  |\n                                  v\n                           [Contact / GitHub / App Store]",
    link: "https://gunnarguy.me",
    linkLabel: "Open Portfolio",
  },
  {
    id: "portfolio-narrative",
    tag: "portfolio",
    title: "Narrative & Background",
    status: "ready",
    statusClass: "blue",
    desc: "A direct route into the professional narrative: operating-room support, on-site ownership, and how that turned into software building.",
    tech: ["Healthcare Ops", "iOS", "AI Tooling", "Writing"],
    stats: {
      "Context": "OR support and surgical workflows",
      "Role Signal": "High-agency builder",
      "Tone": "Concrete, first-person, lived-in",
      "Use Case": "Background before outreach calls",
    },
    features: [
      "Highlights the real hospital workflow context behind the software work.",
      "Explains the transition from clinical technical support into self-directed app development.",
      "Keeps the public story focused on useful constraints instead of novelty projects.",
      "Works as a quick credibility layer before deeper portfolio review.",
    ],
    diagram: "[Clinical work] -> [Workflow pain points] -> [Software projects]\n                                      |\n                                      v\n                              [Clear public narrative]",
    link: "https://gunnarguy.me#about",
    linkLabel: "Read Background",
  },
  {
    id: "gunzino-catalog",
    tag: "apps",
    title: "Gunzino App Catalog",
    status: "active",
    statusClass: "pulse",
    desc: "The cleaner app-facing portal for shipped app pages, support docs, privacy pages, and product-specific links.",
    tech: ["App Store", "Support", "Privacy", "Static Site"],
    stats: {
      "Primary URL": "gunzino.me",
      "Purpose": "App support and release surfaces",
      "Visibility": "Public, polished app pages",
      "Content Policy": "Show shipped apps, not every experiment",
    },
    features: [
      "Routes visitors to app pages that are intended to be public.",
      "Keeps privacy, support, and product metadata in a clean app catalog.",
      "Separates polished app surfaces from private or offbeat sandbox work.",
      "Gives App Review and users stable support URLs.",
    ],
    diagram: "[App user] -> [Gunzino catalog] -> [Support / privacy / app pages]\n                                 |\n                                 v\n                         [Public product surfaces only]",
    link: "https://gunzino.me",
    linkLabel: "Open Gunzino",
  },
  {
    id: "github-profile",
    tag: "career",
    title: "GitHub Profile",
    status: "connected",
    statusClass: "pulse",
    desc: "A source-code route for people who want activity, repos, and implementation evidence without making this page a raw experiment directory.",
    tech: ["GitHub", "Source Review", "Commits", "Public Repos"],
    stats: {
      "Primary URL": "github.com/Gunnarguy",
      "Best For": "Technical validation",
      "Scope": "Public repositories only",
      "Positioning": "Evidence, not a landing page",
    },
    features: [
      "Keeps source-code discovery available for technical reviewers.",
      "Avoids turning Fascinaiting into a showcase of every small or unfinished repo.",
      "Lets visitors self-select into deeper code review if they actually want it.",
      "Preserves the portfolio as the main narrative surface.",
    ],
    diagram: "[Reviewer] -> [GitHub profile] -> [Repos + commit history]\n                              |\n                              v\n                       [Technical evidence layer]",
    link: "https://github.com/Gunnarguy",
    linkLabel: "Open GitHub",
  },
  {
    id: "linkedin-profile",
    tag: "career",
    title: "LinkedIn Profile",
    status: "connected",
    statusClass: "pulse",
    desc: "The professional-network route for experience, endorsements, work history, and outreach.",
    tech: ["LinkedIn", "Career", "Experience", "Outreach"],
    stats: {
      "Primary URL": "linkedin.com/in/gunnar-hostetler",
      "Best For": "Recruiters and professional contacts",
      "Signal": "Work history and network context",
      "Action": "Connect or message",
    },
    features: [
      "Gives hiring and networking contacts the conventional professional profile.",
      "Keeps work history and recommendations on the platform people expect.",
      "Complements the portfolio without duplicating every detail.",
      "Provides a straightforward contact path.",
    ],
    diagram: "[Professional contact] -> [LinkedIn] -> [Experience + messaging]\n                                   |\n                                   v\n                              [Outreach path]",
    link: "https://www.linkedin.com/in/gunnar-hostetler/",
    linkLabel: "Open LinkedIn",
  },
  {
    id: "contact-route",
    tag: "career",
    title: "Contact Route",
    status: "ready",
    statusClass: "blue",
    desc: "A direct path to contact details and the main portfolio contact section without exposing side-project clutter.",
    tech: ["Email", "Portfolio", "Outreach", "Availability"],
    stats: {
      "Primary URL": "gunnarguy.me#contact",
      "Best For": "Direct outreach",
      "Surface": "Portfolio contact section",
      "Noise Level": "Low",
    },
    features: [
      "Routes serious outreach to the portfolio contact section.",
      "Keeps this page focused as a compact directory instead of a resume replacement.",
      "Avoids sending people into unfinished or overly specific experiment pages.",
      "Pairs naturally with LinkedIn and GitHub for follow-up context.",
    ],
    diagram: "[Visitor] -> [Contact route] -> [Email / LinkedIn / portfolio]\n                                |\n                                v\n                         [Low-friction next step]",
    link: "https://gunnarguy.me#contact",
    linkLabel: "Go to Contact",
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
        desc: "Print the current presence routes",
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
      "Welcome to the public presence hub.",
      "term-output-accent",
    );
    this.writeLine(
      "Type <span class='term-output-accent'>help</span> to view available operations, or choose a route on the right.",
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
      "NIGHTS : Building shipped iOS apps and practical AI tools.",
    );
    this.writeLine(
      "DAYS   : Hospital Operations & Stryker intraoperative VA specialist.",
    );
    this.writeLine(
      "GOAL   : Keep the public trail clear, specific, and useful.",
    );
    this.writeLine(
      "GitHub : <a href='https://github.com/Gunnarguy' target='_blank' style='color:#00f2fe;'>github.com/Gunnarguy</a>",
    );
  }

  showProjects() {
    this.writeLine("FETCHING PUBLIC ROUTES...", "term-output-system");
    this.writeLine(
      "-------------------------------------------------------------------------------------",
      "term-output-system",
    );
    this.writeLine(
      " ROUTE NAME               │ CATEGORY             │ STATUS     │ CONTEXT",
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
    this.writeLine("READING PRESENCE HUB TELEMETRY...", "term-output-system");
    this.writeLine(
      `  [Portfolio Routes]  : 2 indexed (homepage, narrative)`,
      "term-output-info",
    );
    this.writeLine(
      `  [App Surface]       : 1 catalog route (Gunzino)`,
      "term-output-info",
    );
    this.writeLine(
      `  [Career Links]      : 3 routes (GitHub, LinkedIn, contact)`,
      "term-output-info",
    );
    this.writeLine(
      `  [Public Scope]      : polished surfaces only`,
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
