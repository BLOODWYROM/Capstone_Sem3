# Quick: Deploy frontend to GitHub Pages

1. Push your repo to GitHub and make sure the default branch is `main`.
2. This project includes a GitHub Actions workflow at `.github/workflows/deploy_frontend.yml` that will:
   - Install dependencies in `/frontend`
   - Run `npm run build` (produces `frontend/dist`)
   - Publish `frontend/dist` to the `gh-pages` branch using `peaceiris/actions-gh-pages`

3. After the action completes, enable Pages for the repository (if GitHub doesn't auto-enable):
   - Settings → Pages → Branch: `gh-pages` → `/ (root)` → Save

4. Your site will be available at `https://<github-username>.github.io/<repo-name>/`.

Notes:
- The Vite config has been adjusted (`base: './'`) so assets load correctly from a subpath.
- If your default branch is not `main`, edit the workflow or push to `main`.
- The workflow uses the repository's `GITHUB_TOKEN`, no extra secret required for basic publishing.
