const ASSET_VERSION = "20260603a";

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
/* OPENINTELLIGENCE 29-STEP PIPELINE DEBUGGER ENGINE                      */
/* ====================================================================== */

const DEBUGGER_TRACKS = {
  ingestion: {
    name: "Document Ingestion Pipeline (6 Steps)",
    metrics: { latency: "84ms", rate: "3.2 MB/s", score: "98.2%" },
    steps: [
      {
        badge: "Step 1",
        name: "Document Parsing",
        desc: "Extract text from source documents (PDFs, images, logs). Trigger Vision OCR on scanned PDF pages.",
        log: "[PDFKit] Parsed case_report_v2.pdf. 12 text pages identified.\n[Vision OCR] Low confidence detected on Page 4. Triggering OCR fallbacks at 6x render scale."
      },
      {
        badge: "Step 2",
        name: "Semantic Chunker",
        desc: "Deconstruct raw text into logically cohesive chunks (typically <=310 words) while preserving header context and section titles.",
        log: "[SemanticChunker] Split text into 18 chunks.\n[Structure] Markdown section titles mapped. Adjacent chunk siblings grouped."
      },
      {
        badge: "Step 3",
        name: "Entity Extraction",
        desc: "Identify primary entities and metadata via NLTagger Named Entity Recognition, normalising keys for database searching.",
        log: "[NLTagger] Extracted entities: 'Stryker Tower 3', 'VA Palo Alto', 'Stanford Endoscopy'.\n[PascalCase] Normalizing variables: 'strykerTower3', 'vaPaloAlto'."
      },
      {
        badge: "Step 4",
        name: "Token Validation",
        desc: "Validate extracted text segments against BertTokenizer context constraints to prevent context window overflow.",
        log: "[BertTokenizer] Max chunk size verified (all blocks <=510 tokens).\n[Validation] 18/18 chunks verified."
      },
      {
        badge: "Step 5",
        name: "Embedding Generation",
        desc: "Convert text chunks into dense 384-dimensional mathematical vectors using local MiniLM model running on Apple Silicon.",
        log: "[MiniLM] Generated 18 vector tensors (384-dim).\n[Apple Silicon] Inferences accelerated via BNNS framework."
      },
      {
        badge: "Step 6",
        name: "Durable Index Storage",
        desc: "Write vectors into local binary container databases and index metadata under isolated container ids inside SQLite tables.",
        log: "[VectorStore] Vectors persisted to local _vectors.bin and precomputed _norms.bin.\n[SQLite] Index metadata written to tables 'documents', 'chunks', and 'document_pages'."
      }
    ]
  },
  query: {
    name: "Query-to-Response Pipeline (23 Steps)",
    metrics: { latency: "148ms", rate: "68 tok/s", score: "99.4%" },
    steps: [
      {
        badge: "Step 0",
        name: "Corpus Analysis",
        desc: "Scan local container vocabulary caches to determine word distribution and terminology matches.",
        log: "[VocabCache] Scanned. Found 12 matching index keywords."
      },
      {
        badge: "Step 1",
        name: "Query Parsing",
        desc: "Resolve pronoun ambiguities and extract query entities via Named Entity Recognition (NER).",
        log: "[QueryParser] Entities: 'Stryker Tower 3'. Pronouns resolved: None."
      },
      {
        badge: "Step 1.5",
        name: "Query Expansion",
        desc: "Expand query terms using the container vocabulary to increase retrieval recall.",
        log: "[Expansion] Expanded query: 'Stryker Tower 3 capacity specification quarts par levels'."
      },
      {
        badge: "Step 1.6",
        name: "Intent Classification",
        desc: "Classify query intent (lookup, procedure, compare, summarize) to select the correct downstream routing logic.",
        log: "[Classifier] Intent: 'lookup' (factual specification query). Subtype: Device capability."
      },
      {
        badge: "Step 2",
        name: "Query Embedding",
        desc: "Generate 384-dimensional dense vector representation of expanded query.",
        log: "[EmbeddingService] Generated vector tensor (384-dim) via local MiniLM."
      },
      {
        badge: "Step 2.5",
        name: "RAPTOR-Lite Routing",
        desc: "Decide whether query requires summary-level overview blocks or raw factual details.",
        log: "[RAPTOR] Query complexity: standard. Routing to raw chunk database (bypassing L1 summaries)."
      },
      {
        badge: "Step 3",
        name: "Hybrid Search Scan",
        desc: "Execute concurrent vector search and SQLite FTS5 BM25 keyword search. Merge results via Reciprocal Rank Fusion (RRF).",
        log: "[VectorSearch] Searched 18 vectors.\n[BM25] Searched SQLite FTS5 index.\n[RRF] Merged candidates. Best RRF score: 0.962."
      },
      {
        badge: "Step 4",
        name: "Cross-Encoder Rerank",
        desc: "Rescore top candidates using local TinyBERT ms-marco model to measure precise query-chunk relevance pairs.",
        log: "[TinyBERT] Reranked 30 candidates. Candidate #1 score: 0.892 (file: 'stryker_spec.pdf')."
      },
      {
        badge: "Step 4.3",
        name: "Low-Confidence Filtering",
        desc: "Discard candidates that fall below the dynamic similarity floor.",
        log: "[Filter] Dropped 12 candidates below similarity floor (0.65)."
      },
      {
        badge: "Step 4.4",
        name: "Multi-Doc Representation",
        desc: "Balance candidates to prevent retrieval saturation from a single source document.",
        log: "[Diversity] Source coverage balanced. 3 independent documents represented."
      },
      {
        badge: "Step 4.5",
        name: "MMR Diversification",
        desc: "Apply Maximal Marginal Relevance (lambda=0.6) to reduce redundancy in adjacent context.",
        log: "[MMR] Redundancy penalty applied. Selected 6 distinct segments."
      },
      {
        badge: "Step 4.6",
        name: "Parent Document Retrieval",
        desc: "Expand matched chunks to include adjacent sibling chunks (+-5 siblings) from the same section or page.",
        log: "[ParentDoc] Expanded context window. Total chunks: 11 (2,250 tokens)."
      },
      {
        badge: "Step 4.7",
        name: "Contextual Compression",
        desc: "Apply LLM sentence-level filter, retaining only query-relevant sentences and discarding the rest.",
        log: "[Compression] Removed irrelevant sentences. Token size reduced: 2,250 -> 612 (72.8% savings)."
      },
      {
        badge: "Step 4.9",
        name: "Graph Context Packing",
        desc: "Verify that total context size fits Apple FoundationModels session token budget.",
        log: "[ContextPack] Budget check: 612 context tokens + 100 prompt tokens = 712 / 4,096. Status: OK."
      },
      {
        badge: "Step 5",
        name: "Context Assembly",
        desc: "Apply 'Lost-in-Middle' reordering to place the most relevant chunks at the start and end of prompt.",
        log: "[Lost-in-Middle] Interleaved context: [Chunk 1, Chunk 3, Chunk 5, Chunk 4, Chunk 2]."
      },
      {
        badge: "Step 5.9",
        name: "Extractive Summarization",
        desc: "Execute extractive summary calculations if query intent is classified as summarize.",
        log: "[Summarization] Step bypassed (intent is lookup)."
      },
      {
        badge: "Step 5.10",
        name: "Extractive QA",
        desc: "Run high-precision factual lookups on candidates for lookup intent queries.",
        log: "[ExtractiveQA] Located precise target tokens: 'capacity = 5.3 quarts'."
      },
      {
        badge: "Step 6",
        name: "LLM Generation",
        desc: "Call Apple's LanguageModelSession locally on device to generate cited response draft.",
        log: "[LanguageModelSession] Invoking on-device LLM. Generated draft answer."
      },
      {
        badge: "Step 6.5",
        name: "Response Formatting",
        desc: "Validate markdown syntax and confirm citation node mappings.",
        log: "[ResponseFormat] Markdown nodes validated. Citations verified against source indices."
      },
      {
        badge: "Step 7",
        name: "Quality Assessment",
        desc: "Assess response groundedness to detect potential hallucinations or prior-knowledge leaks.",
        log: "[QualityService] Groundedness check complete. Score: 0.942."
      },
      {
        badge: "Step 7.5",
        name: "Verification Gates A-I",
        desc: "Run post-generation verification checks (hallucination risk, spec-sniper check, domain isolation, etc.).",
        log: "[VerificationGate] Running Gates A-I.\nHallucination Gate: Pass\nSpec-sniper check: Pass\nDomain isolation: Pass"
      },
      {
        badge: "Step 8",
        name: "Platt Confidence Calibration",
        desc: "Apply Platt scaling to calibrate raw verification scores into a final trust rating.",
        log: "[Calibration] Confidence calibrated. Rating: 99.4% (Grounded)."
      },
      {
        badge: "Step 9",
        name: "Response Packaging",
        desc: "Compile final response object with citations, source details, and performance metrics.",
        log: "[ResponsePackage] Compiled final StructuredResponse payload."
      },
      {
        badge: "Step 10",
        name: "Markdown Rendering",
        desc: "Render response in SwiftUI chat bubbles with citation highlights and source file link buttons.",
        log: "[UI] Citations parsed. Response rendered successfully."
      }
    ]
  }
};

