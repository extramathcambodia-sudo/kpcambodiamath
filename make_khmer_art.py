# -*- coding: utf-8 -*-
"""
Khmer decorative artwork for the site (original drawings, one colour each so CSS can tint them with mask-image):
  static/img/khmer/kbach-band.svg   repeating kbach (flame-leaf) border, used under the header and above the footer
  static/img/khmer/skyline.svg      Phnom Bakheng · sugar palms · Angkor Wat · Banteay Srei · lotus pond (footer)
  static/img/khmer/angkor.svg       Angkor Wat five-tower silhouette with palms (home hero background)
  static/img/khmer/lotus.svg        lotus flower ornament (section heads, 404)
  static/img/khmer/kbach-corner.svg corner kbach scroll (inner page heroes)
Run: python make_khmer_art.py
"""
import math
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", "img", "khmer")


def f(x):
    return f"{x:.1f}".rstrip("0").rstrip(".")


def svg(w, h, body, extra=""):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}"{extra}>{body}</svg>\n'


# ------------------------------------------------------------------ building blocks
def prang(cx, base_y, w, h, tiers=7):
    """Khmer tower (prang): a stepped body that swells then tapers into a lotus-bud finial"""
    pts_l, pts_r = [], []
    body_h = h * 0.82
    y = base_y
    step = body_h / tiers
    for i in range(tiers):
        t = i / tiers
        # bulging profile: widest a little above the base, like Angkor's corn-cob towers
        half = w / 2 * (1.0 - 0.72 * t ** 1.35) * (1 + 0.10 * math.sin(math.pi * min(1, t * 1.6)))
        inset = half * 0.88
        y_top = y - step
        pts_l += [(cx - half, y), (cx - half, y - step * 0.62), (cx - inset, y - step * 0.62), (cx - inset, y_top)]
        pts_r += [(cx + half, y), (cx + half, y - step * 0.62), (cx + inset, y - step * 0.62), (cx + inset, y_top)]
        y = y_top
    top_half = w / 2 * 0.2
    tip = base_y - h
    path = [(cx - w / 2 * 1.08, base_y)] + pts_l + [(cx - top_half * 0.7, y), (cx, tip)]
    path += [(cx + top_half * 0.7, y)] + pts_r[::-1] + [(cx + w / 2 * 1.08, base_y)]
    return "M" + " L".join(f"{f(x)} {f(y)}" for x, y in path) + " Z"


def gallery(x0, x1, y_base, h, roof=True):
    """long gallery with a tiered roof line"""
    d = f"M{f(x0)} {f(y_base)} L{f(x0)} {f(y_base - h * .55)} L{f(x0 + h * .3)} {f(y_base - h * .55)} "
    if roof:
        d += f"L{f(x0 + h * .6)} {f(y_base - h)} L{f(x1 - h * .6)} {f(y_base - h)} "
    d += f"L{f(x1 - h * .3)} {f(y_base - h * .55)} L{f(x1)} {f(y_base - h * .55)} L{f(x1)} {f(y_base)} Z"
    return d


def palm(x, y_base, h, lean=0.0, n=15):
    """sugar palm (ត្នោត): tall slim trunk and a round crown of fan leaves"""
    top_x, top_y = x + lean * h, y_base - h
    tw = max(2.2, h * 0.022)
    d = (f"M{f(x - tw)} {f(y_base)} Q{f(x + lean * h * .5 - tw)} {f(y_base - h * .5)} {f(top_x - tw * .7)} {f(top_y)} "
         f"L{f(top_x + tw * .7)} {f(top_y)} Q{f(x + lean * h * .5 + tw)} {f(y_base - h * .5)} {f(x + tw)} {f(y_base)} Z ")
    r = h * 0.2
    cy = top_y - r * 0.15
    pts = []
    for i in range(n * 2):
        a = math.pi * (i / n) - math.pi / 2
        rr = r if i % 2 == 0 else r * 0.42
        # fronds hang lower on the sides, like a real sugar palm crown
        ry = rr * (0.78 if math.sin(a) < 0 else 0.95)
        pts.append((top_x + math.cos(a) * rr, cy + math.sin(a) * ry))
    d += "M" + " L".join(f"{f(px)} {f(py)}" for px, py in pts) + " Z"
    return d


def lotus(cx, cy, s):
    """lotus flower: five petals and a bud centre"""
    d = ""
    for ang, sc in ((-62, .78), (62, .78), (-30, .95), (30, .95), (0, 1.05)):
        a = math.radians(ang)
        L = s * sc
        tx, ty = cx + math.sin(a) * L, cy - math.cos(a) * L
        # petal as a pointed almond between base and tip
        nx, ny = math.cos(a) * L * .32, math.sin(a) * L * .32
        mx, my = (cx + tx) / 2, (cy + ty) / 2
        d += (f"M{f(cx)} {f(cy)} Q{f(mx - nx)} {f(my - ny)} {f(tx)} {f(ty)} Q{f(mx + nx)} {f(my + ny)} {f(cx)} {f(cy)} Z ")
    return d


