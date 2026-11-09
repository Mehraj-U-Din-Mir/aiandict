-- ==============================================================================
-- AI & ICT DEPARTMENT PORTAL — COMPLETE SUPABASE / POSTGRESQL SCHEMA
-- Supports: Authentication, Role-based Access, Project Submissions & Approvals,
-- Faculty Message Corner, Dynamic Achievements, Activities, and AI Skill Club.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUM TYPES
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'faculty', 'student');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_status') THEN
        CREATE TYPE account_status AS ENUM ('Pending', 'Approved', 'Rejected', 'Suspended');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'approval_status') THEN
        CREATE TYPE approval_status AS ENUM ('Pending', 'Under Review', 'Approved', 'Needs Revision', 'Rejected');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'message_priority') THEN
        CREATE TYPE message_priority AS ENUM ('Normal', 'Important', 'Urgent');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'message_category') THEN
        CREATE TYPE message_category AS ENUM ('Announcement', 'Advisory', 'Project Opportunity', 'Deadline Alert', 'Research');
    END IF;
END $$;

-- 3. USERS TABLE
-- Synced with Supabase Auth or used standalone
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Optional Supabase Auth link
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    status account_status NOT NULL DEFAULT 'Approved',
    designation VARCHAR(150) DEFAULT 'Student',
    department VARCHAR(150) DEFAULT 'AI & ICT Department',
    specialization VARCHAR(255) DEFAULT 'Artificial Intelligence & Data Science',
    phone VARCHAR(50),
    whatsapp_no VARCHAR(50) DEFAULT '',
    avatar_url TEXT DEFAULT '/static/img/default-avatar.png',
    bio TEXT,
    class_name VARCHAR(150) DEFAULT '',
    roll_no VARCHAR(100) DEFAULT '',
    section VARCHAR(50) DEFAULT '',
    qualification VARCHAR(255) DEFAULT '',
    experience VARCHAR(255) DEFAULT '',
    office_room VARCHAR(100) DEFAULT '',
    linkedin_url TEXT DEFAULT '',
    github_url TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3B. INNOVATION CLUB SHOWCASES TABLE
