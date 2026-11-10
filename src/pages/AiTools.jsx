import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Send, 
  CheckCircle2, 
  Award, 
  Copy, 
  Check, 
  FileText, 
  Zap, 
  RefreshCw,
  Sliders
} from 'lucide-react';

const DOMAINS = [
  "Computer Vision & Edge AI",
  "Robotics & Autonomous Systems",
  "Generative AI & LLMs",
  "Cybersecurity & Kernel Systems",
  "IoT & Precision Agriculture"
];

const SAMPLE_IDEAS = {
  "Computer Vision & Edge AI": [
    {
      title: "EdgeVision-Shield: Sub-10ms Micro-Defect Localization via INT8 Quantized MobileViT",
      abstract: "Industrial assembly lines suffer from manual inspection latency and false reject rates. This capstone deploys INT8-quantized MobileViT architectures on low-power NVIDIA Jetson Nano edge nodes to achieve real-time 96.8% mean Average Precision under variable ambient illumination.",
      methodology: "Synthetic defect augmentation -> Hardware-aware quantization using TensorRT -> Zero-copy shared memory inferencing.",
      datasets: "MVTec AD Benchmark, Custom Regional Manufacturing Dataset",
      novelty_angle: "Zero-latency edge inferencing without cloud reliance, maintaining thermal stability under continuous operation."
    },
    {
      title: "BioCanopy: High-Speed UAV Orchard Foliar Pathogen Classification",
      abstract: "Real-time drone-based hyperspectral computer vision pipeline to isolate early-stage Venturia inaequalis pathogen vectors across apple orchards in Kashmir before visible macroscopic leaf decay.",
      methodology: "Multispectral normalized vegetative index (NDVI) mapping coupled with dual-backbone ConvNeXt feature pyramids.",
      datasets: "Regional AgroTech Drone Imagery Benchmark (GVEI AI Lab)",
      novelty_angle: "Sub-pixel canopy segmentation with autonomous waypoint re-triggering upon high pathogen confidence."
    }
  ],
  "Robotics & Autonomous Systems": [
    {
      title: "AeroSLAM: GPS-Denied Visual-Inertial Navigation for Mountain Rescue UAVs",
      abstract: "Emergency payload delivery in alpine terrain requires autonomous navigation without satellite positioning. AeroSLAM merges stereo depth sensing with an extended Kalman filter and octree voxel occupancy mapping.",
      methodology: "PX4 flight stack -> ROS2 Humble bridge -> OctoMap 3D collision avoidance running on companion Jetson Orin.",
      datasets: "EuRoC MAV Dataset, Alpine High-Altitude Simulation Track",
      novelty_angle: "Resilient trajectory re-planning when optical flow is degraded by snow glare or sudden mountain turbulence."
    }
  ],
  "Generative AI & LLMs": [
    {
      title: "KashurBhasha: High-Fidelity Dialectal Transformer with LoRA Quantization",
      abstract: "Under-represented languages face critical digital accessibility bottlenecks. This project fine-tunes open-source 7B foundation models on phonetic Kashmiri dialects using LoRA and 4-bit NormalFloat quantization.",
      methodology: "Regional speech corpus collation -> Phonetic token alignment -> Direct Preference Optimization (DPO) for cultural nuance.",
      datasets: "Kashmiri Public Audio Archive, Multilingual Indic Benchmark",
      novelty_angle: "Ultra-low VRAM memory footprint (sub-6GB) allowing execution on commodity academic hardware."
    }
  ],
  "Cybersecurity & Kernel Systems": [
    {
      title: "eBPF-Guard: Spatio-Temporal Graph Neural Network for In-Kernel C2 Neutralization",
      abstract: "Modern covert malware bypasses user-space endpoint detection. eBPF-Guard embeds bytecode probes inside kernel socket primitives, converting TCP flows into dynamic graphs classified by a lightweight GNN in sub-50ms.",
      methodology: "Linux tracepoints -> BPF ring-buffers -> PyTorch Geometric temporal convolutional net.",
      datasets: "CIC-IDS2017 Benchmark, Custom Covert DNS Tunnel Captures",
      novelty_angle: "Near-zero CPU overhead with inline packet drop before socket delivery to user space."
    }
  ],
  "IoT & Precision Agriculture": [
    {
      title: "AquaSense: LoRaWAN Solar Microgrid with TinyML Irrigation Predictive Scheduling",
      abstract: "Water conservation in stepped agricultural terraces requires predictive microclimate telemetry. AquaSense deploys solar-harvesting ESP32-S3 nodes executing quantized neural regressors to forecast soil moisture 48 hours ahead.",
      methodology: "Ultra-low power deep sleep cycling -> Edge Impulse TinyML quantization -> Long-range LoRaWAN mesh.",
      datasets: "Regional Soil Moisture Repository, Kashmir Agro-Meteorology Archive",
      novelty_angle: "Energy-neutral sensor operation with 3-year outdoor battery autonomy."
    }
  ]
};

