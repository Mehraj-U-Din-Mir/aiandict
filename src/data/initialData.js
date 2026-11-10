// AI & ICT Department — Master Seed Data (Preserved 1:1 from Flask & Supabase)

export const initialUsers = [
  {
    id: 1,
    name: "Er. Mehraj U Din Mir",
    email: "adminaiict@gvei.com",
    role: "admin",
    status: "Approved",
    designation: "HOD AI & ICT GVEI",
    department: "Department of AI & ICT, Green Valley Educational Institute (GVEI)",
    specialization: "Artificial Intelligence, Deep Learning & ICT Systems",
    phone: "+91-94190-00000",
    whatsapp_no: "+91-94190-00000",
    avatar_url: "/img/mehraj.png",
    bio: "Head of the Department of Artificial Intelligence & ICT at Green Valley Educational Institute (GVEI). Driving cutting-edge AI research, edge computing, robotics, and academic innovation."
  },
  {
    id: 2,
    name: "Department Administrator",
    email: "admin@dept.ai",
    role: "admin",
    status: "Approved",
    designation: "Head of Department & Portal Admin",
    department: "AI & ICT Department, GVEI",
    specialization: "Department Governance & AI Research",
    avatar_url: "/img/admin.jpg",
    bio: "Overseeing academic excellence, research initiatives, and student project mentorship."
  },
  {
    id: 3,
    name: "Er. Mehraj U Din Mir",
    email: "mehraj@dept.ai",
    role: "faculty",
    status: "Approved",
    designation: "IP Lecturer & Lead AI/ML Trainer",
    department: "AI & ICT Department",
    specialization: "Computer Vision, Deep Learning, MLOps",
    phone: "+91-94190-00000",
    avatar_url: "/img/mehraj.png",
    bio: "Empowering the youth from the Valley of Kashmir to the frontiers of Global Artificial Intelligence Innovation."
  },
  {
    id: 4,
    name: "Prof. Salman Ahmed",
    email: "salman@dept.ai",
    role: "faculty",
    status: "Approved",
    designation: "Associate Professor",
    department: "AI & ICT Department",
    specialization: "IoT, Robotics & Embedded AI",
    avatar_url: "/img/nousheen.png",
    bio: "Specialist in edge compute devices, smart sensor networks, and autonomous robotics."
  },
  {
    id: 5,
    name: "Engr. Zara Malik",
    email: "zara@dept.ai",
    role: "faculty",
    status: "Approved",
    designation: "Assistant Professor",
    department: "AI & ICT Department",
    specialization: "AI Ethics, Policy & Explainable AI",
    avatar_url: "/img/abara.png",
    bio: "Focusing on trustworthy AI, fair algorithmic governance, and responsible LLM deployment."
  },
  {
    id: 6,
    name: "Zubair Ahmad",
    email: "student@dept.ai",
    role: "student",
    status: "Approved",
    designation: "Student Researcher",
    department: "AI & ICT Department",
    specialization: "Computer Vision & Edge Systems",
    class_name: "B.Tech AI & Data Science",
    roll_no: "AI-2024-042",
    section: "A",
    avatar_url: "/img/students.jpg",
    bio: "Third-year undergraduate student researching micro-UAV autonomous obstacle avoidance and drone perception."
  }
];

