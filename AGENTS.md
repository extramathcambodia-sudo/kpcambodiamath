# KPCambodianmathematics — AI Agent Collaboration Guide
> **Shared workspace guideline for Antigravity (Google DeepMind) & Claude (Anthropic)**
> **Author & Educator:** លោកគ្រូ ខែម ពុទ្ធី (Preah Sisowath High School - New Generation School NGS)  
> **Live Site:** [https://kpcmath.netlify.app/](https://kpcmath.netlify.app/)  
> **Repository:** `https://github.com/extramathcambodia-sudo/kpcambodiamath.git` (`main`)

---

## 🤝 Dual-Agent Collaboration Protocol (Claude + Antigravity)

Both **Claude** and **Antigravity** collaborate on this single codebase:
1. **Source of Truth:** All work takes place directly in `D:\KP Cambodiamathmatic`.
2. **Git Commit History:** Check `git log -n 5 --oneline` and `git status` at the start of any turn to see recent changes made by either agent.
3. **No Overwrites:** Respect edits made by the other assistant; merge and preserve improvements.
4. **Transparent Handoff:** Whenever major work is completed, document changes in Git commit messages so the other agent can immediately pick up where you left off.

---

## ⚡ Deployment & Build Pipeline (Netlify)

1. **Static Cache-Busting Rule (CRITICAL):**
   * Netlify caches `static/*` assets for 7 days (`Cache-Control: max-age=604800`).
   * Whenever editing `static/js/slides.js`, `static/js/slides_templates.js`, or `static/css/slides.css`, **MUST bump the query parameter `?v=N`** in `studio.html` (e.g., `?v=14` -> `?v=15`).
2. **Build Command:**
   ```bash
   python build_dist.py
   ```
   This generates `dist/` and `dist.zip`.
3. **Deploy to Netlify:**
   * Netlify is configured to deploy automatically on `git push origin main`.
   * Alternatively, drag the freshly generated `dist/` folder onto [Netlify Drop](https://app.netlify.com/drop).

---

## 📚 Project Architecture & Key Files

* **`studio.html`:** The main interactive studio containing the slide presentation engine, equation editors, and lesson tools.
* **`static/js/slides.js`:** Presentation renderer and editor engine (PowerPoint-style slides).
* **`static/js/slides_templates.js`:** Pre-built curriculum slide decks for Grade 11 (Sequences, Arithmetic Progression, Geometric Progression, Sum of Sequences, Recurrence Relations).
* **`KPCambodianmathematics.html`:** Main platform portal and entry point.
* **`build_dist.py`:** Packages the deployment bundle into `dist/`.
* **`netlify.toml`:** Netlify hosting and cache configuration.

