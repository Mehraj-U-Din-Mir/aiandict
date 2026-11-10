import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  FileCode, 
  Sparkles,
  Layers,
  Cpu
} from 'lucide-react';

const LAB_TEMPLATES = [
  {
    name: "1. Neural Perceptron Classifier",
    lang: "javascript",
    code: `// Binary Classifier Perceptron with Sigmoid Activation
function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

// Weights and Bias initialized
let weights = [0.65, -0.42, 0.88];
let bias = -0.15;

// Sample sensor inputs [Edge Feature 1, Feature 2, Feature 3]
const samples = [
  { input: [0.8, 0.2, 0.9], label: "Orchard Scab Detected (Positive)" },
  { input: [0.1, 0.9, 0.1], label: "Healthy Leaf Canopy (Negative)" },
  { input: [0.7, 0.4, 0.6], label: "Early Stage Rust (Positive)" }
];

console.log("=== AI Lab Perceptron Forward Inference Pass ===");
samples.forEach((sample, idx) => {
  let z = sample.input.reduce((sum, val, i) => sum + val * weights[i], bias);
  let probability = sigmoid(z);
  let predictedClass = probability >= 0.5 ? 1 : 0;
  
  console.log(\`Sample #\${idx + 1}:\`);
  console.log(\`  Raw Logit (z): \${z.toFixed(4)}\`);
  console.log(\`  Sigmoid Activation P(y=1): \${(probability * 100).toFixed(2)}%\`);
  console.log(\`  Predicted Class: \${predictedClass} -> \${sample.label}\\n\`);
});
`
  },
  {
    name: "2. Scaled Dot-Product Attention Matrix",
    lang: "javascript",
    code: `// Self-Attention Mechanism (Transformer Core)
function softmax(arr) {
  const max = Math.max(...arr);
  const exps = arr.map(x => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(x => x / sum);
}

// 3 Tokens in sequence, embedding dim = 3
const Q = [[1, 0, 1], [0, 1, 0], [1, 1, 0]];
const K = [[1, 0, 1], [1, 1, 0], [0, 0, 1]];
const d_k = 3;

console.log("=== Scaled Dot-Product Attention Simulator ===");
console.log("Query count: 3 tokens, Key count: 3 tokens, d_k =", d_k);

const attentionWeights = [];
for (let i = 0; i < Q.length; i++) {
  const scores = [];
  for (let j = 0; j < K.length; j++) {
    // Dot product Q_i . K_j
    let dot = 0;
    for (let k = 0; k < d_k; k++) {
      dot += Q[i][k] * K[j][k];
    }
    // Scale by sqrt(d_k)
    scores.push(dot / Math.sqrt(d_k));
  }
  attentionWeights.push(softmax(scores));
}

console.log("\\nSoftmax Attention Alignment Matrix (3x3):");
attentionWeights.forEach((row, i) => {
  console.log(\`Token \${i + 1} Attention -> [\${row.map(v => v.toFixed(3)).join(", ")}]\`);
});
`
  },
  {
    name: "3. Computer Vision IOU & Bounding Box Filter",
    lang: "javascript",
    code: `// Intersection Over Union (IoU) Evaluator for Edge Vision
function calculateIoU(boxA, boxB) {
  // Box format: [x1, y1, x2, y2]
  const xA = Math.max(boxA[0], boxB[0]);
  const yA = Math.max(boxA[1], boxB[1]);
  const xB = Math.min(boxA[2], boxB[2]);
  const yB = Math.min(boxA[3], boxB[3]);

  const interArea = Math.max(0, xB - xA) * Math.max(0, yB - yA);
  const boxAArea = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1]);
  const boxBArea = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1]);

  return interArea / (boxAArea + boxBArea - interArea);
}

const groundTruth = [50, 50, 200, 200];
const yoloPrediction = [60, 55, 205, 195];

console.log("=== Edge Vision Detection Benchmarking ===");
console.log("Ground Truth BBox:", groundTruth);
console.log("YOLOv8 Detection BBox:", yoloPrediction);

const iou = calculateIoU(groundTruth, yoloPrediction);
console.log("\\nCalculated IoU Score:", (iou * 100).toFixed(2) + "%");

if (iou > 0.70) {
  console.log("Verdict: EXCELLENT OVERLAP (Meets VOC benchmark standard > 0.5)");
} else {
  console.log("Verdict: LOW OVERLAP (Candidate for Non-Maximum Suppression pruning)");
}
`
  },
  {
    name: "4. Tokenizer & Vocabulary Indexer",
    lang: "javascript",
    code: `// Regional NLP Subword Tokenizer Simulation
const text = "Artificial intelligence empowers researchers in Kashmir to innovate autonomous robotics.";
console.log("Original Text:\\n" + text);

// Normalization & Tokenization
const tokens = text.toLowerCase().replace(/[^a-z0-9\\s]/g, "").split(/\\s+/);
console.log("\\nToken Count:", tokens.length);

const vocabulary = Array.from(new Set(tokens)).sort();
console.log("Unique Vocabulary Size:", vocabulary.length);

const tokenToId = {};
vocabulary.forEach((word, index) => {
  tokenToId[word] = index + 101; // offset like BERT
});

const encodedSequence = tokens.map(t => tokenToId[t]);
console.log("\\nEncoded Token IDs Sequence:");
console.log(encodedSequence.join(" -> "));
`
  }
];