export const initialProjects = [
  {
    id: 1,
    title: "Kashmir Orchard Vision: Automated Apple Disease Detection",
    category: "Computer Vision",
    abstract: "An end-to-end edge AI system combining YOLOv8 and EfficientNet to diagnose 12 distinct foliar apple tree diseases in real-time under natural outdoor lighting conditions.",
    methodology: "Mobile data capture in local orchards -> INT8 Quantization via TensorRT -> Real-time inferencing on low-power Jetson Nano edge boards with 96.4% mAP.",
    tech_stack: "Python, YOLOv8, PyTorch, Flask, OpenCV",
    github_url: "https://github.com/gvei-ai-ict/orchard-vision",
    demo_url: "https://orchard-vision-demo.vercel.app",
    student_id: 6,
    student_name: "Zubair Ahmad",
    faculty_id: 3,
    faculty_name: "Er. Mehraj U Din Mir",
    status: "Approved",
    score: 96,
    score_innovation: 10,
    score_technical: 9,
    score_presentation: 10,
    grade: "O (Outstanding)",
    feedback: "Outstanding methodology, high validation accuracy, and excellent field testing in local orchards.",
    is_featured: true,
    created_at: "2025-04-12"
  },
  {
    id: 2,
    title: "Autonomous Multi-Rotor Search & Rescue UAV",
    category: "Robotics & Autonomous Systems",
    abstract: "A dual-camera micro-UAV executing real-time onboard visual SLAM and lightweight YOLOv8 object detection on an NVIDIA Jetson companion computer for GPS-denied emergency payload delivery in mountainous terrain.",
    methodology: "PX4 autopilot integration with ROS2 Humble node graph; stereo depth estimation feeds real-time octree occupancy mapping.",
    tech_stack: "ROS2 Humble, PX4 Autopilot, YOLOv8, Python, OpenCV",
    github_url: "https://github.com/gvei-ai-ict/rescue-drone",
    demo_url: "https://rescue-drone-sim.vercel.app",
    student_id: 6,
    student_name: "Zubair Ahmad & Team Fikr",
    faculty_id: 3,
    faculty_name: "Er. Mehraj U Din Mir",
    status: "Approved",
    score: 94,
    score_innovation: 9,
    score_technical: 10,
    score_presentation: 9,
    grade: "A+",
    feedback: "Exceptional hardware-in-the-loop validation and robust fault recovery mechanics.",
    is_featured: true,
    created_at: "2025-05-02"
  },
  {
    id: 3,
    title: "Kashur-LLM: Regional Multilingual Speech & Language Intelligence",
    category: "Generative AI & LLMs",
    abstract: "Fine-tuned transformer model for bilingual Kashmiri and English acoustic speech transcription and translation, designed for local administrative, healthcare, and educational digitization.",
    methodology: "LoRA parameter-efficient adaptation on Whisper Large-v3 architecture using 120+ hours of verified regional conversational corpus.",
    tech_stack: "PyTorch, HuggingFace, Whisper, LoRA, FastAPI",
    github_url: "https://github.com/gvei-ai-ict/kashur-llm",
    demo_url: "https://kashur-llm.huggingface.co",
    student_id: 6,
    student_name: "Insha Farooq & Team Alpha",
    faculty_id: 3,
    faculty_name: "Er. Mehraj U Din Mir",
    status: "Approved",
    score: 98,
    score_innovation: 10,
    score_technical: 10,
    score_presentation: 10,
    grade: "O (Outstanding)",
    feedback: "High socio-economic impact for Kashmiri regional linguistic preservation and accessibility.",
    is_featured: true,
    created_at: "2025-06-15"
  },
  {
    id: 4,
    title: "ZeroTrust-Sentinel: Autonomous Kernel Threat Telemetry",
    category: "Cyber & Quantum Systems",
    abstract: "High-throughput network anomaly detector operating directly in kernel space with eBPF probes, converting socket flows into graph neural networks to neutralize covert DNS tunnels in sub-120ms.",
    methodology: "In-kernel eBPF bytecode hooks socket lifecycle events, stream-encoding network flow graphs into a spatio-temporal GNN.",
    tech_stack: "eBPF, BCC, PyTorch Geometric, Linux Kernel, Docker",
    github_url: "https://github.com/gvei-ai-ict/zerotrust-sentinel",
    demo_url: "https://zerotrust-sentinel-demo.local",
    student_id: 6,
    student_name: "Faizan Rashid",
    faculty_id: 4,
    faculty_name: "Prof. Salman Ahmed",
    status: "Approved",
    score: 92,
    score_innovation: 9,
    score_technical: 9,
    score_presentation: 9,
    grade: "A+",
    feedback: "Impressive low-latency benchmark performance under simulated DDoS attack vectors.",
    is_featured: true,
    created_at: "2025-07-04"
  },
  {
    id: 5,
    title: "Precision Orchard Microgrid & Canopy Telemetry Network",
    category: "IoT & Embedded AI",
    abstract: "Distributed solar-powered ESP32 and Coral TPU sensor nodes monitoring soil moisture, microclimate shifts, and early pest infestation in Kashmiri apple orchards via long-range LoRaWAN.",
    methodology: "Solar energy harvesting with deep-sleep cycling; TinyML quantized models predict irrigation requirements 48 hours in advance.",
    tech_stack: "ESP32-S3, Edge Impulse, LoRaWAN, InfluxDB, Grafana",
    github_url: "https://github.com/gvei-ai-ict/orchard-telemetry",
    demo_url: "https://canopy-telemetry.local",
    student_id: 6,
    student_name: "Burhan Nazir",
    faculty_id: 4,
    faculty_name: "Prof. Salman Ahmed",
    status: "Approved",
    score: 89,
    score_innovation: 8,
    score_technical: 9,
    score_presentation: 9,
    grade: "A",
    feedback: "Solid practical execution with long battery autonomy in outdoor field conditions.",
    is_featured: false,
    created_at: "2025-08-10"
  }
];

