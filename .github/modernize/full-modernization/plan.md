# Modernization Plan for Hybrid Secure Voting System

## Overview
This plan modernizes the full-stack voting application by addressing architecture issues, removing hardcoded `localhost` URLs, centralizing configuration and secrets, securing authentication, cleaning dependency and build configuration, and preparing the application for professional deployment.

The project is a hybrid Java + Node + React application with:
- `backend/` — Java servlet/JSP WAR application with Oracle JDBC and JWT utilities
- `backend-node/` — Express API gateway with JWT, sessions, and Axios calls to the Java backend
- `frontend/` — React client with hardcoded API endpoints and local storage-based authentication

## Goals
- Consolidate environment and secrets management
- Eliminate hardcoded hosts and port references
- Harden authentication and authorization flows
- Clean Maven/npm dependencies and remove duplicate/unused packages
- Prepare the app for containerized deployment and production readiness

## Task Summary
1. `001-modernize-java-backend-security` — Harden Java backend configuration, remove embedded database credentials, and tighten servlet session handling.
2. `002-modernize-node-api-security` — Secure the Node API gateway, externalize secrets, enforce CORS origin config, and harden JWT validation.
3. `003-modernize-react-frontend-configuration` — Remove hardcoded frontend host URLs, centralize API base URL, and strengthen client-side auth handling.
4. `004-centralize-runtime-environment-and-secrets` — Consolidate all configuration into environment variables and secure secrets storage for Java, Node, and frontend.
5. `005-clean-and-stabilize-build-dependencies` — Fix Maven build configuration, remove duplicate and outdated dependencies, upgrade React/npm packages, and stabilize workspace package manifests.
6. `006-prepare-production-deployment` — Add containerization readiness, runtime configuration for production, and deployment hygiene.

## Execution Notes
- This plan assumes the Java backend remains the primary server-side application and the Node service acts as an API gateway / integration layer.
- The Java backend must be updated to stop using hardcoded `jdbc:oracle:thin:@localhost:1521/xe` strings and move to environment-based datasource configuration.
- The React frontend must use a single runtime API base URL and stop storing sensitive tokens in plain local storage where feasible.
- The plan supports deployment to container platforms or cloud app services by preparing environment variables, secure secrets references, and build artifacts.

## Validation Criteria
- Java WAR builds successfully with Maven
- Node API starts successfully and passes route checks
- React app builds successfully
- Hardcoded localhost/port strings are removed from production code
- Sensitive tokens and DB credentials are moved to environment configuration
- Authentication flows use signed JWTs and reject invalid tokens

---

## Detailed Tasks

### Task 1: Harden Java backend configuration and authentication
- Replace hardcoded Oracle JDBC URLs, usernames, and passwords with environment-based configuration.
- Consolidate servlet security and session management.
- Improve JWT utilities for secure secret handling and token validation.
- Remove duplicate Maven dependency declarations and consolidate WebSocket / servlet dependencies.

### Task 2: Secure the Node API gateway
- Replace hardcoded `http://localhost:7070/backend/...` calls with configurable backend endpoints.
- Externalize `JWT_SECRET`, session settings, CORS origins, and Oracle DB config.
- Enforce helmet, rate limiting, and strict JSON body parsing.
- Harden middleware authentication and remove insecure logging of token values.

### Task 3: Modernize the React frontend
- Replace hardcoded `http://localhost:5000/api/...` and `ws://localhost:5000` endpoints with runtime environment values.
- Centralize API base URL in a single config file or `.env` file.
- Use a safe auth pattern that stores only non-sensitive session state and protects API requests with Authorization headers.
- Clean up stale packages and ensure React scripts are aligned with supported React 19 versions.

### Task 4: Centralize runtime environment and secrets
- Create `.env` examples for Java, Node, and frontend service environments.
- Remove all hardcoded secrets and replace with environment variables:
  - `JAVA_DB_URL`, `JAVA_DB_USER`, `JAVA_DB_PASSWORD`
  - `NODE_JWT_SECRET`, `NODE_API_BASE_URL`, `NODE_SESSION_SECRET`, `NODE_CORS_ORIGIN`
  - `REACT_APP_API_BASE_URL`, `REACT_APP_WS_URL`
- Document environment configuration in `README.md` or a dedicated deployment guide.

### Task 5: Clean dependency and build configuration
- Remove duplicate and outdated dependencies from `backend/pom.xml`.
- Upgrade Maven plugin versions and pin compiler/binding dependencies.
- Remove invalid `file:` references from `backend-node/package.json` and `frontend/package.json`.
- Add simple build scripts and validation commands for Java, Node, and frontend.

### Task 6: Prepare the app for professional deployment
- Add deployment readiness guidance for container or cloud hosting.
- Prepare `Dockerfile`/deployment manifests or at least a deployment task checklist.
- Ensure production build artifacts are generated cleanly and public clients point to configured backend endpoints.
- Harden logging and error handling for production use.

---

## Plan Metadata
- Project: Hybrid Secure Voting System
- Created: 2026-05-28
- Scope: full-stack modernization and security hardening
- Language: java
