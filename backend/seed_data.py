"""Seed data for ETI EduConnect — universities, programs, guides, landing pages, settings.
Data is indicative/illustrative for V1 discovery; every factual field carries a source + verified date."""

VERIFIED = "2026-01-15"

# ---------------------------------------------------------------------------
# PROGRAM CATEGORIES (generic course/program profiles)
# ---------------------------------------------------------------------------
PROGRAMS = [
    {
        "slug": "online-mba", "name": "Online MBA", "category": "MBA", "degree_type": "Degree",
        "level": "PG", "duration": "2 Years", "fee_min": 90000, "fee_max": 350000,
        "modes": ["Online", "Distance"],
        "eligibility": "Bachelor's degree (any discipline) with 50% aggregate. Some universities relax to 45% for reserved categories.",
        "what_it_is": "A UGC-entitled Master of Business Administration delivered online, covering management fundamentals, leadership, finance, marketing and strategy with the same degree value as an on-campus MBA.",
        "who_suits": "Working professionals seeking career progression, entrepreneurs, and graduates wanting a flexible, industry-relevant management qualification.",
        "specializations": ["Marketing", "Finance", "Human Resource", "Operations", "Business Analytics", "IT & Systems", "International Business", "Healthcare Management"],
        "careers": ["Business Analyst", "Marketing Manager", "Operations Lead", "Product Manager", "Consultant", "Entrepreneur"],
        "curriculum": ["Managerial Economics", "Financial Accounting", "Marketing Management", "Organisational Behaviour", "Business Analytics", "Strategic Management", "Capstone Project"],
    },
    {
        "slug": "online-mca", "name": "Online MCA", "category": "MCA", "degree_type": "Degree",
        "level": "PG", "duration": "2 Years", "fee_min": 80000, "fee_max": 200000,
        "modes": ["Online", "Distance"],
        "eligibility": "Bachelor's degree with Mathematics/Computer Science, or BCA/B.Sc (CS/IT) with 50% aggregate.",
        "what_it_is": "A Master of Computer Applications focused on advanced software development, data structures, cloud, and emerging technologies, delivered fully online.",
        "who_suits": "Graduates and IT professionals wanting deeper software engineering, data or cloud expertise with a recognised PG degree.",
        "specializations": ["Data Science", "Cloud Computing", "Cyber Security", "Artificial Intelligence", "Full Stack Development"],
        "careers": ["Software Engineer", "Data Analyst", "Cloud Engineer", "DevOps Engineer", "System Architect"],
        "curriculum": ["Advanced Data Structures", "DBMS", "Operating Systems", "Cloud Computing", "Machine Learning", "Software Engineering", "Major Project"],
    },
    {
        "slug": "online-bca", "name": "Online BCA", "category": "BCA", "degree_type": "Degree",
        "level": "UG", "duration": "3 Years", "fee_min": 60000, "fee_max": 180000,
        "modes": ["Online", "Distance"],
        "eligibility": "10+2 pass in any stream from a recognised board. Mathematics preferred but not mandatory at most universities.",
        "what_it_is": "A Bachelor of Computer Applications building programming, web, database and application development foundations online.",
        "who_suits": "12th-pass students and early-career learners wanting an affordable, flexible entry into the tech industry.",
        "specializations": ["Web Development", "Data Analytics", "Cloud & DevOps", "AI & ML", "Mobile App Development"],
        "careers": ["Junior Developer", "Web Developer", "QA Analyst", "Support Engineer", "Data Entry to Analyst track"],
        "curriculum": ["Programming in C/Python", "Web Technologies", "DBMS", "Data Structures", "OOP with Java", "Software Project"],
    },
    {
        "slug": "online-bba", "name": "Online BBA", "category": "BBA", "degree_type": "Degree",
        "level": "UG", "duration": "3 Years", "fee_min": 55000, "fee_max": 170000,
        "modes": ["Online", "Distance"],
        "eligibility": "10+2 pass in any stream from a recognised board with minimum 45-50% aggregate.",
        "what_it_is": "A Bachelor of Business Administration introducing management, marketing, finance and entrepreneurship, ideal as a stepping stone to an MBA.",
        "who_suits": "12th-pass students aiming for management careers or family-business roles, and those planning a future MBA.",
        "specializations": ["Marketing", "Finance", "HR", "Digital Marketing", "Entrepreneurship"],
        "careers": ["Sales Executive", "Marketing Associate", "HR Coordinator", "Business Development", "Operations Associate"],
        "curriculum": ["Principles of Management", "Business Economics", "Accounting", "Marketing", "Business Law", "Project Work"],
    },
    {
        "slug": "online-bcom", "name": "Online B.Com", "category": "BCOM", "degree_type": "Degree",
        "level": "UG", "duration": "3 Years", "fee_min": 30000, "fee_max": 120000,
        "modes": ["Online", "Distance"],
        "eligibility": "10+2 pass in any stream (Commerce preferred) from a recognised board.",
        "what_it_is": "A Bachelor of Commerce covering accounting, taxation, economics and finance, suited to accounting and finance career tracks.",
        "who_suits": "Students pursuing CA/CS/CMA alongside, and those targeting accounting, banking and finance roles.",
        "specializations": ["Accounting & Finance", "Banking", "Taxation", "Financial Markets"],
        "careers": ["Accountant", "Tax Assistant", "Banking Associate", "Audit Assistant", "Finance Executive"],
        "curriculum": ["Financial Accounting", "Business Statistics", "Corporate Law", "Income Tax", "Cost Accounting", "Auditing"],
    },
    {
        "slug": "online-mcom", "name": "Online M.Com", "category": "MCOM", "degree_type": "Degree",
        "level": "PG", "duration": "2 Years", "fee_min": 30000, "fee_max": 110000,
        "modes": ["Online", "Distance"],
        "eligibility": "B.Com or equivalent bachelor's degree with 50% aggregate.",
        "what_it_is": "A Master of Commerce deepening expertise in advanced accounting, finance and business research.",
        "who_suits": "Commerce graduates targeting teaching, research, or senior accounting and finance roles.",
        "specializations": ["Accounting & Finance", "Banking & Finance", "Taxation"],
        "careers": ["Senior Accountant", "Finance Analyst", "Lecturer", "Research Associate"],
        "curriculum": ["Advanced Accounting", "Managerial Economics", "Financial Management", "Research Methodology", "Dissertation"],
    },
    {
        "slug": "online-ba", "name": "Online BA", "category": "BA", "degree_type": "Degree",
        "level": "UG", "duration": "3 Years", "fee_min": 25000, "fee_max": 100000,
        "modes": ["Online", "Distance"],
        "eligibility": "10+2 pass in any stream from a recognised board.",
        "what_it_is": "A flexible Bachelor of Arts across humanities disciplines such as English, Political Science, Sociology, and Economics.",
        "who_suits": "Students seeking a broad foundation for civil services, journalism, law, or further postgraduate study.",
        "specializations": ["English", "Political Science", "Sociology", "Economics", "History", "Psychology"],
        "careers": ["Content Writer", "Civil Services aspirant", "Journalist", "Teacher", "Social Worker"],
        "curriculum": ["Core discipline papers", "Language & Communication", "Environmental Studies", "Electives", "Project"],
    },
    {
        "slug": "online-ma", "name": "Online MA", "category": "MA", "degree_type": "Degree",
        "level": "PG", "duration": "2 Years", "fee_min": 25000, "fee_max": 120000,
        "modes": ["Online", "Distance"],
        "eligibility": "Bachelor's degree in a relevant/any discipline with 45-50% aggregate.",
        "what_it_is": "A Master of Arts offering advanced study in humanities subjects with research orientation.",
        "who_suits": "Graduates aiming for teaching, research, content, policy or civil-services careers.",
        "specializations": ["English", "Political Science", "Economics", "Sociology", "Psychology", "Public Administration"],
        "careers": ["Assistant Professor", "Researcher", "Policy Analyst", "Editor", "Civil Services aspirant"],
        "curriculum": ["Advanced theory papers", "Research Methodology", "Electives", "Dissertation"],
    },
    {
        "slug": "online-msc-data-science", "name": "Online M.Sc Data Science", "category": "MSC", "degree_type": "Degree",
        "level": "PG", "duration": "2 Years", "fee_min": 100000, "fee_max": 300000,
        "modes": ["Online"],
        "eligibility": "Bachelor's degree with Mathematics/Statistics/Computer Science background and 50% aggregate.",
        "what_it_is": "A Master of Science in Data Science covering statistics, machine learning, big data and applied analytics.",
        "who_suits": "STEM graduates and analysts targeting data science, ML and analytics leadership roles.",
        "specializations": ["Machine Learning", "Big Data", "Business Analytics", "AI"],
        "careers": ["Data Scientist", "ML Engineer", "Analytics Manager", "Data Engineer"],
        "curriculum": ["Statistics for DS", "Python for Data Science", "Machine Learning", "Big Data Systems", "Deep Learning", "Capstone"],
    },
    {
        "slug": "online-bsc", "name": "Online B.Sc", "category": "BSC", "degree_type": "Degree",
        "level": "UG", "duration": "3 Years", "fee_min": 45000, "fee_max": 150000,
        "modes": ["Online", "Distance"],
        "eligibility": "10+2 with Science/Mathematics from a recognised board (subject-dependent).",
        "what_it_is": "A Bachelor of Science across data science, mathematics, and applied computing specialisations delivered online.",
        "who_suits": "Science students seeking flexible UG study aligned to analytics and technology careers.",
        "specializations": ["Data Science", "Mathematics", "Computer Science"],
        "careers": ["Data Analyst", "Lab/Research Assistant", "Technical Associate"],
        "curriculum": ["Core science papers", "Mathematics", "Programming", "Statistics", "Project"],
    },
    {
        "slug": "pg-diploma-digital-marketing", "name": "PG Diploma in Digital Marketing", "category": "PGD", "degree_type": "Diploma",
        "level": "PG", "duration": "1 Year", "fee_min": 40000, "fee_max": 120000,
        "modes": ["Online"],
        "eligibility": "Bachelor's degree in any discipline.",
        "what_it_is": "An industry-focused postgraduate diploma covering SEO, performance marketing, social media, and analytics.",
        "who_suits": "Graduates and professionals switching into or upskilling within digital marketing.",
        "specializations": ["SEO & Content", "Performance Marketing", "Social Media", "Marketing Analytics"],
        "careers": ["Digital Marketing Executive", "SEO Specialist", "Performance Marketer", "Social Media Manager"],
        "curriculum": ["Digital Marketing Fundamentals", "SEO & SEM", "Social Media Marketing", "Web Analytics", "Capstone Campaign"],
    },
    {
        "slug": "online-blib", "name": "Online BA (Public Administration)", "category": "BA", "degree_type": "Degree",
        "level": "UG", "duration": "3 Years", "fee_min": 28000, "fee_max": 90000,
        "modes": ["Distance", "Online"],
        "eligibility": "10+2 pass in any stream from a recognised board.",
        "what_it_is": "A Bachelor of Arts specialising in Public Administration for governance and administrative career pathways.",
        "who_suits": "Civil-services aspirants and students interested in governance and public policy.",
        "specializations": ["Public Administration", "Political Science"],
        "careers": ["Civil Services aspirant", "Government Executive", "NGO Coordinator", "Policy Assistant"],
        "curriculum": ["Public Administration Theory", "Indian Government & Politics", "Public Policy", "Governance", "Project"],
    },
]

