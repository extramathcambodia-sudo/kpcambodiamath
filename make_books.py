# -*- coding: utf-8 -*-
"""
KPCambodianmathematics — PDF book shop (books.html)

For every book in BOOKS this script writes into static/books/:
  <id>.bin          the whole PDF, encrypted with AES-256-GCM (only a download code can open it)
  <id>-sample.pdf   the first pages, free to read
  <id>-cover.jpg    the cover picture
  books.js          the list of books shown on books.html (no keys in it)

The secret keys stay in books_private/keys.json — NEVER upload the books_private folder.
In admin.html → «លក់សៀវភៅ» import books_private/keys.json once, then make a download code for each buyer.

Add a book: put the PDF into books_private/, add an entry to BOOKS, run:  python make_books.py
Needs:  pip install cryptography pypdf   (and pymupdf for the cover, or poppler's pdftoppm)
"""
import base64
import json
import os
import secrets
import shutil
import subprocess
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
PRIV = os.path.join(BASE, "books_private")
OUT = os.path.join(BASE, "static", "books")

BOOKS = [
    {
        "id": "complex12",
        "code": "KP012",
        "title": "ចំនួនកុំផ្លិច ថ្នាក់ទី ១២",
        "title_en": "Complex Numbers — Grade 12",
        "grade": 12,
        "src": "Book_Complex_Number_Grade_12.pdf",
        "sample_pages": 12,
        "price_khr": 20000,          # ← តម្លៃ (រៀល)
        "price_usd": 5,              # ← តម្លៃ (ដុល្លារ)
        "year": "២០២៦",
        "desc": "ទ្រឹស្តីសង្ខេប វិធីសាស្ត្រគណនា លំហាត់គំរូមានដំណោះស្រាយលម្អិត និងវិញ្ញាសាពហុជ្រើសរើស (MCQ) សម្រាប់ត្រៀមប្រឡងសញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ (បាក់ឌុប) និងប្រឡងសិស្សពូកែ ។",
        "points": ["ទ្រឹស្តីសង្ខេប និងរូបមន្តសំខាន់ៗ", "វិធីសាស្ត្រគណនា និងឧទាហរណ៍មានដំណោះស្រាយ",
                   "វិញ្ញាសាពហុជ្រើសរើស (MCQ) មានចម្លើយ", "ត្រៀមប្រឡងបាក់ឌុប និងសិស្សពូកែ"],
    },
]


def need(mod, pipname):
    try:
        return __import__(mod)
    except ImportError:
        sys.exit(f"Missing Python package: pip install {pipname}")


def cover(src, dst):
    try:
        import fitz  # pymupdf
        pix = fitz.open(src)[0].get_pixmap(dpi=110)
        pix.save(dst)
        return True
    except ImportError:
        pass
    if shutil.which("pdftoppm"):
        stem = dst[:-4]
        subprocess.run(["pdftoppm", "-r", "110", "-jpeg", "-jpegopt", "quality=85", "-f", "1", "-l", "1", "-singlefile", src, stem], check=True)
        return True
    return False


def main():
    need("cryptography", "cryptography")
    need("pypdf", "pypdf")
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    from pypdf import PdfReader, PdfWriter

    os.makedirs(OUT, exist_ok=True)
    os.makedirs(PRIV, exist_ok=True)
    kpath = os.path.join(PRIV, "keys.json")
    keys = json.load(open(kpath, encoding="utf-8")) if os.path.exists(kpath) else {}
    pub = []
    for b in BOOKS:
        src = os.path.join(PRIV, b["src"])
        if not os.path.exists(src):
            print("  missing:", src)
            continue
        if b["id"] not in keys:  # keep old keys so codes already sold keep working
            keys[b["id"]] = base64.b64encode(secrets.token_bytes(32)).decode()
        key = base64.b64decode(keys[b["id"]])
        data = open(src, "rb").read()
        iv = secrets.token_bytes(12)
        open(os.path.join(OUT, b["id"] + ".bin"), "wb").write(iv + AESGCM(key).encrypt(iv, data, b["id"].encode()))
        rd = PdfReader(src)
        wr = PdfWriter()
        for p in rd.pages[: b["sample_pages"]]:
            wr.add_page(p)
        with open(os.path.join(OUT, b["id"] + "-sample.pdf"), "wb") as fh:
            wr.write(fh)
        cdst = os.path.join(OUT, b["id"] + "-cover.jpg")
        if not cover(src, cdst) and not os.path.exists(cdst):
            print("  no cover (pip install pymupdf)")
        info = {k: v for k, v in b.items() if k != "src"}
        info.update(pages=len(rd.pages), size=len(data), file=os.path.splitext(b["src"])[0])
        pub.append(info)
        print(f"  {b['id']}: {len(rd.pages)} pages, {len(data) / 1048576:.1f} MB encrypted")
    with open(kpath, "w", encoding="utf-8") as fh:
        json.dump(keys, fh, indent=1)
    with open(os.path.join(OUT, "books.js"), "w", encoding="utf-8") as fh:
        fh.write("window.KP_BOOKS = " + json.dumps(pub, ensure_ascii=False, indent=1) + ";\n")
    print("keys:", kpath, "(keep private; import it in admin.html → លក់សៀវភៅ)")


if __name__ == "__main__":
    main()
