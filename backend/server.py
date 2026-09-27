from dotenv import load_dotenv
from pathlib import Path
import os

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, Query
from fastapi.responses import StreamingResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Any
from datetime import datetime, timezone, timedelta
from bson import ObjectId
import logging, uuid, io, csv, re, jwt, bcrypt, secrets

import seed_data

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="ETI EduConnect API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("educonnect")

JWT_ALGORITHM = "HS256"


# ------------------------- Auth helpers -------------------------
def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False

def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "type": "access",
               "exp": datetime.now(timezone.utc) + timedelta(hours=12)}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "type": "refresh",
               "exp": datetime.now(timezone.utc) + timedelta(days=7)}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def set_auth_cookies(response: Response, access: str, refresh: str):
    response.set_cookie("access_token", access, httponly=True, secure=True, samesite="none", max_age=43200, path="/")
    response.set_cookie("refresh_token", refresh, httponly=True, secure=True, samesite="none", max_age=604800, path="/")

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["id"] = str(user["_id"])
        user.pop("_id", None)
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ------------------------- Models -------------------------
class LoginInput(BaseModel):
    email: str
    password: str

class LeadInput(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    qualification: str
    program_interest: str
    preferred_mode: Optional[str] = None
    current_status: Optional[str] = None
    preferred_location: Optional[str] = None
    consent: bool = True
    source: Optional[str] = "website"
    campaign: Optional[str] = None
    landing_page: Optional[str] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    utm_term: Optional[str] = None
    utm_content: Optional[str] = None
    referrer: Optional[str] = None
    context_type: Optional[str] = None   # university / course / guide / general
    context_slug: Optional[str] = None
    cta_label: Optional[str] = None

class LeadStatusUpdate(BaseModel):
    lead_status: Optional[str] = None
    partner_handoff_status: Optional[str] = None
    outcome: Optional[str] = None
    notes: Optional[str] = None

class EventInput(BaseModel):
    event: str
    props: Optional[dict] = None
    session_id: Optional[str] = None
    path: Optional[str] = None

class AdvisorInput(BaseModel):
    qualification: Optional[str] = None
    program_interest: Optional[str] = None
    preferred_mode: Optional[str] = None
    budget: Optional[int] = None
    priority: Optional[str] = None   # cost / quality / recognition / flexibility
    location: Optional[str] = None

class SettingsUpdate(BaseModel):
    whatsapp_number: Optional[str] = None
    whatsapp_message: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    company_name: Optional[str] = None
    partner_name: Optional[str] = None
    disclosure_text: Optional[str] = None


def clean(doc: dict) -> dict:
    if doc:
        doc.pop("_id", None)
    return doc

def slugify(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", (text or "").lower()).strip("-")
    return s or uuid.uuid4().hex[:8]


# ------------------------- Public: config & meta -------------------------
@api_router.get("/")
async def root():
    return {"message": "ETI EduConnect API"}

@api_router.get("/config")
async def get_config():
    s = await db.settings.find_one({"id": "site_settings"})
    if not s:
        s = seed_data.SETTINGS
    return clean(dict(s))

@api_router.get("/meta")
async def get_meta():
    unis = await db.universities.find({"status": "published"}, {"_id": 0}).to_list(500)
    categories = sorted({c for u in unis for c in u.get("program_categories", [])})
    cat_codes = sorted({c for u in unis for c in u.get("categories", [])})
    locations = sorted({u["state"] for u in unis})
    modes = ["Online", "Distance", "Regular"]
    types = sorted({u["type"] for u in unis})
    return {"categories": categories, "category_codes": cat_codes, "locations": locations,
            "modes": modes, "types": types,
            "levels": ["UG", "PG", "Doctorate", "Certificate"],
            "qualifications": ["10+2 / 12th Pass", "Diploma", "Graduate", "Post Graduate"]}


# ------------------------- Public: universities -------------------------
@api_router.get("/universities")
async def list_universities(
    search: Optional[str] = None, mode: Optional[str] = None, category: Optional[str] = None,
    location: Optional[str] = None, type: Optional[str] = None, sort: Optional[str] = "featured",
    featured: Optional[bool] = None, limit: int = 100):
    q: dict = {"status": "published"}
    if mode:
        q["modes"] = mode
    if category:
        q["program_categories"] = category
    if location:
        q["state"] = location
    if type:
        q["type"] = type
    if featured is not None:
        q["featured"] = featured
    if search:
        q["$or"] = [{"name": {"$regex": search, "$options": "i"}},
                    {"city": {"$regex": search, "$options": "i"}},
                    {"state": {"$regex": search, "$options": "i"}},
                    {"program_categories": {"$regex": search, "$options": "i"}}]
    docs = await db.universities.find(q, {"_id": 0}).to_list(500)
    if sort == "rating":
        docs.sort(key=lambda d: d.get("rating", 0), reverse=True)
    elif sort == "fee_low":
        docs.sort(key=lambda d: d.get("fee_min", 0))
    elif sort == "name":
        docs.sort(key=lambda d: d.get("name", ""))
    else:
        docs.sort(key=lambda d: (not d.get("featured"), not d.get("sponsored"), -d.get("rating", 0)))
    return docs[:limit]

@api_router.get("/universities/{slug}")
async def get_university(slug: str):
    doc = await db.universities.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="University not found")
    similar = await db.universities.find(
        {"slug": {"$ne": slug}, "status": "published",
         "program_categories": {"$in": doc.get("program_categories", [])}}, {"_id": 0}).to_list(6)
    doc["similar"] = [{"slug": s["slug"], "name": s["name"], "logo_text": s["logo_text"],
                        "logo_color": s["logo_color"], "naac_grade": s["naac_grade"],
                        "city": s["city"], "rating": s["rating"]} for s in similar[:4]]
    return doc


# ------------------------- Public: courses -------------------------
@api_router.get("/courses")
async def list_courses(search: Optional[str] = None, level: Optional[str] = None,
                       mode: Optional[str] = None, category: Optional[str] = None, limit: int = 100):
    q: dict = {"status": "published"}
    if level:
        q["level"] = level
    if mode:
        q["modes"] = mode
    if category:
        q["category"] = category
    if search:
        q["$or"] = [{"name": {"$regex": search, "$options": "i"}},
                    {"category": {"$regex": search, "$options": "i"}},
                    {"specializations": {"$regex": search, "$options": "i"}}]
    docs = await db.courses.find(q, {"_id": 0}).to_list(200)
    return docs[:limit]

@api_router.get("/courses/{slug}")
async def get_course(slug: str):
    doc = await db.courses.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Course not found")
    return doc


# ------------------------- Public: comparison -------------------------
@api_router.get("/compare/universities")
async def compare_universities(slugs: str = Query(...)):
    slug_list = [s for s in slugs.split(",") if s][:4]
    docs = await db.universities.find({"slug": {"$in": slug_list}}, {"_id": 0}).to_list(10)
    docs.sort(key=lambda d: slug_list.index(d["slug"]) if d["slug"] in slug_list else 99)
    return docs

@api_router.get("/compare/courses")
async def compare_courses(slugs: str = Query(...)):
    slug_list = [s for s in slugs.split(",") if s][:4]
    docs = await db.courses.find({"slug": {"$in": slug_list}}, {"_id": 0}).to_list(10)
    docs.sort(key=lambda d: slug_list.index(d["slug"]) if d["slug"] in slug_list else 99)
    return docs


NAAC_SCORE = {"A++": 5, "A+": 4, "A": 3, "B++": 2, "B+": 1}

def _norm_cat(text):
    if not text:
        return None
    t = text.strip().upper().replace(".", "").replace(" ", "")
    mapping = {"BCOM": "BCOM", "MCOM": "MCOM", "MSC": "MSC", "BSC": "BSC", "PGDIPLOMA": "PGD", "PGD": "PGD"}
    if t in mapping:
        return mapping[t]
    if t in ("MBA", "MCA", "BCA", "BBA", "BA", "MA"):
        return t
    if "NOTSURE" in t or "ANY" in t:
        return None
    return t

@api_router.post("/advisor/recommend")
async def advisor_recommend(inp: AdvisorInput):
    cat = _norm_cat(inp.program_interest)
    unis = await db.universities.find({"status": "published"}, {"_id": 0}).to_list(500)
    candidates = [u for u in unis if (cat is None or cat in u.get("categories", []))]
    if not candidates:
        candidates = unis

    scored = []
    for u in candidates:
        score, reasons = 0.0, []
        score += (u.get("rating") or 0) * 2
        score += NAAC_SCORE.get(u.get("naac_grade"), 0)
        # program fee for chosen category
        prog = next((p for p in u.get("programs", []) if p["category"] == cat), None) if cat else None
        fee_min = prog["fee_min"] if prog else u.get("fee_min", 0)

        if inp.preferred_mode and inp.preferred_mode in ("Online", "Distance"):
            if inp.preferred_mode in u.get("modes", []):
                score += 3; reasons.append(f"Offers {inp.preferred_mode} mode")
        if inp.budget:
            if fee_min <= inp.budget:
                score += 3; reasons.append("Fits within your budget")
            else:
                score -= 3
        if inp.location and u.get("state", "").lower() == inp.location.lower():
            score += 2; reasons.append(f"Located in {u['state']}")

        pr = (inp.priority or "").lower()
        if pr == "cost":
            score += max(0, 3 - fee_min / 100000)
            if fee_min <= 100000:
                reasons.append("Affordable fees")
        elif pr in ("quality", "ranking"):
            score += NAAC_SCORE.get(u.get("naac_grade"), 0) * 0.8
            if u.get("nirf_rank"):
                score += 2; reasons.append(f"NIRF ranked #{u['nirf_rank']}")
            if u.get("naac_grade") in ("A++", "A+"):
                reasons.append(f"High NAAC grade ({u['naac_grade']})")
        elif pr == "recognition":
            rc = len(u.get("recognition", []))
            score += rc * 0.7
            reasons.append(f"{rc} recognitions incl. " + (", ".join(u.get("recognition", [])[:2])))
        elif pr == "flexibility":
            if "Online" in u.get("modes", []):
                score += 2; reasons.append("Fully online & flexible")

        if u.get("ugc_deb_approved"):
            score += 1
        if not reasons:
            reasons.append(f"NAAC {u.get('naac_grade')} accredited, UGC-entitled")
        scored.append({
            "slug": u["slug"], "name": u["name"], "short_name": u["short_name"],
            "logo_text": u["logo_text"], "logo_color": u["logo_color"], "city": u["city"],
            "state": u["state"], "naac_grade": u["naac_grade"], "rating": u["rating"],
            "modes": u["modes"], "fee_min": fee_min, "fee_max": (prog["fee_max"] if prog else u.get("fee_max")),
            "sponsored": u.get("sponsored", False),
            "match_score": round(score, 1), "match_reasons": reasons[:3],
        })

    scored.sort(key=lambda x: x["match_score"], reverse=True)
    top = scored[:4]
    if top:
        mx = top[0]["match_score"] or 1
        for t in top:
            t["match_percent"] = min(98, max(60, int((t["match_score"] / mx) * 92) + 6))

    recommended_program = None
    if cat:
        recommended_program = await db.courses.find_one({"category": cat, "status": "published"}, {"_id": 0, "body": 0})

    await db.events.insert_one({"event": "advisor_complete",
                                "props": {"program": inp.program_interest, "mode": inp.preferred_mode, "priority": inp.priority},
                                "created_at": datetime.now(timezone.utc).isoformat()})
    return {"recommendations": top, "recommended_program": recommended_program, "matched_category": cat}


# ------------------------- Public: guides & landing & search -------------------------
@api_router.get("/guides")
async def list_guides(category: Optional[str] = None, search: Optional[str] = None):
    q: dict = {"status": "published"}
    if category:
        q["category"] = category
    if search:
        q["$or"] = [{"title": {"$regex": search, "$options": "i"}},
                    {"excerpt": {"$regex": search, "$options": "i"}}]
    docs = await db.guides.find(q, {"_id": 0, "body": 0}).to_list(100)
    return docs

@api_router.get("/guides/{slug}")
async def get_guide(slug: str):
    doc = await db.guides.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Guide not found")
    related = await db.guides.find({"slug": {"$ne": slug}, "status": "published"},
                                    {"_id": 0, "body": 0}).to_list(4)
    doc["related"] = related[:3]
    return doc

@api_router.get("/landing/{slug}")
async def get_landing(slug: str):
    doc = await db.landing_pages.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Landing page not found")
    if doc.get("category"):
        unis = await db.universities.find(
            {"status": "published", "program_categories": _cat_name(doc["category"])}, {"_id": 0}).to_list(8)
    else:
        unis = await db.universities.find({"status": "published", "featured": True}, {"_id": 0}).to_list(6)
    doc["universities"] = unis
    return doc

def _cat_name(code):
    return seed_data._CATEGORY_NAMES.get(code, code)

@api_router.get("/search")
async def global_search(q: str = Query("")):
    if not q or len(q.strip()) < 1:
        return {"universities": [], "courses": [], "guides": []}
    rx = {"$regex": re.escape(q.strip()), "$options": "i"}
    unis = await db.universities.find(
        {"status": "published", "$or": [{"name": rx}, {"city": rx}, {"state": rx}, {"program_categories": rx}]},
        {"_id": 0}).to_list(8)
    courses = await db.courses.find(
        {"status": "published", "$or": [{"name": rx}, {"category": rx}, {"specializations": rx}]},
        {"_id": 0, "body": 0}).to_list(8)
    guides = await db.guides.find(
        {"status": "published", "$or": [{"title": rx}, {"excerpt": rx}, {"category": rx}]},
        {"_id": 0, "body": 0}).to_list(6)
    return {"universities": unis, "courses": courses, "guides": guides}


# ------------------------- Public: leads & events -------------------------
@api_router.post("/leads")
async def create_lead(lead: LeadInput):
    now = datetime.now(timezone.utc)
    # dedup within 24h by phone
    since = (now - timedelta(hours=24)).isoformat()
    existing = await db.leads.find_one({"phone": lead.phone, "created_at": {"$gte": since}})
    doc = lead.model_dump()
    doc["id"] = uuid.uuid4().hex
    doc["lead_id"] = "ETI-" + now.strftime("%y%m%d") + "-" + uuid.uuid4().hex[:5].upper()
    doc["created_at"] = now.isoformat()
    doc["lead_status"] = "new"
    doc["partner_handoff_status"] = "pending"
    doc["outcome"] = None
    doc["notes"] = None
    doc["duplicate"] = bool(existing)
    await db.leads.insert_one(doc)
    await db.events.insert_one({"event": "lead_submit", "props": {"lead_id": doc["lead_id"], "program": lead.program_interest},
                                "created_at": now.isoformat()})
    return {"success": True, "lead_id": doc["lead_id"],
            "message": "Thank you! An education advisor will reach out shortly."}

@api_router.post("/events")
async def track_event(ev: EventInput):
    await db.events.insert_one({"event": ev.event, "props": ev.props or {},
                                "session_id": ev.session_id, "path": ev.path,
                                "created_at": datetime.now(timezone.utc).isoformat()})
    return {"ok": True}


# ------------------------- Auth endpoints -------------------------
@api_router.post("/auth/login")
async def login(data: LoginInput, response: Response):
    email = data.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    uid = str(user["_id"])
    access = create_access_token(uid, email)
    refresh = create_refresh_token(uid)
    set_auth_cookies(response, access, refresh)
    return {"access_token": access, "user": {"id": uid, "email": email, "name": user.get("name"), "role": user.get("role")}}

@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"ok": True}