# ---------------------------------------------------------------------------
# UNIVERSITIES
# ---------------------------------------------------------------------------
def _u(slug, name, short, type_, city, state, est, modes, naac, deb, aicte, wes, nirf,
       rating, fmin, fmax, cats, sponsored=False, featured=False):
    return {
        "slug": slug, "name": name, "short_name": short, "type": type_,
        "city": city, "state": state, "established_year": est, "modes": modes,
        "naac_grade": naac, "ugc_deb_approved": deb, "aicte_approved": aicte,
        "wes_recognized": wes, "nirf_rank": nirf, "rating": rating,
        "fee_min": fmin, "fee_max": fmax, "categories": cats,
        "sponsored": sponsored, "featured": featured,
    }

_RAW_UNIS = [
    _u("amity-university-online", "Amity University Online", "AMITY", "Private", "Noida", "Uttar Pradesh", 2005,
       ["Online", "Distance"], "A+", True, True, True, None, 4.4, 99000, 320000,
       ["MBA", "MCA", "BCA", "BBA", "BCOM", "BA", "MA", "MSC"], sponsored=True, featured=True),
    _u("manipal-online-mahe", "Manipal University Online (MAHE)", "MAHE", "Deemed", "Manipal", "Karnataka", 1993,
       ["Online"], "A++", True, True, True, 64, 4.6, 100000, 280000,
       ["MBA", "MCA", "BCA", "BCOM", "MCOM", "MSC"], featured=True),
    _u("nmims-global", "NMIMS Global Access (CDOE)", "NGA-SCE", "Deemed", "Mumbai", "Maharashtra", 1981,
       ["Online", "Distance"], "A+", True, True, False, None, 4.5, 120000, 300000,
       ["MBA", "BBA", "BCOM", "PGD"], featured=True),
    _u("lpu-online", "Lovely Professional University Online", "LPU", "Private", "Jalandhar", "Punjab", 2005,
       ["Online", "Distance"], "A++", True, True, False, None, 4.3, 80000, 240000,
       ["MBA", "MCA", "BCA", "BBA", "BCOM", "BA", "MA"], featured=True),
    _u("chandigarh-university-online", "Chandigarh University Online", "CU", "Private", "Mohali", "Punjab", 2012,
       ["Online"], "A+", True, True, False, None, 4.3, 85000, 230000,
       ["MBA", "MCA", "BCA", "BBA", "BCOM"], sponsored=True),
    _u("jain-university-online", "Jain (Deemed-to-be University) Online", "JAIN", "Deemed", "Bengaluru", "Karnataka", 1990,
       ["Online"], "A++", True, True, False, None, 4.2, 85000, 210000,
       ["MBA", "MCA", "BCA", "BBA", "BCOM", "MCOM", "BA", "MA"]),
    _u("dy-patil-online", "DY Patil University Online", "DPU", "Deemed", "Navi Mumbai", "Maharashtra", 2002,
       ["Online"], "A++", True, True, False, None, 4.1, 95000, 260000,
       ["MBA", "MCA", "BBA", "BCOM"]),
    _u("upes-online", "UPES Online (Dehradun)", "UPES", "Private", "Dehradun", "Uttarakhand", 2003,
       ["Online"], "A", True, True, False, 52, 4.2, 150000, 300000,
       ["MBA", "MCA", "BBA", "BCOM"]),
    _u("vgu-online", "Vivekananda Global University Online", "VGU", "Private", "Jaipur", "Rajasthan", 2012,
       ["Online"], "A+", True, True, False, None, 4.0, 55000, 160000,
       ["MBA", "MCA", "BCA", "BBA", "BCOM", "BA"]),
    _u("suresh-gyan-vihar-online", "Suresh Gyan Vihar University Online", "SGVU", "Private", "Jaipur", "Rajasthan", 2008,
       ["Online", "Distance"], "A+", True, True, False, None, 3.9, 50000, 150000,
       ["MBA", "MCA", "BCA", "BBA", "BCOM", "MA"]),
    _u("ignou", "Indira Gandhi National Open University (IGNOU)", "IGNOU", "Central", "New Delhi", "Delhi", 1985,
       ["Distance", "Online"], "A++", True, True, False, None, 4.4, 8000, 60000,
       ["MBA", "MCA", "BCA", "BCOM", "MCOM", "BA", "MA", "BSC"], featured=True),
    _u("du-sol", "University of Delhi — SOL", "DU SOL", "Central", "New Delhi", "Delhi", 1962,
       ["Distance"], "A+", True, False, False, None, 4.1, 6000, 45000,
       ["BCOM", "BA", "MA", "MCOM"]),
    _u("annamalai-university-dde", "Annamalai University (DDE)", "AU", "State", "Chidambaram", "Tamil Nadu", 1929,
       ["Distance"], "A", True, False, False, None, 3.8, 15000, 80000,
       ["MBA", "BCOM", "BA", "MA", "MCOM"]),
    _u("kurukshetra-university-ddel", "Kurukshetra University (DDE)", "KUK", "State", "Kurukshetra", "Haryana", 1956,
       ["Distance"], "A+", True, False, False, None, 3.9, 12000, 70000,
       ["MBA", "BCOM", "BA", "MA"]),
    _u("sikkim-manipal-smude", "Sikkim Manipal University (SMU-DE)", "SMU", "Private", "Gangtok", "Sikkim", 1995,
       ["Distance", "Online"], "A", True, True, False, None, 3.9, 45000, 160000,
       ["MBA", "MCA", "BCA", "BCOM", "BA"]),
    _u("uttaranchal-university-online", "Uttaranchal University Online", "UU", "Private", "Dehradun", "Uttarakhand", 2013,
       ["Online"], "A+", True, True, False, None, 3.9, 60000, 150000,
       ["MBA", "MCA", "BCA", "BBA", "BCOM"]),
    _u("shoolini-online", "Shoolini University Online", "SU", "Private", "Solan", "Himachal Pradesh", 2009,
       ["Online"], "A", True, True, False, 96, 4.0, 70000, 180000,
       ["MBA", "BCA", "BBA", "BCOM"]),
    _u("gla-university-online", "GLA University Online", "GLA", "Private", "Mathura", "Uttar Pradesh", 2010,
       ["Online"], "A+", True, True, False, None, 4.0, 65000, 170000,
       ["MBA", "MCA", "BCA", "BBA"]),
    _u("mangalayatan-online", "Mangalayatan University Online", "MU", "Private", "Aligarh", "Uttar Pradesh", 2006,
       ["Online", "Distance"], "A+", True, True, False, None, 3.8, 40000, 120000,
       ["MBA", "MCA", "BCA", "BBA", "BCOM", "BA", "MA"]),
    _u("bharati-vidyapeeth-online", "Bharati Vidyapeeth (Deemed) Online", "BVDU", "Deemed", "Pune", "Maharashtra", 1964,
       ["Online"], "A+", True, True, False, None, 4.0, 80000, 190000,
       ["MBA", "MCA", "BBA", "BCOM"]),
    _u("mizoram-university-online", "Vignan Online (VFSTR)", "VIGNAN", "Deemed", "Guntur", "Andhra Pradesh", 1997,
       ["Online"], "A+", True, True, False, None, 3.9, 70000, 175000,
       ["MBA", "MCA", "BCA", "BBA", "BCOM"]),
    _u("kalinga-online", "KIIT / KSOM Online", "KIIT", "Deemed", "Bhubaneswar", "Odisha", 1997,
       ["Online"], "A++", True, True, False, 30, 4.3, 110000, 260000,
       ["MBA", "MCA", "BBA"]),
]

