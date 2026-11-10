import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  RotateCcw, 
  Save, 
  Copy, 
  Check, 
  Cpu, 
  FileCode, 
  Sparkles,
  Layers
} from 'lucide-react';

const LAB_TEMPLATES = [
  {
    name: "YOLOv8 Edge Vision Simulation",
    lang: "python",
    code: `import numpy as np
import time

print("[AI Lab] Initializing INT8 YOLOv8 Edge Runtime...")
print("[AI Lab] Device target: NVIDIA Jetson Nano / TensorRT")

# Simulate frame capture from orchard canopy camera
camera_matrix = np.random.uniform(0.1, 0.9, size=(640, 640, 3))
print(f"[Sensors] Acquired 640x640x3 camera frame (Mean pixel intensity: {camera_matrix.mean():.3f})")

# Simulate inference
start = time.time()
print("[Inference] Passing tensors through quantized ConvNeXt backbone...")
time.sleep(0.3)
elapsed_ms = (time.time() - start) * 1000 + 8.4

# Detection results
detections = [
    {"class": "Apple Foliar Scab (Early)", "confidence": 0.964, "bbox": [124, 88, 240, 192]},
    {"class": "Cedar Rust Pathogen", "confidence": 0.912, "bbox": [310, 420, 390, 480]}
]

print(f"[Results] Found {len(detections)} plant pathologies in {elapsed_ms:.1f}ms:")
for d in detections:
    print(f"  -> Pathogen: {d['class']} | Confidence: {d['confidence']*100:.1f}% | BBox: {d['bbox']}")

print("[Telemetry] Thermal throttle: Nominal (41.2°C). Memory footprint: 184MB.")
`
  },
  {
    name: "Self-Attention Tensor Mathematics",
    lang: "python",
    code: `import numpy as np

def scaled_dot_product_attention(Q, K, V):
    d_k = Q.shape[-1]
    scores = np.matmul(Q, K.T) / np.sqrt(d_k)
    # Softmax
    exp_scores = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
    weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)
    output = np.matmul(weights, V)
    return output, weights

# Sequence of 4 tokens with embedding dimension 8
seq_len, d_model = 4, 8
np.random.seed(42)
Q = np.random.randn(seq_len, d_model)
K = np.random.randn(seq_len, d_model)
V = np.random.randn(seq_len, d_model)

print(f"[Transformer] Query tensor shape: {Q.shape}")
print(f"[Transformer] Key tensor shape: {K.shape}")
print(f"[Transformer] Value tensor shape: {V.shape}")

output, attn_matrix = scaled_dot_product_attention(Q, K, V)
print("\n[Softmax Weights] Attention Alignment Matrix:")
print(np.round(attn_matrix, 3))

print("\n[Context Vector] Output Representation:")
print(np.round(output[:2], 3))
`
  },
  {
    name: "eBPF Socket Flow Monitor",
    lang: "python",
    code: `# eBPF Kernel Probe Telemetry Simulator
import time

print("[Kernel] Attaching tracepoint to sock:sock_set_state...")
print("[eBPF] In-kernel ring buffer initialized with 4096 pages.")

simulated_events = [
    {"proto": "TCP", "saddr": "192.168.1.42:54820", "daddr": "8.8.8.8:53", "action": "PASS", "rtt_ms": 1.2},
    {"proto": "UDP", "saddr": "192.168.1.109:4120", "daddr": "198.51.100.12:4444", "action": "FLAGGED", "rtt_ms": 142.1},
    {"proto": "TCP", "saddr": "192.168.1.42:54822", "daddr": "104.244.42.1:443", "action": "PASS", "rtt_ms": 3.8}
]

print("[Sentinel] In-line spatio-temporal GNN active:")
for ev in simulated_events:
    tag = "[ALERT: COVERT DNS TUNNEL]" if ev["action"] == "FLAGGED" else "[NOMINAL]"
    print(f" {tag} {ev['proto']} {ev['saddr']} -> {ev['daddr']} (RTT: {ev['rtt_ms']}ms)")

print("\n[Verdict] 1 suspicious covert egress flow isolated in sub-40ms.")
`
  }
];

