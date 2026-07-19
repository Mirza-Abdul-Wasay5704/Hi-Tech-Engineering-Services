"""Seed the database with the company's initial content (from the portfolio PDF,
professionally rewritten). Runs once — skipped when tables already contain data."""

from sqlalchemy.orm import Session

from .models import BlogPost, Project, Service, SiteSettings

SETTINGS = {
    "company_name": "Hi-Tech Engineering Services",
    "tagline": "Electrical & Mechanical Overhauling, Maintenance, Retrofitting & Modernization of Elevators",
    "phones": ["0331-2437499", "021-36361971"],
    "email": "hi.techengineering1971@gmail.com",
    "address": "Office # 06, 3rd Floor, Sohni Center, Karimabad, F.B. Area Block 4, Karachi, Pakistan",
    "city": "Karachi",
    "country": "Pakistan",
    "founded": "1997",
    "hours": "Mon–Sat 9:00–18:00 · 24/7 emergency response for contract clients",
    "stats": [
        {"value": 26, "suffix": "+", "label": "Years of Expertise"},
        {"value": 25, "suffix": "+", "label": "Landmark Buildings Maintained"},
        {"value": 4, "suffix": "", "label": "International Trainings (Korea)"},
        {"value": 24, "suffix": "/7", "label": "Emergency Response"},
    ],
    "hero_title": "Elevator Engineering, Perfected.",
    "hero_subtitle": "26 years of precision maintenance, overhauling and modernization of elevators — trusted by Karachi's most demanding buildings, from five-star hotels to hospitals and the Pakistan Stock Exchange.",
    "map_query": "Sohni Center, Karimabad, F.B. Area Block 4, Karachi",
}

PROJECTS = [
    # name, category, featured, scope
    ("Avari Hotel", "Hotels", True, "Comprehensive elevator maintenance for one of Karachi's premier five-star hotels, covering passenger and service elevators with priority response."),
    ("Pearl Continental Hotel", "Hotels", True, "Ongoing maintenance and electrical troubleshooting of high-traffic guest and service elevators at the Pearl Continental, Karachi."),
    ("Pakistan Stock Exchange", "Financial", True, "Elevator maintenance for the Pakistan Stock Exchange building, where downtime directly impacts thousands of daily users."),
    ("PARCO (Pak-Arab Refinery)", "Industrial", True, "Industrial-grade elevator maintenance and overhauling services for Pak-Arab Refinery Company facilities."),
    ("Tabba Heart Institute", "Hospitals", True, "Mission-critical elevator maintenance for a leading cardiac hospital, including patient-bed elevators where reliability is non-negotiable."),
    ("Liaquat National Hospital", "Hospitals", True, "Maintenance of passenger and patient elevators at one of Pakistan's largest private hospitals."),
    ("Faysal Bank (AHR Branch)", "Financial", False, "Elevator maintenance and modernization support for Faysal Bank branch premises."),
    ("Faysal House, Shahrah-e-Faisal", "Financial", False, "Elevator maintenance for Faysal House corporate headquarters on Shahrah-e-Faisal."),
    ("Bahria Complex I", "Commercial", False, "Elevator maintenance for the Bahria Complex I office tower, Karachi."),
    ("Bahria Complex II", "Commercial", False, "Elevator maintenance for the Bahria Complex II office tower, Karachi."),
    ("Bahria Complex III", "Commercial", False, "Elevator maintenance for the Bahria Complex III office tower, Karachi."),
    ("Bahria Complex IV", "Commercial", False, "Elevator maintenance for the Bahria Complex IV office tower, Karachi."),
    ("Tabba Heart Outreach DHA", "Hospitals", False, "Elevator services for the Tabba Heart Institute outreach center in DHA, Karachi."),
    ("Al-Tijarah Center, Shahrah-e-Faisal", "Commercial", False, "Elevator maintenance for the Al-Tijarah Center commercial tower on Shahrah-e-Faisal."),
    ("Shaheen Complex", "Commercial", False, "Elevator maintenance for the Shaheen Complex commercial building, Karachi."),
    ("Extreme Commerce / Shams Center", "Commercial", False, "Elevator maintenance for Extreme Commerce offices at Shams Center."),
    ("COLABS", "Commercial", False, "Elevator maintenance for COLABS co-working spaces."),
    ("Jaffar Brothers", "Commercial", False, "Elevator maintenance for Jaffar Brothers corporate premises."),
    ("Channel Building", "Commercial", False, "Elevator maintenance for the Channel Building, Karachi."),
    ("Al-Sammad Tower", "Residential", False, "Elevator maintenance for the Al-Sammad Tower residential high-rise."),
    ("MS Tower", "Residential", False, "Elevator maintenance for the MS Tower residential building."),
    ("Star City Mobile Mall, Saddar", "Commercial", False, "High-traffic elevator maintenance for Star City Mobile Mall in Saddar, Karachi."),
    ("Habib Hussain Ghee Wala", "Commercial", False, "Elevator services for Habib Hussain Ghee Wala premises."),
    ("Kanda Wala Building", "Commercial", False, "Elevator maintenance for the Kanda Wala building."),
    ("DHA Phase 8 Residence", "Residential", False, "Private residential elevator maintenance in DHA Phase 8, Karachi."),
]


