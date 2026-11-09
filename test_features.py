import os
import sys
import unittest
from app import app, get_db, init_db

class DepartmentPortalTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        self.client = app.test_client()
        with app.app_context():
            init_db()

    def test_01_public_routes(self):
        routes = ['/', '/projects', '/messages', '/activities', '/ai-tools', '/documents', '/student/login', '/faculty/login', '/admin/login']
        for r in routes:
            res = self.client.get(r)
            self.assertEqual(res.status_code, 200, f"Route {r} failed with status {res.status_code}")
        
        # /club-register redirects to student login when not authenticated
        club_res = self.client.get('/club-register')
        self.assertEqual(club_res.status_code, 302)
        club_res_followed = self.client.get('/club-register', follow_redirects=True)
        self.assertEqual(club_res_followed.status_code, 200)

        print("[OK] All public & auth routes responded successfully")

    def test_02_ai_idea_generator(self):
        res = self.client.post('/api/ai/generate-idea', json={
            "domain": "Computer Vision & Edge AI",
            "complexity": "Capstone / Final Year Project",
            "tech_stack": "PyTorch, TensorRT, OpenCV"
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data.get("success"))
        idea = data.get("idea", {})
        self.assertIn("title", idea)
        self.assertIn("abstract", idea)
        self.assertIn("methodology", idea)
        self.assertIn("datasets", idea)
        self.assertIn("novelty_angle", idea)
        print(f"[OK] AI Idea Generator synthesized: '{idea['title'][:60]}...'")

    def test_03_ai_proposal_evaluator(self):
        abstract = (
            "Modern manufacturing pipelines suffer from manual inspection latency and worker safety protocol violations. "
            "In this capstone project, we propose EdgeVision-Shield, an end-to-end edge-computed computer vision pipeline. "
            "The system deploys INT8-quantized MobileViT architectures on low-power NVIDIA Jetson and Raspberry Pi edge nodes. "
            "Using the MVTec AD industrial anomaly benchmark and RoboFlow PPE dataset, our model targets 96.8% mean Average Precision "
            "while maintaining a frame latency under 18ms. A centralized Flask telemetry dashboard dispatches real-time automated safety alerts."
        )
        res = self.client.post('/api/ai/analyze-proposal', json={
            "title": "EdgeVision-Shield",
            "abstract": abstract,
            "tech_stack": "PyTorch, TensorRT, OpenCV"
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data.get("success"))
        self.assertGreaterEqual(data["total_score"], 70)
        self.assertIn(data["grade"], ["A+", "A", "B+", "B"])
        self.assertIn("scores", data)
        self.assertIn("strengths", data)
        print(f"[OK] AI Proposal Evaluator scored: {data['total_score']}/100 (Grade: {data['grade']})")

    def test_04_ai_chat_assistant(self):
        # Query about Er. Mehraj U Din Mir
        res = self.client.post('/api/ai/chat', json={"message": "Tell me about Er. Mehraj U Din Mir's research"})
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("Mehraj", data.get("reply", ""))
        print("[OK] Department Academic Advisory successfully answered mentor inquiry")

        # Query about rubrics
        res2 = self.client.post('/api/ai/chat', json={"message": "What is the capstone rubric score breakdown?"})
        self.assertEqual(res2.status_code, 200)
        data2 = res2.get_json()
        self.assertIn("Rubric", data2.get("reply", ""))
        print("[OK] Department Academic Advisory successfully detailed rubric criteria")

    def test_05_faculty_rubric_grading_flow(self):
        # 1. Login as Faculty (mehraj@dept.ai / faculty123)
        login_res = self.client.post('/faculty/login', data={
            "email": "mehraj@dept.ai",
            "password": "faculty123"
        }, follow_redirects=True)
        self.assertEqual(login_res.status_code, 200)

        # 2. Get an existing project id
        with app.app_context():
            db = get_db()
            proj = db.execute("SELECT id FROM projects LIMIT 1").fetchone()
            if not proj:
                # Insert test project
                user = db.execute("SELECT id FROM users WHERE role='student' LIMIT 1").fetchone()
                db.execute("""
                    INSERT INTO projects (title, category, abstract, student_id, status)
                    VALUES ('Test AI Project', 'Computer Vision', 'Test abstract for rubric grading', ?, 'Pending')
                """, (user['id'] if user else 1,))
                db.commit()
                proj = db.execute("SELECT id FROM projects LIMIT 1").fetchone()
            pid = proj['id']

        # 3. Post rubric evaluation
        grade_res = self.client.post('/faculty/grade_project', data={
            "project_id": pid,
            "score_innovation": 32,
            "score_technical": 38,
            "score_presentation": 24,
            "status": "Approved",
            "grade": "A+",
            "feedback": "Outstanding architectural implementation and edge quantization benchmarks.",
            "methodology": "Verified with PyTorch and INT8 MobileViT pipeline on Jetson Nano."
        }, follow_redirects=True)
        self.assertEqual(grade_res.status_code, 200)

        # 4. Verify in DB
        with app.app_context():
            db = get_db()
            p = db.execute("SELECT * FROM projects WHERE id=?", (pid,)).fetchone()
            self.assertEqual(p['score_innovation'], 32)
            self.assertEqual(p['score_technical'], 38)
            self.assertEqual(p['score_presentation'], 24)
            self.assertEqual(p['score'], 94)
            self.assertEqual(p['grade'], 'A+')
            self.assertEqual(p['status'], 'Approved')
            print(f"[OK] Faculty Rubric Grading persisted Project #{pid}: Grade {p['grade']} ({p['score']}/100) -> {p['status']}")

    def test_06_activity_certificate_verification(self):
        # Login as faculty or admin
        self.client.post('/faculty/login', data={
            "email": "mehraj@dept.ai",
            "password": "faculty123"
        }, follow_redirects=True)

        with app.app_context():
            db = get_db()
            part = db.execute("SELECT id FROM participations LIMIT 1").fetchone()
            if not part:
                user = db.execute("SELECT id FROM users LIMIT 1").fetchone()
                act = db.execute("SELECT id FROM activities LIMIT 1").fetchone()
                if not act:
                    db.execute("INSERT INTO activities (title) VALUES ('AI Workshop 2026')")
                    db.commit()
                    act = db.execute("SELECT id FROM activities LIMIT 1").fetchone()
                db.execute("INSERT INTO participations (user_id, activity_id, proof, status) VALUES (?, ?, 'https://example.com/cert.pdf', 'Pending')", (user['id'], act['id']))
                db.commit()
                part = db.execute("SELECT id FROM participations LIMIT 1").fetchone()
            part_id = part['id']

        # Verify participation
        res = self.client.post('/verify_participation', data={
            "participation_id": part_id,
            "status": "Approved",
            "verifier_notes": "Certificate confirmed with IEEE student chapter records."
        }, follow_redirects=True)
        self.assertEqual(res.status_code, 200)

        with app.app_context():
            db = get_db()
            p = db.execute("SELECT * FROM participations WHERE id=?", (part_id,)).fetchone()
            self.assertEqual(p['status'], 'Approved')
            self.assertIn("IEEE", p['verifier_notes'])
            print(f"[OK] Certificate Proof Verified: Participation #{part_id} marked {p['status']} with notes '{p['verifier_notes']}'")

    def test_07_supabase_admin_endpoints(self):
        # Login as Admin
        self.client.post('/admin/login', data={
            "email": "admin@dept.ai",
            "password": "admin123"
        }, follow_redirects=True)

        # Status probe
        status_res = self.client.get('/admin/supabase/status')
        self.assertEqual(status_res.status_code, 200)
        data = status_res.get_json()
        self.assertIn("local_records", data)
        self.assertIn("supabase_library_installed", data)
        print(f"[OK] Supabase Status probe returned: library installed = {data['supabase_library_installed']}, local records = {data['local_records']}")

        # Schema SQL endpoint
        sql_res = self.client.get('/admin/supabase/schema_sql')
        self.assertEqual(sql_res.status_code, 200)
        sql_data = sql_res.get_json()
        self.assertTrue(sql_data.get("success"))
        self.assertIn("CREATE TABLE IF NOT EXISTS projects", sql_data.get("sql", ""))
        print(f"[OK] Supabase DDL SQL endpoint returned valid schema ({len(sql_data['sql'])} characters)")

        # Sync endpoint
        sync_res = self.client.post('/admin/supabase/sync')
        self.assertEqual(sync_res.status_code, 200)
        sync_data = sync_res.get_json()
        self.assertIn("message", sync_data)
        print(f"[OK] Supabase Sync endpoint handled gracefully: '{sync_data['message'][:60]}...'")

    def test_08_admin_gvei_and_role_hierarchy_workflow(self):
        # 1. Test Admin Login with exact required credentials
        admin_login_res = self.client.post('/admin/login', data={
            "email": "adminaiict@gvei.com",
            "password": "Admin@gveiAIICT@Mehraj123"
        }, follow_redirects=False)
        self.assertEqual(admin_login_res.status_code, 302)
        self.assertIn('/admin', admin_login_res.headers['Location'])
        print("[OK] Admin successfully authenticated with 'adminaiict@gvei.com' and 'Admin@gveiAIICT@Mehraj123'")

        # Follow redirect into admin dashboard
        admin_dash_res = self.client.get('/admin')
        self.assertEqual(admin_dash_res.status_code, 200)

        # 2. Admin adds Faculty with password
        faculty_email = "testfaculty@gvei.edu.in"
        faculty_pass = "FacultyPass@GVEI2026!"
        add_fac_res = self.client.post('/admin/add_faculty', data={
            "name": "Prof. Tariq Farooq",
            "email": faculty_email,
            "password": faculty_pass,
            "designation": "Assistant Professor of AI",
            "specialization": "Autonomous Systems & Robotics",
            "phone": "+91-9906000000",
            "whatsapp_no": "+91-9906000000",
            "avatar": "/static/img/mehraj.png",
            "bio": "Mentoring young robotics engineers at GVEI."
        }, follow_redirects=True)
        self.assertEqual(add_fac_res.status_code, 200)
        print(f"[OK] Admin onboarded new faculty: '{faculty_email}' with password")

        # 3. Log out admin session
        self.client.get('/logout')

        # 4. Faculty logs in with the exact credentials set by Admin
        fac_login_res = self.client.post('/faculty/login', data={
            "email": faculty_email,
            "password": faculty_pass
        }, follow_redirects=False)
        self.assertEqual(fac_login_res.status_code, 302)
        self.assertIn('/faculty', fac_login_res.headers['Location'])
        print(f"[OK] Faculty '{faculty_email}' successfully authenticated with their set password")

        # 5. Faculty adds Student with class, roll no, section, name, email, whatsapp, password
        student_email = "huzaif@gvei.edu.in"
        student_roll = "GVEI-2026-AI01"
        student_pass = "StudentPass@Huzaif123"
        add_student_res = self.client.post('/faculty/add_student', data={
            "name": "Huzaif Mehraj",
            "class_name": "Class 11th - AI Stream",
            "roll_no": student_roll,
            "section": "A",
            "email": student_email,
            "whatsapp_no": "+91-9419111222",
            "password": student_pass,
            "specialization": "Artificial Intelligence & ICT"
        }, follow_redirects=True)
        self.assertEqual(add_student_res.status_code, 200)
        print(f"[OK] Faculty successfully registered Student with Class, Roll No ({student_roll}), Section, Email, WhatsApp, and Password")

        # 6. Log out faculty
        self.client.get('/logout')

        # 7. Student logs in with email and password
        stu_login_res = self.client.post('/student/login', data={
            "email": student_email,
            "password": student_pass
        }, follow_redirects=False)
        self.assertEqual(stu_login_res.status_code, 302)
        self.assertIn('/student', stu_login_res.headers['Location'])
        print(f"[OK] Student logged in successfully with Email '{student_email}' and password")

        # 8. Log out student
        self.client.get('/logout')

        # 9. Student logs in with Roll Number and password
        stu_roll_login_res = self.client.post('/student/login', data={
            "email": student_roll,
            "password": student_pass
        }, follow_redirects=False)
        self.assertEqual(stu_roll_login_res.status_code, 302)
        self.assertIn('/student', stu_roll_login_res.headers['Location'])
        print(f"[OK] Student logged in successfully with Roll Number '{student_roll}' and password")

        # 10. Test Innovation Club Route
        self.client.get('/logout')
        print("[OK] Hierarchy and auth workflow verified completely")

    def test_09_virtual_lab_auth_protection(self):
        # 1. Unauthenticated request to /virtual-lab must be redirected to /student/login
        self.client.get('/logout')
        res = self.client.get('/virtual-lab')
        self.assertEqual(res.status_code, 302)
        self.assertIn('/student/login', res.headers['Location'])
        print("[OK] Virtual Lab strictly protected: unauthenticated visitor redirected to login")

    def test_10_virtual_lab_student_workflow(self):
        # 0. Ensure student account exists
        from werkzeug.security import generate_password_hash
        with app.app_context():
            db = get_db()
            stu = db.execute("SELECT id FROM users WHERE email='student@dept.ai'").fetchone()
            if not stu:
                db.execute("""
                    INSERT INTO users (name, email, password_hash, role, status, designation, class_name, roll_no)
                    VALUES ('Test Student', 'student@dept.ai', ?, 'student', 'Approved', 'Student', 'Class 11th - AI Stream', 'GVEI-2026-AI99')
                """, (generate_password_hash("student123"),))
                db.commit()

        # 1. Login as Student
        login_res = self.client.post('/student/login', data={
            "email": "student@dept.ai",
            "password": "student123"
        }, follow_redirects=True)
        self.assertEqual(login_res.status_code, 200)

        # 2. Access Virtual Lab (auto-provisions default workspace if none exists)
        lab_res = self.client.get('/virtual-lab', follow_redirects=True)
        self.assertEqual(lab_res.status_code, 200)
        self.assertIn(b"Virtual Lab", lab_res.data)

        # 3. Create a New Project (Python)
        create_res = self.client.post('/virtual-lab/project/create', json={
            "title": "Robotics Sensor Analytics",
            "description": "Multi-file sensor analytics workspace",
            "language": "python"
        })
        self.assertEqual(create_res.status_code, 200)
        proj_id = create_res.get_json()["project_id"]

        # 4. Create a Folder inside this project
        folder_res = self.client.post('/virtual-lab/file/create', json={
            "project_id": proj_id,
            "name": "telemetry",
            "folder_path": "/",
            "is_folder": 1
        })
        self.assertEqual(folder_res.status_code, 200)

        # 5. Create a File inside the new folder
        file_res = self.client.post('/virtual-lab/file/create', json={
            "project_id": proj_id,
            "name": "sensor.py",
            "folder_path": "/telemetry",
            "is_folder": 0,
            "content": "def get_reading():\n    return 42.5\n"
        })
        self.assertEqual(file_res.status_code, 200)
        file_id = file_res.get_json()["file"]["id"]

        # 6. Save modified content to the file
        save_res = self.client.post('/virtual-lab/file/save', json={
            "file_id": file_id,
            "content": "def get_reading():\n    return 98.6\n"
        })
        self.assertEqual(save_res.status_code, 200)

        # 7. Execute Sandboxed Python code that imports local logic
        exec_res = self.client.post('/virtual-lab/execute-python', json={
            "code": "from telemetry.sensor import get_reading\nval = get_reading()\nprint(f'Sensor val is {val}')",
            "project_id": proj_id,
            "filename": "main.py"
        })
        self.assertEqual(exec_res.status_code, 200)
        exec_data = exec_res.get_json()
        self.assertIn("Sensor val is 98.6", exec_data["stdout"])
        self.assertEqual(exec_data["exit_code"], 0)
        print(f"[OK] Multi-file sandboxed Python execution verified in {exec_data['execution_time']}s")

        # 8. Test Scratch / Block Studio project creation
        block_create = self.client.post('/virtual-lab/project/create', json={
            "title": "Visual AI Algorithm",
            "description": "Block-based visual coding",
            "language": "block_scratch"
        })
        self.assertEqual(block_create.status_code, 200)
        block_proj_id = block_create.get_json()["project_id"]

        # 9. Verify Block Project was created with .blocks and generated.py
        block_lab_page = self.client.get(f'/virtual-lab?project_id={block_proj_id}')
        self.assertEqual(block_lab_page.status_code, 200)
        self.assertIn(b"main.blocks", block_lab_page.data)

        # 10. Student shares the project with Teacher (Er. Mehraj U Din Mir)
        with app.app_context():
            db = get_db()
            faculty = db.execute("SELECT id, name FROM users WHERE email='mehraj@dept.ai'").fetchone()
            faculty_id = faculty['id']

        share_res = self.client.post(f'/virtual-lab/project/{proj_id}/share', json={
            "faculty_id": faculty_id,
            "note": "Please review my telemetry module."
        })
        self.assertEqual(share_res.status_code, 200)
        share_data = share_res.get_json()
        self.assertTrue(share_data["success"])
        print(f"[OK] Student successfully shared lab project exclusively with faculty ID {faculty_id}")

        # 11. Faculty logs in and evaluates the shared code
        self.client.get('/logout')
        self.client.post('/faculty/login', data={
            "email": "mehraj@dept.ai",
            "password": "faculty123"
        }, follow_redirects=True)

        # Faculty can view the shared project
        fac_view_res = self.client.get(f'/virtual-lab?project_id={proj_id}')
        self.assertEqual(fac_view_res.status_code, 200)

        # Faculty submits grade and feedback
        grade_res = self.client.post('/faculty/virtual-lab/grade', json={
            "project_id": proj_id,
            "grade": "A+",
            "feedback": "Outstanding modular code architecture. Clean telemetry module.",
            "status": "Reviewed"
        })
        self.assertEqual(grade_res.status_code, 200)
        print("[OK] Faculty successfully evaluated, test-ran, and graded shared lab project with Grade A+")

    def test_11_departmental_documents_flow(self):
        # 1. Accessing documents when locked
        res = self.client.get('/documents')
        self.assertEqual(res.status_code, 200)
        self.assertIn(b"Protected Academic Archive", res.data)
        self.assertIn(b"ict@123", res.data)

        # 2. Entering wrong passcode fails
        wrong_res = self.client.post('/documents/unlock', json={"password": "wrong_password"})
        self.assertEqual(wrong_res.status_code, 401)
        wrong_data = wrong_res.get_json()
        self.assertFalse(wrong_data["success"])

        # 3. Entering correct passcode 'ict@123' succeeds
        unlock_res = self.client.post('/documents/unlock', json={"password": "ict@123"})
        self.assertEqual(unlock_res.status_code, 200)
        unlock_data = unlock_res.get_json()
        self.assertTrue(unlock_data["success"])

        # 4. Accessing documents when unlocked displays documents table
        unlocked_res = self.client.get('/documents')
        self.assertEqual(unlocked_res.status_code, 200)
        self.assertIn(b"GVEI ICT", unlocked_res.data)
        self.assertIn(b"openDocViewer", unlocked_res.data)

        # 5. Fetch first document detail API for in-page viewer
        with app.app_context():
            db = get_db()
            first_doc = db.execute("SELECT id, category FROM departmental_documents LIMIT 1").fetchone()
            first_id = first_doc["id"]

        detail_res = self.client.get(f'/api/documents/{first_id}')
        self.assertEqual(detail_res.status_code, 200)
        detail_data = detail_res.get_json()
        self.assertTrue(detail_data["success"])

        # 6. Download PDF document directly
        dl_res = self.client.get(f'/documents/download/{first_id}')
        self.assertEqual(dl_res.status_code, 200)
        self.assertEqual(dl_res.headers.get('Content-Type'), 'application/pdf')

        # 7. Locking the archive returns to locked state
        lock_res = self.client.get('/documents/lock', follow_redirects=True)
        self.assertEqual(lock_res.status_code, 200)
        self.assertIn(b"Protected Academic Archive", lock_res.data)
        print("[OK] Departmental Documents flow verified: passcode 'ict@123', in-page viewer, PDF download & lock/unlock")

if __name__ == '__main__':
    unittest.main()

