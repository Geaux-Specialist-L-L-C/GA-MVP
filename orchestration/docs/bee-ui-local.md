# Bee UI local bring-up

## Current state (this repo)

- `docker-compose.yml` only provisions the Bee code interpreter (k3s) under the `all` and `code_interpreter` profiles.
- No Bee UI or Bee Stack services are included in this repository.

## Start code interpreter only (existing path)

```bash
npm_config_profile=code_interpreter npm run infra:start
```

Stop it with:

```bash
npm_config_profile=code_interpreter npm run infra:stop
```

## Start Bee UI (optional profile)

Because Bee UI is not included in this repo, the `docker-compose.ui.yml` file expects the Bee UI source to be cloned next to this repository.

1. Clone Bee UI alongside this repo (same parent folder):

```bash
git clone https://github.com/i-am-bee/bee-ui ../bee-ui
```

2. Bring up Bee UI with the optional `ui` profile:

```bash
docker compose -f docker-compose.ui.yml --profile ui up --build
```

> If you want Bee UI running alongside the existing code interpreter profile, you can combine compose files:
>
> ```bash
> docker compose -f docker-compose.yml -f docker-compose.ui.yml --profile code_interpreter --profile ui up --build
> ```

### Point Bee UI at this orchestration service

Bee UI configuration varies by release. After cloning Bee UI, check its README and `.env.example` (or equivalent) for the expected environment variable (for example, a `*_API_URL` value). Set that value to:

- Local service: `http://localhost:8080`
- Cloud Run service: `https://<your-cloud-run-url>`

If running via Docker Compose, pass the variable via an `.env` file or `--env-file` so the Bee UI container can read it.

## Smoke test checklist

- Open `http://localhost:3000` in your browser.
- Configure Bee UI to point at the orchestration service URL.
- Start an agent or workflow and verify requests reach the service.
- If observability is configured, confirm spans/logs appear in the configured backend.

## If Bee UI cannot be dockerized locally

If Bee UI’s repo does not provide a Dockerfile or compose guidance, run it from source:

```bash
git clone https://github.com/i-am-bee/bee-ui
cd bee-ui
# follow the Bee UI README for install/start steps
```

Then configure its API base URL to the orchestration service as noted above.
