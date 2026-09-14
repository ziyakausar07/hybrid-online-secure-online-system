# Hybrid Secure Voting System — Modernized Setup

Quick steps to run locally or in containers.

Prerequisites:
- Node 22+, npm 9+ (for local frontend/backend-node development)
- Java JDK 17+ and Maven (to build the Java backend)
- MySQL Server 8.0+ (Local / XAMPP / WAMP)

Setup:
1. Copy `.env.example` to `.env` and fill values.
2. Import `database/schema.sql` into MySQL database (`voting_db`).

3. Frontend (local dev):
   cd frontend
   npm install
   npm start

4. Node gateway (local dev):
   cd backend-node
   npm install
   npm start

5. Java backend:
   Install Maven, then:
   mvn -f backend/pom.xml -DskipTests clean package
   Deploy the generated WAR to a servlet container (Tomcat) or run per project instructions.

Notes:
- Maven is required to build and verify the Java backend. If you cannot install Maven locally, run the Maven build in CI or on a machine that has it installed.
- After editing `package.json` files, remove `node_modules` and `package-lock.json` and run `npm install` to regenerate lockfiles without `file:` refs.
- The `.env` file must be kept secret; do not commit secrets to version control.

If you want, I can:
- Run the Node + frontend smoke-start now (I have Node/npm available).
- Attempt `mvn` if you install Maven or run it in CI and provide the output.
- Continue cleaning any remaining missing imports or package issues.
