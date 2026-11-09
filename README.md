# AI & ICT Department Portal 🎓⚡

A modern, full-stack educational and departmental web portal for the **Department of Artificial Intelligence & Information and Communication Technology (AI & ICT)**. Built with **Flask**, **SQLite / Supabase PostgreSQL**, **Three.js**, and integrated **Generative AI** tools for student project mentorship, capstone proposal evaluation, and departmental resource governance.

---

## 🌟 Key Features

### 🏛️ 1. Departmental Showcase & Governance
- **Interactive Landing & Experience**: High-performance Three.js interactive 3D particle background and glassmorphic UI.
- **Academic Documents & Syllabi**: Access curriculum framework, action plans, lesson plans, lab infrastructure maps, and educator development guides.
- **Department Activities & News**: Interactive gallery of hackathons, workshops, and student exhibitions.

### 🤖 2. Generative AI Academic Tools
- **AI Capstone Proposal Reviewer**: Automated AI evaluation analyzing novelty, technical feasibility, methodology rigor, and dataset alignment.
- **AI Project Idea Generator**: Generates custom capstone and research ideas based on domain, target complexity, and preferred tech stack.
- **Multi-Provider AI Fallback**: Integrates with Groq, OpenAI, or local heuristic fallback models.

### 👥 3. Multi-Tier Role-Based Authentication & Dashboards
- **Student Portal**:
  - Profile management, capstone proposal submission, progress tracking, and mentorship messaging.
  - One-click registration for the **AI & Innovation Club**.
- **Faculty Portal**:
  - Review student capstone submissions, provide feedback, score proposals, and communicate directly with mentees.
- **Admin Portal**:
  - System-wide audit logs, user management, and club registration approvals.

### ☁️ 4. Hybrid Database Architecture
- **Dual Sync**: Operates seamlessly on local SQLite for offline/development environments and syncs directly with **Supabase PostgreSQL** in production.
- Full schema and migration scripts provided in [`supabase_schema.sql`](supabase_schema.sql).

---

## 🛠️ Tech Stack

- **Backend**: Python 3.10+, Flask, Jinja2
- **Frontend**: HTML5, Modern CSS (Glassmorphism, CSS Custom Properties), Vanilla JavaScript, Three.js
- **Database**: SQLite (Local Dev) & Supabase PostgreSQL (Cloud Production)
- **AI APIs**: Groq Cloud API, OpenAI API
- **Testing**: Python `unittest` suite covering all routes, authentication, and AI endpoints

---

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/Mehraj-U-Din-Mir/ai-ict-department-portal.git
cd ai-ict-department-portal
```

### 2. Create and Activate a Virtual Environment
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `.env` with your preferred credentials:
```env
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here

# Optional: Supabase credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key

# Optional: AI Provider keys
GROQ_API_KEY=your-groq-api-key
OPENAI_API_KEY=your-openai-api-key
```

### 5. Run the Application
```bash
python app.py
```
Open your browser and navigate to `http://127.0.0.1:5000`.

---

## 🧪 Running Automated Tests

Run the full end-to-end test suite:
```bash
python -m unittest test_features.py -v
```

---

## 📂 Project Structure

```text
ai_ict_flask_site/
├── app.py                   # Main Flask application & API routes
├── requirements.txt         # Python package dependencies
├── supabase_schema.sql      # Supabase/PostgreSQL database schema
├── test_features.py         # Unit & integration tests
├── .env.example             # Template environment variables
├── .gitignore               # Ignored files (secrets, databases, bytecode)
├── static/
│   ├── css/custom.css       # Core styling & glassmorphic themes
│   ├── js/                  # Interactive scripts & 3D canvas engine
│   ├── img/                 # Department logos, faculty, and gallery media
│   └── docs/                # Curriculum PDFs and action frameworks
└── templates/               # Jinja2 template views
    ├── base.html            # Base navigation & footer layout
    ├── index.html           # Portal homepage
    ├── ai_tools.html        # AI idea generator & proposal evaluator
    ├── student_dashboard.html
    ├── faculty_dashboard.html
    └── admin_dashboard.html
```

---

## 📄 License
This project is developed for educational and departmental administration purposes.