_COVERS = [
    "https://images.unsplash.com/photo-1788022907454-107301247c98?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHw0fHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwc3R1ZGVudHMlMjBzdHVkeSUyMGxpYnJhcnl8ZW58MHx8fHwxNzkwNDk0MzIzfDA&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1775503059048-214026cce5cf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjB1bml2ZXJzaXR5JTIwYXJjaGl0ZWN0dXJlJTIwY2FtcHVzfGVufDB8fHx8MTc5MDQ5NDMyOXww&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1762512346988-045f4d5ad2b3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwzfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwc3R1ZGVudHMlMjBzdHVkeSUyMGxpYnJhcnl8ZW58MHx8fHwxNzkwNDk0MzIzfDA&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1761492190275-129cf71ff124?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwc3R1ZGVudHMlMjBzdHVkeSUyMGxpYnJhcnl8ZW58MHx8fHwxNzkwNDk0MzIzfDA&ixlib=rb-4.1.0&q=85",
]
_LOGO_COLORS = ["#0A2472", "#1237A3", "#2563EB", "#059669", "#7C3AED", "#0891B2", "#B91C1C", "#B45309"]

_CATEGORY_NAMES = {
    "MBA": "MBA", "MCA": "MCA", "BCA": "BCA", "BBA": "BBA", "BCOM": "B.Com",
    "MCOM": "M.Com", "BA": "BA", "MA": "MA", "MSC": "M.Sc", "BSC": "B.Sc",
    "PGD": "PG Diploma", "PGDM": "PGDM",
}


