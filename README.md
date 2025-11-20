# Everlast - CRM Prototyp 🚀

Ein modernes CRM-System, gebaut als Monorepo mit **NestJS**, **Next.js**, **Prisma** und **Docker**.

## 🏗 Architektur

Das Projekt ist als Monorepo (pnpm workspaces) aufgebaut:

- **`apps/api`**: NestJS Backend (REST API, Workflow Engine).
- **`apps/web`**: Next.js Frontend (React, Tailwind, Shadcn UI).
- **`packages/prisma`**: Geteiltes Datenbank-Schema und Client.
- **`packages/types`**: Geteilte TypeScript-Typen (DTOs).

**Infrastruktur:**
- **Docker**: Beherbergt die **API** und die **PostgreSQL** Datenbank.
- **Lokal**: Das **Frontend** wird aktuell lokal gestartet (für einfacheres Debugging/UI-Entwicklung).

---

## 🚀 Quickstart (How to run)

Voraussetzungen:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installiert und laufend.
- [Node.js](https://nodejs.org/) (v18+) und [pnpm](https://pnpm.io/) installiert.

### 1. Repository klonen & Setup

```bash
git clone <REPO_URL>
cd everlast

# Abhängigkeiten installieren
pnpm install
```

### 2. Backend & Datenbank starten (Docker)

Wir starten die API und die Datenbank im Container. Das Setup kümmert sich automatisch um die Datenbank-Migration und das Seeding von Demo-Daten.

```bash
# Startet API (Port 3000) und DB (Port 5432)
docker-compose up --build
```

*Warte kurz, bis du im Terminal `Nest application successfully started` siehst. Der Initial-Seed ("Demo Company GmbH") wird automatisch ausgeführt.*

### 3. Frontend starten (Lokal)

Öffne ein **neues Terminal** im Projekt-Root:

```bash
# Starten des Frontends (läuft auf Port 3001)
pnpm --filter web dev
```

Alternativ:
```bash
cd apps/web
pnpm dev
```

Das Frontend läuft nun unter **[http://localhost:3001](http://localhost:3001)**.

---

## 🧹 Reset / Daten löschen

Möchtest du wieder bei Null anfangen (Datenbank leeren und neu seeden)?

```bash
# Stoppt Container und LÖSCHT die Datenbank-Volumes
docker-compose down -v

# Startet alles neu (inkl. frischem Seed)
docker-compose up --build
```

---

## 🔑 Zugangsdaten (Seed)

Das System ist so konfiguriert, dass es ohne Login funktioniert (Multi-Tenancy wird über feste IDs simuliert).

- **Tenant**: Demo Company GmbH
- **User**: Max Mustermann (Admin)

*Die IDs sind im Code und Seed fest hinterlegt, sodass Frontend und Backend sich sofort finden.*

## 🛠 Tech Stack

- **Backend:** NestJS, Prisma ORM, PostgreSQL
- **Frontend:** Next.js 14, React Query, TailwindCSS, Shadcn/ui
- **Tools:** Docker Compose, PNPM Workspaces

