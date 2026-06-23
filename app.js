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
standard: {
    "name": "Standard Mode (32 Steps - Fast, Single Pass)",
    "metrics": {
        "latency": "312ms",
        "rate": "128 tok/s",
        "score": "98.7%"
    },
    "stages": [
        "0. Input",
        "1. Analyze",
        "2. Search",
        "3. Assemble",
        "4. Generate",
        "5. Verify",
        "6. Output"
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
            "gridY": 0.0,
            "next": [
                2
            ],
            "badge": "Step 1",
            "name": "Corpus Analysis",
            "file": "OpenIntelligenceEngine.swift",
            "desc": "Scan vocab.",
            "log": "Found 12 keywords."
        },
        {
            "stageIdx": 1,
            "gridX": 0.5,
            "gridY": 1.0,
            "next": [
                3
            ],
            "badge": "Step 1.1",
            "name": "Memory Injection",
            "file": "ConversationMemoryService.swift",
            "desc": "Inject last 5 turns.",
            "log": "Injected 5 turns."
        },
        {
            "stageIdx": 1,
            "gridX": 0.5,
            "gridY": 2.0,
            "next": [
                4
            ],
            "badge": "Step 1.2",
            "name": "Query Parsing",
            "file": "QueryParser.swift",
            "desc": "Pronoun resolution.",
            "log": "Pronouns resolved."
        },
        {
            "stageIdx": 1,
            "gridX": 0.5,
            "gridY": 3.0,
            "next": [
                5
            ],
            "badge": "Step 1.3",
            "name": "Intent Classifier",
            "file": "QueryEnhancementService.swift",
            "desc": "Classify intent.",
            "log": "Intent: lookup."
        },
        {
            "stageIdx": 1,
            "gridX": 0.5,
            "gridY": 4.0,
            "next": [
                6
            ],
            "badge": "Step 1.4",
            "name": "Model Router",
            "file": "FoundationModelPreference.swift",
            "desc": "Route to tier.",
            "log": "Tier: 3B Core."
        },
        {
            "stageIdx": 1,
            "gridX": 0.5,
            "gridY": 5.0,
            "next": [
                7
            ],
            "badge": "Step 1.5",
            "name": "Query Embedding",
            "file": "EmbeddingService.swift",
            "desc": "Generate 384-dim vector.",
            "log": "Generated vector."
        },
        {
            "stageIdx": 1,
            "gridX": 0.5,
            "gridY": 6.0,
            "next": [
                8,
                9
            ],
            "badge": "Step 1.6",
            "name": "RAPTOR Routing",
            "file": "QueryRouterService.swift",
            "desc": "Decide tree level.",
            "log": "Routed to L1."
        },
        {
            "stageIdx": 2,
            "gridX": 0.2,
            "gridY": 1.5,
            "next": [
                10
            ],
            "badge": "Step 2a",
            "name": "Vector Search",
            "file": "RAGEngine.swift",
            "desc": "Cosine similarity.",
            "log": "Top 30 vectors."
        },
        {
            "stageIdx": 2,
            "gridX": 0.2,
            "gridY": 3.5,
            "next": [
                10
            ],
            "badge": "Step 2b",
            "name": "BM25 Search",
            "file": "SQLiteFullTextService.swift",
            "desc": "Keyword lookup.",
            "log": "Found 12 records."
        },
        {
            "stageIdx": 2,
            "gridX": 0.8,
            "gridY": 2.5,
            "next": [
                11
            ],
            "badge": "Step 2.5",
            "name": "Hybrid RRF",
            "file": "RAGEngine.swift",
            "desc": "Reciprocal Rank Fusion.",
            "log": "Merged indices."
        },
        {
            "stageIdx": 2,
            "gridX": 0.5,
            "gridY": 4.0,
            "next": [
                12
            ],
            "badge": "Step 3",
            "name": "ReRanker",
            "file": "ReRankerModel.mlpackage",
            "desc": "TinyBERT rescoring.",
            "log": "Rescored 30 items."
        },
        {
            "stageIdx": 2,
            "gridX": 0.5,
            "gridY": 5.0,
            "next": [
                13
            ],
            "badge": "Step 3.1",
            "name": "Low-Conf Filter",
            "file": "RetrievalPolicyService.swift",
            "desc": "Drop below 0.28.",
            "log": "Dropped 8 outliers."
        },
        {
            "stageIdx": 2,
            "gridX": 0.5,
            "gridY": 6.0,
            "next": [
                14
            ],
            "badge": "Step 3.2",
            "name": "Source Diversity",
            "file": "RAGEngine.swift",
            "desc": "Document capping.",
            "log": "Balanced coverage."
        },
        {
            "stageIdx": 2,
            "gridX": 0.5,
            "gridY": 7.0,
            "next": [
                15
            ],
            "badge": "Step 3.3",
            "name": "MMR Diversify",
            "file": "RAGEngine.swift",
            "desc": "Lambda: 0.60.",
            "log": "Selected 8 diverse chunks."
        },
        {
            "stageIdx": 3,
            "gridX": 0.5,
            "gridY": 1.5,
            "next": [
                16
            ],
            "badge": "Step 4",
            "name": "ParentDoc",
            "file": "ParentDocumentService.swift",
            "desc": "\u00b12 siblings.",
            "log": "Expanded to 24 chunks."
        },
        {
            "stageIdx": 3,
            "gridX": 0.5,
            "gridY": 3.5,
            "next": [
                17
            ],
            "badge": "Step 4.1",
            "name": "Graph Pack",
            "file": "ContextPackingService.swift",
            "desc": "Budget check.",
            "log": "Fits in budget."
        },
        {
            "stageIdx": 3,
            "gridX": 0.5,
            "gridY": 5.5,
            "next": [
                18,
                19
            ],
            "badge": "Step 4.2",
            "name": "LIM Sort",
            "file": "RAGEngine.swift",
            "desc": "Lost-in-middle interleave.",
            "log": "Array ordered."
        },
        {
            "stageIdx": 4,
            "gridX": 0.2,
            "gridY": 1.5,
            "next": [
                20
            ],
            "badge": "Step 5a",
            "name": "ExtQA / Summarize",
            "file": "RAGEngine.swift",
            "desc": "Direct fact lookup.",
            "log": "Fact extracted."
        },
        {
            "stageIdx": 4,
            "gridX": 0.8,
            "gridY": 1.5,
            "next": [
                20
            ],
            "badge": "Step 5b",
            "name": "AFM Inference",
            "file": "LanguageModelSession",
            "desc": "Foundation model draft.",
            "log": "Drafting..."
        },
        {
            "stageIdx": 4,
            "gridX": 0.5,
            "gridY": 3.5,
            "next": [
                21
            ],
            "badge": "Step 5.5",
            "name": "Format Check",
            "file": "RAGService.swift",
            "desc": "Regex formatting.",
            "log": "Validated markdown."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 0.0,
            "next": [
                22
            ],
            "badge": "Gate A",
            "name": "Retrieval Confidence",
            "file": "VerificationGateService.swift",
            "desc": "Check max(chunk_scores) >= \u03c4",
            "log": "Gate A Passed."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 1.0,
            "next": [
                23
            ],
            "badge": "Gate B",
            "name": "Evidence Coverage",
            "file": "VerificationGateService.swift",
            "desc": "Claims trace to evidence.",
            "log": "Gate B Passed."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 2.0,
            "next": [
                24
            ],
            "badge": "Gate C",
            "name": "Numeric Sanity",
            "file": "VerificationGateService.swift",
            "desc": "Numbers match source documents.",
            "log": "Gate C Passed."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 3.0,
            "next": [
                25
            ],
            "badge": "Gate D",
            "name": "Contradiction Sweep",
            "file": "VerificationGateService.swift",
            "desc": "Detect conflicting evidence.",
            "log": "Gate D Passed."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 4.0,
            "next": [
                26
            ],
            "badge": "Gate E",
            "name": "Semantic Grounding",
            "file": "VerificationGateService.swift",
            "desc": "Cosine similarity to source > 0.50.",
            "log": "Gate E Passed."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 5.0,
            "next": [
                27
            ],
            "badge": "Gate F",
            "name": "Quote Faithfulness",
            "file": "VerificationGateService.swift",
            "desc": "Abbreviation cross-contamination check.",
            "log": "Gate F Passed."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 6.0,
            "next": [
                28
            ],
            "badge": "Gate G",
            "name": "Generation Quality",
            "file": "VerificationGateService.swift",
            "desc": "Degeneration and repetition check.",
            "log": "Gate G Passed."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 7.0,
            "next": [
                29
            ],
            "badge": "Gate H",
            "name": "Answer Completeness",
            "file": "VerificationGateService.swift",
            "desc": "Detect under-supported multi-hop answers.",
            "log": "Gate H Passed."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 8.0,
            "next": [
                30
            ],
            "badge": "Gate I",
            "name": "Domain Isolation",
            "file": "VerificationGateService.swift",
            "desc": "Reject mixed-domain evidence synthesis.",
            "log": "Gate I Passed (Threshold 0.5)."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 9.0,
            "next": [
                31
            ],
            "badge": "Step 6.9",
            "name": "Calibration",
            "file": "ConfidenceCalibrationService.swift",
            "desc": "Platt scaling.",
            "log": "Trust: 98.7%."
        },
        {
            "stageIdx": 6,
            "gridX": 0.5,
            "gridY": 1.5,
            "next": [],
            "badge": "Output",
            "name": "Response Package",
            "file": "TelemetryWrapper.swift",
            "desc": "Finalize package.",
            "log": "Sent to engine."
        }
    ]
},
  deepthink: {
    "name": "Deep Think Mode (35 Steps - Iterative LLM Routing)",
    "metrics": {
        "latency": "1850ms",
        "rate": "112 tok/s",
        "score": "99.8%"
    },
    "stages": [
        "0. Input",
        "1. Analyze",
        "2. Search",
        "3. Assemble",
        "4. Generate",
        "5. Verify",
        "6. Output"
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
            "gridY": 0.0,
            "next": [
                2
            ],
            "badge": "Step 1",
            "name": "Corpus Analysis",
            "file": "OpenIntelligenceEngine.swift",
            "desc": "Scan vocab.",
            "log": "Scanned vocab."
        },
        {
            "stageIdx": 1,
            "gridX": 0.5,
            "gridY": 1.0,
            "next": [
                3
            ],
            "badge": "Step 1.1",
            "name": "Memory Injection",
            "file": "ConversationMemoryService.swift",
            "desc": "Inject last 10 turns.",
            "log": "Injected 10 turns."
        },
        {
            "stageIdx": 1,
            "gridX": 0.5,
            "gridY": 2.0,
            "next": [
                4
            ],
            "badge": "Step 1.2",
            "name": "Query Parsing",
            "file": "QueryParser.swift",
            "desc": "Pronoun resolution.",
            "log": "Pronouns resolved."
        },
        {
            "stageIdx": 1,
            "gridX": 0.5,
            "gridY": 3.0,
            "next": [
                5
            ],
            "badge": "Step 1.3",
            "name": "HyDE Generator",
            "file": "HyDE.swift",
            "desc": "Hallucinate hypothesis.",
            "log": "Generated hypothesis."
        },
        {
            "stageIdx": 1,
            "gridX": 0.5,
            "gridY": 4.0,
            "next": [
                6
            ],
            "badge": "Step 1.4",
            "name": "Query Expansion",
            "file": "QueryRewriterService.swift",
            "desc": "8 variants.",
            "log": "Expanded 8 synonyms."
        },
        {
            "stageIdx": 1,
            "gridX": 0.5,
            "gridY": 5.0,
            "next": [
                7
            ],
            "badge": "Step 1.5",
            "name": "Intent Classifier",
            "file": "QueryEnhancementService.swift",
            "desc": "Classify.",
            "log": "Intent identified."
        },
        {
            "stageIdx": 1,
            "gridX": 0.5,
            "gridY": 6.0,
            "next": [
                8
            ],
            "badge": "Step 1.6",
            "name": "Model Router",
            "file": "FoundationModelPreference.swift",
            "desc": "Route tier.",
            "log": "Tier: 20B Advanced."
        },
        {
            "stageIdx": 1,
            "gridX": 0.5,
            "gridY": 7.0,
            "next": [
                9
            ],
            "badge": "Step 1.7",
            "name": "Agentic Loop Init",
            "file": "AgenticOrchestrator.swift",
            "desc": "Start iteration loop.",
            "log": "Pass 1 started."
        },
        {
            "stageIdx": 1,
            "gridX": 0.5,
            "gridY": 8.0,
            "next": [
                10
            ],
            "badge": "Step 1.8",
            "name": "Query Embedding",
            "file": "EmbeddingService.swift",
            "desc": "Vector gen.",
            "log": "Generated vectors."
        },
        {
            "stageIdx": 1,
            "gridX": 0.5,
            "gridY": 9.0,
            "next": [
                11,
                12
            ],
            "badge": "Step 1.9",
            "name": "RAPTOR Routing",
            "file": "QueryRouterService.swift",
            "desc": "Tree routing.",
            "log": "Routed to chunks."
        },
        {
            "stageIdx": 2,
            "gridX": 0.2,
            "gridY": 1.5,
            "next": [
                13
            ],
            "badge": "Step 2a",
            "name": "Vector Search",
            "file": "RAGEngine.swift",
            "desc": "Top 35 vectors.",
            "log": "Found 35 vectors."
        },
        {
            "stageIdx": 2,
            "gridX": 0.2,
            "gridY": 3.5,
            "next": [
                13
            ],
            "badge": "Step 2b",
            "name": "BM25 Search",
            "file": "SQLiteFullTextService.swift",
            "desc": "Keywords.",
            "log": "Found 18 records."
        },
        {
            "stageIdx": 2,
            "gridX": 0.8,
            "gridY": 2.5,
            "next": [
                14
            ],
            "badge": "Step 2.5",
            "name": "Hybrid RRF",
            "file": "RAGEngine.swift",
            "desc": "Merge.",
            "log": "Merged indices."
        },
        {
            "stageIdx": 2,
            "gridX": 0.5,
            "gridY": 4.5,
            "next": [
                15
            ],
            "badge": "Step 3",
            "name": "ReRanker",
            "file": "ReRankerModel.mlpackage",
            "desc": "Rescore.",
            "log": "Rescored items."
        },
        {
            "stageIdx": 2,
            "gridX": 0.5,
            "gridY": 5.5,
            "next": [
                16
            ],
            "badge": "Step 3.1",
            "name": "Low-Conf Filter",
            "file": "RetrievalPolicyService.swift",
            "desc": "Floor 0.25.",
            "log": "Filtered bad chunks."
        },
        {
            "stageIdx": 2,
            "gridX": 0.5,
            "gridY": 6.5,
            "next": [
                17
            ],
            "badge": "Step 3.2",
            "name": "Source Diversity",
            "file": "RAGEngine.swift",
            "desc": "Cap files.",
            "log": "Capped source files."
        },
        {
            "stageIdx": 2,
            "gridX": 0.5,
            "gridY": 7.5,
            "next": [
                18
            ],
            "badge": "Step 3.3",
            "name": "MMR Diversify",
            "file": "RAGEngine.swift",
            "desc": "Lambda 0.55.",
            "log": "Applied MMR."
        },
        {
            "stageIdx": 3,
            "gridX": 0.5,
            "gridY": 1.0,
            "next": [
                19
            ],
            "badge": "Step 4",
            "name": "ParentDoc",
            "file": "ParentDocumentService.swift",
            "desc": "\u00b13 siblings.",
            "log": "Added context siblings."
        },
        {
            "stageIdx": 3,
            "gridX": 0.5,
            "gridY": 3.0,
            "next": [
                20
            ],
            "badge": "Step 4.1",
            "name": "LLM Compression",
            "file": "ContextualCompressionService.swift",
            "desc": "Filter sentences.",
            "log": "Stripped filler sentences."
        },
        {
            "stageIdx": 3,
            "gridX": 0.5,
            "gridY": 5.0,
            "next": [
                21
            ],
            "badge": "Step 4.2",
            "name": "Graph Pack",
            "file": "ContextPackingService.swift",
            "desc": "Validate size.",
            "log": "Budget fits."
        },
        {
            "stageIdx": 3,
            "gridX": 0.5,
            "gridY": 7.0,
            "next": [
                22
            ],
            "badge": "Step 4.3",
            "name": "LIM Sort",
            "file": "RAGEngine.swift",
            "desc": "Interleave.",
            "log": "Array interleaved."
        },
        {
            "stageIdx": 4,
            "gridX": 0.5,
            "gridY": 1.5,
            "next": [
                23
            ],
            "badge": "Step 5",
            "name": "AFM Inference",
            "file": "LanguageModelSession",
            "desc": "Draft.",
            "log": "Draft generated."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 0.0,
            "next": [
                24
            ],
            "badge": "Gate A",
            "name": "Retrieval Confidence",
            "file": "VerificationGateService.swift",
            "desc": "Check max(chunk_scores) >= \u03c4",
            "log": "Gate A Passed."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 1.0,
            "next": [
                25
            ],
            "badge": "Gate B",
            "name": "Evidence Coverage",
            "file": "VerificationGateService.swift",
            "desc": "Claims trace to evidence.",
            "log": "Gate B Passed."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 2.0,
            "next": [
                26
            ],
            "badge": "Gate C",
            "name": "Numeric Sanity",
            "file": "VerificationGateService.swift",
            "desc": "Numbers match source documents.",
            "log": "Gate C Passed."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 3.0,
            "next": [
                27
            ],
            "badge": "Gate D",
            "name": "Contradiction Sweep",
            "file": "VerificationGateService.swift",
            "desc": "Detect conflicting evidence.",
            "log": "Gate D Passed."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 4.0,
            "next": [
                28
            ],
            "badge": "Gate E",
            "name": "Semantic Grounding",
            "file": "VerificationGateService.swift",
            "desc": "Cosine similarity to source > 0.50.",
            "log": "Gate E Passed."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 5.0,
            "next": [
                29
            ],
            "badge": "Gate F",
            "name": "Quote Faithfulness",
            "file": "VerificationGateService.swift",
            "desc": "Abbreviation cross-contamination check.",
            "log": "Gate F Passed."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 6.0,
            "next": [
                30
            ],
            "badge": "Gate G",
            "name": "Generation Quality",
            "file": "VerificationGateService.swift",
            "desc": "Degeneration and repetition check.",
            "log": "Gate G Passed."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 7.0,
            "next": [
                31
            ],
            "badge": "Gate H",
            "name": "Answer Completeness",
            "file": "VerificationGateService.swift",
            "desc": "Detect under-supported multi-hop answers.",
            "log": "Gate H Passed."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 8.0,
            "next": [
                32
            ],
            "badge": "Gate I",
            "name": "Domain Isolation",
            "file": "VerificationGateService.swift",
            "desc": "Reject mixed-domain evidence synthesis.",
            "log": "Gate I Passed (Threshold 0.6)."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 9.0,
            "next": [
                33
            ],
            "badge": "Step 6.9",
            "name": "Calibration",
            "file": "ConfidenceCalibrationService.swift",
            "desc": "Platt scale.",
            "log": "Trust: 99.8%."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 10.0,
            "next": [
                34
            ],
            "badge": "Step 6.10",
            "name": "Citations",
            "file": "GroundedAnswerView.swift",
            "desc": "Markdown injection.",
            "log": "Injected anchors."
        },
        {
            "stageIdx": 6,
            "gridX": 0.5,
            "gridY": 1.5,
            "next": [],
            "badge": "Output",
            "name": "Response Package",
            "file": "TelemetryWrapper.swift",
            "desc": "Finalize package.",
            "log": "Sent to engine."
        }
    ]
},
  maximum: {
    "name": "Maximum Mode (33 Steps - Unlimited Compute)",
    "metrics": {
        "latency": "6400ms",
        "rate": "84 tok/s",
        "score": "99.9%"
    },
    "stages": [
        "0. Input",
        "1. Analyze",
        "2. Search",
        "3. Assemble",
        "4. Generate",
        "5. Verify",
        "6. Output"
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
            "gridY": 0.0,
            "next": [
                2
            ],
            "badge": "Step 1",
            "name": "Memory Injection",
            "file": "ConversationMemoryService.swift",
            "desc": "Inject 20 turns.",
            "log": "Injected 20 turns."
        },
        {
            "stageIdx": 1,
            "gridX": 0.5,
            "gridY": 1.5,
            "next": [
                3
            ],
            "badge": "Step 1.1",
            "name": "HyDE Generator",
            "file": "HyDE.swift",
            "desc": "Hypothesis.",
            "log": "Hypothesis created."
        },
        {
            "stageIdx": 1,
            "gridX": 0.5,
            "gridY": 3.0,
            "next": [
                4
            ],
            "badge": "Step 1.2",
            "name": "Query Expansion",
            "file": "QueryRewriterService.swift",
            "desc": "12 variants.",
            "log": "Expanded 12 variants."
        },
        {
            "stageIdx": 1,
            "gridX": 0.5,
            "gridY": 4.5,
            "next": [
                5
            ],
            "badge": "Step 1.3",
            "name": "Intent Classifier",
            "file": "QueryEnhancementService.swift",
            "desc": "Intent.",
            "log": "Intent identified."
        },
        {
            "stageIdx": 1,
            "gridX": 0.5,
            "gridY": 6.0,
            "next": [
                6
            ],
            "badge": "Step 1.4",
            "name": "Model Router",
            "file": "FoundationModelPreference.swift",
            "desc": "PCC Route.",
            "log": "Tier: Private Cloud Compute."
        },
        {
            "stageIdx": 1,
            "gridX": 0.5,
            "gridY": 7.5,
            "next": [
                7
            ],
            "badge": "Step 1.5",
            "name": "Unlimited Loop",
            "file": "AgenticOrchestrator.swift",
            "desc": "Iterative loop.",
            "log": "Pass 1 started."
        },
        {
            "stageIdx": 1,
            "gridX": 0.5,
            "gridY": 9.0,
            "next": [
                8
            ],
            "badge": "Step 1.6",
            "name": "Query Embedding",
            "file": "EmbeddingService.swift",
            "desc": "Vector gen.",
            "log": "Vectors generated."
        },
        {
            "stageIdx": 1,
            "gridX": 0.5,
            "gridY": 10.5,
            "next": [
                9,
                10
            ],
            "badge": "Step 1.7",
            "name": "RAPTOR Routing",
            "file": "QueryRouterService.swift",
            "desc": "Routing.",
            "log": "Routed."
        },
        {
            "stageIdx": 2,
            "gridX": 0.2,
            "gridY": 1.5,
            "next": [
                11
            ],
            "badge": "Step 2a",
            "name": "Vector Search",
            "file": "RAGEngine.swift",
            "desc": "Top 50 vectors.",
            "log": "Found 50 vectors."
        },
        {
            "stageIdx": 2,
            "gridX": 0.2,
            "gridY": 4.5,
            "next": [
                11
            ],
            "badge": "Step 2b",
            "name": "BM25 Search",
            "file": "SQLiteFullTextService.swift",
            "desc": "Keywords.",
            "log": "Found records."
        },
        {
            "stageIdx": 2,
            "gridX": 0.8,
            "gridY": 3.0,
            "next": [
                12
            ],
            "badge": "Step 2.5",
            "name": "Hybrid RRF",
            "file": "RAGEngine.swift",
            "desc": "Merge.",
            "log": "Merged indices."
        },
        {
            "stageIdx": 2,
            "gridX": 0.5,
            "gridY": 5.5,
            "next": [
                13
            ],
            "badge": "Step 3",
            "name": "ReRanker",
            "file": "ReRankerModel.mlpackage",
            "desc": "Rescore.",
            "log": "Rescored."
        },
        {
            "stageIdx": 2,
            "gridX": 0.5,
            "gridY": 7.0,
            "next": [
                14
            ],
            "badge": "Step 3.1",
            "name": "Low-Conf Filter",
            "file": "RetrievalPolicyService.swift",
            "desc": "Floor 0.20.",
            "log": "Broad filter."
        },
        {
            "stageIdx": 2,
            "gridX": 0.5,
            "gridY": 8.5,
            "next": [
                15
            ],
            "badge": "Step 3.2",
            "name": "Source Diversity",
            "file": "RAGEngine.swift",
            "desc": "Cap files.",
            "log": "Capped."
        },
        {
            "stageIdx": 2,
            "gridX": 0.5,
            "gridY": 10.0,
            "next": [
                16
            ],
            "badge": "Step 3.3",
            "name": "MMR Diversify",
            "file": "RAGEngine.swift",
            "desc": "Lambda 0.50.",
            "log": "Maximum diversity."
        },
        {
            "stageIdx": 3,
            "gridX": 0.5,
            "gridY": 2.0,
            "next": [
                17
            ],
            "badge": "Step 4",
            "name": "ParentDoc",
            "file": "ParentDocumentService.swift",
            "desc": "\u00b15 siblings.",
            "log": "Massive context expansion."
        },
        {
            "stageIdx": 3,
            "gridX": 0.5,
            "gridY": 5.0,
            "next": [
                18
            ],
            "badge": "Step 4.1",
            "name": "Graph Pack",
            "file": "ContextPackingService.swift",
            "desc": "No compression.",
            "log": "Fit in 32K budget."
        },
        {
            "stageIdx": 3,
            "gridX": 0.5,
            "gridY": 8.0,
            "next": [
                19
            ],
            "badge": "Step 4.2",
            "name": "LIM Sort",
            "file": "RAGEngine.swift",
            "desc": "Interleave.",
            "log": "Sorted."
        },
        {
            "stageIdx": 4,
            "gridX": 0.5,
            "gridY": 1.5,
            "next": [
                20
            ],
            "badge": "Step 5",
            "name": "AFM Inference",
            "file": "LanguageModelSession",
            "desc": "Temp 0.3.",
            "log": "Strict deterministic generation."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 0.0,
            "next": [
                21
            ],
            "badge": "Gate A",
            "name": "Retrieval Confidence",
            "file": "VerificationGateService.swift",
            "desc": "Check max(chunk_scores) >= \u03c4",
            "log": "Gate A Passed."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 1.0,
            "next": [
                22
            ],
            "badge": "Gate B",
            "name": "Evidence Coverage",
            "file": "VerificationGateService.swift",
            "desc": "Claims trace to evidence.",
            "log": "Gate B Passed."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 2.0,
            "next": [
                23
            ],
            "badge": "Gate C",
            "name": "Numeric Sanity",
            "file": "VerificationGateService.swift",
            "desc": "Numbers match source documents.",
            "log": "Gate C Passed."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 3.0,
            "next": [
                24
            ],
            "badge": "Gate D",
            "name": "Contradiction Sweep",
            "file": "VerificationGateService.swift",
            "desc": "Detect conflicting evidence.",
            "log": "Gate D Passed."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 4.0,
            "next": [
                25
            ],
            "badge": "Gate E",
            "name": "Semantic Grounding",
            "file": "VerificationGateService.swift",
            "desc": "Cosine similarity to source > 0.50.",
            "log": "Gate E Passed."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 5.0,
            "next": [
                26
            ],
            "badge": "Gate F",
            "name": "Quote Faithfulness",
            "file": "VerificationGateService.swift",
            "desc": "Abbreviation cross-contamination check.",
            "log": "Gate F Passed."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 6.0,
            "next": [
                27
            ],
            "badge": "Gate G",
            "name": "Generation Quality",
            "file": "VerificationGateService.swift",
            "desc": "Degeneration and repetition check.",
            "log": "Gate G Passed."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 7.0,
            "next": [
                28
            ],
            "badge": "Gate H",
            "name": "Answer Completeness",
            "file": "VerificationGateService.swift",
            "desc": "Detect under-supported multi-hop answers.",
            "log": "Gate H Passed."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 8.0,
            "next": [
                29
            ],
            "badge": "Gate I",
            "name": "Domain Isolation",
            "file": "VerificationGateService.swift",
            "desc": "Reject mixed-domain evidence synthesis.",
            "log": "Gate I Passed (Threshold 0.8)."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 9.0,
            "next": [
                30
            ],
            "badge": "Step 6.9",
            "name": "Calibration",
            "file": "ConfidenceCalibrationService.swift",
            "desc": "Scale.",
            "log": "Trust: 99.9%."
        },
        {
            "stageIdx": 5,
            "gridX": 0.5,
            "gridY": 10.0,
            "next": [
                31
            ],
            "badge": "Step 6.10",
            "name": "Citations",
            "file": "GroundedAnswerView.swift",
            "desc": "Anchors.",
            "log": "Injected."
        },
        {
            "stageIdx": 6,
            "gridX": 0.5,
            "gridY": 1.5,
            "next": [],
            "badge": "Output",
            "name": "Response Package",
            "file": "TelemetryWrapper.swift",
            "desc": "Finalize package.",
            "log": "Complete."
        }
    ]
}
};
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

// --- NOTION ROADMAP SYNC ---
async function fetchRoadmap() {
  try {
    const response = await fetch('roadmap.json');
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
                         
      const osBadgeClass = item.target_os.includes('26') ? 'ios-macos-26-5-only' : 
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