def _slugify(name: str) -> str:
    import re

    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


SERVICES = [
    {
        "name": "Elevator Maintenance in Karachi",
        "slug": "elevator-maintenance-karachi",
        "icon": "shield",
        "summary": "Monthly maintenance contracts with one of the fastest response times in Karachi — keeping your elevators safe, smooth and always running.",
        "answer_block": "Hi-Tech Engineering Services provides monthly elevator maintenance contracts (AMC) in Karachi, Pakistan, backed by 26+ years of experience and one of the fastest response times in the city. Our contracts cover preventive servicing, breakdown response, safety checks and adjustment of all mechanical and electrical systems for every major elevator brand and motor type.",
        "seo_title": "Elevator Maintenance in Karachi | Monthly AMC Contracts",
        "seo_description": "Elevator & lift maintenance company in Karachi with 26+ years of experience. Monthly maintenance contracts, fastest response time, all brands. Trusted by Avari, PC Hotel, PSX & major hospitals.",
        "scope_items": [
            {"label": "Monthly Preventive Maintenance", "detail": "Scheduled servicing visits covering lubrication, adjustment and inspection of all critical systems."},
            {"label": "Breakdown Response", "detail": "Priority callout with one of the best response times in Karachi — minimum downtime, minimum loss."},
            {"label": "Safety Inspections", "detail": "Brake tests, rope condition checks, door protection and limit switch verification."},
            {"label": "Ride Quality Tuning", "detail": "Guide rail, guide shoe and door adjustments for a smooth, quiet ride."},
            {"label": "All Brands & Types", "detail": "Geared, gearless, AC synchronous and asynchronous machines — local and imported."},
            {"label": "Transparent Reporting", "detail": "Clear service reports and honest recommendations, no unnecessary part replacements."},
        ],
        "faq": [
            {"q": "Who provides elevator maintenance in Karachi?", "a": "Hi-Tech Engineering Services is a Karachi-based elevator maintenance company with over 26 years of experience, maintaining elevators at landmark buildings including Avari Hotel, Pearl Continental, Pakistan Stock Exchange, Tabba Heart Institute and Liaquat National Hospital."},
            {"q": "What does a monthly elevator maintenance contract include?", "a": "A monthly contract (AMC) includes scheduled preventive servicing, priority breakdown response, safety inspections, mechanical and electrical adjustments, and expert advice on parts and modernization — everything needed to keep the elevator safe and reliable."},
            {"q": "How fast is your breakdown response time?", "a": "Our response time is among the best in Karachi. Contract clients are served on priority so downtime — and the loss it causes — stays at an absolute minimum."},
            {"q": "Which elevator brands do you maintain?", "a": "We maintain all major brands and control systems, with particular specialty in Sigma/LG elevators, and full coverage of geared, gearless, AC synchronous and asynchronous machines."},
        ],
        "body": "## Why buildings choose Hi-Tech for maintenance\n\nAn elevator out of service is more than an inconvenience — for a hotel, hospital or office tower it is lost business and reputational damage by the hour. Our maintenance philosophy is built around **prevention first, response second**: catch wear before it becomes failure, and when a breakdown does happen, be there faster than anyone else in Karachi.\n\n### What a contract with us looks like\n\n- A fixed monthly schedule of preventive visits by our supervised fitter and rigger teams\n- Electrical and mechanical incharge oversight on every job\n- Priority emergency callout, with escalation to our engineers\n- Honest reporting — we tell you what needs attention now, what can wait, and what doesn't need replacing at all\n\n### 26 years, zero shortcuts\n\nSince 1997 we have serviced everything from single residential lifts in DHA to banks of high-traffic hotel elevators. Our senior staff trained with elevator manufacturers in Korea (1994, 1997, 2005, 2014), and that discipline shows in our work.",
    },
    {
        "name": "Elevator Modernization & Retrofitting",
        "slug": "elevator-modernization",
        "icon": "cpu",
        "summary": "Give an aging elevator a new life — modern control panels, inverters and displays retrofitted to your existing shaft and machine. Sigma panels are our specialty.",
        "answer_block": "Hi-Tech Engineering Services modernizes and retrofits aging elevators in Karachi and across Pakistan — replacing obsolete relay-logic and SSD PCB control systems with modern panels, inverters and displays while reusing the existing shaft, rails and machine. We are specialists in Sigma/LG control systems, including parameter adjustment, diagnostics and rectification.",
        "seo_title": "Elevator Modernization & Retrofitting in Pakistan | Sigma Panel Specialists",
        "seo_description": "Elevator modernization in Karachi: modern control panels, inverters & displays retrofitted to existing elevators. Sigma/LG panel specialists — diagnostics, parameter adjustment, SSD PCB & relay systems.",
        "scope_items": [
            {"label": "Control Panel Modernization", "detail": "Replace obsolete relay or SSD PCB logic with modern microprocessor control panels."},
            {"label": "Sigma / LG Specialty", "detail": "Deep expertise in Sigma systems: diagnostics, parameter adjustments, repair and replacement."},
            {"label": "Inverter (VVVF) Upgrades", "detail": "Smooth, energy-efficient variable-frequency drives replacing old motor control."},
            {"label": "Displays & Fixtures", "detail": "Modern car and landing displays, call buttons and on-cage electronics."},
            {"label": "Troubleshooting & Diagnostics", "detail": "Systematic fault-finding on any panel type, with rectification — not guesswork."},
            {"label": "Phased Retrofits", "detail": "Modernization planned floor-by-floor or car-by-car to keep the building running."},
        ],
        "faq": [
            {"q": "What is elevator modernization?", "a": "Modernization replaces an elevator's outdated components — typically the control panel, drive, displays and door operators — while keeping the existing shaft, guide rails and often the machine. It restores reliability, safety and ride quality at a fraction of the cost of a new installation."},
            {"q": "Who repairs Sigma or LG elevator panels in Pakistan?", "a": "Hi-Tech Engineering Services in Karachi specializes in Sigma/LG elevator control systems — troubleshooting, parameter adjustment, diagnostics, rectification, and repair or replacement of parts including SSD PCB and relay-type panels."},
            {"q": "When should an elevator be modernized instead of repaired?", "a": "When breakdowns become frequent, spare parts for the old controller become hard to source, or ride quality and leveling degrade, modernization is usually more economical than repeated repairs. We assess honestly and only recommend modernization when it genuinely pays off."},
            {"q": "Can you modernize an elevator without replacing the whole unit?", "a": "Yes — that is exactly what retrofitting is. We reuse the mechanical structure and replace the electrical brain of the elevator: control panel, inverter, wiring and fixtures."},
        ],
        "body": "## Modernization that respects your budget\n\nA full elevator replacement can be needless expense. In most Karachi buildings the shaft, rails and machine still have decades of life left — it's the **control system** that has aged out. Our retrofits target exactly that.\n\n### Our electrical panel expertise\n\n- All types of electrical panels — relay logic, SSD PCB, microprocessor\n- **Sigma is our specialty** — from parameter adjustments to complete panel replacement\n- Diagnostics and rectification, troubleshooting, repair and replacement of parts\n\n### The result\n\nSmoother starts and stops, accurate floor leveling, lower energy consumption, modern safety features, and spare parts that are actually available when you need them.",
    },
    {
        "name": "Mechanical & Electrical Overhauling",
        "slug": "mechanical-electrical-overhauling",
        "icon": "gear",
        "summary": "Complete overhauling of elevator machines and systems — doors, rails, ropes, brakes, motors and panels — restored to factory-grade condition.",
        "answer_block": "Hi-Tech Engineering Services performs complete mechanical and electrical overhauling of elevators in Karachi — covering geared and gearless machines, AC synchronous and asynchronous motors, doors, guide rails, ropes, brakes and control panels. Overhauling restores an elevator to reliable, factory-grade condition without full replacement.",
        "seo_title": "Elevator Mechanical & Electrical Overhauling in Karachi",
        "seo_description": "Complete elevator overhauling in Karachi: geared & gearless machines, AC motors, rope replacement, brake adjustment, door systems and control panels. 26+ years of expertise.",
        "scope_items": [
            {"label": "Door Systems", "detail": "Landing door and car door adjustments for reliable, safe operation."},
            {"label": "Guide Rails & Shoes", "detail": "Rail alignment and cabin/counterweight guide shoe replacement for a smooth ride."},
            {"label": "Ropes & Suspension", "detail": "Rope tension adjustment, thimble rod adjustment and complete rope replacement."},
            {"label": "Brakes", "detail": "Brake adjustment and overhaul — the most safety-critical system in the elevator."},
            {"label": "Motors & Machines", "detail": "AC synchronous, AC asynchronous, geared and gearless machine expertise."},
            {"label": "Electrical Overhaul", "detail": "Panel servicing, wiring renewal, transducers, sensors and safety circuits."},
        ],
        "faq": [
            {"q": "What is elevator overhauling?", "a": "Overhauling is a deep restoration of an elevator's mechanical and electrical systems — doors, rails, ropes, brakes, motor and controller — bringing the equipment back to reliable, near-original condition rather than just patching individual faults."},
            {"q": "Which motor types can you overhaul?", "a": "All of them: AC synchronous and AC asynchronous motors, geared machines and gearless machines, on both local and imported elevators."},
            {"q": "How do I know my elevator needs overhauling?", "a": "Typical signs are rough or noisy rides, inaccurate floor leveling, frequent small breakdowns, worn ropes, and door faults. We inspect and give a straightforward assessment of what needs overhauling and what doesn't."},
        ],
        "body": "## Restore, don't replace\n\nOverhauling is the middle path between endless small repairs and an expensive new installation. Our mechanical and electrical teams strip, inspect, repair and recalibrate every critical system.\n\n### Mechanical scope\n\nLanding and car door adjustments · guide rail alignment · thimble rod and rope tension adjustments · cabin and counterweight guide shoe replacement · complete rope replacement · brake adjustment and overhaul.\n\n### Electrical scope\n\nControl panel servicing and repair · motor and drive systems · transducers and sensors · magnetic reed switches · safety circuit verification.\n\nEvery overhaul is supervised by our mechanical and electrical incharges and signed off by our engineers.",
    },
    {
        "name": "Elevator Spare Parts Supply",
        "slug": "elevator-spare-parts-pakistan",
        "icon": "package",
        "summary": "Genuine local and imported elevator parts — encoders, control cards, inverters, complete panels, sensors and every mechanical accessory — supplied fast.",
        "answer_block": "Hi-Tech Engineering Services supplies elevator spare parts in Karachi and across Pakistan — encoders, control cards, communication cards, inverters, complete control panels, on-cage and display cards, call cards, guide shoes, sensors, transducers, magnetic reed switches, pulleys and all mechanical and electrical accessories, both local and imported.",
        "seo_title": "Elevator Spare Parts in Pakistan | Control Cards, Inverters, Encoders",
        "seo_description": "Elevator spare parts supplier in Karachi, Pakistan: encoders, control cards, inverters, complete panels, display cards, sensors, guide shoes & more. Local and imported parts for all brands.",
        "scope_items": [
            {"label": "Encoders", "detail": "Motor and shaft encoders for accurate speed and position control."},
            {"label": "Control & Communication Cards", "detail": "Main boards, communication cards, on-cage cards, display cards and call cards."},
            {"label": "Inverters & Drives", "detail": "VVVF inverters and complete drive units for all machine types."},
            {"label": "Complete Control Panels", "detail": "Full replacement panels — relay, SSD PCB and microprocessor types."},
            {"label": "Sensors & Switches", "detail": "All transducers and sensors, magnetic reed switches, ATL and safety devices."},
            {"label": "Mechanical Parts", "detail": "Cabin guide shoes, oil cups, counterweight pulley rollers and every mechanical accessory — local or imported."},
        ],
        "faq": [
            {"q": "Where can I buy elevator spare parts in Pakistan?", "a": "Hi-Tech Engineering Services in Karachi supplies elevator spare parts across Pakistan — from encoders, control cards and inverters to complete control panels and mechanical accessories, covering both local and imported elevator brands."},
            {"q": "Do you supply parts for Sigma/LG elevators?", "a": "Yes. Sigma is our specialty — we stock and source control cards, drives, displays and mechanical parts for Sigma/LG systems, along with parts for all other major brands."},
            {"q": "Can you install the parts you supply?", "a": "Yes. We are a full-service elevator engineering company: our teams supply, install, configure and test every part we sell, including parameter adjustments after installation."},
        ],
        "body": "## The part you need, without the wait\n\nA missing spare part is the most common reason an elevator stays down for weeks. We keep the critical items moving — sourced locally when quality allows, imported when it matters.\n\n### Commonly supplied parts\n\nEncoders · control cards · communication cards · inverters · complete control panels · on-cage cards · display cards · call cards · cabin guide shoes · oil cups · ATL · magnetic reed switches · all transducers and sensors · counterweight pulley rollers — and virtually any other mechanical or electrical accessory, local or imported.\n\n### Supply + installation\n\nUnlike parts traders, we are engineers. Every part we supply can be professionally installed, configured and tested by our own teams.",
    },
]

