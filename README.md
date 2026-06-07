# bonslee-site

Personal portfolio for **Bonslee S Chakkala** — Senior Multimedia Designer, Art Director, UI/UX & Product Designer.
Cockpit / HUD interface. Brand colours: lime `#D3FF01` on black.

## Stack
- Static HTML / CSS / vanilla JS (no build step).
- All content lives in `content.json` and is rendered at runtime.
- **Decap CMS** at `/admin/` (git-backed) to edit text, fonts, font sizes, and add images/videos.

## Run locally
```bash
cd bonslee-site
python3 -m http.server 8080   # then open http://localhost:8080
```
Serve over http (not file://) so `content.json` loads.

To test the CMS locally: `npx decap-server` in another terminal, then open `http://localhost:8080/admin/`.

## Deploy
1. Push this folder's **contents** to a public GitHub repo `bonslee-site` (repo root = these files; keep `admin/`).
2. In `admin/config.yml` set `repo: YOUR_GITHUB_USERNAME/bonslee-site`.
3. Netlify → New site from Git → pick the repo. **Build command:** empty. **Publish directory:** `.` (root).
4. Netlify → Site → Identity → enable; Services → Git Gateway → enable. Invite yourself as a user to log into `/admin/`.
5. Point `bonslee.com` DNS in GoDaddy at Netlify and turn off GoDaddy forwarding.

## Content
- Edit `content.json` directly, or use `/admin/`.
- Project images can be hot-linked (Behance) or uploaded via the CMS into `assets/uploads/`.
