# -*- coding: utf-8 -*-
"""
KPCambodianmathematics — deployment package

Copies the finished website into dist/ (and dist.zip) for Netlify, Vercel, Cloudflare Pages or GitHub Pages.
Run build_site_from_template.py first, then:  python build_dist.py
Netlify Drop: drag the dist folder (or dist.zip) onto https://app.netlify.com/drop
"""
import glob
import os
import shutil
import zipfile

BASE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(BASE, "dist")

# pages built by build_site_from_template.py / build_teacher.py / build_khmermath_portal.py
PAGES = ["index.html", "KPCambodianmathematics.html", "practice.html", "teachers.html", "about.html", "books.html", "privacy.html",
         "sitemap.html", "404.html", "exam.html", "monthly.html", "exam-builder.html", "classroom.html", "student.html",
         "studio.html", "geometry-angle-bisector.html"]
FILES = ["math_data.js", "sitemap.xml", "robots.txt", "manifest.webmanifest", "FIREBASE_SETUP.md"]
DIRS = ["static", "lesson", "exams9"]
SKIP = (".json",)          # static/bank/*.json were replaced by the .js banks

HEADERS = """/static/*
  Cache-Control: public, max-age=604800
/math_data.js
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
"""
NETLIFY = """# publish this folder as it is (no build step on Netlify)
[build]
  publish = "."

[[redirects]]
  from = "/KPCambodianmathematics"
  to = "/index.html"
  status = 301
"""
VERCEL = """{
  "cleanUrls": false,
  "headers": [
    { "source": "/static/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=604800" }] }
  ]
}
"""


def build():
    if os.path.isdir(DIST):
        shutil.rmtree(DIST)
    os.makedirs(DIST)
    n = 0
    for f in PAGES + FILES + glob.glob(os.path.join(BASE, "grade-*.html")):
        src = f if os.path.isabs(f) else os.path.join(BASE, f)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(DIST, os.path.basename(src)))
            n += 1
        else:
            print("  missing:", os.path.basename(src))
    for d in DIRS:
        src = os.path.join(BASE, d)
        if not os.path.isdir(src):
            continue
        for root, _, files in os.walk(src):
            for f in files:
                if d == "static" and root.endswith("bank") and f.endswith(SKIP):
                    continue
                if d == "lesson" and os.path.basename(root) == "fig":   # lesson figures are embedded in the pages
                    continue
                s = os.path.join(root, f)
                t = os.path.join(DIST, os.path.relpath(s, BASE))
                os.makedirs(os.path.dirname(t), exist_ok=True)
                shutil.copy2(s, t)
                n += 1
    for name, text in (("_headers", HEADERS), ("netlify.toml", NETLIFY), ("vercel.json", VERCEL), (".nojekyll", "")):
        with open(os.path.join(DIST, name), "w", encoding="utf-8", newline="\n") as fh:
            fh.write(text)
    size = sum(os.path.getsize(os.path.join(r, f)) for r, _, fs in os.walk(DIST) for f in fs)
    zp = os.path.join(BASE, "dist.zip")
    with zipfile.ZipFile(zp, "w", zipfile.ZIP_DEFLATED) as z:
        for r, _, fs in os.walk(DIST):
            for f in fs:
                p = os.path.join(r, f)
                z.write(p, os.path.relpath(p, DIST))
    print(f"dist/: {n} files, {size / 1048576:.1f} MB  ->  dist.zip {os.path.getsize(zp) / 1048576:.1f} MB")


if __name__ == "__main__":
    build()
