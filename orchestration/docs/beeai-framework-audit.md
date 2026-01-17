# BeeAI framework audit

## Findings

- The repository is an application built from the BeeAI TypeScript starter template rather than the framework source. Evidence: the `package.json` metadata still points at `beeai-framework-starter` (name/homepage/repository/bugs), and the repo contains an application-focused README and `src/` layout rather than framework library source. The code imports the framework from npm (`beeai-framework`).
- The BeeAI framework is consumed as an npm dependency, not vendored.

## Runtime dependencies in use

From `package.json` and `package-lock.json`:

| Package                   | Version spec | Installed version | Notes                              |
| ------------------------- | ------------ | ----------------- | ---------------------------------- |
| `beeai-framework`         | `^0.1.23`    | `0.1.23`          | BeeAI framework runtime dependency |
| `@ai-sdk/google-vertex`   | `^3.0.97`    | `3.0.97`          | Vertex AI adapter used by BeeAI    |
| `@google-cloud/firestore` | `^7.11.6`    | `7.11.6`          | Firestore persistence              |
| `zod`                     | `^3.24.2`    | `3.24.2`          | Validation                         |

Observability packages (e.g., OpenInference instrumentation, Phoenix, Bee Stack): **not present** in this repo’s dependencies.

## Risks and considerations

- **Version drift:** `^` ranges allow minor/patch updates that could introduce breaking changes if BeeAI introduces behavior changes between minor versions.
- **Runtime dependencies:** The service depends on Vertex AI credentials and Firestore connectivity in Cloud Run; missing environment variables or IAM permissions will cause runtime failures.
- **Observability gap:** Without OpenInference instrumentation or Bee Stack/Phoenix, you will not get spans/traceability beyond application logs.

## Recommendations

### When to keep using the starter template + npm dependency

- You are building an application/service (like this VARK orchestration service) and do not need to change the framework internals.
- You want stable, versioned releases and minimal dependency management.

### When to track the framework repo directly

- You are contributing to BeeAI framework source code.
- You need to patch framework internals or test unreleased changes.
- You can commit to maintaining a fork and rebasing regularly.

### Safe update strategy for `beeai-framework`

1. Read release notes/changelog at https://github.com/i-am-bee/beeai-framework/releases.
2. Bump with `npm install beeai-framework@<version>` (or `npm update beeai-framework`), then review `package-lock.json` changes.
3. Run `npm run verify:beeai` and existing tests.
4. Deploy to a staging Cloud Run service and validate LLM probes + Firestore operations.

## NEXT STEPS (Bee UI / Bee Stack)

If Bee UI requires Bee Stack services to run (API backend, observability services), plan to:

- Pull Bee Stack from its official docs/repo and run it locally (typically via a dedicated compose file).
- Configure Bee UI to point at the Bee Stack API (if required) and at this orchestration service’s URL.
- Decide whether to deploy Bee Stack alongside Cloud Run or keep it separate for observability only.