BLOG_POSTS = [
    {
        "title": "7 Signs Your Elevator Needs Modernization, Not Just Another Repair",
        "slug": "signs-your-elevator-needs-modernization",
        "excerpt": "Frequent breakdowns, rough rides and unavailable spare parts are not bad luck — they are your elevator telling you its control system has aged out. Here is how building managers in Pakistan can tell repair from replace.",
        "tags": "modernization, maintenance, building management",
        "seo_title": "7 Signs Your Elevator Needs Modernization | Hi-Tech Engineering Karachi",
        "seo_description": "How building managers in Pakistan can tell when an elevator needs modernization instead of repeated repairs: breakdown frequency, parts availability, ride quality, leveling and more.",
        "published": True,
        "body": """Every elevator reaches a point where repairs stop making economic sense. After 26 years of maintaining elevators across Karachi — from five-star hotels to hospitals — here are the seven signs we tell building managers to watch for.

## 1. Breakdowns are getting more frequent

One breakdown is an event. A breakdown every month is a pattern. Aging relay-logic and early PCB control systems fail in cascading ways: fixing one fault stresses the next weakest component.

## 2. Spare parts take weeks to source

If your technician keeps saying "this card is no longer manufactured," the clock is ticking. Obsolete parts eventually become impossible to find at any price.

## 3. Floor leveling is inaccurate

A cabin stopping a few centimeters above or below the floor is a genuine trip hazard — and usually a sign the drive and control system can no longer regulate speed precisely.

## 4. The ride is rough or noisy

Hard starts, jerky stops and vibration usually trace back to an old motor drive. A modern VVVF inverter transforms ride quality on the same machine.

## 5. Energy bills are climbing

Old motor-generator sets and resistance-based controls waste enormous amounts of power. Modern drives routinely cut elevator energy consumption by 30–40%.

## 6. Doors misbehave

Doors that reopen randomly, close too hard, or need constant adjustment often indicate an aging door operator and controller that modernization would replace outright.

## 7. Your maintenance costs keep rising

Add up twelve months of repair invoices. If the total approaches a meaningful fraction of a modernization cost, you are paying for modernization anyway — without getting it.

## The good news: you rarely need a new elevator

In most buildings the shaft, guide rails and machine have decades of life left. Modernization replaces the electrical brain — control panel, inverter, displays, wiring — at a fraction of the cost of a new installation, usually with the elevator out of service for days, not months.

**Hi-Tech Engineering Services** has modernized and maintained elevators in Karachi since 1997, with particular specialty in Sigma/LG control systems. If you are weighing repair against modernization, [contact us](/contact) for an honest assessment — we regularly advise clients *against* modernization when repairs genuinely suffice.""",
    },
]