def _initials(name):
    parts = [p for p in name.replace("(", " ").replace(")", " ").split() if p[0].isalpha()]
    caps = [p for p in parts if p[0].isupper()]
    letters = "".join(p[0] for p in caps[:2]) if caps else name[:2].upper()
    return letters.upper()


def build_universities():
    unis = []
    for i, r in enumerate(_RAW_UNIS):
        cat_names = [_CATEGORY_NAMES.get(c, c) for c in r["categories"]]
        embedded = []
        for c in r["categories"]:
            prog = next((p for p in PROGRAMS if p["category"] == c), None)
            if not prog:
                continue
            embedded.append({
                "category": c,
                "name": prog["name"].replace("Online ", ""),
                "duration": prog["duration"],
                "fee_min": max(r["fee_min"], int(prog["fee_min"] * 0.9)),
                "fee_max": min(r["fee_max"], prog["fee_max"]),
                "specializations": prog["specializations"][:5],
                "eligibility": prog["eligibility"],
            })
        recognition = []
        if r["naac_grade"]:
            recognition.append(f"NAAC {r['naac_grade']} Accredited")
        if r["ugc_deb_approved"]:
            recognition.append("UGC-DEB Approved (Online/Distance)")
        if r["aicte_approved"]:
            recognition.append("AICTE Approved")
        if r["wes_recognized"]:
            recognition.append("WES Recognized (Global Equivalence)")
        if r["nirf_rank"]:
            recognition.append(f"NIRF Ranked #{r['nirf_rank']}")
        unis.append({
            **r,
            "logo_text": _initials(r["name"]),
            "logo_color": _LOGO_COLORS[i % len(_LOGO_COLORS)],
            "cover_url": _COVERS[i % len(_COVERS)],
            "program_categories": cat_names,
            "programs": embedded,
            "recognition": recognition,
            "description": f"{r['name']} is a {r['naac_grade']}-accredited {r['type'].lower()} institution based in {r['city']}, {r['state']}, offering UGC-entitled {'online' if 'Online' in r['modes'] else 'distance'} programs designed for flexible, career-focused learning.",
            "overview": f"Established in {r['established_year']}, {r['name']} delivers {', '.join(r['modes']).lower()} education across {len(cat_names)} program categories. Its {'online' if 'Online' in r['modes'] else 'distance'} degrees carry the same value as on-campus degrees and are recognised by UGC for higher study and employment.",
            "learning_info": "Learning is delivered through recorded and live sessions, an LMS with e-content, discussion forums and digital library access. Students study at their own pace with structured weekly modules.",
            "exam_info": "Assessments combine continuous internal evaluation (assignments/quizzes) with end-term examinations conducted through remote proctored mode or at designated centres, depending on the program.",
            "academic_process": "Admission → LMS onboarding → semester coursework → internal assessments → proctored term exams → results → degree on completion. Dedicated academic support is available throughout.",
            "faqs": [
                {"q": f"Is the {r['short_name']} online/distance degree valid?", "a": f"Yes. {r['name']} programs referenced here are UGC-entitled and, where applicable, AICTE/NAAC recognised. Online and distance degrees hold the same value as regular degrees for higher education and jobs."},
                {"q": "Can working professionals manage the coursework?", "a": "Yes. The programs are designed for flexibility with recorded lectures, weekend live classes and self-paced modules suited to working professionals."},
                {"q": "How are examinations conducted?", "a": "Most programs use remote proctored online exams; some may require designated exam centres. Always verify the current exam mode for your specific program."},
            ],
            "source_url": "https://www.ugc.gov.in/deb/",
            "last_verified": VERIFIED,
            "status": "published",
        })
    return unis


