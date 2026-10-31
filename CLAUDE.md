# CLAUDE.md — Project Instructions for Claude Code
> See full details in `AGENTS.md`.

## Collaboration with Antigravity
You are collaborating with **Antigravity** on this project.
* Working Directory: `D:\KP Cambodiamathmatic`
* GitHub Repo: `https://github.com/extramathcambodia-sudo/kpcambodiamath.git` (`main`)
* Production URL: `https://kpcmath.pages.dev/` (Cloudflare Pages, project `kpcmath`). The old `kpcmath.netlify.app` is frozen: its free credits ran out from pushing too often.
* Author: លោកគ្រូ ខែម ពុទ្ធី (វិទ្យាល័យព្រះស៊ីសុវត្ថិ សាលារៀនជំនាន់ថ្មី NGS)

## Essential Workflow Rules
1. **Cache Busting:** Before publishing changes to `static/js/slides.js` or `static/js/slides_templates.js`, always bump `?v=N` in `studio.html` (e.g., from `?v=14` to `?v=15`).
2. **Build Distribution:** Run `python build_dist.py` to regenerate `dist/` before deployment.
3. **Commit:** Commit changes with clear descriptive messages so Antigravity and the user can see what was done. Pushing to `main` does NOT deploy.
4. **Deploy (only when the user asks, batched — not after every commit):** `python build_dist.py` then `wrangler pages deploy --branch main` from the project root. This uploads `dist/` plus `functions/` (AI assistant at `/api/ai`, secrets `ANTHROPIC_API_KEY` and `AI_ACCESS_CODE` live on the Cloudflare project).