export const initialAchievements = [
  {
    id: 1,
    title: "NIT AI Hackathon Winners",
    category: "Hackathon",
    badge: "First Place National Trophy",
    date: "2025-05-18",
    description: "Our student team 'Fikr Fusion', mentored by Er. Mehraj U Din Mir, secured 1st place at the NIT AI Hackathon 2025 organized by CodeDay Kashmir, competing against 25+ top educational institutions.",
    image_url: "/img/nit.jpg",
    is_featured: true
  },
  {
    id: 2,
    title: "Best Research Paper Award (IEEE)",
    category: "Research",
    badge: "IEEE Best Paper Award",
    date: "2025-03-12",
    description: "Recognized internationally at the IEEE Computing & Intelligent Systems Conference for pioneering work in Lightweight Transformer Architectures for Edge Devices and IoT Sensor Networks.",
    image_url: "/img/activity.jpg",
    is_featured: true
  },
  {
    id: 3,
    title: "AI AgroTech Innovation Grant ($50,000)",
    category: "Grant",
    badge: "Innovation Research Grant",
    date: "2025-01-20",
    description: "Secured a $50,000 research and commercialization grant to build autonomous drone-based computer vision for precision apple orchard yield forecasting in Jammu & Kashmir.",
    image_url: "/img/club.jpg",
    is_featured: true
  }
];

export const initialMessages = [
  {
    id: 1,
    faculty_id: 3,
    faculty_name: "Er. Mehraj U Din Mir",
    title: "Welcome to Autumn Project Submissions & Capstone Mentorship",
    content: "Dear students, the departmental project submission portal is now officially open! All 3rd and 4th-year students must submit their project abstracts and select a faculty supervisor. Please visit the Student Corner to submit your proposals.",
    category: "Announcement",
    priority: "Important",
    created_at: "2025-09-01"
  },
  {
    id: 2,
    faculty_id: 4,
    faculty_name: "Prof. Salman Ahmed",
    title: "Call for Submissions: Smart IoT & Edge AI Prototype Challenge",
    content: "Faculty lab is opening 5 research assistant slots for students interested in micro-controller computer vision (ESP32-CAM & Coral Edge TPU). Submit your project proposals via your student dashboard.",
    category: "Project Opportunity",
    priority: "Normal",
    created_at: "2025-09-12"
  },
  {
    id: 3,
    faculty_id: 5,
    faculty_name: "Engr. Zara Malik",
    title: "Workshop on Trustworthy & Explainable AI Architectures",
    content: "Join us this Friday in the AI Compute Lab for an interactive walkthrough on SHAP, LIME, and bias mitigation pipelines for Large Language Models.",
    category: "Advisory",
    priority: "Normal",
    created_at: "2025-09-20"
  }
];

