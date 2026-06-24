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
  "ingestion": {
    "name": "Ingestion Pipeline (Apple Silicon)",
    "metrics": {
      "latency": "84ms",
      "rate": "3.2 MB/s",
      "score": "98.2%"
    },
    "stages": [
      "0. Input",
      "1. Extract",
      "2. Vectorize",
      "3. Output"
    ],
    "steps": [
      {
        "stageIdx": 0,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          1
        ],
        "badge": "Input",
        "name": "Upload Document",
        "file": "UIDocumentPickerViewController",
        "desc": "User selects a document.",
        "log": "File read access granted."
      },
      {
        "stageIdx": 1,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          2,
          3
        ],
        "badge": "Step 1",
        "name": "Complexity Pre-Scan",
        "file": "PageComplexityAnalyzer.swift",
        "desc": "Adaptive scan.",
        "log": "Routed to split extractors."
      },
      {
        "stageIdx": 1,
        "gridX": 0.2,
        "gridY": 1.5,
        "next": [
          4
        ],
        "badge": "Step 1a",
        "name": "Vision OCR",
        "file": "VisionFramework",
        "desc": "6x scale for accurate small spec extraction.",
        "log": "Text extracted."
      },
      {
        "stageIdx": 1,
        "gridX": 0.8,
        "gridY": 1.5,
        "next": [
          4
        ],
        "badge": "Step 1b",
        "name": "Native PDFKit",
        "file": "DocumentProcessor.swift",
        "desc": "Extract raw text.",
        "log": "Text extracted."
      },
      {
        "stageIdx": 1,
        "gridX": 0.5,
        "gridY": 2.5,
        "next": [
          5,
          6
        ],
        "badge": "Step 1.1",
        "name": "Semantic Chunker",
        "file": "SemanticChunker.swift",
        "desc": "Deconstruct raw text into chunks.",
        "log": "Split into 18 chunks."
      },
      {
        "stageIdx": 2,
        "gridX": 0.2,
        "gridY": 0.5,
        "next": [
          7
        ],
        "badge": "Step 2a",
        "name": "Metal GPU Vectorizer",
        "file": "GPUComputeService.swift",
        "desc": "SIMD4 batch execution.",
        "log": "Accelerated 18 vectors."
      },
      {
        "stageIdx": 2,
        "gridX": 0.8,
        "gridY": 0.5,
        "next": [
          7
        ],
        "badge": "Step 2b",
        "name": "Lexical Indexer",
        "file": "SQLiteFTS5",
        "desc": "Write metadata.",
        "log": "Index metadata written."
      },
      {
        "stageIdx": 3,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [],
        "badge": "Output",
        "name": "App Entities",
        "file": "StorageManager.swift",
        "desc": "Register App Entities for Siri.",
        "log": "Container updated."
      }
    ]
  },
  "standard_3b": {
    "name": "Standard Strategy [3B AFM Core]",
    "metrics": {
      "latency": "380ms",
      "rate": "90 tok/s",
      "score": "99.1%"
    },
    "stages": [
      "0. Input",
      "1. Retrieve",
      "2. Assemble",
      "3. AFM Inference",
      "4. Verify",
      "5. Output"
    ],
    "steps": [
      {
        "stageIdx": 0,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          1
        ],
        "badge": "Input",
        "name": "User Query",
        "file": "ChatScreen.swift",
        "desc": "User submits query.",
        "log": "Received query."
      },
      {
        "stageIdx": 1,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          2,
          3
        ],
        "badge": "Step 1",
        "name": "Intent Formulation",
        "file": "QueryEnhancement.swift",
        "desc": "Resolve pronouns and expand.",
        "log": "Intent resolved."
      },
      {
        "stageIdx": 1,
        "gridX": 0.2,
        "gridY": 1.5,
        "next": [
          5
        ],
        "badge": "Step 1a",
        "name": "Query Embed",
        "file": "Embedding.swift",
        "desc": "Generate query vector.",
        "log": "Vector generated."
      },
      {
        "stageIdx": 1,
        "gridX": 0.8,
        "gridY": 1.5,
        "next": [
          6
        ],
        "badge": "Step 1b",
        "name": "Keyword Extract",
        "file": "QueryEnhancement.swift",
        "desc": "Extract BM25 terms.",
        "log": "Keywords extracted."
      },
      {
        "stageIdx": 2,
        "gridX": 0.2,
        "gridY": 0.5,
        "next": [
          6
        ],
        "badge": "Step 2a",
        "name": "Metal Vector Search",
        "file": "RAGEngine.swift",
        "desc": "SIMD4 Cosine Similarity.",
        "log": "Found Top 30 vectors."
      },
      {
        "stageIdx": 2,
        "gridX": 0.8,
        "gridY": 0.5,
        "next": [
          6
        ],
        "badge": "Step 2b",
        "name": "BM25 Search",
        "file": "SQLiteFTS5",
        "desc": "Exact keyword lookup.",
        "log": "Found 12 matching rows."
      },
      {
        "stageIdx": 2,
        "gridX": 0.5,
        "gridY": 1.5,
        "next": [
          7
        ],
        "badge": "Step 2.1",
        "name": "Hybrid RRF",
        "file": "RAGEngine.swift",
        "desc": "Reciprocal Rank Fusion.",
        "log": "Indices merged."
      },
      {
        "stageIdx": 2,
        "gridX": 0.5,
        "gridY": 2.5,
        "next": [
          8
        ],
        "badge": "Step 2.2",
        "name": "Context Packing",
        "file": "ContextPacking.swift",
        "desc": "Assemble parent-chunks.",
        "log": "Packed tokens."
      },
      {
        "stageIdx": 3,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          9,
          10
        ],
        "badge": "Step A",
        "name": "LoRA Injection (3B)",
        "file": "SystemLanguageModel",
        "desc": "Inject RAG task adapter into 3B Base Model.",
        "log": "Loaded Adapter."
      },
      {
        "stageIdx": 3,
        "gridX": 0.2,
        "gridY": 1.5,
        "next": [
          12
        ],
        "badge": "Step B",
        "name": "Draft Generation",
        "file": "SpeculativeDecoding",
        "desc": "48M Draft Model candidate tokens.",
        "log": "Drafting sequence."
      },
      {
        "stageIdx": 3,
        "gridX": 0.8,
        "gridY": 1.5,
        "next": [
          13
        ],
        "badge": "Step C",
        "name": "Parallel Verification",
        "file": "SpeculativeDecoding",
        "desc": "3B Base Model verifies sequence.",
        "log": "Candidates verified."
      },
      {
        "stageIdx": 3,
        "gridX": 0.5,
        "gridY": 2.5,
        "next": [
          15
        ],
        "badge": "Step D",
        "name": "Guided Generation",
        "file": "ConstrainedDecoding",
        "desc": "Ensure exact citation schemas.",
        "log": "Schema enforced."
      },
      {
        "stageIdx": 4,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          13,
          14
        ],
        "badge": "Step 4",
        "name": "Semantic Grounding",
        "file": "VerificationGates.swift",
        "desc": "Verify claims exist in context.",
        "log": "Gate PASS."
      },
      {
        "stageIdx": 4,
        "gridX": 0.2,
        "gridY": 1.5,
        "next": [],
        "badge": "Fail",
        "name": "Contradiction Sweep",
        "file": "VerificationGates.swift",
        "desc": "Hallucination check.",
        "log": "ABSTAIN."
      },
      {
        "stageIdx": 4,
        "gridX": 0.8,
        "gridY": 1.5,
        "next": [
          15
        ],
        "badge": "Pass",
        "name": "Contradiction Sweep",
        "file": "VerificationGates.swift",
        "desc": "No logical contradictions.",
        "log": "Gate PASS."
      },
      {
        "stageIdx": 5,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [],
        "badge": "Output",
        "name": "Final Response",
        "file": "UI",
        "desc": "Render with citation markers.",
        "log": "Response delivered."
      }
    ]
  },
  "standard_20b": {
    "name": "Standard Strategy [20B AFM Advanced]",
    "metrics": {
      "latency": "380ms",
      "rate": "90 tok/s",
      "score": "99.1%"
    },
    "stages": [
      "0. Input",
      "1. Retrieve",
      "2. Assemble",
      "3. AFM Inference",
      "4. Verify",
      "5. Output"
    ],
    "steps": [
      {
        "stageIdx": 0,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          1
        ],
        "badge": "Input",
        "name": "User Query",
        "file": "ChatScreen.swift",
        "desc": "User submits query.",
        "log": "Received query."
      },
      {
        "stageIdx": 1,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          2,
          3
        ],
        "badge": "Step 1",
        "name": "Intent Formulation",
        "file": "QueryEnhancement.swift",
        "desc": "Resolve pronouns and expand.",
        "log": "Intent resolved."
      },
      {
        "stageIdx": 1,
        "gridX": 0.2,
        "gridY": 1.5,
        "next": [
          5
        ],
        "badge": "Step 1a",
        "name": "Query Embed",
        "file": "Embedding.swift",
        "desc": "Generate query vector.",
        "log": "Vector generated."
      },
      {
        "stageIdx": 1,
        "gridX": 0.8,
        "gridY": 1.5,
        "next": [
          6
        ],
        "badge": "Step 1b",
        "name": "Keyword Extract",
        "file": "QueryEnhancement.swift",
        "desc": "Extract BM25 terms.",
        "log": "Keywords extracted."
      },
      {
        "stageIdx": 2,
        "gridX": 0.2,
        "gridY": 0.5,
        "next": [
          6
        ],
        "badge": "Step 2a",
        "name": "Metal Vector Search",
        "file": "RAGEngine.swift",
        "desc": "SIMD4 Cosine Similarity.",
        "log": "Found Top 30 vectors."
      },
      {
        "stageIdx": 2,
        "gridX": 0.8,
        "gridY": 0.5,
        "next": [
          6
        ],
        "badge": "Step 2b",
        "name": "BM25 Search",
        "file": "SQLiteFTS5",
        "desc": "Exact keyword lookup.",
        "log": "Found 12 matching rows."
      },
      {
        "stageIdx": 2,
        "gridX": 0.5,
        "gridY": 1.5,
        "next": [
          7
        ],
        "badge": "Step 2.1",
        "name": "Hybrid RRF",
        "file": "RAGEngine.swift",
        "desc": "Reciprocal Rank Fusion.",
        "log": "Indices merged."
      },
      {
        "stageIdx": 2,
        "gridX": 0.5,
        "gridY": 2.5,
        "next": [
          8
        ],
        "badge": "Step 2.2",
        "name": "Context Packing",
        "file": "ContextPacking.swift",
        "desc": "Assemble parent-chunks.",
        "log": "Packed tokens."
      },
      {
        "stageIdx": 3,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          9
        ],
        "badge": "Step A",
        "name": "NAND Flash Paging",
        "file": "UnifiedMemory",
        "desc": "Stream 20B weights from NVMe.",
        "log": "Paging active."
      },
      {
        "stageIdx": 3,
        "gridX": 0.5,
        "gridY": 1.5,
        "next": [
          11,
          12
        ],
        "badge": "Step B",
        "name": "MoE Expert Router",
        "file": "SparseMoE.swift",
        "desc": "Activate 2.8B parameters for query.",
        "log": "MoE active."
      },
      {
        "stageIdx": 3,
        "gridX": 0.2,
        "gridY": 2.5,
        "next": [
          14
        ],
        "badge": "Step C",
        "name": "Draft Generation",
        "file": "SpeculativeDecoding",
        "desc": "48M Draft Model sequence.",
        "log": "Drafting sequence."
      },
      {
        "stageIdx": 3,
        "gridX": 0.8,
        "gridY": 2.5,
        "next": [
          15
        ],
        "badge": "Step D",
        "name": "MoE Verification",
        "file": "SpeculativeDecoding",
        "desc": "20B Base verifies sequence.",
        "log": "Candidates verified."
      },
      {
        "stageIdx": 3,
        "gridX": 0.5,
        "gridY": 3.5,
        "next": [
          17
        ],
        "badge": "Step E",
        "name": "Guided Generation",
        "file": "ConstrainedDecoding",
        "desc": "Ensure exact citation schemas.",
        "log": "Schema enforced."
      },
      {
        "stageIdx": 4,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          14,
          15
        ],
        "badge": "Step 4",
        "name": "Semantic Grounding",
        "file": "VerificationGates.swift",
        "desc": "Verify claims exist in context.",
        "log": "Gate PASS."
      },
      {
        "stageIdx": 4,
        "gridX": 0.2,
        "gridY": 1.5,
        "next": [],
        "badge": "Fail",
        "name": "Contradiction Sweep",
        "file": "VerificationGates.swift",
        "desc": "Hallucination check.",
        "log": "ABSTAIN."
      },
      {
        "stageIdx": 4,
        "gridX": 0.8,
        "gridY": 1.5,
        "next": [
          16
        ],
        "badge": "Pass",
        "name": "Contradiction Sweep",
        "file": "VerificationGates.swift",
        "desc": "No logical contradictions.",
        "log": "Gate PASS."
      },
      {
        "stageIdx": 5,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [],
        "badge": "Output",
        "name": "Final Response",
        "file": "UI",
        "desc": "Render with citation markers.",
        "log": "Response delivered."
      }
    ]
  },
  "standard_cloud": {
    "name": "Standard Strategy [PCC Cloud Pro]",
    "metrics": {
      "latency": "380ms",
      "rate": "90 tok/s",
      "score": "99.1%"
    },
    "stages": [
      "0. Input",
      "1. Retrieve",
      "2. Assemble",
      "3. AFM Inference",
      "4. Verify",
      "5. Output"
    ],
    "steps": [
      {
        "stageIdx": 0,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          1
        ],
        "badge": "Input",
        "name": "User Query",
        "file": "ChatScreen.swift",
        "desc": "User submits query.",
        "log": "Received query."
      },
      {
        "stageIdx": 1,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          2,
          3
        ],
        "badge": "Step 1",
        "name": "Intent Formulation",
        "file": "QueryEnhancement.swift",
        "desc": "Resolve pronouns and expand.",
        "log": "Intent resolved."
      },
      {
        "stageIdx": 1,
        "gridX": 0.2,
        "gridY": 1.5,
        "next": [
          5
        ],
        "badge": "Step 1a",
        "name": "Query Embed",
        "file": "Embedding.swift",
        "desc": "Generate query vector.",
        "log": "Vector generated."
      },
      {
        "stageIdx": 1,
        "gridX": 0.8,
        "gridY": 1.5,
        "next": [
          6
        ],
        "badge": "Step 1b",
        "name": "Keyword Extract",
        "file": "QueryEnhancement.swift",
        "desc": "Extract BM25 terms.",
        "log": "Keywords extracted."
      },
      {
        "stageIdx": 2,
        "gridX": 0.2,
        "gridY": 0.5,
        "next": [
          6
        ],
        "badge": "Step 2a",
        "name": "Metal Vector Search",
        "file": "RAGEngine.swift",
        "desc": "SIMD4 Cosine Similarity.",
        "log": "Found Top 30 vectors."
      },
      {
        "stageIdx": 2,
        "gridX": 0.8,
        "gridY": 0.5,
        "next": [
          6
        ],
        "badge": "Step 2b",
        "name": "BM25 Search",
        "file": "SQLiteFTS5",
        "desc": "Exact keyword lookup.",
        "log": "Found 12 matching rows."
      },
      {
        "stageIdx": 2,
        "gridX": 0.5,
        "gridY": 1.5,
        "next": [
          7
        ],
        "badge": "Step 2.1",
        "name": "Hybrid RRF",
        "file": "RAGEngine.swift",
        "desc": "Reciprocal Rank Fusion.",
        "log": "Indices merged."
      },
      {
        "stageIdx": 2,
        "gridX": 0.5,
        "gridY": 2.5,
        "next": [
          8
        ],
        "badge": "Step 2.2",
        "name": "Context Packing",
        "file": "ContextPacking.swift",
        "desc": "Assemble parent-chunks.",
        "log": "Packed tokens."
      },
      {
        "stageIdx": 3,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          9
        ],
        "badge": "Step A",
        "name": "PCC Escalate",
        "file": "CloudFoundationModel",
        "desc": "Escalate to Apple Private Cloud Compute.",
        "log": "Establishing secure enclave."
      },
      {
        "stageIdx": 3,
        "gridX": 0.5,
        "gridY": 1.5,
        "next": [
          11
        ],
        "badge": "Step B",
        "name": "Secure Payload Transfer",
        "file": "PCCSecurity.swift",
        "desc": "Transmit encrypted 32K token buffer.",
        "log": "Payload received by PCC."
      },
      {
        "stageIdx": 3,
        "gridX": 0.5,
        "gridY": 2.5,
        "next": [
          13
        ],
        "badge": "Step C",
        "name": "Cloud GPU Execution",
        "file": "NVIDIA Enclave",
        "desc": "Execute on Google Cloud GPU compute nodes.",
        "log": "Execution complete. Streaming back."
      },
      {
        "stageIdx": 4,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          12,
          13
        ],
        "badge": "Step 4",
        "name": "Semantic Grounding",
        "file": "VerificationGates.swift",
        "desc": "Verify claims exist in context.",
        "log": "Gate PASS."
      },
      {
        "stageIdx": 4,
        "gridX": 0.2,
        "gridY": 1.5,
        "next": [],
        "badge": "Fail",
        "name": "Contradiction Sweep",
        "file": "VerificationGates.swift",
        "desc": "Hallucination check.",
        "log": "ABSTAIN."
      },
      {
        "stageIdx": 4,
        "gridX": 0.8,
        "gridY": 1.5,
        "next": [
          14
        ],
        "badge": "Pass",
        "name": "Contradiction Sweep",
        "file": "VerificationGates.swift",
        "desc": "No logical contradictions.",
        "log": "Gate PASS."
      },
      {
        "stageIdx": 5,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [],
        "badge": "Output",
        "name": "Final Response",
        "file": "UI",
        "desc": "Render with citation markers.",
        "log": "Response delivered."
      }
    ]
  },
  "deepthink_3b": {
    "name": "Deep Think Strategy [3B AFM Core]",
    "metrics": {
      "latency": "1.8s",
      "rate": "64 tok/s",
      "score": "99.8%"
    },
    "stages": [
      "0. Input",
      "1. Multi-Hop",
      "2. Iterate",
      "3. Inference",
      "4. 8-Gates",
      "5. Output"
    ],
    "steps": [
      {
        "stageIdx": 0,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          1
        ],
        "badge": "Input",
        "name": "User Query",
        "file": "ChatScreen.swift",
        "desc": "User submits query.",
        "log": "Received query."
      },
      {
        "stageIdx": 1,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          2,
          3
        ],
        "badge": "Step 1",
        "name": "Multi-hop Intent",
        "file": "QueryEnhancement.swift",
        "desc": "Deconstruct complex query.",
        "log": "Split into 3 sub-queries."
      },
      {
        "stageIdx": 1,
        "gridX": 0.2,
        "gridY": 1.5,
        "next": [
          5
        ],
        "badge": "Step 1a",
        "name": "Vector Embeddings",
        "file": "Embedding.swift",
        "desc": "Embed all 3 sub-queries.",
        "log": "Vectors generated."
      },
      {
        "stageIdx": 1,
        "gridX": 0.8,
        "gridY": 1.5,
        "next": [
          6
        ],
        "badge": "Step 1b",
        "name": "Keyword Extract",
        "file": "QueryEnhancement.swift",
        "desc": "Extract for 3 sub-queries.",
        "log": "Keywords generated."
      },
      {
        "stageIdx": 2,
        "gridX": 0.2,
        "gridY": 0.5,
        "next": [
          6
        ],
        "badge": "Step 2a",
        "name": "Iterative Vector",
        "file": "RAGEngine.swift",
        "desc": "Search across sub-queries.",
        "log": "Aggregated 90 items."
      },
      {
        "stageIdx": 2,
        "gridX": 0.8,
        "gridY": 0.5,
        "next": [
          6
        ],
        "badge": "Step 2b",
        "name": "Iterative BM25",
        "file": "SQLiteFTS5",
        "desc": "Search across sub-queries.",
        "log": "Aggregated 40 items."
      },
      {
        "stageIdx": 2,
        "gridX": 0.5,
        "gridY": 1.5,
        "next": [
          7
        ],
        "badge": "Step 2.1",
        "name": "Cross-Encoder",
        "file": "ReRanker.swift",
        "desc": "Rescore 130 items.",
        "log": "Filtered to Top 15."
      },
      {
        "stageIdx": 2,
        "gridX": 0.5,
        "gridY": 2.5,
        "next": [
          8
        ],
        "badge": "Step 2.2",
        "name": "Context Packing",
        "file": "ContextPacking.swift",
        "desc": "Parent-chunk resolution.",
        "log": "Packed 3900 tokens."
      },
      {
        "stageIdx": 3,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          9,
          10
        ],
        "badge": "Step A",
        "name": "LoRA Injection (3B)",
        "file": "SystemLanguageModel",
        "desc": "Inject RAG task adapter into 3B Base Model.",
        "log": "Loaded Adapter."
      },
      {
        "stageIdx": 3,
        "gridX": 0.2,
        "gridY": 1.5,
        "next": [
          12
        ],
        "badge": "Step B",
        "name": "Draft Generation",
        "file": "SpeculativeDecoding",
        "desc": "48M Draft Model candidate tokens.",
        "log": "Drafting sequence."
      },
      {
        "stageIdx": 3,
        "gridX": 0.8,
        "gridY": 1.5,
        "next": [
          13
        ],
        "badge": "Step C",
        "name": "Parallel Verification",
        "file": "SpeculativeDecoding",
        "desc": "3B Base Model verifies sequence.",
        "log": "Candidates verified."
      },
      {
        "stageIdx": 3,
        "gridX": 0.5,
        "gridY": 2.5,
        "next": [
          15
        ],
        "badge": "Step D",
        "name": "Guided Generation",
        "file": "ConstrainedDecoding",
        "desc": "Ensure exact citation schemas.",
        "log": "Schema enforced."
      },
      {
        "stageIdx": 4,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          13
        ],
        "badge": "Step 4",
        "name": "8-Gate Verification",
        "file": "VerificationGates.swift",
        "desc": "Logic, math, and hallucination sweeps.",
        "log": "Executing 8 parallel gates."
      },
      {
        "stageIdx": 5,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [],
        "badge": "Output",
        "name": "Synthesized Response",
        "file": "UI",
        "desc": "Render multi-paragraph verified response.",
        "log": "Response Delivered."
      }
    ]
  },
  "deepthink_20b": {
    "name": "Deep Think Strategy [20B AFM Advanced]",
    "metrics": {
      "latency": "1.8s",
      "rate": "64 tok/s",
      "score": "99.8%"
    },
    "stages": [
      "0. Input",
      "1. Multi-Hop",
      "2. Iterate",
      "3. Inference",
      "4. 8-Gates",
      "5. Output"
    ],
    "steps": [
      {
        "stageIdx": 0,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          1
        ],
        "badge": "Input",
        "name": "User Query",
        "file": "ChatScreen.swift",
        "desc": "User submits query.",
        "log": "Received query."
      },
      {
        "stageIdx": 1,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          2,
          3
        ],
        "badge": "Step 1",
        "name": "Multi-hop Intent",
        "file": "QueryEnhancement.swift",
        "desc": "Deconstruct complex query.",
        "log": "Split into 3 sub-queries."
      },
      {
        "stageIdx": 1,
        "gridX": 0.2,
        "gridY": 1.5,
        "next": [
          5
        ],
        "badge": "Step 1a",
        "name": "Vector Embeddings",
        "file": "Embedding.swift",
        "desc": "Embed all 3 sub-queries.",
        "log": "Vectors generated."
      },
      {
        "stageIdx": 1,
        "gridX": 0.8,
        "gridY": 1.5,
        "next": [
          6
        ],
        "badge": "Step 1b",
        "name": "Keyword Extract",
        "file": "QueryEnhancement.swift",
        "desc": "Extract for 3 sub-queries.",
        "log": "Keywords generated."
      },
      {
        "stageIdx": 2,
        "gridX": 0.2,
        "gridY": 0.5,
        "next": [
          6
        ],
        "badge": "Step 2a",
        "name": "Iterative Vector",
        "file": "RAGEngine.swift",
        "desc": "Search across sub-queries.",
        "log": "Aggregated 90 items."
      },
      {
        "stageIdx": 2,
        "gridX": 0.8,
        "gridY": 0.5,
        "next": [
          6
        ],
        "badge": "Step 2b",
        "name": "Iterative BM25",
        "file": "SQLiteFTS5",
        "desc": "Search across sub-queries.",
        "log": "Aggregated 40 items."
      },
      {
        "stageIdx": 2,
        "gridX": 0.5,
        "gridY": 1.5,
        "next": [
          7
        ],
        "badge": "Step 2.1",
        "name": "Cross-Encoder",
        "file": "ReRanker.swift",
        "desc": "Rescore 130 items.",
        "log": "Filtered to Top 15."
      },
      {
        "stageIdx": 2,
        "gridX": 0.5,
        "gridY": 2.5,
        "next": [
          8
        ],
        "badge": "Step 2.2",
        "name": "Context Packing",
        "file": "ContextPacking.swift",
        "desc": "Parent-chunk resolution.",
        "log": "Packed 3900 tokens."
      },
      {
        "stageIdx": 3,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          9
        ],
        "badge": "Step A",
        "name": "NAND Flash Paging",
        "file": "UnifiedMemory",
        "desc": "Stream 20B weights from NVMe.",
        "log": "Paging active."
      },
      {
        "stageIdx": 3,
        "gridX": 0.5,
        "gridY": 1.5,
        "next": [
          11,
          12
        ],
        "badge": "Step B",
        "name": "MoE Expert Router",
        "file": "SparseMoE.swift",
        "desc": "Activate 2.8B parameters for query.",
        "log": "MoE active."
      },
      {
        "stageIdx": 3,
        "gridX": 0.2,
        "gridY": 2.5,
        "next": [
          14
        ],
        "badge": "Step C",
        "name": "Draft Generation",
        "file": "SpeculativeDecoding",
        "desc": "48M Draft Model sequence.",
        "log": "Drafting sequence."
      },
      {
        "stageIdx": 3,
        "gridX": 0.8,
        "gridY": 2.5,
        "next": [
          15
        ],
        "badge": "Step D",
        "name": "MoE Verification",
        "file": "SpeculativeDecoding",
        "desc": "20B Base verifies sequence.",
        "log": "Candidates verified."
      },
      {
        "stageIdx": 3,
        "gridX": 0.5,
        "gridY": 3.5,
        "next": [
          17
        ],
        "badge": "Step E",
        "name": "Guided Generation",
        "file": "ConstrainedDecoding",
        "desc": "Ensure exact citation schemas.",
        "log": "Schema enforced."
      },
      {
        "stageIdx": 4,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          14
        ],
        "badge": "Step 4",
        "name": "8-Gate Verification",
        "file": "VerificationGates.swift",
        "desc": "Logic, math, and hallucination sweeps.",
        "log": "Executing 8 parallel gates."
      },
      {
        "stageIdx": 5,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [],
        "badge": "Output",
        "name": "Synthesized Response",
        "file": "UI",
        "desc": "Render multi-paragraph verified response.",
        "log": "Response Delivered."
      }
    ]
  },
  "deepthink_cloud": {
    "name": "Deep Think Strategy [PCC Cloud Pro]",
    "metrics": {
      "latency": "1.8s",
      "rate": "64 tok/s",
      "score": "99.8%"
    },
    "stages": [
      "0. Input",
      "1. Multi-Hop",
      "2. Iterate",
      "3. Inference",
      "4. 8-Gates",
      "5. Output"
    ],
    "steps": [
      {
        "stageIdx": 0,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          1
        ],
        "badge": "Input",
        "name": "User Query",
        "file": "ChatScreen.swift",
        "desc": "User submits query.",
        "log": "Received query."
      },
      {
        "stageIdx": 1,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          2,
          3
        ],
        "badge": "Step 1",
        "name": "Multi-hop Intent",
        "file": "QueryEnhancement.swift",
        "desc": "Deconstruct complex query.",
        "log": "Split into 3 sub-queries."
      },
      {
        "stageIdx": 1,
        "gridX": 0.2,
        "gridY": 1.5,
        "next": [
          5
        ],
        "badge": "Step 1a",
        "name": "Vector Embeddings",
        "file": "Embedding.swift",
        "desc": "Embed all 3 sub-queries.",
        "log": "Vectors generated."
      },
      {
        "stageIdx": 1,
        "gridX": 0.8,
        "gridY": 1.5,
        "next": [
          6
        ],
        "badge": "Step 1b",
        "name": "Keyword Extract",
        "file": "QueryEnhancement.swift",
        "desc": "Extract for 3 sub-queries.",
        "log": "Keywords generated."
      },
      {
        "stageIdx": 2,
        "gridX": 0.2,
        "gridY": 0.5,
        "next": [
          6
        ],
        "badge": "Step 2a",
        "name": "Iterative Vector",
        "file": "RAGEngine.swift",
        "desc": "Search across sub-queries.",
        "log": "Aggregated 90 items."
      },
      {
        "stageIdx": 2,
        "gridX": 0.8,
        "gridY": 0.5,
        "next": [
          6
        ],
        "badge": "Step 2b",
        "name": "Iterative BM25",
        "file": "SQLiteFTS5",
        "desc": "Search across sub-queries.",
        "log": "Aggregated 40 items."
      },
      {
        "stageIdx": 2,
        "gridX": 0.5,
        "gridY": 1.5,
        "next": [
          7
        ],
        "badge": "Step 2.1",
        "name": "Cross-Encoder",
        "file": "ReRanker.swift",
        "desc": "Rescore 130 items.",
        "log": "Filtered to Top 15."
      },
      {
        "stageIdx": 2,
        "gridX": 0.5,
        "gridY": 2.5,
        "next": [
          8
        ],
        "badge": "Step 2.2",
        "name": "Context Packing",
        "file": "ContextPacking.swift",
        "desc": "Parent-chunk resolution.",
        "log": "Packed 3900 tokens."
      },
      {
        "stageIdx": 3,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          9
        ],
        "badge": "Step A",
        "name": "PCC Escalate",
        "file": "CloudFoundationModel",
        "desc": "Escalate to Apple Private Cloud Compute.",
        "log": "Establishing secure enclave."
      },
      {
        "stageIdx": 3,
        "gridX": 0.5,
        "gridY": 1.5,
        "next": [
          11
        ],
        "badge": "Step B",
        "name": "Secure Payload Transfer",
        "file": "PCCSecurity.swift",
        "desc": "Transmit encrypted 32K token buffer.",
        "log": "Payload received by PCC."
      },
      {
        "stageIdx": 3,
        "gridX": 0.5,
        "gridY": 2.5,
        "next": [
          13
        ],
        "badge": "Step C",
        "name": "Cloud GPU Execution",
        "file": "NVIDIA Enclave",
        "desc": "Execute on Google Cloud GPU compute nodes.",
        "log": "Execution complete. Streaming back."
      },
      {
        "stageIdx": 4,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          12
        ],
        "badge": "Step 4",
        "name": "8-Gate Verification",
        "file": "VerificationGates.swift",
        "desc": "Logic, math, and hallucination sweeps.",
        "log": "Executing 8 parallel gates."
      },
      {
        "stageIdx": 5,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [],
        "badge": "Output",
        "name": "Synthesized Response",
        "file": "UI",
        "desc": "Render multi-paragraph verified response.",
        "log": "Response Delivered."
      }
    ]
  },
  "maximum_3b": {
    "name": "Maximum Strategy [3B AFM Core]",
    "metrics": {
      "latency": "3.5s",
      "rate": "30 tok/s",
      "score": "99.9%"
    },
    "stages": [
      "0. Input",
      "1. Route",
      "2. Sweep",
      "3. Inference",
      "4. Verify",
      "5. Output"
    ],
    "steps": [
      {
        "stageIdx": 0,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          1
        ],
        "badge": "Input",
        "name": "User Query",
        "file": "ChatScreen.swift",
        "desc": "User submits query.",
        "log": "Received query."
      },
      {
        "stageIdx": 1,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          2
        ],
        "badge": "Step 1",
        "name": "Maximum Mode Router",
        "file": "EngineSDK.swift",
        "desc": "Enable exhaustive retrieval routines.",
        "log": "Maximum thresholds enabled."
      },
      {
        "stageIdx": 2,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          3
        ],
        "badge": "Step 2",
        "name": "Deep Hybrid Sweep",
        "file": "RAGEngine.swift",
        "desc": "Exhaustive retrieval across entire corpus.",
        "log": "Retrieved 150 items."
      },
      {
        "stageIdx": 2,
        "gridX": 0.5,
        "gridY": 1.5,
        "next": [
          4
        ],
        "badge": "Step 2.1",
        "name": "32K Context Packing",
        "file": "ContextPacking.swift",
        "desc": "Pack massive context up to 32,000 tokens.",
        "log": "Packed 28,000 tokens."
      },
      {
        "stageIdx": 3,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          5,
          6
        ],
        "badge": "Step A",
        "name": "LoRA Injection (3B)",
        "file": "SystemLanguageModel",
        "desc": "Inject RAG task adapter into 3B Base Model.",
        "log": "Loaded Adapter."
      },
      {
        "stageIdx": 3,
        "gridX": 0.2,
        "gridY": 1.5,
        "next": [
          8
        ],
        "badge": "Step B",
        "name": "Draft Generation",
        "file": "SpeculativeDecoding",
        "desc": "48M Draft Model candidate tokens.",
        "log": "Drafting sequence."
      },
      {
        "stageIdx": 3,
        "gridX": 0.8,
        "gridY": 1.5,
        "next": [
          9
        ],
        "badge": "Step C",
        "name": "Parallel Verification",
        "file": "SpeculativeDecoding",
        "desc": "3B Base Model verifies sequence.",
        "log": "Candidates verified."
      },
      {
        "stageIdx": 3,
        "gridX": 0.5,
        "gridY": 2.5,
        "next": [
          11
        ],
        "badge": "Step D",
        "name": "Guided Generation",
        "file": "ConstrainedDecoding",
        "desc": "Ensure exact citation schemas.",
        "log": "Schema enforced."
      },
      {
        "stageIdx": 4,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          9
        ],
        "badge": "Step 4",
        "name": "Massive Verification",
        "file": "VerificationGates.swift",
        "desc": "Sweep entire 32K context.",
        "log": "Verified."
      },
      {
        "stageIdx": 5,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [],
        "badge": "Output",
        "name": "Verified Response",
        "file": "UI",
        "desc": "Stream final verified answer.",
        "log": "Response Delivered."
      }
    ]
  },
  "maximum_20b": {
    "name": "Maximum Strategy [20B AFM Advanced]",
    "metrics": {
      "latency": "3.5s",
      "rate": "30 tok/s",
      "score": "99.9%"
    },
    "stages": [
      "0. Input",
      "1. Route",
      "2. Sweep",
      "3. Inference",
      "4. Verify",
      "5. Output"
    ],
    "steps": [
      {
        "stageIdx": 0,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          1
        ],
        "badge": "Input",
        "name": "User Query",
        "file": "ChatScreen.swift",
        "desc": "User submits query.",
        "log": "Received query."
      },
      {
        "stageIdx": 1,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          2
        ],
        "badge": "Step 1",
        "name": "Maximum Mode Router",
        "file": "EngineSDK.swift",
        "desc": "Enable exhaustive retrieval routines.",
        "log": "Maximum thresholds enabled."
      },
      {
        "stageIdx": 2,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          3
        ],
        "badge": "Step 2",
        "name": "Deep Hybrid Sweep",
        "file": "RAGEngine.swift",
        "desc": "Exhaustive retrieval across entire corpus.",
        "log": "Retrieved 150 items."
      },
      {
        "stageIdx": 2,
        "gridX": 0.5,
        "gridY": 1.5,
        "next": [
          4
        ],
        "badge": "Step 2.1",
        "name": "32K Context Packing",
        "file": "ContextPacking.swift",
        "desc": "Pack massive context up to 32,000 tokens.",
        "log": "Packed 28,000 tokens."
      },
      {
        "stageIdx": 3,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          5
        ],
        "badge": "Step A",
        "name": "NAND Flash Paging",
        "file": "UnifiedMemory",
        "desc": "Stream 20B weights from NVMe.",
        "log": "Paging active."
      },
      {
        "stageIdx": 3,
        "gridX": 0.5,
        "gridY": 1.5,
        "next": [
          7,
          8
        ],
        "badge": "Step B",
        "name": "MoE Expert Router",
        "file": "SparseMoE.swift",
        "desc": "Activate 2.8B parameters for query.",
        "log": "MoE active."
      },
      {
        "stageIdx": 3,
        "gridX": 0.2,
        "gridY": 2.5,
        "next": [
          10
        ],
        "badge": "Step C",
        "name": "Draft Generation",
        "file": "SpeculativeDecoding",
        "desc": "48M Draft Model sequence.",
        "log": "Drafting sequence."
      },
      {
        "stageIdx": 3,
        "gridX": 0.8,
        "gridY": 2.5,
        "next": [
          11
        ],
        "badge": "Step D",
        "name": "MoE Verification",
        "file": "SpeculativeDecoding",
        "desc": "20B Base verifies sequence.",
        "log": "Candidates verified."
      },
      {
        "stageIdx": 3,
        "gridX": 0.5,
        "gridY": 3.5,
        "next": [
          13
        ],
        "badge": "Step E",
        "name": "Guided Generation",
        "file": "ConstrainedDecoding",
        "desc": "Ensure exact citation schemas.",
        "log": "Schema enforced."
      },
      {
        "stageIdx": 4,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          10
        ],
        "badge": "Step 4",
        "name": "Massive Verification",
        "file": "VerificationGates.swift",
        "desc": "Sweep entire 32K context.",
        "log": "Verified."
      },
      {
        "stageIdx": 5,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [],
        "badge": "Output",
        "name": "Verified Response",
        "file": "UI",
        "desc": "Stream final verified answer.",
        "log": "Response Delivered."
      }
    ]
  },
  "maximum_cloud": {
    "name": "Maximum Strategy [PCC Cloud Pro]",
    "metrics": {
      "latency": "3.5s",
      "rate": "30 tok/s",
      "score": "99.9%"
    },
    "stages": [
      "0. Input",
      "1. Route",
      "2. Sweep",
      "3. Inference",
      "4. Verify",
      "5. Output"
    ],
    "steps": [
      {
        "stageIdx": 0,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          1
        ],
        "badge": "Input",
        "name": "User Query",
        "file": "ChatScreen.swift",
        "desc": "User submits query.",
        "log": "Received query."
      },
      {
        "stageIdx": 1,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          2
        ],
        "badge": "Step 1",
        "name": "Maximum Mode Router",
        "file": "EngineSDK.swift",
        "desc": "Enable exhaustive retrieval routines.",
        "log": "Maximum thresholds enabled."
      },
      {
        "stageIdx": 2,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          3
        ],
        "badge": "Step 2",
        "name": "Deep Hybrid Sweep",
        "file": "RAGEngine.swift",
        "desc": "Exhaustive retrieval across entire corpus.",
        "log": "Retrieved 150 items."
      },
      {
        "stageIdx": 2,
        "gridX": 0.5,
        "gridY": 1.5,
        "next": [
          4
        ],
        "badge": "Step 2.1",
        "name": "32K Context Packing",
        "file": "ContextPacking.swift",
        "desc": "Pack massive context up to 32,000 tokens.",
        "log": "Packed 28,000 tokens."
      },
      {
        "stageIdx": 3,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          5
        ],
        "badge": "Step A",
        "name": "PCC Escalate",
        "file": "CloudFoundationModel",
        "desc": "Escalate to Apple Private Cloud Compute.",
        "log": "Establishing secure enclave."
      },
      {
        "stageIdx": 3,
        "gridX": 0.5,
        "gridY": 1.5,
        "next": [
          7
        ],
        "badge": "Step B",
        "name": "Secure Payload Transfer",
        "file": "PCCSecurity.swift",
        "desc": "Transmit encrypted 32K token buffer.",
        "log": "Payload received by PCC."
      },
      {
        "stageIdx": 3,
        "gridX": 0.5,
        "gridY": 2.5,
        "next": [
          9
        ],
        "badge": "Step C",
        "name": "Cloud GPU Execution",
        "file": "NVIDIA Enclave",
        "desc": "Execute on Google Cloud GPU compute nodes.",
        "log": "Execution complete. Streaming back."
      },
      {
        "stageIdx": 4,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [
          8
        ],
        "badge": "Step 4",
        "name": "Massive Verification",
        "file": "VerificationGates.swift",
        "desc": "Sweep entire 32K context.",
        "log": "Verified."
      },
      {
        "stageIdx": 5,
        "gridX": 0.5,
        "gridY": 0.5,
        "next": [],
        "badge": "Output",
        "name": "Verified Response",
        "file": "UI",
        "desc": "Stream final verified answer.",
        "log": "Response Delivered."
      }
    ]
  }
};

