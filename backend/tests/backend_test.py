"""ETI EduConnect backend API tests."""
import os
import pytest
import requests

BASE = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE:
    # Fallback: read from frontend/.env
    try:
        with open("/app/frontend/.env") as f:
            for line in f:
                if line.startswith("REACT_APP_BACKEND_URL="):
                    BASE = line.split("=", 1)[1].strip()
    except Exception:
        pass
BASE = (BASE or "").rstrip("/")
API = f"{BASE}/api"

ADMIN_EMAIL = "connect@etieduconnect.com"
ADMIN_PASSWORD = "EduConnect@2026"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(session):
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "access_token" in data
    return data["access_token"]


@pytest.fixture(scope="session")
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# --------- Public endpoints ---------
class TestPublic:
    def test_root(self, session):
        r = session.get(f"{API}/")
        assert r.status_code == 200

    def test_config(self, session):
        r = session.get(f"{API}/config")
        assert r.status_code == 200
        assert "whatsapp_number" in r.json()

    def test_meta(self, session):
        r = session.get(f"{API}/meta")
        assert r.status_code == 200
        d = r.json()
        for k in ("categories", "locations", "modes", "types"):
            assert k in d

    def test_universities_list(self, session):
        r = session.get(f"{API}/universities")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 20, f"Expected ~22 universities, got {len(data)}"

    def test_universities_filter_mode(self, session):
        r = session.get(f"{API}/universities", params={"mode": "Online"})
        assert r.status_code == 200
        assert all("Online" in u.get("modes", []) for u in r.json())

    def test_university_profile(self, session):
        r = session.get(f"{API}/universities/amity-university-online")
        assert r.status_code == 200
        d = r.json()
        assert d["slug"] == "amity-university-online"
        assert "similar" in d

    def test_university_404(self, session):
        r = session.get(f"{API}/universities/no-such-slug")
        assert r.status_code == 404

    def test_courses_list(self, session):
        r = session.get(f"{API}/courses")
        assert r.status_code == 200
        assert len(r.json()) >= 10

    def test_course_profile(self, session):
        r = session.get(f"{API}/courses/online-mba")
        assert r.status_code == 200
        assert r.json()["slug"] == "online-mba"

    def test_compare_universities(self, session):
        r = session.get(f"{API}/compare/universities",
                        params={"slugs": "amity-university-online,manipal-online"})
        assert r.status_code == 200
        d = r.json()
        assert isinstance(d, list)
        assert len(d) >= 1

    def test_compare_courses(self, session):
        r = session.get(f"{API}/compare/courses", params={"slugs": "online-mba"})
        assert r.status_code == 200

    def test_search(self, session):
        r = session.get(f"{API}/search", params={"q": "mba"})
        assert r.status_code == 200
        d = r.json()
        for k in ("universities", "courses", "guides"):
            assert k in d

    def test_guides_list(self, session):
        r = session.get(f"{API}/guides")
        assert r.status_code == 200
        assert len(r.json()) >= 5

    def test_guide_detail(self, session):
        lst = session.get(f"{API}/guides").json()
        assert lst, "no guides"
        slug = lst[0]["slug"]
        r = session.get(f"{API}/guides/{slug}")
        assert r.status_code == 200
        assert "related" in r.json()

    def test_landing(self, session):
        r = session.get(f"{API}/landing/online-mba-comparison")
        assert r.status_code == 200
        assert "universities" in r.json()

    def test_create_lead(self, session):
        payload = {
            "name": "TEST_User",
            "phone": "9999900001",
            "qualification": "Graduate",
            "program_interest": "Online MBA",
            "consent": True,
        }
        r = session.post(f"{API}/leads", json=payload)
        assert r.status_code == 200
        d = r.json()
        assert d.get("success") is True
        assert d["lead_id"].startswith("ETI-")

    def test_events(self, session):
        r = session.post(f"{API}/events", json={"event": "test_event", "props": {"x": 1}})
        assert r.status_code == 200