export const initialActivities = [
  {
    id: 1,
    title: "AI Orientation & Generative AI Workshop",
    date: "2025-08-20",
    category: "Workshop",
    location: "Auditorium Hall, GVEI",
    description: "Comprehensive orientation for freshmen featuring hands-on Prompt Engineering, LLM foundational architectures, and academic ethics in Artificial Intelligence.",
    image_url: "/img/activity.jpg"
  },
  {
    id: 2,
    title: "NLP & Transformers Hands-On Bootcamp",
    date: "2025-09-02",
    category: "Bootcamp",
    location: "AI Compute Lab, GVEI",
    description: "Intensive multi-day bootcamp building custom Transformer architectures, attention mechanisms, and fine-tuning BERT & Llama models from scratch.",
    image_url: "/img/activity.jpg"
  },
  {
    id: 3,
    title: "Smart Valley 24-Hour AI Hackathon",
    date: "2025-10-12",
    category: "Hackathon",
    location: "Main Tech Hub, GVEI",
    description: "Annual regional hackathon solving regional real-world challenges in agriculture, healthcare, and education with intelligent computer vision & IoT systems.",
    image_url: "/img/nit.jpg"
  }
];

export const initialClubShowcases = [
  {
    id: 1,
    title: "Autonomous Multi-Rotor Search & Rescue UAV",
    category: "Robotics & Autonomous Systems",
    lead_student: "Zubair Ahmad & Team Fikr",
    mentor_name: "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)",
    abstract: "A dual-camera micro-UAV executing real-time onboard visual SLAM and lightweight YOLOv8 object detection on an NVIDIA Jetson companion computer for GPS-denied emergency payload delivery in mountainous terrain.",
    tech_stack: "ROS2 Humble, PX4 Autopilot, YOLOv8, Python, OpenCV",
    demo_url: "https://github.com/gvei-ai-ict/rescue-drone",
    github_url: "https://github.com/gvei-ai-ict/rescue-drone",
    image_url: "/img/nit.jpg",
    status: "Active"
  },
  {
    id: 2,
    title: "Kashur-LLM: Regional Multilingual Speech & Language Intelligence",
    category: "Generative AI & LLMs",
    lead_student: "Insha Farooq & Team Alpha",
    mentor_name: "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)",
    abstract: "Fine-tuned transformer model for bilingual Kashmiri and English acoustic speech transcription and translation, designed for local administrative, healthcare, and educational digitization.",
    tech_stack: "PyTorch, HuggingFace, Whisper, LoRA, FastAPI",
    demo_url: "https://github.com/gvei-ai-ict/kashur-llm",
    github_url: "https://github.com/gvei-ai-ict/kashur-llm",
    image_url: "/img/activity.jpg",
    status: "Active"
  },
  {
    id: 3,
    title: "Precision Orchard Microgrid & Canopy Telemetry Network",
    category: "Edge AI & IoT Hardware",
    lead_student: "Burhan Nazir",
    mentor_name: "Prof. Salman Ahmed",
    abstract: "Distributed solar-powered ESP32 and Coral TPU sensor nodes monitoring soil moisture, microclimate shifts, and early pest infestation in Kashmiri apple orchards via long-range LoRaWAN.",
    tech_stack: "ESP32-S3, Edge Impulse, LoRaWAN, InfluxDB, Grafana",
    demo_url: "https://github.com/gvei-ai-ict/orchard-telemetry",
    github_url: "https://github.com/gvei-ai-ict/orchard-telemetry",
    image_url: "/img/club.jpg",
    status: "Active"
  },
  {
    id: 4,
    title: "ZeroTrust-Sentinel: Autonomous Kernel Threat Telemetry",
    category: "Cyber & Quantum Systems",
    lead_student: "Faizan Rashid",
    mentor_name: "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)",
    abstract: "High-throughput network anomaly detector operating directly in kernel space with eBPF probes, converting socket flows into graph neural networks to neutralize covert DNS tunnels in sub-120ms.",
    tech_stack: "eBPF, BCC, PyTorch Geometric, Linux Kernel, Docker",
    demo_url: "https://github.com/gvei-ai-ict/zerotrust-sentinel",
    github_url: "https://github.com/gvei-ai-ict/zerotrust-sentinel",
    image_url: "/img/activity.jpg",
    status: "Active"
  }
];