def build_programs():
    unis = build_universities()
    out = []
    for p in PROGRAMS:
        offering = [
            {"slug": u["slug"], "name": u["name"], "short_name": u["short_name"],
             "logo_text": u["logo_text"], "logo_color": u["logo_color"],
             "naac_grade": u["naac_grade"], "city": u["city"], "state": u["state"],
             "fee_min": next((e["fee_min"] for e in u["programs"] if e["category"] == p["category"]), u["fee_min"]),
             "fee_max": next((e["fee_max"] for e in u["programs"] if e["category"] == p["category"]), u["fee_max"])}
            for u in unis if p["category"] in u["categories"]
        ]
        out.append({
            **p,
            "universities": offering,
            "online_vs_distance": f"Online {p['name'].replace('Online ', '')} offers live/recorded classes, digital assessments and greater flexibility, while distance mode relies more on self-study material and centre-based exams. For {p['category']}, verify delivery and exam mode per university before deciding.",
            "faqs": [
                {"q": f"Who should pursue a {p['name']}?", "a": p["who_suits"]},
                {"q": f"What is the eligibility for {p['name']}?", "a": p["eligibility"]},
                {"q": f"What is the typical duration and fee?", "a": f"Duration is {p['duration']}, with indicative fees ranging from ₹{p['fee_min']:,} to ₹{p['fee_max']:,} across universities."},
            ],
            "source_url": "https://www.ugc.gov.in/deb/",
            "last_verified": VERIFIED,
            "status": "published",
        })
    return out