let activeDebuggerTrack = "query";
let isRunning = false;
let logInterval = null;

function renderDebuggerSteps(trackName) {
  const track = DEBUGGER_TRACKS[trackName];
  const stepsContainer = document.getElementById("debugger-steps-container");
  if (!stepsContainer) return;

  stepsContainer.innerHTML = "";

  track.steps.forEach((step, idx) => {
    const card = document.createElement("div");
    card.className = "debugger-step-card";
    card.id = `step-card-${idx}`;

    card.innerHTML = `
      <div class="debugger-step-header">
        <span class="debugger-step-badge">${step.badge}</span>
        <span class="debugger-step-name">${step.name}</span>
      </div>
      <p class="debugger-step-desc">${step.desc}</p>
      <pre class="debugger-step-log"><code>${step.log}</code></pre>
    `;
    stepsContainer.appendChild(card);
  });
}

function updatePlaygroundUI(trackName) {
  const track = DEBUGGER_TRACKS[trackName];

  // Update pipeline name
  const titleName = document.getElementById("playground-pipeline-name");
  if (titleName) {
    titleName.textContent = track.name;
  }

  // Render steps list
  renderDebuggerSteps(trackName);

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

  // Set action button state
  const runBtn = document.getElementById("run-pipeline-btn");
  if (runBtn) {
    runBtn.disabled = false;
    runBtn.textContent = trackName === "ingestion" ? "Run Ingestion" : "Execute Query Pipeline";
  }
}