export const initialDocuments = [
  {
    id: 1,
    title: "GVEI ICT Department Profile & Annual Action Plan 2026–2027",
    category: "Department Governance",
    file_name: "GVEI_ICT_Department_Profile_Annual_Action_Plan_2026-2027.pdf",
    file_url: "/docs/GVEI_ICT_Department_Profile_Annual_Action_Plan_2026-2027.pdf",
    file_size: "215 KB",
    version: "v2026-2027",
    description: "Official department mission, strategic vision, faculty directory, academic targets, and comprehensive annual action plan for sessions 2026–2027.",
    uploaded_by: "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)",
    is_confidential: false,
    downloads_count: 145
  },
  {
    id: 2,
    title: "ICT & AI Curriculum Planning & Syllabus Progress Track 2026–2027",
    category: "Curriculum & Syllabus",
    file_name: "GVEI_ICT_Curriculum_Planning_Syllabus_Progress_2026-2027.pdf",
    file_url: "/docs/GVEI_ICT_Curriculum_Planning_Syllabus_Progress_2026-2027.pdf",
    file_size: "178 KB",
    version: "v2026-2027",
    description: "Standardized scheme of study, module timelines, laboratory coursework schedules, and structured syllabus progression across academic terms.",
    uploaded_by: "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)",
    is_confidential: false,
    downloads_count: 220
  },
  {
    id: 3,
    title: "C.R.E.A.T.E. Competency-Driven Academic Framework 2026–2027",
    category: "Academic Guidelines",
    file_name: "GVEI_ICT_CREATE_Competency_Driven_Framework_2026-2027.pdf",
    file_url: "/docs/GVEI_ICT_CREATE_Competency_Driven_Framework_2026-2027.pdf",
    file_size: "241 KB",
    version: "v2026-2027",
    description: "Pedagogical competency matrix focusing on Critical thinking, Research, Engineering mindset, AI mastery, Teamwork, and Ethics.",
    uploaded_by: "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)",
    is_confidential: false,
    downloads_count: 180
  },
  {
    id: 4,
    title: "Departmental Pedagogical Practices & Instructional Framework 2026–2027",
    category: "Pedagogy & Teaching",
    file_name: "GVEI_ICT_Pedagogical_Practices_Framework_2026-2027.pdf",
    file_url: "/docs/GVEI_ICT_Pedagogical_Practices_Framework_2026-2027.pdf",
    file_size: "277 KB",
    version: "v2026-2027",
    description: "Modern instruction methodologies, active learning rubrics, experiential technology labs, and blended teaching guidelines.",
    uploaded_by: "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)",
    is_confidential: false,
    downloads_count: 115
  },
  {
    id: 5,
    title: "Lesson Plans, Classroom Practices & Teaching Innovations 2026–2027",
    category: "Lesson Plans & Practice",
    file_name: "GVEI_ICT_Lesson_Plans_Classroom_Practices_Teaching_Innovation_2026-2027.pdf",
    file_url: "/docs/GVEI_ICT_Lesson_Plans_Classroom_Practices_Teaching_Innovation_2026-2027.pdf",
    file_size: "230 KB",
    version: "v2026-2027",
    description: "Exemplary instructional units, interactive AI lab exercises, flipped classroom workflows, and continuous evaluation protocols.",
    uploaded_by: "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)",
    is_confidential: false,
    downloads_count: 164
  },
  {
    id: 6,
    title: "Assessment Matrix, Student Performance & Learning Outcomes 2026–2027",
    category: "Assessment & Evaluation",
    file_name: "GVEI_ICT_Assessment_Student_Performance_Learning_Outcomes_2026-2027.pdf",
    file_url: "/docs/GVEI_ICT_Assessment_Student_Performance_Learning_Outcomes_2026-2027.pdf",
    file_size: "202 KB",
    version: "v2026-2027",
    description: "Comprehensive grading criteria, formative vs summative evaluation weights, student learning outcome (SLO) benchmarks, and remedial support.",
    uploaded_by: "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)",
    is_confidential: false,
    downloads_count: 192
  },
  {
    id: 7,
    title: "Student Mentorship & Academic Concept Strengthening Protocol 2026–2027",
    category: "Student Mentorship",
    file_name: "GVEI_ICT_Student_Mentorship_Concept_Strengthening_2026-2027.pdf",
    file_url: "/docs/GVEI_ICT_Student_Mentorship_Concept_Strengthening_2026-2027.pdf",
    file_size: "257 KB",
    version: "v2026-2027",
    description: "One-on-one mentorship structures, technical doubt-clearing sessions, peer mentoring circles, and foundational concept reinforcement.",
    uploaded_by: "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)",
    is_confidential: false,
    downloads_count: 134
  },
  {
    id: 8,
    title: "AI Coding, Innovation & Enrichment Activities Portfolio 2026–2027",
    category: "Innovation & Activities",
    file_name: "GVEI_ICT_AI_Coding_Innovation_Enrichment_Activities_2026-2027 (1).pdf",
    file_url: "/docs/GVEI_ICT_AI_Coding_Innovation_Enrichment_Activities_2026-2027%20(1).pdf",
    file_size: "241 KB",
    version: "v2026-2027",
    description: "Annual calendar of student coding hackathons, robotics challenges, guest lectures from industry pioneers, and incubation showcases.",
    uploaded_by: "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)",
    is_confidential: false,
    downloads_count: 205
  },
  {
    id: 9,
    title: "Computer Laboratory Infrastructure & System Integration 2026–2027",
    category: "Lab Infrastructure",
    file_name: "GVEI_ICT_Computer_Laboratory_Infrastructure_Integration_2026-2027.pdf",
    file_url: "/docs/GVEI_ICT_Computer_Laboratory_Infrastructure_Integration_2026-2027.pdf",
    file_size: "259 KB",
    version: "v2026-2027",
    description: "Hardware specifications, high-performance GPU compute stations, network topology, lab safety SOPs, and system maintenance guidelines.",
    uploaded_by: "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)",
    is_confidential: false,
    downloads_count: 98
  },
  {
    id: 10,
    title: "Student Work Portfolios & Capstone Project Evidence 2026–2027",
    category: "Student Portfolios",
    file_name: "GVEI_ICT_Student_Work_Portfolios_Project_Evidence_2026-2027.pdf",
    file_url: "/docs/GVEI_ICT_Student_Work_Portfolios_Project_Evidence_2026-2027.pdf",
    file_size: "201 KB",
    version: "v2026-2027",
    description: "Documented artifacts, exemplar GitHub repositories, project poster presentations, and practical engineering solutions developed by students.",
    uploaded_by: "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)",
    is_confidential: false,
    downloads_count: 176
  },
  {
    id: 11,
    title: "Educator Professional Development & Competency Mapping 2026–2027",
    category: "Faculty Development",
    file_name: "GVEI_ICT_Educator_Professional_Development_Competency_Mapping_2026-2027.pdf",
    file_url: "/docs/GVEI_ICT_Educator_Professional_Development_Competency_Mapping_2026-2027.pdf",
    file_size: "238 KB",
    version: "v2026-2027",
    description: "Faculty upskilling programs, international AI certifications, research sabbatical policies, and pedagogy workshops.",
    uploaded_by: "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)",
    is_confidential: false,
    downloads_count: 89
  }
];

export const initialClubRegistrations = [
  {
    id: 1,
    user_name: "Zubair Ahmad",
    user_email: "student@dept.ai",
    year: "3rd Year",
    interests: "Computer Vision, Autonomous Drones, Edge AI",
    note: "Eager to collaborate on aerial robotics and NVIDIA Jetson edge inference pipelines.",
    status: "Approved",
    created_at: "2025-08-25"
  },
  {
    id: 2,
    user_name: "Aamir Hussain",
    user_email: "aamir@student.gvei.edu",
    year: "2nd Year",
    interests: "Generative AI, LLM Fine-tuning",
    note: "Interested in contributing to local language datasets and PyTorch models.",
    status: "Pending",
    created_at: "2025-09-02"
  }
];

export const initialParticipations = [
  {
    id: 1,
    user_id: 6,
    user_name: "Zubair Ahmad",
    activity_id: 3,
    activity_title: "Smart Valley 24-Hour AI Hackathon",
    proof: "https://drive.google.com/proof-certificate-hackathon.pdf",
    notes: "Won 1st prize with EdgeVision Orchard Drone",
    status: "Approved",
    created_at: "2025-10-13"
  }
];