# ---------------------------------------------------------------------------
# GUIDES / KNOWLEDGE HUB
# ---------------------------------------------------------------------------
_GUIDE_COVER = _COVERS[3]
GUIDES = [
    {
        "slug": "online-vs-distance-education-explained", "title": "Online vs Distance Education: What's the Real Difference?",
        "category": "Online vs Distance", "excerpt": "A clear, no-hype breakdown of how online and distance learning differ across delivery, interaction, flexibility and assessment — and how to choose.",
        "cover_url": _COVERS[2], "author": "ETI EduConnect Editorial",
        "direct_answer": "Online education is delivered fully over the internet with live/recorded classes and digital exams, while distance education relies more on printed/self-study material with centre-based exams. Both can be UGC-recognised and equally valid — the right choice depends on your need for interaction, flexibility and support.",
        "key_facts": ["Both modes can be UGC-DEB approved and hold equal degree value", "Online = higher interaction, digital exams, more support", "Distance = lower cost, self-paced, fewer live touchpoints", "Always verify approvals per university and program"],
        "body": "Choosing between online and distance education is one of the most common questions learners face. Both are legitimate, flexible pathways — but they differ in how you learn, how much you interact, and how you're assessed.\n\n**Delivery:** Online programs use a Learning Management System (LMS) with live and recorded lectures, e-content and discussion forums. Distance programs traditionally provide self-learning material (printed or PDF) with limited live contact.\n\n**Interaction:** Online modes offer more real-time faculty interaction, doubt-clearing and peer collaboration. Distance modes are more independent.\n\n**Flexibility:** Both are flexible, but online adds recorded content you can revisit anytime.\n\n**Assessment:** Online typically uses remote proctored exams; distance often uses designated exam centres.\n\n**Recognition:** A UGC-DEB approved degree — whether online or distance — carries the same value for jobs and higher study.",
        "who_suits": "Working professionals who want structure and interaction should lean online; highly self-driven learners on a tight budget may prefer distance.",
        "caveats": "Approvals and exam modes vary by university and program. Always verify the current UGC-DEB status and delivery format before enrolling.",
    },
    {
        "slug": "is-online-mba-worth-it", "title": "Is an Online MBA Worth It in 2026?",
        "category": "Program Explainers", "excerpt": "An honest look at the value, outcomes and caveats of an online MBA — who it helps, what it costs, and what to check first.",
        "cover_url": _COVERS[0], "author": "ETI EduConnect Editorial",
        "direct_answer": "An online MBA from a UGC-entitled, NAAC-accredited university can be genuinely worth it for working professionals seeking career growth, flexibility and affordability — provided you verify approvals and pick a specialisation aligned to your goals.",
        "key_facts": ["UGC-entitled online MBA = same degree value as regular MBA", "Indicative fees: ₹90,000 – ₹3,50,000", "Duration: typically 2 years", "Specialisations shape ROI more than brand alone"],
        "body": "An online MBA is one of India's most in-demand online programs. Its value depends less on the 'online' label and more on accreditation, specialisation fit and how you apply it.\n\n**When it's worth it:** You're working and can't pause your career; you want a recognised management credential; you're targeting a promotion or a switch.\n\n**What to check:** UGC-DEB entitlement, NAAC grade, specialisation depth, live-session availability, and any placement/career support.\n\n**Realistic expectations:** A degree opens doors; outcomes depend on your effort, network and experience. Avoid any claim that guarantees placement or salary.",
        "who_suits": "Working professionals, entrepreneurs and graduates seeking flexible, recognised management education.",
        "caveats": "No program can guarantee a job or salary. Compare specialisations and verify approvals before enrolling.",
    },
    {
        "slug": "understanding-ugc-deb-naac-approvals", "title": "UGC-DEB, NAAC & AICTE: Understanding Education Approvals",
        "category": "Eligibility", "excerpt": "Decode the accreditations that actually matter when comparing online and distance universities.",
        "cover_url": _COVERS[1], "author": "ETI EduConnect Editorial",
        "direct_answer": "UGC-DEB approval makes an online/distance degree valid; NAAC grade reflects institutional quality; AICTE relates to technical/management programs. Look for all three where applicable before choosing.",
        "key_facts": ["UGC-DEB = permission to offer online/distance degrees", "NAAC A++/A+/A = quality grade of the institution", "AICTE = approval for technical & management programs", "WES recognition helps for global equivalence"],
        "body": "Approvals can be confusing. Here's what each one means and why it matters.\n\n**UGC-DEB:** The University Grants Commission's Distance Education Bureau permits eligible universities to offer online and distance programs. This is the single most important check.\n\n**NAAC:** The National Assessment and Accreditation Council grades institutions (A++ to C). A higher grade signals stronger overall quality.\n\n**AICTE:** Relevant for technical/management programs. \n\n**WES:** Useful if you plan to study or work abroad and need degree equivalence.",
        "who_suits": "Anyone comparing universities for an online or distance degree.",
        "caveats": "Approval lists change. Always confirm the latest status on official UGC-DEB sources for your specific program and year.",
    },
    {
        "slug": "how-to-choose-a-university", "title": "How to Choose the Right University: A 7-Point Checklist",
        "category": "Career/Education Decisions", "excerpt": "A practical framework to compare universities beyond brand names and marketing claims.",
        "cover_url": _COVERS[3], "author": "ETI EduConnect Editorial",
        "direct_answer": "Compare universities on approvals, program fit, fees & EMI, delivery format, exam mode, support and outcomes — not just brand recall. Shortlist 2-4 and compare side by side.",
        "key_facts": ["Verify UGC-DEB + NAAC first", "Match specialisation to your goal", "Check total cost including EMI", "Compare exam mode and support"],
        "body": "1. **Approvals** — UGC-DEB and NAAC first.\n2. **Program fit** — Does the specialisation match your goal?\n3. **Fees & EMI** — Look at total cost, not just per-semester.\n4. **Delivery** — Live classes, recorded content, LMS quality.\n5. **Exam mode** — Remote proctored vs centre-based.\n6. **Support** — Academic help, career services.\n7. **Outcomes** — Alumni signals (avoid guaranteed-placement claims).\n\nShortlist 2-4 universities and use a side-by-side comparison to decide.",
        "who_suits": "Students, graduates and parents comparing multiple universities.",
        "caveats": "Be cautious of 'best university' rankings without a stated methodology. Verify all facts independently.",
    },
    {
        "slug": "online-mca-career-scope", "title": "Online MCA: Career Scope, Specialisations & Salary Reality",
        "category": "Program Explainers", "excerpt": "What an online MCA can realistically do for your tech career, and how to pick a specialisation.",
        "cover_url": _COVERS[2], "author": "ETI EduConnect Editorial",
        "direct_answer": "An online MCA suits graduates and IT professionals wanting deeper software, data or cloud expertise. Career scope is strong when paired with practical skills and the right specialisation.",
        "key_facts": ["Duration: 2 years", "Indicative fees: ₹80,000 – ₹2,00,000", "Hot specialisations: Data Science, Cloud, Cyber Security", "Skills + projects matter as much as the degree"],
        "body": "An online MCA deepens computer-science fundamentals and adds job-relevant specialisations. Its value multiplies when combined with hands-on projects and internships.\n\n**Specialisations:** Data Science, Cloud Computing, Cyber Security, AI, Full-Stack.\n\n**Careers:** Software Engineer, Data Analyst, Cloud/DevOps Engineer, System Architect.\n\n**Reality check:** The degree signals capability; interviews test skills. Build a portfolio alongside your coursework.",
        "who_suits": "BCA/B.Sc(CS) graduates and IT professionals targeting advanced technical roles.",
        "caveats": "Salaries vary widely by skill, city and company. Treat any specific salary figure with caution.",
    },
    {
        "slug": "distance-education-for-working-professionals", "title": "Distance Education for Working Professionals: A Practical Guide",
        "category": "Distance Education", "excerpt": "How to balance a full-time job with a distance degree, and when distance beats online.",
        "cover_url": _COVERS[1], "author": "ETI EduConnect Editorial",
        "direct_answer": "Distance education is ideal for self-driven working professionals who want an affordable, flexible, recognised degree with minimal live-class commitments. Plan your study schedule and verify exam logistics.",
        "key_facts": ["Lowest-cost recognised pathway", "Self-paced, minimal live sessions", "Centre-based exams common", "Great for CA/CS aspirants studying in parallel"],
        "body": "Distance education remains a powerful, budget-friendly route for busy professionals.\n\n**Why choose distance:** Lower fees, maximum flexibility, and recognised degrees from open universities like IGNOU.\n\n**How to succeed:** Block fixed weekly study hours, use the self-learning material actively, and plan around exam-centre schedules.\n\n**When online is better:** If you need structured live classes, mentorship and digital exams, online may suit you more.",
        "who_suits": "Self-motivated working professionals, and students pursuing parallel certifications.",
        "caveats": "Confirm exam-centre locations and dates in advance; these can affect working professionals' planning.",
    },
]