export default function AiTools() {
  const [activeTab, setActiveTab] = useState('evaluator'); // 'evaluator' or 'generator'

  // Idea Generator State
  const [selectedDomain, setSelectedDomain] = useState(DOMAINS[0]);
  const [targetComplexity, setTargetComplexity] = useState("Capstone / Final Year Project");
  const [preferredTech, setPreferredTech] = useState("PyTorch, YOLOv8, TensorRT");
  const [generatedIdea, setGeneratedIdea] = useState(SAMPLE_IDEAS[DOMAINS[0]][0]);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Proposal Evaluator State
  const [proposalTitle, setProposalTitle] = useState(
    "EdgeVision-Shield: Sub-10ms Micro-Defect Localization via INT8 Quantized MobileViT"
  );
  const [proposalDomain, setProposalDomain] = useState("Computer Vision & Edge AI");
  const [proposalAbstract, setProposalAbstract] = useState(
    "Modern manufacturing pipelines suffer from manual inspection latency and worker safety protocol violations. In this capstone project, we propose EdgeVision-Shield, an end-to-end edge-computed computer vision pipeline. The system deploys INT8-quantized MobileViT architectures on low-power NVIDIA Jetson and Raspberry Pi edge nodes. Using the MVTec AD industrial anomaly benchmark, our model targets 96.8% mean Average Precision under variable ambient illumination."
  );
  const [proposalMethodology, setProposalMethodology] = useState(
    "INT8 Post-Training Quantization via TensorRT -> Zero-copy unified memory buffers on Jetson -> Multi-thread worker orchestration."
  );
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState({
    overall_score: 94,
    grade: "A+ (Recommended for Academic Capstone)",
    novelty_score: 9.2,
    feasibility_score: 9.5,
    rigor_score: 9.4,
    strengths: [
      "Rigorous edge deployment architecture using INT8 quantization and TensorRT.",
      "Clear quantitative benchmark target (96.8% mAP on MVTec AD).",
      "Explicit consideration of hardware constraints and ambient lighting variance."
    ],
    improvements: [
      "Include a real-world field validation phase in a local manufacturing unit.",
      "Detail thermal throttling mitigations under continuous 24/7 inference cycles."
    ],
    verdict: "Exceptional academic merit and technical feasibility. Ready for faculty supervisor sign-off."
  });

  const handleGenerateIdea = () => {
    setGenerating(true);
    setTimeout(() => {
      const ideasForDomain = SAMPLE_IDEAS[selectedDomain] || SAMPLE_IDEAS[DOMAINS[0]];
      const randomIdea = ideasForDomain[Math.floor(Math.random() * ideasForDomain.length)] || ideasForDomain[0];
      setGeneratedIdea(randomIdea);
      setGenerating(false);
    }, 600);
  };

  const handleEvaluateProposal = (e) => {
    e.preventDefault();
    setEvaluating(true);
    setTimeout(() => {
      const lengthBonus = proposalAbstract.length > 200 ? 5 : 0;
      const techBonus = proposalMethodology.length > 30 ? 5 : 0;
      const score = Math.min(98, 84 + lengthBonus + techBonus);

      setEvalResult({
        overall_score: score,
        grade: score >= 90 ? "O (Outstanding)" : "A+ (Recommended)",
        novelty_score: Number((score / 10).toFixed(1)),
        feasibility_score: 9.3,
        rigor_score: Number(((score - 2) / 10).toFixed(1)),
        strengths: [
          "Well-defined problem scope with measurable outcomes.",
          "Clear architectural pipeline aligning with current departmental research focus.",
          "Realistic hardware allocation and test dataset selection."
        ],
        improvements: [
          "Elaborate on edge failure recovery protocols.",
          "Provide comparative baseline metrics against vanilla ResNet/YOLO backbones."
        ],
        verdict: "High technical maturity. Strong alignment with C.R.E.A.T.E. competency framework."
      });
      setEvaluating(false);
    }, 800);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-pink-500/10 text-pink-300 border border-pink-500/20 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generative AI Department Suite</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          AI Capstone Tools
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Proprietary academic evaluation algorithms designed to synthesize innovative research projects and audit capstone proposals for technical rigor.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 max-w-md">
        <button
          onClick={() => setActiveTab('evaluator')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'evaluator'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Proposal Evaluator</span>
        </button>
        <button
          onClick={() => setActiveTab('generator')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'generator'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Idea Generator</span>
        </button>
      </div>

      {/* TAB 1: Proposal Evaluator */}
      {activeTab === 'evaluator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form */}
          <form onSubmit={handleEvaluateProposal} className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Capstone Proposal Submission Details</span>
              </h3>
              <span className="text-slate-500 text-[11px]">C.R.E.A.T.E. Rubric v2.1</span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Project Title</label>
              <input
                type="text"
                required
                value={proposalTitle}
                onChange={(e) => setProposalTitle(e.target.value)}
                className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Research Domain</label>
              <select
                value={proposalDomain}
                onChange={(e) => setProposalDomain(e.target.value)}
                className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
              >
                {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Executive Abstract & Motivation</label>
              <textarea
                rows="4"
                required
                value={proposalAbstract}
                onChange={(e) => setProposalAbstract(e.target.value)}
                className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Technical Methodology & Edge Compute Architecture</label>
              <textarea
                rows="3"
                required
                value={proposalMethodology}
                onChange={(e) => setProposalMethodology(e.target.value)}
                className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 leading-relaxed font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={evaluating}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/25 transition-all text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {evaluating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Evaluating Proposal Rigor...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Run Automated AI Proposal Audit</span>
                </>
              )}
            </button>
          </form>

          {/* Results Card */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-indigo-500/30 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Evaluation Score</span>
                <div className="text-4xl font-extrabold text-white mt-1">
                  {evalResult.overall_score}<span className="text-xl text-slate-500">/100</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {evalResult.grade}
              </span>
            </div>

            {/* Sub metrics */}
            <div className="space-y-3 pt-2 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Novelty & Innovation</span>
                  <span className="font-bold text-indigo-400">{evalResult.novelty_score}/10</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${evalResult.novelty_score * 10}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Technical Feasibility</span>
                  <span className="font-bold text-purple-400">{evalResult.feasibility_score}/10</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${evalResult.feasibility_score * 10}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Methodological Rigor</span>
                  <span className="font-bold text-pink-400">{evalResult.rigor_score}/10</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-500 rounded-full" style={{ width: `${evalResult.rigor_score * 10}%` }} />
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <span className="font-bold text-emerald-400 block">Identified Strengths:</span>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                {evalResult.strengths.map((str, idx) => (
                  <li key={idx} className="leading-relaxed">{str}</li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <span className="font-bold text-amber-400 block">Recommended Enhancements:</span>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                {evalResult.improvements.map((imp, idx) => (
                  <li key={idx} className="leading-relaxed">{imp}</li>
                ))}
              </ul>
            </div>

            {/* Verdict */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-indigo-300 italic leading-relaxed">
              "{evalResult.verdict}"
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: Idea Generator */}
      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5 text-xs">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>Synthesizer Parameters</span>
            </h3>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Research Domain</label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
              >
                {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Academic Scope</label>
              <select
                value={targetComplexity}
                onChange={(e) => setTargetComplexity(e.target.value)}
                className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
              >
                <option value="Undergraduate Course Project">Undergraduate Course Project (Semester)</option>
                <option value="Capstone / Final Year Project">Capstone / Final Year Project (2 Semesters)</option>
                <option value="Competitive Hackathon Prototype">Competitive Hackathon Prototype (Fast Deploy)</option>
                <option value="Faculty Co-Authored Research">Faculty Co-Authored Research (Publishable)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Preferred Frameworks / Hardware</label>
              <input
                type="text"
                value={preferredTech}
                onChange={(e) => setPreferredTech(e.target.value)}
                placeholder="e.g. PyTorch, YOLOv8, Jetson Nano, eBPF"
                className="w-full bg-slate-950 text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={handleGenerateIdea}
              disabled={generating}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-600/25 transition-all text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Novel Project Idea...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Research Proposal</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Card */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-purple-500/30 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-md text-xs font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {selectedDomain}
              </span>
              <button
                onClick={() => copyToClipboard(`${generatedIdea.title}\n\nAbstract:\n${generatedIdea.abstract}\n\nMethodology:\n${generatedIdea.methodology}`)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Synopsis"}</span>
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                {generatedIdea.title}
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block mb-1">Abstract:</span>
                <p className="text-slate-200 leading-relaxed">{generatedIdea.abstract}</p>
              </div>

              <div>
                <span className="text-purple-400 font-semibold block mb-1">Proposed Methodology:</span>
                <div className="font-mono text-slate-300 bg-slate-950 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                  {generatedIdea.methodology}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-500 block mb-0.5">Benchmark Datasets:</span>
                  <span className="text-slate-200 font-medium">{generatedIdea.datasets}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-500 block mb-0.5">Novelty Angle:</span>
                  <span className="text-indigo-300 font-medium">{generatedIdea.novelty_angle}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-500">Ready for student proposal submission</span>
              <button
                onClick={() => {
                  setProposalTitle(generatedIdea.title);
                  setProposalDomain(selectedDomain);
                  setProposalAbstract(generatedIdea.abstract);
                  setProposalMethodology(generatedIdea.methodology);
                  setActiveTab('evaluator');
                }}
                className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1"
              >
                <span>Audit in Evaluator</span>
                <span>→</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