def lotus_leaf(cx, cy, rx, ry):
    return (f"M{f(cx - rx)} {f(cy)} A{f(rx)} {f(ry)} 0 1 0 {f(cx + rx)} {f(cy)} L{f(cx + rx * .15)} {f(cy)} "
            f"L{f(cx)} {f(cy - ry * .3)} L{f(cx - rx * .15)} {f(cy)} Z ")


# ------------------------------------------------------------------ artworks
def kbach_band():
    """one tile, 40 x 16: a flame-leaf (ក្បាច់ភ្ញី) with its inner flame, a lotus bud between the leaves,
    standing on a double line — the edge of a temple lintel"""
    w, h = 40, 16
    leaf = ("M20 0.5 C22.2 3.6 26 5.6 26 9.4 C26 11.6 24.2 12.8 20 12.8 C15.8 12.8 14 11.6 14 9.4 C14 5.6 17.8 3.6 20 0.5 Z "
            "M20 4.2 C21.2 6 23 7.4 23 9.6 C23 10.8 21.8 11.4 20 11.4 C18.2 11.4 17 10.8 17 9.6 C17 7.4 18.8 6 20 4.2 Z "
            "M20 6.6 C20.8 7.8 21.6 8.6 21.6 9.8 C21.6 10.5 20.9 10.8 20 10.8 C19.1 10.8 18.4 10.5 18.4 9.8 C18.4 8.6 19.2 7.8 20 6.6 Z")
    bud = ("M0 12.8 C-2.6 12.8 -3.4 10.6 -2.2 8.8 C-1.4 7.6 -0.6 7 0 5.6 C0.6 7 1.4 7.6 2.2 8.8 C3.4 10.6 2.6 12.8 0 12.8 Z "
           "M40 12.8 C37.4 12.8 36.6 10.6 37.8 8.8 C38.6 7.6 39.4 7 40 5.6 C40.6 7 41.4 7.6 42.2 8.8 C43.4 10.6 42.6 12.8 40 12.8 Z")
    body = (f'<path d="{leaf}" fill-rule="evenodd"/><path d="{bud}"/>'
            '<rect x="0" y="13.4" width="40" height="1"/><rect x="0" y="15" width="40" height="1"/>')
    return svg(w, h, body)


def angkor_group(cx, base, scale):
    """Angkor Wat seen from the west: galleries + five towers (centre tallest)"""
    s = scale
    d = gallery(cx - 330 * s, cx + 330 * s, base, 30 * s)
    d += gallery(cx - 230 * s, cx + 230 * s, base - 22 * s, 30 * s)
    d += gallery(cx - 130 * s, cx + 130 * s, base - 44 * s, 26 * s)
    d += prang(cx - 190 * s, base - 22 * s, 46 * s, 120 * s)
    d += prang(cx + 190 * s, base - 22 * s, 46 * s, 120 * s)
    d += prang(cx - 105 * s, base - 50 * s, 50 * s, 125 * s)
    d += prang(cx + 105 * s, base - 50 * s, 50 * s, 125 * s)
    d += prang(cx, base - 64 * s, 64 * s, 190 * s, tiers=8)
    return d


def bakheng(cx, base, s):
    """Phnom Bakheng: the hill and the stepped temple-mountain on its top"""
    d = (f"M{f(cx - 230 * s)} {f(base)} C{f(cx - 150 * s)} {f(base - 20 * s)} {f(cx - 110 * s)} {f(base - 92 * s)} "
         f"{f(cx - 60 * s)} {f(base - 98 * s)} L{f(cx + 60 * s)} {f(base - 98 * s)} C{f(cx + 110 * s)} {f(base - 92 * s)} "
         f"{f(cx + 150 * s)} {f(base - 20 * s)} {f(cx + 230 * s)} {f(base)} Z ")
    y = base - 98 * s
    for i, wdt in enumerate((120, 100, 82, 66, 52)):
        d += f"M{f(cx - wdt * s / 2)} {f(y)} L{f(cx - wdt * s / 2)} {f(y - 10 * s)} L{f(cx + wdt * s / 2)} {f(y - 10 * s)} L{f(cx + wdt * s / 2)} {f(y)} Z "
        y -= 10 * s
    d += prang(cx, y, 26 * s, 56 * s, tiers=5)
    for dx in (-18, 18):
        d += prang(cx + dx * s, y, 12 * s, 30 * s, tiers=4)
    return d