# ---------------------------------------------------------------------------
# LANDING PAGES
# ---------------------------------------------------------------------------
LANDING_PAGES = [
    {"slug": "online-vs-distance", "title": "Online vs Distance Education", "headline": "Online or Distance? Make the Right Call.",
     "subheadline": "Compare delivery, flexibility, interaction and assessment before you decide.",
     "intro": "Both online and distance education can be UGC-recognised and equally valid. The right mode depends on how you learn best and what support you need.",
     "cta_text": "Compare Your Options", "category": None,
     "faqs": [{"q": "Are online and distance degrees equally valid?", "a": "Yes, when UGC-DEB approved, both hold the same value as regular degrees."}], "status": "published"},
    {"slug": "online-mba-comparison", "title": "Online MBA Comparison", "headline": "Compare Top Online MBA Programs",
     "subheadline": "Fees, specialisations, approvals and delivery — side by side.",
     "intro": "Shortlist UGC-entitled, NAAC-accredited universities offering Online MBA and compare what actually matters for your goals.",
     "cta_text": "Get Personalized Options", "category": "MBA",
     "faqs": [{"q": "What is the fee range for an Online MBA?", "a": "Indicatively ₹90,000 to ₹3,50,000 depending on the university and specialisation."}], "status": "published"},
    {"slug": "online-mca-comparison", "title": "Online MCA Comparison", "headline": "Find the Right Online MCA",
     "subheadline": "Compare specialisations like Data Science, Cloud and Cyber Security.",
     "intro": "An online MCA can accelerate your tech career. Compare universities on approvals, specialisations and fees.",
     "cta_text": "Find Suitable Programs", "category": "MCA",
     "faqs": [{"q": "Is an online MCA good for a software career?", "a": "Yes, especially when paired with strong practical skills and the right specialisation."}], "status": "published"},
    {"slug": "online-bca-comparison", "title": "Online BCA Comparison", "headline": "Start Your Tech Journey with Online BCA",
     "subheadline": "Affordable, flexible and recognised UG programs in computing.",
     "intro": "Compare Online BCA programs for 12th-pass students wanting an accessible route into technology.",
     "cta_text": "Explore Options", "category": "BCA",
     "faqs": [{"q": "Is Maths mandatory for Online BCA?", "a": "Most universities accept any 10+2 stream; Maths is preferred but not always required."}], "status": "published"},
    {"slug": "online-universities", "title": "Online Universities in India", "headline": "Explore India's Top Online Universities",
     "subheadline": "UGC-entitled, NAAC-accredited universities offering fully online degrees.",
     "intro": "Discover and compare online universities across MBA, MCA, BCA, BBA, B.Com and more.",
     "cta_text": "Compare Universities", "category": None,
     "faqs": [{"q": "Are online university degrees valid for government jobs?", "a": "UGC-DEB approved online degrees are treated on par with regular degrees, including for most government eligibility."}], "status": "published"},
    {"slug": "education-guidance", "title": "Free Education Guidance", "headline": "Confused? Get Free, Unbiased Guidance.",
     "subheadline": "Tell us your goal — we'll help you compare the right options.",
     "intro": "Our guidance connects you with education advisors who help you shortlist programs and universities suited to your background and goals.",
     "cta_text": "Talk to an Education Advisor", "category": None,
     "faqs": [{"q": "Is the guidance free?", "a": "Yes, discovery and guidance are free. Enrollment is handled by our counselling partner."}], "status": "published"},
]


# ---------------------------------------------------------------------------
# SETTINGS
# ---------------------------------------------------------------------------
SETTINGS = {
    "id": "site_settings",
    "whatsapp_number": "919999999999",
    "whatsapp_message": "Hi ETI EduConnect, I'd like guidance on education options.",
    "contact_email": "connect@etieduconnect.com",
    "contact_phone": "+91 99999 99999",
    "company_name": "ETI Learning Systems Private Limited",
    "partner_name": "Enrollment Counselling Partner",
    "disclosure_text": "ETI EduConnect is an education discovery and comparison platform by ETI Learning Systems Private Limited. We are not the admitting university. Some placements may be sponsored and certain listings may involve commercial/referral relationships. We do not promise admission, placement or salary outcomes. Please verify all time-sensitive information with the official university source.",
}