# Curated client logos + building photos shipped in backend/seed_assets/.
# On first run they are uploaded to storage (Supabase in prod, ./uploads in dev)
# and attached to their projects — so a fresh deploy reproduces all media.
LOGO_FILES = {
    "avari-hotel": "avari-hotel.png",
    "pearl-continental-hotel": "pearl-continental-hotel.png",
    "pakistan-stock-exchange": "pakistan-stock-exchange.png",
    "parco-pak-arab-refinery": "parco-pak-arab-refinery.png",
    "tabba-heart-institute": "tabba-heart-institute.svg",
    "liaquat-national-hospital": "liaquat-national-hospital.png",
    "faysal-bank-ahr-branch": "faysal-bank-ahr-branch.png",
    "faysal-house-shahrah-e-faisal": "faysal-house-shahrah-e-faisal.png",
    "tabba-heart-outreach-dha": "tabba-heart-outreach-dha.svg",
    "extreme-commerce-shams-center": "extreme-commerce-shams-center.webp",
    "jaffar-brothers": "jaffar-brothers.png",
    "star-city-mobile-mall-saddar": "star-city-mobile-mall-saddar.webp",
}
PHOTO_FILES = {
    "avari-hotel": "avari-hotel.webp",
    "pearl-continental-hotel": "pearl-continental-hotel.webp",
    "faysal-bank-ahr-branch": "faysal-bank-ahr-branch.webp",
    "faysal-house-shahrah-e-faisal": "faysal-house-shahrah-e-faisal.webp",
    "shaheen-complex": "shaheen-complex.webp",
    "extreme-commerce-shams-center": "extreme-commerce-shams-center.webp",
    "colabs": "colabs.webp",
    "jaffar-brothers": "jaffar-brothers.webp",
    "ms-tower": "ms-tower.webp",
    "star-city-mobile-mall-saddar": "star-city-mobile-mall-saddar.webp",
    "dha-phase-8-residence": "dha-phase-8-residence.webp",
}


