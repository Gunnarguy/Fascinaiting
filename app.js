// Project Metadata for the Fascinaiting AI & Edge Dashboard
const PROJECTS = [
    {
        id: "portfolio-main",
        tag: "portfolio",
        title: "Portfolio Homepage",
        status: "active",
        statusClass: "pulse",
        desc: "Your personal professional resume site, highlighting surgical operations context and native iOS app development. Features custom dynamic GitHub contribution grids and SVG tree ring charts.",
        tech: ["HTML5", "CSS3", "JavaScript", "GitHub Pages", "Git Stratigraphy"],
        stats: {
            "Host Platform": "GitHub Pages (gunnarguy.me)",
            "Visualizations": "Tree Rings & Heatmaps",
            "Embeddings Mode": "Text-embedding-ada-002",
            "Performance": "100/100 Lighthouse score"
        },
        features: [
            "Displays dynamic, all-time commit frequency heatmap using custom fetch wrappers.",
            "Renders SVGs depicting repo lifespan rings ('tree rings') from static workflow JSONs.",
            "Contains complete clinical narratives bridging hospital operations and software development.",
            "Fully responsive glassmorphism aesthetic tailored for technical recruiters."
        ],
        diagram: `[Portfolio Copy] ──> [Dynamic Chunker] ──> [Text Embeddings (OpenAI)]
                                                    │
                                                    ▼
[User Matcher] ──> [Semantic Search Engine] <── [Vector Database]`,
        link: "https://gunnarguy.me",
        linkLabel: "Explore Portfolio Site"
    },
    {
        id: "portfolio-narrative",
        tag: "portfolio",
        title: "Narrative & Experience",
        status: "ready",
        statusClass: "blue",
        desc: "Deep dive into your professional story as Stryker's on-site intraoperative specialist at Stanford VA in Palo Alto, coordinating clinical tech and surgical teams.",
        tech: ["Surgical Systems", "Stakeholder Relations", "Hospital Logistics", "Autonomy"],
        stats: {
            "Location Context": "Palo Alto VA Hospital",
            "Affiliated School": "Stanford Orthopedic Residency",
            "Operational Autonomy": "100% Solo site lead",
            "Primary Specialty": "Intraoperative technology support"
        },
        features: [
            "Acts as the first line of defense for critical surgical equipment readiness.",
            "Manages turnaround reliability and repair pipelines under intense time constraints.",
            "Navigates vendor relations, procurement pressure, and high-variability workflows.",
            "Translates hospital system safety checklists into clean, predictable software design."
        ],
        diagram: `[Hospital Operations] ──> [Equipment Turnaround] ──> [Surgeon Checklists]
                                                                  │
                                                                  ▼
[Predictable Code] <─── [Autonomy & Critical Focus] <─── [Clinical Safety Rules]`,
        link: "https://gunnarguy.me#about",
        linkLabel: "Read Profile Narrative"
    },
    {
        id: "gunzino-studio",
        tag: "gunzino",
        title: "Gunzino App Store Portal",
        status: "active",
        statusClass: "pulse",
        desc: "Landing site and publisher registry for shipped native iOS/macOS developer utilities. Serves support documentation, legal notices, and direct App Store links.",
        tech: ["HTML5", "Vanilla CSS", "Google Tag Manager", "App Store Connect"],
        stats: {
            "Host Platform": "GitHub Pages (gunzino.me)",
            "Published Apps": "5 shipped App Store titles",
            "Search Engine Opt": "SEO semantic headers",
            "Compliance": "App Store review privacy rules"
        },
        features: [
            "Aggregates overview cards and descriptive summaries for all active app releases.",
            "Maintains standard support links, privacy policies, and user manuals.",
            "Features responsive grids with unique linear color palettes highlighting each utility.",
            "Integrated analytics logs capturing landing interest securely."
        ],
        diagram: `[App Store Connect] ──> [Privacy & Terms Compliance] ──> [Support Registry]
                                                                        │
                                                                        ▼
[Analytics telemetry] <──── [SEO Optimized Landing Page] <──── [User Inquiries]`,
        link: "https://gunzino.me",
        linkLabel: "View Shipped Catalog"
    },
    {
        id: "gunzino-intelligence",
        tag: "gunzino",
        title: "OpenIntelligence Portal",
        status: "active",
        statusClass: "pulse",
        desc: "Flagship on-device local document search and OCR app. Fully offline Swift/CoreML vector embedding engine generating early App Store revenue.",
        tech: ["Swift", "SwiftUI", "CoreML", "Apple Intelligence", "OCR Vision"],
        stats: {
            "Processing Mode": "100% Offline / Airplane Mode",
            "First Release": "February 2026 (Live)",
            "Token Boundary": "Dynamic recursive token loop",
            "Total Earnings": "$190+ recorded to date"
        },
        features: [
            "Locally parses, chunks, and embeds text/images on-device.",
            "Leverages CoreML vector space embedding generation for offline semantics.",
            "Recursive reasoning bypasses standard 4,096 SLM token boundaries.",
            "Advanced hybrid routingEscalates reasoning dynamically to remote models."
        ],
        diagram: `[Ingested Image] ──> [OCR Vision Pipeline] ──> [Vector Embedding Store]
                                                                          │
                                                                          ▼
[Query Text Input] ──> [Apple Intelligence Router] ──> [Local Semantic Context]`,
        link: "https://gunzino.me/openintelligence",
        linkLabel: "View OpenIntelligence App"
    },
    {
        id: "gunzino-responses",
        tag: "gunzino",
        title: "OpenResponses Portal",
        status: "streaming",
        statusClass: "pulse",
        desc: "WebSocket-driven OpenAI API playground, integrating real-time speech responses, FastAPI local host agents, and Model Context Protocol tools.",
        tech: ["SwiftUI", "OpenAI WebSockets", "FastAPI Daemon", "MCP Transport"],
        stats: {
            "Connection Latency": "~45ms streaming connection",
            "API Protocol": "JSON-RPC over websocket stdio",
            "Agent Integration": "FastAPI localhost loopback",
            "Running Services": "Client UI & FastAPI agent host"
        },
        features: [
            "Establishes a persistent bidirectional speech/text pipeline with LLM backends.",
            "Executes local keystrokes, screenshots, and shell scripts via FastAPI helper daemon.",
            "Acts as a custom MCP host exposing Notion database and local editor integrations.",
            "Passed rigid App Store review checks for developer playground utilities."
        ],
        diagram: `[OpenResponses Client] <═══(WebSocket Streaming)═══> [Real-time Agent APIs]
         │                                                          │
         └───> [Local MCP Server] ──> [Notion & Shell Script Integrations] ┘`,
        link: "https://gunzino.me/openresponses",
        linkLabel: "View OpenResponses App"
    },
    {
        id: "gunzino-cone",
        tag: "gunzino",
        title: "OpenCone Portal",
        status: "ready",
        statusClass: "blue",
        desc: "Lightweight mobile Pinecone Vector Database client featuring REST API connectivity and lightweight on-device query embed models.",
        tech: ["Swift", "SwiftUI", "Pinecone REST API", "Keychain Secure"],
        stats: {
            "Query Latency": "~90ms remote vector search",
            "Minimum OS Version": "iOS 17.0+ Native Swift",
            "Storage Solution": "Keychain SecureSettingsStore",
            "Data Provider": "Pinecone Serverless index"
        },
        features: [
            "Direct API connection enabling mobile CRUD vector index operations.",
            "Encodes local document segments and queries before uploading.",
            "Exposes interactive views for managing index namespaces and metadata values.",
            "Clean, scrollable layout designed for direct JSON payload inspection."
        ],
        diagram: `[User Text Note] ──> [On-device Vector Embedder] ──> [Pinecone REST API]
                                                                  │
                                                                  ▼
[Search Query] ─────> [Semantic Vector Query] ─────> [Metadata Matching]`,
        link: "https://gunzino.me/opencone",
        linkLabel: "View OpenCone App"
    },
    {
        id: "linkedin-profile",
        tag: "linkedin",
        title: "LinkedIn Profile",
        status: "connected",
        statusClass: "pulse",
        desc: "Direct link to Gunnar Hostetler on LinkedIn. Access professional recommendations, Stryker product certifications, surgical specialties, and career updates.",
        tech: ["Networking", "Professional Brand", "Resume Sync", "Advising"],
        stats: {
            "Platform URL": "linkedin.com/in/gunnar-hostetler",
            "Connections Count": "Professional medical & tech",
            "Authored Posts": "iOS development progression logs",
            "Certifications": "Stryker Orthopedic Tech Specs"
        },
        features: [
            "Highlights detailed trajectory from surgical clinical support to iOS development.",
            "Lists verified recommendations from surgical technicians and Stanford residents.",
            "Maintains record of product safety compliances and account audits.",
            "Documents transition milestones shipping live App Store products."
        ],
        diagram: `[Clinical Operations] ──> [Stryker Certs] ──> [Verified Recommendations]
                                                                │
                                                                ▼
[Career Transitions] <──── [App Store Deployments] <──── [LinkedIn Network Connect]`,
        link: "https://www.linkedin.com/in/gunnar-hostetler/",
        linkLabel: "View LinkedIn Profile"
    },
    {
        id: "linkedin-experience",
        tag: "linkedin",
        title: "Clinical Operations Experience",
        status: "ready",
        statusClass: "blue",
        desc: "Professional history managing Stryker intraoperative equipment, Stanford surgical resident relationships, and procurement pipelines at the VA Hospital in Palo Alto.",
        tech: ["Surgical Systems", "VA Procurement", "Stryker Specialist", "Safety Protocols"],
        stats: {
            "Primary Location": "Palo Alto VA Hospital",
            "Specialty Focus": "Intraoperative orthopedic tech",
            "Team Integration": "Stanford Orthopedic Surgery",
            "Process Auditing": "Zero equipment failures"
        },
        features: [
            "Provides real-time troubleshooting inside sterile operating suites.",
            "Coordinates multi-million dollar surgical equipment kits across cases.",
            "Ensures patient safety protocols are adhered to during setup and turnover.",
            "Operates independently without local supervisors on-site."
        ],
        diagram: `[Surgeon Requests] ──> [Sterile Suite Setup] ──> [Intraoperative Troubleshoot]
                                                                  │
                                                                  ▼
[Account Health] <──── [Procurement Auditing] <──── [Autonomous Logistics lead]`,
        link: "https://www.linkedin.com/in/gunnar-hostetler/",
        linkLabel: "View Career History"
    },
    {
        id: "linkedout-concept",
        tag: "linkedin",
        title: "LinkedOut/LunkedIn Concepts",
        status: "ready",
        statusClass: "blue",
        desc: "Swipe-based job hunting concepts connecting remote databases and scoring relevance locally. Part of your ongoing experimentation with recruitment matching flows.",
        tech: ["SwiftUI", "Job Boards API", "LLM Evaluation", "Gesture UI"],
        stats: {
            "Repository Status": "Open-Source Sandbox",
            "AI Evaluator": "Embeddings & Semantic matching",
            "Interface Style": "Card-deck swipe gestures",
            "Sync Mode": "REST API caching"
        },
        features: [
            "Pulls fresh software engineering listings from multiple public REST endpoints.",
            "Processes job descriptions through LLM models to score compatibility.",
            "Provides an intuitive card UI allowing swift saving or discarding.",
            "Stores matching results in offline local caches for quick navigation."
        ],
        diagram: `[Public Job APIs] ──> [Local Content Parser] ──> [Semantic LLM Score]
                                                                 │
                                                                 ▼
[Saved Listings Cache] <── [Tinder Swipe Gesture UI] <── [Relevance Rank Filter]`,
        link: "https://github.com/Gunnarguy/LinkedOut",
        linkLabel: "Explore Sandbox Source"
    }
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
                action: () => this.showHelp()
            },
            about: {
                desc: "Print information about the systems creator",
                action: () => this.showAbout()
            },
            projects: {
                desc: "Print active AI development status dashboard",
                action: () => this.showProjects()
            },
            telemetry: {
                desc: "Read simulated system resources and model loads",
                action: () => this.showTelemetry()
            },
            clear: {
                desc: "Clear console terminal history lines",
                action: () => this.clear()
            },
            ping: {
                desc: "Send network ping request to host servers",
                action: () => this.ping()
            }
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
        this.writeLine("Initializing Fascinaiting Core v3.5...", "term-output-system");
        this.writeLine("System Status: <span class='term-output-green'>ONLINE</span>", "term-output-system");
        this.writeLine("Local Memory Indexing: Complete", "term-output-system");
        this.writeLine("--------------------------------------------");
        this.writeLine("Welcome to the AI Experiment Workspace.", "term-output-accent");
        this.writeLine("Type <span class='term-output-accent'>help</span> to view available operations, or click project cards on the right.");
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
            this.writeLine(`Command not found: '${baseCmd}'. Type 'help' for support.`, "term-output-error");
        }
    }

    showHelp() {
        this.writeLine("Available Operations:", "term-output-accent");
        for (const [name, info] of Object.entries(this.commands)) {
            this.writeLine(`  <span class='term-output-green'>${name.padEnd(12)}</span> - ${info.desc}`);
        }
    }

    showAbout() {
        this.writeLine("CREATOR: Gunnar Hostetler", "term-output-accent");
        this.writeLine("NIGHTS : Building Swift/SwiftUI apps, LLM pipelines, and automation tools.");
        this.writeLine("DAYS   : Hospital Operations & Stryker intraoperative VA specialist.");
        this.writeLine("GOAL   : Designing lightweight, highly-optimized on-device AI architectures.");
        this.writeLine("GitHub : <a href='https://github.com/Gunnarguy' target='_blank' style='color:#00f2fe;'>github.com/Gunnarguy</a>");
    }

    showProjects() {
        this.writeLine("FETCHING LOCAL REPOS DATA...", "term-output-system");
        this.writeLine("-------------------------------------------------------------------------------------", "term-output-system");
        this.writeLine(" PROJECT NAME             │ CATEGORY             │ STATUS     │ TECH", "term-output-system");
        this.writeLine("----------------──────────┼──────────────────────┼────────────┼──────────────────────", "term-output-system");
        PROJECTS.forEach(p => {
            const title = p.title.padEnd(24).substring(0, 24);
            const tag = p.tag.padEnd(20).substring(0, 20);
            const status = p.status.toUpperCase().padEnd(10).substring(0, 10);
            const mainTech = p.tech[0] + ", " + p.tech[1];
            this.writeLine(` ${title} │ ${tag} │ ${status} │ ${mainTech}`);
        });
        this.writeLine("-------------------------------------------------------------------------------------", "term-output-system");
    }

    showTelemetry() {
        const cpu = Math.floor(Math.random() * 25) + 5;
        const memory = (Math.random() * 2 + 1.2).toFixed(1);
        const temp = Math.floor(Math.random() * 15) + 38;
        this.writeLine("READING SENSORS & HUB TELEMETRY...", "term-output-system");
        this.writeLine(`  [Portfolio Ping]     : gunnarguy.me (online, ~18ms latency)`, "term-output-info");
        this.writeLine(`  [App Studio Status]  : gunzino.me (active, TLS 1.3)`, "term-output-info");
        this.writeLine(`  [LinkedIn Sync]      : API connection active (rate limits OK)`, "term-output-info");
        this.writeLine(`  [Embeddings Vector]  : Text-embedding-ada-002 loaded`, "term-output-info");
        this.writeLine(`  [Host CPU Engine]    : ${cpu}% active dashboard load`, "term-output-info");
        this.writeLine(`  [Memory Cache]       : ${memory} MB indexed metadata`, "term-output-info");
        this.writeLine(`  [Core Temperature]   : ${temp}°C (ANE passive)`, "term-output-info");
        
        // Randomly update stats bar values in UI
        updateStatsWidget(cpu, memory);
    }

    ping() {
        this.writeLine("PING gunzino.me (104.21.34.82): 56 data bytes", "term-output-info");
        let i = 0;
        const interval = setInterval(() => {
            const time = (Math.random() * 15 + 18).toFixed(1);
            this.writeLine(`64 bytes from 104.21.34.82: icmp_seq=${i} ttl=57 time=${time} ms`);
            i++;
            if (i >= 4) {
                clearInterval(interval);
                this.writeLine("--- gunzino.me ping statistics ---", "term-output-info");
                this.writeLine("4 packets transmitted, 4 received, 0% packet loss", "term-output-info");
                this.writeLine("rtt min/avg/max = 18.2/23.4/34.9 ms", "term-output-info");
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
    filterTags.forEach(tag => {
        tag.addEventListener("click", () => {
            filterTags.forEach(t => t.classList.remove("active"));
            tag.classList.add("active");
            
            const category = tag.dataset.category;
            renderProjects(category);
            terminal.writeLine(`$ filter-grid --category=${category}`, "term-output-info");
        });
    });
}

// Render Project Grid
function renderProjects(category) {
    const grid = document.getElementById("projectGrid");
    grid.innerHTML = "";
    
    const filtered = category === "all" 
        ? PROJECTS 
        : PROJECTS.filter(p => p.tag === category);

    filtered.forEach(p => {
        const card = document.createElement("div");
        card.className = `project-card ${p.status === 'active' || p.status === 'streaming' ? 'active-run' : ''}`;
        card.dataset.id = p.id;
        
        const techHTML = p.tech.map(t => `<span class="tech-tag">${t}</span>`).join("");
        
        card.innerHTML = `
            <div class="card-top">
                <div class="project-meta">
                    <span class="project-tag-pill">${p.tag.replace("-", " ")}</span>
                    <h3 class="project-title">${p.title}</h3>
                </div>
                <div class="project-status-indicator">
                    <span class="led ${p.statusClass} ${p.status === 'active' || p.status === 'streaming' ? 'pulse' : ''}"></span>
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
    const p = PROJECTS.find(item => item.id === projectId);
    if (!p) return;

    // Log terminal action
    terminal.writeLine(`[SYSTEM] FETCHING TELEMETRY FOR ${p.title.toUpperCase()}... SUCCESS.`, "term-output-system");
    terminal.writeLine(`[SYSTEM] OPENING DIAGNOSTICS FOR ${p.id.toUpperCase()}`, "term-output-info");

    const overlay = document.getElementById("modalOverlay");
    
    // Fill content
    document.getElementById("modalHeaderTag").textContent = p.tag.replace("-", " ");
    document.getElementById("modalHeaderTitle").textContent = p.title;
    document.getElementById("modalHeaderStatusText").innerHTML = `
        <span class="led ${p.statusClass} ${p.status === 'active' || p.status === 'streaming' ? 'pulse' : ''}"></span>
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
    featuresContainer.innerHTML = p.features.map(f => `
        <div class="key-feature">${f}</div>
    `).join("");

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
    buttons.forEach(btn => {
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