def banteay_srei(cx, base, s):
    """Banteay Srei: low enclosure, small gopura and three slim towers on one terrace"""
    d = gallery(cx - 120 * s, cx + 120 * s, base, 16 * s, roof=False)
    d += f"M{f(cx - 80 * s)} {f(base - 16 * s)} L{f(cx - 80 * s)} {f(base - 26 * s)} L{f(cx + 80 * s)} {f(base - 26 * s)} L{f(cx + 80 * s)} {f(base - 16 * s)} Z "
    d += prang(cx, base - 26 * s, 28 * s, 92 * s, tiers=6)
    d += prang(cx - 42 * s, base - 26 * s, 22 * s, 70 * s, tiers=5)
    d += prang(cx + 42 * s, base - 26 * s, 22 * s, 70 * s, tiers=5)
    # pediment of the entrance pavilion (a pointed gable, the temple's signature)
    for gx in (cx - 98 * s, cx + 98 * s):
        d += f"M{f(gx - 14 * s)} {f(base - 16 * s)} L{f(gx - 14 * s)} {f(base - 24 * s)} Q{f(gx - 6 * s)} {f(base - 34 * s)} {f(gx)} {f(base - 52 * s)} Q{f(gx + 6 * s)} {f(base - 34 * s)} {f(gx + 14 * s)} {f(base - 24 * s)} L{f(gx + 14 * s)} {f(base - 16 * s)} Z "
    return d


def skyline():
    W, H = 1600, 260
    base = 236
    d = ""
    d += bakheng(230, base, 1.0)
    d += angkor_group(800, base, 1.02)
    d += banteay_srei(1370, base, 1.45)
    for x, h, lean in ((70, 150, .04), (118, 118, -.06), (470, 170, .05), (520, 132, -.03), (560, 104, .07),
                       (1080, 160, -.04), (1130, 126, .05), (1560, 150, -.05), (1590, 112, .04)):
        d += palm(x, base, h, lean)
    d += f"M0 {base} L{W} {base} L{W} {H} L0 {H} Z "
    # lotus pond in front of Angkor Wat
    pond = ""
    for x, s in ((660, 15), (700, 11), (900, 14), (940, 10)):
        pond += lotus(x, base + 12, s)
    for x, rx in ((640, 22), (720, 18), (880, 20), (960, 17)):
        pond += lotus_leaf(x, base + 16, rx, 6)
    body = f'<path d="{d}"/><path d="{pond}" fill="#fff" fill-opacity="0"/>'
    return svg(W, H, f'<path d="{d}"/>'), svg(W, 40, f'<path d="{pond}" transform="translate(0 {-(base - 10)})"/>')


def angkor_hero():
    W, H = 900, 300
    base = 290
    d = angkor_group(450, base, 1.18)
    for x, h, lean in ((40, 200, .05), (100, 150, -.05), (820, 190, -.04), (870, 140, .05)):
        d += palm(x, base, h, lean)
    d += f"M0 {base} L{W} {base} L{W} {H} L0 {H} Z"
    return svg(W, H, f'<path d="{d}"/>')


def lotus_icon():
    d = lotus(32, 40, 30) + lotus_leaf(32, 44, 26, 6)
    return svg(64, 52, f'<path d="{d}"/>')


def kbach_corner():
    """a corner scroll: a curling stem with flame leaves, drawn as strokes"""
    stem = "M4 116 C4 60 30 28 78 18 C100 14 116 18 116 30 C116 40 104 44 98 36"
    leaves = ""
    for t, (x, y, a) in enumerate(((14, 84, -20), (28, 54, -35), (50, 32, -55), (78, 20, -80))):
        leaves += (f'<path transform="translate({x} {y}) rotate({a})" '
                   'd="M0 0 C6 -4 10 -10 9 -18 C8 -24 3 -26 0 -32 C-3 -26 -8 -24 -9 -18 C-10 -10 -6 -4 0 0 Z"/>')
    curl = "M18 116 C18 98 26 88 38 86 C46 85 50 92 44 96"
    body = (f'<path d="{stem}" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round"/>'
            f'<path d="{curl}" fill="none" stroke="#000" stroke-width="2.4" stroke-linecap="round"/>{leaves}'
            '<circle cx="98" cy="36" r="3"/>')
    return svg(120, 120, body)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    sky, pond = skyline()
    files = {"kbach-band.svg": kbach_band(), "skyline.svg": sky, "lotus-pond.svg": pond,
             "angkor.svg": angkor_hero(), "lotus.svg": lotus_icon(), "kbach-corner.svg": kbach_corner()}
    for n, t in files.items():
        with open(os.path.join(OUT, n), "w", encoding="utf-8", newline="\n") as fh:
            fh.write(t)
        print(n, len(t))
    # the same drawings as CSS variables (data: URIs), so CSS masks also work when pages are opened from disk (file://)
    from urllib.parse import quote
    names = {"kbach-band.svg": "band", "skyline.svg": "skyline", "angkor.svg": "angkor", "lotus.svg": "lotus", "kbach-corner.svg": "corner"}
    css = "/* generated by make_khmer_art.py */\n:root {\n" + "".join(
        f'  --k-{v}: url("data:image/svg+xml,{quote(files[k], safe=" /:=,()-.!*_")}");\n' for k, v in names.items()) + "}\n"
    with open(os.path.join(os.path.dirname(OUT), "..", "css", "khmer-art.css"), "w", encoding="utf-8", newline="\n") as fh:
        fh.write(css)
    print("khmer-art.css", len(css))
