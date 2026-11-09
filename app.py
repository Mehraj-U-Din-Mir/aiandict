from flask import Flask, render_template, request, jsonify, redirect, url_for, session, g, flash
import sqlite3, os, json, random, re
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

# Load environment variables from .env if present
env_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                k = k.strip()
                v = v.strip().strip("'\"")
                if k and k not in os.environ:
                    os.environ[k] = v

try:
    from supabase import create_client, Client
    SUPABASE_LIB_AVAILABLE = True
except ImportError:
    SUPABASE_LIB_AVAILABLE = False

def get_supabase():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if SUPABASE_LIB_AVAILABLE and url and key and len(url) > 10 and len(key) > 10:
        try:
            return create_client(url, key)
        except Exception:
            return None
    return None

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "5140638ff58f8fba23a7802f73bb8f8e")
app.config["DATABASE"] = os.path.join(app.root_path, "app.db")

# -----------------------------------------------------------------------------
# Database Connection
# -----------------------------------------------------------------------------
def get_db():
    db = getattr(g, "_db", None)
    if db is None:
        db = g._db = sqlite3.connect(app.config["DATABASE"])
        db.row_factory = sqlite3.Row
        db.execute("PRAGMA foreign_keys = ON")
    return db

@app.teardown_appcontext
def close_db(exception):
    db = getattr(g, "_db", None)
    if db is not None:
        db.close()

# -----------------------------------------------------------------------------
# Role & Auth Decorators
# -----------------------------------------------------------------------------
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user" not in session:
            flash("Please log in to access this page.", "warning")
            return redirect(url_for("student_login"))
        return f(*args, **kwargs)
    return decorated_function

def faculty_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user" not in session or session["user"]["role"] not in ("faculty", "admin"):
            flash("Faculty access credentials required.", "warning")
            return redirect(url_for("faculty_login"))
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user" not in session or session["user"]["role"] != "admin":
            flash("Department Administrator privileges required.", "danger")
            return redirect(url_for("admin_login"))
        return f(*args, **kwargs)
    return decorated_function

# -----------------------------------------------------------------------------
# Dynamic Departmental Documents Sync (static/docs/ <-> departmental_documents)
# -----------------------------------------------------------------------------
def sync_departmental_documents_folder(db=None):
    """
    Dynamically scans static/docs/ on disk, prunes database rows for removed files,
    and upserts all current and newly added PDF documents with accurate file sizes,
    rich titles, classifications, and URL encodings.
    Ensures zero staleness locally and when deployed to production.
    """
    import urllib.parse
    close_db = False
    if db is None:
        db = sqlite3.connect(app.config["DATABASE"])
        db.row_factory = sqlite3.Row
        close_db = True

    docs_dir = os.path.join(app.root_path, "static", "docs")
    if not os.path.exists(docs_dir):
        os.makedirs(docs_dir, exist_ok=True)
        if close_db:
            db.close()
        return

    # List current valid PDF documents on disk
    disk_files = [f for f in os.listdir(docs_dir) if f.lower().endswith(".pdf")]

    # 1. Prune database records pointing to files that no longer exist on disk
    if disk_files:
        placeholders = ",".join("?" for _ in disk_files)
        db.execute(f"DELETE FROM departmental_documents WHERE file_name NOT IN ({placeholders})", disk_files)
    else:
        db.execute("DELETE FROM departmental_documents")

    # 2. Curated metadata mapping for official GVEI department documents
    curated_meta = {
        "GVEI_ICT_Department_Profile_Annual_Action_Plan_2026-2027.pdf": {
            "title": "GVEI ICT Department Profile & Annual Action Plan 2026–2027",
            "category": "Department Governance",
            "version": "v2026-2027",
            "description": "Official department mission, strategic vision, faculty directory, academic targets, and comprehensive annual action plan for sessions 2026–2027.",
            "uploaded_by": "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)"
        },
        "GVEI_ICT_Curriculum_Planning_Syllabus_Progress_2026-2027.pdf": {
            "title": "ICT & AI Curriculum Planning & Syllabus Progress Track 2026–2027",
            "category": "Curriculum & Syllabus",
            "version": "v2026-2027",
            "description": "Standardized scheme of study, module timelines, laboratory coursework schedules, and structured syllabus progression across academic terms.",
            "uploaded_by": "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)"
        },
        "GVEI_ICT_CREATE_Competency_Driven_Framework_2026-2027.pdf": {
            "title": "C.R.E.A.T.E. Competency-Driven Academic Framework 2026–2027",
            "category": "Academic Guidelines",
            "version": "v2026-2027",
            "description": "Pedagogical competency matrix focusing on Critical thinking, Research, Engineering mindset, AI mastery, Teamwork, and Ethics.",
            "uploaded_by": "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)"
        },
        "GVEI_ICT_Pedagogical_Practices_Framework_2026-2027.pdf": {
            "title": "Departmental Pedagogical Practices & Instructional Framework 2026–2027",
            "category": "Pedagogy & Teaching",
            "version": "v2026-2027",
            "description": "Modern instruction methodologies, active learning rubrics, experiential technology labs, and blended teaching guidelines.",
            "uploaded_by": "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)"
        },
        "GVEI_ICT_Lesson_Plans_Classroom_Practices_Teaching_Innovation_2026-2027.pdf": {
            "title": "Lesson Plans, Classroom Practices & Teaching Innovations 2026–2027",
            "category": "Lesson Plans & Practice",
            "version": "v2026-2027",
            "description": "Exemplary instructional units, interactive AI lab exercises, flipped classroom workflows, and continuous evaluation protocols.",
            "uploaded_by": "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)"
        },
        "GVEI_ICT_Assessment_Student_Performance_Learning_Outcomes_2026-2027.pdf": {
            "title": "Assessment Matrix, Student Performance & Learning Outcomes 2026–2027",
            "category": "Assessment & Evaluation",
            "version": "v2026-2027",
            "description": "Comprehensive grading criteria, formative vs summative evaluation weights, student learning outcome (SLO) benchmarks, and remedial support.",
            "uploaded_by": "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)"
        },
        "GVEI_ICT_Student_Mentorship_Concept_Strengthening_2026-2027.pdf": {
            "title": "Student Mentorship & Academic Concept Strengthening Protocol 2026–2027",
            "category": "Student Mentorship",
            "version": "v2026-2027",
            "description": "One-on-one mentorship structures, technical doubt-clearing sessions, peer mentoring circles, and foundational concept reinforcement.",
            "uploaded_by": "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)"
        },
        "GVEI_ICT_AI_Coding_Innovation_Enrichment_Activities_2026-2027 (1).pdf": {
            "title": "AI Coding, Innovation & Enrichment Activities Portfolio 2026–2027",
            "category": "Innovation & Activities",
            "version": "v2026-2027",
            "description": "Annual calendar of student coding hackathons, robotics challenges, guest lectures from industry pioneers, and incubation showcases.",
            "uploaded_by": "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)"
        },
        "GVEI_ICT_Computer_Laboratory_Infrastructure_Integration_2026-2027.pdf": {
            "title": "Computer Laboratory Infrastructure & System Integration 2026–2027",
            "category": "Lab Infrastructure",
            "version": "v2026-2027",
            "description": "Hardware specifications, high-performance GPU compute stations, network topology, lab safety SOPs, and system maintenance guidelines.",
            "uploaded_by": "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)"
        },
        "GVEI_ICT_Student_Work_Portfolios_Project_Evidence_2026-2027.pdf": {
            "title": "Student Work Portfolios & Capstone Project Evidence 2026–2027",
            "category": "Student Portfolios",
            "version": "v2026-2027",
            "description": "Documented artifacts, exemplar GitHub repositories, project poster presentations, and practical engineering solutions developed by students.",
            "uploaded_by": "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)"
        },
        "GVEI_ICT_Educator_Professional_Development_Competency_Mapping_2026-2027.pdf": {
            "title": "Educator Professional Development & Competency Mapping 2026–2027",
            "category": "Faculty Development",
            "version": "v2026-2027",
            "description": "Faculty upskilling programs, international AI certifications, research sabbatical policies, and pedagogy workshops.",
            "uploaded_by": "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)"
        }
    }

    # 3. Upsert each file on disk
    for fname in sorted(disk_files):
        fpath = os.path.join(docs_dir, fname)
        try:
            sz = os.path.getsize(fpath)
            if sz >= 1024 * 1024:
                file_size_str = f"{sz / (1024 * 1024):.1f} MB"
            else:
                file_size_str = f"{max(1, round(sz / 1024))} KB"
        except Exception:
            file_size_str = "250 KB"

        # Quoted URL ensures spaces, brackets, etc. load cleanly in all browsers
        encoded_name = urllib.parse.quote(fname)
        file_url = f"/static/docs/{encoded_name}"

        meta = curated_meta.get(fname, {})
        title = meta.get("title")
        if not title:
            # Intelligent fallback for any newly added file
            base_clean = os.path.splitext(fname)[0]
            base_clean = re.sub(r"\s*\(\d+\)$", "", base_clean)
            words = [w.strip() for w in base_clean.replace("_", " ").replace("-", " ").split() if w.strip()]
            title = " ".join(words).title()

        category = meta.get("category")
        if not category:
            low = fname.lower()
            if "curriculum" in low or "syllabus" in low:
                category = "Curriculum & Syllabus"
            elif "guideline" in low or "framework" in low:
                category = "Academic Guidelines"
            elif "lab" in low or "infra" in low:
                category = "Lab Infrastructure"
            elif "mentor" in low:
                category = "Student Mentorship"
            elif "portfolio" in low or "project" in low:
                category = "Student Portfolios"
            elif "lesson" in low or "practice" in low:
                category = "Lesson Plans & Practice"
            elif "assess" in low:
                category = "Assessment & Evaluation"
            elif "enrich" in low or "activity" in low or "innovation" in low:
                category = "Innovation & Activities"
            else:
                category = "Departmental Archive"

        version = meta.get("version", "v2026-2027")
        description = meta.get("description", f"Official departmental documentation for {title}.")
        uploaded_by = meta.get("uploaded_by", "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)")

        existing = db.execute("SELECT id FROM departmental_documents WHERE file_name = ?", (fname,)).fetchone()
        if existing:
            db.execute("""
                UPDATE departmental_documents
                SET title = ?, category = ?, file_url = ?, file_size = ?, version = ?, description = ?, uploaded_by = ?
                WHERE id = ?
            """, (title, category, file_url, file_size_str, version, description, uploaded_by, existing["id"]))
        else:
            db.execute("""
                INSERT INTO departmental_documents (title, category, file_name, file_url, file_size, version, description, uploaded_by, is_confidential, downloads_count)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0)
            """, (title, category, fname, file_url, file_size_str, version, description, uploaded_by))

    db.commit()
    if close_db:
        db.close()

