const ASSET_VERSION = "20260603d";

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

function setupSmoothRouting() {
  document.querySelectorAll("[data-scroll-target]").forEach((element) => {
    element.addEventListener("click", (event) => {
      const targetId = element.getAttribute("data-scroll-target");
      const target = targetId ? document.getElementById(targetId) : null;

      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function setupRevealState() {
  const revealTargets = document.querySelectorAll(
    ".hero-copy, .hero-visual, .code-panel, .philosophy-copy, .product-card, .ecosystem-card, .status-section",
  );

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 },
  );

  revealTargets.forEach((target) => observer.observe(target));
}

function stampRuntimeReady() {
  document.documentElement.dataset.runtime = "ready";
}

/* ====================================================================== */
/* OPENINTELLIGENCE 29-STEP PIPELINE DIAGRAM ENGINE                       */
/* ====================================================================== */

const DEBUGGER_TRACKS = {
  ingestion: {
    name: "Document Ingestion Pipeline (6 Steps + I/O)",
    metrics: { latency: "84ms", rate: "3.2 MB/s", score: "98.2%" },
    stages: ["0. Input", "1. Ingest", "2. Route", "3. Validate", "4. Embed", "5. Store", "6. Output"],
    steps: [
      {
        stageIdx: 0,
        gridX: 0.5,
        gridY: 1.5,
        next: [1],
        badge: "Input",
        name: "Upload Document",
        file: "UIDocumentPickerViewController",
        desc: "User selects a document or provides raw text to ingest into the workspace sandbox.",
        what: "Receives raw file streams, URLs, or text inputs from the user interface.",
        why: "Initializes the workspace ingestion pipeline session and grants sandboxed read permission.",
        how: "Triggers UIDocumentPickerViewController or imports data, initiating the ingestion session.",
        log: "[Input] User selected 'case_report_v2.pdf' (1.4 MB). Sandboxed file read access granted."
      },
      {
        stageIdx: 1,
        gridX: 0.5,
        gridY: 0.5,
        next: [2],
        badge: "Step 1",
        name: "Parse",
        file: "DocumentProcessor.swift",
        desc: "Extract raw text from PDF, XML, text, or CSV. Adaptively triggers Vision OCR at 6x scale when scanning page images.",
        what: "Extracts raw text, structural layout, and metadata from documents (PDF, DOCX, TXT, CSV) using PDFKit and Office ZIP parsers.",
        why: "Scanned pages, image charts, or low-contrast text blocks must trigger OCR dynamically to avoid indexing empty metadata.",
        how: "Utilizes PDFDocument and fallbacks to Vision OCR rendering page images at 6x scale to accurately capture small spec markings.",
        log: "[PDFKit] Parsed case_report_v2.pdf. 12 text pages identified.\n[Vision OCR] Low confidence detected on Page 4. Triggering OCR fallbacks at 6x render scale."
      },
      {
        stageIdx: 1,
        gridX: 0.5,
        gridY: 2.5,
        next: [3],
        badge: "Step 2",
        name: "Chunk",
        file: "SemanticChunker.swift",
        desc: "Deconstruct raw text into logically cohesive chunks (typically <=310 words) based on page sentinels and section title markers.",
        what: "Splits raw parsed text into smaller, overlapping chunks while retaining heading context and layout hierarchies.",
        why: "Local CoreML context budgets are strictly limited. Feeding full documents directly will cause memory overflows or attention dilution.",
        how: "Uses sentence boundary detection to create blocks <=310 words, prepending section/page headers to keep local context alive.",
        log: "[SemanticChunker] Split text into 18 chunks.\n[Structure] Markdown section titles mapped. Adjacent chunk siblings grouped."
      },
      {
        stageIdx: 2,
        gridX: 0.5,
        gridY: 1.5,
        next: [4],
        badge: "Step 3",
        name: "NER",
        file: "NLTagger (NaturalLanguage)",
        desc: "Identify primary entities and metadata via NLTagger Named Entity Recognition (NER), normalising keys to PascalCase variables.",
        what: "Extracts named entities (locations, model numbers, parts) from chunks using NaturalLanguage's tagger.",
        why: "Standardizing keys allows deterministic keyword queries and maps variations (e.g. 'Tower 3' vs 'tower-3') to single variables.",
        how: "Invokes NLTagger(tagSchemes: [.nameType]) to tag entities, normalizing matches to PascalCase format via regex utilities.",
        log: "[NLTagger] Extracted entities: 'Stryker Tower 3', 'VA Palo Alto', 'Stanford Endoscopy'.\n[PascalCase] Normalizing variables: 'strykerTower3', 'vaPaloAlto'."
      },
      {
        stageIdx: 3,
        gridX: 0.5,
        gridY: 1.5,
        next: [5],
        badge: "Step 4",
        name: "Tokens",
        file: "BertTokenizer",
        desc: "Validate extracted text segments against BertTokenizer context constraints to prevent context window overflow.",
        what: "Tokenizes text chunks into WordPiece sub-tokens and validates that the chunk fits the embedding model size limit.",
        why: "CoreML embedding models crash or truncate text silently if the input vector size exceeds 512 tokens.",
        how: "Runs a local WordPiece vocabulary lookup, asserting that chunk tokens do not exceed the 510 token model budget limit.",
        log: "[BertTokenizer] Max chunk size verified (all blocks <=510 tokens).\n[Validation] 18/18 chunks verified."
      },
      {
        stageIdx: 4,
        gridX: 0.5,
        gridY: 1.5,
        next: [6],
        badge: "Step 5",
        name: "Embed",
        file: "EmbeddingService.swift",
        desc: "Convert text chunks into dense 384-dimensional mathematical vectors using local MiniLM model running on Apple Silicon.",
        what: "Encodes tokenized text chunks into dense 384-dimensional mathematical vectors representing semantic concepts.",
        why: "Semantic search uses vector similarity to find concepts that share meaning rather than literal spelling matches.",
        how: "Runs on-device inference using a compiled MiniLM CoreML model, accelerated by Apple Silicon Neural Engine (BNNS).",
        log: "[MiniLM] Generated 18 vector tensors (384-dim).\n[Apple Silicon] Inferences accelerated via BNNS framework."
      },
      {
        stageIdx: 5,
        gridX: 0.5,
        gridY: 1.5,
        next: [7],
        badge: "Step 6",
        name: "Index",
        file: "SQLiteFullTextService.swift",
        desc: "Write vectors into local binary container databases (BNNS) and index metadata under isolated container ids inside SQLite tables.",
        what: "Saves generated vectors to memory-mapped files and records chunk metadata in a SQLite FTS5 table.",
        why: "Provides fast, transactional local search. SQLite FTS5 indexes literal keywords; MMAP files handle vector searches.",
        how: "Appends float arrays directly to binary file streams and registers document offsets inside SQLite tables.",
        log: "[VectorStore] Vectors persisted to local _vectors.bin and precomputed _norms.bin.\n[SQLite] Index metadata written to tables 'documents', 'chunks', and 'document_pages'."
      },
      {
        stageIdx: 6,
        gridX: 0.5,
        gridY: 1.5,
        next: [],
        badge: "Output",
        name: "Stored Container",
        file: "StorageManager.swift",
        desc: "Finalize document indexing and write references to the encrypted local sqlite storage container.",
        what: "Commits SQLite transactions and closes active file streams, completing the document index cycle.",
        why: "Persists the compiled vector mappings and metadata indexes across app launches so they can be queried offline.",
        how: "Calls StorageManager.finalizeSession() to persist changes to the on-device sandbox storage.",
        log: "[Storage] Ingestion session finalized. Container 'case_report_v2' successfully updated. 18 new vectors stored."
      }
    ]
  },
  query: {
    name: "Apple Foundation Model Agentic Pipeline (16 Steps)",
    metrics: { latency: "214ms", rate: "128 tok/s", score: "99.8%" },
    stages: ["0. Input", "1. Route", "2. Search", "3. Assembly", "4. Generate", "5. Verify", "6. Output"],
    steps: [
      {
        stageIdx: 0,
        gridX: 0.5,
        gridY: 1.5,
        next: [1],
        badge: "Input",
        name: "User Query",
        file: "ChatScreen.swift",
        desc: "User submits a natural language question via the SwiftUI chat bar.",
        what: "Captures natural language query and validates against maximum input token bounds.",
        why: "Initiates the unified OpenIntelligence execution loop.",
        how: "Calls sendMessage() converting string into FoundationModelTokenBudget.",
        log: "[QueryInput] Received query: 'Analyze the complications in this surgical case report.'"
      },
      {
        stageIdx: 1,
        gridX: 0.5,
        gridY: 0,
        next: [2],
        badge: "Step 1",
        name: "Intent Classifier",
        file: "QueryEnhancementService.swift",
        desc: "Classify query intent (lookup, procedure, summarize) to select the correct downstream routing logic.",
        what: "Parses the linguistic intent of the user's prompt.",
        why: "Simple lookups need direct details; summaries require parent documents. Routing correctly saves cycles.",
        how: "Runs rule-based heuristics inside QueryEnhancementService.",
        log: "[Classifier] Intent: 'summarize'. Subtype: Document synthesis."
      },
      {
        stageIdx: 1,
        gridX: 0.5,
        gridY: 1.5,
        next: [3],
        badge: "Step 1.5",
        name: "Model Tier Router",
        file: "FoundationModelPreference.swift",
        desc: "Determine local token capacity and route to appropriate model tier.",
        what: "Dynamically routes query to either 3B Core, 20B Advanced, or Private Cloud Compute based on workload.",
        why: "Massive context windows overflow local memory limits and require PCC offloading.",
        how: "Evaluates hardware class and checks FoundationModelPreference user overrides.",
        log: "[ModelRouter] Token limit exceeded 12K. Routing task to Private Cloud Compute tier."
      },
      {
        stageIdx: 1,
        gridX: 0.5,
        gridY: 3.0,
        next: [4],
        badge: "Step 2",
        name: "RAPTOR Routing",
        file: "QueryRouterService.swift",
        desc: "Decide whether query requires summary-level overview blocks or raw factual details.",
        what: "Selects whether to query detail-level chunks or high-level L1/L2 hierarchical summaries.",
        why: "Speeds up overview questions by routing to pre-summarized parent blocks rather than searching raw sentences.",
        how: "Evaluates classification flag to route into RAPTORSummaryRouter.",
        log: "[RAPTOR] Routing to L2 Summary Index."
      },
      {
        stageIdx: 2,
        gridX: 0.2,
        gridY: 0.5,
        next: [6],
        badge: "Step 3a",
        name: "Vector Search",
        file: "RAGEngine.swift",
        desc: "Execute semantic cosine similarity match using local SIMD4 document vectors on Apple Silicon.",
        what: "Performs semantic search to find chunks conceptually similar to the query.",
        why: "Finds concepts that share meaning rather than literal spelling matches.",
        how: "Computes cosine similarity across memory-mapped vector bins using Apple Silicon Accelerate.",
        log: "[VectorSearch] Searched 8,400 vectors via BNNS. Extracted top 40."
      },
      {
        stageIdx: 2,
        gridX: 0.2,
        gridY: 2.5,
        next: [6],
        badge: "Step 3b",
        name: "BM25 Search",
        file: "SQLiteFullTextService.swift",
        desc: "Run high-velocity keyword lookup against local SQLite FTS5 index.",
        what: "Runs traditional literal keyword search.",
        why: "Exact details (serial numbers, patient names) require literal search.",
        how: "Runs BM25 ranking query inside the SQLite FTS5 virtual tables.",
        log: "[BM25] Searched SQLite FTS5 index. Retrieved 14 exact literal hits."
      },
      {
        stageIdx: 2,
        gridX: 0.8,
        gridY: 1.5,
        next: [7],
        badge: "Step 3.5",
        name: "Hybrid RRF",
        file: "RAGEngine.swift",
        desc: "Merge vector and keyword candidates using Reciprocal Rank Fusion (RRF).",
        what: "Merges candidates from both semantic and keyword pipelines.",
        why: "Combines the strengths of general meaning and exact specificity.",
        how: "Applies the RRF algorithm to penalize low-confidence outliers.",
        log: "[RRF] Merged indices. Top candidate combined score: 0.981."
      },
      {
        stageIdx: 2,
        gridX: 0.5,
        gridY: 3.5,
        next: [8],
        badge: "Step 4",
        name: "ReRanker",
        file: "ReRankerModel.mlpackage",
        desc: "Rescore candidates using local cross-encoder model to measure precise relevance pairs.",
        what: "Rescores top 30 merged candidates with a precision ML model.",
        why: "Initial retrieval is fast but coarse. Reranking ensures only the absolute best chunks survive.",
        how: "Runs on-device inference using an ANE-optimized TinyBERT cross-encoder.",
        log: "[TinyBERT] Reranked 30 candidates. Dropped 18 below precision floor."
      },
      {
        stageIdx: 3,
        gridX: 0.5,
        gridY: 0.5,
        next: [9],
        badge: "Step 4.5",
        name: "Compression",
        file: "ContextualCompressionService.swift",
        desc: "Apply LLM sentence-level filter, retaining only query-relevant sentences.",
        what: "Extracts only query-relevant sentences from retrieved chunks.",
        why: "Saves up to 60% of the token limit and prevents irrelevant noise from causing hallucinations.",
        how: "Runs a fast sentence-level similarity filter.",
        log: "[Compression] Token payload reduced from 4,100 -> 1,840 (55.1% saved)."
      },
      {
        stageIdx: 3,
        gridX: 0.5,
        gridY: 1.5,
        next: [10],
        badge: "Step 5",
        name: "Graph Pack",
        file: "ContextPackingService.swift",
        desc: "Verify that total context size fits the active model's token budget.",
        what: "Truncates context to strictly fit the selected model limit (e.g. 32K for PCC).",
        why: "Exceeding the max token boundary will crash the model or truncate the system prompt silently.",
        how: "Iterates chunks and subtracts from the calculated FoundationModelTokenBudget.",
        log: "[ContextPack] 1,840 tokens fit within 32,000 PCC limit. Packing valid."
      },
      {
        stageIdx: 3,
        gridX: 0.5,
        gridY: 2.5,
        next: [11],
        badge: "Step 5.5",
        name: "LIM Sort",
        file: "RAGEngine.swift",
        desc: "Apply 'Lost-in-Middle' reordering to place best chunks at prompt edges.",
        what: "Reorders chunks to place highest value data at the start and end of the payload.",
        why: "Mitigates the 'Lost-in-Middle' effect where LLMs ignore data buried in the center of long prompts.",
        how: "Interleaves chunks following a [1st, 3rd, 5th... 4th, 2nd] pattern.",
        log: "[Lost-in-Middle] Ordered payload to maximize edge attention."
      },
      {
        stageIdx: 4,
        gridX: 0.5,
        gridY: 1.5,
        next: [12],
        badge: "Step 6",
        name: "AFM Inference",
        file: "LanguageModelSession",
        desc: "Call Apple's Foundation Model to generate reasoning sequence.",
        what: "Streams generative tokens from the selected foundation model.",
        why: "Synthesizes the retrieved chunks into a natural, cohesive answer.",
        how: "Calls iOS 26 native LanguageModelSession via Swift Concurrency.",
        log: "[AFM] Inference requested. Stream initiated at 128 tokens/sec."
      },
      {
        stageIdx: 5,
        gridX: 0.5,
        gridY: 0.5,
        next: [13],
        badge: "Step 7",
        name: "Verification Gates",
        file: "VerificationGateService.swift",
        desc: "Run strict verification checks (hallucination risk, domain isolation) before rendering.",
        what: "Evaluates the generated draft against 9 hard-coded safety gates.",
        why: "Prevents the model from hallucinating non-existent facts or leaking data from outside the sandboxed file.",
        how: "Asserts pass/fail on Gates A-I using structural constraint checks.",
        log: "[VerificationGate] Gates A-I: Pass. No hallucinations detected."
      },
      {
        stageIdx: 5,
        gridX: 0.5,
        gridY: 2.5,
        next: [14],
        badge: "Step 8",
        name: "Grounded Citations",
        file: "GroundedAnswerView.swift",
        desc: "Map claims directly back to the specific source chunks.",
        what: "Injects interactive [1] footnote anchors into the markdown text.",
        why: "Provides zero-trust verification, allowing users to tap a claim and see the exact sentence in the PDF.",
        how: "Regex matches generated quotes against the retrieval payload dictionary.",
        log: "[Citations] 4 source anchors successfully mapped and injected."
      },
      {
        stageIdx: 6,
        gridX: 0.5,
        gridY: 1.5,
        next: [],
        badge: "Output",
        name: "Liquid Glass UI",
        file: "ChatBubbleView.swift",
        desc: "Deliver final verified response package to the chat interface.",
        what: "Presents the final response alongside the Resizable Telemetry Drawer.",
        why: "Completes the pipeline execution and renders the result to the user.",
        how: "Updates SwiftUI state, triggering Apple's native glassmorphism animations.",
        log: "[UI] Rendered final response. Trust Level: 99.8%."
      }
    ]
  }
};

let activeDebuggerTrack = "query";
let isRunning = false;
let logInterval = null;
let stepDuration = 800; // Default execution latency

function renderDebuggerDiagram(trackName) {
  const track = DEBUGGER_TRACKS[trackName];
  const workspace = document.getElementById("diagram-workspace");
  if (!workspace) return;

  // Clear previous elements, preserving the SVG layer
  const svg = document.getElementById("diagram-svg");
  workspace.innerHTML = "";
  if (svg) {
    svg.innerHTML = "";
    workspace.appendChild(svg);
  } else {
    const newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    newSvg.className = "diagram-svg";
    newSvg.id = "diagram-svg";
    workspace.appendChild(newSvg);
  }

  // Set dynamic sizing based on stage count
  const stageCount = track.stages.length;
  workspace.style.gridTemplateColumns = `repeat(${stageCount}, 1fr)`;
  workspace.style.width = `${stageCount * 240}px`;

  // Draw columns/stages
  track.stages.forEach((stageName, stageIdx) => {
    const stageCol = document.createElement("div");
    stageCol.className = "diagram-stage";
    stageCol.id = `stage-${stageIdx}`;

    const title = document.createElement("div");
    title.className = "stage-title";
    title.textContent = stageName;
    stageCol.appendChild(title);

    const nodesContainer = document.createElement("div");
    nodesContainer.className = "stage-nodes";
    nodesContainer.id = `stage-nodes-${stageIdx}`;
    stageCol.appendChild(nodesContainer);

    workspace.appendChild(stageCol);
  });

  // Draw nodes inside columns absolutely positioned
  track.steps.forEach((step, idx) => {
    const nodesContainer = document.getElementById(`stage-nodes-${step.stageIdx}`);
    if (!nodesContainer) return;

    const node = document.createElement("div");
    node.className = "diagram-node";
    node.id = `node-${idx}`;
    node.dataset.stepIdx = idx;

    node.innerHTML = `
      <span>${step.name}</span>
      <span class="node-dot"></span>
    `;

    // Position node absolutely using percentage grids
    const nodeWidth = 145;
    const gridX = step.gridX !== undefined ? step.gridX : 0.5;
    const gridY = step.gridY !== undefined ? step.gridY : idx;
    node.style.left = `calc(${gridX * 100}% - ${nodeWidth / 2}px)`;
    node.style.top = `${gridY * 42 + 20}px`;

    // Click handler to inspect node
    node.addEventListener("click", () => {
      selectNode(idx);
    });

    nodesContainer.appendChild(node);
  });

  // Schedule async coordinates calculation after elements are painted
  setTimeout(drawConnections, 80);
}

function drawConnections() {
  const workspace = document.getElementById("diagram-workspace");
  const svg = document.getElementById("diagram-svg");
  if (!workspace || !svg) return;

  // Clear previous lines
  svg.innerHTML = "";

  const track = DEBUGGER_TRACKS[activeDebuggerTrack];
  if (!track) return;

  const workspaceRect = workspace.getBoundingClientRect();

  track.steps.forEach((step, idx) => {
    const nodeEl = document.getElementById(`node-${idx}`);
    if (!nodeEl) return;

    (step.next || []).forEach((targetIdx) => {
      const targetEl = document.getElementById(`node-${targetIdx}`);
      if (!targetEl) return;

      const nodeRect = nodeEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();

      // Output coordinates (center-right of source node)
      const x1 = nodeRect.right - workspaceRect.left;
      const y1 = nodeRect.top + nodeRect.height / 2 - workspaceRect.top;

      // Input coordinates (center-left of target node)
      const x2 = targetRect.left - workspaceRect.left;
      const y2 = targetRect.top + targetRect.height / 2 - workspaceRect.top;

      // Bezier curve calculations
      const dx = Math.abs(x2 - x1) * 0.45;
      const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", pathData);
      path.setAttribute("class", "connection-line");
      path.id = `line-${idx}-${targetIdx}`;

      // Check current state classes to color lines dynamically
      if (nodeEl.classList.contains("done") && targetEl.classList.contains("done")) {
        path.classList.add("done");
      } else if (nodeEl.classList.contains("done") && targetEl.classList.contains("active")) {
        path.classList.add("active");
      } else if (nodeEl.classList.contains("active")) {
        path.classList.add("active");
      }

      svg.appendChild(path);
    });
  });
}

function selectNode(idx) {
  const track = DEBUGGER_TRACKS[activeDebuggerTrack];
  const step = track.steps[idx];
  if (!step) return;

  // Highlight selected node
  document.querySelectorAll(".diagram-node").forEach((node, nIdx) => {
    if (nIdx === idx) {
      node.classList.add("selected");
    } else {
      node.classList.remove("selected");
    }
  });

  // Update HUD
  const badge = document.getElementById("hud-badge");
  const title = document.getElementById("hud-title");
  const file = document.getElementById("hud-file");
  const whatEl = document.getElementById("hud-what");
  const whyEl = document.getElementById("hud-why");
  const howEl = document.getElementById("hud-how");
  const log = document.getElementById("hud-log");

  if (badge) badge.textContent = step.badge;
  if (title) title.textContent = step.name;
  if (file) file.textContent = `File: ${step.file || "N/A"}`;
  if (whatEl) whatEl.textContent = step.what || step.desc || "N/A";
  if (whyEl) whyEl.textContent = step.why || "N/A";
  if (howEl) howEl.textContent = step.how || "N/A";
  if (log) {
    log.textContent = step.log;
    log.scrollTop = log.scrollHeight;
  }
}

function updatePlaygroundUI(trackName) {
  const track = DEBUGGER_TRACKS[trackName];

  // Update pipeline name
  const titleName = document.getElementById("playground-pipeline-name");
  if (titleName) {
    titleName.textContent = track.name;
  }

  // Render steps diagram
  renderDebuggerDiagram(trackName);

  // Reset metrics
  const latMetric = document.getElementById("metric-latency");
  const rateMetric = document.getElementById("metric-rate");
  const scoreMetric = document.getElementById("metric-score");

  if (latMetric) latMetric.textContent = "-- ms";
  if (rateMetric) rateMetric.textContent = "--";
  if (scoreMetric) scoreMetric.textContent = "--%";

  // Reset progress bar
  const progressFill = document.getElementById("debugger-progress-fill");
  if (progressFill) {
    progressFill.style.width = "0%";
  }

  // Reset HUD
  const badge = document.getElementById("hud-badge");
  const title = document.getElementById("hud-title");
  const file = document.getElementById("hud-file");
  const whatEl = document.getElementById("hud-what");
  const whyEl = document.getElementById("hud-why");
  const howEl = document.getElementById("hud-how");
  const log = document.getElementById("hud-log");

  if (badge) badge.textContent = "Step --";
  if (title) title.textContent = "Select a node to inspect";
  if (file) file.textContent = "File: --";
  if (whatEl) whatEl.textContent = "Click on any node in the architectural diagram above to inspect how that processing step operates inside the native Swift engine.";
  if (whyEl) whyEl.textContent = "Understanding each phase of on-device RAG is critical to optimizing memory, latency, and context limitations.";
  if (howEl) howEl.textContent = "Select a node to see technical implementation details, Swift API methods, and algorithmic settings.";
  if (log) log.textContent = "No active log trace.";

  // Set action button state
  const runBtn = document.getElementById("run-pipeline-btn");
  if (runBtn) {
    runBtn.disabled = false;
    runBtn.textContent = trackName === "ingestion" ? "Run Ingestion" : "Execute Query Pipeline";
  }
}

function switchTrack(trackName) {
  if (isRunning) {
    clearInterval(logInterval);
    isRunning = false;
  }

  activeDebuggerTrack = trackName;

  // Toggle active tab buttons
  document.querySelectorAll(".playground-tab").forEach((btn) => {
    if (btn.dataset.trackId === trackName) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  updatePlaygroundUI(trackName);
}

function runPipeline() {
  if (isRunning) return;

  const track = DEBUGGER_TRACKS[activeDebuggerTrack];
  const runBtn = document.getElementById("run-pipeline-btn");
  const progressFill = document.getElementById("debugger-progress-fill");

  if (!runBtn) return;

  isRunning = true;
  runBtn.disabled = true;
  runBtn.textContent = "Executing...";

  const stepsCount = track.steps.length;

  // Reset all nodes
  for (let i = 0; i < stepsCount; i++) {
    const node = document.getElementById(`node-${i}`);
    if (node) {
      node.className = "diagram-node";
    }
  }

  // Reset metrics
  const latMetric = document.getElementById("metric-latency");
  const rateMetric = document.getElementById("metric-rate");
  const scoreMetric = document.getElementById("metric-score");

  if (latMetric) latMetric.textContent = "...";
  if (rateMetric) rateMetric.textContent = "...";
  if (scoreMetric) scoreMetric.textContent = "...";

  if (progressFill) {
    progressFill.style.width = "0%";
  }

  // Clear connection states
  drawConnections();

  let stepIdx = 0;

  logInterval = setInterval(() => {
    if (stepIdx >= stepsCount) {
      clearInterval(logInterval);
      isRunning = false;

      // Mark all nodes done
      for (let i = 0; i < stepsCount; i++) {
        const node = document.getElementById(`node-${i}`);
        if (node) {
          node.className = "diagram-node done";
        }
      }

      // Update metrics with final values
      if (latMetric) latMetric.textContent = track.metrics.latency;
      if (rateMetric) rateMetric.textContent = track.metrics.rate;
      if (scoreMetric) scoreMetric.textContent = track.metrics.score;

      if (progressFill) {
        progressFill.style.width = "100%";
      }

      runBtn.disabled = false;
      runBtn.textContent = activeDebuggerTrack === "ingestion" ? "Run Ingestion" : "Execute Query Pipeline";

      // Update connections layout at completion
      drawConnections();
      return;
    }

    // Process current step node highlighting
    for (let i = 0; i < stepsCount; i++) {
      const node = document.getElementById(`node-${i}`);
      if (!node) continue;

      if (i < stepIdx) {
        node.className = "diagram-node done";
      } else if (i === stepIdx) {
        node.className = "diagram-node active";
      } else {
        node.className = "diagram-node";
      }
    }

    // Automatically inspect active node
    selectNode(stepIdx);

    if (progressFill) {
      progressFill.style.width = `${((stepIdx + 1) / stepsCount) * 100}%`;
    }

    // Update connection line highlights as step runs
    drawConnections();

    stepIdx++;
  }, stepDuration);
}

function setupSpeedSlider() {
  const slider = document.getElementById("simulation-speed");
  const valueDisplay = document.getElementById("simulation-speed-val");

  if (slider && valueDisplay) {
    slider.addEventListener("input", (e) => {
      stepDuration = parseInt(e.target.value, 10);
      valueDisplay.textContent = `${stepDuration}ms`;
    });
  }
}

function initPlayground() {
  // Bind tab click events
  document.querySelectorAll(".playground-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const trackId = tab.dataset.trackId;
      if (trackId) {
        switchTrack(trackId);
      }
    });
  });

  // Bind run button click
  const runBtn = document.getElementById("run-pipeline-btn");
  if (runBtn) {
    runBtn.addEventListener("click", runPipeline);
  }

  // Bind speed slider
  setupSpeedSlider();

  // Watch for resize events to adjust connections SVG
  window.addEventListener("resize", drawConnections);

  // Initial draw: default to query execution pipeline
  switchTrack("query");
}

forceFreshStylesheet();

document.addEventListener("DOMContentLoaded", () => {
  setupSmoothRouting();
  setupRevealState();
  initPlayground();
  stampRuntimeReady();
});