export default function VirtualLab() {
  const [selectedTemplateIdx, setSelectedTemplateIdx] = useState(0);
  const [code, setCode] = useState(LAB_TEMPLATES[0].code);
  const [output, setOutput] = useState("[AI Lab Console] Ready. Click 'Execute Code' to run script in in-browser JavaScript sandbox.");
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTemplateChange = (idx) => {
    setSelectedTemplateIdx(idx);
    setCode(LAB_TEMPLATES[idx].code);
    setOutput(`[AI Lab Console] Loaded: ${LAB_TEMPLATES[idx].name}`);
  };

  const handleRunCode = () => {
    setRunning(true);
    const logs = [];
    const customConsole = {
      log: (...args) => {
        logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '));
      },
      error: (...args) => {
        logs.push('[ERROR] ' + args.join(' '));
      },
      warn: (...args) => {
        logs.push('[WARN] ' + args.join(' '));
      }
    };

    const startTime = performance.now();

    try {
      // Execute within a safe scoped function providing custom console
      const runSandbox = new Function('console', code);
      runSandbox(customConsole);
      const elapsed = (performance.now() - startTime).toFixed(2);
      
      const resultText = logs.length > 0 ? logs.join('\n') : '[Execution completed with no console output]';
      setOutput(resultText + `\n\n[Runtime Telemetry] Execution finished in ${elapsed}ms • Status: 0 OK`);
    } catch (err) {
      setOutput(`[Syntax/Runtime Error]: ${err.message}\n${err.stack || ''}`);
    } finally {
      setRunning(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-semibold">
          <Terminal className="w-3.5 h-3.5" />
          <span>Interactive Computer Lab</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Virtual Code Laboratory
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Interactive client-side execution sandbox. Test Neural Perceptrons, Transformer Attention, Computer Vision IoU metrics, and Tokenizers directly in your browser with real-time logs.
        </p>
      </div>

      {/* Lab Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        
        {/* Template Selectors */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {LAB_TEMPLATES.map((tmpl, idx) => (
            <button
              key={tmpl.name}
              type="button"
              onClick={() => handleTemplateChange(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTemplateIdx === idx
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {tmpl.name}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyCode}
            className="p-2 rounded-lg bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
            title="Copy Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => handleTemplateChange(selectedTemplateIdx)}
            className="p-2 rounded-lg bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
            title="Reset Code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRunCode}
            disabled={running}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 transition-all shadow-md shadow-emerald-600/25 disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${running ? 'animate-spin' : ''}`} />
            <span>{running ? "Executing..." : "Execute Code"}</span>
          </button>
        </div>
      </div>

      {/* Editor & Console Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Code Editor */}
        <div className="lg:col-span-7 flex flex-col rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-5 py-3 bg-slate-900/90 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-mono">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>experiment.js</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Real-Time JavaScript Sandbox</span>
          </div>
          
          <div className="p-4 flex-1">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-[450px] bg-transparent text-slate-200 font-mono text-xs leading-relaxed focus:outline-none resize-none"
              spellCheck="false"
            />
          </div>
        </div>

        {/* Live Output Console */}
        <div className="lg:col-span-5 flex flex-col rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-5 py-3 bg-slate-900/90 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-mono">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Console Output</span>
            </div>
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sandbox Active
            </span>
          </div>

          <div className="p-5 flex-1 bg-black/70 font-mono text-xs leading-relaxed overflow-y-auto max-h-[450px]">
            <pre className="text-emerald-400 whitespace-pre-wrap">{output}</pre>
          </div>
        </div>

      </div>

    </div>
  );
}
