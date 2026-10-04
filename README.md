# ED840 Oral Defense Practice Lab

Static student-facing site for preparing for the ED840 recorded oral defense.

## Included

- Embedded Synthesia video: **From Paper to Defense**
- Downloadable **ED840 Recorded Video Oral Defense Readiness Guide**
- Interactive practice lab with five defense domains
- Answer → Justify → Evidence → Meaning planning framework
- Practice timer and four-part self-check
- Browser-local note saving only; no API or database

## Files

- `index.html` — page structure and content
- `styles.css` — responsive styling
- `app.js` — interactive practice questions, notes, timer, and self-check
- `ED840_Recorded_Video_Oral_Defense_Readiness_Guide.docx` — student readiness guide
- `render.yaml` — Render static-site Blueprint configuration

## Deploy on Render

1. Create a GitHub repository and upload all files in this folder to the repository root.
2. In Render, choose **New → Blueprint** and select the repository containing `render.yaml`, or choose **New → Static Site** and connect the repository.
3. If creating the Static Site manually, use:
   - Build Command: `echo "Static site - no build required"`
   - Publish Directory: `.`
4. Deploy the site.

Render can automatically redeploy the static site whenever you push updates to the connected branch.

## Privacy

Student planning notes are stored only in the student's browser using local storage. There is no backend, API, database, or submission feature in this site.