function scrollIntoViewIfNeeded(container, element) {
  const containerTop = container.scrollTop;
  const containerBottom = containerTop + container.clientHeight;
  const elemTop = element.offsetTop - container.offsetTop;
  const elemBottom = elemTop + element.clientHeight;

  if (elemTop < containerTop) {
    container.scrollTo({ top: elemTop, behavior: "smooth" });
  } else if (elemBottom > containerBottom) {
    container.scrollTo({ top: elemBottom - container.clientHeight, behavior: "smooth" });
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
  const stepsContainer = document.getElementById("debugger-steps-container");
  const progressFill = document.getElementById("debugger-progress-fill");

  if (!runBtn || !stepsContainer) return;

  isRunning = true;
  runBtn.disabled = true;
  runBtn.textContent = "Executing...";

  const stepsCount = track.steps.length;

  // Reset all cards
  for (let i = 0; i < stepsCount; i++) {
    const card = document.getElementById(`step-card-${i}`);
    if (card) {
      card.className = "debugger-step-card";
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

  let stepIdx = 0;
  const stepDuration = activeDebuggerTrack === "ingestion" ? 1500 : 1200;

  logInterval = setInterval(() => {
    if (stepIdx >= stepsCount) {
      clearInterval(logInterval);
      isRunning = false;

      // Mark all cards done
      for (let i = 0; i < stepsCount; i++) {
        const card = document.getElementById(`step-card-${i}`);
        if (card) {
          card.className = "debugger-step-card done";
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
      return;
    }

    // Process current step
    for (let i = 0; i < stepsCount; i++) {
      const card = document.getElementById(`step-card-${i}`);
      if (!card) continue;

      if (i < stepIdx) {
        card.className = "debugger-step-card done";
      } else if (i === stepIdx) {
        card.className = "debugger-step-card active";
        // Smoothly scroll active card into view ONLY if it's out of bounds
        scrollIntoViewIfNeeded(stepsContainer, card);
      } else {
        card.className = "debugger-step-card";
      }
    }

    if (progressFill) {
      progressFill.style.width = `${((stepIdx + 1) / stepsCount) * 100}%`;
    }

    stepIdx++;
  }, stepDuration);
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

  // Initial draw: default to query execution pipeline
  switchTrack("query");
}

/* ====================================================================== */

forceFreshStylesheet();

document.addEventListener("DOMContentLoaded", () => {
  setupSmoothRouting();
  setupRevealState();
  initPlayground();
  stampRuntimeReady();
});