# --------- Auth ---------
class TestAuth:
    def test_login_bad(self, session):
        r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_login_ok(self, admin_token):
        assert admin_token and len(admin_token) > 20

    def test_me_no_auth(self):
        r = requests.get(f"{API}/auth/me")  # fresh, no cookies
        assert r.status_code == 401

    def test_me_with_token(self, admin_headers):
        r = requests.get(f"{API}/auth/me", headers=admin_headers)
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL


# --------- Admin ---------
class TestAdmin:
    def test_stats(self, admin_headers):
        r = requests.get(f"{API}/admin/stats", headers=admin_headers)
        assert r.status_code == 200
        d = r.json()
        for k in ("total_leads", "universities", "courses", "guides", "recent_leads"):
            assert k in d

    def test_admin_requires_auth(self):
        r = requests.get(f"{API}/admin/stats")
        assert r.status_code == 401
        r = requests.get(f"{API}/admin/leads")
        assert r.status_code == 401
        r = requests.get(f"{API}/admin/universities")
        assert r.status_code == 401

    def test_admin_leads_list(self, admin_headers):
        r = requests.get(f"{API}/admin/leads", headers=admin_headers)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_admin_leads_export(self, admin_headers):
        r = requests.get(f"{API}/admin/leads/export", headers=admin_headers)
        assert r.status_code == 200
        assert "text/csv" in r.headers.get("content-type", "")
        assert "lead_id" in r.text.split("\n")[0]

    def test_admin_lead_update(self, session, admin_headers):
        # create a lead
        p = {"name": "TEST_Upd", "phone": "9999900002", "qualification": "Graduate",
             "program_interest": "MBA", "consent": True}
        lead_id = session.post(f"{API}/leads", json=p).json()["lead_id"]
        r = requests.put(f"{API}/admin/leads/{lead_id}", headers=admin_headers,
                         json={"lead_status": "contacted"})
        assert r.status_code == 200
        assert r.json()["lead_status"] == "contacted"

    def test_admin_settings(self, admin_headers):
        r = requests.get(f"{API}/admin/config/settings", headers=admin_headers)
        assert r.status_code == 200
        r2 = requests.put(f"{API}/admin/config/settings", headers=admin_headers,
                          json={"whatsapp_message": "TEST message"})
        assert r2.status_code == 200
        assert r2.json().get("whatsapp_message") == "TEST message"

    def test_admin_list_universities(self, admin_headers):
        r = requests.get(f"{API}/admin/universities", headers=admin_headers)
        assert r.status_code == 200
        assert len(r.json()) >= 20

    def test_admin_crud_guide(self, admin_headers):
        slug = "test-guide-abc123"
        # cleanup
        requests.delete(f"{API}/admin/guides/{slug}", headers=admin_headers)
        payload = {"slug": slug, "title": "TEST Guide", "category": "misc",
                   "excerpt": "e", "body": "b"}
        r = requests.post(f"{API}/admin/guides", headers=admin_headers, json=payload)
        assert r.status_code == 200, r.text
        r2 = requests.get(f"{API}/admin/guides/{slug}", headers=admin_headers)
        assert r2.status_code == 200
        r3 = requests.put(f"{API}/admin/guides/{slug}", headers=admin_headers,
                          json={"title": "TEST Guide Updated", "slug": slug})
        assert r3.status_code == 200
        assert r3.json()["title"] == "TEST Guide Updated"
        r4 = requests.delete(f"{API}/admin/guides/{slug}", headers=admin_headers)
        assert r4.status_code == 200
        r5 = requests.get(f"{API}/admin/guides/{slug}", headers=admin_headers)
        assert r5.status_code == 404

    def test_admin_unknown_entity(self, admin_headers):
        r = requests.get(f"{API}/admin/unknown", headers=admin_headers)
        assert r.status_code == 404
