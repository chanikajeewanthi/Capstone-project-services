# Capstone Project - Services

Microservices for the Capstone Project academic management system. This repository contains three Spring Boot services, each managed as a Git submodule, along with deployment configuration for running them together via PM2.

## Services

| Service | Description | Database | Port |
|---|---|---|---|
| `student-service` | Manages student records | PostgreSQL | 8000 |
| `program-service` | Manages academic programs offered by the institution | MongoDB | 8001 |
| `enrollment-service` | Manages student enrollments, exposed to the API Gateway | MySQL | 8002 |

Each service is a separate Git repository, linked here as a submodule.

## Architecture

These services depend on the **Platform** components (Service Registry, Config Server, API Gateway), which run separately and are not part of this repository. Each service:

- Fetches its configuration from the Config Server at startup (`config.platform:9000`)
- Registers itself with Eureka (Service Registry) once running
- Connects to its own dedicated database

## Prerequisites

- Java 25 (or the version specified in each service's `pom.xml`)
- Maven 3.9+
- Node.js + PM2 (`npm install -g pm2`)
- Access to the Platform services (Config Server, Service Registry) on the network
- Database access (PostgreSQL, MongoDB, MySQL) — either local instances or via a Cloud SQL Auth Proxy

## Getting Started

### 1. Clone with submodules

```bash
git clone --recurse-submodules https://github.com/<your-username>/Capstone-project-services.git
cd Capstone-project-services
```

If you already cloned without `--recurse-submodules`, initialize them separately:

```bash
git submodule update --init --recursive
```

### 2. Pull latest changes (including submodules)

```bash
git pull --recurse-submodules
```

### 3. Build all services

```bash
mvn clean package -DskipTests
```

This produces a runnable `.jar` for each service under its own `target/` folder.

### 4. Start the database proxy (if using Cloud SQL)

The `ecosystem.config.js` file starts a Cloud SQL Auth Proxy alongside the services. Ensure the `cloud-sql-proxy` binary is present in the project root before starting:

```bash
curl -o cloud-sql-proxy https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.14.0/cloud-sql-proxy.linux.amd64
chmod +x cloud-sql-proxy
```

> **Note:** This binary is not tracked in Git and must be downloaded fresh on every new environment/VM.

### 5. Run all services with PM2

```bash
pm2 start ecosystem.config.js
pm2 status
```

Check logs for any individual service:

```bash
pm2 logs student-service --lines 50 --nostream
```

### 6. Verify registration with Eureka

Open the Service Registry dashboard in a browser:

```
http://<platform-external-ip>:9001
```

All three services should appear under **"Instances currently registered with Eureka"** with status `UP`.

## Configuration

Service configuration (database URLs, credentials, ports) is **not** stored in this repository. It is centrally managed by the Config Server in the Platform repository, under:

```
config-server/src/main/resources/configurations/services/
```

Any change to database connection settings must be made there, followed by rebuilding and restarting the Config Server.

## Common Issues

| Symptom | Likely Cause | Fix |
|---|---|---|
| `Unable to access jarfile ... .jar` | Service hasn't been built yet | Run `mvn clean package` |
| `Connection refused` to a DB port | Cloud SQL Proxy not running, or wrong port in config | Check `pm2 status` for `cloud-sql-auth-proxy`; verify port matches proxy's actual listening port |
| `database does not exist` | Target database was never created | Create it manually via `psql` / `mysql` client |
| Service builds but never appears in Eureka | Service crash-looping on startup (check `pm2 status` restart count `↺`) | Check `pm2 logs <service-name>` for the real startup error |
| Submodule folders are empty after clone | No access to submodule repos, or clone was interrupted | Run `git submodule update --init --recursive` |

## Restarting a Single Service

```bash
pm2 restart student-service
pm2 restart enrollment-service
pm2 restart program-service
```

## Stopping All Services

```bash
pm2 stop all
```

## Repository Structure

```
Capstone-project-services/
├── student-service/       (submodule)
├── program-service/       (submodule)
├── enrollment-service/    (submodule)
├── ecosystem.config.js    (PM2 process definitions)
├── pom.xml                (parent POM, aggregates all modules)
└── README.md
```