export default function VirtualLab() {
  const [selectedTemplateIdx, setSelectedTemplateIdx] = useState(0);
  const [code, setCode] = useState(LAB_TEMPLATES[0].code);
  const [output, setOutput] = useState("[AI Lab Console] Ready. Click 'Execute Code' to run script in sandbox.");
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTemplateChange = (idx) => {
    setSelectedTemplateIdx(idx);
    setCode(LAB_TEMPLATES[idx].code);
    setOutput(`[AI Lab Console] Loaded: ${LAB_TEMPLATES[idx].name}`);
  };

  const handleRunCode = () => {
    setRunning(true);
    setOutput("[AI Lab Runtime] Compiling execution sandbox and allocating tensors...");

    setTimeout(() => {
      // Simulate real output
      if (selectedTemplateIdx === 0) {
        setOutput(
`[AI Lab] Initializing INT8 YOLOv8 Edge Runtime...
[AI Lab] Device target: NVIDIA Jetson Nano / TensorRT
[Sensors] Acquired 640x640x3 camera frame (Mean pixel intensity: 0.491)
[Inference] Passing tensors through quantized ConvNeXt backbone...
[Results] Found 2 plant pathologies in 18.2ms:
  -> Pathogen: Apple Foliar Scab (Early) | Confidence: 96.4% | BBox: [124, 88, 240, 192]
  -> Pathogen: Cedar Rust Pathogen | Confidence: 91.2% | BBox: [310, 420, 390, 480]
[Telemetry] Thermal throttle: Nominal (41.2°C). Memory footprint: 184MB.
[Sandbox Exit Code 0] Execution completed successfully in 0.384s.`
        );
      } else if (selectedTemplateIdx === 1) {
        setOutput(
`[Transformer] Query tensor shape: (4, 8)
[Transformer] Key tensor shape: (4, 8)
[Transformer] Value tensor shape: (4, 8)

[Softmax Weights] Attention Alignment Matrix:
[[0.312 0.218 0.285 0.185]
 [0.198 0.412 0.174 0.216]
 [0.245 0.190 0.382 0.183]
 [0.189 0.254 0.201 0.356]]

[Context Vector] Output Representation:
[[-0.412  0.884 -0.129  0.301 -0.551  0.722 -0.318  0.491]
 [ 0.119 -0.321  0.781 -0.442  0.298 -0.112  0.640 -0.219]]

[Sandbox Exit Code 0] Execution completed successfully in 0.192s.`
        );
      } else {
        setOutput(
`[Kernel] Attaching tracepoint to sock:sock_set_state...
[eBPF] In-kernel ring buffer initialized with 4096 pages.
[Sentinel] In-line spatio-temporal GNN active:
 [NOMINAL] TCP 192.168.1.42:54820 -> 8.8.8.8:53 (RTT: 1.2ms)
 [ALERT: COVERT DNS TUNNEL] UDP 192.168.1.109:4120 -> 198.51.100.12:4444 (RTT: 142.1ms)
 [NOMINAL] TCP 192.168.1.42:54822 -> 104.244.42.1:443 (RTT: 3.8ms)

[Verdict] 1 suspicious covert egress flow isolated in sub-40ms.
[Sandbox Exit Code 0] Kernel probe executed cleanly in 0.248s.`
        );
      }
      setRunning(false);
    }, 700);
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
          Interactive in-browser Python runtime simulator. Test Transformer attention models, edge computer vision pipelines, and eBPF kernel monitors in real time.
        </p>
      </div>

      {/* Lab Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        
        {/* Template Selectors */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {LAB_TEMPLATES.map((tmpl, idx) => (
            <button
              key={tmpl.name}
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
            onClick={copyCode}
            className="p-2 rounded-lg bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
            title="Copy Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={() => handleTemplateChange(selectedTemplateIdx)}
            className="p-2 rounded-lg bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
            title="Reset Code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
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
              <span>experiment.py</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Python 3.10 • NumPy • TensorRT</span>
          </div>
          
          <div className="p-4 flex-1">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-[420px] bg-transparent text-slate-200 font-mono text-xs leading-relaxed focus:outline-none resize-none"
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

          <div className="p-5 flex-1 bg-black/60 font-mono text-xs leading-relaxed overflow-y-auto max-h-[420px]">
            <pre className="text-emerald-400 whitespace-pre-wrap">{output}</pre>
          </div>
        </div>

      </div>

    </div>
  );
}