let activeDebuggerTrack = "standard";
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
    node.style.top = `${gridY * 65 + 20}px`;

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

function highlightCode(code) {
  return code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/(\/\/.*)/g, '<span class="code-comment">$1</span>')
    .replace(/(".*?")/g, '<span class="code-string">$1</span>')
    .replace(/(#\w+)/g, '<span class="code-preprocessor">$1</span>')
    .replace(/\b(import|class|struct|let|var|func|return|if|else|guard|try|await|throws|init|weak|self|device|kernel|void|uint|float|float32|for|in|while|do)\b/g, '<span class="code-keyword">$1</span>')
    .replace(/\b(Int|Float|Double|String|Bool|URL|Data|PDFDocument|PDFPage|UIDocumentPickerViewController|NLTagger|NaturalLanguage|Workspace|TelemetryWrapper|SQLiteDatabase|Float32|Metal|Device|CommandQueue|Buffer|Texture)\b/g, '<span class="code-type">$1</span>')
    .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="code-number">$1</span>');
}

function getEngineCode(step) {
  const file = step.file || "";
  const name = step.name || "";
  
  if (file.includes("DocumentPicker") || name.includes("Upload")) {
    return `import UIKit\n\n// Initialize sandboxed file picker\nlet picker = UIDocumentPickerViewController(\n    forOpeningContentTypes: [.pdf, .text, .data]\n)\npicker.delegate = self\npresent(picker, animated: true)\n\n// Callback on selection\nfunc documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {\n    guard let url = urls.first else { return }\n    let sandboxGranted = url.startAccessingSecurityScopedResource()\n    engine.ingest(url: url)\n}`;
  }
  
  if (file.includes("DocumentProcessor")) {
    return `import PDFKit\nimport Vision\n\n// Process document and fall back to high-res Vision OCR if needed\nlet document = PDFDocument(url: fileURL)\nvar rawText = ""\n\nfor i in 0..<document.pageCount {\n    if let page = document.page(at: i) {\n        let pageText = page.string ?? ""\n        if pageText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {\n            // Scan page using Vision Framework at high-contrast scale\n            rawText += try await performVisionOCR(page: page, scale: 6.0)\n        } else {\n            rawText += pageText\n        }\n    }\n}`;
  }
  
  if (file.includes("SemanticChunker")) {
    return `// Split raw text into context-aware semantic fragments\nlet chunker = SemanticChunker(maxWordsPerChunk: 310)\nlet sentences = TextUtils.splitSentences(text: rawText)\n\nvar currentChunk: [String] = []\nfor sentence in sentences {\n    currentChunk.append(sentence)\n    if currentChunk.wordCount >= 310 || sentence.isSectionMarker {\n        let chunk = Chunk(sentences: currentChunk, context: activeSectionHeader)\n        workspace.register(chunk)\n        currentChunk.removeAll()\n    }\n}`;
  }
  
  if (file.includes("NLTagger")) {
    return `import NaturalLanguage\n\n// Extract Named Entities (Locations, Models, Organizations)\nlet tagger = NLTagger(tagSchemes: [.nameType])\ntagger.string = chunk.text\n\ntagger.enumerateTags(in: tagger.string!.startIndex..<tagger.string!.endIndex,\n                     scheme: .nameType, options: [.omitWhitespace, .joinNames]) { tag, range in\n    if let tag = tag {\n        let entity = String(tagger.string![range])\n        let normalizedKey = StringNormalizer.toPascalCase(entity)\n        chunk.metadata[tag.rawValue] = normalizedKey\n    }\n    return true\n}`;
  }
  
  if (file.includes("SQLite") || file.includes("FTS5") || name.includes("Index")) {
    return `// Create virtual FTS5 table with Porter Stemming tokenizer\ntry db.execute("""\n  CREATE VIRTUAL TABLE IF NOT EXISTS doc_index USING fts5(\n    chunk_id, \n    content, \n    entities, \n    tokenize='porter'\n  );\n""")\n\n// Insert values\ntry db.execute("""\n  INSERT INTO doc_index (chunk_id, content, entities) \n  VALUES (?, ?, ?);\n""", [chunk.id, chunk.text, chunk.entities.joined(separator: ", ")])`;
  }
  
  if (file.includes("Metal") || file.includes("Shader") || name.includes("Metal") || name.includes("Matrix")) {
    return `#include <metal_stdlib>\nusing namespace metal;\n\n// Kernel shader executing parallelized matrix multiplications on Apple Silicon GPU\nkernel void matrix_multiply_embeddings(\n    device const float* inputs      [[ buffer(0) ]],\n    device const float* weights     [[ buffer(1) ]],\n    device float* outputs           [[ buffer(2) ]],\n    uint2 id                        [[ thread_position_in_grid ]]) \n{\n    float sum = 0.0;\n    for (int k = 0; k < 128; k++) {\n        sum += inputs[id.y * 128 + k] * weights[k * 128 + id.x];\n    }\n    outputs[id.y * 128 + id.x] = sum;\n}`;
  }
  
  if (file.includes("Token") || name.includes("Token")) {
    return `// Run tokenizer model and construct vocabulary indices\nlet tokenizer = BPETokenizer(vocabulary: localVocab)\nlet inputTokens = tokenizer.encode(text: query.text)\n\n// Context limit check\nguard inputTokens.count <= 2048 else {\n    throw EngineError.contextOverflow\n}`;
  }
  
  if (name.includes("Embedding") || file.includes("CoreML") || file.includes("MLModel")) {
    return `import CoreML\n\n// Query local ML embedding model via Neural Engine (ANE)\nlet config = MLModelConfiguration()\nconfig.computeUnits = .all // Allows CPU, GPU, and Neural Engine (ANE)\nlet embeddingModel = try MobileBERTEmbeddings(configuration: config)\n\nlet inputFeatures = try MLMultiArray(shape: [1, 512], dataType: .float32)\nlet output = try embeddingModel.prediction(input: inputFeatures)\nlet vector: [Float32] = output.embeddings.toArray()`;
  }
  
  if (name.includes("RAG") || name.includes("Vector") || file.includes("Vector")) {
    return `// Vector Cosine Similarity Search on SQLite float arrays\nfunc cosineSimilarity(_ a: [Float32], _ b: [Float32]) -> Float32 {\n    let dotProduct = zip(a, b).map(*).reduce(0, +)\n    let magnitudeA = sqrt(a.map { $0 * $0 }.reduce(0, +))\n    let magnitudeB = sqrt(b.map { $0 * $0 }.reduce(0, +))\n    return dotProduct / (magnitudeA * magnitudeB)\n}\n\nlet results = workspace.vectors.map {\n    (chunkId: $0.id, score: cosineSimilarity(queryVector, $0.vector))\n}.sorted { $0.score > $1.score }`;
  }
  
  if (name.includes("Prune") || name.includes("Filter")) {
    return `// Apply threshold-based similarity pruning to prevent context bloat\nlet similarityThreshold: Float32 = 0.72\nlet prunedResults = searchResults.filter { $0.score >= similarityThreshold }\n\n// Deduplicate redundant siblings\nlet uniqueContext = ContextDeduplicator.removeSiblings(prunedResults)\nlet contextBlocks = uniqueContext.prefix(5) // Limit to top 5 blocks`;
  }
  
  if (name.includes("Format") || name.includes("Context")) {
    return `// Format unified LLM prompt payload incorporating system instructions and search context\nvar prompt = "<|system|>\\nUse the following reference blocks to answer: \\n"\nfor (idx, block) in contextBlocks.enumerated() {\n    prompt += "Block [\\(idx + 1)]:\\n\\(block.text)\\n"\n}\nprompt += "<|user|>\\n\\(userQuery)\\n<|assistant|>\\n"`;
  }
  
  if (name.includes("LLM") || file.includes("LanguageModel") || file.includes("Session")) {
    return `import Foundation\n\n// Initialize LanguageModelSession and begin model streaming\nlet session = LanguageModelSession(modelName: "AFM-3B-Instruct")\nlet responseStream = try await session.generateStream(prompt: prompt)\n\nfor try await token in responseStream {\n    print("Token: \\(token)")\n    ui.append(token: token)\n}`;
  }
  
  if (file.includes("Calibrator") || name.includes("Calibration")) {
    return `// Confidence scale and temperature adjustment based on entropy\nlet calibrator = ConfidenceCalibrator()\nlet confidence = calibrator.calculateEntropy(logits: predictionLogits)\n\n// Scale logits temperature dynamically to prevent hallucination\nlet scaledLogits = predictionLogits.map { $0 / (confidence > 0.85 ? 1.0 : 1.25) }\nlet finalToken = MathUtils.softmax(scaledLogits)`;
  }
  
  return `import Foundation\n\n// Implementation for ${name}\nclass ${name.replace(/\s+/g, "")}Service {\n    let file = "${file}"\n    \n    func execute(context: Context) async throws -> Result {\n        print("[Trace] Running ${name}...")\n        // Engine trace operations\n        return .success\n    }\n}`;
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
  const codeEl = document.getElementById("hud-code");

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
  if (codeEl) {
    const rawCode = getEngineCode(step);
    codeEl.innerHTML = highlightCode(rawCode);
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
  const codeEl = document.getElementById("hud-code");
  if (codeEl) codeEl.innerHTML = '<span class="code-comment">// Select a step to inspect source code.</span>';

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

  // We no longer toggle single buttons here, we manage segmented controls in initPlayground.

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

let currentStrategy = 'standard';
let currentTarget = '3b';

function initPlayground() {
  const stratBtns = document.querySelectorAll('#strategy-control .segment');
  const targetBtns = document.querySelectorAll('#target-control .segment');
  const ingestBtn = document.getElementById('ingestion-btn');

  function updateTrack() {
    if (currentStrategy === 'ingestion') {
      switchTrack('ingestion');
    } else {
      switchTrack(`${currentStrategy}_${currentTarget}`);
    }
  }

  stratBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentStrategy = btn.dataset.strategy;
      stratBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      ingestBtn.classList.remove('active');
      updateTrack();
    });
  });

  targetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentTarget = btn.dataset.target;
      targetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // If we were on ingestion, default back to standard
      if (currentStrategy === 'ingestion') {
        currentStrategy = 'standard';
        stratBtns.forEach(b => b.classList.remove('active'));
        document.querySelector('#strategy-control .segment[data-strategy="standard"]').classList.add('active');
        ingestBtn.classList.remove('active');
      }
      
      updateTrack();
    });
  });

  if (ingestBtn) {
    ingestBtn.addEventListener('click', () => {
      currentStrategy = 'ingestion';
      stratBtns.forEach(b => b.classList.remove('active'));
      ingestBtn.classList.add('active');
      updateTrack();
    });
  }

  // Bind run button click
  const runBtn = document.getElementById("run-pipeline-btn");
  if (runBtn) {
    runBtn.addEventListener("click", runPipeline);
  }

  // Bind speed slider
  setupSpeedSlider();

  // Watch for resize events to adjust connections SVG
  window.addEventListener("resize", drawConnections);

  // Initial draw: default to standard execution pipeline
  switchTrack("standard");
}

