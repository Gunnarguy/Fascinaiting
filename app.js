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
            "Target Model": "Apple LanguageModelSession",
            "Storage Overhead": "<120MB offline engine",
            "Confidence Gate": "0.70 grounding threshold"
        },
        features: [
            "Fully offline local embedding generation & retrieval using CoreML vector spaces.",
            "Vision-based PDF & OCR image scanning straight to the localized vault.",
            "Dynamic reasoning router directing queries between on-device SLMs and cloud-based models.",
            "Custom recursive token window extension bypassing standard 4,096 SLM token boundaries."
        ],
        diagram: `[PDF/Image Ingestion] ──> [OCR Vision Pipeline] ──> [Vector Embedding Store (CoreML)]
                                                                               │
                                                                               ▼
[Query Text Input] ─────> [Apple Intelligence Router] ─────> [Local Semantic Context]`,
        link: "https://github.com/Gunnarguy/OpenIntelligence-Public",
        linkLabel: "View Source on GitHub"
    },
    {
        id: "openclinic",
        tag: "on-device-ml",
        title: "OpenClinic Workspace",
        status: "active",
        statusClass: "pulse",
        desc: "Provider-facing clinical workstation integrating patient scheduling, chart documentation, and on-device clinical intelligence via LanguageModelSession.",
        tech: ["SwiftData", "LanguageModelSession", "SMART on FHIR", "SQLite FTS5", "Actors"],
        stats: {
            "Concurrency": "Background Actor-isolated RAG",
            "Vector Embed": "768-dim MLPackage CoreML",
            "Sync Engine": "SMART on FHIR OAuth",
            "Safety Gates": "9-gate output validator"
        },
        features: [
            "Local-first patient charting and schedule timelines running off SwiftData.",
            "Dictation transcription into structured ClinicalVisitNotes via local Apple Foundation models.",
            "9-Gate Safety Verification system checking evidence coverage and patient boundaries.",
            "SMART on FHIR sandbox synchronization using ASWebAuthenticationSession tokens."
        ],
        diagram: `[SMART FHIR Server] ──> [OAuth ASWebAuthSession] ──> [SwiftData Local Store]
                                                                   │
                                                                   ▼
[Clinician Query] ──> [FTS5 + CoreML Search] ──> [LanguageModelSession] ──> [9-Gate Validator]`,
        link: "https://github.com/Gunnarguy/OpenClinic",
        linkLabel: "View Source on GitHub"
    },
    {
        id: "openresponses",
        tag: "ai-agents",
        title: "OpenResponses Client",
        status: "streaming",
        statusClass: "pulse",
        desc: "Real-time streaming developer playground client for OpenAI's Responses API, hosting token-level output parameters, reasoning traces, and local MCP tool integrations.",
        tech: ["SwiftUI", "Responses API", "Computer Use", "AsyncThrowingStream", "Keychain"],
        stats: {
            "Websocket Stream": "Asynchronous SSE (~45ms)",
            "Model Selection": "GPT-4o & Claude 3.5 Sonnet",
            "Secret Storage": "Keychain Enclave Secure",
            "Automation Gating": "Consent approval sheets"
        },
        features: [
            "SSE stream parser dispatching UI updates to the MainActor to avoid layout race conditions.",
            "Exposes raw token counters and live connection monitors for o1/o3-mini reasoning traces.",
            "Sandboxed browser automation (Computer Use) utilizing state coordinators to prevent loops.",
            "Custom file converter processing attachments locally via PDFKit and Vision OCR."
        ],
        diagram: `[OpenResponses Client] <═══(WebSocket Streaming)═══> [Real-time API (OpenAI/Anthropic)]
         │                                                          │
         └───> [Local MCP Hub] ──> [Notion & Remote Shell Integrations] ┘`,
        link: "https://github.com/Gunnarguy/OpenResponses",
        linkLabel: "View Source on GitHub"
    },
    {
        id: "plaudblender",
        tag: "pipelines",
        title: "PlaudBlender (Chronos)",
        status: "idle",
        statusClass: "orange",
        desc: "Cognitive processing pipeline converting raw voice recordings from Plaud devices into searchable NetworkX/Cytoscape temporal knowledge graphs.",
        tech: ["Python", "Gemini 1.5 Pro", "Qdrant Vector DB", "Dash UI", "FastMCP"],
        stats: {
            "Database": "Qdrant (Cloud/Local)",
            "Embed Model": "Gemini-Embedding-2 (768-dim)",
            "MCP Server": "11 custom tools registered",
            "Activity Monitor": "X-ray PiP panel (800ms poll)"
        },
        features: [
            "Plaud audio API transcript ingest with OAuth authentication.",
            "Gemini 1.5 Pro audio-native processing to extract events, sentiment, and categories.",
            "Visualizations using Dash v2 Cytoscape graphs with communities detection.",
            "Activity logs streamed to a floating, draggable client-side Picture-in-Picture panel."
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
        desc: "Local-first iOS vector client integrating OpenAI embeddings and Pinecone databases directly with rate-limiting and circuit-breaker protection.",
        tech: ["Swift", "SwiftUI", "Pinecone REST API", "RecursiveTextSplitter", "Speech"],
        stats: {
            "Vector Lookup": "~90ms query REST API",
            "Segmentation": "Recursive (1024 chars, 256 overlap)",
            "Secure Store": "Keychain SecureSettingsStore",
            "Audio Input": "AVAudioEngine & SFSpeechRecognizer"
        },
        features: [
            "Exponential backoff retries and rate limiters protecting against vector-store throttling.",
            "Local document chunking using a MIME-aware recursive splitter.",
            "Hybrid search weighting slider combining dense vectors and sparse keywords.",
            "Secure bookmarks retaining local file permissions across app restarts without prompts."
        ],
        diagram: `[Local Document] ──> [MIME Chunker] ──> [OpenAI Embeddings] ──> [Pinecone REST API]
                                                                             │
                                                                             ▼
[Voice Query (AVAudio)] ──> [Speech Recognition] ──> [Cosine Similarity Matches]`,
        link: "https://apps.apple.com/us/app/opencone/id6744467668",
        linkLabel: "View on App Store"
    },
    {
        id: "openassistant",
        tag: "ai-agents",
        title: "OpenAssistant Classic",
        status: "legacy",
        statusClass: "orange",
        desc: "Foundational native SwiftUI client for OpenAI's stateful Assistants API (v2) featuring strategy-driven local file preprocessing and active run polling.",
        tech: ["SwiftUI", "Combine", "Assistants API", "Strategy Pattern", "Polling"],
        stats: {
            "Polling Pipeline": "2.0s interval with weak captures",
            "File Handling": "HEIC/RTF on-device converters",
            "Architecture": "Decoupled notification bus",
            "Target OS": "iOS 15.0+ Compatible"
        },
        features: [
            "Timer-based polling system designed to manage stateful thread run lifecycles safely.",
            "MIME preprocessing converting non-supported formats (HEIC to JPEG, RTF to TXT) locally.",
            "Cross-module synchronization using NotificationCenter to update views without tight coupling.",
            "Secure direct-to-OpenAI TLS 1.3 connections bypassing third-party proxies."
        ],
        diagram: `[Select Attachment] ──> [Conversion Strategy] ──> [Upload to OpenAI Files]
                                                                      │
                                                                      ▼
[Send Prompt] ──> [Create Thread Run] ──> [2.0s Polling Loop] ──> [Deduplicate & Render]`,
        link: "https://apps.apple.com/us/app/openassistant/id6692613772",
        linkLabel: "View on App Store"
    },
    {
        id: "mcpservers",
        tag: "ai-agents",
        title: "MCP Core Servers",
        status: "connected",
        statusClass: "pulse",
        desc: "Custom Model Context Protocol servers enabling local LLM clients to safely read/write workspace documents, execute CLI tasks, and sync Notion data.",
        tech: ["TypeScript", "Node.js", "JSON-RPC", "Notion API", "HTTP Transport"],
        stats: {
            "Protocol": "JSON-RPC over stdio / HTTP",
            "Access Control": "Regex-bounded write blocks",
            "Host Options": "Smithery & Docker images",
            "API Target": "Notion v2022-06-28"
        },
        features: [
            "Notion MCP server supporting database query searches and comment additions.",
            "Standard stdio transport and streamable HTTP transport options on custom ports.",
            "Local file system access with folder restrictions safeguarding core environment files.",
            "Fully compliant with the Anthropic Model Context Protocol specification."
        ],
        diagram: `[Claude Desktop / Zed IDE]
             │ (stdio JSON-RPC / HTTP bearer token)
             ▼
     [Local MCP Host]
      ├── [Notion Server] ───> [Notion Developers API]
      └── [System Controller] ─> [Restricted Workspace Files]`,
        link: "https://github.com/Gunnarguy/notion-mcp-server",
        linkLabel: "View Server Source"
    },
    {
        id: "visionbud",
        tag: "pipelines",
        title: "VisionBud (Edge AI)",
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
        this.writeLine(`  [Active Models]    : LanguageModelSession (Idle)`, "term-output-info");
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