# ------------------------- Admin: stats & analytics -------------------------
@api_router.get("/admin/stats")
async def admin_stats(user: dict = Depends(get_current_user)):
    total_leads = await db.leads.count_documents({})
    new_leads = await db.leads.count_documents({"lead_status": "new"})
    unis = await db.universities.count_documents({})
    courses = await db.courses.count_documents({})
    guides = await db.guides.count_documents({})
    # events summary
    pipeline = [{"$group": {"_id": "$event", "count": {"$sum": 1}}}]
    events = {e["_id"]: e["count"] async for e in db.events.aggregate(pipeline)}
    recent = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(8)
    # leads by program
    prog_pipe = [{"$group": {"_id": "$program_interest", "count": {"$sum": 1}}}, {"$sort": {"count": -1}}]
    by_program = [{"program": p["_id"], "count": p["count"]} async for p in db.leads.aggregate(prog_pipe)]
    return {"total_leads": total_leads, "new_leads": new_leads, "universities": unis,
            "courses": courses, "guides": guides, "events": events,
            "recent_leads": recent, "leads_by_program": by_program[:8]}


# ------------------------- Admin: leads -------------------------
@api_router.get("/admin/leads")
async def admin_leads(status: Optional[str] = None, user: dict = Depends(get_current_user)):
    q = {}
    if status:
        q["lead_status"] = status
    docs = await db.leads.find(q, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs

@api_router.put("/admin/leads/{lead_id}")
async def update_lead(lead_id: str, upd: LeadStatusUpdate, user: dict = Depends(get_current_user)):
    changes = {k: v for k, v in upd.model_dump().items() if v is not None}
    if changes:
        await db.leads.update_one({"lead_id": lead_id}, {"$set": changes})
        if changes.get("partner_handoff_status") == "success":
            await db.events.insert_one({"event": "partner_handoff", "props": {"lead_id": lead_id},
                                        "created_at": datetime.now(timezone.utc).isoformat()})
    doc = await db.leads.find_one({"lead_id": lead_id}, {"_id": 0})
    return doc

@api_router.get("/admin/leads/export")
async def export_leads(user: dict = Depends(get_current_user)):
    docs = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(5000)
    fields = ["lead_id", "created_at", "name", "phone", "email", "qualification", "program_interest",
              "preferred_mode", "current_status", "preferred_location", "source", "campaign",
              "landing_page", "utm_source", "utm_medium", "utm_campaign", "context_type", "context_slug",
              "cta_label", "consent", "lead_status", "partner_handoff_status", "outcome", "notes"]
    buf = io.StringIO()
    w = csv.DictWriter(buf, fieldnames=fields, extrasaction="ignore")
    w.writeheader()
    for d in docs:
        w.writerow(d)
    buf.seek(0)
    return StreamingResponse(iter([buf.getvalue()]), media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=eti-leads.csv"})


# ------------------------- Admin: settings -------------------------
@api_router.get("/admin/config/settings")
async def admin_get_settings(user: dict = Depends(get_current_user)):
    s = await db.settings.find_one({"id": "site_settings"}, {"_id": 0})
    return s or seed_data.SETTINGS

@api_router.put("/admin/config/settings")
async def admin_update_settings(upd: SettingsUpdate, user: dict = Depends(get_current_user)):
    changes = {k: v for k, v in upd.model_dump().items() if v is not None}
    await db.settings.update_one({"id": "site_settings"}, {"$set": changes}, upsert=True)
    return await db.settings.find_one({"id": "site_settings"}, {"_id": 0})


# ------------------------- Admin: generic CRUD (universities/courses/guides/landing) -------------------------
COLLECTIONS = {"universities": "universities", "courses": "courses", "guides": "guides", "landing": "landing_pages"}

@api_router.get("/admin/{entity}")
async def admin_list(entity: str, user: dict = Depends(get_current_user)):
    if entity not in COLLECTIONS:
        raise HTTPException(status_code=404, detail="Unknown entity")
    docs = await db[COLLECTIONS[entity]].find({}, {"_id": 0}).to_list(1000)
    return docs

@api_router.get("/admin/{entity}/{slug}")
async def admin_get(entity: str, slug: str, user: dict = Depends(get_current_user)):
    if entity not in COLLECTIONS:
        raise HTTPException(status_code=404, detail="Unknown entity")
    doc = await db[COLLECTIONS[entity]].find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")
    return doc

@api_router.post("/admin/{entity}")
async def admin_create(entity: str, payload: dict, user: dict = Depends(get_current_user)):
    if entity not in COLLECTIONS:
        raise HTTPException(status_code=404, detail="Unknown entity")
    coll = db[COLLECTIONS[entity]]
    if not payload.get("slug"):
        payload["slug"] = slugify(payload.get("name") or payload.get("title") or "")
    if await coll.find_one({"slug": payload["slug"]}):
        raise HTTPException(status_code=400, detail="Slug already exists")
    payload.setdefault("status", "published")
    payload.setdefault("last_verified", datetime.now(timezone.utc).strftime("%Y-%m-%d"))
    payload["id"] = uuid.uuid4().hex
    await coll.insert_one(dict(payload))
    return clean(dict(payload))

@api_router.put("/admin/{entity}/{slug}")
async def admin_update(entity: str, slug: str, payload: dict, user: dict = Depends(get_current_user)):
    if entity not in COLLECTIONS:
        raise HTTPException(status_code=404, detail="Unknown entity")
    coll = db[COLLECTIONS[entity]]
    payload.pop("_id", None)
    payload.pop("id", None)
    result = await coll.update_one({"slug": slug}, {"$set": payload})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    doc = await coll.find_one({"slug": payload.get("slug", slug)}, {"_id": 0})
    return doc

@api_router.delete("/admin/{entity}/{slug}")
async def admin_delete(entity: str, slug: str, user: dict = Depends(get_current_user)):
    if entity not in COLLECTIONS:
        raise HTTPException(status_code=404, detail="Unknown entity")
    await db[COLLECTIONS[entity]].delete_one({"slug": slug})
    return {"ok": True}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------- Startup: seed -------------------------
@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({"email": admin_email, "password_hash": hash_password(admin_password),
                                   "name": "ETI Admin", "role": "admin",
                                   "created_at": datetime.now(timezone.utc).isoformat()})
        logger.info("Seeded admin user")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})

    if await db.universities.count_documents({}) == 0:
        await db.universities.insert_many(seed_data.build_universities())
        logger.info("Seeded universities")
    if await db.courses.count_documents({}) == 0:
        await db.courses.insert_many(seed_data.build_programs())
        logger.info("Seeded courses")
    if await db.guides.count_documents({}) == 0:
        await db.guides.insert_many([{**g, "id": uuid.uuid4().hex, "status": "published",
                                      "last_verified": seed_data.VERIFIED,
                                      "published_at": datetime.now(timezone.utc).isoformat()} for g in seed_data.GUIDES])
        logger.info("Seeded guides")
    if await db.landing_pages.count_documents({}) == 0:
        await db.landing_pages.insert_many([{**l, "id": uuid.uuid4().hex} for l in seed_data.LANDING_PAGES])
        logger.info("Seeded landing pages")
    if await db.settings.count_documents({"id": "site_settings"}) == 0:
        await db.settings.insert_one(dict(seed_data.SETTINGS))
        logger.info("Seeded settings")


@app.on_event("shutdown")
async def shutdown():
    client.close()
