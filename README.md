# The Medieval Chronicle — Stage 1

This is a **working vertical slice**, not the finished nine-decision simulation. It includes village setup, randomly assigned persistent geography, a founding priority, Decision 1, a separate outcome, resource display, clickable map, Chronicle, browser autosaving, JSON backup/restore, and an offline PDF smoke-test export.

## Test on your computer

1. Extract the ZIP folder.
2. If Python is installed, open a terminal **inside** `medieval-chronicle-stage1` and run `python -m http.server 8000` (Windows may require `py -m http.server 8000`).
3. Open `http://localhost:8000` in your browser. **Do not double-click `index.html`**: the app uses JavaScript modules and some browsers block them from local `file://` URLs.
4. Complete the setup, make one decision, view the outcome, and continue to the Stage 1 completion screen.
5. Refresh the page: your progress should remain. Download a backup, then test importing it. Export a PDF and check that it opens and lists your choice.
6. To test a fresh start, use **Tools & Save → Start new village** (download a backup first if needed).

If Node.js is installed, run `npm test` to check all 4 geographies × all 4 first-decision options and guard against duplicate confirmations. Node is **not required** for students or hosting.

## GitHub Pages later

Upload the **contents of this folder** (including `index.html`, `src/`, and `styles/`) to a public GitHub repository. In repository **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save. GitHub Pages will provide a public URL. The site uses relative paths, so it works under a repository subpath. Before classroom use, test that your school Chromebooks can open the site, save, download JSON and PDF, and upload PDFs to Canvas.

## Privacy and limitations

No accounts, analytics, database, or server-side collection. Progress is stored in this browser's `localStorage`; browser clearing, device changes, or managed-device policies can remove it. JSON backup is optional and contains the fictional village names and choices. PDFs are generated locally. The Stage 1 PDF is a simple text-based smoke test; the full illustrated 4–5-page report will be implemented in Stage 4. The Stage 1 map is a simple interactive schematic, not a historical reconstruction. The full simulation, sources, final assessment, and era reflections are **not yet implemented**.

## Next build

Stage 2: add Decisions 2–9, transitions, geography-specific choices, and conditional consequences. Do not publish as a finished student lesson until all stages and historical source verification are complete.