# -----------------------------------------------------------------------------
# Database Schema Initialization & Safe Migration
# -----------------------------------------------------------------------------
def init_db():
    db = get_db()
    
    # Base tables
    db.executescript("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'student',
        status TEXT NOT NULL DEFAULT 'Approved',
        designation TEXT DEFAULT 'Student',
        department TEXT DEFAULT 'AI & ICT Department',
        specialization TEXT DEFAULT 'Artificial Intelligence',
        phone TEXT,
        avatar TEXT DEFAULT '/static/img/default-avatar.png',
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        date TEXT,
        category TEXT DEFAULT 'Workshop',
        location TEXT DEFAULT 'AI Lab / Seminar Hall',
        description TEXT,
        image_url TEXT
    );

    CREATE TABLE IF NOT EXISTS participations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        activity_id INTEGER NOT NULL,
        proof TEXT NOT NULL,
        notes TEXT,
        status TEXT NOT NULL DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(activity_id) REFERENCES activities(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS club_registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        year TEXT,
        interests TEXT,
        note TEXT,
        status TEXT NOT NULL DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'Hackathon',
        badge TEXT DEFAULT 'Milestone',
        date TEXT,
        description TEXT NOT NULL,
        image_url TEXT DEFAULT '/static/img/nit.jpg',
        is_featured INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        faculty_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT DEFAULT 'Announcement',
        priority TEXT DEFAULT 'Normal',
        is_active INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(faculty_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        abstract TEXT NOT NULL,
        tech_stack TEXT,
        github_url TEXT,
        demo_url TEXT,
        document_url TEXT,
        student_id INTEGER NOT NULL,
        faculty_id INTEGER,
        status TEXT NOT NULL DEFAULT 'Pending',
        feedback TEXT,
        score INTEGER DEFAULT 0,
        is_featured INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(faculty_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS innovation_club_showcases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        lead_student TEXT NOT NULL,
        mentor_name TEXT DEFAULT 'Er. Mehraj U Din Mir (HOD AI&ICT GVEI)',
        abstract TEXT NOT NULL,
        tech_stack TEXT,
        demo_url TEXT,
        github_url TEXT,
        image_url TEXT DEFAULT '/static/img/club.jpg',
        status TEXT DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS virtual_lab_projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        language TEXT NOT NULL DEFAULT 'python',
        shared_faculty_id INTEGER DEFAULT NULL,
        share_status TEXT NOT NULL DEFAULT 'Draft',
        submission_notes TEXT DEFAULT NULL,
        faculty_feedback TEXT,
        faculty_grade TEXT,
        submitted_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(shared_faculty_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS virtual_lab_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        folder_path TEXT NOT NULL DEFAULT '/',
        content TEXT DEFAULT '',
        is_folder INTEGER NOT NULL DEFAULT 0,
        file_type TEXT DEFAULT 'python',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(project_id) REFERENCES virtual_lab_projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS departmental_documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_url TEXT NOT NULL,
        file_size TEXT DEFAULT '1.2 MB',
        version TEXT DEFAULT 'v1.0',
        description TEXT,
        uploaded_by TEXT DEFAULT 'Er. Mehraj U Din Mir (HOD AI&ICT GVEI)',
        is_confidential INTEGER DEFAULT 0,
        downloads_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Safe column checks for pre-existing users table
    cursor = db.cursor()
    cursor.execute("PRAGMA table_info(users)")
    existing_cols = [c[1] for c in cursor.fetchall()]
    new_cols = {
        "status": "TEXT NOT NULL DEFAULT 'Approved'",
        "designation": "TEXT DEFAULT 'Student'",
        "department": "TEXT DEFAULT 'AI & ICT Department, GVEI'",
        "specialization": "TEXT DEFAULT 'Artificial Intelligence & ICT'",
        "phone": "TEXT",
        "avatar": "TEXT DEFAULT '/static/img/default-avatar.png'",
        "bio": "TEXT",
        "created_at": "TEXT",
        "class_name": "TEXT DEFAULT ''",
        "roll_no": "TEXT DEFAULT ''",
        "section": "TEXT DEFAULT ''",
        "whatsapp_no": "TEXT DEFAULT ''",
        "qualification": "TEXT DEFAULT ''",
        "experience": "TEXT DEFAULT ''",
        "office_room": "TEXT DEFAULT ''",
        "linkedin_url": "TEXT DEFAULT ''",
        "github_url": "TEXT DEFAULT ''"
    }
    for col, col_def in new_cols.items():
        if col not in existing_cols:
            try:
                db.execute(f"ALTER TABLE users ADD COLUMN {col} {col_def}")
            except Exception:
                pass

    # Safe column checks for projects table
    cursor.execute("PRAGMA table_info(projects)")
    existing_proj_cols = [c[1] for c in cursor.fetchall()]
    new_proj_cols = {
        "score_innovation": "INTEGER DEFAULT 0",
        "score_technical": "INTEGER DEFAULT 0",
        "score_presentation": "INTEGER DEFAULT 0",
        "grade": "TEXT DEFAULT 'Pending'",
        "methodology": "TEXT",
        "architecture_diagram": "TEXT"
    }
    for col, col_def in new_proj_cols.items():
        if col not in existing_proj_cols:
            try:
                db.execute(f"ALTER TABLE projects ADD COLUMN {col} {col_def}")
            except Exception:
                pass

    # Safe column checks for participations table
    cursor.execute("PRAGMA table_info(participations)")
    existing_part_cols = [c[1] for c in cursor.fetchall()]
    new_part_cols = {
        "verifier_notes": "TEXT",
        "verified_by": "INTEGER"
    }
    for col, col_def in new_part_cols.items():
        if col not in existing_part_cols:
            try:
                db.execute(f"ALTER TABLE participations ADD COLUMN {col} {col_def}")
            except Exception:
                pass

    # Safe column checks for virtual_lab_projects table
    cursor.execute("PRAGMA table_info(virtual_lab_projects)")
    existing_vlab_cols = [c[1] for c in cursor.fetchall()]
    new_vlab_cols = {
        "submission_notes": "TEXT DEFAULT NULL"
    }
    for col, col_def in new_vlab_cols.items():
        if col not in existing_vlab_cols:
            try:
                db.execute(f"ALTER TABLE virtual_lab_projects ADD COLUMN {col} {col_def}")
            except Exception:
                pass

    # 1. Primary Department Administrator (adminaiict@gvei.com / Admin@gveiAIICT@Mehraj123)
    admin_primary_email = "adminaiict@gvei.com"
    cur = db.execute("SELECT id FROM users WHERE LOWER(email)=?", (admin_primary_email.lower(),))
    existing_admin = cur.fetchone()
    if existing_admin is None:
        db.execute("""
            INSERT INTO users (name, email, password_hash, role, status, designation, department, specialization, phone, whatsapp_no, avatar, bio)
            VALUES (?, ?, ?, 'admin', 'Approved', ?, ?, ?, ?, ?, ?, ?)
        """, (
            "Er. Mehraj U Din Mir",
            admin_primary_email,
            generate_password_hash("Admin@gveiAIICT@Mehraj123"),
            "HOD AI & ICT GVEI",
            "Department of AI & ICT, Green Valley Educational Institute (GVEI)",
            "Artificial Intelligence, Deep Learning & ICT Systems",
            "+91-94190-00000",
            "+91-94190-00000",
            "/static/img/mehraj.png",
            "Head of the Department of Artificial Intelligence & ICT at Green Valley Educational Institute (GVEI). Driving cutting-edge AI research, edge computing, robotics, and academic innovation."
        ))
    else:
        db.execute("""
            UPDATE users SET 
                name='Er. Mehraj U Din Mir',
                password_hash=?,
                role='admin',
                status='Approved',
                designation='HOD AI & ICT GVEI',
                department='Department of AI & ICT, Green Valley Educational Institute (GVEI)',
                avatar='/static/img/mehraj.png',
                phone='+91-94190-00000',
                whatsapp_no='+91-94190-00000'
            WHERE id=?
        """, (generate_password_hash("Admin@gveiAIICT@Mehraj123"), existing_admin["id"]))

    # 2. Legacy / test admin account for automated tests
    cur_test = db.execute("SELECT id FROM users WHERE email=?", ("admin@dept.ai",))
    if cur_test.fetchone() is None:
        db.execute("""
            INSERT INTO users (name, email, password_hash, role, status, designation, department, specialization, bio)
            VALUES (?, ?, ?, 'admin', 'Approved', ?, ?, ?, ?)
        """, (
            "Department Administrator",
            "admin@dept.ai",
            generate_password_hash("admin123"),
            "Administrator",
            "AI & ICT Department, GVEI",
            "Department Governance",
            "Supervising departmental academic excellence and student project mentorship."
        ))

    # 3. Ensure Lead Faculty account exists (Er. Mehraj U Din Mir)
    cur = db.execute("SELECT id FROM users WHERE email=?", ("mehraj@dept.ai",))
    if cur.fetchone() is None:
        db.execute("""
            INSERT INTO users (name, email, password_hash, role, status, designation, department, specialization, phone, whatsapp_no, avatar, bio)
            VALUES (?, ?, ?, 'faculty', 'Approved', ?, ?, ?, ?, ?, ?, ?)
        """, (
            "Er. Mehraj U Din Mir",
            "mehraj@dept.ai",
            generate_password_hash("faculty123"),
            "HOD AI & ICT GVEI",
            "Department of AI & ICT, Green Valley Educational Institute (GVEI)",
            "Computer Vision, Deep Learning, MLOps",
            "+91-94190-00000",
            "+91-94190-00000",
            "/static/img/mehraj.png",
            'HOD AI & ICT at GVEI — Empowering the youth from the Valley of Kashmir to the global frontiers of Artificial Intelligence Innovation.'
        ))

    # 4. Seed additional faculty if only 1 exists
    cur = db.execute("SELECT COUNT(*) FROM users WHERE role='faculty'")
    if cur.fetchone()[0] < 3:
        faculty_samples = [
            ("Prof. Salman Ahmed", "salman@dept.ai", "Associate Professor", "IoT & Embedded Systems", "Specialist in edge compute devices, smart sensor networks, and autonomous robotics."),
            ("Engr. Zara Malik", "zara@dept.ai", "Assistant Professor", "AI Ethics & Trustworthy AI", "Focusing on explainable AI, ethical algorithmic governance, and responsible LLM deployment.")
        ]
        for name, email, desig, spec, bio in faculty_samples:
            if not db.execute("SELECT id FROM users WHERE email=?", (email,)).fetchone():
                db.execute("""
                    INSERT INTO users (name, email, password_hash, role, status, designation, department, specialization, bio)
                    VALUES (?, ?, ?, 'faculty', 'Approved', ?, 'AI & ICT Department, GVEI', ?, ?)
                """, (name, email, generate_password_hash("faculty123"), desig, spec, bio))

    # 5. Seed Innovation Club Showcases if empty
    if db.execute("SELECT COUNT(*) FROM innovation_club_showcases").fetchone()[0] == 0:
        db.executemany("""
            INSERT INTO innovation_club_showcases (title, category, lead_student, mentor_name, abstract, tech_stack, demo_url, github_url, image_url, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')
        """, [
            (
                "Autonomous Multi-Rotor Search & Rescue UAV",
                "Robotics & Autonomous Systems",
                "Zubair Ahmad & Team Fikr",
                "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)",
                "A dual-camera micro-UAV executing real-time onboard visual SLAM and lightweight YOLOv8 object detection on an NVIDIA Jetson companion computer for GPS-denied emergency payload delivery in mountainous terrain.",
                "ROS2 Humble, PX4 Autopilot, YOLOv8, Python, OpenCV",
                "https://github.com/gvei-ai-ict/rescue-drone",
                "https://github.com/gvei-ai-ict/rescue-drone",
                "/static/img/nit.jpg"
            ),
            (
                "Kashur-LLM: Regional Multilingual Speech & Language Intelligence",
                "Generative AI & LLMs",
                "Insha Farooq & Team Alpha",
                "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)",
                "Fine-tuned transformer model for bilingual Kashmiri and English acoustic speech transcription and translation, designed for local administrative, healthcare, and educational digitization.",
                "PyTorch, HuggingFace, Whisper, LoRA, FastAPI",
                "https://github.com/gvei-ai-ict/kashur-llm",
                "https://github.com/gvei-ai-ict/kashur-llm",
                "/static/img/activity.jpg"
            ),
            (
                "Precision Orchard Microgrid & Canopy Telemetry Network",
                "Edge AI & IoT Hardware",
                "Burhan Nazir",
                "Prof. Salman Ahmed",
                "Distributed solar-powered ESP32 and Coral TPU sensor nodes monitoring soil moisture, microclimate shifts, and early pest infestation in Kashmiri apple orchards via long-range LoRaWAN.",
                "ESP32-S3, Edge Impulse, LoRaWAN, InfluxDB, Grafana",
                "https://github.com/gvei-ai-ict/orchard-telemetry",
                "https://github.com/gvei-ai-ict/orchard-telemetry",
                "/static/img/club.jpg"
            ),
            (
                "ZeroTrust-Sentinel: Autonomous Kernel Threat Telemetry",
                "Cyber & Quantum Systems",
                "Faizan Rashid",
                "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)",
                "High-throughput network anomaly detector operating directly in kernel space with eBPF probes, converting socket flows into graph neural networks to neutralize covert DNS tunnels in sub-120ms.",
                "eBPF, BCC, PyTorch Geometric, Linux Kernel, Docker",
                "https://github.com/gvei-ai-ict/zerotrust-sentinel",
                "https://github.com/gvei-ai-ict/zerotrust-sentinel",
                "/static/img/activity.jpg"
            )
        ])

    # 6. Seed Default Activities if empty
    if db.execute("SELECT COUNT(*) FROM activities").fetchone()[0] == 0:
        db.executemany("""
            INSERT INTO activities (title, date, category, location, description, image_url)
            VALUES (?, ?, ?, ?, ?, ?)
        """, [
            ("AI Orientation & Generative AI Workshop", "2025-08-20", "Workshop", "Auditorium Hall, GVEI", "Comprehensive orientation for freshmen featuring hands-on Prompt Engineering & Generative AI models.", "/static/img/activity.jpg"),
            ("NLP & Transformers Hands-On Bootcamp", "2025-09-02", "Bootcamp", "AI Compute Lab, GVEI", "Intensive multi-day bootcamp building custom Transformer architectures and LLM fine-tuning pipelines.", "/static/img/activity.jpg"),
            ("Smart Valley 24-Hour AI Hackathon", "2025-10-12", "Hackathon", "Main Tech Hub, GVEI", "Annual regional hackathon solving regional real-world challenges in agriculture, healthcare, and education.", "/static/img/nit.jpg")
        ])

    # 7. Seed Default Achievements if empty
    if db.execute("SELECT COUNT(*) FROM achievements").fetchone()[0] == 0:
        db.executemany("""
            INSERT INTO achievements (title, category, badge, date, description, image_url, is_featured)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, [
            (
                "NIT AI Hackathon Winners",
                "Hackathon",
                "First Place National Trophy",
                "2025-05-18",
                'Our student team "Fikr Fusion", mentored by Er. Mehraj U Din Mir, secured 1st place at the NIT AI Hackathon 2025 organized by CodeDay Kashmir, competing against 25+ top educational institutions.',
                "/static/img/nit.jpg",
                1
            ),
            (
                "Best Research Paper Award (IEEE)",
                "Research",
                "IEEE Best Paper Award",
                "2025-03-12",
                "Recognized internationally for groundbreaking work in Lightweight Transformer Architectures for Edge Devices and IoT Sensor Networks.",
                "/static/img/activity.jpg",
                1
            ),
            (
                "AI AgroTech Innovation Grant ($50,000)",
                "Grant",
                "Innovation Research Grant",
                "2025-01-20",
                "Secured a $50,000 research and commercialization grant to build autonomous drone-based computer vision for precision apple orchard yield forecasting in Kashmir.",
                "/static/img/club.jpg",
                1
            )
        ])

    # 8. Seed Default Messages from Faculty if empty
    if db.execute("SELECT COUNT(*) FROM messages").fetchone()[0] == 0:
        fac = db.execute("SELECT id FROM users WHERE role='faculty' OR role='admin' LIMIT 1").fetchone()
        if fac:
            db.execute("""
                INSERT INTO messages (faculty_id, title, content, category, priority, is_active)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                fac["id"],
                "Welcome to Autumn Project Submissions & Capstone Mentorship",
                "Dear students, the departmental project submission portal is now officially open! All students must submit their project abstracts and select a faculty supervisor. Please visit the Student Corner to submit your proposals.",
                "Announcement",
                "Important",
                1
            ))

    # 9. Seed Sample Approved Project if empty
    if db.execute("SELECT COUNT(*) FROM projects").fetchone()[0] == 0:
        student = db.execute("SELECT id FROM users WHERE role='student' LIMIT 1").fetchone()
        faculty = db.execute("SELECT id FROM users WHERE role='faculty' OR role='admin' LIMIT 1").fetchone()
        if student and faculty:
            db.execute("""
                INSERT INTO projects (title, category, abstract, tech_stack, github_url, demo_url, student_id, faculty_id, status, feedback, score, is_featured)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                "Kashmir Orchard Vision: Automated Apple Disease Detection",
                "Computer Vision",
                "An end-to-end edge AI system combining YOLOv8 and EfficientNet to diagnose 12 distinct foliar apple tree diseases in real-time under natural outdoor lighting conditions.",
                "Python, YOLOv8, PyTorch, Flask, OpenCV",
                "https://github.com/example/orchard-vision",
                "https://orchard-vision-demo.local",
                student["id"],
                faculty["id"],
                "Approved",
                "Outstanding methodology, high validation accuracy, and excellent field testing in local orchards.",
                96,
                1
            ))

    # 10. Dynamically synchronize official PDF documents from static/docs/
    sync_departmental_documents_folder(db)

    db.commit()

@app.before_request
def before_req():
    init_db()

@app.context_processor
def inject_global_data():
    try:
        db = get_db()
        announcements_count = db.execute("SELECT COUNT(*) FROM messages WHERE is_active=1").fetchone()[0]
        recent_announcements = db.execute("""
            SELECT m.*, u.name as faculty_name, u.avatar as faculty_avatar
            FROM messages m
            JOIN users u ON u.id = m.faculty_id
            WHERE m.is_active = 1
            ORDER BY m.id DESC LIMIT 15
        """).fetchall()
        innovation_count = db.execute("SELECT COUNT(*) FROM innovation_club_showcases WHERE status='Active'").fetchone()[0]
        return {
            "global_announcements_count": announcements_count,
            "global_recent_announcements": recent_announcements,
            "global_innovation_count": innovation_count
        }
    except Exception:
        return {
            "global_announcements_count": 0,
            "global_recent_announcements": [],
            "global_innovation_count": 0
        }

# -----------------------------------------------------------------------------
# Public & Landing Page Routes
# -----------------------------------------------------------------------------
@app.route("/")
def index():
    db = get_db()
    
    # Dynamic Achievements (managed from Admin)
    achievements = db.execute("""
        SELECT * FROM achievements 
        WHERE is_featured = 1 
        ORDER BY id DESC
    """).fetchall()

    # Dynamic Message Corner (managed from Faculty)
    messages = db.execute("""
        SELECT m.*, u.name as faculty_name, u.designation as faculty_designation, u.avatar as faculty_avatar
        FROM messages m
        JOIN users u ON u.id = m.faculty_id
        WHERE m.is_active = 1
        ORDER BY m.id DESC
        LIMIT 6
    """).fetchall()

    # Dynamic Faculty Showcase (managed from Admin)
    faculty_members = db.execute("""
        SELECT id, name, email, designation, specialization, avatar, bio, phone, whatsapp_no, qualification, experience, office_room
        FROM users
        WHERE role IN ('faculty', 'admin') AND status = 'Approved'
        ORDER BY CASE WHEN role='admin' THEN 0 ELSE 1 END, id ASC
    """).fetchall()

    # Dynamic Featured Projects (approved by Faculty/Admin)
    featured_projects = db.execute("""
        SELECT p.*, s.name as student_name, f.name as faculty_name
        FROM projects p
        JOIN users s ON s.id = p.student_id
        LEFT JOIN users f ON f.id = p.faculty_id
        WHERE p.status = 'Approved'
        ORDER BY p.is_featured DESC, p.id DESC
        LIMIT 6
    """).fetchall()

    # Dynamic Innovation Club Showcases
    innovation_showcases = db.execute("""
        SELECT * FROM innovation_club_showcases
        WHERE status = 'Active'
        ORDER BY id DESC LIMIT 4
    """).fetchall()

    # Metrics Counters
    stats = {
        "students": db.execute("SELECT COUNT(*) FROM users WHERE role='student'").fetchone()[0],
        "faculty": db.execute("SELECT COUNT(*) FROM users WHERE role IN ('faculty', 'admin')").fetchone()[0],
        "projects": db.execute("SELECT COUNT(*) FROM projects WHERE status='Approved'").fetchone()[0],
        "achievements": db.execute("SELECT COUNT(*) FROM achievements").fetchone()[0],
        "innovation_count": len(innovation_showcases)
    }

    return render_template(
        "index.html",
        achievements=achievements,
        messages=messages,
        faculty_members=faculty_members,
        featured_projects=featured_projects,
        innovation_showcases=innovation_showcases,
        stats=stats
    )

@app.route("/innovation-club")
def innovation_club():
    db = get_db()
    showcases = db.execute("SELECT * FROM innovation_club_showcases WHERE status='Active' ORDER BY id DESC").fetchall()
    club_members_count = db.execute("SELECT COUNT(*) FROM club_registrations").fetchone()[0]
    total_projects = db.execute("SELECT COUNT(*) FROM projects WHERE status='Approved'").fetchone()[0]
    faculty_mentors = db.execute("SELECT * FROM users WHERE role IN ('faculty', 'admin') ORDER BY CASE WHEN role='admin' THEN 0 ELSE 1 END, id ASC").fetchall()
    
    return render_template(
        "innovation_club.html",
        showcases=showcases,
        club_members_count=club_members_count,
        total_projects=total_projects,
        faculty_mentors=faculty_mentors
    )

@app.route("/projects")
def projects_showcase():
    db = get_db()
    category = request.args.get("category", "")
    query = request.args.get("q", "")

    sql = """
        SELECT p.*, s.name as student_name, f.name as faculty_name
        FROM projects p
        JOIN users s ON s.id = p.student_id
        LEFT JOIN users f ON f.id = p.faculty_id
        WHERE p.status = 'Approved'
    """
    params = []
    if category:
        sql += " AND p.category = ?"
        params.append(category)
    if query:
        sql += " AND (p.title LIKE ? OR p.abstract LIKE ? OR p.tech_stack LIKE ?)"
        params.extend([f"%{query}%", f"%{query}%", f"%{query}%"])
    sql += " ORDER BY p.id DESC"

    projects = db.execute(sql, params).fetchall()
    return render_template("projects.html", projects=projects, active_category=category, search_query=query)

@app.route("/project/<int:project_id>")
def project_detail(project_id):
    db = get_db()
    project = db.execute("""
        SELECT p.*, s.name as student_name, s.email as student_email, s.avatar as student_avatar,
               f.name as faculty_name, f.designation as faculty_designation, f.avatar as faculty_avatar, f.email as faculty_email
        FROM projects p
        JOIN users s ON s.id = p.student_id
        LEFT JOIN users f ON f.id = p.faculty_id
        WHERE p.id = ?
    """, (project_id,)).fetchone()

    if not project:
        flash("The requested capstone project could not be found.", "warning")
        return redirect(url_for("projects_showcase"))

    # If project is not approved, only author, faculty, or admin can access
    if project["status"] != "Approved":
        current_user = session.get("user")
        if not current_user or (current_user["role"] not in ("faculty", "admin") and current_user["id"] != project["student_id"]):
            flash("This project proposal is currently undergoing faculty review.", "info")
            return redirect(url_for("projects_showcase"))

    return render_template("project_detail.html", project=project)

@app.route("/messages")
def message_corner():
    db = get_db()
    messages = db.execute("""
        SELECT m.*, u.name as faculty_name, u.designation as faculty_designation, u.avatar as faculty_avatar, u.email as faculty_email
        FROM messages m
        JOIN users u ON u.id = m.faculty_id
        WHERE m.is_active = 1
        ORDER BY m.id DESC
    """).fetchall()
    return render_template("messages.html", messages=messages)

@app.route("/activities")
def activities():
    db = get_db()
    acts = db.execute("SELECT * FROM activities ORDER BY id DESC").fetchall()
    return render_template("activities.html", activities=acts)

@app.post("/submit_participation")
@login_required
def submit_participation():
    user_id = session["user"]["id"]
    activity_id = request.form.get("activity_id")
    proof = request.form.get("proof")
    notes = request.form.get("notes")

    if not activity_id or not proof:
        flash("Please select an activity and provide proof link.", "danger")
        return redirect(url_for("activities"))

    db = get_db()
    db.execute("""
        INSERT INTO participations (user_id, activity_id, proof, notes, status)
        VALUES (?, ?, ?, ?, 'Pending')
    """, (user_id, activity_id, proof, notes))
    db.commit()
    flash("Activity participation submitted successfully! Pending faculty/admin approval.", "success")
    return redirect(url_for("student_dashboard"))

@app.route("/club", methods=["GET", "POST"])
@app.route("/club-register", methods=["GET", "POST"])
def club_register():
    if "user" not in session:
        flash("Please log in to register for the AI Skill Club.", "warning")
        return redirect(url_for("student_login"))

    db = get_db()
    user_id = session["user"]["id"]

    # Check if already registered
    existing = db.execute("SELECT * FROM club_registrations WHERE user_id=?", (user_id,)).fetchone()

    if request.method == "POST":
        if existing:
            flash("You have already submitted an application for the AI Skill Club.", "info")
            return redirect(url_for("student_dashboard"))

        year = request.form.get("year")
        interests = request.form.get("interests")
        note = request.form.get("note")

        db.execute("""
            INSERT INTO club_registrations (user_id, year, interests, note, status)
            VALUES (?, ?, ?, ?, 'Pending')
        """, (user_id, year, interests, note))
        db.commit()
        flash("Registration submitted! You will receive confirmation upon approval.", "success")
        return redirect(url_for("student_dashboard"))

    return render_template("club_register.html", existing=existing)

# -----------------------------------------------------------------------------
# Authentication Routes (Student, Faculty, Admin)
# -----------------------------------------------------------------------------
@app.route("/login")
def unified_login():
    return render_template("student_login.html")

@app.route("/student/login", methods=["GET", "POST"])
def student_login():
    if "user" in session:
        if session["user"]["role"] == "faculty":
            return redirect(url_for("faculty_dashboard"))
        elif session["user"]["role"] == "admin":
            return redirect(url_for("admin_dashboard"))
        return redirect(url_for("student_dashboard"))

    if request.method == "POST":
        identifier = request.form.get("email", "").strip()
        password = request.form.get("password", "")
        db = get_db()
        # Find student by email or roll_no (case-insensitive)
        u = db.execute("""
            SELECT * FROM users 
            WHERE (LOWER(email)=LOWER(?) OR (roll_no != '' AND LOWER(roll_no)=LOWER(?)))
            AND role='student'
        """, (identifier, identifier)).fetchone()
        
        if u and check_password_hash(u["password_hash"], password):
            if u["status"] == "Rejected":
                flash("Your account registration was not approved. Please contact the department.", "danger")
                return render_template("student_login.html")
            
            session["user"] = {
                "id": u["id"],
                "name": u["name"],
                "email": u["email"],
                "role": u["role"],
                "status": u["status"],
                "designation": u["designation"] or "Student",
                "class_name": u["class_name"] if "class_name" in u.keys() else "",
                "roll_no": u["roll_no"] if "roll_no" in u.keys() else "",
                "section": u["section"] if "section" in u.keys() else "",
                "whatsapp_no": u["whatsapp_no"] if "whatsapp_no" in u.keys() else "",
                "avatar": u["avatar"] if "avatar" in u.keys() else "/static/img/default-avatar.png"
            }
            flash(f"Welcome back, {u['name']}!", "success")
            return redirect(url_for("student_dashboard"))
        else:
            flash("Invalid email/roll number or password. Please try again.", "danger")

    return render_template("student_login.html")

@app.route("/student/register", methods=["GET", "POST"])
def student_register():
    if request.method == "POST":
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        class_name = request.form.get("class_name", "").strip() or request.form.get("year", "1st Year")
        roll_no = request.form.get("roll_no", "").strip()
        section = request.form.get("section", "").strip()
        specialization = request.form.get("specialization", "Artificial Intelligence & ICT")
        whatsapp_no = request.form.get("whatsapp_no", "").strip() or request.form.get("phone", "")

        if not name or not email or not password:
            flash("Please fill in all required fields (Name, Email, Password).", "danger")
            return render_template("student_register.html")

        db = get_db()
        try:
            db.execute("""
                INSERT INTO users (name, email, password_hash, role, status, designation, specialization, phone, whatsapp_no, class_name, roll_no, section)
                VALUES (?, ?, ?, 'student', 'Approved', ?, ?, ?, ?, ?, ?, ?)
            """, (name, email, generate_password_hash(password), f"Student - {class_name}", specialization, whatsapp_no, whatsapp_no, class_name, roll_no, section))
            db.commit()

            # Auto log in
            new_user = db.execute("SELECT * FROM users WHERE email=?", (email,)).fetchone()
            session["user"] = {
                "id": new_user["id"],
                "name": new_user["name"],
                "email": new_user["email"],
                "role": "student",
                "status": "Approved",
                "designation": new_user["designation"],
                "class_name": new_user["class_name"] if "class_name" in new_user.keys() else "",
                "roll_no": new_user["roll_no"] if "roll_no" in new_user.keys() else "",
                "section": new_user["section"] if "section" in new_user.keys() else "",
                "whatsapp_no": new_user["whatsapp_no"] if "whatsapp_no" in new_user.keys() else ""
            }
            flash("Registration successful! Welcome to the AI & ICT Department, GVEI.", "success")
            return redirect(url_for("student_dashboard"))
        except sqlite3.IntegrityError:
            flash("An account with this email address already exists. Please login instead.", "warning")

    return render_template("student_register.html")

@app.route("/faculty/login", methods=["GET", "POST"])
def faculty_login():
    if "user" in session and session["user"]["role"] in ("faculty", "admin"):
        return redirect(url_for("faculty_dashboard"))

    if request.method == "POST":
        login_input = request.form.get("email", "").strip()
        login_lower = login_input.lower()
        password = request.form.get("password", "")
        password_stripped = password.strip()
        
        # Extract plain digits for phone number matching
        phone_digits = "".join(filter(str.isdigit, login_input))

        db = get_db()
        # Find candidates by email, normalized email (handle nousheen/nusheen vowels), name, or phone/whatsapp
        sql = """
            SELECT * FROM users 
            WHERE role IN ('faculty', 'admin')
            AND (
                LOWER(TRIM(email)) = ?
                OR LOWER(REPLACE(email, 'o', '')) = LOWER(REPLACE(?, 'o', ''))
                OR LOWER(TRIM(name)) = ?
                OR (? != '' AND (
                    REPLACE(REPLACE(REPLACE(REPLACE(phone, '+', ''), ' ', ''), '-', ''), '(', '') LIKE ?
                    OR REPLACE(REPLACE(REPLACE(REPLACE(whatsapp_no, '+', ''), ' ', ''), '-', ''), '(', '') LIKE ?
                ))
            )
            ORDER BY id ASC
        """
        phone_param = f"%{phone_digits}%" if phone_digits else ""
        candidates = db.execute(sql, (login_lower, login_lower, login_lower, phone_digits, phone_param, phone_param)).fetchall()

        matched_user = None
        for u in candidates:
            stored_hash = u["password_hash"]
            if (check_password_hash(stored_hash, password) or 
                check_password_hash(stored_hash, password_stripped) or
                stored_hash == password or 
                stored_hash == password_stripped):
                matched_user = u
                break

        if matched_user:
            u = matched_user
            session["user"] = {
                "id": u["id"],
                "name": u["name"],
                "email": u["email"],
                "role": u["role"],
                "status": u["status"],
                "designation": u["designation"] or "Faculty Member",
                "specialization": u["specialization"] if "specialization" in u.keys() else "",
                "avatar": u["avatar"] if "avatar" in u.keys() and u["avatar"] else "/static/img/mehraj.png"
            }
            flash(f"Welcome to Faculty Command Center, {u['name']}!", "success")
            if u["role"] == "admin":
                return redirect(url_for("admin_dashboard"))
            return redirect(url_for("faculty_dashboard"))
        else:
            flash("Invalid faculty credentials. Please check your official email (or registered phone) and password.", "danger")

    return render_template("faculty_login.html")

@app.route("/admin/login", methods=["GET", "POST"])
def admin_login():
    if "user" in session and session["user"]["role"] == "admin":
        return redirect(url_for("admin_dashboard"))

    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        db = get_db()
        u = db.execute("SELECT * FROM users WHERE LOWER(email)=? AND role='admin'", (email,)).fetchone()

        if u and check_password_hash(u["password_hash"], password):
            session["user"] = {
                "id": u["id"],
                "name": u["name"],
                "email": u["email"],
                "role": u["role"],
                "status": u["status"],
                "designation": u["designation"] or "Administrator",
                "avatar": u["avatar"] if "avatar" in u.keys() else "/static/img/mehraj.png"
            }
            flash("Welcome back, Administrator!", "success")
            return redirect(url_for("admin_dashboard"))
        else:
            flash("Invalid administrator credentials.", "danger")

    return render_template("admin_login.html")

@app.route("/logout")
def logout():
    session.clear()
    flash("You have been securely logged out.", "info")
    return redirect(url_for("index"))

# -----------------------------------------------------------------------------
# Student Dashboard & Project Submission
# -----------------------------------------------------------------------------
@app.route("/student")
def student_dashboard():
    if "user" not in session:
        flash("Please log in to access the Student Corner.", "info")
        return redirect(url_for("student_login"))

    uid = session["user"]["id"]
    db = get_db()

    # User's submitted projects
    projects = db.execute("""
        SELECT p.*, f.name as faculty_name, f.email as faculty_email
        FROM projects p
        LEFT JOIN users f ON f.id = p.faculty_id
        WHERE p.student_id = ?
        ORDER BY p.id DESC
    """, (uid,)).fetchall()

    # User's activity participations
    participations = db.execute("""
        SELECT p.*, a.title as activity_title, a.date as activity_date
        FROM participations p
        JOIN activities a ON a.id = p.activity_id
        WHERE p.user_id = ?
        ORDER BY p.id DESC
    """, (uid,)).fetchall()

    # User's club registration status
    club = db.execute("SELECT * FROM club_registrations WHERE user_id=? ORDER BY id DESC LIMIT 1", (uid,)).fetchone()

    # Faculty members for supervisor selection
    faculty_list = db.execute("SELECT id, name, designation, specialization FROM users WHERE role='faculty' ORDER BY name ASC").fetchall()

    # Recent messages from faculty
    recent_messages = db.execute("""
        SELECT m.*, u.name as faculty_name, u.designation as faculty_designation
        FROM messages m
        JOIN users u ON u.id = m.faculty_id
        WHERE m.is_active = 1
        ORDER BY m.id DESC LIMIT 4
    """).fetchall()

    # Student Profile Details
    student_profile = db.execute("SELECT * FROM users WHERE id=?", (uid,)).fetchone()

    # Student Virtual Lab Projects
    lab_projects = db.execute("""
        SELECT p.*, f.name as faculty_name,
               (SELECT COUNT(*) FROM virtual_lab_files WHERE project_id = p.id) as files_count
        FROM virtual_lab_projects p
        LEFT JOIN users f ON f.id = p.shared_faculty_id
        WHERE p.student_id = ?
        ORDER BY p.updated_at DESC
    """, (uid,)).fetchall()

    return render_template(
        "student_dashboard.html",
        student_profile=student_profile,
        projects=projects,
        participations=participations,
        club=club,
        faculty_list=faculty_list,
        recent_messages=recent_messages,
        lab_projects=lab_projects
    )

@app.post("/student/submit_project")
@login_required
def student_submit_project():
    uid = session["user"]["id"]
    title = request.form.get("title", "").strip()
    category = request.form.get("category", "").strip()
    abstract = request.form.get("abstract", "").strip()
    tech_stack = request.form.get("tech_stack", "").strip()
    github_url = request.form.get("github_url", "").strip()
    demo_url = request.form.get("demo_url", "").strip()
    document_url = request.form.get("document_url", "").strip()
    faculty_id = request.form.get("faculty_id") or None

    if not title or not category or not abstract:
        flash("Title, Category, and Abstract are mandatory.", "danger")
        return redirect(url_for("student_dashboard"))

    db = get_db()
    db.execute("""
        INSERT INTO projects (title, category, abstract, tech_stack, github_url, demo_url, document_url, student_id, faculty_id, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
    """, (title, category, abstract, tech_stack, github_url, demo_url, document_url, uid, faculty_id))
    db.commit()

    flash("Project submitted successfully! Your supervisor will review and approve it.", "success")
    return redirect(url_for("student_dashboard"))

# -----------------------------------------------------------------------------
# Faculty Dashboard & Features
# -----------------------------------------------------------------------------
@app.route("/faculty")
@faculty_required
def faculty_dashboard():
    db = get_db()
    fid = session["user"]["id"]

    # Projects assigned to this faculty member (and pending projects)
    assigned_projects = db.execute("""
        SELECT p.*, s.name as student_name, s.email as student_email
        FROM projects p
        JOIN users s ON s.id = p.student_id
        WHERE p.faculty_id = ? OR p.faculty_id IS NULL
        ORDER BY CASE WHEN p.status='Pending' THEN 0 ELSE 1 END, p.id DESC
    """, (fid,)).fetchall()

    # All student submissions
    all_projects = db.execute("""
        SELECT p.*, s.name as student_name, s.email as student_email, f.name as faculty_name
        FROM projects p
        JOIN users s ON s.id = p.student_id
        LEFT JOIN users f ON f.id = p.faculty_id
        ORDER BY p.id DESC
    """).fetchall()

    # Messages posted by this faculty
    my_messages = db.execute("""
        SELECT * FROM messages WHERE faculty_id = ? ORDER BY id DESC
    """, (fid,)).fetchall()

    # Students list
    students = db.execute("""
        SELECT id, name, email, designation, specialization, phone, status, created_at, class_name, roll_no, section, whatsapp_no
        FROM users WHERE role='student' ORDER BY id DESC
    """).fetchall()

    # Participations & club
    club_members = db.execute("""
        SELECT cr.*, u.name, u.email
        FROM club_registrations cr
        JOIN users u ON u.id = cr.user_id
        ORDER BY cr.id DESC
    """).fetchall()

    # Student Participations (for activity certificate verification)
    participations = db.execute("""
        SELECT p.*, u.name, u.email, a.title
        FROM participations p
        JOIN users u ON u.id = p.user_id
        JOIN activities a ON a.id = p.activity_id
        ORDER BY p.id DESC
    """).fetchall()

    # Student Virtual Lab Code Submissions shared with this faculty member
    lab_submissions = db.execute("""
        SELECT p.*, s.name as student_name, s.email as student_email, s.roll_no as student_roll_no, s.class_name as student_class,
               (SELECT COUNT(*) FROM virtual_lab_files WHERE project_id = p.id) as files_count
        FROM virtual_lab_projects p
        JOIN users s ON s.id = p.student_id
        WHERE (p.shared_faculty_id = ? OR ? IN (SELECT id FROM users WHERE role='admin'))
          AND p.share_status IN ('Shared', 'Reviewed')
        ORDER BY p.submitted_at DESC
    """, (fid, fid)).fetchall()

    stats = {
        "pending_projects": len([p for p in assigned_projects if p["status"] == "Pending"]),
        "supervised_projects": len(assigned_projects),
        "messages_posted": len(my_messages),
        "total_students": len(students),
        "pending_participations": len([p for p in participations if p["status"] == "Pending"]),
        "lab_submissions_count": len(lab_submissions),
        "pending_lab_submissions_count": len([p for p in lab_submissions if p["share_status"] == "Shared"])
    }

    return render_template(
        "faculty_dashboard.html",
        assigned_projects=assigned_projects,
        all_projects=all_projects,
        my_messages=my_messages,
        students=students,
        club_members=club_members,
        participations=participations,
        lab_submissions=lab_submissions,
        stats=stats
    )

@app.post("/faculty/grade_project")
@faculty_required
def faculty_grade_project():
    pid = request.form.get("project_id")
    try:
        pid = int(pid)
    except (ValueError, TypeError):
        flash("Invalid project ID.", "danger")
        return redirect(url_for("faculty_dashboard"))

    try:
        score_innovation = int(request.form.get("score_innovation", 0) or 0)
        score_technical = int(request.form.get("score_technical", 0) or 0)
        score_presentation = int(request.form.get("score_presentation", 0) or 0)
    except (ValueError, TypeError):
        score_innovation, score_technical, score_presentation = 0, 0, 0

    score_innovation = max(0, min(35, score_innovation))
    score_technical = max(0, min(40, score_technical))
    score_presentation = max(0, min(25, score_presentation))
    total_score = score_innovation + score_technical + score_presentation

    grade = request.form.get("grade", "").strip()
    if not grade or grade == "Auto":
        if total_score >= 90:
            grade = "A+"
        elif total_score >= 80:
            grade = "A"
        elif total_score >= 70:
            grade = "B+"
        elif total_score >= 60:
            grade = "B"
        elif total_score >= 50:
            grade = "C"
        else:
            grade = "Needs Revision"

    status = request.form.get("status", "Approved")
    valid_statuses = ["Pending", "Under Review", "Approved", "Needs Revision", "Rejected"]
    if status not in valid_statuses:
        status = "Approved"

    feedback = request.form.get("feedback", "").strip()
    methodology = request.form.get("methodology", "").strip()

    db = get_db()
    db.execute("""
        UPDATE projects
        SET score_innovation = ?,
            score_technical = ?,
            score_presentation = ?,
            score = ?,
            grade = ?,
            status = ?,
            feedback = ?,
            methodology = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    """, (score_innovation, score_technical, score_presentation, total_score, grade, status, feedback, methodology, pid))
    db.commit()

    flash(f"Official Rubric Evaluation recorded for Project #{pid}: Grade {grade} ({total_score}/100) — {status}.", "success")
    return redirect(url_for("faculty_dashboard"))

@app.post("/verify_participation")
@faculty_required
def verify_participation():
    pid = request.form.get("participation_id")
    status = request.form.get("status", "Approved")
    verifier_notes = request.form.get("verifier_notes", "").strip()
    uid = session["user"]["id"]

    valid_statuses = ["Pending", "Approved", "Rejected"]
    if status not in valid_statuses:
        status = "Approved"

    db = get_db()
    db.execute("""
        UPDATE participations
        SET status = ?, verifier_notes = ?, verified_by = ?
        WHERE id = ?
    """, (status, verifier_notes, uid, pid))
    db.commit()

    flash(f"Student activity participation proof updated to '{status}'.", "success")
    referrer = request.referrer
    if referrer and "/admin" in referrer:
        return redirect(url_for("admin_dashboard"))
    return redirect(url_for("faculty_dashboard"))

@app.post("/faculty/project/<int:pid>/review")
@faculty_required
def faculty_review_project(pid):
    status = request.form.get("status", "Approved")
    feedback = request.form.get("feedback", "")
    score = request.form.get("score") or 0

    valid_statuses = ["Pending", "Under Review", "Approved", "Needs Revision", "Rejected"]
    if status not in valid_statuses:
        flash("Invalid status selection.", "danger")
        return redirect(url_for("faculty_dashboard"))

    db = get_db()
    db.execute("""
        UPDATE projects
        SET status = ?, feedback = ?, score = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    """, (status, feedback, int(score), pid))
    db.commit()

    flash(f"Project #{pid} review updated to '{status}' with feedback.", "success")
    return redirect(url_for("faculty_dashboard"))

@app.post("/faculty/add_student")
@faculty_required
def faculty_add_student():
    name = request.form.get("name", "").strip()
    email = request.form.get("email", "").strip().lower()
    password = request.form.get("password", "")
    class_name = request.form.get("class_name", "").strip() or request.form.get("year", "1st Year").strip()
    roll_no = request.form.get("roll_no", "").strip()
    section = request.form.get("section", "").strip()
    whatsapp_no = request.form.get("whatsapp_no", "").strip() or request.form.get("phone", "").strip()
    specialization = request.form.get("specialization", "Artificial Intelligence & ICT").strip()

    if not name or not email or not password:
        flash("Student Name, Email, and Temporary Password are required.", "danger")
        return redirect(url_for("faculty_dashboard"))

    db = get_db()
    try:
        db.execute("""
            INSERT INTO users (name, email, password_hash, role, status, designation, specialization, phone, whatsapp_no, class_name, roll_no, section)
            VALUES (?, ?, ?, 'student', 'Approved', ?, ?, ?, ?, ?, ?, ?)
        """, (name, email, generate_password_hash(password), f"Student - {class_name}", specialization, whatsapp_no, whatsapp_no, class_name, roll_no, section))
        db.commit()
        flash(f"Student '{name}' (Roll No: {roll_no or 'N/A'}, Class: {class_name or 'N/A'}) registered successfully! They can log in immediately.", "success")
    except sqlite3.IntegrityError:
        flash("A student with this email address already exists in the system.", "warning")

    return redirect(url_for("faculty_dashboard"))

@app.post("/faculty/student/update")
@faculty_required
def faculty_update_student():
    sid = request.form.get("student_id")
    name = request.form.get("name", "").strip()
    email = request.form.get("email", "").strip().lower()
    class_name = request.form.get("class_name", "").strip()
    roll_no = request.form.get("roll_no", "").strip()
    section = request.form.get("section", "").strip()
    whatsapp_no = request.form.get("whatsapp_no", "").strip()
    specialization = request.form.get("specialization", "Artificial Intelligence & ICT").strip()
    password = request.form.get("password", "").strip()

    if not sid or not name or not email:
        flash("Student ID, Name, and Email are required.", "danger")
        return redirect(url_for("faculty_dashboard"))

    db = get_db()
    if password:
        db.execute("""
            UPDATE users SET name=?, email=?, password_hash=?, class_name=?, roll_no=?, section=?, whatsapp_no=?, phone=?, specialization=?, designation=?
            WHERE id=? AND role='student'
        """, (name, email, generate_password_hash(password), class_name, roll_no, section, whatsapp_no, whatsapp_no, specialization, f"Student - {class_name}", sid))
    else:
        db.execute("""
            UPDATE users SET name=?, email=?, class_name=?, roll_no=?, section=?, whatsapp_no=?, phone=?, specialization=?, designation=?
            WHERE id=? AND role='student'
        """, (name, email, class_name, roll_no, section, whatsapp_no, whatsapp_no, specialization, f"Student - {class_name}", sid))
    db.commit()
    flash(f"Student '{name}' profile updated successfully.", "success")
    return redirect(url_for("faculty_dashboard"))

@app.route("/faculty/student/delete/<int:sid>")
@faculty_required
def faculty_delete_student(sid):
    db = get_db()
    db.execute("DELETE FROM users WHERE id=? AND role='student'", (sid,))
    db.commit()
    flash("Student account successfully deleted.", "info")
    return redirect(url_for("faculty_dashboard"))

@app.post("/faculty/post_message")
@faculty_required
def faculty_post_message():
    fid = session["user"]["id"]
    title = request.form.get("title", "").strip()
    category = request.form.get("category", "Announcement")
    priority = request.form.get("priority", "Normal")
    content = request.form.get("content", "").strip()

    if not title or not content:
        flash("Message title and content cannot be blank.", "danger")
        return redirect(url_for("faculty_dashboard"))

    db = get_db()
    db.execute("""
        INSERT INTO messages (faculty_id, title, content, category, priority, is_active)
        VALUES (?, ?, ?, ?, ?, 1)
    """, (fid, title, content, category, priority))
    db.commit()

    flash("Department message posted successfully! It is now live on the landing page & Student Corner.", "success")
    return redirect(url_for("faculty_dashboard"))

@app.route("/faculty/delete_message/<int:mid>")
@faculty_required
def faculty_delete_message(mid):
    db = get_db()
    fid = session["user"]["id"]
    # Admin can delete any; faculty can delete their own
    if session["user"]["role"] == "admin":
        db.execute("DELETE FROM messages WHERE id=?", (mid,))
    else:
        db.execute("DELETE FROM messages WHERE id=? AND faculty_id=?", (mid, fid))
    db.commit()
    flash("Message removed from the Message Corner.", "info")
    return redirect(url_for("faculty_dashboard"))

# -----------------------------------------------------------------------------
# Admin Dashboard & Governance
# -----------------------------------------------------------------------------
@app.route("/admin")
@admin_required
def admin_dashboard():
    db = get_db()

    # Faculty members
    faculty = db.execute("SELECT * FROM users WHERE role='faculty' ORDER BY id ASC").fetchall()

    # Students
    students = db.execute("SELECT * FROM users WHERE role='student' ORDER BY id DESC").fetchall()

    # All Project Submissions
    projects = db.execute("""
        SELECT p.*, s.name as student_name, s.email as student_email, f.name as faculty_name
        FROM projects p
        JOIN users s ON s.id = p.student_id
        LEFT JOIN users f ON f.id = p.faculty_id
        ORDER BY p.id DESC
    """).fetchall()

    # Dynamic Achievements
    achievements = db.execute("SELECT * FROM achievements ORDER BY id DESC").fetchall()

    # Activities
    activities = db.execute("SELECT * FROM activities ORDER BY id DESC").fetchall()

    # Participations
    participations = db.execute("""
        SELECT p.*, u.name, u.email, a.title
        FROM participations p
        JOIN users u ON u.id = p.user_id
        JOIN activities a ON a.id = p.activity_id
        ORDER BY p.id DESC
    """).fetchall()

    # AI Skill Club
    club_regs = db.execute("""
        SELECT cr.*, u.name, u.email
        FROM club_registrations cr
        JOIN users u ON u.id = cr.user_id
        ORDER BY cr.id DESC
    """).fetchall()

    # Messages
    all_messages = db.execute("""
        SELECT m.*, u.name as faculty_name
        FROM messages m
        JOIN users u ON u.id = m.faculty_id
        ORDER BY m.id DESC
    """).fetchall()

    # Innovation Showcases
    innovation_showcases = db.execute("SELECT * FROM innovation_club_showcases ORDER BY id DESC").fetchall()

    stats = {
        "total_students": len(students),
        "total_faculty": len(faculty),
        "total_projects": len(projects),
        "pending_projects": len([p for p in projects if p["status"] == "Pending"]),
        "achievements_count": len(achievements),
        "club_regs": len(club_regs),
        "innovation_showcases_count": len(innovation_showcases)
    }

    return render_template(
        "admin_dashboard.html",
        faculty=faculty,
        students=students,
        projects=projects,
        achievements=achievements,
        activities=activities,
        participations=participations,
        club_regs=club_regs,
        all_messages=all_messages,
        innovation_showcases=innovation_showcases,
        stats=stats
    )

@app.post("/admin/add_faculty")
@admin_required
def admin_add_faculty():
    name = request.form.get("name", "").strip()
    email = request.form.get("email", "").strip().lower()
    password = request.form.get("password", "").strip()
    designation = request.form.get("designation", "Assistant Professor").strip()
    specialization = request.form.get("specialization", "Artificial Intelligence & ICT").strip()
    phone = request.form.get("phone", "").strip()
    whatsapp_no = request.form.get("whatsapp_no", "").strip() or phone
    avatar = request.form.get("avatar", "").strip() or "/static/img/mehraj.png"
    qualification = request.form.get("qualification", "").strip()
    experience = request.form.get("experience", "").strip()
    office_room = request.form.get("office_room", "").strip()
    bio = request.form.get("bio", "").strip()

    if not name or not email or not password:
        flash("Name, Email, and Initial Password are required to onboard faculty.", "danger")
        return redirect(url_for("admin_dashboard"))

    db = get_db()
    try:
        db.execute("""
            INSERT INTO users (name, email, password_hash, role, status, designation, department, specialization, phone, whatsapp_no, avatar, qualification, experience, office_room, bio)
            VALUES (?, ?, ?, 'faculty', 'Approved', ?, 'AI & ICT Department, GVEI', ?, ?, ?, ?, ?, ?, ?, ?)
        """, (name, email, generate_password_hash(password), designation, specialization, phone, whatsapp_no, avatar, qualification, experience, office_room, bio))
        db.commit()
        flash(f"Faculty member '{name}' onboarded successfully! They can log in with Email '{email}' (or phone '{phone}') and the set password.", "success")
    except sqlite3.IntegrityError:
        flash(f"A user with email '{email}' already exists. You can update their password or details using 'Edit Faculty' below.", "warning")

    return redirect(url_for("admin_dashboard"))

@app.post("/admin/faculty/update")
@admin_required
def admin_update_faculty():
    fid = request.form.get("faculty_id") or request.form.get("id") or request.form.get("fid")
    name = request.form.get("name", "").strip()
    email = request.form.get("email", "").strip().lower()
    password = request.form.get("password", "").strip()
    designation = request.form.get("designation", "").strip()
    specialization = request.form.get("specialization", "").strip()
    phone = request.form.get("phone", "").strip()
    whatsapp_no = request.form.get("whatsapp_no", "").strip() or phone
    avatar = request.form.get("avatar", "").strip() or "/static/img/mehraj.png"
    qualification = request.form.get("qualification", "").strip()
    experience = request.form.get("experience", "").strip()
    office_room = request.form.get("office_room", "").strip()
    bio = request.form.get("bio", "").strip()

    if not fid or not name or not email:
        flash("Faculty ID, Name, and Email are required.", "danger")
        return redirect(url_for("admin_dashboard"))

    db = get_db()
    if password:
        db.execute("""
            UPDATE users SET name=?, email=?, password_hash=?, designation=?, specialization=?, phone=?, whatsapp_no=?, avatar=?, qualification=?, experience=?, office_room=?, bio=?
            WHERE id=? AND role IN ('faculty', 'admin')
        """, (name, email, generate_password_hash(password), designation, specialization, phone, whatsapp_no, avatar, qualification, experience, office_room, bio, fid))
    else:
        db.execute("""
            UPDATE users SET name=?, email=?, designation=?, specialization=?, phone=?, whatsapp_no=?, avatar=?, qualification=?, experience=?, office_room=?, bio=?
            WHERE id=? AND role IN ('faculty', 'admin')
        """, (name, email, designation, specialization, phone, whatsapp_no, avatar, qualification, experience, office_room, bio, fid))
    db.commit()
    flash(f"Faculty member '{name}' ({email}) details and credentials updated successfully!", "success")
    return redirect(url_for("admin_dashboard"))

@app.post("/admin/faculty/reset_password")
@admin_required
def admin_reset_faculty_password():
    fid = request.form.get("faculty_id") or request.form.get("id") or request.form.get("fid")
    new_password = request.form.get("new_password", "").strip()

    if not fid or not new_password:
        flash("Faculty ID and New Password are required.", "danger")
        return redirect(url_for("admin_dashboard"))

    db = get_db()
    db.execute("UPDATE users SET password_hash=? WHERE id=? AND role IN ('faculty', 'admin')", (generate_password_hash(new_password), fid))
    db.commit()
    u = db.execute("SELECT name, email FROM users WHERE id=?", (fid,)).fetchone()
    fac_name = u["name"] if u else "Faculty"
    fac_email = u["email"] if u else ""
    flash(f"Password for {fac_name} ({fac_email}) successfully changed to: '{new_password}'. They can now log in.", "success")
    return redirect(url_for("admin_dashboard"))

@app.route("/admin/faculty/delete/<int:fid>")
@admin_required
def admin_delete_faculty(fid):
    db = get_db()
    db.execute("DELETE FROM users WHERE id=? AND role='faculty'", (fid,))
    db.commit()
    flash("Faculty profile removed from the system.", "info")
    return redirect(url_for("admin_dashboard"))

@app.post("/admin/innovation_showcase/create")
@admin_required
def admin_create_innovation_showcase():
    title = request.form.get("title", "").strip()
    category = request.form.get("category", "Robotics & Autonomous Systems").strip()
    lead_student = request.form.get("lead_student", "").strip()
    mentor_name = request.form.get("mentor_name", "Er. Mehraj U Din Mir (HOD AI&ICT GVEI)").strip()
    abstract = request.form.get("abstract", "").strip()
    tech_stack = request.form.get("tech_stack", "").strip()
    demo_url = request.form.get("demo_url", "").strip()
    github_url = request.form.get("github_url", "").strip()
    image_url = request.form.get("image_url", "").strip() or "/static/img/club.jpg"

    if not title or not abstract:
        flash("Title and Abstract are required for Innovation Club showcase.", "danger")
        return redirect(url_for("admin_dashboard"))

    db = get_db()
    db.execute("""
        INSERT INTO innovation_club_showcases (title, category, lead_student, mentor_name, abstract, tech_stack, demo_url, github_url, image_url, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')
    """, (title, category, lead_student, mentor_name, abstract, tech_stack, demo_url, github_url, image_url))
    db.commit()
    flash("New Innovation Club showcase published successfully!", "success")
    return redirect(url_for("admin_dashboard"))

@app.route("/admin/innovation_showcase/delete/<int:sc_id>")
@admin_required
def admin_delete_innovation_showcase(sc_id):
    db = get_db()
    db.execute("DELETE FROM innovation_club_showcases WHERE id=?", (sc_id,))
    db.commit()
    flash("Innovation Club showcase removed.", "info")
    return redirect(url_for("admin_dashboard"))

@app.post("/admin/achievement/create")
@admin_required
def admin_create_achievement():
    title = request.form.get("title", "").strip()
    category = request.form.get("category", "Hackathon")
    badge = request.form.get("badge", "Award")
    date = request.form.get("date", "")
    image_url = request.form.get("image_url") or "/static/img/nit.jpg"
    description = request.form.get("description", "").strip()

    if not title or not description:
        flash("Achievement Title and Description are required.", "danger")
        return redirect(url_for("admin_dashboard"))

    db = get_db()
    db.execute("""
        INSERT INTO achievements (title, category, badge, date, description, image_url, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, 1)
    """, (title, category, badge, date, description, image_url))
    db.commit()

    flash("Department Achievement published! It is now featured live on the landing page.", "success")
    return redirect(url_for("admin_dashboard"))

@app.route("/admin/achievement/delete/<int:aid>")
@admin_required
def admin_delete_achievement(aid):
    db = get_db()
    db.execute("DELETE FROM achievements WHERE id=?", (aid,))
    db.commit()
    flash("Achievement deleted from the landing page.", "info")
    return redirect(url_for("admin_dashboard"))

@app.post("/admin/activity")
@admin_required
def create_activity():
    title = request.form.get("title", "").strip()
    date = request.form.get("date", "")
    category = request.form.get("category", "Workshop")
    location = request.form.get("location", "AI Lab / Seminar Hall")
    description = request.form.get("description", "")
    image_url = request.form.get("image_url") or "/static/img/activity.jpg"

    if not title:
        flash("Activity title is required.", "danger")
        return redirect(url_for("admin_dashboard"))

    db = get_db()
    db.execute("""
        INSERT INTO activities (title, date, category, location, description, image_url)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (title, date, category, location, description, image_url))
    db.commit()

    flash("New Department Activity scheduled successfully.", "success")
    return redirect(url_for("admin_dashboard"))

@app.route("/admin/project/<int:pid>/<string:status>")
@admin_required
def admin_set_project_status(pid, status):
    valid_statuses = ["Pending", "Under Review", "Approved", "Needs Revision", "Rejected"]
    if status not in valid_statuses:
        flash("Invalid status!", "danger")
        return redirect(url_for("admin_dashboard"))

    db = get_db()
    db.execute("UPDATE projects SET status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?", (status, pid))
    db.commit()
    flash(f"Project #{pid} status updated to {status}.", "success")
    return redirect(url_for("admin_dashboard"))

@app.route("/admin/project/<int:pid>/toggle_featured")
@admin_required
def admin_toggle_featured_project(pid):
    db = get_db()
    proj = db.execute("SELECT is_featured FROM projects WHERE id=?", (pid,)).fetchone()
    if proj:
        new_val = 0 if proj["is_featured"] else 1
        db.execute("UPDATE projects SET is_featured=? WHERE id=?", (new_val, pid))
        db.commit()
        flash("Project featured status toggled on landing page.", "info")
    return redirect(url_for("admin_dashboard"))

@app.route("/admin/student/<int:uid>/<string:status>")
@admin_required
def admin_set_student_status(uid, status):
    valid_statuses = ["Approved", "Pending", "Rejected"]
    if status not in valid_statuses:
        flash("Invalid status!", "danger")
        return redirect(url_for("admin_dashboard"))

    db = get_db()
    db.execute("UPDATE users SET status=? WHERE id=? AND role='student'", (status, uid))
    db.commit()
    flash(f"Student account status updated to {status}.", "success")
    return redirect(url_for("admin_dashboard"))

@app.route("/admin/participation/<int:pid>/<string:status>", methods=["POST", "GET"])
@admin_required
def set_participation_status(pid, status):
    valid_statuses = ["Pending", "Approved", "Rejected"]
    if status not in valid_statuses:
        flash("Invalid status!", "danger")
        return redirect(url_for("admin_dashboard"))

    db = get_db()
    db.execute("UPDATE participations SET status=? WHERE id=?", (status, pid))
    db.commit()
    flash(f"Participation status updated to {status}.", "success")
    return redirect(url_for("admin_dashboard"))

@app.route("/admin/club_registration/<int:cid>/<string:status>")
@admin_required
def set_club_registration_status(cid, status):
    valid_statuses = ["Pending", "Approved", "Rejected"]
    if status not in valid_statuses:
        flash("Invalid status!", "danger")
        return redirect(url_for("admin_ai_skill_club"))

    db = get_db()
    db.execute("UPDATE club_registrations SET status=? WHERE id=?", (status, cid))
    db.commit()
    flash(f"Club registration status updated to {status}.", "success")
    return redirect(url_for("admin_ai_skill_club"))

@app.route("/admin/ai_skill_club")
@admin_required
def admin_ai_skill_club():
    db = get_db()
    regs = db.execute("""
        SELECT cr.id, u.name, u.email, cr.year, cr.interests, cr.note, cr.status
        FROM club_registrations cr
        JOIN users u ON cr.user_id = u.id
        ORDER BY cr.id DESC
    """).fetchall()
    return render_template("admin_ai_skill_club.html", registrations=regs)

@app.get("/admin/ai_skill_club/<int:reg_id>/approve")
@admin_required
def approve_ai_skill_club(reg_id):
    db = get_db()
    db.execute("UPDATE club_registrations SET status='Approved' WHERE id=?", (reg_id,))
    db.commit()
    flash("Club Registration approved!", "success")
    return redirect(url_for("admin_ai_skill_club"))

@app.get("/admin/ai_skill_club/<int:reg_id>/reject")
@admin_required
def reject_ai_skill_club(reg_id):
    db = get_db()
    db.execute("UPDATE club_registrations SET status='Rejected' WHERE id=?", (reg_id,))
    db.commit()
    flash("Club Registration rejected!", "warning")
    return redirect(url_for("admin_ai_skill_club"))

@app.get("/admin/ai_skill_club/<int:reg_id>/delete")
@admin_required
def delete_ai_skill_club(reg_id):
    db = get_db()
    db.execute("DELETE FROM club_registrations WHERE id=?", (reg_id,))
    db.commit()
    flash("Club Registration deleted!", "danger")
    return redirect(url_for("admin_ai_skill_club"))

# -----------------------------------------------------------------------------
# Search & JSON APIs
# -----------------------------------------------------------------------------
@app.route("/search")
def search_page():
    q = request.args.get("q", "").strip()
    db = get_db()
    news = db.execute("SELECT * FROM news WHERE title LIKE ? OR description LIKE ? LIMIT 6", (f"%{q}%", f"%{q}%")).fetchall() if q else []
    activities = db.execute("SELECT * FROM activities WHERE title LIKE ? OR description LIKE ? LIMIT 6", (f"%{q}%", f"%{q}%")).fetchall() if q else []
    projects = db.execute("SELECT * FROM projects WHERE (title LIKE ? OR tech_stack LIKE ? OR abstract LIKE ?) AND status='Approved' LIMIT 6", (f"%{q}%", f"%{q}%", f"%{q}%")).fetchall() if q else []
    faculty = db.execute("SELECT * FROM users WHERE (name LIKE ? OR specialization LIKE ?) AND role='faculty' LIMIT 6", (f"%{q}%", f"%{q}%")).fetchall() if q else []
    return render_template("search.html", query=q, news=news, activities=activities, projects=projects, faculty=faculty)

@app.route("/api/search")
def api_search():
    q = request.args.get("q", "").strip()
    if not q:
        return jsonify([])

    db = get_db()
    results = []
    
    # Search News
    for n in db.execute("SELECT * FROM news WHERE title LIKE ? LIMIT 4", (f"%{q}%",)):
        results.append({"type": "News", "title": n["title"], "url": url_for("index")})

    # Search Activities
    for a in db.execute("SELECT * FROM activities WHERE title LIKE ? LIMIT 4", (f"%{q}%",)):
        results.append({"type": "Activity", "title": a["title"], "url": url_for("activities")})

    # Search Projects
    for p in db.execute("SELECT * FROM projects WHERE (title LIKE ? OR tech_stack LIKE ?) AND status='Approved' LIMIT 4", (f"%{q}%", f"%{q}%")):
        results.append({"type": "Project", "title": p["title"], "url": url_for("projects_showcase")})

    # Search Faculty
    for f in db.execute("SELECT * FROM users WHERE (name LIKE ? OR specialization LIKE ?) AND role='faculty' LIMIT 4", (f"%{q}%", f"%{q}%")):
        results.append({"type": "Faculty", "title": f"{f['name']} ({f['designation']})", "url": url_for("index") + "#faculty"})

    return jsonify(results)

# -----------------------------------------------------------------------------
# Supabase Cloud Synchronization & Architecture Endpoints
# -----------------------------------------------------------------------------
@app.route("/admin/supabase/status")
@admin_required
def admin_supabase_status():
    url = os.environ.get("SUPABASE_URL", "").strip()
    key = os.environ.get("SUPABASE_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()
    configured = bool(url and key and len(url) > 10 and len(key) > 10)
    
    masked_url = ""
    if configured:
        masked_url = url[:14] + "..." + url[-8:] if len(url) > 22 else url
        
    client = get_supabase()
    connected = False
    test_result = "Not Connected"
    
    if client:
        try:
            # Quick check query to Supabase
            res = client.table("users").select("count", count="exact").execute()
            connected = True
            test_result = f"Active Cloud Connection (users table responsive, count: {res.count if hasattr(res, 'count') else 'ok'})"
        except Exception as e:
            test_result = f"Connection attempted but error returned: {str(e)[:120]}"
    elif configured:
        test_result = "Credentials set in .env, but could not establish Supabase client session."
    else:
        test_result = "SUPABASE_URL and SUPABASE_KEY not yet configured in .env file."

    db = get_db()
    local_counts = {
        "users": db.execute("SELECT COUNT(*) FROM users").fetchone()[0],
        "activities": db.execute("SELECT COUNT(*) FROM activities").fetchone()[0],
        "projects": db.execute("SELECT COUNT(*) FROM projects").fetchone()[0],
        "achievements": db.execute("SELECT COUNT(*) FROM achievements").fetchone()[0],
        "messages": db.execute("SELECT COUNT(*) FROM messages").fetchone()[0],
        "club_registrations": db.execute("SELECT COUNT(*) FROM club_registrations").fetchone()[0],
        "virtual_lab_projects": db.execute("SELECT COUNT(*) FROM virtual_lab_projects").fetchone()[0],
        "virtual_lab_files": db.execute("SELECT COUNT(*) FROM virtual_lab_files").fetchone()[0],
        "departmental_documents": db.execute("SELECT COUNT(*) FROM departmental_documents").fetchone()[0]
    }

    return jsonify({
        "supabase_library_installed": SUPABASE_LIB_AVAILABLE,
        "is_configured": configured,
        "is_connected": connected,
        "masked_url": masked_url,
        "connection_message": test_result,
        "local_records": local_counts
    })

@app.post("/admin/supabase/sync")
@admin_required
def admin_supabase_sync():
    client = get_supabase()
    db = get_db()
    
    local_counts = {
        "users": db.execute("SELECT COUNT(*) FROM users").fetchone()[0],
        "activities": db.execute("SELECT COUNT(*) FROM activities").fetchone()[0],
        "projects": db.execute("SELECT COUNT(*) FROM projects").fetchone()[0],
        "achievements": db.execute("SELECT COUNT(*) FROM achievements").fetchone()[0],
        "messages": db.execute("SELECT COUNT(*) FROM messages").fetchone()[0],
        "virtual_lab_projects": db.execute("SELECT COUNT(*) FROM virtual_lab_projects").fetchone()[0],
        "virtual_lab_files": db.execute("SELECT COUNT(*) FROM virtual_lab_files").fetchone()[0],
        "departmental_documents": db.execute("SELECT COUNT(*) FROM departmental_documents").fetchone()[0]
    }

    if not client:
        return jsonify({
            "success": False,
            "connected": False,
            "message": "Supabase Cloud credentials are not configured in your .env file. Add SUPABASE_URL and SUPABASE_KEY to enable live cloud data sync.",
            "local_counts": local_counts
        })

    synced = {}
    errors = []

    tables_to_sync = [
        ("users", "SELECT * FROM users"),
        ("activities", "SELECT * FROM activities"),
        ("achievements", "SELECT * FROM achievements"),
        ("projects", "SELECT * FROM projects"),
        ("messages", "SELECT * FROM messages"),
        ("innovation_club_showcases", "SELECT * FROM innovation_club_showcases"),
        ("virtual_lab_projects", "SELECT * FROM virtual_lab_projects"),
        ("virtual_lab_files", "SELECT * FROM virtual_lab_files"),
        ("departmental_documents", "SELECT * FROM departmental_documents")
    ]

    for tbl, query in tables_to_sync:
        try:
            rows = [dict(r) for r in db.execute(query).fetchall()]
            if rows:
                client.table(tbl).upsert(rows).execute()
                synced[tbl] = len(rows)
        except Exception as e:
            errors.append(f"{tbl}: {str(e)[:120]}")

    if errors and not synced:
        msg = f"Cloud sync attempt encountered schema constraints: {'; '.join(errors[:2])}. Ensure supabase_schema.sql has been executed in the Supabase Cloud SQL Editor."
        return jsonify({
            "success": False,
            "connected": True,
            "message": msg,
            "synced_counts": synced,
            "errors": errors
        }), 200
    elif errors:
        msg = f"Partial cloud sync completed ({len(synced)} tables synced). Warnings on: {', '.join([e.split(':')[0] for e in errors])}."
        return jsonify({
            "success": True,
            "connected": True,
            "message": msg,
            "synced_counts": synced,
            "errors": errors
        }), 200
    else:
        return jsonify({
            "success": True,
            "connected": True,
            "message": "Successfully synchronized local department database to Supabase Cloud PostgreSQL!",
            "synced_counts": synced
        }), 200

@app.route("/admin/supabase/schema_sql")
@admin_required
def admin_supabase_schema_sql():
    sql_path = os.path.join(app.root_path, "supabase_schema.sql")
    if os.path.exists(sql_path):
        with open(sql_path, "r", encoding="utf-8") as f:
            sql_content = f.read()
        return jsonify({"success": True, "sql": sql_content})
    return jsonify({"success": False, "message": "supabase_schema.sql not found"}), 404

# -----------------------------------------------------------------------------
# Departmental Documents — Password Protected Archive (Passcode: ict@123)
# -----------------------------------------------------------------------------
@app.route("/documents")
def documents_page():
    db = get_db()
    # Always ensure static/docs folder is in sync with database (dynamic on reload & deployment)
    sync_departmental_documents_folder(db)
    unlocked = session.get("documents_unlocked", False)
    documents = []
    categories = []
    
    if unlocked:
        category_filter = request.args.get("category", "").strip()
        search_query = request.args.get("q", "").strip()
        
        sql = "SELECT * FROM departmental_documents WHERE 1=1"
        params = []
        
        if category_filter and category_filter != "All":
            sql += " AND category = ?"
            params.append(category_filter)
            
        if search_query:
            sql += " AND (title LIKE ? OR description LIKE ? OR category LIKE ?)"
            params.extend([f"%{search_query}%", f"%{search_query}%", f"%{search_query}%"])
            
        sql += " ORDER BY id ASC"
        documents = db.execute(sql, params).fetchall()
        
        # Unique categories
        cat_rows = db.execute("SELECT DISTINCT category FROM departmental_documents ORDER BY category ASC").fetchall()
        categories = [r["category"] for r in cat_rows]

    # Check Supabase status
    supabase_client = get_supabase()
    supabase_synced = bool(supabase_client is not None)

    return render_template(
        "documents.html",
        unlocked=unlocked,
        documents=documents,
        categories=categories,
        supabase_synced=supabase_synced,
        active_category=request.args.get("category", "All"),
        search_query=request.args.get("q", "")
    )

@app.post("/documents/unlock")
def documents_unlock():
    data = request.get_json(silent=True) or request.form
    entered_password = (data.get("password") or "").strip()
    
    # Hardcoded required departmental passcode: ict@123
    HARDCODED_PASSCODE = "ict@123"
    
    if entered_password == HARDCODED_PASSCODE:
        session["documents_unlocked"] = True
        if request.is_json:
            return jsonify({
                "success": True,
                "message": "Access granted to Departmental Document Archive.",
                "redirect": url_for("documents_page")
            })
        flash("Departmental Document Archive unlocked successfully.", "success")
        return redirect(url_for("documents_page"))
    else:
        if request.is_json:
            return jsonify({
                "success": False,
                "error": "Incorrect password. The department passcode is 'ict@123'."
            }), 401
        flash("Incorrect password. The department passcode is 'ict@123'.", "danger")
        return redirect(url_for("documents_page"))

@app.route("/documents/lock")
def documents_lock():
    session.pop("documents_unlocked", None)
    flash("Departmental Document Archive locked.", "info")
    return redirect(url_for("documents_page"))

@app.route("/documents/download/<int:doc_id>")
def documents_download(doc_id):
    if not session.get("documents_unlocked", False):
        flash("Access restricted. Please unlock with passcode 'ict@123'.", "warning")
        return redirect(url_for("documents_page"))
        
    db = get_db()
    doc = db.execute("SELECT * FROM departmental_documents WHERE id = ?", (doc_id,)).fetchone()
    if not doc:
        flash("Requested document not found.", "danger")
        return redirect(url_for("documents_page"))
        
    # Increment download counter
    db.execute("UPDATE departmental_documents SET downloads_count = downloads_count + 1 WHERE id = ?", (doc_id,))
    db.commit()
    
    from flask import send_file
    file_path = os.path.join(app.root_path, "static", "docs", doc["file_name"])
    if os.path.exists(file_path):
        return send_file(
            file_path,
            as_attachment=True,
            download_name=doc["file_name"],
            mimetype="application/pdf"
        )
    else:
        return redirect(doc["file_url"])

@app.route("/api/documents/<int:doc_id>")
def api_document_detail(doc_id):
    if not session.get("documents_unlocked", False):
        return jsonify({"success": False, "error": "Access restricted. Please unlock with 'ict@123'."}), 403
        
    db = get_db()
    doc = db.execute("SELECT * FROM departmental_documents WHERE id = ?", (doc_id,)).fetchone()
    if not doc:
        return jsonify({"success": False, "error": "Document not found"}), 404
        
    return jsonify({
        "success": True,
        "document": dict(doc)
    })

# -----------------------------------------------------------------------------
# AI Departmental Tools Hub & Academic Assistant
# -----------------------------------------------------------------------------
@app.route("/ai-tools")
def ai_tools_hub():
    db = get_db()
    featured_projects = db.execute("""
        SELECT p.*, s.name as student_name
        FROM projects p
        JOIN users s ON s.id = p.student_id
        WHERE p.status = 'Approved'
        ORDER BY p.is_featured DESC, p.score DESC
        LIMIT 4
    """).fetchall()
    
    faculty_mentors = db.execute("SELECT id, name, designation, specialization FROM users WHERE role='faculty'").fetchall()

    return render_template(
        "ai_tools.html",
        featured_projects=featured_projects,
        faculty_mentors=faculty_mentors
    )

@app.post("/api/ai/generate-idea")
def api_ai_generate_idea():
    data = request.get_json(silent=True) or request.form
    domain = data.get("domain", "Computer Vision & Edge AI")
    complexity = data.get("complexity", "Capstone / Final Year Project")
    user_stack = data.get("tech_stack", "PyTorch, OpenCV, Flask, Docker")

    # High-impact curated departmental knowledge base
    idea_catalogs = {
        "Computer Vision & Edge AI": [
            {
                "title": "EdgeVision-Shield: Real-Time Multimodal Industrial Defect & Safety Protocol Detection via Quantized Vision Transformers",
                "abstract": "An end-to-end edge-computed computer vision architecture designed for automated factory pipeline inspection and worker PPE compliance. Utilizing a hardware-quantized MobileViT backbone integrated with dynamic attention pooling, the system achieves sub-18ms inference latency on low-power edge nodes while sustaining 96.8% mean Average Precision across severe lighting occlusions.",
                "methodology": "Stage 1: Multi-scale spatial feature extraction using INT8-quantized MobileViT-v2. Stage 2: Temporal anomaly tracking using Kalman filtering. Stage 3: Low-latency telemetry transmission via MQTT broker. Stage 4: Centralized supervisory dashboard with automated alert triggers.",
                "tech_stack": "PyTorch, MobileViT, TensorRT, OpenCV, FastAPI, MQTT, Docker, Redis",
                "datasets": ["Kaggle MVTec AD Industrial Anomaly Dataset", "RoboFlow PPE Safety Detection Benchmark", "COCO-Edge Benchmark"],
                "novelty_angle": "4-bit post-training quantization enabling 60 FPS real-time throughput on Raspberry Pi 5 and Jetson Orin Nano with under 4.5W power draw.",
                "evaluation_metrics": "mAP@0.5:0.95, Frame Latency (ms), Precision/Recall, Energy Consumption (Joules/frame)"
            },
            {
                "title": "NeuroGaze-Safety: Multi-Task Driver Drowsiness and Cognitive Distraction Mitigation via Temporal Graph Neural Networks",
                "abstract": "A multi-task cabin safety framework tracking facial landmarks, eye-closure PERCLOS ratios, and head pose dynamics to anticipate microsleep episodes 3.5 seconds prior to full cognitive disengagement. Designed for constrained in-vehicle automotive compute units.",
                "methodology": "Stage 1: Lightweight facial landmark estimation via MediaPipe/BlazeFace. Stage 2: Temporal spatiotemporal GCN analyzing gaze vectors. Stage 3: Kalman-smoothed fatigue index calculation. Stage 4: Auditory and haptic warning dispatch.",
                "tech_stack": "TensorFlow Lite, MediaPipe, OpenCV, Flask, WebSockets, Python",
                "datasets": ["NTHU Drowsy Driver Dataset", "RLDD Real-Life Drowsiness Dataset"],
                "novelty_angle": "Anticipatory microsleep prediction using temporal graph convolutions with 98.2% validation accuracy under nighttime IR illumination.",
                "evaluation_metrics": "PERCLOS Accuracy, False Alarm Rate, Latency (ms), F1-Score"
            }
        ],
        "Generative AI & LLMs": [
            {
                "title": "RAG-Scholar: Context-Aware Academic Paper Retrieval & Scientific Claim Verification via Hybrid Sparse-Dense Embeddings",
                "abstract": "An advanced Retrieval-Augmented Generation (RAG) platform tailored for academic research validation. Incorporates reciprocal rank fusion across BM25 lexical search and BGE-M3 dense embeddings, coupled with a cross-encoder reranker and self-reflective hallucination check to synthesize verified literature reviews with direct DOI attribution.",
                "methodology": "Stage 1: PDF semantic chunking preserving mathematical equations and table structures. Stage 2: Hybrid sparse-dense vector indexing in ChromaDB. Stage 3: Cross-encoder re-ranking. Stage 4: Self-reflective LLM generator with strict claim verification against retrieved evidence.",
                "tech_stack": "LangChain, ChromaDB, HuggingFace Transformers, BGE-M3, FastEmbed, Streamlit/Flask",
                "datasets": ["arXiv CS Dataset", "SciFact Scientific Claim Verification Benchmark", "PubMed Central Open Access"],
                "novelty_angle": "Reciprocal Rank Fusion with self-corrective verification reducing factual citation hallucinations by 92% compared to standard zero-shot RAG.",
                "evaluation_metrics": "Faithfulness Score, ROUGE-L, Answer Relevance, Context Recall"
            },
            {
                "title": "CodePulse-Sentinel: Autonomous Vulnerability Detection and Patch Synthesis for Smart Contracts via Fine-Tuned CodeLLMs",
                "abstract": "A dual-agent code intelligence pipeline that inspects Solidity and Python software for reentrancy, integer overflows, and cryptographic flaws, generating verified minimal-diff patches alongside automated pytest test cases.",
                "methodology": "Stage 1: AST (Abstract Syntax Tree) parsing and control-flow graph construction. Stage 2: Fine-tuned CodeLlama-7B / DeepSeek-Coder vulnerability analysis. Stage 3: Automated patch generation. Stage 4: Sandboxed formal verification test run.",
                "tech_stack": "PyTorch, CodeLlama, ASTroid, Slither, Docker, Flask API",
                "datasets": ["SmartBugs Solidity Dataset", "CWE Explainable Vulnerability Benchmark"],
                "novelty_angle": "Zero-shot syntactic proof generation pairing AST control graphs with LLM generation to eliminate false positives in automated security audits.",
                "evaluation_metrics": "Vulnerability Detection Recall, Patch Precision, Compilation Pass Rate"
            }
        ],
        "Autonomous Systems & Robotics": [
            {
                "title": "AeroNav-SLAM: Visual-Inertial Odometry and Dynamic Obstacle Avoidance for Autonomous Search-and-Rescue Micro-UAVs",
                "abstract": "An autonomous aerial robotics navigation stack designed for GPS-denied indoor disaster zones. Fuses stereo camera feeds with high-frequency IMU telemetry to generate real-time 3D OctoMap voxel representations and compute collision-free trajectories using dynamic spline trajectory optimization.",
                "methodology": "Stage 1: Feature tracking and keyframe visual odometry with ORB-SLAM3. Stage 2: Extended Kalman Filter fusing IMU kinematics. Stage 3: Dynamic 3D OctoMap probabilistic occupancy mapping. Stage 4: Minimum snap trajectory planning and motor PID control.",
                "tech_stack": "ROS2 Humble, C++, Python, ORB-SLAM3, PX4 Autopilot, Gazebo, OpenCV",
                "datasets": ["EuRoC MAV Dataset", "TUM Visual-Inertial Benchmark", "KITTI Odometry Dataset"],
                "novelty_angle": "Real-time 3D dynamic obstacle avoidance executing at 30Hz on an onboard companion computer without external motion capture or GPS.",
                "evaluation_metrics": "Absolute Trajectory Error (ATE RMSE), Tracking Drift (%), Computation Load (%)"
            }
        ],
        "Healthcare & Medical Informatics": [
            {
                "title": "CardioPulse-DeepNet: Interpretable Multi-Lead ECG Arrhythmia Classification via Continuous Wavelet Transform and Spatial Transformers",
                "abstract": "A clinical-grade deep neural network for continuous 12-lead ECG telemetry monitoring. Translates raw electrophysiological signals into multi-scale time-frequency scalograms using Continuous Wavelet Transform (CWT), analyzed by a Spatial Attention Network with integrated Grad-CAM visual heatmaps for physician verification.",
                "methodology": "Stage 1: Bandpass filtering and baseline wander elimination via Butterworth filter. Stage 2: Continuous Wavelet Transform (Morlet wavelet) scalogram generation. Stage 3: Spatial Transformer Network classification across 17 cardiac arrhythmias. Stage 4: Clinician explainability interface with Grad-CAM.",
                "tech_stack": "PyTorch, Torchaudio, SciPy, Flask, Chart.js, Docker",
                "datasets": ["PhysioNet MIT-BIH Arrhythmia Database", "PTB-XL 12-Lead Electrocardiography Dataset"],
                "novelty_angle": "Dual-domain time-frequency learning attaining 98.7% sensitivity on rare arrhythmias while providing beat-by-beat visual feature attribution for cardiologists.",
                "evaluation_metrics": "Macro F1-Score, Sensitivity, Specificity, Inference Time (ms)"
            }
        ],
        "Cybersecurity & Threat Detection": [
            {
                "title": "ZeroTrust-Sentinel: Real-Time DNS Tunneling & APT Intrusion Detection via Graph Neural Networks and eBPF Telemetry",
                "abstract": "A kernel-level cybersecurity telemetry and network anomaly detection engine. Uses extended Berkeley Packet Filter (eBPF) probes in the Linux kernel to collect high-fidelity socket telemetry, structured into dynamic bipartite interaction graphs and evaluated via Temporal Graph Convolutional Networks (T-GCN) to neutralize data exfiltration in under 120ms.",
                "methodology": "Stage 1: Zero-overhead packet telemetry extraction via eBPF kernel bytecode. Stage 2: Dynamic communication graph generation with NetworkX/PyG. Stage 3: Temporal GCN node classification for malicious behavior. Stage 4: Automated iptables isolation rule dispatch.",
                "tech_stack": "Python, eBPF (BCC), PyTorch Geometric, NetworkX, Linux Kernel, Redis",
                "datasets": ["UNSW-NB15 Intrusion Dataset", "CIC-IDS2018 Network Benchmark", "DNS-Tunneling Capture 2024"],
                "novelty_angle": "Kernel-level eBPF packet capture eliminating user-space copy overhead and achieving sub-120ms threat mitigation against zero-day covert DNS tunnels.",
                "evaluation_metrics": "Detection Precision, False Positive Rate (FPR), Throughput (Gbps), Mitigation Latency (ms)"
            }
        ],
        "Smart Campus & IoT": [
            {
                "title": "SmartCampus-Pulse: Edge-AI Microgrid Energy Load Forecasting & Carbon Footprint Optimization via Spatio-Temporal Graph WaveNets",
                "abstract": "A sustainable campus energy forecasting architecture. Deploys LoRaWAN smart meters across academic departments to collect real-time electrical, thermal, and occupancy telemetry, predicting peak demand spikes 24 hours in advance with adaptive battery storage dispatch optimization.",
                "methodology": "Stage 1: Distributed LoRaWAN telemetry ingestion into Time-Series InfluxDB. Stage 2: Spatio-temporal Graph WaveNet modeling inter-building power correlations. Stage 3: Mixed-integer linear programming (MILP) for battery storage charging schedule. Stage 4: Department energy dashboard.",
                "tech_stack": "PyTorch, InfluxDB, LoRaWAN, Grafana, Flask, Scikit-learn",
                "datasets": ["Campus Smart Meter Energy Open Dataset", "NREL Commercial Building Energy Dataset"],
                "novelty_angle": "Spatio-temporal graph modeling achieving a 14.3% reduction in Mean Absolute Percentage Error (MAPE) compared to conventional LSTM architectures.",
                "evaluation_metrics": "MAPE (%), RMSE, Peak Demand Reduction (kW), Cost Savings (%)"
            }
        ]
    }

    # Pick matching domain or fallback to dynamic generator
    domain_catalog = idea_catalogs.get(domain)
    if domain_catalog:
        idea = random.choice(domain_catalog).copy()
    else:
        # Dynamic generator for custom domains
        idea = {
            "title": f"Adaptive {domain} Intelligence: Autonomous Multi-Modal Framework using Deep Optimization",
            "abstract": f"A state-of-the-art computational platform targeting real-world operational challenges in {domain}. Combines deep representation learning with low-latency edge deployment pipelines to provide scalable, explainable predictions with rigorous benchmark validation.",
            "methodology": f"Stage 1: Domain-specific data preprocessing and augmentation. Stage 2: Multi-branch feature extraction with {user_stack.split(',')[0]}. Stage 3: Optimization and latency benchmarking. Stage 4: Interactive deployment dashboard.",
            "tech_stack": f"{user_stack}, FastAPI, Docker, SQLite/PostgreSQL",
            "datasets": [f"Benchmark Open {domain} Repository", "Kaggle Curated Collection"],
            "novelty_angle": f"Novel algorithmic loss formulation tailored for high-accuracy low-latency performance in {domain}.",
            "evaluation_metrics": "F1-Score, Processing Latency (ms), Robustness, Accuracy"
        }

    # Format response
    idea["domain"] = domain
    idea["complexity"] = complexity
    idea["suggested_faculty"] = "Er. Mehraj U Din Mir (Lead AI Lecturer) & Department Mentors"
    idea["submission_ready"] = True

    return jsonify({"success": True, "idea": idea})

@app.post("/api/ai/analyze-proposal")
def api_ai_analyze_proposal():
    data = request.get_json(silent=True) or request.form
    title = data.get("title", "").strip()
    abstract = data.get("abstract", "").strip()
    tech_stack = data.get("tech_stack", "").strip()

    if not title or len(abstract.split()) < 15:
        return jsonify({
            "success": False,
            "message": "Please provide a valid project title and an abstract of at least 15 words for a meaningful evaluation."
        }), 400

    words = abstract.lower().split()
    word_count = len(words)

    # 1. Evaluate Innovation & Novelty (out of 35)
    innovation_keywords = ["novel", "transformer", "attention", "generative", "graph", "hybrid", "autonomous", "real-time", "edge", "quantum", "reinforcement", "federated", "diffusion", "contrastive", "ssl", "self-supervised"]
    inno_hits = sum(1 for kw in innovation_keywords if kw in abstract.lower())
    score_inno = min(35, max(12, int(15 + inno_hits * 3.5)))

    # 2. Evaluate Technical Architecture & Implementation (out of 40)
    tech_keywords = ["dataset", "pipeline", "model", "train", "loss", "accuracy", "algorithm", "inference", "latency", "quantization", "api", "framework", "architecture", "benchmark", "validation", "docker", "gpu"]
    tech_hits = sum(1 for kw in tech_keywords if kw in abstract.lower())
    score_tech = min(40, max(14, int(18 + tech_hits * 3.2)))

    # 3. Evaluate Presentation & Academic Structure (out of 25)
    # Check for abstract structure (problem, solution, methodology, evaluation)
    has_problem = any(w in abstract.lower() for w in ["problem", "challenge", "bottleneck", "issue", "limitation", "address", "aims to", "critical"])
    has_solution = any(w in abstract.lower() for w in ["propose", "develop", "system", "framework", "architecture", "presents", "introduce"])
    has_metrics = any(w in abstract.lower() for w in ["%", "accuracy", "latency", "f1", "precision", "recall", "fps", "performance", "metric"])
    
    score_pres = 12
    if word_count >= 50: score_pres += 3
    if word_count >= 100: score_pres += 2
    if has_problem: score_pres += 3
    if has_solution: score_pres += 3
    if has_metrics: score_pres += 2
    score_pres = min(25, score_pres)

    total_score = score_inno + score_tech + score_pres
    
    # Assign Grade
    if total_score >= 90:
        grade = "A+"
        grade_desc = "Outstanding — Ready for Faculty Sign-off & Public Showcase"
    elif total_score >= 80:
        grade = "A"
        grade_desc = "Distinction — Strong Technical & Methodological Foundation"
    elif total_score >= 70:
        grade = "B+"
        grade_desc = "Good — Meets Departmental Standards with Minor Enhancements"
    elif total_score >= 60:
        grade = "B"
        grade_desc = "Satisfactory — Acceptable, Needs Concrete Metric Specifications"
    elif total_score >= 50:
        grade = "C"
        grade_desc = "Pass — Basic Implementation, Needs Methodological Expansion"
    else:
        grade = "Needs Revision"
        grade_desc = "Revisions Required — Insufficient Technical Detail Provided"

    # Analyze Strengths
    strengths = []
    if inno_hits >= 2:
        strengths.append("Clear emphasis on contemporary AI techniques and architectural innovation.")
    if tech_hits >= 3:
        strengths.append("Concrete technical pipeline terminology and implementation awareness detected.")
    if word_count >= 60:
        strengths.append("Comprehensive academic abstract length offering adequate context.")
    if has_metrics:
        strengths.append("Identifies measurable target outcomes and quantifiable performance metrics.")
    if not strengths:
        strengths.append("Initial problem concept formulated; provides a viable starting point.")

    # Detect Missing Critical Elements
    missing = []
    if not has_problem:
        missing.append("Problem Statement: Explicitly define the specific real-world bottleneck or research gap being addressed.")
    if not any(w in abstract.lower() for w in ["dataset", "data", "corpus", "benchmark", "samples"]):
        missing.append("Data Source: Mention the public dataset, clinical database, or data synthesis pipeline utilized.")
    if not has_metrics:
        missing.append("Evaluation Metrics: Specify exact validation metrics (e.g. F1-score, mAP, Latency in ms, Frame Rate).")
    if not any(w in abstract.lower() for w in ["baseline", "compared to", "outperforms", "state-of-the-art", "sota"]):
        missing.append("Baseline Comparison: Mention existing standard approaches and how your proposed system improves upon them.")

    # Recommendations
    recommendations = [
        f"Incorporate specific hardware constraints (e.g., target FPS, memory footprint, edge compatibility with {tech_stack or 'PyTorch/TensorRT'}).",
        "Add a 1-sentence summary of the expected societal or departmental impact of this capstone.",
        "Ensure full alignment with the Department Rubric: Innovation (35%), Architecture (40%), and Documentation (25%)."
    ]

    return jsonify({
        "success": True,
        "total_score": total_score,
        "grade": grade,
        "grade_desc": grade_desc,
        "scores": {
            "innovation": score_inno,
            "technical": score_tech,
            "presentation": score_pres
        },
        "rubric_percentages": {
            "innovation_pct": round((score_inno / 35) * 100),
            "technical_pct": round((score_tech / 40) * 100),
            "presentation_pct": round((score_pres / 25) * 100)
        },
        "word_count": word_count,
        "strengths": strengths,
        "missing_elements": missing,
        "recommendations": recommendations
    })

@app.post("/api/ai/chat")
def api_ai_chat():
    data = request.get_json(silent=True) or request.form
    message = (data.get("message") or "").strip().lower()

    if not message:
        return jsonify({"reply": "Hello. I am the Department Academic Assistant for the Department of Artificial Intelligence & ICT. I can provide guidance regarding capstone project requirements, departmental evaluation rubrics, faculty research specializations, and departmental activities."})

    db = get_db()

    # Dynamic Department-Aware Academic Advisory Engine
    if any(k in message for k in ["mehraj", "mir", "lecturer", "faculty mentor"]):
        reply = (
            "### Faculty Profile: Er. Mehraj U Din Mir\n\n"
            "- **Academic Designation:** Lecturer & Lead Technical Mentor\n"
            "- **Department:** Department of Artificial Intelligence & ICT\n"
            "- **Research & Specialization Areas:** Edge Artificial Intelligence, Deep Neural Networks, Embedded Computer Vision, Real-Time Systems, and IoT Telemetry.\n"
            "- **Project Mentorship Scope:** Supervised capstone projects specializing in model quantization (TensorRT, TFLite), autonomous robotics, and applied medical informatics.\n"
            "- **Academic Advisory:** Students are advised to emphasize rigorous reproducible experimentation, modular architecture, and end-to-end evaluation metrics over theoretical-only drafts.\n\n"
            "Eligible students may designate Er. Mehraj U Din Mir as their project supervisor when filing proposal submissions in the **Student Dashboard**."
        )
    elif any(k in message for k in ["rubric", "grading", "score", "evaluate", "criteria"]):
        reply = (
            "### Departmental Capstone Project Rubric (100 Points Total)\n\n"
            "All capstone project proposals and final evaluations adhere to a structured 100-point institutional rubric:\n\n"
            "1. **Criterion 1: Innovation & Problem Formulation (35 Points)**\n"
            "   - Rigor and originality of the research problem or applied engineering challenge.\n"
            "   - Novelty in algorithmic composition, data synthesis, or edge computational optimization.\n\n"
            "2. **Criterion 2: Technical Architecture & Implementation (40 Points)**\n"
            "   - System modularity, clean API design, and robust error management.\n"
            "   - Model training validation, hyperparameter convergence, and reproducible pipelines.\n"
            "   - Verified functional prototype or executable demonstration.\n\n"
            "3. **Criterion 3: Presentation, Codebase & Documentation (25 Points)**\n"
            "   - Precision of abstract, methodological architecture diagrams, and formal literature citations.\n"
            "   - Repository cleanliness, reproducible README documentation, and testing coverage.\n\n"
            "Note: Project proposals can be audited prior to submission using the **Proposal Abstract Evaluator** tool."
        )
    elif any(k in message for k in ["club", "skill club", "register", "join club"]):
        reply = (
            "### AI Skill Club — Departmental Student Innovation Body\n\n"
            "The AI Skill Club serves as the collaborative technical community within the Department of Artificial Intelligence & ICT.\n\n"
            "- **Specialization Tracks:** Deep Learning with PyTorch, Natural Language Processing, Autonomous Systems, and Cloud MLOps.\n"
            "- **Objectives:** Laboratory access, technical workshop participation, peer research collaboration, and faculty mentorship.\n"
            "- **Registration Process:** Students may submit an expression of interest via the [AI Skill Club Registration Page](/club-register). Submissions are verified by faculty coordinators."
        )
    elif any(k in message for k in ["project", "submit", "proposal", "capstone", "guidelines"]):
        reply = (
            "### Capstone Project Submission & Approval Protocol\n\n"
            "1. **Access Student Portal:** Authenticate via the [Student Dashboard](/student).\n"
            "2. **Project Specification:** Document Title, Research Category, Abstract, Technology Stack, Repository Link, and Demonstration URL.\n"
            "3. **Faculty Mentor Assignment:** Select an approved departmental supervisor from the mentor directory.\n"
            "4. **Faculty Review:** The designated supervisor conducts an evaluation using the 100-point rubric studio.\n"
            "5. **Departmental Showcase:** Upon receiving formal approval, the project is indexed in the public [Department Projects Showcase](/projects) and assigned a permanent blueprint record."
        )
    elif any(k in message for k in ["activity", "event", "workshop", "hackathon", "certificate"]):
        reply = (
            "### Departmental Activities & Certificate Verification\n\n"
            "- View upcoming seminars, technical symposiums, and hackathons via the [Activities Directory](/activities).\n"
            "- After participation, students submit their proof of completion or certificate through the Student Dashboard.\n"
            "- Faculty mentors and department administrators audit submitted documentation, attach formal verification notes, and certify student participation."
        )
    elif any(k in message for k in ["supabase", "database", "sql", "cloud"]):
        reply = (
            "### Database Architecture & Cloud Synchronization\n\n"
            "- The portal operates on a dual-engine architecture: local SQLite persistence for high-speed local processing, integrated with a cloud-native **Supabase PostgreSQL** synchronization layer.\n"
            "- Relational schemas and Row-Level Security (RLS) policies are formally specified in `supabase_schema.sql`.\n"
            "- Administrators can monitor cloud endpoint connectivity and execute database synchronization from the Admin Control Center."
        )
    else:
        reply = (
            f"### Department Academic Advisory\n\n"
            f"Inquiry received regarding your query.\n\n"
            "Key institutional resources and tools:\n\n"
            "- **[Capstone Project Architecture Generator](/ai-tools)**: Structured project synthesis across Computer Vision, Language Models, and Edge AI.\n"
            "- **[Proposal Abstract Evaluator](/ai-tools)**: Instant algorithmic assessment against the 100-point departmental rubric.\n"
            "- **[Department Projects Directory](/projects)**: Catalog of verified student and faculty capstone initiatives.\n"
            "- **[Message Corner](/messages)**: Formal notices and circulars issued by department faculty.\n\n"
            "Please specify inquiries regarding specific curricula, laboratory resources, or faculty office hours."
        )

    return jsonify({"success": True, "reply": reply})

# -----------------------------------------------------------------------------
# DEPARTMENT VIRTUAL LAB ENGINE (Python, JavaScript, Scratch / Block Studio)
# -----------------------------------------------------------------------------
import subprocess, sys, time, tempfile, shutil

def run_sandboxed_python(code, project_files=None, active_filename="main.py", timeout=7):
    start = time.time()
    forbidden = ["shutil.rmtree", "os.system('rm", "os.system('del", "subprocess.Popen", "format C:", "socket.socket"]
    for word in forbidden:
        if word in code:
            return {
                "stdout": "",
                "stderr": f"Security Notice: Operation '{word}' is restricted in the student sandbox environment.",
                "exit_code": 1,
                "execution_time": round(time.time() - start, 3)
            }
            
    temp_dir = tempfile.mkdtemp()
    try:
        if project_files:
            for pf in project_files:
                if pf.get("is_folder"):
                    rel_folder = os.path.join(temp_dir, pf.get("folder_path", "/").strip("/\\"), pf["name"]).replace("\\", "/")
                    os.makedirs(rel_folder, exist_ok=True)
                else:
                    rel_dir = os.path.join(temp_dir, pf.get("folder_path", "/").strip("/\\"))
                    os.makedirs(rel_dir, exist_ok=True)
                    target_file = os.path.join(rel_dir, pf["name"])
                    content_to_write = code if pf["name"] == active_filename else (pf.get("content") or "")
                    with open(target_file, "w", encoding="utf-8") as f:
                        f.write(content_to_write)
        
        active_path = os.path.join(temp_dir, active_filename)
        if not os.path.exists(active_path):
            with open(active_path, "w", encoding="utf-8") as f:
                f.write(code)

        sandbox_env = os.environ.copy()
        sandbox_env["PYTHONIOENCODING"] = "utf-8"
        sandbox_env["PYTHONUTF8"] = "1"

        res = subprocess.run(
            [sys.executable, "-X", "utf8", active_filename],
            cwd=temp_dir,
            capture_output=True,
            encoding="utf-8",
            errors="replace",
            env=sandbox_env,
            timeout=timeout
        )
        elapsed = round(time.time() - start, 3)
        return {
            "stdout": res.stdout,
            "stderr": res.stderr,
            "exit_code": res.returncode,
            "execution_time": elapsed
        }
    except subprocess.TimeoutExpired:
        return {
            "stdout": "",
            "stderr": f"ExecutionError: Process timed out after {timeout} seconds.",
            "exit_code": 124,
            "execution_time": timeout
        }
    except Exception as e:
        return {
            "stdout": "",
            "stderr": f"RuntimeError: {str(e)}",
            "exit_code": 1,
            "execution_time": round(time.time() - start, 3)
        }
    finally:
        try:
            shutil.rmtree(temp_dir, ignore_errors=True)
        except Exception:
            pass

def create_default_virtual_project(db, student_id, title=None, language='python', description=None):
    if language not in ('python', 'javascript', 'block_scratch'):
        language = 'python'

    if not title:
        if language == 'python':
            title = "Autonomous AI & Python Engineering Lab"
            description = "Interactive Python workspace for deep learning and robotics simulation."
        elif language == 'javascript':
            title = "Interactive Web & Neural UI Lab"
            description = "Client-side telemetry, DOM manipulation, and interactive web sandbox."
        else:
            title = "Visual Robotics & Block Studio"
            description = "Block-based visual coding canvas generating real-time Python logic."

    cur = db.execute("""
        INSERT INTO virtual_lab_projects (student_id, title, description, language, share_status)
        VALUES (?, ?, ?, ?, 'Draft')
    """, (student_id, title, description or "", language))
    project_id = cur.lastrowid

    if language == 'python':
        main_code = '''# =========================================================================
# Department of AI & ICT — Student Virtual Lab
# Environment: Python 3.10 Engineering Runtime
# =========================================================================

import sys
import math
from utils.helpers import compute_telemetry, neural_activation

def main():
    print("🚀 AI & ICT Virtual Lab initialized successfully!")
    print(f"📌 Python Interpreter: {sys.version.split()[0]}")
    print("-" * 55)

    # Sample Telemetry Data
    sensor_stream = [14.2, 18.5, 21.0, 19.8, 25.4, 27.1, 23.9]
    avg_val, peak_val, variance = compute_telemetry(sensor_stream)
    print(f"📊 Sensor Stream: {sensor_stream}")
    print(f"📈 Mean: {avg_val:.2f} | Peak: {peak_val:.2f} | Variance: {variance:.2f}")

    # Neural Sigmoid Inference
    logits = [-2.0, -0.5, 0.0, 1.2, 3.5]
    activations = [round(neural_activation(z), 4) for z in logits]
    print(f"🧠 Sigmoid Activations {logits} -> {activations}")

    print("-" * 55)
    print("✅ Program finished with return code 0.")

if __name__ == "__main__":
    main()
'''
        helpers_code = '''# Mathematical & Neural Helpers Module
import math

def compute_telemetry(data):
    if not data:
        return 0, 0, 0
    mean_val = sum(data) / len(data)
    peak_val = max(data)
    variance = sum((x - mean_val) ** 2 for x in data) / len(data)
    return mean_val, peak_val, variance

def neural_activation(z):
    """Computes standard logistic sigmoid."""
    return 1.0 / (1.0 + math.exp(-z))
'''
        readme_code = '''# Python 3 Engineering Lab
*Department of AI & ICT — Green Valley Educational Institute*

## Project Structure
- `main.py`: Main entry point with sensor calculations.
- `utils/helpers.py`: Utility functions and telemetry processing.

## Instructions
1. Write and edit code in the center editor.
2. Press **Run Code** (`Ctrl + Enter`) to execute in the integrated terminal.
3. Click **Share with Teacher** to select your mentor from the dropdown and submit your code!
'''
        db.execute("""
            INSERT INTO virtual_lab_files (project_id, name, folder_path, content, is_folder, file_type)
            VALUES (?, 'main.py', '/', ?, 0, 'python')
        """, (project_id, main_code))
        db.execute("""
            INSERT INTO virtual_lab_files (project_id, name, folder_path, content, is_folder, file_type)
            VALUES (?, 'utils', '/', '', 1, 'folder')
        """, (project_id,))
        db.execute("""
            INSERT INTO virtual_lab_files (project_id, name, folder_path, content, is_folder, file_type)
            VALUES (?, 'helpers.py', '/utils', ?, 0, 'python')
        """, (project_id, helpers_code))
        db.execute("""
            INSERT INTO virtual_lab_files (project_id, name, folder_path, content, is_folder, file_type)
            VALUES (?, 'README.md', '/', ?, 0, 'markdown')
        """, (project_id, readme_code))

    elif language == 'javascript':
        index_html = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Virtual Lab - JavaScript Sandbox</title>
  <link rel="stylesheet" href="styles/style.css">
</head>
<body>
  <div class="app-container">
    <h2>⚡ AI & ICT JavaScript Lab</h2>
    <p>Client-side telemetry and real-time computation.</p>
    <button id="runBtn" class="primary-btn">Calculate Telemetry</button>
    <div id="outputLog" class="terminal-log">Press the button above to begin...</div>
  </div>
  <script src="script.js"></script>
</body>
</html>
'''
        script_js = '''console.log("⚡ JavaScript Lab Runtime Active.");

function computeTelemetry() {
  const readings = [42.5, 38.9, 55.1, 62.4, 49.0];
  const sum = readings.reduce((a, b) => a + b, 0);
  const avg = (sum / readings.length).toFixed(2);
  
  console.log("📊 Telemetry data:", readings);
  console.log("📈 Calculated Mean:", avg);

  const logEl = document.getElementById("outputLog");
  if (logEl) {
    logEl.innerHTML = `<strong>Telemetry Analysis:</strong><br>Readings: [${readings.join(', ')}]<br>Mean Value: <strong>${avg}</strong>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("runBtn");
  if (btn) btn.addEventListener("click", computeTelemetry);
});
'''
        style_css = '''body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #090e18;
  color: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin: 0;
}
.app-container {
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 12px;
  padding: 24px;
  max-width: 480px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
}
.primary-btn {
  background: #2563eb;
  color: white;
  border: 1px solid #3b82f6;
  padding: 8px 18px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin: 12px 0;
}
.terminal-log {
  background: #030712;
  border: 1px solid #1e293b;
  border-radius: 6px;
  padding: 12px;
  font-family: monospace;
  font-size: 0.85rem;
  color: #38bdf8;
  text-align: left;
}
'''
        readme_code = '''# JavaScript & Web Engineering Lab
*Department of AI & ICT*

- `index.html`: Web page interface
- `script.js`: Client-side logic and event listeners
- `styles/style.css`: Modern visual styling
'''
        db.execute("""
            INSERT INTO virtual_lab_files (project_id, name, folder_path, content, is_folder, file_type)
            VALUES (?, 'index.html', '/', ?, 0, 'html')
        """, (project_id, index_html))
        db.execute("""
            INSERT INTO virtual_lab_files (project_id, name, folder_path, content, is_folder, file_type)
            VALUES (?, 'script.js', '/', ?, 0, 'javascript')
        """, (project_id, script_js))
        db.execute("""
            INSERT INTO virtual_lab_files (project_id, name, folder_path, content, is_folder, file_type)
            VALUES (?, 'styles', '/', '', 1, 'folder')
        """, (project_id,))
        db.execute("""
            INSERT INTO virtual_lab_files (project_id, name, folder_path, content, is_folder, file_type)
            VALUES (?, 'style.css', '/styles', ?, 0, 'css')
        """, (project_id, style_css))
        db.execute("""
            INSERT INTO virtual_lab_files (project_id, name, folder_path, content, is_folder, file_type)
            VALUES (?, 'README.md', '/', ?, 0, 'markdown')
        """, (project_id, readme_code))

    else:
        # Block / Scratch Studio
        blocks_data = json.dumps([
            {"id": "b1", "type": "event_start", "text": "When Program Starts", "category": "events"},
            {"id": "b2", "type": "var_set", "var": "sensor_reading", "value": "24.5", "category": "math"},
            {"id": "b3", "type": "loop_repeat", "times": "3", "category": "loops"},
            {"id": "b4", "type": "action_print", "message": "Telemetry loop active: Sensor = {sensor_reading}", "category": "output"},
            {"id": "b5", "type": "var_change", "var": "sensor_reading", "delta": "1.2", "category": "math"},
            {"id": "b6", "type": "action_print", "message": "✅ Block sequence completed.", "category": "output"}
        ], indent=2)

        py_compiled = '''# Auto-generated code from Scratch / Block Canvas
# Department of AI & ICT Block Studio

print("🚀 Starting Block Program Execution...")
sensor_reading = 24.5

for i in range(3):
    print(f"Telemetry loop active: Sensor = {sensor_reading}")
    sensor_reading += 1.2

print("✅ Block sequence completed.")
'''
        readme_code = '''# Visual Block & Scratch Studio
*Department of AI & ICT*

Use the visual block canvas to construct algorithms by dragging or snapping logic blocks.
Code is automatically compiled into clean Python and can be run with one click!
'''
        db.execute("""
            INSERT INTO virtual_lab_files (project_id, name, folder_path, content, is_folder, file_type)
            VALUES (?, 'main.blocks', '/', ?, 0, 'block_scratch')
        """, (project_id, blocks_data))
        db.execute("""
            INSERT INTO virtual_lab_files (project_id, name, folder_path, content, is_folder, file_type)
            VALUES (?, 'generated.py', '/', ?, 0, 'python')
        """, (project_id, py_compiled))
        db.execute("""
            INSERT INTO virtual_lab_files (project_id, name, folder_path, content, is_folder, file_type)
            VALUES (?, 'README.md', '/', ?, 0, 'markdown')
        """, (project_id, readme_code))

    return project_id

@app.route("/virtual-lab")
@login_required
def virtual_lab():
    db = get_db()
    user = session["user"]
    uid = user["id"]
    is_faculty = user["role"] in ("faculty", "admin")

    project_id = request.args.get("project_id", type=int)
    active_project = None

    if project_id:
        if user["role"] == "admin":
            active_project = db.execute("""
                SELECT p.*, s.name as student_name, s.email as student_email, s.roll_no as student_roll_no, s.class_name as student_class,
                       f.name as faculty_name
                FROM virtual_lab_projects p
                JOIN users s ON s.id = p.student_id
                LEFT JOIN users f ON f.id = p.shared_faculty_id
                WHERE p.id = ?
            """, (project_id,)).fetchone()
        elif is_faculty:
            active_project = db.execute("""
                SELECT p.*, s.name as student_name, s.email as student_email, s.roll_no as student_roll_no, s.class_name as student_class,
                       f.name as faculty_name
                FROM virtual_lab_projects p
                JOIN users s ON s.id = p.student_id
                LEFT JOIN users f ON f.id = p.shared_faculty_id
                WHERE p.id = ? AND (p.shared_faculty_id = ? OR p.student_id = ?)
            """, (project_id, uid, uid)).fetchone()
        else:
            active_project = db.execute("""
                SELECT p.*, s.name as student_name, s.email as student_email, s.roll_no as student_roll_no, s.class_name as student_class,
                       f.name as faculty_name
                FROM virtual_lab_projects p
                JOIN users s ON s.id = p.student_id
                LEFT JOIN users f ON f.id = p.shared_faculty_id
                WHERE p.id = ? AND p.student_id = ?
            """, (project_id, uid)).fetchone()

    # If no active project found or requested, find most recent
    if not active_project and not is_faculty:
        recent = db.execute("SELECT id FROM virtual_lab_projects WHERE student_id = ? ORDER BY updated_at DESC LIMIT 1", (uid,)).fetchone()
        if recent:
            return redirect(url_for("virtual_lab", project_id=recent["id"]))
        else:
            new_id = create_default_virtual_project(db, uid, "AI & Python Engineering Lab", "python", "Introductory virtual lab workspace for algorithm development and testing.")
            db.commit()
            return redirect(url_for("virtual_lab", project_id=new_id))

    if not active_project and is_faculty:
        shared = db.execute("""
            SELECT id FROM virtual_lab_projects 
            WHERE (shared_faculty_id = ? OR ? IN (SELECT id FROM users WHERE role='admin'))
              AND share_status IN ('Shared', 'Reviewed')
            ORDER BY submitted_at DESC LIMIT 1
        """, (uid, uid)).fetchone()
        if shared:
            return redirect(url_for("virtual_lab", project_id=shared["id"]))
        else:
            new_id = create_default_virtual_project(db, uid, "Faculty Sandbox Lab", "python", "Faculty experimental testing laboratory.")
            db.commit()
            return redirect(url_for("virtual_lab", project_id=new_id))

    # Fetch project files & folders
    files = [dict(r) for r in db.execute("""
        SELECT * FROM virtual_lab_files 
        WHERE project_id = ? 
        ORDER BY is_folder DESC, folder_path ASC, name ASC
    """, (active_project["id"],)).fetchall()]

    # User's accessible projects
    if is_faculty and user["role"] == "admin":
        user_projects = db.execute("""
            SELECT p.*, s.name as student_name FROM virtual_lab_projects p
            JOIN users s ON s.id = p.student_id
            ORDER BY p.updated_at DESC
        """).fetchall()
    elif is_faculty:
        user_projects = db.execute("""
            SELECT p.*, s.name as student_name FROM virtual_lab_projects p
            JOIN users s ON s.id = p.student_id
            WHERE p.shared_faculty_id = ? OR p.student_id = ?
            ORDER BY p.updated_at DESC
        """, (uid, uid)).fetchall()
    else:
        user_projects = db.execute("""
            SELECT * FROM virtual_lab_projects WHERE student_id = ? ORDER BY updated_at DESC
        """, (uid,)).fetchall()

    # Faculty list for "Share with Teacher" dropdown
    faculty_mentors = db.execute("""
        SELECT id, name, designation, email, avatar, specialization
        FROM users
        WHERE role IN ('faculty', 'admin') AND status = 'Approved'
        ORDER BY CASE WHEN role='admin' THEN 0 ELSE 1 END, id ASC
    """).fetchall()

    folders = [f for f in files if f.get("is_folder")]

    return render_template(
        "virtual_lab.html",
        project=active_project,
        files=files,
        folders=folders,
        user_projects=user_projects,
        faculty_mentors=faculty_mentors,
        is_faculty=is_faculty
    )

@app.post("/virtual-lab/project/create")
@login_required
def virtual_lab_create_project():
    db = get_db()
    uid = session["user"]["id"]
    
    if request.is_json:
        data = request.get_json() or {}
        title = data.get("title", "").strip()
        description = data.get("description", "").strip()
        language = data.get("language", "python").strip()
    else:
        title = request.form.get("title", "").strip()
        description = request.form.get("description", "").strip()
        language = request.form.get("language", "python").strip()

    if not title:
        title = f"Project {datetime.now().strftime('%b %d, %H:%M')}"

    new_id = create_default_virtual_project(db, uid, title, language, description)
    db.commit()

    if request.is_json:
        return jsonify({"success": True, "project_id": new_id, "redirect_url": url_for("virtual_lab", project_id=new_id)})
    
    flash(f"Virtual Lab Project '{title}' created successfully!", "success")
    return redirect(url_for("virtual_lab", project_id=new_id))

@app.post("/virtual-lab/project/<int:project_id>/delete")
@login_required
def virtual_lab_delete_project(project_id):
    db = get_db()
    uid = session["user"]["id"]
    is_admin = session["user"]["role"] == "admin"

    proj = db.execute("SELECT * FROM virtual_lab_projects WHERE id = ?", (project_id,)).fetchone()
    if not proj or (proj["student_id"] != uid and not is_admin):
        return jsonify({"success": False, "error": "Unauthorized"}), 403

    db.execute("DELETE FROM virtual_lab_projects WHERE id = ?", (project_id,))
    db.commit()

    if request.is_json:
        return jsonify({"success": True, "message": "Project deleted successfully"})
    
    flash("Project deleted.", "info")
    return redirect(url_for("virtual_lab"))

@app.post("/virtual-lab/file/create")
@login_required
def virtual_lab_create_file():
    db = get_db()
    uid = session["user"]["id"]
    data = request.get_json() or request.form

    project_id = int(data.get("project_id", 0))
    name = data.get("name", "").strip()
    folder_path = data.get("folder_path", "/").strip() or "/"
    is_folder = int(data.get("is_folder", 0))
    content = data.get("content", "")
    file_type = data.get("file_type", "")

    if not name:
        return jsonify({"success": False, "error": "Name is required"}), 400

    # Auto-detect file type from extension if not given
    if not is_folder and not file_type:
        if name.endswith(".py"):
            file_type = "python"
        elif name.endswith(".js"):
            file_type = "javascript"
        elif name.endswith(".html") or name.endswith(".htm"):
            file_type = "html"
        elif name.endswith(".css"):
            file_type = "css"
        elif name.endswith(".json"):
            file_type = "json"
        elif name.endswith(".blocks"):
            file_type = "block_scratch"
        elif name.endswith(".md"):
            file_type = "markdown"
        else:
            file_type = "code"

    proj = db.execute("SELECT * FROM virtual_lab_projects WHERE id = ?", (project_id,)).fetchone()
    if not proj or (proj["student_id"] != uid and session["user"]["role"] != "admin"):
        return jsonify({"success": False, "error": "Unauthorized"}), 403

    cur = db.execute("""
        INSERT INTO virtual_lab_files (project_id, name, folder_path, content, is_folder, file_type)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (project_id, name, folder_path, content, is_folder, file_type or "file"))
    new_file_id = cur.lastrowid
    db.execute("UPDATE virtual_lab_projects SET updated_at = CURRENT_TIMESTAMP WHERE id = ?", (project_id,))
    db.commit()

    return jsonify({
        "success": True,
        "file": {
            "id": new_file_id,
            "project_id": project_id,
            "name": name,
            "folder_path": folder_path,
            "content": content,
            "is_folder": is_folder,
            "file_type": file_type
        }
    })

@app.post("/virtual-lab/file/save")
@login_required
def virtual_lab_save_file():
    db = get_db()
    uid = session["user"]["id"]
    data = request.get_json() or {}

    file_id = int(data.get("file_id", 0))
    content = data.get("content", "")

    file_row = db.execute("""
        SELECT f.*, p.student_id 
        FROM virtual_lab_files f
        JOIN virtual_lab_projects p ON p.id = f.project_id
        WHERE f.id = ?
    """, (file_id,)).fetchone()

    if not file_row:
        return jsonify({"success": False, "error": "File not found"}), 404

    if file_row["student_id"] != uid and session["user"]["role"] != "admin":
        return jsonify({"success": False, "error": "Unauthorized"}), 403

    db.execute("""
        UPDATE virtual_lab_files 
        SET content = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
    """, (content, file_id))
    db.execute("""
        UPDATE virtual_lab_projects 
        SET updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
    """, (file_row["project_id"],))
    db.commit()

    return jsonify({"success": True, "message": "File saved successfully", "saved_at": datetime.now().strftime("%H:%M:%S")})

@app.post("/virtual-lab/file/delete")
@login_required
def virtual_lab_delete_file():
    db = get_db()
    uid = session["user"]["id"]
    data = request.get_json() or {}

    file_id = int(data.get("file_id", 0))

    file_row = db.execute("""
        SELECT f.*, p.student_id 
        FROM virtual_lab_files f
        JOIN virtual_lab_projects p ON p.id = f.project_id
        WHERE f.id = ?
    """, (file_id,)).fetchone()

    if not file_row:
        return jsonify({"success": False, "error": "File not found"}), 404

    if file_row["student_id"] != uid and session["user"]["role"] != "admin":
        return jsonify({"success": False, "error": "Unauthorized"}), 403

    if file_row["is_folder"]:
        # Delete folder and nested contents
        folder_prefix = (file_row["folder_path"].rstrip("/") + "/" + file_row["name"]).rstrip("/")
        db.execute("""
            DELETE FROM virtual_lab_files 
            WHERE project_id = ? AND (folder_path = ? OR folder_path LIKE ?)
        """, (file_row["project_id"], folder_prefix, folder_prefix + "/%"))

    db.execute("DELETE FROM virtual_lab_files WHERE id = ?", (file_id,))
    db.execute("UPDATE virtual_lab_projects SET updated_at = CURRENT_TIMESTAMP WHERE id = ?", (file_row["project_id"],))
    db.commit()

    return jsonify({"success": True, "message": "Item deleted"})

@app.post("/virtual-lab/file/rename")
@login_required
def virtual_lab_rename_file():
    db = get_db()
    uid = session["user"]["id"]
    data = request.get_json() or {}

    file_id = int(data.get("file_id", 0))
    new_name = data.get("new_name", "").strip()

    if not new_name:
        return jsonify({"success": False, "error": "New name is required"}), 400

    file_row = db.execute("""
        SELECT f.*, p.student_id 
        FROM virtual_lab_files f
        JOIN virtual_lab_projects p ON p.id = f.project_id
        WHERE f.id = ?
    """, (file_id,)).fetchone()

    if not file_row or (file_row["student_id"] != uid and session["user"]["role"] != "admin"):
        return jsonify({"success": False, "error": "Unauthorized"}), 403

    db.execute("""
        UPDATE virtual_lab_files 
        SET name = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
    """, (new_name, file_id))
    db.execute("UPDATE virtual_lab_projects SET updated_at = CURRENT_TIMESTAMP WHERE id = ?", (file_row["project_id"],))
    db.commit()

    return jsonify({"success": True, "name": new_name})

@app.post("/virtual-lab/project/<int:project_id>/share")
@login_required
def virtual_lab_share_with_teacher(project_id):
    db = get_db()
    uid = session["user"]["id"]
    data = request.get_json() or request.form

    faculty_id = int(data.get("faculty_id", 0))
    submission_notes = data.get("note", "").strip()

    proj = db.execute("SELECT * FROM virtual_lab_projects WHERE id = ?", (project_id,)).fetchone()
    if not proj or (proj["student_id"] != uid and session["user"]["role"] != "admin"):
        return jsonify({"success": False, "error": "Unauthorized"}), 403

    # Verify teacher exists
    teacher = db.execute("SELECT id, name, email FROM users WHERE id = ? AND role IN ('faculty', 'admin')", (faculty_id,)).fetchone()
    if not teacher:
        return jsonify({"success": False, "error": "Selected teacher is not a valid faculty mentor."}), 400

    db.execute("""
        UPDATE virtual_lab_projects
        SET shared_faculty_id = ?,
            share_status = 'Shared',
            submission_notes = ?,
            submitted_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    """, (faculty_id, submission_notes, project_id))

    # Real-time synchronization notification to faculty mentor's academic message corner
    try:
        student = db.execute("SELECT name, roll_no, class_name FROM users WHERE id = ?", (uid,)).fetchone()
        student_tag = f"{student['name']} ({student['roll_no'] or 'Student'})" if student else "Student"
        msg_text = f"Virtual Lab Submission: Student {student_tag} submitted project '{proj['title']}' for your faculty evaluation. Remarks: {submission_notes or 'Workspace submitted for formal evaluation.'}"
        db.execute("""
            INSERT INTO messages (faculty_id, title, content, category, priority, is_active, created_at)
            VALUES (?, ?, ?, 'Advisory', 'Important', 1, CURRENT_TIMESTAMP)
        """, (faculty_id, f"Virtual Lab Submission: {proj['title']}", msg_text))
    except Exception:
        pass

    db.commit()

    # Cloud sync pipeline: If Supabase Cloud is configured, sync project & files immediately
    try:
        supabase_client = get_supabase()
        if supabase_client:
            updated_proj = dict(db.execute("SELECT * FROM virtual_lab_projects WHERE id = ?", (project_id,)).fetchone())
            supabase_client.table("virtual_lab_projects").upsert([updated_proj]).execute()
            files_rows = [dict(r) for r in db.execute("SELECT * FROM virtual_lab_files WHERE project_id = ?", (project_id,)).fetchall()]
            if files_rows:
                supabase_client.table("virtual_lab_files").upsert(files_rows).execute()
    except Exception:
        pass

    return jsonify({
        "success": True,
        "message": f"Project successfully submitted and synced with {teacher['name']}. Your mentor has been notified to evaluate your code files.",
        "teacher_name": teacher["name"],
        "submission_notes": submission_notes,
        "share_status": "Shared",
        "submitted_at": datetime.now().strftime("%Y-%m-%d %H:%M")
    })

@app.post("/virtual-lab/execute-python")
@login_required
def virtual_lab_execute_python():
    data = request.get_json() or {}
    code = data.get("code", "")
    project_id = data.get("project_id")
    active_filename = data.get("filename", "main.py")

    if not code.strip():
        return jsonify({"stdout": "", "stderr": "No code provided to execute.", "exit_code": 0, "execution_time": 0.0})

    project_files = []
    if project_id:
        try:
            db = get_db()
            rows = db.execute("SELECT * FROM virtual_lab_files WHERE project_id = ?", (project_id,)).fetchall()
            project_files = [dict(r) for r in rows]
        except Exception:
            project_files = []

    result = run_sandboxed_python(code, project_files=project_files, active_filename=active_filename)
    return jsonify(result)

@app.post("/faculty/virtual-lab/grade")
@faculty_required
def faculty_virtual_lab_grade():
    db = get_db()
    fid = session["user"]["id"]
    is_admin = session["user"]["role"] == "admin"
    
    if request.is_json:
        data = request.get_json() or {}
    else:
        data = request.form

    project_id = int(data.get("project_id", 0))
    grade = data.get("grade", "A").strip()
    feedback = data.get("feedback", "").strip()
    status = data.get("status", "Reviewed").strip()

    proj = db.execute("SELECT * FROM virtual_lab_projects WHERE id = ?", (project_id,)).fetchone()
    if not proj:
        return jsonify({"success": False, "error": "Project not found"}), 404

    if proj["shared_faculty_id"] != fid and not is_admin:
        return jsonify({"success": False, "error": "This project was not shared with you."}), 403

    db.execute("""
        UPDATE virtual_lab_projects
        SET faculty_grade = ?,
            faculty_feedback = ?,
            share_status = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    """, (grade, feedback, status, project_id))
    db.commit()

    if request.is_json:
        return jsonify({"success": True, "message": "Code review and evaluation recorded successfully."})
    
    flash(f"Code review recorded: Grade {grade} for Project #{project_id}.", "success")
    return redirect(url_for("faculty_dashboard"))

if __name__ == "__main__":
    with app.app_context():
        init_db()
    app.run(debug=True)