CREATE TABLE IF NOT EXISTS innovation_club_showcases (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(150) NOT NULL,
    lead_student VARCHAR(255) NOT NULL,
    mentor_name VARCHAR(255) DEFAULT 'Er. Mehraj U Din Mir (HOD AI&ICT GVEI)',
    abstract TEXT NOT NULL,
    tech_stack VARCHAR(255),
    demo_url TEXT,
    github_url TEXT,
    image_url TEXT DEFAULT '/static/img/club.jpg',
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. DEPARTMENT ACHIEVEMENTS TABLE (Managed by Admin -> Displayed on Landing Page)
CREATE TABLE IF NOT EXISTS achievements (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Hackathon',
    badge VARCHAR(100) DEFAULT '1st Place',
    date VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT DEFAULT '/static/img/nit.jpg',
    is_featured BOOLEAN DEFAULT TRUE,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. FACULTY MESSAGE CORNER TABLE (Created by Faculty -> Displayed on Landing Page & Portals)
CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    faculty_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category message_category NOT NULL DEFAULT 'Announcement',
    priority message_priority NOT NULL DEFAULT 'Normal',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. STUDENT PROJECTS TABLE (Submitted by Students -> Supervised & Approved by Faculty/Admin)
CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- e.g. 'Deep Learning', 'Computer Vision', 'IoT & Robotics', 'NLP & LLMs'
    abstract TEXT NOT NULL,
    tech_stack VARCHAR(255), -- e.g. 'Python, PyTorch, FastAPI, React'
    github_url TEXT,
    demo_url TEXT,
    document_url TEXT,
    student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    faculty_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    status approval_status NOT NULL DEFAULT 'Pending',
    feedback TEXT,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    score_innovation INTEGER CHECK (score_innovation >= 0 AND score_innovation <= 10) DEFAULT 0,
    score_technical INTEGER CHECK (score_technical >= 0 AND score_technical <= 10) DEFAULT 0,
    score_presentation INTEGER CHECK (score_presentation >= 0 AND score_presentation <= 10) DEFAULT 0,
    grade VARCHAR(20) DEFAULT 'Pending',
    methodology TEXT,
    architecture_diagram TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. ACTIVITIES / EVENTS TABLE
CREATE TABLE IF NOT EXISTS activities (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date VARCHAR(50) NOT NULL,
    category VARCHAR(100) DEFAULT 'Workshop',
    location VARCHAR(200) DEFAULT 'AI Lab / Seminar Hall',
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. ACTIVITY PARTICIPATIONS TABLE
CREATE TABLE IF NOT EXISTS participations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_id BIGINT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    proof TEXT NOT NULL,
    notes TEXT,
    status approval_status NOT NULL DEFAULT 'Pending',
    verifier_notes TEXT,
    verified_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. AI SKILL CLUB REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS club_registrations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    year VARCHAR(50) NOT NULL,
    interests TEXT,
    note TEXT,
    status approval_status NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9B. VIRTUAL LAB PROJECTS TABLE
CREATE TABLE IF NOT EXISTS virtual_lab_projects (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    language VARCHAR(50) NOT NULL DEFAULT 'python',
    shared_faculty_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    share_status VARCHAR(50) NOT NULL DEFAULT 'Draft',
    submission_notes TEXT DEFAULT NULL,
    faculty_feedback TEXT,
    faculty_grade VARCHAR(20),
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9C. VIRTUAL LAB FILES TABLE
CREATE TABLE IF NOT EXISTS virtual_lab_files (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES virtual_lab_projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    folder_path VARCHAR(255) NOT NULL DEFAULT '/',
    content TEXT DEFAULT '',
    is_folder SMALLINT NOT NULL DEFAULT 0,
    file_type VARCHAR(50) DEFAULT 'python',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9B. DEPARTMENTAL DOCUMENTS TABLE (Official Protected Document Archive)
CREATE TABLE IF NOT EXISTS departmental_documents (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(150) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size VARCHAR(50) DEFAULT '1.2 MB',
    version VARCHAR(50) DEFAULT 'v1.0',
    description TEXT,
    uploaded_by VARCHAR(255) DEFAULT 'Er. Mehraj U Din Mir (HOD AI&ICT GVEI)',
    is_confidential BOOLEAN DEFAULT FALSE,
    downloads_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. INDEXES FOR PERFORMANCE & RELATIONAL QUERIES
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_projects_student ON projects(student_id);
CREATE INDEX IF NOT EXISTS idx_projects_faculty ON projects(faculty_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_messages_faculty ON messages(faculty_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_achievements_featured ON achievements(is_featured);
CREATE INDEX IF NOT EXISTS idx_virtual_lab_projects_student ON virtual_lab_projects(student_id);
CREATE INDEX IF NOT EXISTS idx_virtual_lab_projects_faculty ON virtual_lab_projects(shared_faculty_id);
CREATE INDEX IF NOT EXISTS idx_virtual_lab_projects_status ON virtual_lab_projects(share_status);
CREATE INDEX IF NOT EXISTS idx_virtual_lab_files_proj ON virtual_lab_files(project_id);
CREATE INDEX IF NOT EXISTS idx_dept_docs_category ON departmental_documents(category);
CREATE INDEX IF NOT EXISTS idx_dept_docs_created ON departmental_documents(created_at DESC);

-- 11. AUTOMATIC TIMESTAMP TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
    DROP TRIGGER IF EXISTS trigger_users_updated ON users;
    CREATE TRIGGER trigger_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS trigger_projects_updated ON projects;
    CREATE TRIGGER trigger_projects_updated BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS trigger_messages_updated ON messages;
    CREATE TRIGGER trigger_messages_updated BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS trigger_achievements_updated ON achievements;
    CREATE TRIGGER trigger_achievements_updated BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS trigger_virtual_lab_projects_updated ON virtual_lab_projects;
    CREATE TRIGGER trigger_virtual_lab_projects_updated BEFORE UPDATE ON virtual_lab_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS trigger_virtual_lab_files_updated ON virtual_lab_files;
    CREATE TRIGGER trigger_virtual_lab_files_updated BEFORE UPDATE ON virtual_lab_files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS trigger_departmental_documents_updated ON departmental_documents;
    CREATE TRIGGER trigger_departmental_documents_updated BEFORE UPDATE ON departmental_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
END $$;

-- 12. ROW LEVEL SECURITY (RLS) POLICIES FOR SUPABASE
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_lab_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_lab_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE departmental_documents ENABLE ROW LEVEL SECURITY;

-- Public can read achievements, active messages, activities, faculty profiles, and departmental documents
CREATE POLICY "Public can view achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Public can view active messages" ON messages FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view activities" ON activities FOR SELECT USING (true);
CREATE POLICY "Public can view faculty directory" ON users FOR SELECT USING (role = 'faculty');
CREATE POLICY "Public can view approved projects" ON projects FOR SELECT USING (status = 'Approved');
CREATE POLICY "Public can view departmental documents" ON departmental_documents FOR SELECT USING (true);

-- Authenticated Users Policies
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = auth_user_id);
CREATE POLICY "Students can view and create their projects" ON projects FOR ALL USING (student_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Faculty can view and manage supervised projects" ON projects FOR ALL USING (faculty_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Faculty can manage messages" ON messages FOR ALL USING (faculty_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Students can view and manage their lab projects" ON virtual_lab_projects FOR ALL USING (student_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Faculty can view shared lab projects" ON virtual_lab_projects FOR ALL USING (shared_faculty_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users can access lab files of their projects" ON virtual_lab_files FOR ALL USING (project_id IN (SELECT id FROM virtual_lab_projects WHERE student_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()) OR shared_faculty_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())));

-- ==============================================================================
-- 13. SEED INITIAL DATA (ADMIN, FACULTY, ACHIEVEMENTS, ACTIVITIES, SAMPLE PROJECT)
-- ==============================================================================

-- Primary Admin: Er. Mehraj U Din Mir (adminaiict@gvei.com / Admin@gveiAIICT@Mehraj123)
INSERT INTO users (name, email, password_hash, role, status, designation, department, specialization, phone, whatsapp_no, avatar_url, bio)
VALUES (
    'Er. Mehraj U Din Mir',
    'adminaiict@gvei.com',
    'pbkdf2:sha256:600000$admin_hash_placeholder',
    'admin',
    'Approved',
    'HOD AI & ICT GVEI',
    'Department of AI & ICT, Green Valley Educational Institute (GVEI)',
    'Artificial Intelligence, Deep Learning & ICT Systems',
    '+91-94190-00000',
    '+91-94190-00000',
    '/static/img/mehraj.png',
    'Head of the Department of Artificial Intelligence & ICT at Green Valley Educational Institute (GVEI). Driving cutting-edge AI research, edge computing, robotics, and academic innovation.'
) ON CONFLICT (email) DO UPDATE SET role='admin', designation='HOD AI & ICT GVEI';

-- Legacy Test Admin User (admin@dept.ai / admin123)
INSERT INTO users (name, email, password_hash, role, status, designation, department, specialization, bio)
VALUES (
    'Department Administrator',
    'admin@dept.ai',
    'pbkdf2:sha256:600000$admin_hash_placeholder',
    'admin',
    'Approved',
    'Head of Department & Portal Admin',
    'AI & ICT Department, GVEI',
    'Department Governance & AI Research',
    'Overseeing academic excellence, research initiatives, and student project mentorship.'
) ON CONFLICT (email) DO NOTHING;

-- Lead Faculty: Er. Mehraj U Din Mir
INSERT INTO users (name, email, password_hash, role, status, designation, department, specialization, phone, avatar_url, bio)
VALUES (
    'Er. Mehraj U Din Mir',
    'mehraj@dept.ai',
    'pbkdf2:sha256:600000$faculty_hash_placeholder',
    'faculty',
    'Approved',
    'IP Lecturer & Lead AI/ML Trainer',
    'AI & ICT Department',
    'Computer Vision, Deep Learning, MLOps',
    '+91-94190-00000',
    '/static/img/mehraj.png',
    'Empowering the youth from the Valley of Kashmir to the frontiers of Global Artificial Intelligence Innovation.'
) ON CONFLICT (email) DO NOTHING;

-- Additional Faculty
INSERT INTO users (name, email, password_hash, role, status, designation, department, specialization, bio)
VALUES 
(
    'Prof. Salman Ahmed',
    'salman@dept.ai',
    'pbkdf2:sha256:600000$faculty_hash_placeholder',
    'faculty',
    'Approved',
    'Associate Professor',
    'AI & ICT Department',
    'IoT, Robotics & Embedded AI',
    'Specialist in edge compute devices, smart sensor networks, and autonomous robotics.'
),
(
    'Engr. Zara Malik',
    'zara@dept.ai',
    'pbkdf2:sha256:600000$faculty_hash_placeholder',
    'faculty',
    'Approved',
    'Assistant Professor',
    'AI & ICT Department',
    'AI Ethics, Policy & Explainable AI',
    'Focusing on trustworthy AI, fair algorithmic governance, and responsible LLM deployment.'
) ON CONFLICT (email) DO NOTHING;

-- Initial Flagship Achievements (Managed by Admin -> Dynamic on Landing Page)
INSERT INTO achievements (title, category, badge, date, description, image_url, is_featured)
VALUES 
(
    'NIT AI Hackathon Winners',
    'Hackathon',
    'First Place National Trophy',
    '2025-05-18',
    'Our student team "Fikr Fusion", mentored by Er. Mehraj U Din Mir, secured 1st place at the prestigious NIT AI Hackathon 2025 organized by CodeDay Kashmir, competing against 25+ top institutes.',
    '/static/img/nit.jpg',
    TRUE
),
(
    'Best International Research Paper Award',
    'Research',
    'IEEE Best Paper Award',
    '2025-03-12',
    'Recognized internationally at the IEEE Computing & Intelligent Systems Conference for pioneering work in Lightweight Transformer Architectures for Edge Devices.',
    '/static/img/activity.jpg',
    TRUE
),
(
    'AI AgroTech Innovation Grant ($50,000)',
    'Innovation Grant',
    'Innovation Grant Award',
    '2025-01-20',
    'Secured a $50,000 innovation research grant to develop smart drone-assisted computer vision systems for precision apple orchard health monitoring in Jammu & Kashmir.',
    '/static/img/club.jpg',
    TRUE
);

-- Initial Messages from Faculty (Message Corner)
INSERT INTO messages (faculty_id, title, content, category, priority)
SELECT 
    id,
    'Welcome to the Autumn AI Capstone Cycle & Lab Orientation',
    'Dear students, the Autumn Project Submission portal is now active. All 3rd and 4th-year students must submit their project abstracts and select their faculty supervisor before the deadline. Reach out during cabin hours for idea consultation.',
    'Announcement',
    'Important'
FROM users WHERE email = 'mehraj@dept.ai' LIMIT 1;

INSERT INTO messages (faculty_id, title, content, category, priority)
SELECT 
    id,
    'Call for Submissions: Smart IoT & Edge AI Prototype Challenge',
    'Faculty lab is opening 5 research assistant slots for students interested in micro-controller computer vision (ESP32-CAM & Coral Edge TPU). Submit your project proposals via your student dashboard.',
    'Project Opportunity',
    'Normal'
FROM users WHERE email = 'salman@dept.ai' LIMIT 1;

-- Initial Departmental Documents (Password-Protected Official Archive)
INSERT INTO departmental_documents (title, category, file_name, file_url, file_size, version, description, uploaded_by, is_confidential, downloads_count)
VALUES
(
    'GVEI ICT Department Profile & Annual Action Plan 2026–2027',
    'Department Governance',
    'GVEI_ICT_Department_Profile_Annual_Action_Plan_2026-2027.pdf',
    '/static/docs/GVEI_ICT_Department_Profile_Annual_Action_Plan_2026-2027.pdf',
    '215 KB',
    'v2026-2027',
    'Official department mission, strategic vision, faculty directory, academic targets, and comprehensive annual action plan for sessions 2026–2027.',
    'Er. Mehraj U Din Mir (HOD AI&ICT GVEI)',
    FALSE,
    145
),
(
    'ICT & AI Curriculum Planning & Syllabus Progress Track 2026–2027',
    'Curriculum & Syllabus',
    'GVEI_ICT_Curriculum_Planning_Syllabus_Progress_2026-2027.pdf',
    '/static/docs/GVEI_ICT_Curriculum_Planning_Syllabus_Progress_2026-2027.pdf',
    '178 KB',
    'v2026-2027',
    'Standardized scheme of study, module timelines, laboratory coursework schedules, and structured syllabus progression across academic terms.',
    'Er. Mehraj U Din Mir (HOD AI&ICT GVEI)',
    FALSE,
    220
),
(
    'C.R.E.A.T.E. Competency-Driven Academic Framework 2026–2027',
    'Academic Guidelines',
    'GVEI_ICT_CREATE_Competency_Driven_Framework_2026-2027.pdf',
    '/static/docs/GVEI_ICT_CREATE_Competency_Driven_Framework_2026-2027.pdf',
    '241 KB',
    'v2026-2027',
    'Pedagogical competency matrix focusing on Critical thinking, Research, Engineering mindset, AI mastery, Teamwork, and Ethics.',
    'Er. Mehraj U Din Mir (HOD AI&ICT GVEI)',
    FALSE,
    180
),
(
    'Departmental Pedagogical Practices & Instructional Framework 2026–2027',
    'Pedagogy & Teaching',
    'GVEI_ICT_Pedagogical_Practices_Framework_2026-2027.pdf',
    '/static/docs/GVEI_ICT_Pedagogical_Practices_Framework_2026-2027.pdf',
    '277 KB',
    'v2026-2027',
    'Modern instruction methodologies, active learning rubrics, experiential technology labs, and blended teaching guidelines.',
    'Er. Mehraj U Din Mir (HOD AI&ICT GVEI)',
    FALSE,
    115
),
(
    'Lesson Plans, Classroom Practices & Teaching Innovations 2026–2027',
    'Lesson Plans & Practice',
    'GVEI_ICT_Lesson_Plans_Classroom_Practices_Teaching_Innovation_2026-2027.pdf',
    '/static/docs/GVEI_ICT_Lesson_Plans_Classroom_Practices_Teaching_Innovation_2026-2027.pdf',
    '230 KB',
    'v2026-2027',
    'Exemplary instructional units, interactive AI lab exercises, flipped classroom workflows, and continuous evaluation protocols.',
    'Er. Mehraj U Din Mir (HOD AI&ICT GVEI)',
    FALSE,
    164
),
(
    'Assessment Matrix, Student Performance & Learning Outcomes 2026–2027',
    'Assessment & Evaluation',
    'GVEI_ICT_Assessment_Student_Performance_Learning_Outcomes_2026-2027.pdf',
    '/static/docs/GVEI_ICT_Assessment_Student_Performance_Learning_Outcomes_2026-2027.pdf',
    '202 KB',
    'v2026-2027',
    'Comprehensive grading criteria, formative vs summative evaluation weights, student learning outcome (SLO) benchmarks, and remedial support.',
    'Er. Mehraj U Din Mir (HOD AI&ICT GVEI)',
    FALSE,
    192
),
(
    'Student Mentorship & Academic Concept Strengthening Protocol 2026–2027',
    'Student Mentorship',
    'GVEI_ICT_Student_Mentorship_Concept_Strengthening_2026-2027.pdf',
    '/static/docs/GVEI_ICT_Student_Mentorship_Concept_Strengthening_2026-2027.pdf',
    '257 KB',
    'v2026-2027',
    'One-on-one mentorship structures, technical doubt-clearing sessions, peer mentoring circles, and foundational concept reinforcement.',
    'Er. Mehraj U Din Mir (HOD AI&ICT GVEI)',
    FALSE,
    134
),
(
    'AI Coding, Innovation & Enrichment Activities Portfolio 2026–2027',
    'Innovation & Activities',
    'GVEI_ICT_AI_Coding_Innovation_Enrichment_Activities_2026-2027 (1).pdf',
    '/static/docs/GVEI_ICT_AI_Coding_Innovation_Enrichment_Activities_2026-2027%20(1).pdf',
    '241 KB',
    'v2026-2027',
    'Annual calendar of student coding hackathons, robotics challenges, guest lectures from industry pioneers, and incubation showcases.',
    'Er. Mehraj U Din Mir (HOD AI&ICT GVEI)',
    FALSE,
    205
),
(
    'Computer Laboratory Infrastructure & System Integration 2026–2027',
    'Lab Infrastructure',
    'GVEI_ICT_Computer_Laboratory_Infrastructure_Integration_2026-2027.pdf',
    '/static/docs/GVEI_ICT_Computer_Laboratory_Infrastructure_Integration_2026-2027.pdf',
    '259 KB',
    'v2026-2027',
    'Hardware specifications, high-performance GPU compute stations, network topology, lab safety SOPs, and system maintenance guidelines.',
    'Er. Mehraj U Din Mir (HOD AI&ICT GVEI)',
    FALSE,
    98
),
(
    'Student Work Portfolios & Capstone Project Evidence 2026–2027',
    'Student Portfolios',
    'GVEI_ICT_Student_Work_Portfolios_Project_Evidence_2026-2027.pdf',
    '/static/docs/GVEI_ICT_Student_Work_Portfolios_Project_Evidence_2026-2027.pdf',
    '201 KB',
    'v2026-2027',
    'Documented artifacts, exemplar GitHub repositories, project poster presentations, and practical engineering solutions developed by students.',
    'Er. Mehraj U Din Mir (HOD AI&ICT GVEI)',
    FALSE,
    176
),
(
    'Educator Professional Development & Competency Mapping 2026–2027',
    'Faculty Development',
    'GVEI_ICT_Educator_Professional_Development_Competency_Mapping_2026-2027.pdf',
    '/static/docs/GVEI_ICT_Educator_Professional_Development_Competency_Mapping_2026-2027.pdf',
    '238 KB',
    'v2026-2027',
    'Faculty upskilling programs, international AI certifications, research sabbatical policies, and pedagogy workshops.',
    'Er. Mehraj U Din Mir (HOD AI&ICT GVEI)',
    FALSE,
    89
);
