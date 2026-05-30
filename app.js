// Project Metadata for the Fascinaiting AI Dashboard
const PROJECTS = [
    {
        id: "openintelligence",
        tag: "on-device-ml",
        title: "OpenIntelligence Engine",
        status: "active",
        statusClass: "pulse",
        desc: "Local, fully offline RAG stack for iOS 18 featuring on-device OCR ingestion, private Apple Intelligence routing, and local CoreML vector space embedding generation.",
        tech: ["Swift", "SwiftUI", "CoreML", "Apple Intelligence", "OCR Vision"],
        stats: {
            "Latency Profile": "~180ms local lookup",
            "Target Model": "Llama-3-3B-Instruct (local)",
            "Storage Overhead": "<120MB offline engine",
            "Privacy Mode": "100% Airplane Mode Safe"
        },
        features: [
            "Fully offline local embedding generation & retrieval using CoreML vector spaces.",
            "Vision-based document scanning that extracts text and structures files directly into the Local Vault.",
            "Dynamic Apple Intelligence reasoning router that decides whether to process queries locally or escalate.",
            "Custom recursive token window bypass pushing through standard 4,096 SLM token boundaries."
        ],
        diagram: `[Ingested Document/Image] ──> [OCR Vision Pipeline] ──> [Vector Embedding Store (CoreML)]
                                                                               │
                                                                               ▼
[Query Text Input] ─────> [Apple Intelligence Router] ─────> [Local Semantic Context]`,
        link: "https://github.com/Gunnarguy/RAGMLCore",
        linkLabel: "View Source on GitHub"
    },
    {
        id: "openresponses",
        tag: "ai-agents",
        title: "OpenResponses Agent Client",
        status: "streaming",
        statusClass: "pulse",
        desc: "Real-time streaming desktop assistant client utilizing OpenAI WebSocket APIs, model-driven computer-use automation, and local Model Context Protocol integrations.",
        tech: ["SwiftUI", "OpenAI WebSocket", "Computer Use", "FastAPI", "MCP"],
        stats: {
            "WebSocket Latency": "~45ms stream response",
            "Model Compatibility": "GPT-4o & Claude 3.5 Sonnet",
            "Running Daemon": "FastAPI Agent host",
            "Active Ports": "localhost:8000 (Local API)"
        },
        features: [
            "Persistent WebSocket audio/text connection providing instant streaming LLM interfaces.",
            "Computer Use daemon executing automated screen captures, keyboard strokes, and mouse navigation.",
            "Hosts custom local Model Context Protocol (MCP) endpoints connecting system tools.",
            "Parallel model stream analyzer comparing performance across multiple LLM backends concurrently."
        ],
        diagram: `[OpenResponses Client] <═══(WebSocket Streaming)═══> [Real-time Agent APIs]
         │                                                          │
         └───> [Local MCP Server] ──> [Notion & Shell Script Integrations] ┘`,
        link: "https://github.com/Gunnarguy/OpenResponses",
        linkLabel: "View Source on GitHub"
    },
    {
        id: "plaudblender",
        tag: "pipelines",
        title: "PlaudBlender Core",
        status: "idle",
        statusClass: "orange",
        desc: "Automated voice intelligence pipeline transforming raw recordings from Plaud devices into searchable, structured semantic knowledge graphs in Qdrant.",
        tech: ["Python", "Gemini 1.5 Pro", "Qdrant Vector DB", "MCP", "Docker"],
        stats: {
            "Processing Speed": "10x transcribing speed",
            "Vector Database": "Qdrant (Cloud/Local)",
            "Active Pipelines": "Audio Webhook Listener",
            "MCP Integration": "11 custom tools exposed"
        },
        features: [
            "Automatic webhook capture of raw audio transcripts from Plaud Cloud APIs.",
            "Multimodal audio-native intelligence with Gemini 1.5 Pro for entity-relation extraction.",
            "Structured graph schema creation storing nodes and directional relation vectors in Qdrant.",
            "Exposes knowledge graph nodes as an 11-tool Model Context Protocol server for local LLMs."
        ],
        diagram: `[Plaud Audio File] ──> [Gemini Audio Processing] ──> [Graph Schema Mapper]
                                                                        │
                                                                        ▼
[Claude Desktop Client] <─── (MCP Protocol) ─── [11-Tool Server] <─── [Qdrant DB]`,
        link: "https://github.com/Gunnarguy/PlaudBlender",
        linkLabel: "View Source on GitHub"
    },
    {
        id: "opencone",
        tag: "on-device-ml",
        title: "OpenCone Vector Client",
        status: "ready",
        statusClass: "blue",
        desc: "Swift client managing Pinecone databases directly from mobile devices, featuring local embedding models, semantic search, and RAG namespace control.",
        tech: ["Swift", "SwiftUI", "Pinecone DB", "Vector Space", "REST API"],
        stats: {
            "HTTP Request Time": "~90ms vector query",
            "Index Provider": "Pinecone Serverless",
            "Minimum OS": "iOS 17.0+ Native",
            "Embedding Model": "On-Device Mobile Embed"
        },
        features: [
            "Clean, direct connection to Pinecone Vector DB REST APIs from native Swift code.",
            "On-device lightweight embedding models encoding query string before remote lookup.",
            "Interactive system for editing namespace contents and exploring document metadata values.",
            "Optimized payload inspection layout rendering JSON variables in a clean, scrollable interface."
        ],
        diagram: `[User Text Note] ──> [On-device Vector Embedder] ──> [Pinecone REST API]
                                                                  │
                                                                  ▼
[Search Query] ─────> [Semantic Vector Query] ─────> [Metadata Matching]`,
        link: "https://apps.apple.com/us/app/opencone/id6744467668",
        linkLabel: "View on App Store"
    },
    {
        id: "mcpservers",
        tag: "ai-agents",
        title: "MCP Core Servers",
        status: "connected",
        statusClass: "pulse",
        desc: "Custom Model Context Protocol servers enabling LLM clients to safely read/write workspace documents, manage Notion databases, and trigger shell scripts.",
        tech: ["TypeScript", "Node.js", "JSON-RPC", "Notion API", "Shell Control"],
        stats: {
            "Active Protocols": "JSON-RPC over stdio",
            "Running Servers": "3 custom servers",
            "Client Interface": "Claude Desktop / Cursor",
            "Safety Layer": "Regex-bounded write access"
        },
        features: [
            "Notion MCP server supporting database query searches, item additions, and block edits.",
            "Local file editor server featuring safety limits that block system directory access.",
            "CLI command execution server streaming output logs back into the model context in real-time.",
            "Fully compliant with the Anthropic Model Context Protocol specification."
        ],
        diagram: `[Claude Desktop Client / Cursor IDE]
             │ (stdio JSON-RPC protocol)
             ▼
     [Local MCP Host]
      ├── [Notion Server] ───> [External Notion API]
      └── [System Controller] ─> [Restricted Workspace Files]`,
        link: "https://github.com/Gunnarguy/notion-mcp-server",
        linkLabel: "View Server Source"
    },
    {
        id: "visionbud",
        tag: "pipelines",
        title: "VisionBud & Automations",
        status: "dormant",
        statusClass: "orange",
        desc: "Edge computer vision and real-time object tracking scripts running on Raspberry Pi and Apple hardware, featuring YOLO integration.",
        tech: ["Python", "OpenCV", "YOLOv8", "Raspberry Pi", "Apple Silicon"],
        stats: {
            "Framerate Target": "30 FPS Edge Detection",
            "Inference Speed": "~15ms on Neural Engine",
            "Hardware platform": "Raspberry Pi 4 / Apple Mac",
            "Neural Engine Use": "CoreML converted YOLOv8"
        },
        features: [
            "Real-time video frame parsing utilizing OpenCV and hardware acceleration wrappers.",
            "Raspberry Pi GPIO control triggers executing hardware switches upon targeted object detection.",
            "Embedded video stream analyzer reporting bounding coordinates via lightweight JSON API.",
            "YOLOv8-Nano model translations optimized for Apple Silicon Neural Engine processors."
        ],
        diagram: `[Camera Feed Input] ──> [OpenCV Frame Prep] ──> [YOLOv8 Inference (ANE)]
                                                                  │
                                                                  ▼
[Mechanical Output] <─── [GPIO Signal Trigger] <─── [Object Match Detected]`,
        link: "https://github.com/Gunnarguy",
        linkLabel: "View GitHub Profile"
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
        this.writeLine("----------------------------------------------------------------", "term-output-system");
        this.writeLine(" PROJECT NAME            │ CATEGORY        │ STATUS     │ TECH", "term-output-system");
        this.writeLine("----------------─────────┼─────────────────┼────────────┼───────────────────", "term-output-system");
        PROJECTS.forEach(p => {
            const title = p.title.padEnd(23).substring(0, 23);
            const tag = p.tag.padEnd(15).substring(0, 15);
            const status = p.status.toUpperCase().padEnd(10).substring(0, 10);
            const mainTech = p.tech[0] + ", " + p.tech[1];
            this.writeLine(` ${title} │ ${tag} │ ${status} │ ${mainTech}`);
        });
        this.writeLine("----------------------------------------------------------------", "term-output-system");
    }

    showTelemetry() {
        const cpu = Math.floor(Math.random() * 25) + 5;
        const memory = (Math.random() * 2 + 1.2).toFixed(1);
        const temp = Math.floor(Math.random() * 15) + 38;
        this.writeLine("READING CORE SENSORS...", "term-output-system");
        this.writeLine(`  [CPU Engine Load]  : ${cpu}% load`, "term-output-info");
        this.writeLine(`  [System Memory]    : ${memory} GB / 8.0 GB index cache`, "term-output-info");
        this.writeLine(`  [Active Models]    : CoreML Llama-3-3B (Idle)`, "term-output-info");
        this.writeLine(`  [Socket Channels]  : 1 listener on localhost:8000`, "term-output-info");
        this.writeLine(`  [Core Temperature] : ${temp}°C (ANE passive)`, "term-output-info");
        
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
