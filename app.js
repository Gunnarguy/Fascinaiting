
let userInterruptedScroll = false;
window.addEventListener('wheel', () => { userInterruptedScroll = true; }, { passive: true });
window.addEventListener('touchmove', () => { userInterruptedScroll = true; }, { passive: true });
window.addEventListener('mousedown', () => { userInterruptedScroll = true; }, { passive: true });

const ASSET_VERSION = "20260625b";

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
      "Input",
      "Prescan",
      "OCR/PDF",
      "Repair",
      "Analysis",
      "Chunking",
      "Enforce",
      "Compute",
      "Index",
      "Output"
    ],
    "steps": [
      {
        "id": "input",
        "stageIdx": 0,
        "gridY": 0.5,
        "next_ids": [
          "scan"
        ],
        "badge": "Input",
        "name": "Upload Document",
        "what": "Invokes the native iOS/macOS document picker allowing the user to select files.",
        "why": "Sandboxed apps cannot read arbitrary files; we must rely on Security-Scoped URLs granted by the user.",
        "how": "Uses UIDocumentPickerViewController and startAccessingSecurityScopedResource().",
        "code": "import UIKit\n\nlet picker = UIDocumentPickerViewController(\n    forOpeningContentTypes: [.pdf, .text, .data]\n)\npicker.delegate = self\n\nfunc documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {\n    guard let url = urls.first else { return }\n    let granted = url.startAccessingSecurityScopedResource()\n    engine.ingest(url: url)\n}",
        "next": [
          1
        ],
        "gridX": 0.5
      },
      {
        "id": "scan",
        "stageIdx": 1,
        "gridY": 0.5,
        "next_ids": [
          "ocr",
          "pdf"
        ],
        "badge": "Step 1",
        "name": "Complexity Pre-Scan",
        "what": "Determines the density of text and layout complexity before choosing an extraction path.",
        "why": "Heavy OCR drains battery. Simple PDFs shouldn't be rendered to images if a native text layer exists.",
        "how": "Scans the first 3 pages. If text density < threshold, flags for OCR.",
        "code": "func analyzeComplexity(document: PDFDocument) -> ExtractionStrategy {\n    var textLength = 0\n    for i in 0..<min(3, document.pageCount) {\n        textLength += document.page(at: i)?.string?.count ?? 0\n    }\n    return textLength > 500 ? .nativeText : .visionOCR\n}",
        "next": [
          2,
          3
        ],
        "gridX": 0.5
      },
      {
        "id": "ocr",
        "stageIdx": 2,
        "gridY": 0.5,
        "next_ids": [
          "repair"
        ],
        "badge": "Step 1a",
        "name": "Vision OCR",
        "what": "Renders PDF pages as high-resolution images and runs Apple Vision Framework OCR.",
        "why": "Extracts text from scanned documents or PDFs missing a native text layer.",
        "how": "Scales the PDF page by 6x, renders to CGImage, and passes to VNRecognizeTextRequest.",
        "code": "import Vision\n\nlet request = VNRecognizeTextRequest()\nrequest.recognitionLevel = .accurate\nrequest.usesLanguageCorrection = true\n\nlet handler = VNImageRequestHandler(cgImage: scaledPageImage, options: [:])\ntry handler.perform([request])\n\nlet extractedText = request.results?.compactMap { $0.topCandidates(1).first?.string }.joined(separator: \"\\n\")",
        "next": [
          4
        ],
        "gridX": 0.5
      },
      {
        "id": "pdf",
        "stageIdx": 2,
        "gridY": 1.5,
        "next_ids": [
          "repair"
        ],
        "badge": "Step 1b",
        "name": "Native PDFKit",
        "what": "Extracts the native text layer directly from the PDF.",
        "why": "Fastest and most battery-efficient way to read digital documents.",
        "how": "Iterates over PDFPage objects and accesses the .string property.",
        "code": "import PDFKit\n\nvar rawText = \"\"\nfor i in 0..<document.pageCount {\n    if let page = document.page(at: i) {\n        rawText += page.string ?? \"\"\n    }\n}",
        "next": [
          4
        ],
        "gridX": 0.5
      },
      {
        "id": "repair",
        "stageIdx": 3,
        "gridY": 0.5,
        "next_ids": [
          "entity",
          "chunk"
        ],
        "badge": "Step 1.1",
        "name": "Normalizer & OCR Repair",
        "what": "Fixes hyphenation, spacing anomalies, and broken ligatures from OCR/PDF extraction.",
        "why": "Raw extraction often splits words across lines (e.g., 'trans- action'), destroying semantic search accuracy.",
        "how": "Uses Regular Expressions to collapse hyphenated line breaks and normalize whitespace.",
        "code": "func normalizeText(_ raw: String) -> String {\n    var clean = raw\n    // Fix broken hyphenation across lines\n    clean = clean.replacingOccurrences(of: \"(?<=[a-z])-\\\\s*\\\\n\\\\s*(?=[a-z])\", with: \"\", options: .regularExpression)\n    // Normalize whitespace\n    clean = clean.replacingOccurrences(of: \"[ \\\\t]+\", with: \" \", options: .regularExpression)\n    return clean\n}",
        "next": [
          5,
          6
        ],
        "gridX": 0.5
      },
      {
        "id": "entity",
        "stageIdx": 4,
        "gridY": 0.5,
        "next_ids": [
          "enforce"
        ],
        "badge": "Step 2a",
        "name": "Entity Extraction",
        "what": "Identifies locations, organizations, and people in the text.",
        "why": "Allows the lexical index to boost search relevance for proper nouns.",
        "how": "Uses NLTagger with the .nameType scheme.",
        "code": "import NaturalLanguage\n\nlet tagger = NLTagger(tagSchemes: [.nameType])\ntagger.string = chunkText\n\ntagger.enumerateTags(in: chunkText.startIndex..<chunkText.endIndex, scheme: .nameType, options: [.omitWhitespace]) { tag, range in\n    if let tag = tag {\n        let entity = String(chunkText[range])\n        metadata.append(entity)\n    }\n    return true\n}",
        "next": [
          7
        ],
        "gridX": 0.5
      },
      {
        "id": "chunk",
        "stageIdx": 5,
        "gridY": 0.5,
        "next_ids": [
          "enforce"
        ],
        "badge": "Step 2b",
        "name": "Structure-Aware Chunker",
        "what": "Splits text into chunks while preserving atomic structures like tables and lists.",
        "why": "Splitting a table halfway across chunks destroys the relationship between headers and cells.",
        "how": "Scans for Markdown table syntax or bullet lists. If found, groups them into a single chunk.",
        "code": "let sentences = TextUtils.splitSentences(text: text)\nvar chunks: [Chunk] = []\n\nfor sentence in sentences {\n    if sentence.isMarkdownTable() {\n        currentChunk.forceAppend(sentence)\n        continue\n    }\n    if currentChunk.wordCount >= 310 {\n        chunks.append(Chunk(currentChunk))\n        currentChunk.removeAll()\n    }\n}",
        "next": [
          7
        ],
        "gridX": 0.5
      },
      {
        "id": "enforce",
        "stageIdx": 6,
        "gridY": 0.5,
        "next_ids": [
          "vector",
          "lexical"
        ],
        "badge": "Step 2.1",
        "name": "Token Boundary Enforcer",
        "what": "Ensures chunks do not exceed the embedding model's maximum sequence length.",
        "why": "Core ML embedding models crash or truncate silently if fed more than 512 tokens.",
        "how": "Runs the text through a local BPE tokenizer to verify length.",
        "code": "let tokenizer = BPETokenizer(vocabulary: localVocab)\nfor chunk in chunks {\n    let tokens = tokenizer.encode(text: chunk.text)\n    guard tokens.count <= 510 else {\n        let subChunks = chunk.forceSplit()\n        // re-evaluate subChunks\n        continue\n    }\n}",
        "next": [
          8,
          9
        ],
        "gridX": 0.5
      },
      {
        "id": "vector",
        "stageIdx": 7,
        "gridY": 0.5,
        "next_ids": [
          "output"
        ],
        "badge": "Step 3a",
        "name": "Metal GPU Vectorizer",
        "what": "Generates 384-dimensional dense vectors using a Core ML model on the Apple Neural Engine.",
        "why": "Enables semantic similarity search (finding meaning, not just exact keywords).",
        "how": "Compiles inputs to MLMultiArray and predicts using MobileBERT.",
        "code": "import CoreML\n\nlet config = MLModelConfiguration()\nconfig.computeUnits = .all // Allows ANE\nlet model = try MobileBERTEmbeddings(configuration: config)\n\nlet inputFeatures = try MLMultiArray(shape: [1, 512], dataType: .float32)\nlet output = try model.prediction(input: inputFeatures)\nlet vector: [Float32] = output.embeddings.toArray()",
        "next": [
          10
        ],
        "gridX": 0.5
      },
      {
        "id": "lexical",
        "stageIdx": 8,
        "gridY": 0.5,
        "next_ids": [
          "output"
        ],
        "badge": "Step 3b",
        "name": "Lexical Indexer",
        "what": "Writes the chunk text and extracted entities to a SQLite FTS5 index.",
        "why": "Lexical search (BM25) is mathematically perfect for finding exact keyword matches, serial numbers, or names.",
        "how": "Uses a virtual FTS5 table with the Porter stemmer.",
        "code": "try db.execute(\"\"\"\n  CREATE VIRTUAL TABLE IF NOT EXISTS doc_index USING fts5(\n    chunk_id, \n    content, \n    entities, \n    tokenize='porter'\n  );\n\"\"\")\n\ntry db.execute(\"\"\"\n  INSERT INTO doc_index (chunk_id, content, entities) \n  VALUES (?, ?, ?);\n\"\"\", [chunk.id, chunk.text, chunk.entities.joined(separator: \", \")])",
        "next": [
          10
        ],
        "gridX": 0.5
      },
      {
        "id": "output",
        "stageIdx": 9,
        "gridY": 0.5,
        "next_ids": [],
        "badge": "Output",
        "name": "App Entities",
        "what": "Registers the ingested document with the system for Siri and Spotlight.",
        "why": "Allows users to ask Siri 'Summarize my physics notes in OpenIntelligence'.",
        "how": "Updates the Core Data / SwiftData container tied to AppIntents.",
        "code": "import AppIntents\n\nstruct DocumentEntity: AppEntity {\n    static let defaultQuery = DocumentQuery()\n    \n    var id: UUID\n    var title: String\n    var summary: String\n}\n\n// Index in Spotlight\nCSSearchableIndex.default().indexSearchableItems([item])",
        "next": [],
        "gridX": 0.5
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
      "Input",
      "Analysis",
      "Enhancement",
      "Search",
      "RRF",
      "Rerank",
      "Sibling",
      "Compress",
      "LIM",
      "Pack",
      "Inference 1",
      "Inference 2",
      "Inference 3",
      "Inference 4",
      "Gates",
      "Verify",
      "Decision",
      "Output"
    ],
    "steps": [
      {
        "id": "input",
        "stageIdx": 0,
        "gridY": 0.5,
        "next_ids": [
          "analysis"
        ],
        "badge": "Input",
        "name": "User Query",
        "desc": "User submits query.",
        "what": "Captures the user's input from the ChatScreen UI.",
        "why": "The entry point for the entire retrieval pipeline.",
        "how": "Reads the bound SwiftUI text state.",
        "code": "struct ChatScreen: View {\n    @State private var query: String = \"\"\n    \n    var body: some View {\n        TextField(\"Ask anything...\", text: $query)\n            .onSubmit { engine.process(query) }\n    }\n}",
        "next": [
          1
        ],
        "gridX": 0.5
      },
      {
        "id": "analysis",
        "stageIdx": 1,
        "gridY": 0.5,
        "next_ids": [
          "cache",
          "embed",
          "keyword"
        ],
        "badge": "Step 1",
        "name": "Query Analysis",
        "what": "Classifies intent and resolves pronouns.",
        "why": "Determines if the query is a lookup, procedure, or comparison.",
        "how": "Uses QueryExecutionPlannerService to build an execution plan.",
        "code": "let plan = await planner.buildPlan(for: query, profile: profile)",
        "next": [
          2,
          3,
          4
        ],
        "gridX": 0.5
      },
      {
        "id": "cache",
        "stageIdx": 2,
        "gridY": 0.5,
        "next_ids": [
          "vector_search"
        ],
        "badge": "Step 1a",
        "name": "Semantic Cache Check",
        "next": [
          5
        ],
        "gridX": 0.5
      },
      {
        "id": "embed",
        "stageIdx": 2,
        "gridY": 1.5,
        "next_ids": [
          "vector_search"
        ],
        "badge": "Step 1b",
        "name": "Query Embed",
        "what": "Converts the user's expanded query into a 384-dimensional vector.",
        "why": "Required to calculate Cosine Similarity against the document chunks in the vector database.",
        "how": "Runs the query through the same Core ML embedding model used during ingestion.",
        "code": "let inputTokens = tokenizer.encode(text: expandedQuery)\nlet inputFeatures = try MLMultiArray(inputTokens)\nlet output = try embeddingModel.prediction(input: inputFeatures)\nlet queryVector = output.embeddings.toArray()",
        "next": [
          5
        ],
        "gridX": 0.5
      },
      {
        "id": "keyword",
        "stageIdx": 2,
        "gridY": 2.5,
        "next_ids": [
          "bm25_search"
        ],
        "badge": "Step 1c",
        "name": "Keyword Extract",
        "what": "Extracts raw keywords from the query for the BM25 lexical search.",
        "why": "BM25 searches fail if fed too many stopwords ('the', 'and', 'is').",
        "how": "Strips punctuation and stop words.",
        "code": "let stopWords: Set<String> = [\"the\", \"is\", \"at\", \"which\", \"on\"]\nlet keywords = expandedQuery.components(separatedBy: .whitespaces)\n    .filter { !stopWords.contains($0.lowercased()) }\n    .joined(separator: \" \")",
        "next": [
          6
        ],
        "gridX": 0.5
      },
      {
        "id": "vector_search",
        "stageIdx": 3,
        "gridY": 0.5,
        "next_ids": [
          "rrf"
        ],
        "badge": "Step 2a",
        "name": "SIMD4 Vector Search",
        "next": [
          7
        ],
        "gridX": 0.5
      },
      {
        "id": "bm25_search",
        "stageIdx": 3,
        "gridY": 1.5,
        "next_ids": [
          "rrf"
        ],
        "badge": "Step 2b",
        "name": "BM25 Search",
        "what": "Executes the exact keyword lookup against the SQLite FTS5 database.",
        "why": "Catches exact matches (like IDs or names) that vector search might miss due to semantic drift.",
        "how": "Runs a MATCH query ordered by the native bm25() function.",
        "code": "let sql = \"\"\"\n    SELECT chunk_id, bm25(doc_index) as score \n    FROM doc_index \n    WHERE doc_index MATCH ? \n    ORDER BY score LIMIT 30\n\"\"\"\nlet results = try db.query(sql, [keywords])",
        "next": [
          7
        ],
        "gridX": 0.5
      },
      {
        "id": "rrf",
        "stageIdx": 4,
        "gridY": 0.5,
        "next_ids": [
          "rerank"
        ],
        "badge": "Step 2c",
        "name": "Hybrid RRF",
        "what": "Merges the Vector and BM25 results using Reciprocal Rank Fusion.",
        "why": "Scores from Vector (Cosine Similarity: 0.0-1.0) and BM25 (Arbitrary floats) are incompatible. RRF relies purely on their rank positions.",
        "how": "Calculates `1 / (k + rank)` for both lists and sums them.",
        "code": "func reciprocalRankFusion(vectorRanks: [String], bm25Ranks: [String], k: Int = 60) -> [(String, Float)] {\n    var scores: [String: Float] = [:]\n    \n    for (rank, id) in vectorRanks.enumerated() {\n        scores[id, default: 0] += 1.0 / Float(k + rank)\n    }\n    for (rank, id) in bm25Ranks.enumerated() {\n        scores[id, default: 0] += 1.0 / Float(k + rank)\n    }\n    \n    return scores.sorted { $0.value > $1.value }\n}",
        "next": [
          8
        ],
        "gridX": 0.5
      },
      {
        "id": "rerank",
        "stageIdx": 5,
        "gridY": 0.5,
        "next_ids": [
          "parent"
        ],
        "badge": "Step 3a",
        "name": "TinyBERT Rerank",
        "what": "Uses a Cross-Encoder to rescore the top candidates by analyzing the query and chunk simultaneously.",
        "why": "Vector search (Bi-Encoder) is fast but misses deep contextual nuance. Cross-Encoders are slow but highly accurate.",
        "how": "Passes `[CLS] Query [SEP] Chunk [SEP]` to a TinyBERT Core ML model.",
        "code": "let crossEncoderInput = \"[CLS] \\(query) [SEP] \\(chunk.text) [SEP]\"\nlet features = tokenizer.encode(crossEncoderInput)\nlet prediction = try crossEncoderModel.prediction(input: features)\nlet relevanceScore = prediction.logits[0].floatValue",
        "next": [
          9
        ],
        "gridX": 0.5
      },
      {
        "id": "parent",
        "stageIdx": 6,
        "gridY": 0.5,
        "next_ids": [
          "compress"
        ],
        "badge": "Step 3b",
        "name": "Parent Document",
        "next": [
          10
        ],
        "gridX": 0.5
      },
      {
        "id": "compress",
        "stageIdx": 7,
        "gridY": 0.5,
        "next_ids": [
          "lim"
        ],
        "badge": "Step 3c",
        "name": "Contextual Compression",
        "next": [
          11
        ],
        "gridX": 0.5
      },
      {
        "id": "lim",
        "stageIdx": 8,
        "gridY": 0.5,
        "next_ids": [
          "pack"
        ],
        "badge": "Step 3d",
        "name": "Lost-in-Middle",
        "what": "Reorders the assembled chunks so the most relevant evidence is at the beginning and end.",
        "why": "LLMs exhibit 'Lost in the Middle' syndrome\u2014they pay attention to the start and end of a prompt, but ignore the middle.",
        "how": "Sorts chunks by relevance, then alternates pushing to the front and back of a deque.",
        "code": "func lostInMiddleReorder(chunks: [Chunk]) -> [Chunk] {\n    let sorted = chunks.sorted { $0.relevance > $1.relevance }\n    var reordered = [Chunk]()\n    for (index, chunk) in sorted.enumerated() {\n        if index % 2 == 0 {\n            reordered.insert(chunk, at: 0)\n        } else {\n            reordered.append(chunk)\n        }\n    }\n    return reordered\n}",
        "next": [
          12
        ],
        "gridX": 0.5
      },
      {
        "id": "pack",
        "stageIdx": 9,
        "gridY": 0.5,
        "next_ids": [
          "gen_1"
        ],
        "badge": "Step 3e",
        "name": "Context Packing",
        "what": "Assembles the final context block while strictly adhering to the model's token limit.",
        "why": "If we exceed 4,096 tokens on-device, the Core ML / Foundation Model API will crash.",
        "how": "Iterates through the reordered chunks, counting tokens, and truncating when the budget is hit.",
        "code": "var contextString = \"\"\nvar tokenCount = 0\n\nfor chunk in reorderedChunks {\n    let count = tokenizer.count(chunk.text)\n    if tokenCount + count > 3800 { break } // Leave room for query/sys prompt\n    contextString += \"\\n---\\n\\(chunk.text)\"\n    tokenCount += count\n}",
        "next": [
          13
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_1",
        "stageIdx": 10,
        "gridY": 0.5,
        "next_ids": [
          "gen_2",
          "gen_3"
        ],
        "badge": "Step A",
        "name": "LoRA Injection (3B)",
        "what": "Dynamically loads a Low-Rank Adaptation (LoRA) adapter into the 3B Base Model.",
        "why": "The base model is generic. The LoRA tunes it specifically for RAG citation generation without needing a separate 3GB model file.",
        "how": "Uses Apple's MLModel API to map the adapter weights into the base matrix.",
        "code": "let config = MLModelConfiguration()\nlet adapterURL = URL(fileURLWithPath: \"rag_citation_adapter.mlmodelc\")\ntry config.addParameterWeights(adapterURL)\nlet model = try MLModel(contentsOf: baseModelURL, configuration: config)",
        "next": [
          14,
          15
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_2",
        "stageIdx": 11,
        "gridY": 0.5,
        "next_ids": [
          "gen_4"
        ],
        "badge": "Step B",
        "name": "Draft Generation",
        "what": "Uses a tiny 48M parameter model to rapidly draft candidate tokens.",
        "why": "Large models are slow at generating tokens one-by-one. Tiny models can guess the next 5 tokens almost instantly.",
        "how": "Speculative Decoding architecture.",
        "code": "let draftTokens = try await tinyModel.generate(count: 5)\n// Forward to base model for verification",
        "next": [
          16
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_3",
        "stageIdx": 11,
        "gridY": 1.5,
        "next_ids": [
          "gen_4"
        ],
        "badge": "Step C",
        "name": "Parallel Verification",
        "what": "The 3B Base Model evaluates the draft tokens in parallel.",
        "why": "Evaluating 5 tokens at once is significantly faster than generating them sequentially.",
        "how": "Calculates logits for the draft sequence. If the logits agree, the tokens are accepted.",
        "code": "let verificationLogits = try await baseModel.forward(draftTokens)\nlet accepted = verifySequence(draftTokens, against: verificationLogits)\nif !accepted { \n    // Fall back to sequential generation\n}",
        "next": [
          16
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_4",
        "stageIdx": 12,
        "gridY": 0.5,
        "next_ids": [
          "verify_1"
        ],
        "badge": "Step D",
        "name": "Guided Generation",
        "what": "Forces the model to output strict JSON or citation schemas.",
        "why": "LLMs often drift from the requested format. Guided generation blocks invalid tokens at the sampler level.",
        "how": "Uses a Finite State Machine (FSM) or Regex masking during token selection.",
        "code": "let regex = try NSRegularExpression(pattern: \"\\\\[\\\\d+\\\\]\")\nlet sampler = RegexConstrainedSampler(regex: regex)\nlet token = sampler.sample(logits: logits)",
        "next": [
          17
        ],
        "gridX": 0.5
      },
      {
        "id": "verify_1",
        "stageIdx": 14,
        "gridY": 0.5,
        "next_ids": [
          "verify_2"
        ],
        "badge": "Step 5a",
        "name": "Verification Gates A-I",
        "what": "Runs 9 parallel rule-based heuristics on the generated answer against the source context.",
        "why": "LLMs hallucinate. We must cryptographically or heuristically verify that claims made in the answer exist in the provided chunks.",
        "how": "Extracts nouns/numbers from the answer and verifies their presence in the source text.",
        "code": "func verifyGroundedness(answer: String, context: String) -> Bool {\n    let answerNumbers = extractNumbers(answer)\n    for num in answerNumbers {\n        guard context.contains(num) else {\n            print(\"Gate E (Numerical Fidelity) FAILED on: \\(num)\")\n            return false\n        }\n    }\n    return true\n}",
        "next": [
          18
        ],
        "gridX": 0.5
      },
      {
        "id": "verify_2",
        "stageIdx": 15,
        "gridY": 0.5,
        "next_ids": [
          "abstain",
          "pass"
        ],
        "badge": "Step 5b",
        "name": "Negation & Overlap",
        "what": "Checks if the model generated a negation ('not', 'never') that contradicts the source context.",
        "why": "Models often flip the polarity of sentences if they get confused by complex grammar.",
        "how": "Uses NLTagger and Dependency Parsing to compare negation modifiers.",
        "code": "let answerPolarity = analyzePolarity(answer)\nlet contextPolarity = analyzePolarity(context)\n\nif answerPolarity == .negative && contextPolarity == .positive {\n    // Flag potential hallucinated contradiction\n    return .abstain\n}",
        "next": [
          19,
          20
        ],
        "gridX": 0.5
      },
      {
        "id": "abstain",
        "stageIdx": 16,
        "gridY": 0.5,
        "next_ids": [],
        "badge": "Fail",
        "name": "Abstain",
        "what": "The engine intercepts the response and refuses to answer.",
        "why": "OpenIntelligence values accuracy over helpfulness. If the verification gates fail, it is better to say 'I don't know'.",
        "how": "Replaces the output with a pre-canned abstention message.",
        "code": "if verificationResult == .failed {\n    ui.render(text: \"I could not find a verified answer to your question in the selected documents.\")\n}",
        "next": [],
        "gridX": 0.5
      },
      {
        "id": "pass",
        "stageIdx": 16,
        "gridY": 1.5,
        "next_ids": [
          "output"
        ],
        "badge": "Pass",
        "name": "Grounded Response",
        "what": "The engine approves the response for display.",
        "why": "All verification gates passed.",
        "how": "Routes the payload to the UI layer.",
        "code": "ui.render(text: generatedAnswer, citations: resolvedCitations)",
        "next": [
          21
        ],
        "gridX": 0.5
      },
      {
        "id": "output",
        "stageIdx": 17,
        "gridY": 0.5,
        "next_ids": [],
        "badge": "Output",
        "name": "Final Response",
        "what": "Renders the text to the screen with clickable citation markers.",
        "why": "Users need to trace the AI's claims back to the source PDFs.",
        "how": "Uses SwiftUI Text with AttributedString attributes.",
        "code": "var attributedString = AttributedString(answer)\nfor citation in citations {\n    if let range = attributedString.range(of: citation.marker) {\n        attributedString[range].link = URL(string: \"openintel://doc/\\(citation.docId)\")\n    }\n}",
        "next": [],
        "gridX": 0.5
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
      "Input",
      "Analysis",
      "Enhancement",
      "Search",
      "RRF",
      "Rerank",
      "Sibling",
      "Compress",
      "LIM",
      "Pack",
      "Inference 1",
      "Inference 2",
      "Inference 3",
      "Inference 4",
      "Gates",
      "Verify",
      "Decision",
      "Output"
    ],
    "steps": [
      {
        "id": "input",
        "stageIdx": 0,
        "gridY": 0.5,
        "next_ids": [
          "analysis"
        ],
        "badge": "Input",
        "name": "User Query",
        "desc": "User submits query.",
        "what": "Captures the user's input from the ChatScreen UI.",
        "why": "The entry point for the entire retrieval pipeline.",
        "how": "Reads the bound SwiftUI text state.",
        "code": "struct ChatScreen: View {\n    @State private var query: String = \"\"\n    \n    var body: some View {\n        TextField(\"Ask anything...\", text: $query)\n            .onSubmit { engine.process(query) }\n    }\n}",
        "next": [
          1
        ],
        "gridX": 0.5
      },
      {
        "id": "analysis",
        "stageIdx": 1,
        "gridY": 0.5,
        "next_ids": [
          "cache",
          "embed",
          "keyword"
        ],
        "badge": "Step 1",
        "name": "Query Analysis",
        "what": "Classifies intent and resolves pronouns.",
        "why": "Determines if the query is a lookup, procedure, or comparison.",
        "how": "Uses QueryExecutionPlannerService to build an execution plan.",
        "code": "let plan = await planner.buildPlan(for: query, profile: profile)",
        "next": [
          2,
          3,
          4
        ],
        "gridX": 0.5
      },
      {
        "id": "cache",
        "stageIdx": 2,
        "gridY": 0.5,
        "next_ids": [
          "vector_search"
        ],
        "badge": "Step 1a",
        "name": "Semantic Cache Check",
        "next": [
          5
        ],
        "gridX": 0.5
      },
      {
        "id": "embed",
        "stageIdx": 2,
        "gridY": 1.5,
        "next_ids": [
          "vector_search"
        ],
        "badge": "Step 1b",
        "name": "Query Embed",
        "what": "Converts the user's expanded query into a 384-dimensional vector.",
        "why": "Required to calculate Cosine Similarity against the document chunks in the vector database.",
        "how": "Runs the query through the same Core ML embedding model used during ingestion.",
        "code": "let inputTokens = tokenizer.encode(text: expandedQuery)\nlet inputFeatures = try MLMultiArray(inputTokens)\nlet output = try embeddingModel.prediction(input: inputFeatures)\nlet queryVector = output.embeddings.toArray()",
        "next": [
          5
        ],
        "gridX": 0.5
      },
      {
        "id": "keyword",
        "stageIdx": 2,
        "gridY": 2.5,
        "next_ids": [
          "bm25_search"
        ],
        "badge": "Step 1c",
        "name": "Keyword Extract",
        "what": "Extracts raw keywords from the query for the BM25 lexical search.",
        "why": "BM25 searches fail if fed too many stopwords ('the', 'and', 'is').",
        "how": "Strips punctuation and stop words.",
        "code": "let stopWords: Set<String> = [\"the\", \"is\", \"at\", \"which\", \"on\"]\nlet keywords = expandedQuery.components(separatedBy: .whitespaces)\n    .filter { !stopWords.contains($0.lowercased()) }\n    .joined(separator: \" \")",
        "next": [
          6
        ],
        "gridX": 0.5
      },
      {
        "id": "vector_search",
        "stageIdx": 3,
        "gridY": 0.5,
        "next_ids": [
          "rrf"
        ],
        "badge": "Step 2a",
        "name": "SIMD4 Vector Search",
        "next": [
          7
        ],
        "gridX": 0.5
      },
      {
        "id": "bm25_search",
        "stageIdx": 3,
        "gridY": 1.5,
        "next_ids": [
          "rrf"
        ],
        "badge": "Step 2b",
        "name": "BM25 Search",
        "what": "Executes the exact keyword lookup against the SQLite FTS5 database.",
        "why": "Catches exact matches (like IDs or names) that vector search might miss due to semantic drift.",
        "how": "Runs a MATCH query ordered by the native bm25() function.",
        "code": "let sql = \"\"\"\n    SELECT chunk_id, bm25(doc_index) as score \n    FROM doc_index \n    WHERE doc_index MATCH ? \n    ORDER BY score LIMIT 30\n\"\"\"\nlet results = try db.query(sql, [keywords])",
        "next": [
          7
        ],
        "gridX": 0.5
      },
      {
        "id": "rrf",
        "stageIdx": 4,
        "gridY": 0.5,
        "next_ids": [
          "rerank"
        ],
        "badge": "Step 2c",
        "name": "Hybrid RRF",
        "what": "Merges the Vector and BM25 results using Reciprocal Rank Fusion.",
        "why": "Scores from Vector (Cosine Similarity: 0.0-1.0) and BM25 (Arbitrary floats) are incompatible. RRF relies purely on their rank positions.",
        "how": "Calculates `1 / (k + rank)` for both lists and sums them.",
        "code": "func reciprocalRankFusion(vectorRanks: [String], bm25Ranks: [String], k: Int = 60) -> [(String, Float)] {\n    var scores: [String: Float] = [:]\n    \n    for (rank, id) in vectorRanks.enumerated() {\n        scores[id, default: 0] += 1.0 / Float(k + rank)\n    }\n    for (rank, id) in bm25Ranks.enumerated() {\n        scores[id, default: 0] += 1.0 / Float(k + rank)\n    }\n    \n    return scores.sorted { $0.value > $1.value }\n}",
        "next": [
          8
        ],
        "gridX": 0.5
      },
      {
        "id": "rerank",
        "stageIdx": 5,
        "gridY": 0.5,
        "next_ids": [
          "parent"
        ],
        "badge": "Step 3a",
        "name": "TinyBERT Rerank",
        "what": "Uses a Cross-Encoder to rescore the top candidates by analyzing the query and chunk simultaneously.",
        "why": "Vector search (Bi-Encoder) is fast but misses deep contextual nuance. Cross-Encoders are slow but highly accurate.",
        "how": "Passes `[CLS] Query [SEP] Chunk [SEP]` to a TinyBERT Core ML model.",
        "code": "let crossEncoderInput = \"[CLS] \\(query) [SEP] \\(chunk.text) [SEP]\"\nlet features = tokenizer.encode(crossEncoderInput)\nlet prediction = try crossEncoderModel.prediction(input: features)\nlet relevanceScore = prediction.logits[0].floatValue",
        "next": [
          9
        ],
        "gridX": 0.5
      },
      {
        "id": "parent",
        "stageIdx": 6,
        "gridY": 0.5,
        "next_ids": [
          "compress"
        ],
        "badge": "Step 3b",
        "name": "Parent Document",
        "next": [
          10
        ],
        "gridX": 0.5
      },
      {
        "id": "compress",
        "stageIdx": 7,
        "gridY": 0.5,
        "next_ids": [
          "lim"
        ],
        "badge": "Step 3c",
        "name": "Contextual Compression",
        "next": [
          11
        ],
        "gridX": 0.5
      },
      {
        "id": "lim",
        "stageIdx": 8,
        "gridY": 0.5,
        "next_ids": [
          "pack"
        ],
        "badge": "Step 3d",
        "name": "Lost-in-Middle",
        "what": "Reorders the assembled chunks so the most relevant evidence is at the beginning and end.",
        "why": "LLMs exhibit 'Lost in the Middle' syndrome\u2014they pay attention to the start and end of a prompt, but ignore the middle.",
        "how": "Sorts chunks by relevance, then alternates pushing to the front and back of a deque.",
        "code": "func lostInMiddleReorder(chunks: [Chunk]) -> [Chunk] {\n    let sorted = chunks.sorted { $0.relevance > $1.relevance }\n    var reordered = [Chunk]()\n    for (index, chunk) in sorted.enumerated() {\n        if index % 2 == 0 {\n            reordered.insert(chunk, at: 0)\n        } else {\n            reordered.append(chunk)\n        }\n    }\n    return reordered\n}",
        "next": [
          12
        ],
        "gridX": 0.5
      },
      {
        "id": "pack",
        "stageIdx": 9,
        "gridY": 0.5,
        "next_ids": [
          "gen_1"
        ],
        "badge": "Step 3e",
        "name": "Context Packing",
        "what": "Assembles the final context block while strictly adhering to the model's token limit.",
        "why": "If we exceed 4,096 tokens on-device, the Core ML / Foundation Model API will crash.",
        "how": "Iterates through the reordered chunks, counting tokens, and truncating when the budget is hit.",
        "code": "var contextString = \"\"\nvar tokenCount = 0\n\nfor chunk in reorderedChunks {\n    let count = tokenizer.count(chunk.text)\n    if tokenCount + count > 3800 { break } // Leave room for query/sys prompt\n    contextString += \"\\n---\\n\\(chunk.text)\"\n    tokenCount += count\n}",
        "next": [
          13
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_1",
        "stageIdx": 10,
        "gridY": 0.5,
        "next_ids": [
          "gen_2"
        ],
        "badge": "Step A",
        "name": "NAND Flash Paging",
        "what": "Streams the 20B model weights directly from the SSD (NVMe) rather than loading them entirely into unified memory (RAM).",
        "why": "A 20B model requires ~10GB of RAM. Paging allows it to run on base Model Macs without Out-of-Memory (OOM) crashes.",
        "how": "Uses Apple's unified memory architecture and mmap() to page active experts.",
        "code": "let weightBuffer = try MLMultiArray(shape: [shape], dataType: .float16)\n// Weights are mapped, not explicitly loaded\nweightBuffer.withUnsafeMutableBytes { ptr in\n    mmap(ptr.baseAddress, ptr.count, PROT_READ, MAP_SHARED, fd, 0)\n}",
        "next": [
          14
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_2",
        "stageIdx": 11,
        "gridY": 0.5,
        "next_ids": [
          "gen_3",
          "gen_4"
        ],
        "badge": "Step B",
        "name": "MoE Expert Router",
        "what": "Selects which sub-networks (experts) inside the 20B model should process the current token.",
        "why": "Allows a 20B parameter model to execute with the speed and battery drain of a 2.8B model.",
        "how": "A gating linear layer outputs probabilities, routing to the top 2 experts.",
        "code": "let gatingLogits = gatingLayer.forward(hiddenState)\nlet top2Experts = gatingLogits.topK(2)\n\nvar output = zeros()\nfor expert in top2Experts {\n    let expertOut = experts[expert.index].forward(hiddenState)\n    output += expertOut * expert.weight\n}",
        "next": [
          15,
          16
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_3",
        "stageIdx": 12,
        "gridY": 0.5,
        "next_ids": [
          "gen_5"
        ],
        "badge": "Step C",
        "name": "Draft Generation",
        "what": "Uses a tiny 48M parameter model to rapidly draft candidate tokens.",
        "why": "Large models are slow at generating tokens one-by-one. Tiny models can guess the next 5 tokens almost instantly.",
        "how": "Speculative Decoding architecture.",
        "code": "let draftTokens = try await tinyModel.generate(count: 5)\n// Forward to base model for verification",
        "next": [
          17
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_4",
        "stageIdx": 12,
        "gridY": 1.5,
        "next_ids": [
          "gen_5"
        ],
        "badge": "Step D",
        "name": "MoE Verification",
        "what": "The 20B MoE model verifies the draft sequence.",
        "why": "Combines Speculative Decoding speed with MoE scalability.",
        "how": "Parallel forward pass through the routed experts.",
        "code": "let verificationLogits = try await moeModel.forward(draftTokens)",
        "next": [
          17
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_5",
        "stageIdx": 13,
        "gridY": 0.5,
        "next_ids": [
          "verify_1"
        ],
        "badge": "Step E",
        "name": "Guided Generation",
        "what": "Forces the model to output strict JSON or citation schemas.",
        "why": "LLMs often drift from the requested format. Guided generation blocks invalid tokens at the sampler level.",
        "how": "Uses a Finite State Machine (FSM) or Regex masking during token selection.",
        "code": "let regex = try NSRegularExpression(pattern: \"\\\\[\\\\d+\\\\]\")\nlet sampler = RegexConstrainedSampler(regex: regex)\nlet token = sampler.sample(logits: logits)",
        "next": [
          18
        ],
        "gridX": 0.5
      },
      {
        "id": "verify_1",
        "stageIdx": 14,
        "gridY": 0.5,
        "next_ids": [
          "verify_2"
        ],
        "badge": "Step 5a",
        "name": "Verification Gates A-I",
        "what": "Runs 9 parallel rule-based heuristics on the generated answer against the source context.",
        "why": "LLMs hallucinate. We must cryptographically or heuristically verify that claims made in the answer exist in the provided chunks.",
        "how": "Extracts nouns/numbers from the answer and verifies their presence in the source text.",
        "code": "func verifyGroundedness(answer: String, context: String) -> Bool {\n    let answerNumbers = extractNumbers(answer)\n    for num in answerNumbers {\n        guard context.contains(num) else {\n            print(\"Gate E (Numerical Fidelity) FAILED on: \\(num)\")\n            return false\n        }\n    }\n    return true\n}",
        "next": [
          19
        ],
        "gridX": 0.5
      },
      {
        "id": "verify_2",
        "stageIdx": 15,
        "gridY": 0.5,
        "next_ids": [
          "abstain",
          "pass"
        ],
        "badge": "Step 5b",
        "name": "Negation & Overlap",
        "what": "Checks if the model generated a negation ('not', 'never') that contradicts the source context.",
        "why": "Models often flip the polarity of sentences if they get confused by complex grammar.",
        "how": "Uses NLTagger and Dependency Parsing to compare negation modifiers.",
        "code": "let answerPolarity = analyzePolarity(answer)\nlet contextPolarity = analyzePolarity(context)\n\nif answerPolarity == .negative && contextPolarity == .positive {\n    // Flag potential hallucinated contradiction\n    return .abstain\n}",
        "next": [
          20,
          21
        ],
        "gridX": 0.5
      },
      {
        "id": "abstain",
        "stageIdx": 16,
        "gridY": 0.5,
        "next_ids": [],
        "badge": "Fail",
        "name": "Abstain",
        "what": "The engine intercepts the response and refuses to answer.",
        "why": "OpenIntelligence values accuracy over helpfulness. If the verification gates fail, it is better to say 'I don't know'.",
        "how": "Replaces the output with a pre-canned abstention message.",
        "code": "if verificationResult == .failed {\n    ui.render(text: \"I could not find a verified answer to your question in the selected documents.\")\n}",
        "next": [],
        "gridX": 0.5
      },
      {
        "id": "pass",
        "stageIdx": 16,
        "gridY": 1.5,
        "next_ids": [
          "output"
        ],
        "badge": "Pass",
        "name": "Grounded Response",
        "what": "The engine approves the response for display.",
        "why": "All verification gates passed.",
        "how": "Routes the payload to the UI layer.",
        "code": "ui.render(text: generatedAnswer, citations: resolvedCitations)",
        "next": [
          22
        ],
        "gridX": 0.5
      },
      {
        "id": "output",
        "stageIdx": 17,
        "gridY": 0.5,
        "next_ids": [],
        "badge": "Output",
        "name": "Final Response",
        "what": "Renders the text to the screen with clickable citation markers.",
        "why": "Users need to trace the AI's claims back to the source PDFs.",
        "how": "Uses SwiftUI Text with AttributedString attributes.",
        "code": "var attributedString = AttributedString(answer)\nfor citation in citations {\n    if let range = attributedString.range(of: citation.marker) {\n        attributedString[range].link = URL(string: \"openintel://doc/\\(citation.docId)\")\n    }\n}",
        "next": [],
        "gridX": 0.5
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
      "Input",
      "Analysis",
      "Enhancement",
      "Search",
      "RRF",
      "Rerank",
      "Sibling",
      "Compress",
      "LIM",
      "Pack",
      "Inference 1",
      "Inference 2",
      "Inference 3",
      "Inference 4",
      "Gates",
      "Verify",
      "Decision",
      "Output"
    ],
    "steps": [
      {
        "id": "input",
        "stageIdx": 0,
        "gridY": 0.5,
        "next_ids": [
          "analysis"
        ],
        "badge": "Input",
        "name": "User Query",
        "desc": "User submits query.",
        "what": "Captures the user's input from the ChatScreen UI.",
        "why": "The entry point for the entire retrieval pipeline.",
        "how": "Reads the bound SwiftUI text state.",
        "code": "struct ChatScreen: View {\n    @State private var query: String = \"\"\n    \n    var body: some View {\n        TextField(\"Ask anything...\", text: $query)\n            .onSubmit { engine.process(query) }\n    }\n}",
        "next": [
          1
        ],
        "gridX": 0.5
      },
      {
        "id": "analysis",
        "stageIdx": 1,
        "gridY": 0.5,
        "next_ids": [
          "cache",
          "embed",
          "keyword"
        ],
        "badge": "Step 1",
        "name": "Query Analysis",
        "what": "Classifies intent and resolves pronouns.",
        "why": "Determines if the query is a lookup, procedure, or comparison.",
        "how": "Uses QueryExecutionPlannerService to build an execution plan.",
        "code": "let plan = await planner.buildPlan(for: query, profile: profile)",
        "next": [
          2,
          3,
          4
        ],
        "gridX": 0.5
      },
      {
        "id": "cache",
        "stageIdx": 2,
        "gridY": 0.5,
        "next_ids": [
          "vector_search"
        ],
        "badge": "Step 1a",
        "name": "Semantic Cache Check",
        "next": [
          5
        ],
        "gridX": 0.5
      },
      {
        "id": "embed",
        "stageIdx": 2,
        "gridY": 1.5,
        "next_ids": [
          "vector_search"
        ],
        "badge": "Step 1b",
        "name": "Query Embed",
        "what": "Converts the user's expanded query into a 384-dimensional vector.",
        "why": "Required to calculate Cosine Similarity against the document chunks in the vector database.",
        "how": "Runs the query through the same Core ML embedding model used during ingestion.",
        "code": "let inputTokens = tokenizer.encode(text: expandedQuery)\nlet inputFeatures = try MLMultiArray(inputTokens)\nlet output = try embeddingModel.prediction(input: inputFeatures)\nlet queryVector = output.embeddings.toArray()",
        "next": [
          5
        ],
        "gridX": 0.5
      },
      {
        "id": "keyword",
        "stageIdx": 2,
        "gridY": 2.5,
        "next_ids": [
          "bm25_search"
        ],
        "badge": "Step 1c",
        "name": "Keyword Extract",
        "what": "Extracts raw keywords from the query for the BM25 lexical search.",
        "why": "BM25 searches fail if fed too many stopwords ('the', 'and', 'is').",
        "how": "Strips punctuation and stop words.",
        "code": "let stopWords: Set<String> = [\"the\", \"is\", \"at\", \"which\", \"on\"]\nlet keywords = expandedQuery.components(separatedBy: .whitespaces)\n    .filter { !stopWords.contains($0.lowercased()) }\n    .joined(separator: \" \")",
        "next": [
          6
        ],
        "gridX": 0.5
      },
      {
        "id": "vector_search",
        "stageIdx": 3,
        "gridY": 0.5,
        "next_ids": [
          "rrf"
        ],
        "badge": "Step 2a",
        "name": "SIMD4 Vector Search",
        "next": [
          7
        ],
        "gridX": 0.5
      },
      {
        "id": "bm25_search",
        "stageIdx": 3,
        "gridY": 1.5,
        "next_ids": [
          "rrf"
        ],
        "badge": "Step 2b",
        "name": "BM25 Search",
        "what": "Executes the exact keyword lookup against the SQLite FTS5 database.",
        "why": "Catches exact matches (like IDs or names) that vector search might miss due to semantic drift.",
        "how": "Runs a MATCH query ordered by the native bm25() function.",
        "code": "let sql = \"\"\"\n    SELECT chunk_id, bm25(doc_index) as score \n    FROM doc_index \n    WHERE doc_index MATCH ? \n    ORDER BY score LIMIT 30\n\"\"\"\nlet results = try db.query(sql, [keywords])",
        "next": [
          7
        ],
        "gridX": 0.5
      },
      {
        "id": "rrf",
        "stageIdx": 4,
        "gridY": 0.5,
        "next_ids": [
          "rerank"
        ],
        "badge": "Step 2c",
        "name": "Hybrid RRF",
        "what": "Merges the Vector and BM25 results using Reciprocal Rank Fusion.",
        "why": "Scores from Vector (Cosine Similarity: 0.0-1.0) and BM25 (Arbitrary floats) are incompatible. RRF relies purely on their rank positions.",
        "how": "Calculates `1 / (k + rank)` for both lists and sums them.",
        "code": "func reciprocalRankFusion(vectorRanks: [String], bm25Ranks: [String], k: Int = 60) -> [(String, Float)] {\n    var scores: [String: Float] = [:]\n    \n    for (rank, id) in vectorRanks.enumerated() {\n        scores[id, default: 0] += 1.0 / Float(k + rank)\n    }\n    for (rank, id) in bm25Ranks.enumerated() {\n        scores[id, default: 0] += 1.0 / Float(k + rank)\n    }\n    \n    return scores.sorted { $0.value > $1.value }\n}",
        "next": [
          8
        ],
        "gridX": 0.5
      },
      {
        "id": "rerank",
        "stageIdx": 5,
        "gridY": 0.5,
        "next_ids": [
          "parent"
        ],
        "badge": "Step 3a",
        "name": "TinyBERT Rerank",
        "what": "Uses a Cross-Encoder to rescore the top candidates by analyzing the query and chunk simultaneously.",
        "why": "Vector search (Bi-Encoder) is fast but misses deep contextual nuance. Cross-Encoders are slow but highly accurate.",
        "how": "Passes `[CLS] Query [SEP] Chunk [SEP]` to a TinyBERT Core ML model.",
        "code": "let crossEncoderInput = \"[CLS] \\(query) [SEP] \\(chunk.text) [SEP]\"\nlet features = tokenizer.encode(crossEncoderInput)\nlet prediction = try crossEncoderModel.prediction(input: features)\nlet relevanceScore = prediction.logits[0].floatValue",
        "next": [
          9
        ],
        "gridX": 0.5
      },
      {
        "id": "parent",
        "stageIdx": 6,
        "gridY": 0.5,
        "next_ids": [
          "compress"
        ],
        "badge": "Step 3b",
        "name": "Parent Document",
        "next": [
          10
        ],
        "gridX": 0.5
      },
      {
        "id": "compress",
        "stageIdx": 7,
        "gridY": 0.5,
        "next_ids": [
          "lim"
        ],
        "badge": "Step 3c",
        "name": "Contextual Compression",
        "next": [
          11
        ],
        "gridX": 0.5
      },
      {
        "id": "lim",
        "stageIdx": 8,
        "gridY": 0.5,
        "next_ids": [
          "pack"
        ],
        "badge": "Step 3d",
        "name": "Lost-in-Middle",
        "what": "Reorders the assembled chunks so the most relevant evidence is at the beginning and end.",
        "why": "LLMs exhibit 'Lost in the Middle' syndrome\u2014they pay attention to the start and end of a prompt, but ignore the middle.",
        "how": "Sorts chunks by relevance, then alternates pushing to the front and back of a deque.",
        "code": "func lostInMiddleReorder(chunks: [Chunk]) -> [Chunk] {\n    let sorted = chunks.sorted { $0.relevance > $1.relevance }\n    var reordered = [Chunk]()\n    for (index, chunk) in sorted.enumerated() {\n        if index % 2 == 0 {\n            reordered.insert(chunk, at: 0)\n        } else {\n            reordered.append(chunk)\n        }\n    }\n    return reordered\n}",
        "next": [
          12
        ],
        "gridX": 0.5
      },
      {
        "id": "pack",
        "stageIdx": 9,
        "gridY": 0.5,
        "next_ids": [
          "gen_1"
        ],
        "badge": "Step 3e",
        "name": "Context Packing",
        "what": "Assembles the final context block while strictly adhering to the model's token limit.",
        "why": "If we exceed 4,096 tokens on-device, the Core ML / Foundation Model API will crash.",
        "how": "Iterates through the reordered chunks, counting tokens, and truncating when the budget is hit.",
        "code": "var contextString = \"\"\nvar tokenCount = 0\n\nfor chunk in reorderedChunks {\n    let count = tokenizer.count(chunk.text)\n    if tokenCount + count > 3800 { break } // Leave room for query/sys prompt\n    contextString += \"\\n---\\n\\(chunk.text)\"\n    tokenCount += count\n}",
        "next": [
          13
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_1",
        "stageIdx": 10,
        "gridY": 0.5,
        "next_ids": [
          "gen_2"
        ],
        "badge": "Step A",
        "name": "PCC Escalate",
        "what": "Detects that the query requires 32K context and routes away from the local device.",
        "why": "On-device memory cannot physically support a 32,000 token context window.",
        "how": "Checks token count and initiates the Private Cloud Compute handshake.",
        "code": "if contextTokenCount > 4096 {\n    let session = PrivateCloudComputeSession()\n    try await session.authenticate()\n}",
        "next": [
          14
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_2",
        "stageIdx": 11,
        "gridY": 0.5,
        "next_ids": [
          "gen_3"
        ],
        "badge": "Step B",
        "name": "Secure Payload Transfer",
        "what": "Encrypts the 32K context window and transmits it to the PCC node.",
        "why": "Ensures Apple cannot read the user's private documents during cloud inference.",
        "how": "Uses target diffusion and end-to-end encryption tied to the user's iCloud key.",
        "code": "let encryptedPayload = try Crypto.encrypt(payload: context, using: pccPublicKey)\nlet request = URLRequest(url: pccEndpoint)\nrequest.httpBody = encryptedPayload\nlet response = try await URLSession.shared.data(for: request)",
        "next": [
          15
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_3",
        "stageIdx": 12,
        "gridY": 0.5,
        "next_ids": [
          "verify_1"
        ],
        "badge": "Step C",
        "name": "Cloud GPU Execution",
        "what": "The server-side MoE (70B+) executes the inference on Apple Silicon server nodes.",
        "why": "Massive compute allows for deep reasoning across 32,000 tokens.",
        "how": "Returns an encrypted stream of tokens.",
        "code": "// (Server-Side Execution)\n// The payload is decrypted in the secure enclave, processed, and streamed back.",
        "next": [
          16
        ],
        "gridX": 0.5
      },
      {
        "id": "verify_1",
        "stageIdx": 14,
        "gridY": 0.5,
        "next_ids": [
          "verify_2"
        ],
        "badge": "Step 5a",
        "name": "Verification Gates A-I",
        "what": "Runs 9 parallel rule-based heuristics on the generated answer against the source context.",
        "why": "LLMs hallucinate. We must cryptographically or heuristically verify that claims made in the answer exist in the provided chunks.",
        "how": "Extracts nouns/numbers from the answer and verifies their presence in the source text.",
        "code": "func verifyGroundedness(answer: String, context: String) -> Bool {\n    let answerNumbers = extractNumbers(answer)\n    for num in answerNumbers {\n        guard context.contains(num) else {\n            print(\"Gate E (Numerical Fidelity) FAILED on: \\(num)\")\n            return false\n        }\n    }\n    return true\n}",
        "next": [
          17
        ],
        "gridX": 0.5
      },
      {
        "id": "verify_2",
        "stageIdx": 15,
        "gridY": 0.5,
        "next_ids": [
          "abstain",
          "pass"
        ],
        "badge": "Step 5b",
        "name": "Negation & Overlap",
        "what": "Checks if the model generated a negation ('not', 'never') that contradicts the source context.",
        "why": "Models often flip the polarity of sentences if they get confused by complex grammar.",
        "how": "Uses NLTagger and Dependency Parsing to compare negation modifiers.",
        "code": "let answerPolarity = analyzePolarity(answer)\nlet contextPolarity = analyzePolarity(context)\n\nif answerPolarity == .negative && contextPolarity == .positive {\n    // Flag potential hallucinated contradiction\n    return .abstain\n}",
        "next": [
          18,
          19
        ],
        "gridX": 0.5
      },
      {
        "id": "abstain",
        "stageIdx": 16,
        "gridY": 0.5,
        "next_ids": [],
        "badge": "Fail",
        "name": "Abstain",
        "what": "The engine intercepts the response and refuses to answer.",
        "why": "OpenIntelligence values accuracy over helpfulness. If the verification gates fail, it is better to say 'I don't know'.",
        "how": "Replaces the output with a pre-canned abstention message.",
        "code": "if verificationResult == .failed {\n    ui.render(text: \"I could not find a verified answer to your question in the selected documents.\")\n}",
        "next": [],
        "gridX": 0.5
      },
      {
        "id": "pass",
        "stageIdx": 16,
        "gridY": 1.5,
        "next_ids": [
          "output"
        ],
        "badge": "Pass",
        "name": "Grounded Response",
        "what": "The engine approves the response for display.",
        "why": "All verification gates passed.",
        "how": "Routes the payload to the UI layer.",
        "code": "ui.render(text: generatedAnswer, citations: resolvedCitations)",
        "next": [
          20
        ],
        "gridX": 0.5
      },
      {
        "id": "output",
        "stageIdx": 17,
        "gridY": 0.5,
        "next_ids": [],
        "badge": "Output",
        "name": "Final Response",
        "what": "Renders the text to the screen with clickable citation markers.",
        "why": "Users need to trace the AI's claims back to the source PDFs.",
        "how": "Uses SwiftUI Text with AttributedString attributes.",
        "code": "var attributedString = AttributedString(answer)\nfor citation in citations {\n    if let range = attributedString.range(of: citation.marker) {\n        attributedString[range].link = URL(string: \"openintel://doc/\\(citation.docId)\")\n    }\n}",
        "next": [],
        "gridX": 0.5
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
      "Input",
      "Orchestrator",
      "Analysis",
      "Embed",
      "Search",
      "RRF",
      "Speculate",
      "Rerank",
      "Sibling",
      "LIM",
      "Pack",
      "Inference 1",
      "Inference 2",
      "Inference 3",
      "Inference 4",
      "Gates",
      "Verify",
      "Decision",
      "Output"
    ],
    "steps": [
      {
        "id": "input",
        "stageIdx": 0,
        "gridY": 0.5,
        "next_ids": [
          "orchestrator"
        ],
        "badge": "Input",
        "name": "User Query",
        "desc": "User submits query.",
        "what": "Captures the user's input from the ChatScreen UI.",
        "why": "The entry point for the entire retrieval pipeline.",
        "how": "Reads the bound SwiftUI text state.",
        "code": "struct ChatScreen: View {\n    @State private var query: String = \"\"\n    \n    var body: some View {\n        TextField(\"Ask anything...\", text: $query)\n            .onSubmit { engine.process(query) }\n    }\n}",
        "next": [
          1
        ],
        "gridX": 0.5
      },
      {
        "id": "orchestrator",
        "stageIdx": 1,
        "gridY": 0.5,
        "next_ids": [
          "rag_check",
          "multi_query"
        ],
        "badge": "Step 1",
        "name": "Agentic Orchestrator",
        "next": [
          2,
          3
        ],
        "gridX": 0.5
      },
      {
        "id": "rag_check",
        "stageIdx": 2,
        "gridY": 0.5,
        "next_ids": [
          "embed"
        ],
        "badge": "Step 1a",
        "name": "Self-RAG Check",
        "next": [
          4
        ],
        "gridX": 0.5
      },
      {
        "id": "multi_query",
        "stageIdx": 2,
        "gridY": 1.5,
        "next_ids": [
          "embed"
        ],
        "badge": "Step 1b",
        "name": "Multi-Query Expansion",
        "next": [
          4
        ],
        "gridX": 0.5
      },
      {
        "id": "embed",
        "stageIdx": 3,
        "gridY": 0.5,
        "next_ids": [
          "vector",
          "bm25"
        ],
        "badge": "Step 1c",
        "name": "Batch Embed & Extract",
        "next": [
          5,
          6
        ],
        "gridX": 0.5
      },
      {
        "id": "vector",
        "stageIdx": 4,
        "gridY": 0.5,
        "next_ids": [
          "rrf"
        ],
        "badge": "Step 2a",
        "name": "Iterative Vector Search",
        "next": [
          7
        ],
        "gridX": 0.5
      },
      {
        "id": "bm25",
        "stageIdx": 4,
        "gridY": 1.5,
        "next_ids": [
          "rrf"
        ],
        "badge": "Step 2b",
        "name": "Iterative BM25 Search",
        "next": [
          7
        ],
        "gridX": 0.5
      },
      {
        "id": "rrf",
        "stageIdx": 5,
        "gridY": 0.5,
        "next_ids": [
          "speculative"
        ],
        "badge": "Step 2c",
        "name": "Hybrid RRF",
        "what": "Merges the Vector and BM25 results using Reciprocal Rank Fusion.",
        "why": "Scores from Vector (Cosine Similarity: 0.0-1.0) and BM25 (Arbitrary floats) are incompatible. RRF relies purely on their rank positions.",
        "how": "Calculates `1 / (k + rank)` for both lists and sums them.",
        "code": "func reciprocalRankFusion(vectorRanks: [String], bm25Ranks: [String], k: Int = 60) -> [(String, Float)] {\n    var scores: [String: Float] = [:]\n    \n    for (rank, id) in vectorRanks.enumerated() {\n        scores[id, default: 0] += 1.0 / Float(k + rank)\n    }\n    for (rank, id) in bm25Ranks.enumerated() {\n        scores[id, default: 0] += 1.0 / Float(k + rank)\n    }\n    \n    return scores.sorted { $0.value > $1.value }\n}",
        "next": [
          8
        ],
        "gridX": 0.5
      },
      {
        "id": "speculative",
        "stageIdx": 6,
        "gridY": 0.5,
        "next_ids": [
          "rerank"
        ],
        "badge": "Step 3a",
        "name": "Speculative Check",
        "next": [
          9
        ],
        "gridX": 0.5
      },
      {
        "id": "rerank",
        "stageIdx": 7,
        "gridY": 0.5,
        "next_ids": [
          "parent"
        ],
        "badge": "Step 3b",
        "name": "TinyBERT Rerank",
        "what": "Uses a Cross-Encoder to rescore the top candidates by analyzing the query and chunk simultaneously.",
        "why": "Vector search (Bi-Encoder) is fast but misses deep contextual nuance. Cross-Encoders are slow but highly accurate.",
        "how": "Passes `[CLS] Query [SEP] Chunk [SEP]` to a TinyBERT Core ML model.",
        "code": "let crossEncoderInput = \"[CLS] \\(query) [SEP] \\(chunk.text) [SEP]\"\nlet features = tokenizer.encode(crossEncoderInput)\nlet prediction = try crossEncoderModel.prediction(input: features)\nlet relevanceScore = prediction.logits[0].floatValue",
        "next": [
          10
        ],
        "gridX": 0.5
      },
      {
        "id": "parent",
        "stageIdx": 8,
        "gridY": 0.5,
        "next_ids": [
          "lim"
        ],
        "badge": "Step 3c",
        "name": "Sibling Expansion",
        "what": "Fetches the surrounding text chunks for the highly-ranked candidate chunks.",
        "why": "A chunk might contain the answer 'Yes, he did', but without the preceding chunk, the LLM won't know who 'he' is.",
        "how": "Queries the database for `chunk_id - 1` and `chunk_id + 1`.",
        "code": "func expandContext(chunkIds: [Int]) -> [Chunk] {\n    var expanded: Set<Int> = []\n    for id in chunkIds {\n        expanded.insert(id - 1)\n        expanded.insert(id)\n        expanded.insert(id + 1)\n    }\n    return db.fetchChunks(ids: Array(expanded))\n}",
        "next": [
          11
        ],
        "gridX": 0.5
      },
      {
        "id": "lim",
        "stageIdx": 9,
        "gridY": 0.5,
        "next_ids": [
          "pack"
        ],
        "badge": "Step 3d",
        "name": "Lost-in-Middle",
        "what": "Reorders the assembled chunks so the most relevant evidence is at the beginning and end.",
        "why": "LLMs exhibit 'Lost in the Middle' syndrome\u2014they pay attention to the start and end of a prompt, but ignore the middle.",
        "how": "Sorts chunks by relevance, then alternates pushing to the front and back of a deque.",
        "code": "func lostInMiddleReorder(chunks: [Chunk]) -> [Chunk] {\n    let sorted = chunks.sorted { $0.relevance > $1.relevance }\n    var reordered = [Chunk]()\n    for (index, chunk) in sorted.enumerated() {\n        if index % 2 == 0 {\n            reordered.insert(chunk, at: 0)\n        } else {\n            reordered.append(chunk)\n        }\n    }\n    return reordered\n}",
        "next": [
          12
        ],
        "gridX": 0.5
      },
      {
        "id": "pack",
        "stageIdx": 10,
        "gridY": 0.5,
        "next_ids": [
          "gen_1"
        ],
        "badge": "Step 3e",
        "name": "Context Packing",
        "what": "Assembles the final context block while strictly adhering to the model's token limit.",
        "why": "If we exceed 4,096 tokens on-device, the Core ML / Foundation Model API will crash.",
        "how": "Iterates through the reordered chunks, counting tokens, and truncating when the budget is hit.",
        "code": "var contextString = \"\"\nvar tokenCount = 0\n\nfor chunk in reorderedChunks {\n    let count = tokenizer.count(chunk.text)\n    if tokenCount + count > 3800 { break } // Leave room for query/sys prompt\n    contextString += \"\\n---\\n\\(chunk.text)\"\n    tokenCount += count\n}",
        "next": [
          13
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_1",
        "stageIdx": 11,
        "gridY": 0.5,
        "next_ids": [
          "gen_2",
          "gen_3"
        ],
        "badge": "Step A",
        "name": "LoRA Injection (3B)",
        "what": "Dynamically loads a Low-Rank Adaptation (LoRA) adapter into the 3B Base Model.",
        "why": "The base model is generic. The LoRA tunes it specifically for RAG citation generation without needing a separate 3GB model file.",
        "how": "Uses Apple's MLModel API to map the adapter weights into the base matrix.",
        "code": "let config = MLModelConfiguration()\nlet adapterURL = URL(fileURLWithPath: \"rag_citation_adapter.mlmodelc\")\ntry config.addParameterWeights(adapterURL)\nlet model = try MLModel(contentsOf: baseModelURL, configuration: config)",
        "next": [
          14,
          15
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_2",
        "stageIdx": 12,
        "gridY": 0.5,
        "next_ids": [
          "gen_4"
        ],
        "badge": "Step B",
        "name": "Draft Generation",
        "what": "Uses a tiny 48M parameter model to rapidly draft candidate tokens.",
        "why": "Large models are slow at generating tokens one-by-one. Tiny models can guess the next 5 tokens almost instantly.",
        "how": "Speculative Decoding architecture.",
        "code": "let draftTokens = try await tinyModel.generate(count: 5)\n// Forward to base model for verification",
        "next": [
          16
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_3",
        "stageIdx": 12,
        "gridY": 1.5,
        "next_ids": [
          "gen_4"
        ],
        "badge": "Step C",
        "name": "Parallel Verification",
        "what": "The 3B Base Model evaluates the draft tokens in parallel.",
        "why": "Evaluating 5 tokens at once is significantly faster than generating them sequentially.",
        "how": "Calculates logits for the draft sequence. If the logits agree, the tokens are accepted.",
        "code": "let verificationLogits = try await baseModel.forward(draftTokens)\nlet accepted = verifySequence(draftTokens, against: verificationLogits)\nif !accepted { \n    // Fall back to sequential generation\n}",
        "next": [
          16
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_4",
        "stageIdx": 13,
        "gridY": 0.5,
        "next_ids": [
          "verify_1"
        ],
        "badge": "Step D",
        "name": "Guided Generation",
        "what": "Forces the model to output strict JSON or citation schemas.",
        "why": "LLMs often drift from the requested format. Guided generation blocks invalid tokens at the sampler level.",
        "how": "Uses a Finite State Machine (FSM) or Regex masking during token selection.",
        "code": "let regex = try NSRegularExpression(pattern: \"\\\\[\\\\d+\\\\]\")\nlet sampler = RegexConstrainedSampler(regex: regex)\nlet token = sampler.sample(logits: logits)",
        "next": [
          17
        ],
        "gridX": 0.5
      },
      {
        "id": "verify_1",
        "stageIdx": 15,
        "gridY": 0.5,
        "next_ids": [
          "verify_2"
        ],
        "badge": "Step 5a",
        "name": "Verification Gates A-I",
        "what": "Runs 9 parallel rule-based heuristics on the generated answer against the source context.",
        "why": "LLMs hallucinate. We must cryptographically or heuristically verify that claims made in the answer exist in the provided chunks.",
        "how": "Extracts nouns/numbers from the answer and verifies their presence in the source text.",
        "code": "func verifyGroundedness(answer: String, context: String) -> Bool {\n    let answerNumbers = extractNumbers(answer)\n    for num in answerNumbers {\n        guard context.contains(num) else {\n            print(\"Gate E (Numerical Fidelity) FAILED on: \\(num)\")\n            return false\n        }\n    }\n    return true\n}",
        "next": [
          18
        ],
        "gridX": 0.5
      },
      {
        "id": "verify_2",
        "stageIdx": 16,
        "gridY": 0.5,
        "next_ids": [
          "abstain",
          "pass"
        ],
        "badge": "Step 5b",
        "name": "Negation & Overlap",
        "what": "Checks if the model generated a negation ('not', 'never') that contradicts the source context.",
        "why": "Models often flip the polarity of sentences if they get confused by complex grammar.",
        "how": "Uses NLTagger and Dependency Parsing to compare negation modifiers.",
        "code": "let answerPolarity = analyzePolarity(answer)\nlet contextPolarity = analyzePolarity(context)\n\nif answerPolarity == .negative && contextPolarity == .positive {\n    // Flag potential hallucinated contradiction\n    return .abstain\n}",
        "next": [
          19,
          20
        ],
        "gridX": 0.5
      },
      {
        "id": "abstain",
        "stageIdx": 17,
        "gridY": 0.5,
        "next_ids": [],
        "badge": "Fail",
        "name": "Abstain",
        "what": "The engine intercepts the response and refuses to answer.",
        "why": "OpenIntelligence values accuracy over helpfulness. If the verification gates fail, it is better to say 'I don't know'.",
        "how": "Replaces the output with a pre-canned abstention message.",
        "code": "if verificationResult == .failed {\n    ui.render(text: \"I could not find a verified answer to your question in the selected documents.\")\n}",
        "next": [],
        "gridX": 0.5
      },
      {
        "id": "pass",
        "stageIdx": 17,
        "gridY": 1.5,
        "next_ids": [
          "output"
        ],
        "badge": "Pass",
        "name": "Synthesized Response",
        "what": "The final Deep Think response, often spanning multiple paragraphs.",
        "why": "Multi-hop reasoning requires detailed, synthesized explanations.",
        "how": "Streamed to the UI with multi-document citations.",
        "code": "ui.renderStream(deepThinkSession.stream)",
        "next": [
          21
        ],
        "gridX": 0.5
      },
      {
        "id": "output",
        "stageIdx": 18,
        "gridY": 0.5,
        "next_ids": [],
        "badge": "Output",
        "name": "Final Response",
        "what": "Renders the text to the screen with clickable citation markers.",
        "why": "Users need to trace the AI's claims back to the source PDFs.",
        "how": "Uses SwiftUI Text with AttributedString attributes.",
        "code": "var attributedString = AttributedString(answer)\nfor citation in citations {\n    if let range = attributedString.range(of: citation.marker) {\n        attributedString[range].link = URL(string: \"openintel://doc/\\(citation.docId)\")\n    }\n}",
        "next": [],
        "gridX": 0.5
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
      "Input",
      "Orchestrator",
      "Analysis",
      "Embed",
      "Search",
      "RRF",
      "Speculate",
      "Rerank",
      "Sibling",
      "LIM",
      "Pack",
      "Inference 1",
      "Inference 2",
      "Inference 3",
      "Inference 4",
      "Gates",
      "Verify",
      "Decision",
      "Output"
    ],
    "steps": [
      {
        "id": "input",
        "stageIdx": 0,
        "gridY": 0.5,
        "next_ids": [
          "orchestrator"
        ],
        "badge": "Input",
        "name": "User Query",
        "desc": "User submits query.",
        "what": "Captures the user's input from the ChatScreen UI.",
        "why": "The entry point for the entire retrieval pipeline.",
        "how": "Reads the bound SwiftUI text state.",
        "code": "struct ChatScreen: View {\n    @State private var query: String = \"\"\n    \n    var body: some View {\n        TextField(\"Ask anything...\", text: $query)\n            .onSubmit { engine.process(query) }\n    }\n}",
        "next": [
          1
        ],
        "gridX": 0.5
      },
      {
        "id": "orchestrator",
        "stageIdx": 1,
        "gridY": 0.5,
        "next_ids": [
          "rag_check",
          "multi_query"
        ],
        "badge": "Step 1",
        "name": "Agentic Orchestrator",
        "next": [
          2,
          3
        ],
        "gridX": 0.5
      },
      {
        "id": "rag_check",
        "stageIdx": 2,
        "gridY": 0.5,
        "next_ids": [
          "embed"
        ],
        "badge": "Step 1a",
        "name": "Self-RAG Check",
        "next": [
          4
        ],
        "gridX": 0.5
      },
      {
        "id": "multi_query",
        "stageIdx": 2,
        "gridY": 1.5,
        "next_ids": [
          "embed"
        ],
        "badge": "Step 1b",
        "name": "Multi-Query Expansion",
        "next": [
          4
        ],
        "gridX": 0.5
      },
      {
        "id": "embed",
        "stageIdx": 3,
        "gridY": 0.5,
        "next_ids": [
          "vector",
          "bm25"
        ],
        "badge": "Step 1c",
        "name": "Batch Embed & Extract",
        "next": [
          5,
          6
        ],
        "gridX": 0.5
      },
      {
        "id": "vector",
        "stageIdx": 4,
        "gridY": 0.5,
        "next_ids": [
          "rrf"
        ],
        "badge": "Step 2a",
        "name": "Iterative Vector Search",
        "next": [
          7
        ],
        "gridX": 0.5
      },
      {
        "id": "bm25",
        "stageIdx": 4,
        "gridY": 1.5,
        "next_ids": [
          "rrf"
        ],
        "badge": "Step 2b",
        "name": "Iterative BM25 Search",
        "next": [
          7
        ],
        "gridX": 0.5
      },
      {
        "id": "rrf",
        "stageIdx": 5,
        "gridY": 0.5,
        "next_ids": [
          "speculative"
        ],
        "badge": "Step 2c",
        "name": "Hybrid RRF",
        "what": "Merges the Vector and BM25 results using Reciprocal Rank Fusion.",
        "why": "Scores from Vector (Cosine Similarity: 0.0-1.0) and BM25 (Arbitrary floats) are incompatible. RRF relies purely on their rank positions.",
        "how": "Calculates `1 / (k + rank)` for both lists and sums them.",
        "code": "func reciprocalRankFusion(vectorRanks: [String], bm25Ranks: [String], k: Int = 60) -> [(String, Float)] {\n    var scores: [String: Float] = [:]\n    \n    for (rank, id) in vectorRanks.enumerated() {\n        scores[id, default: 0] += 1.0 / Float(k + rank)\n    }\n    for (rank, id) in bm25Ranks.enumerated() {\n        scores[id, default: 0] += 1.0 / Float(k + rank)\n    }\n    \n    return scores.sorted { $0.value > $1.value }\n}",
        "next": [
          8
        ],
        "gridX": 0.5
      },
      {
        "id": "speculative",
        "stageIdx": 6,
        "gridY": 0.5,
        "next_ids": [
          "rerank"
        ],
        "badge": "Step 3a",
        "name": "Speculative Check",
        "next": [
          9
        ],
        "gridX": 0.5
      },
      {
        "id": "rerank",
        "stageIdx": 7,
        "gridY": 0.5,
        "next_ids": [
          "parent"
        ],
        "badge": "Step 3b",
        "name": "TinyBERT Rerank",
        "what": "Uses a Cross-Encoder to rescore the top candidates by analyzing the query and chunk simultaneously.",
        "why": "Vector search (Bi-Encoder) is fast but misses deep contextual nuance. Cross-Encoders are slow but highly accurate.",
        "how": "Passes `[CLS] Query [SEP] Chunk [SEP]` to a TinyBERT Core ML model.",
        "code": "let crossEncoderInput = \"[CLS] \\(query) [SEP] \\(chunk.text) [SEP]\"\nlet features = tokenizer.encode(crossEncoderInput)\nlet prediction = try crossEncoderModel.prediction(input: features)\nlet relevanceScore = prediction.logits[0].floatValue",
        "next": [
          10
        ],
        "gridX": 0.5
      },
      {
        "id": "parent",
        "stageIdx": 8,
        "gridY": 0.5,
        "next_ids": [
          "lim"
        ],
        "badge": "Step 3c",
        "name": "Sibling Expansion",
        "what": "Fetches the surrounding text chunks for the highly-ranked candidate chunks.",
        "why": "A chunk might contain the answer 'Yes, he did', but without the preceding chunk, the LLM won't know who 'he' is.",
        "how": "Queries the database for `chunk_id - 1` and `chunk_id + 1`.",
        "code": "func expandContext(chunkIds: [Int]) -> [Chunk] {\n    var expanded: Set<Int> = []\n    for id in chunkIds {\n        expanded.insert(id - 1)\n        expanded.insert(id)\n        expanded.insert(id + 1)\n    }\n    return db.fetchChunks(ids: Array(expanded))\n}",
        "next": [
          11
        ],
        "gridX": 0.5
      },
      {
        "id": "lim",
        "stageIdx": 9,
        "gridY": 0.5,
        "next_ids": [
          "pack"
        ],
        "badge": "Step 3d",
        "name": "Lost-in-Middle",
        "what": "Reorders the assembled chunks so the most relevant evidence is at the beginning and end.",
        "why": "LLMs exhibit 'Lost in the Middle' syndrome\u2014they pay attention to the start and end of a prompt, but ignore the middle.",
        "how": "Sorts chunks by relevance, then alternates pushing to the front and back of a deque.",
        "code": "func lostInMiddleReorder(chunks: [Chunk]) -> [Chunk] {\n    let sorted = chunks.sorted { $0.relevance > $1.relevance }\n    var reordered = [Chunk]()\n    for (index, chunk) in sorted.enumerated() {\n        if index % 2 == 0 {\n            reordered.insert(chunk, at: 0)\n        } else {\n            reordered.append(chunk)\n        }\n    }\n    return reordered\n}",
        "next": [
          12
        ],
        "gridX": 0.5
      },
      {
        "id": "pack",
        "stageIdx": 10,
        "gridY": 0.5,
        "next_ids": [
          "gen_1"
        ],
        "badge": "Step 3e",
        "name": "Context Packing",
        "what": "Assembles the final context block while strictly adhering to the model's token limit.",
        "why": "If we exceed 4,096 tokens on-device, the Core ML / Foundation Model API will crash.",
        "how": "Iterates through the reordered chunks, counting tokens, and truncating when the budget is hit.",
        "code": "var contextString = \"\"\nvar tokenCount = 0\n\nfor chunk in reorderedChunks {\n    let count = tokenizer.count(chunk.text)\n    if tokenCount + count > 3800 { break } // Leave room for query/sys prompt\n    contextString += \"\\n---\\n\\(chunk.text)\"\n    tokenCount += count\n}",
        "next": [
          13
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_1",
        "stageIdx": 11,
        "gridY": 0.5,
        "next_ids": [
          "gen_2"
        ],
        "badge": "Step A",
        "name": "NAND Flash Paging",
        "what": "Streams the 20B model weights directly from the SSD (NVMe) rather than loading them entirely into unified memory (RAM).",
        "why": "A 20B model requires ~10GB of RAM. Paging allows it to run on base Model Macs without Out-of-Memory (OOM) crashes.",
        "how": "Uses Apple's unified memory architecture and mmap() to page active experts.",
        "code": "let weightBuffer = try MLMultiArray(shape: [shape], dataType: .float16)\n// Weights are mapped, not explicitly loaded\nweightBuffer.withUnsafeMutableBytes { ptr in\n    mmap(ptr.baseAddress, ptr.count, PROT_READ, MAP_SHARED, fd, 0)\n}",
        "next": [
          14
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_2",
        "stageIdx": 12,
        "gridY": 0.5,
        "next_ids": [
          "gen_3",
          "gen_4"
        ],
        "badge": "Step B",
        "name": "MoE Expert Router",
        "what": "Selects which sub-networks (experts) inside the 20B model should process the current token.",
        "why": "Allows a 20B parameter model to execute with the speed and battery drain of a 2.8B model.",
        "how": "A gating linear layer outputs probabilities, routing to the top 2 experts.",
        "code": "let gatingLogits = gatingLayer.forward(hiddenState)\nlet top2Experts = gatingLogits.topK(2)\n\nvar output = zeros()\nfor expert in top2Experts {\n    let expertOut = experts[expert.index].forward(hiddenState)\n    output += expertOut * expert.weight\n}",
        "next": [
          15,
          16
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_3",
        "stageIdx": 13,
        "gridY": 0.5,
        "next_ids": [
          "gen_5"
        ],
        "badge": "Step C",
        "name": "Draft Generation",
        "what": "Uses a tiny 48M parameter model to rapidly draft candidate tokens.",
        "why": "Large models are slow at generating tokens one-by-one. Tiny models can guess the next 5 tokens almost instantly.",
        "how": "Speculative Decoding architecture.",
        "code": "let draftTokens = try await tinyModel.generate(count: 5)\n// Forward to base model for verification",
        "next": [
          17
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_4",
        "stageIdx": 13,
        "gridY": 1.5,
        "next_ids": [
          "gen_5"
        ],
        "badge": "Step D",
        "name": "MoE Verification",
        "what": "The 20B MoE model verifies the draft sequence.",
        "why": "Combines Speculative Decoding speed with MoE scalability.",
        "how": "Parallel forward pass through the routed experts.",
        "code": "let verificationLogits = try await moeModel.forward(draftTokens)",
        "next": [
          17
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_5",
        "stageIdx": 14,
        "gridY": 0.5,
        "next_ids": [
          "verify_1"
        ],
        "badge": "Step E",
        "name": "Guided Generation",
        "what": "Forces the model to output strict JSON or citation schemas.",
        "why": "LLMs often drift from the requested format. Guided generation blocks invalid tokens at the sampler level.",
        "how": "Uses a Finite State Machine (FSM) or Regex masking during token selection.",
        "code": "let regex = try NSRegularExpression(pattern: \"\\\\[\\\\d+\\\\]\")\nlet sampler = RegexConstrainedSampler(regex: regex)\nlet token = sampler.sample(logits: logits)",
        "next": [
          18
        ],
        "gridX": 0.5
      },
      {
        "id": "verify_1",
        "stageIdx": 15,
        "gridY": 0.5,
        "next_ids": [
          "verify_2"
        ],
        "badge": "Step 5a",
        "name": "Verification Gates A-I",
        "what": "Runs 9 parallel rule-based heuristics on the generated answer against the source context.",
        "why": "LLMs hallucinate. We must cryptographically or heuristically verify that claims made in the answer exist in the provided chunks.",
        "how": "Extracts nouns/numbers from the answer and verifies their presence in the source text.",
        "code": "func verifyGroundedness(answer: String, context: String) -> Bool {\n    let answerNumbers = extractNumbers(answer)\n    for num in answerNumbers {\n        guard context.contains(num) else {\n            print(\"Gate E (Numerical Fidelity) FAILED on: \\(num)\")\n            return false\n        }\n    }\n    return true\n}",
        "next": [
          19
        ],
        "gridX": 0.5
      },
      {
        "id": "verify_2",
        "stageIdx": 16,
        "gridY": 0.5,
        "next_ids": [
          "abstain",
          "pass"
        ],
        "badge": "Step 5b",
        "name": "Negation & Overlap",
        "what": "Checks if the model generated a negation ('not', 'never') that contradicts the source context.",
        "why": "Models often flip the polarity of sentences if they get confused by complex grammar.",
        "how": "Uses NLTagger and Dependency Parsing to compare negation modifiers.",
        "code": "let answerPolarity = analyzePolarity(answer)\nlet contextPolarity = analyzePolarity(context)\n\nif answerPolarity == .negative && contextPolarity == .positive {\n    // Flag potential hallucinated contradiction\n    return .abstain\n}",
        "next": [
          20,
          21
        ],
        "gridX": 0.5
      },
      {
        "id": "abstain",
        "stageIdx": 17,
        "gridY": 0.5,
        "next_ids": [],
        "badge": "Fail",
        "name": "Abstain",
        "what": "The engine intercepts the response and refuses to answer.",
        "why": "OpenIntelligence values accuracy over helpfulness. If the verification gates fail, it is better to say 'I don't know'.",
        "how": "Replaces the output with a pre-canned abstention message.",
        "code": "if verificationResult == .failed {\n    ui.render(text: \"I could not find a verified answer to your question in the selected documents.\")\n}",
        "next": [],
        "gridX": 0.5
      },
      {
        "id": "pass",
        "stageIdx": 17,
        "gridY": 1.5,
        "next_ids": [
          "output"
        ],
        "badge": "Pass",
        "name": "Synthesized Response",
        "what": "The final Deep Think response, often spanning multiple paragraphs.",
        "why": "Multi-hop reasoning requires detailed, synthesized explanations.",
        "how": "Streamed to the UI with multi-document citations.",
        "code": "ui.renderStream(deepThinkSession.stream)",
        "next": [
          22
        ],
        "gridX": 0.5
      },
      {
        "id": "output",
        "stageIdx": 18,
        "gridY": 0.5,
        "next_ids": [],
        "badge": "Output",
        "name": "Final Response",
        "what": "Renders the text to the screen with clickable citation markers.",
        "why": "Users need to trace the AI's claims back to the source PDFs.",
        "how": "Uses SwiftUI Text with AttributedString attributes.",
        "code": "var attributedString = AttributedString(answer)\nfor citation in citations {\n    if let range = attributedString.range(of: citation.marker) {\n        attributedString[range].link = URL(string: \"openintel://doc/\\(citation.docId)\")\n    }\n}",
        "next": [],
        "gridX": 0.5
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
      "Input",
      "Orchestrator",
      "Analysis",
      "Embed",
      "Search",
      "RRF",
      "Speculate",
      "Rerank",
      "Sibling",
      "LIM",
      "Pack",
      "Inference 1",
      "Inference 2",
      "Inference 3",
      "Inference 4",
      "Gates",
      "Verify",
      "Decision",
      "Output"
    ],
    "steps": [
      {
        "id": "input",
        "stageIdx": 0,
        "gridY": 0.5,
        "next_ids": [
          "orchestrator"
        ],
        "badge": "Input",
        "name": "User Query",
        "desc": "User submits query.",
        "what": "Captures the user's input from the ChatScreen UI.",
        "why": "The entry point for the entire retrieval pipeline.",
        "how": "Reads the bound SwiftUI text state.",
        "code": "struct ChatScreen: View {\n    @State private var query: String = \"\"\n    \n    var body: some View {\n        TextField(\"Ask anything...\", text: $query)\n            .onSubmit { engine.process(query) }\n    }\n}",
        "next": [
          1
        ],
        "gridX": 0.5
      },
      {
        "id": "orchestrator",
        "stageIdx": 1,
        "gridY": 0.5,
        "next_ids": [
          "rag_check",
          "multi_query"
        ],
        "badge": "Step 1",
        "name": "Agentic Orchestrator",
        "next": [
          2,
          3
        ],
        "gridX": 0.5
      },
      {
        "id": "rag_check",
        "stageIdx": 2,
        "gridY": 0.5,
        "next_ids": [
          "embed"
        ],
        "badge": "Step 1a",
        "name": "Self-RAG Check",
        "next": [
          4
        ],
        "gridX": 0.5
      },
      {
        "id": "multi_query",
        "stageIdx": 2,
        "gridY": 1.5,
        "next_ids": [
          "embed"
        ],
        "badge": "Step 1b",
        "name": "Multi-Query Expansion",
        "next": [
          4
        ],
        "gridX": 0.5
      },
      {
        "id": "embed",
        "stageIdx": 3,
        "gridY": 0.5,
        "next_ids": [
          "vector",
          "bm25"
        ],
        "badge": "Step 1c",
        "name": "Batch Embed & Extract",
        "next": [
          5,
          6
        ],
        "gridX": 0.5
      },
      {
        "id": "vector",
        "stageIdx": 4,
        "gridY": 0.5,
        "next_ids": [
          "rrf"
        ],
        "badge": "Step 2a",
        "name": "Iterative Vector Search",
        "next": [
          7
        ],
        "gridX": 0.5
      },
      {
        "id": "bm25",
        "stageIdx": 4,
        "gridY": 1.5,
        "next_ids": [
          "rrf"
        ],
        "badge": "Step 2b",
        "name": "Iterative BM25 Search",
        "next": [
          7
        ],
        "gridX": 0.5
      },
      {
        "id": "rrf",
        "stageIdx": 5,
        "gridY": 0.5,
        "next_ids": [
          "speculative"
        ],
        "badge": "Step 2c",
        "name": "Hybrid RRF",
        "what": "Merges the Vector and BM25 results using Reciprocal Rank Fusion.",
        "why": "Scores from Vector (Cosine Similarity: 0.0-1.0) and BM25 (Arbitrary floats) are incompatible. RRF relies purely on their rank positions.",
        "how": "Calculates `1 / (k + rank)` for both lists and sums them.",
        "code": "func reciprocalRankFusion(vectorRanks: [String], bm25Ranks: [String], k: Int = 60) -> [(String, Float)] {\n    var scores: [String: Float] = [:]\n    \n    for (rank, id) in vectorRanks.enumerated() {\n        scores[id, default: 0] += 1.0 / Float(k + rank)\n    }\n    for (rank, id) in bm25Ranks.enumerated() {\n        scores[id, default: 0] += 1.0 / Float(k + rank)\n    }\n    \n    return scores.sorted { $0.value > $1.value }\n}",
        "next": [
          8
        ],
        "gridX": 0.5
      },
      {
        "id": "speculative",
        "stageIdx": 6,
        "gridY": 0.5,
        "next_ids": [
          "rerank"
        ],
        "badge": "Step 3a",
        "name": "Speculative Check",
        "next": [
          9
        ],
        "gridX": 0.5
      },
      {
        "id": "rerank",
        "stageIdx": 7,
        "gridY": 0.5,
        "next_ids": [
          "parent"
        ],
        "badge": "Step 3b",
        "name": "TinyBERT Rerank",
        "what": "Uses a Cross-Encoder to rescore the top candidates by analyzing the query and chunk simultaneously.",
        "why": "Vector search (Bi-Encoder) is fast but misses deep contextual nuance. Cross-Encoders are slow but highly accurate.",
        "how": "Passes `[CLS] Query [SEP] Chunk [SEP]` to a TinyBERT Core ML model.",
        "code": "let crossEncoderInput = \"[CLS] \\(query) [SEP] \\(chunk.text) [SEP]\"\nlet features = tokenizer.encode(crossEncoderInput)\nlet prediction = try crossEncoderModel.prediction(input: features)\nlet relevanceScore = prediction.logits[0].floatValue",
        "next": [
          10
        ],
        "gridX": 0.5
      },
      {
        "id": "parent",
        "stageIdx": 8,
        "gridY": 0.5,
        "next_ids": [
          "lim"
        ],
        "badge": "Step 3c",
        "name": "Sibling Expansion",
        "what": "Fetches the surrounding text chunks for the highly-ranked candidate chunks.",
        "why": "A chunk might contain the answer 'Yes, he did', but without the preceding chunk, the LLM won't know who 'he' is.",
        "how": "Queries the database for `chunk_id - 1` and `chunk_id + 1`.",
        "code": "func expandContext(chunkIds: [Int]) -> [Chunk] {\n    var expanded: Set<Int> = []\n    for id in chunkIds {\n        expanded.insert(id - 1)\n        expanded.insert(id)\n        expanded.insert(id + 1)\n    }\n    return db.fetchChunks(ids: Array(expanded))\n}",
        "next": [
          11
        ],
        "gridX": 0.5
      },
      {
        "id": "lim",
        "stageIdx": 9,
        "gridY": 0.5,
        "next_ids": [
          "pack"
        ],
        "badge": "Step 3d",
        "name": "Lost-in-Middle",
        "what": "Reorders the assembled chunks so the most relevant evidence is at the beginning and end.",
        "why": "LLMs exhibit 'Lost in the Middle' syndrome\u2014they pay attention to the start and end of a prompt, but ignore the middle.",
        "how": "Sorts chunks by relevance, then alternates pushing to the front and back of a deque.",
        "code": "func lostInMiddleReorder(chunks: [Chunk]) -> [Chunk] {\n    let sorted = chunks.sorted { $0.relevance > $1.relevance }\n    var reordered = [Chunk]()\n    for (index, chunk) in sorted.enumerated() {\n        if index % 2 == 0 {\n            reordered.insert(chunk, at: 0)\n        } else {\n            reordered.append(chunk)\n        }\n    }\n    return reordered\n}",
        "next": [
          12
        ],
        "gridX": 0.5
      },
      {
        "id": "pack",
        "stageIdx": 10,
        "gridY": 0.5,
        "next_ids": [
          "gen_1"
        ],
        "badge": "Step 3e",
        "name": "Context Packing",
        "what": "Assembles the final context block while strictly adhering to the model's token limit.",
        "why": "If we exceed 4,096 tokens on-device, the Core ML / Foundation Model API will crash.",
        "how": "Iterates through the reordered chunks, counting tokens, and truncating when the budget is hit.",
        "code": "var contextString = \"\"\nvar tokenCount = 0\n\nfor chunk in reorderedChunks {\n    let count = tokenizer.count(chunk.text)\n    if tokenCount + count > 3800 { break } // Leave room for query/sys prompt\n    contextString += \"\\n---\\n\\(chunk.text)\"\n    tokenCount += count\n}",
        "next": [
          13
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_1",
        "stageIdx": 11,
        "gridY": 0.5,
        "next_ids": [
          "gen_2"
        ],
        "badge": "Step A",
        "name": "PCC Escalate",
        "what": "Detects that the query requires 32K context and routes away from the local device.",
        "why": "On-device memory cannot physically support a 32,000 token context window.",
        "how": "Checks token count and initiates the Private Cloud Compute handshake.",
        "code": "if contextTokenCount > 4096 {\n    let session = PrivateCloudComputeSession()\n    try await session.authenticate()\n}",
        "next": [
          14
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_2",
        "stageIdx": 12,
        "gridY": 0.5,
        "next_ids": [
          "gen_3"
        ],
        "badge": "Step B",
        "name": "Secure Payload Transfer",
        "what": "Encrypts the 32K context window and transmits it to the PCC node.",
        "why": "Ensures Apple cannot read the user's private documents during cloud inference.",
        "how": "Uses target diffusion and end-to-end encryption tied to the user's iCloud key.",
        "code": "let encryptedPayload = try Crypto.encrypt(payload: context, using: pccPublicKey)\nlet request = URLRequest(url: pccEndpoint)\nrequest.httpBody = encryptedPayload\nlet response = try await URLSession.shared.data(for: request)",
        "next": [
          15
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_3",
        "stageIdx": 13,
        "gridY": 0.5,
        "next_ids": [
          "verify_1"
        ],
        "badge": "Step C",
        "name": "Cloud GPU Execution",
        "what": "The server-side MoE (70B+) executes the inference on Apple Silicon server nodes.",
        "why": "Massive compute allows for deep reasoning across 32,000 tokens.",
        "how": "Returns an encrypted stream of tokens.",
        "code": "// (Server-Side Execution)\n// The payload is decrypted in the secure enclave, processed, and streamed back.",
        "next": [
          16
        ],
        "gridX": 0.5
      },
      {
        "id": "verify_1",
        "stageIdx": 15,
        "gridY": 0.5,
        "next_ids": [
          "verify_2"
        ],
        "badge": "Step 5a",
        "name": "Verification Gates A-I",
        "what": "Runs 9 parallel rule-based heuristics on the generated answer against the source context.",
        "why": "LLMs hallucinate. We must cryptographically or heuristically verify that claims made in the answer exist in the provided chunks.",
        "how": "Extracts nouns/numbers from the answer and verifies their presence in the source text.",
        "code": "func verifyGroundedness(answer: String, context: String) -> Bool {\n    let answerNumbers = extractNumbers(answer)\n    for num in answerNumbers {\n        guard context.contains(num) else {\n            print(\"Gate E (Numerical Fidelity) FAILED on: \\(num)\")\n            return false\n        }\n    }\n    return true\n}",
        "next": [
          17
        ],
        "gridX": 0.5
      },
      {
        "id": "verify_2",
        "stageIdx": 16,
        "gridY": 0.5,
        "next_ids": [
          "abstain",
          "pass"
        ],
        "badge": "Step 5b",
        "name": "Negation & Overlap",
        "what": "Checks if the model generated a negation ('not', 'never') that contradicts the source context.",
        "why": "Models often flip the polarity of sentences if they get confused by complex grammar.",
        "how": "Uses NLTagger and Dependency Parsing to compare negation modifiers.",
        "code": "let answerPolarity = analyzePolarity(answer)\nlet contextPolarity = analyzePolarity(context)\n\nif answerPolarity == .negative && contextPolarity == .positive {\n    // Flag potential hallucinated contradiction\n    return .abstain\n}",
        "next": [
          18,
          19
        ],
        "gridX": 0.5
      },
      {
        "id": "abstain",
        "stageIdx": 17,
        "gridY": 0.5,
        "next_ids": [],
        "badge": "Fail",
        "name": "Abstain",
        "what": "The engine intercepts the response and refuses to answer.",
        "why": "OpenIntelligence values accuracy over helpfulness. If the verification gates fail, it is better to say 'I don't know'.",
        "how": "Replaces the output with a pre-canned abstention message.",
        "code": "if verificationResult == .failed {\n    ui.render(text: \"I could not find a verified answer to your question in the selected documents.\")\n}",
        "next": [],
        "gridX": 0.5
      },
      {
        "id": "pass",
        "stageIdx": 17,
        "gridY": 1.5,
        "next_ids": [
          "output"
        ],
        "badge": "Pass",
        "name": "Synthesized Response",
        "what": "The final Deep Think response, often spanning multiple paragraphs.",
        "why": "Multi-hop reasoning requires detailed, synthesized explanations.",
        "how": "Streamed to the UI with multi-document citations.",
        "code": "ui.renderStream(deepThinkSession.stream)",
        "next": [
          20
        ],
        "gridX": 0.5
      },
      {
        "id": "output",
        "stageIdx": 18,
        "gridY": 0.5,
        "next_ids": [],
        "badge": "Output",
        "name": "Final Response",
        "what": "Renders the text to the screen with clickable citation markers.",
        "why": "Users need to trace the AI's claims back to the source PDFs.",
        "how": "Uses SwiftUI Text with AttributedString attributes.",
        "code": "var attributedString = AttributedString(answer)\nfor citation in citations {\n    if let range = attributedString.range(of: citation.marker) {\n        attributedString[range].link = URL(string: \"openintel://doc/\\(citation.docId)\")\n    }\n}",
        "next": [],
        "gridX": 0.5
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
      "Input",
      "Orchestrator",
      "Expansion",
      "Embed",
      "Mass Sweep",
      "RRF",
      "Eval Loop",
      "Rerank",
      "FlashRank",
      "Sibling",
      "Pack",
      "Inference 1",
      "Inference 2",
      "Inference 3",
      "Inference 4",
      "Fact-Check",
      "Logic",
      "Citations",
      "Output"
    ],
    "steps": [
      {
        "id": "input",
        "stageIdx": 0,
        "gridY": 0.5,
        "next_ids": [
          "orchestrator"
        ],
        "badge": "Input",
        "name": "User Query",
        "desc": "User submits query.",
        "what": "Captures the user's input from the ChatScreen UI.",
        "why": "The entry point for the entire retrieval pipeline.",
        "how": "Reads the bound SwiftUI text state.",
        "code": "struct ChatScreen: View {\n    @State private var query: String = \"\"\n    \n    var body: some View {\n        TextField(\"Ask anything...\", text: $query)\n            .onSubmit { engine.process(query) }\n    }\n}",
        "next": [
          1
        ],
        "gridX": 0.5
      },
      {
        "id": "orchestrator",
        "stageIdx": 1,
        "gridY": 0.5,
        "next_ids": [
          "rag_check",
          "expand"
        ],
        "badge": "Step 1a",
        "name": "Unlimited Orchestrator",
        "next": [
          2,
          3
        ],
        "gridX": 0.5
      },
      {
        "id": "rag_check",
        "stageIdx": 2,
        "gridY": 0.5,
        "next_ids": [
          "embed"
        ],
        "badge": "Step 1b",
        "name": "Self-RAG Check",
        "next": [
          4
        ],
        "gridX": 0.5
      },
      {
        "id": "expand",
        "stageIdx": 2,
        "gridY": 1.5,
        "next_ids": [
          "embed"
        ],
        "badge": "Step 1c",
        "name": "Semantic Expansion",
        "what": "Expands sub-queries using a local dictionary of synonyms.",
        "why": "Catches edge cases where documents use different terminology than the user.",
        "how": "Appends 2-3 semantic equivalents to the BM25 search string.",
        "code": "let expanded = semanticDictionary.expand(query.keywords)\nquery.keywords.append(contentsOf: expanded)",
        "next": [
          4
        ],
        "gridX": 0.5
      },
      {
        "id": "embed",
        "stageIdx": 3,
        "gridY": 0.5,
        "next_ids": [
          "vector",
          "bm25",
          "graph"
        ],
        "badge": "Step 1d",
        "name": "Batch Embed & Extract",
        "next": [
          5,
          6,
          7
        ],
        "gridX": 0.5
      },
      {
        "id": "vector",
        "stageIdx": 4,
        "gridY": 0.5,
        "next_ids": [
          "rrf"
        ],
        "badge": "Step 2a",
        "name": "Vector Sweep",
        "next": [
          8
        ],
        "gridX": 0.5
      },
      {
        "id": "bm25",
        "stageIdx": 4,
        "gridY": 1.5,
        "next_ids": [
          "rrf"
        ],
        "badge": "Step 2b",
        "name": "BM25 Sweep",
        "next": [
          8
        ],
        "gridX": 0.5
      },
      {
        "id": "graph",
        "stageIdx": 4,
        "gridY": 2.5,
        "next_ids": [
          "rrf"
        ],
        "badge": "Step 2c",
        "name": "GraphRAG Traversal",
        "next": [
          8
        ],
        "gridX": 0.5
      },
      {
        "id": "rrf",
        "stageIdx": 5,
        "gridY": 0.5,
        "next_ids": [
          "eval"
        ],
        "badge": "Step 2d",
        "name": "Hybrid RRF",
        "what": "Merges the Vector and BM25 results using Reciprocal Rank Fusion.",
        "why": "Scores from Vector (Cosine Similarity: 0.0-1.0) and BM25 (Arbitrary floats) are incompatible. RRF relies purely on their rank positions.",
        "how": "Calculates `1 / (k + rank)` for both lists and sums them.",
        "code": "func reciprocalRankFusion(vectorRanks: [String], bm25Ranks: [String], k: Int = 60) -> [(String, Float)] {\n    var scores: [String: Float] = [:]\n    \n    for (rank, id) in vectorRanks.enumerated() {\n        scores[id, default: 0] += 1.0 / Float(k + rank)\n    }\n    for (rank, id) in bm25Ranks.enumerated() {\n        scores[id, default: 0] += 1.0 / Float(k + rank)\n    }\n    \n    return scores.sorted { $0.value > $1.value }\n}",
        "next": [
          9
        ],
        "gridX": 0.5
      },
      {
        "id": "eval",
        "stageIdx": 6,
        "gridY": 0.5,
        "next_ids": [
          "rerank"
        ],
        "badge": "Step 3a",
        "name": "Confidence Eval Loop",
        "next": [
          10
        ],
        "gridX": 0.5
      },
      {
        "id": "rerank",
        "stageIdx": 7,
        "gridY": 0.5,
        "next_ids": [
          "flashrank"
        ],
        "badge": "Step 3b",
        "name": "Cross-Encoder Rerank",
        "what": "Deeply scores retrieved chunks against the exact query.",
        "why": "Vectors only measure semantic distance. Cross-encoders measure logical relevance.",
        "how": "Passes (Query + Chunk) into a TinyBERT classification head.",
        "code": "let score = try await crossEncoder.predict([query, chunk])\nchunk.relevance = score",
        "next": [
          11
        ],
        "gridX": 0.5
      },
      {
        "id": "flashrank",
        "stageIdx": 8,
        "gridY": 0.5,
        "next_ids": [
          "sibling"
        ],
        "badge": "Step 3c",
        "name": "FlashRank",
        "what": "A secondary, ultra-fast reranking pass.",
        "why": "Used to break ties among the top 50 highly-relevant chunks.",
        "how": "Uses a quantized ranking model.",
        "code": "let finalRank = try await flashRank.rerank(top50)",
        "next": [
          12
        ],
        "gridX": 0.5
      },
      {
        "id": "sibling",
        "stageIdx": 9,
        "gridY": 0.5,
        "next_ids": [
          "pack"
        ],
        "badge": "Step 3d",
        "name": "Massive Sibling Expansion",
        "next": [
          13
        ],
        "gridX": 0.5
      },
      {
        "id": "pack",
        "stageIdx": 10,
        "gridY": 0.5,
        "next_ids": [
          "gen_1"
        ],
        "badge": "Step 3e",
        "name": "32K Context Packing",
        "next": [
          14
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_1",
        "stageIdx": 11,
        "gridY": 0.5,
        "next_ids": [
          "gen_2",
          "gen_3"
        ],
        "badge": "Step A",
        "name": "LoRA Injection (3B)",
        "what": "Dynamically loads a Low-Rank Adaptation (LoRA) adapter into the 3B Base Model.",
        "why": "The base model is generic. The LoRA tunes it specifically for RAG citation generation without needing a separate 3GB model file.",
        "how": "Uses Apple's MLModel API to map the adapter weights into the base matrix.",
        "code": "let config = MLModelConfiguration()\nlet adapterURL = URL(fileURLWithPath: \"rag_citation_adapter.mlmodelc\")\ntry config.addParameterWeights(adapterURL)\nlet model = try MLModel(contentsOf: baseModelURL, configuration: config)",
        "next": [
          15,
          16
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_2",
        "stageIdx": 12,
        "gridY": 0.5,
        "next_ids": [
          "gen_4"
        ],
        "badge": "Step B",
        "name": "Draft Generation",
        "what": "Uses a tiny 48M parameter model to rapidly draft candidate tokens.",
        "why": "Large models are slow at generating tokens one-by-one. Tiny models can guess the next 5 tokens almost instantly.",
        "how": "Speculative Decoding architecture.",
        "code": "let draftTokens = try await tinyModel.generate(count: 5)\n// Forward to base model for verification",
        "next": [
          17
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_3",
        "stageIdx": 12,
        "gridY": 1.5,
        "next_ids": [
          "gen_4"
        ],
        "badge": "Step C",
        "name": "Parallel Verification",
        "what": "The 3B Base Model evaluates the draft tokens in parallel.",
        "why": "Evaluating 5 tokens at once is significantly faster than generating them sequentially.",
        "how": "Calculates logits for the draft sequence. If the logits agree, the tokens are accepted.",
        "code": "let verificationLogits = try await baseModel.forward(draftTokens)\nlet accepted = verifySequence(draftTokens, against: verificationLogits)\nif !accepted { \n    // Fall back to sequential generation\n}",
        "next": [
          17
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_4",
        "stageIdx": 13,
        "gridY": 0.5,
        "next_ids": [
          "verify_1"
        ],
        "badge": "Step D",
        "name": "Guided Generation",
        "what": "Forces the model to output strict JSON or citation schemas.",
        "why": "LLMs often drift from the requested format. Guided generation blocks invalid tokens at the sampler level.",
        "how": "Uses a Finite State Machine (FSM) or Regex masking during token selection.",
        "code": "let regex = try NSRegularExpression(pattern: \"\\\\[\\\\d+\\\\]\")\nlet sampler = RegexConstrainedSampler(regex: regex)\nlet token = sampler.sample(logits: logits)",
        "next": [
          18
        ],
        "gridX": 0.5
      },
      {
        "id": "verify_1",
        "stageIdx": 15,
        "gridY": 0.5,
        "next_ids": [
          "verify_2"
        ],
        "badge": "Step 5a",
        "name": "Fact-Check Sweep",
        "what": "Multi-agent fact checking against retrieved context.",
        "why": "Ensures the generated answer doesn't invent numbers or dates.",
        "how": "Uses a secondary prompt pass: 'Does this text align with this context?'",
        "code": "let result = verificationAgent.check(claims, against: context)",
        "next": [
          19
        ],
        "gridX": 0.5
      },
      {
        "id": "verify_2",
        "stageIdx": 16,
        "gridY": 0.5,
        "next_ids": [
          "verify_3"
        ],
        "badge": "Step 5b",
        "name": "Contradiction Sweep",
        "what": "Checks if the answer contradicts itself.",
        "why": "Complex multi-hop reasoning can sometimes lead to conflicting statements.",
        "how": "Analyzes the polarity of statements in the answer.",
        "code": "let isConsistent = logicEngine.verifyConsistency(answer)",
        "next": [
          20
        ],
        "gridX": 0.5
      },
      {
        "id": "verify_3",
        "stageIdx": 17,
        "gridY": 0.5,
        "next_ids": [
          "output"
        ],
        "badge": "Step 5c",
        "name": "Hallucination Pass",
        "what": "Final check for ungrounded information.",
        "why": "Catches any external knowledge the LLM hallucinated.",
        "how": "Ensures every claim has a valid citation marker.",
        "code": "if claim.hasNoCitation() {\n    hallucinationDetected = true\n}",
        "next": [
          21
        ],
        "gridX": 0.5
      },
      {
        "id": "output",
        "stageIdx": 18,
        "gridY": 0.5,
        "next_ids": [],
        "badge": "Output",
        "name": "Verified Response",
        "what": "Outputs the final Maximum mode answer.",
        "why": "Maximum recall, maximum context, maximum verification.",
        "how": "Render to UI.",
        "code": "ui.render(text: answer)",
        "next": [],
        "gridX": 0.5
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
      "Input",
      "Orchestrator",
      "Expansion",
      "Embed",
      "Mass Sweep",
      "RRF",
      "Eval Loop",
      "Rerank",
      "FlashRank",
      "Sibling",
      "Pack",
      "Inference 1",
      "Inference 2",
      "Inference 3",
      "Inference 4",
      "Fact-Check",
      "Logic",
      "Citations",
      "Output"
    ],
    "steps": [
      {
        "id": "input",
        "stageIdx": 0,
        "gridY": 0.5,
        "next_ids": [
          "orchestrator"
        ],
        "badge": "Input",
        "name": "User Query",
        "desc": "User submits query.",
        "what": "Captures the user's input from the ChatScreen UI.",
        "why": "The entry point for the entire retrieval pipeline.",
        "how": "Reads the bound SwiftUI text state.",
        "code": "struct ChatScreen: View {\n    @State private var query: String = \"\"\n    \n    var body: some View {\n        TextField(\"Ask anything...\", text: $query)\n            .onSubmit { engine.process(query) }\n    }\n}",
        "next": [
          1
        ],
        "gridX": 0.5
      },
      {
        "id": "orchestrator",
        "stageIdx": 1,
        "gridY": 0.5,
        "next_ids": [
          "rag_check",
          "expand"
        ],
        "badge": "Step 1a",
        "name": "Unlimited Orchestrator",
        "next": [
          2,
          3
        ],
        "gridX": 0.5
      },
      {
        "id": "rag_check",
        "stageIdx": 2,
        "gridY": 0.5,
        "next_ids": [
          "embed"
        ],
        "badge": "Step 1b",
        "name": "Self-RAG Check",
        "next": [
          4
        ],
        "gridX": 0.5
      },
      {
        "id": "expand",
        "stageIdx": 2,
        "gridY": 1.5,
        "next_ids": [
          "embed"
        ],
        "badge": "Step 1c",
        "name": "Semantic Expansion",
        "what": "Expands sub-queries using a local dictionary of synonyms.",
        "why": "Catches edge cases where documents use different terminology than the user.",
        "how": "Appends 2-3 semantic equivalents to the BM25 search string.",
        "code": "let expanded = semanticDictionary.expand(query.keywords)\nquery.keywords.append(contentsOf: expanded)",
        "next": [
          4
        ],
        "gridX": 0.5
      },
      {
        "id": "embed",
        "stageIdx": 3,
        "gridY": 0.5,
        "next_ids": [
          "vector",
          "bm25",
          "graph"
        ],
        "badge": "Step 1d",
        "name": "Batch Embed & Extract",
        "next": [
          5,
          6,
          7
        ],
        "gridX": 0.5
      },
      {
        "id": "vector",
        "stageIdx": 4,
        "gridY": 0.5,
        "next_ids": [
          "rrf"
        ],
        "badge": "Step 2a",
        "name": "Vector Sweep",
        "next": [
          8
        ],
        "gridX": 0.5
      },
      {
        "id": "bm25",
        "stageIdx": 4,
        "gridY": 1.5,
        "next_ids": [
          "rrf"
        ],
        "badge": "Step 2b",
        "name": "BM25 Sweep",
        "next": [
          8
        ],
        "gridX": 0.5
      },
      {
        "id": "graph",
        "stageIdx": 4,
        "gridY": 2.5,
        "next_ids": [
          "rrf"
        ],
        "badge": "Step 2c",
        "name": "GraphRAG Traversal",
        "next": [
          8
        ],
        "gridX": 0.5
      },
      {
        "id": "rrf",
        "stageIdx": 5,
        "gridY": 0.5,
        "next_ids": [
          "eval"
        ],
        "badge": "Step 2d",
        "name": "Hybrid RRF",
        "what": "Merges the Vector and BM25 results using Reciprocal Rank Fusion.",
        "why": "Scores from Vector (Cosine Similarity: 0.0-1.0) and BM25 (Arbitrary floats) are incompatible. RRF relies purely on their rank positions.",
        "how": "Calculates `1 / (k + rank)` for both lists and sums them.",
        "code": "func reciprocalRankFusion(vectorRanks: [String], bm25Ranks: [String], k: Int = 60) -> [(String, Float)] {\n    var scores: [String: Float] = [:]\n    \n    for (rank, id) in vectorRanks.enumerated() {\n        scores[id, default: 0] += 1.0 / Float(k + rank)\n    }\n    for (rank, id) in bm25Ranks.enumerated() {\n        scores[id, default: 0] += 1.0 / Float(k + rank)\n    }\n    \n    return scores.sorted { $0.value > $1.value }\n}",
        "next": [
          9
        ],
        "gridX": 0.5
      },
      {
        "id": "eval",
        "stageIdx": 6,
        "gridY": 0.5,
        "next_ids": [
          "rerank"
        ],
        "badge": "Step 3a",
        "name": "Confidence Eval Loop",
        "next": [
          10
        ],
        "gridX": 0.5
      },
      {
        "id": "rerank",
        "stageIdx": 7,
        "gridY": 0.5,
        "next_ids": [
          "flashrank"
        ],
        "badge": "Step 3b",
        "name": "Cross-Encoder Rerank",
        "what": "Deeply scores retrieved chunks against the exact query.",
        "why": "Vectors only measure semantic distance. Cross-encoders measure logical relevance.",
        "how": "Passes (Query + Chunk) into a TinyBERT classification head.",
        "code": "let score = try await crossEncoder.predict([query, chunk])\nchunk.relevance = score",
        "next": [
          11
        ],
        "gridX": 0.5
      },
      {
        "id": "flashrank",
        "stageIdx": 8,
        "gridY": 0.5,
        "next_ids": [
          "sibling"
        ],
        "badge": "Step 3c",
        "name": "FlashRank",
        "what": "A secondary, ultra-fast reranking pass.",
        "why": "Used to break ties among the top 50 highly-relevant chunks.",
        "how": "Uses a quantized ranking model.",
        "code": "let finalRank = try await flashRank.rerank(top50)",
        "next": [
          12
        ],
        "gridX": 0.5
      },
      {
        "id": "sibling",
        "stageIdx": 9,
        "gridY": 0.5,
        "next_ids": [
          "pack"
        ],
        "badge": "Step 3d",
        "name": "Massive Sibling Expansion",
        "next": [
          13
        ],
        "gridX": 0.5
      },
      {
        "id": "pack",
        "stageIdx": 10,
        "gridY": 0.5,
        "next_ids": [
          "gen_1"
        ],
        "badge": "Step 3e",
        "name": "32K Context Packing",
        "next": [
          14
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_1",
        "stageIdx": 11,
        "gridY": 0.5,
        "next_ids": [
          "gen_2"
        ],
        "badge": "Step A",
        "name": "NAND Flash Paging",
        "what": "Streams the 20B model weights directly from the SSD (NVMe) rather than loading them entirely into unified memory (RAM).",
        "why": "A 20B model requires ~10GB of RAM. Paging allows it to run on base Model Macs without Out-of-Memory (OOM) crashes.",
        "how": "Uses Apple's unified memory architecture and mmap() to page active experts.",
        "code": "let weightBuffer = try MLMultiArray(shape: [shape], dataType: .float16)\n// Weights are mapped, not explicitly loaded\nweightBuffer.withUnsafeMutableBytes { ptr in\n    mmap(ptr.baseAddress, ptr.count, PROT_READ, MAP_SHARED, fd, 0)\n}",
        "next": [
          15
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_2",
        "stageIdx": 12,
        "gridY": 0.5,
        "next_ids": [
          "gen_3",
          "gen_4"
        ],
        "badge": "Step B",
        "name": "MoE Expert Router",
        "what": "Selects which sub-networks (experts) inside the 20B model should process the current token.",
        "why": "Allows a 20B parameter model to execute with the speed and battery drain of a 2.8B model.",
        "how": "A gating linear layer outputs probabilities, routing to the top 2 experts.",
        "code": "let gatingLogits = gatingLayer.forward(hiddenState)\nlet top2Experts = gatingLogits.topK(2)\n\nvar output = zeros()\nfor expert in top2Experts {\n    let expertOut = experts[expert.index].forward(hiddenState)\n    output += expertOut * expert.weight\n}",
        "next": [
          16,
          17
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_3",
        "stageIdx": 13,
        "gridY": 0.5,
        "next_ids": [
          "gen_5"
        ],
        "badge": "Step C",
        "name": "Draft Generation",
        "what": "Uses a tiny 48M parameter model to rapidly draft candidate tokens.",
        "why": "Large models are slow at generating tokens one-by-one. Tiny models can guess the next 5 tokens almost instantly.",
        "how": "Speculative Decoding architecture.",
        "code": "let draftTokens = try await tinyModel.generate(count: 5)\n// Forward to base model for verification",
        "next": [
          18
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_4",
        "stageIdx": 13,
        "gridY": 1.5,
        "next_ids": [
          "gen_5"
        ],
        "badge": "Step D",
        "name": "MoE Verification",
        "what": "The 20B MoE model verifies the draft sequence.",
        "why": "Combines Speculative Decoding speed with MoE scalability.",
        "how": "Parallel forward pass through the routed experts.",
        "code": "let verificationLogits = try await moeModel.forward(draftTokens)",
        "next": [
          18
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_5",
        "stageIdx": 14,
        "gridY": 0.5,
        "next_ids": [
          "verify_1"
        ],
        "badge": "Step E",
        "name": "Guided Generation",
        "what": "Forces the model to output strict JSON or citation schemas.",
        "why": "LLMs often drift from the requested format. Guided generation blocks invalid tokens at the sampler level.",
        "how": "Uses a Finite State Machine (FSM) or Regex masking during token selection.",
        "code": "let regex = try NSRegularExpression(pattern: \"\\\\[\\\\d+\\\\]\")\nlet sampler = RegexConstrainedSampler(regex: regex)\nlet token = sampler.sample(logits: logits)",
        "next": [
          19
        ],
        "gridX": 0.5
      },
      {
        "id": "verify_1",
        "stageIdx": 15,
        "gridY": 0.5,
        "next_ids": [
          "verify_2"
        ],
        "badge": "Step 5a",
        "name": "Fact-Check Sweep",
        "what": "Multi-agent fact checking against retrieved context.",
        "why": "Ensures the generated answer doesn't invent numbers or dates.",
        "how": "Uses a secondary prompt pass: 'Does this text align with this context?'",
        "code": "let result = verificationAgent.check(claims, against: context)",
        "next": [
          20
        ],
        "gridX": 0.5
      },
      {
        "id": "verify_2",
        "stageIdx": 16,
        "gridY": 0.5,
        "next_ids": [
          "verify_3"
        ],
        "badge": "Step 5b",
        "name": "Contradiction Sweep",
        "what": "Checks if the answer contradicts itself.",
        "why": "Complex multi-hop reasoning can sometimes lead to conflicting statements.",
        "how": "Analyzes the polarity of statements in the answer.",
        "code": "let isConsistent = logicEngine.verifyConsistency(answer)",
        "next": [
          21
        ],
        "gridX": 0.5
      },
      {
        "id": "verify_3",
        "stageIdx": 17,
        "gridY": 0.5,
        "next_ids": [
          "output"
        ],
        "badge": "Step 5c",
        "name": "Hallucination Pass",
        "what": "Final check for ungrounded information.",
        "why": "Catches any external knowledge the LLM hallucinated.",
        "how": "Ensures every claim has a valid citation marker.",
        "code": "if claim.hasNoCitation() {\n    hallucinationDetected = true\n}",
        "next": [
          22
        ],
        "gridX": 0.5
      },
      {
        "id": "output",
        "stageIdx": 18,
        "gridY": 0.5,
        "next_ids": [],
        "badge": "Output",
        "name": "Verified Response",
        "what": "Outputs the final Maximum mode answer.",
        "why": "Maximum recall, maximum context, maximum verification.",
        "how": "Render to UI.",
        "code": "ui.render(text: answer)",
        "next": [],
        "gridX": 0.5
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
      "Input",
      "Orchestrator",
      "Expansion",
      "Embed",
      "Mass Sweep",
      "RRF",
      "Eval Loop",
      "Rerank",
      "FlashRank",
      "Sibling",
      "Pack",
      "Inference 1",
      "Inference 2",
      "Inference 3",
      "Inference 4",
      "Fact-Check",
      "Logic",
      "Citations",
      "Output"
    ],
    "steps": [
      {
        "id": "input",
        "stageIdx": 0,
        "gridY": 0.5,
        "next_ids": [
          "orchestrator"
        ],
        "badge": "Input",
        "name": "User Query",
        "desc": "User submits query.",
        "what": "Captures the user's input from the ChatScreen UI.",
        "why": "The entry point for the entire retrieval pipeline.",
        "how": "Reads the bound SwiftUI text state.",
        "code": "struct ChatScreen: View {\n    @State private var query: String = \"\"\n    \n    var body: some View {\n        TextField(\"Ask anything...\", text: $query)\n            .onSubmit { engine.process(query) }\n    }\n}",
        "next": [
          1
        ],
        "gridX": 0.5
      },
      {
        "id": "orchestrator",
        "stageIdx": 1,
        "gridY": 0.5,
        "next_ids": [
          "rag_check",
          "expand"
        ],
        "badge": "Step 1a",
        "name": "Unlimited Orchestrator",
        "next": [
          2,
          3
        ],
        "gridX": 0.5
      },
      {
        "id": "rag_check",
        "stageIdx": 2,
        "gridY": 0.5,
        "next_ids": [
          "embed"
        ],
        "badge": "Step 1b",
        "name": "Self-RAG Check",
        "next": [
          4
        ],
        "gridX": 0.5
      },
      {
        "id": "expand",
        "stageIdx": 2,
        "gridY": 1.5,
        "next_ids": [
          "embed"
        ],
        "badge": "Step 1c",
        "name": "Semantic Expansion",
        "what": "Expands sub-queries using a local dictionary of synonyms.",
        "why": "Catches edge cases where documents use different terminology than the user.",
        "how": "Appends 2-3 semantic equivalents to the BM25 search string.",
        "code": "let expanded = semanticDictionary.expand(query.keywords)\nquery.keywords.append(contentsOf: expanded)",
        "next": [
          4
        ],
        "gridX": 0.5
      },
      {
        "id": "embed",
        "stageIdx": 3,
        "gridY": 0.5,
        "next_ids": [
          "vector",
          "bm25",
          "graph"
        ],
        "badge": "Step 1d",
        "name": "Batch Embed & Extract",
        "next": [
          5,
          6,
          7
        ],
        "gridX": 0.5
      },
      {
        "id": "vector",
        "stageIdx": 4,
        "gridY": 0.5,
        "next_ids": [
          "rrf"
        ],
        "badge": "Step 2a",
        "name": "Vector Sweep",
        "next": [
          8
        ],
        "gridX": 0.5
      },
      {
        "id": "bm25",
        "stageIdx": 4,
        "gridY": 1.5,
        "next_ids": [
          "rrf"
        ],
        "badge": "Step 2b",
        "name": "BM25 Sweep",
        "next": [
          8
        ],
        "gridX": 0.5
      },
      {
        "id": "graph",
        "stageIdx": 4,
        "gridY": 2.5,
        "next_ids": [
          "rrf"
        ],
        "badge": "Step 2c",
        "name": "GraphRAG Traversal",
        "next": [
          8
        ],
        "gridX": 0.5
      },
      {
        "id": "rrf",
        "stageIdx": 5,
        "gridY": 0.5,
        "next_ids": [
          "eval"
        ],
        "badge": "Step 2d",
        "name": "Hybrid RRF",
        "what": "Merges the Vector and BM25 results using Reciprocal Rank Fusion.",
        "why": "Scores from Vector (Cosine Similarity: 0.0-1.0) and BM25 (Arbitrary floats) are incompatible. RRF relies purely on their rank positions.",
        "how": "Calculates `1 / (k + rank)` for both lists and sums them.",
        "code": "func reciprocalRankFusion(vectorRanks: [String], bm25Ranks: [String], k: Int = 60) -> [(String, Float)] {\n    var scores: [String: Float] = [:]\n    \n    for (rank, id) in vectorRanks.enumerated() {\n        scores[id, default: 0] += 1.0 / Float(k + rank)\n    }\n    for (rank, id) in bm25Ranks.enumerated() {\n        scores[id, default: 0] += 1.0 / Float(k + rank)\n    }\n    \n    return scores.sorted { $0.value > $1.value }\n}",
        "next": [
          9
        ],
        "gridX": 0.5
      },
      {
        "id": "eval",
        "stageIdx": 6,
        "gridY": 0.5,
        "next_ids": [
          "rerank"
        ],
        "badge": "Step 3a",
        "name": "Confidence Eval Loop",
        "next": [
          10
        ],
        "gridX": 0.5
      },
      {
        "id": "rerank",
        "stageIdx": 7,
        "gridY": 0.5,
        "next_ids": [
          "flashrank"
        ],
        "badge": "Step 3b",
        "name": "Cross-Encoder Rerank",
        "what": "Deeply scores retrieved chunks against the exact query.",
        "why": "Vectors only measure semantic distance. Cross-encoders measure logical relevance.",
        "how": "Passes (Query + Chunk) into a TinyBERT classification head.",
        "code": "let score = try await crossEncoder.predict([query, chunk])\nchunk.relevance = score",
        "next": [
          11
        ],
        "gridX": 0.5
      },
      {
        "id": "flashrank",
        "stageIdx": 8,
        "gridY": 0.5,
        "next_ids": [
          "sibling"
        ],
        "badge": "Step 3c",
        "name": "FlashRank",
        "what": "A secondary, ultra-fast reranking pass.",
        "why": "Used to break ties among the top 50 highly-relevant chunks.",
        "how": "Uses a quantized ranking model.",
        "code": "let finalRank = try await flashRank.rerank(top50)",
        "next": [
          12
        ],
        "gridX": 0.5
      },
      {
        "id": "sibling",
        "stageIdx": 9,
        "gridY": 0.5,
        "next_ids": [
          "pack"
        ],
        "badge": "Step 3d",
        "name": "Massive Sibling Expansion",
        "next": [
          13
        ],
        "gridX": 0.5
      },
      {
        "id": "pack",
        "stageIdx": 10,
        "gridY": 0.5,
        "next_ids": [
          "gen_1"
        ],
        "badge": "Step 3e",
        "name": "32K Context Packing",
        "next": [
          14
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_1",
        "stageIdx": 11,
        "gridY": 0.5,
        "next_ids": [
          "gen_2"
        ],
        "badge": "Step A",
        "name": "PCC Escalate",
        "what": "Detects that the query requires 32K context and routes away from the local device.",
        "why": "On-device memory cannot physically support a 32,000 token context window.",
        "how": "Checks token count and initiates the Private Cloud Compute handshake.",
        "code": "if contextTokenCount > 4096 {\n    let session = PrivateCloudComputeSession()\n    try await session.authenticate()\n}",
        "next": [
          15
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_2",
        "stageIdx": 12,
        "gridY": 0.5,
        "next_ids": [
          "gen_3"
        ],
        "badge": "Step B",
        "name": "Secure Payload Transfer",
        "what": "Encrypts the 32K context window and transmits it to the PCC node.",
        "why": "Ensures Apple cannot read the user's private documents during cloud inference.",
        "how": "Uses target diffusion and end-to-end encryption tied to the user's iCloud key.",
        "code": "let encryptedPayload = try Crypto.encrypt(payload: context, using: pccPublicKey)\nlet request = URLRequest(url: pccEndpoint)\nrequest.httpBody = encryptedPayload\nlet response = try await URLSession.shared.data(for: request)",
        "next": [
          16
        ],
        "gridX": 0.5
      },
      {
        "id": "gen_3",
        "stageIdx": 13,
        "gridY": 0.5,
        "next_ids": [
          "verify_1"
        ],
        "badge": "Step C",
        "name": "Cloud GPU Execution",
        "what": "The server-side MoE (70B+) executes the inference on Apple Silicon server nodes.",
        "why": "Massive compute allows for deep reasoning across 32,000 tokens.",
        "how": "Returns an encrypted stream of tokens.",
        "code": "// (Server-Side Execution)\n// The payload is decrypted in the secure enclave, processed, and streamed back.",
        "next": [
          17
        ],
        "gridX": 0.5
      },
      {
        "id": "verify_1",
        "stageIdx": 15,
        "gridY": 0.5,
        "next_ids": [
          "verify_2"
        ],
        "badge": "Step 5a",
        "name": "Fact-Check Sweep",
        "what": "Multi-agent fact checking against retrieved context.",
        "why": "Ensures the generated answer doesn't invent numbers or dates.",
        "how": "Uses a secondary prompt pass: 'Does this text align with this context?'",
        "code": "let result = verificationAgent.check(claims, against: context)",
        "next": [
          18
        ],
        "gridX": 0.5
      },
      {
        "id": "verify_2",
        "stageIdx": 16,
        "gridY": 0.5,
        "next_ids": [
          "verify_3"
        ],
        "badge": "Step 5b",
        "name": "Contradiction Sweep",
        "what": "Checks if the answer contradicts itself.",
        "why": "Complex multi-hop reasoning can sometimes lead to conflicting statements.",
        "how": "Analyzes the polarity of statements in the answer.",
        "code": "let isConsistent = logicEngine.verifyConsistency(answer)",
        "next": [
          19
        ],
        "gridX": 0.5
      },
      {
        "id": "verify_3",
        "stageIdx": 17,
        "gridY": 0.5,
        "next_ids": [
          "output"
        ],
        "badge": "Step 5c",
        "name": "Hallucination Pass",
        "what": "Final check for ungrounded information.",
        "why": "Catches any external knowledge the LLM hallucinated.",
        "how": "Ensures every claim has a valid citation marker.",
        "code": "if claim.hasNoCitation() {\n    hallucinationDetected = true\n}",
        "next": [
          20
        ],
        "gridX": 0.5
      },
      {
        "id": "output",
        "stageIdx": 18,
        "gridY": 0.5,
        "next_ids": [],
        "badge": "Output",
        "name": "Verified Response",
        "what": "Outputs the final Maximum mode answer.",
        "why": "Maximum recall, maximum context, maximum verification.",
        "how": "Render to UI.",
        "code": "ui.render(text: answer)",
        "next": [],
        "gridX": 0.5
      }
    ]
  }
};

let activeDebuggerTrack = "standard_3b";
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
    const rawCode = step.code || getEngineCode(step);
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
      const playgroundCont = document.getElementById('playground');
      if (playgroundCont) playgroundCont.classList.remove('executing');
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
  userInterruptedScroll = false;
  const playgroundCont = document.getElementById('playground');
  if (playgroundCont) playgroundCont.classList.add('executing');
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
      const playgroundCont = document.getElementById('playground');
      if (playgroundCont) playgroundCont.classList.remove('executing');
      runBtn.textContent = activeDebuggerTrack === "ingestion" ? "Run Ingestion" : "Execute Query Pipeline";

      // Update connections layout at completion
      drawConnections();
      return;
    }

    
    // Process current step node highlighting
    if (!userInterruptedScroll) {
      const hud = document.getElementById("inspector-hud");
      if (hud) {
        const y = hud.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }

      // Horizontal autoscroll to current active node
      const wrapper = document.querySelector('.diagram-canvas-wrapper');
      const node = document.getElementById(`node-${stepIdx}`);
      if (wrapper && node) {
        const wrapperRect = wrapper.getBoundingClientRect();
        const nodeRect = node.getBoundingClientRect();
        const newScrollLeft = wrapper.scrollLeft + (nodeRect.left - wrapperRect.left) - (wrapperRect.width / 2) + (nodeRect.width / 2);
        wrapper.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
      }
    }

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

  // Initial draw: default to standard_3b execution pipeline
  updateTrack();
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