def seed_media(db: Session) -> None:
    """Attach curated logos/photos to projects that don't have them yet."""
    from pathlib import Path

    from .core.storage import store_image

    root = Path(__file__).resolve().parents[1] / "seed_assets"
    for slug, fname in LOGO_FILES.items():
        p = db.query(Project).filter(Project.slug == slug).first()
        src = root / "logos" / fname
        if p and not p.logo_url and src.exists():
            p.logo_url = store_image(src.read_bytes(), fname, kind="logo")
    for slug, fname in PHOTO_FILES.items():
        p = db.query(Project).filter(Project.slug == slug).first()
        src = root / "photos" / fname
        if p and not p.image_url and src.exists():
            p.image_url = store_image(src.read_bytes(), fname, kind="photo")
    db.commit()


def seed_if_empty(db: Session) -> None:
    if not db.query(SiteSettings).first():
        db.add(SiteSettings(id=1, data=SETTINGS))

    if not db.query(Project).first():
        for i, (name, category, featured, scope) in enumerate(PROJECTS):
            db.add(
                Project(
                    name=name,
                    slug=_slugify(name),
                    category=category,
                    client_name=name,
                    featured=featured,
                    sort_order=i,
                    scope_of_work=scope,
                    description=scope,
                    elevator_types="Passenger",
                    published=True,
                )
            )

    if not db.query(Service).first():
        for i, svc in enumerate(SERVICES):
            db.add(Service(sort_order=i, **svc))

    if not db.query(BlogPost).first():
        for post in BLOG_POSTS:
            db.add(BlogPost(**post))

    db.commit()
    seed_media(db)
