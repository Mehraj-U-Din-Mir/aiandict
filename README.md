# AI & ICT Department Portal 🎓⚡ (React Edition)

A modern, highly robust full-stack single-page application (SPA) for the **Department of Artificial Intelligence & Information and Communication Technology (AI & ICT)** at Green Valley Educational Institute (GVEI).

Built with **React 18**, **Vite**, **Tailwind CSS**, and **Lucide Icons**, featuring complete departmental governance, capstone project evaluation, generative AI academic tools, virtual code laboratories, and multi-tier role-based authentication.

---

## 🌟 Key Architecture & Features

### 🏛️ 1. Department Showcase & Governance
- **Pristine Responsive UI**: Glassmorphic slate & neon aesthetic, fluid layout, accessible navigation, and micro-animations.
- **Academic Documents Archive**: Access all 11 official GVEI departmental PDFs (Curriculum, C.R.E.A.T.E. framework, Lesson Plans, Lab Infrastructure, Mentorship protocols) with download counters and quick previews.
- **Milestones & Achievements**: NIT AI Hackathon Trophy, IEEE Best Paper Awards, $50,000 AgroTech Innovation Grants.
- **Faculty Message Corner**: Real-time advisories, research announcements, and deadline alerts.

### 🤖 2. Generative AI Academic Tools
- **AI Capstone Proposal Evaluator**: Automated proposal audit evaluating novelty, technical feasibility, and methodology rigor with composite scoring out of 100 and rubric feedback.
- **AI Project Idea Generator**: Parameterized synthesizer creating customized capstone abstracts, benchmark dataset links, and novelty angles across 5 research domains.

### 💻 3. Virtual Code Laboratory
- **In-Browser Python & Edge AI Simulator**: Interactive code workspace with live terminal execution.
- **Pre-loaded Templates**: YOLOv8 Edge Vision Simulation, Transformer Self-Attention Tensor Mathematics, and eBPF Kernel Threat Telemetry.

### 👥 4. Multi-Tier Role-Based Dashboards
- **Student Dashboard**: Submit capstone abstracts, track supervisor review statuses, view scores and grades, check Innovation Club enrollment.
- **Faculty Dashboard**: Supervised proposal evaluation, rubric scoring (0–100), letter grading, written supervisor feedback, and notice publication.
- **Admin / HOD Dashboard**: System-wide telemetry (Total Projects, Students, Faculty, Club Members), feature/unfeature projects, user directory, club applications approval, and demo reset.
- **Quick Demo Sign-In**: 1-click preset logins for Student, Faculty, and Admin testing.

---

## 🛠️ Tech Stack

- **Framework**: React 18.3+ (Vite 6)
- **Styling**: Tailwind CSS + Custom Department Design System
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Data Layer**: Reactive React Context with LocalStorage persistence and initial seed state

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```
Creates an optimized, zero-error production bundle in `dist/`.

---

## 📂 Project Structure

```text
ai_ict_flask_site/
├── index.html                   # HTML entry point with font preloads
├── package.json                 # Node dependencies and build scripts
├── vite.config.js               # Vite + Tailwind configuration
├── tailwind.config.js           # Theme extensions and typography
├── public/                      # Static assets (images, logos, official PDFs)
│   ├── img/                     # Faculty, logos, gallery images
│   └── docs/                    # Official 2026-2027 departmental PDFs
└── src/
    ├── main.jsx                 # React root mount
    ├── App.jsx                  # Main application & routing table
    ├── index.css                # Tailwind directives & design system
    ├── data/
    │   └── initialData.js       # Master seed data (faithful replica from Flask)
    ├── context/
    │   ├── AuthContext.jsx      # Authentication & role management
    │   └── DataContext.jsx      # Reactive data store with CRUD & persistence
    ├── components/
    │   └── common/
    │       ├── Navbar.jsx       # Responsive header with role pill
    │       └── Footer.jsx       # Institutional footer & accreditation
    └── pages/
        ├── Home.jsx             # Department landing page
        ├── Projects.jsx         # Capstone project directory
        ├── ProjectDetail.jsx    # Individual project view
        ├── InnovationClub.jsx   # AI & Innovation Club showcases
        ├── ClubRegister.jsx     # Club registration form
        ├── Messages.jsx         # Faculty message corner
        ├── Activities.jsx       # Events, workshops & hackathons
        ├── Documents.jsx        # Protected official PDF archive
        ├── AiTools.jsx          # AI Evaluator & Idea Generator
        ├── VirtualLab.jsx       # Interactive Python code runtime
        ├── Search.jsx           # Unified global search index
        ├── auth/
        │   ├── Login.jsx        # Multi-role authentication & quick demo fill
        │   └── Register.jsx     # Student onboarding form
        └── dashboards/
            ├── StudentDashboard.jsx
            ├── FacultyDashboard.jsx
            └── AdminDashboard.jsx
```

---

## 📄 License
Department of AI & ICT, Green Valley Educational Institute (GVEI).