forceFreshStylesheet();

// --- NOTION ROADMAP SYNC ---
async function fetchRoadmap() {
  try {
    const response = await fetch(`roadmap.json?v=${new Date().getTime()}`);
    if (!response.ok) {
      console.warn('Roadmap JSON not found. Run the GitHub sync action.');
      return;
    }
    const data = await response.json();
    
    const inProgressCol = document.querySelector('#roadmap-inprogress .roadmap-cards');
    const todoCol = document.querySelector('#roadmap-todo .roadmap-cards');
    const shippedCol = document.querySelector('#roadmap-shipped .roadmap-cards');
    
    if (!inProgressCol || !todoCol || !shippedCol) return;

    // Clear loading states
    inProgressCol.innerHTML = '';
    todoCol.innerHTML = '';
    shippedCol.innerHTML = '';

    data.items.forEach(item => {
      // Create Card
      const card = document.createElement('div');
      card.className = 'roadmap-card';
      
      const badgeClass = item.priority.toLowerCase() === 'high' ? 'high' : 
                         item.priority.toLowerCase() === 'medium' ? 'medium' : 'low';
                         
      const osBadgeClass = item.target_os.includes('26.5 Only') ? 'ios-macos-26-5-only' : 
                           item.target_os.includes('27') ? 'ios-macos-27-only' : 'all-26-5-27';

      card.innerHTML = `
        <div class="card-name">${item.name}</div>
        <div class="card-meta">
          <span class="badge ${badgeClass}">${item.priority}</span>
          <span class="badge ${osBadgeClass}">${item.target_os.replace('iOS/macOS ', '')}</span>
        </div>
      `;

      // Assign to column
      if (item.status === 'In Progress') {
        inProgressCol.appendChild(card);
      } else if (item.status === 'Shipped' || item.status === 'Completed') {
        shippedCol.appendChild(card);
      } else {
        todoCol.appendChild(card);
      }
    });
  } catch (err) {
    console.error('Failed to load roadmap:', err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupSmoothRouting();
  setupRevealState();
  initPlayground();
  fetchRoadmap();
  stampRuntimeReady();
});
