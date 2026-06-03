const ASSET_VERSION = "20260603c";

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
    name: "Document Ingestion Pipeline (6 Steps)",
    metrics: { latency: "84ms", rate: "3.2 MB/s", score: "98.2%" },
    stages: ["1. Ingest", "2. Route", "3. Validate", "4. Embed", "5. Store"],
    steps: [
      {
        stageIdx: 0,
        gridX: 0.5,
        gridY: 0.5,
        next: [1],
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
        stageIdx: 0,
        gridX: 0.5,
        gridY: 2.5,
        next: [2],
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
        stageIdx: 1,
        gridX: 0.5,
        gridY: 1.5,
        next: [3],
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
        stageIdx: 2,
        gridX: 0.5,
        gridY: 1.5,
        next: [4],
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
        stageIdx: 3,
        gridX: 0.5,
        gridY: 1.5,
        next: [5],
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
        stageIdx: 4,
        gridX: 0.5,
        gridY: 1.5,
        next: [],
        badge: "Step 6",
        name: "Index",
        file: "SQLiteFullTextService.swift",
        desc: "Write vectors into local binary container databases (BNNS) and index metadata under isolated container ids inside SQLite tables.",
        what: "Saves generated vectors to memory-mapped files and records chunk metadata in a SQLite FTS5 table.",
        why: "Provides fast, transactional local search. SQLite FTS5 indexes literal keywords; MMAP files handle vector searches.",
        how: "Appends float arrays directly to binary file streams and registers document offsets inside SQLite tables.",
        log: "[VectorStore] Vectors persisted to local _vectors.bin and precomputed _norms.bin.\n[SQLite] Index metadata written to tables 'documents', 'chunks', and 'document_pages'."
      }
    ]
  },
  query: {
    name: "Query-to-Response Pipeline (23 Steps)",
    metrics: { latency: "148ms", rate: "68 tok/s", score: "99.4%" },
    stages: ["1. Analyze", "2. Route", "3. Search", "4. Optimize", "5. Cognitive"],
    steps: [
      {
        stageIdx: 0,
        gridX: 0.5,
        gridY: 0,
        next: [1],
        badge: "Step 0",
        name: "Corpus Analysis",
        file: "OpenIntelligenceEngine.swift",
        desc: "Scan local container vocabulary caches to determine word distribution and terminology matches.",
        what: "Scans active document vocabularies to determine word distribution and checks if the database is populated.",
        why: "Prevents search failures on empty databases and helps calibrate keyword weights before search execution.",
        how: "Reads SQLite database statistics and counts indexed terms in the target document container.",
        log: "[VocabCache] Scanned. Found 12 matching index keywords."
      },
      {
        stageIdx: 0,
        gridX: 0.5,
        gridY: 1,
        next: [2],
        badge: "Step 1",
        name: "Query Parsing",
        file: "QueryParser.swift",
        desc: "Resolve pronoun ambiguities and extract query entities via Named Entity Recognition (NER).",
        what: "Resolves pronoun ambiguities (like 'it') and extracts key entities from the user's raw input.",
        why: "Users often ask follow-up questions ('how much synthetic oil does it take?'). We must resolve 'it' to retrieve the right specs.",
        how: "Applies rule-based parsing and queries NLTagger to resolve core pronouns against previous conversation history state.",
        log: "[QueryParser] Entities: 'Stryker Tower 3'. Pronouns resolved: None."
      },
      {
        stageIdx: 0,
        gridX: 0.5,
        gridY: 2,
        next: [3],
        badge: "Step 1.5",
        name: "Query Expansion",
        file: "QueryRewriterService.swift",
        desc: "Expand query terms using the container vocabulary to increase retrieval recall.",
        what: "Generates query synonyms using the local container vocabulary to capture different phrasing variants.",
        why: "Standard search fails if query terms differ slightly from the text (e.g. searching 'quarts' when document says 'capacity').",
        how: "Intersects query terms with the vocabulary list to build alternate FTS5 match query strings in QueryRewriterService.",
        log: "[Expansion] Expanded query: 'Stryker Tower 3 capacity specification quarts par levels'."
      },
      {
        stageIdx: 0,
        gridX: 0.5,
        gridY: 3,
        next: [4],
        badge: "Step 1.6",
        name: "Classifier",
        file: "QueryEnhancementService.swift",
        desc: "Classify query intent (lookup, procedure, compare, summarize) to select the correct downstream routing logic.",
        what: "Classifies query intent (factual lookup, instruction lookup, summarize) to select the correct routing logic.",
        why: "Simple lookups need direct details; summary queries require parent summaries. Routing correctly saves cycles.",
        how: "Runs rule-based heuristics inside QueryEnhancementService to set the retrieval logic pipeline modes.",
        log: "[Classifier] Intent: 'lookup' (factual specification query). Subtype: Device capability."
      },
      {
        stageIdx: 1,
        gridX: 0.5,
        gridY: 1,
        next: [5],
        badge: "Step 2",
        name: "Query Embedding",
        file: "EmbeddingService.swift",
        desc: "Generate 384-dimensional dense vector representation of expanded query.",
        what: "Generates a 384-dimensional dense vector representing the expanded search query.",
        why: "Enables vector search by projecting the query into the same mathematical space as document chunks.",
        how: "Runs local MiniLM model on Apple Silicon Neural Engine, executing quick vector generation in EmbeddingService.",
        log: "[EmbeddingService] Generated vector tensor (384-dim) via local MiniLM."
      },
      {
        stageIdx: 1,
        gridX: 0.5,
        gridY: 2.5,
        next: [6, 7],
        badge: "Step 2.5",
        name: "RAPTOR Routing",
        file: "QueryRouterService.swift",
        desc: "Decide whether query requires summary-level overview blocks or raw factual details.",
        what: "Selects whether to query detail-level chunks or high-level parent summarizations.",
        why: "Speeds up overview questions by routing to pre-summarized parent blocks rather than individual sentences.",
        how: "Compares intent classification against query complexity inside QueryRouterService to set index scan targets.",
        log: "[RAPTOR] Query complexity: standard. Routing to raw chunk database (bypassing L1 summaries)."
      },
      {
        stageIdx: 2,
        gridX: 0.2,
        gridY: 0.5,
        next: [8],
        badge: "Step 3a",
        name: "Vector Search",
        file: "RAGEngine.swift",
        desc: "Execute semantic cosine similarity match using local 384-dimensional document vectors on Apple Silicon.",
        what: "Performs semantic search to find chunks with the most similar meaning to the query vector.",
        why: "Retrieves chunks that are conceptually related, even if they use completely different keywords or phrasing.",
        how: "Computes cosine similarity across memory-mapped vector bin files using Apple Silicon Accelerate framework.",
        log: "[VectorSearch] Searched 18 vectors. Computed cosine distance.\n[Apple Silicon] BNNS Matrix Multiplication execution completed."
      },
      {
        stageIdx: 2,
        gridX: 0.2,
        gridY: 2.5,
        next: [8],
        badge: "Step 3b",
        name: "Keyword Search",
        file: "SQLiteFullTextService.swift",
        desc: "Run high-velocity keyword lookup against local SQLite FTS5 index using BM25 relevance scoring criteria.",
        what: "Runs traditional keyword search on the local SQLite FTS5 database.",
        why: "Exact details (like serial numbers or part specifications) must match exactly; semantic search often misses literal specifications.",
        how: "Runs a standard BM25 ranking query inside the SQLite FTS5 virtual tables.",
        log: "[BM25] Searched SQLite FTS5 index. Retrieved 12 candidate records."
      },
      {
        stageIdx: 2,
        gridX: 0.8,
        gridY: 1.5,
        next: [9],
        badge: "Step 3c",
        name: "Hybrid RRF Merge",
        file: "RAGEngine.swift",
        desc: "Merge vector and keyword candidates using Reciprocal Rank Fusion (RRF) to combine semantic and lexical signals.",
        what: "Merges candidate rankings from both vector and keyword searches.",
        why: "Combines the strengths of semantic search (general meaning) and keyword search (exact specifics).",
        how: "Applies the Reciprocal Rank Fusion (RRF) algorithm to rank candidates without normalizing scores.",
        log: "[RRF] Merged candidates from vector & BM25 indices.\n[RRF Core] Ranked top candidate (RRF score: 0.962)."
      },
      {
        stageIdx: 2,
        gridX: 0.5,
        gridY: 3.5,
        next: [10],
        badge: "Step 4",
        name: "Rerank",
        file: "ReRankerModel.mlpackage",
        desc: "Rescore top candidates using local TinyBERT ms-marco model to measure precise query-chunk relevance pairs.",
        what: "Rescores the top 30 merged candidates using a local cross-encoder model.",
        why: "Initial search is fast but coarse. Reranking uses a slower, highly precise relevance model to select best candidates.",
        how: "Runs on-device inference using local TinyBERT ms-marco model (ReRankerModel.mlpackage).",
        log: "[TinyBERT] Reranked 30 candidates. Candidate #1 score: 0.892 (file: 'stryker_spec.pdf')."
      },
      {
        stageIdx: 2,
        gridX: 0.5,
        gridY: 4.5,
        next: [11],
        badge: "Step 4.3",
        name: "Low-Conf Filter",
        file: "RetrievalPolicyService.swift",
        desc: "Discard candidates that fall below the dynamic similarity floor.",
        what: "Filters out retrieved chunks that score below a dynamic similarity threshold.",
        why: "Feeding irrelevant data to the LLM increases token costs and risks generating false or hallucinated answers.",
        how: "Discards any candidates scoring below the similarity floor (default 0.65) in RetrievalPolicyService.",
        log: "[Filter] Dropped 12 candidates below similarity floor (0.65)."
      },
      {
        stageIdx: 2,
        gridX: 0.5,
        gridY: 5.5,
        next: [12],
        badge: "Step 4.4",
        name: "Source Diversity",
        file: "RAGEngine.swift",
        desc: "Balance candidates to prevent retrieval saturation from a single source document.",
        what: "Balances retrieved chunks to ensure multiple source documents are represented.",
        why: "Avoids retrieval saturation where all chunks come from a single file, missing context from others.",
        how: "Applies a source document count cap inside RAGEngine to prune excessive matches from single files.",
        log: "[Diversity] Source coverage balanced. 3 independent documents represented."
      },
      {
        stageIdx: 2,
        gridX: 0.5,
        gridY: 6.5,
        next: [13],
        badge: "Step 4.5",
        name: "MMR Diversify",
        file: "RAGEngine.swift",
        desc: "Apply Maximal Marginal Relevance (lambda=0.6) to reduce redundancy in adjacent context.",
        what: "Applies Maximal Marginal Relevance (MMR) to deduplicate highly similar retrieved paragraphs.",
        why: "Sending duplicate info wastes the context window and doesn't provide new information.",
        how: "Applies a cosine distance penalty (lambda=0.6) to penalize candidates highly similar to already-selected ones.",
        log: "[MMR] Redundancy penalty applied. Selected 6 distinct segments."
      },
      {
        stageIdx: 3,
        gridX: 0.5,
        gridY: 1.2,
        next: [14],
        badge: "Step 4.6",
        name: "ParentDoc",
        file: "ParentDocumentService.swift",
        desc: "Expand matched chunks to include adjacent sibling chunks (+-5 siblings) from the same section or page.",
        what: "Expands retrieved chunks to include surrounding page/section sibling chunks.",
        why: "Chunks are small (300 words). Adjacent paragraphs provide complete section context for coherent answers.",
        how: "Queries local database for adjacent chunk IDs (+-5 siblings) within ParentDocumentService.",
        log: "[ParentDoc] Expanded context window. Total chunks: 11 (2,250 tokens)."
      },
      {
        stageIdx: 3,
        gridX: 0.5,
        gridY: 2.2,
        next: [15],
        badge: "Step 4.7",
        name: "Compression",
        file: "ContextualCompressionService.swift",
        desc: "Apply LLM sentence-level filter, retaining only query-relevant sentences and discarding the rest.",
        what: "Extracts only query-relevant sentences from retrieved chunks, discarding the rest.",
        why: "Saves up to 60% of the token limit and prevents irrelevant details from diluting the LLM's attention.",
        how: "Runs a fast sentence-level similarity filter inside ContextualCompressionService.",
        log: "[Compression] Removed irrelevant sentences. Token size reduced: 2,250 -> 612 (72.8% savings)."
      },
      {
        stageIdx: 3,
        gridX: 0.5,
        gridY: 3.2,
        next: [16],
        badge: "Step 4.9",
        name: "Graph Pack",
        file: "ContextPackingService.swift",
        desc: "Verify that total context size fits Apple FoundationModels session token budget.",
        what: "Packs compressed context chunks to fit the Apple FoundationModels token budget.",
        why: "Exceeding 4,096 tokens causes crash or truncation errors in on-device Apple LLMs.",
        how: "Checks total tokens inside ContextPackingService, trimming lower-ranked items if they exceed limits.",
        log: "[ContextPack] Budget check: 612 context tokens + 100 prompt tokens = 712 / 4,096. Status: OK."
      },
      {
        stageIdx: 3,
        gridX: 0.5,
        gridY: 4.2,
        next: [17, 18],
        badge: "Step 5",
        name: "Context Assembly",
        file: "RAGEngine.swift",
        desc: "Apply 'Lost-in-Middle' reordering to place the most relevant chunks at the start and end of prompt.",
        what: "Reorders chunks to place the most relevant at the very start and end of the context window.",
        why: "Mitigates the 'Lost-in-Middle' effect where LLMs ignore information in the middle of long prompts.",
        how: "Interleaves chunks inside RAGEngine so they follow: [1st, 3rd, 5th, ..., 4th, 2nd] order.",
        log: "[Lost-in-Middle] Interleaved context: [Chunk 1, Chunk 3, Chunk 5, Chunk 4, Chunk 2]."
      },
      {
        stageIdx: 4,
        gridX: 0.2,
        gridY: 0.5,
        next: [19],
        badge: "Step 5.9a",
        name: "ExtSummarize",
        file: "RAGEngine.swift",
        desc: "Execute extractive summary calculations if query intent is classified as summarize.",
        what: "Extracts summary sentences directly from context if the query intent is summary.",
        why: "Speeds up overview questions by skipping expensive generative reasoning steps.",
        how: "Scores sentences based on query relevance and selects the top-scoring sentences as the summary.",
        log: "[Summarization] Step bypassed (intent is lookup)."
      },
      {
        stageIdx: 4,
        gridX: 0.2,
        gridY: 2.5,
        next: [19],
        badge: "Step 5.9b",
        name: "ExtQA",
        file: "RAGEngine.swift",
        desc: "Run high-precision factual lookups on candidates for lookup intent queries.",
        what: "Executes exact fact lookups for factual lookup intent queries.",
        why: "Ensures absolute precision for numbers (such as capacities or tolerances) by locating specific words.",
        how: "Identifies precise token coordinates for target details using a local lookup engine.",
        log: "[ExtractiveQA] Located precise target tokens: 'capacity = 5.3 quarts'."
      },
      {
        stageIdx: 4,
        gridX: 0.8,
        gridY: 1.5,
        next: [20],
        badge: "Step 6",
        name: "Generation",
        file: "LanguageModelSession",
        desc: "Call Apple's LanguageModelSession locally on device to generate cited response draft.",
        what: "Prompts the local Apple foundation LLM to write the response draft.",
        why: "Synthesizes retrieved chunks into a natural, cohesive answer.",
        how: "Calls Apple's on-device LanguageModelSession (iOS 26+).",
        log: "[LanguageModelSession] Invoking on-device LLM. Generated draft answer."
      },
      {
        stageIdx: 4,
        gridX: 0.5,
        gridY: 3.0,
        next: [21],
        badge: "Step 6.5",
        name: "Response Format",
        file: "RAGService.swift",
        desc: "Validate markdown syntax and confirm citation node mappings.",
        what: "Validates markdown syntax and citation anchors in the generated response.",
        why: "Ensures citation links and bullet lists render correctly in the SwiftUI chat interface.",
        how: "Runs regex checks inside RAGService to verify markdown structure and format.",
        log: "[ResponseFormat] Markdown nodes validated. Citations verified against source indices."
      },
      {
        stageIdx: 4,
        gridX: 0.5,
        gridY: 4.0,
        next: [22],
        badge: "Step 7",
        name: "Groundedness",
        file: "ContextualCompressionService.swift",
        desc: "Assess response groundedness to detect potential hallucinations or prior-knowledge leaks.",
        what: "Verifies that the generated claims are backed by the retrieved context chunks.",
        why: "Detects hallucinations where the model leaks pre-trained assumptions or wrong facts.",
        how: "Evaluates sentence overlap inside ContextualCompressionService to flag ungrounded claims.",
        log: "[QualityService] Groundedness check complete. Score: 0.942."
      },
      {
        stageIdx: 4,
        gridX: 0.5,
        gridY: 5.0,
        next: [23],
        badge: "Step 7.5",
        name: "Verification",
        file: "VerificationGateService.swift",
        desc: "Run post-generation verification checks (hallucination risk, spec-sniper check, domain isolation, etc.).",
        what: "Runs the response through 9 verification checks (Gates A-I).",
        why: "Ensures safety, domain isolation, anti-hallucination, and completeness before presenting the answer.",
        how: "Asserts pass/fail on Gates A-I inside VerificationGateService.",
        log: "[VerificationGate] Running Gates A-I.\nHallucination Gate: Pass\nSpec-sniper check: Pass\nDomain isolation: Pass"
      },
      {
        stageIdx: 4,
        gridX: 0.5,
        gridY: 6.0,
        next: [24],
        badge: "Step 8",
        name: "Calibrate",
        file: "ConfidenceCalibrationService.swift",
        desc: "Apply Platt scaling to calibrate raw verification scores into a final trust rating.",
        what: "Calibrates verification scores into a final confidence percentage.",
        why: "Provides a reliable signal to the user on whether the retrieved source answers the question.",
        how: "Applies Platt scaling inside ConfidenceCalibrationService.",
        log: "[Calibration] Confidence calibrated. Rating: 99.4% (Grounded)."
      },
      {
        stageIdx: 4,
        gridX: 0.5,
        gridY: 7.0,
        next: [25],
        badge: "Step 9",
        name: "Response Package",
        file: "RAGService.swift",
        desc: "Compile final response object with citations, source details, and performance metrics.",
        what: "Compiles the final answer, citation lists, and telemetry metrics.",
        why: "Organizes debug metrics (latency, tokens) alongside the answer payload.",
        how: "Packages data into a StructuredResponse struct in RAGService.",
        log: "[ResponsePackage] Compiled final StructuredResponse payload."
      },
      {
        stageIdx: 4,
        gridX: 0.5,
        gridY: 8.0,
        next: [],
        badge: "Step 10",
        name: "Render UI",
        file: "ResponseDetailsView.swift",
        desc: "Render response in SwiftUI chat bubbles with citation highlights and source file link buttons.",
        what: "Renders the response in chat bubbles with clickable citations.",
        why: "Delivers an elegant chat UI where claims link directly to source file pages.",
        how: "Renders custom views in ResponseDetailsView.swift.",
        log: "[UI] Citations parsed. Response rendered successfully."
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
