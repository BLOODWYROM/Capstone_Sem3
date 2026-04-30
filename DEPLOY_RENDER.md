# Triggering Render Deploys via GitHub Actions

This repository includes a GitHub Actions workflow at `.github/workflows/deploy_backend_render.yml` that will:

- Install and build the backend (`/backend`) on pushes to `main`.
- Trigger a Render deploy by calling the Render API for the configured service.

Prerequisites
- A Render account and a Web Service already created for your backend (the one you configured via `render.yaml`).
- A Render API key: create one at https://dashboard.render.com/account/api-keys (Store as `RENDER_API_KEY` in GitHub secrets).
- The Render Service ID for your backend: find it in the Render dashboard URL or API. Add it to GitHub secrets as `RENDER_SERVICE_ID`.

How to add the secrets
1. Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret.
2. Add `RENDER_API_KEY` with the value from Render.
3. Add `RENDER_SERVICE_ID` with the service id (format: `srv-xxxxxx`).
4. (Optional) If you need to run Prisma commands during the workflow and your setup requires it, add `DATABASE_URL` as a secret.

What the workflow does
- Builds the backend to catch TypeScript errors before triggering a deploy.
- Calls the Render API to start a deployment for the configured service. The workflow will fail early if required secrets are missing.

Notes
- The workflow triggers on pushes to `main`. Change the branch in the workflow file if you use another branch.
- Render will perform the real build in their environment (with the correct `DATABASE_URL` and production env vars you set in Render). The CI build is primarily to validate the code compiles.
