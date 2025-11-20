# Product Requirements Document (PRD) - Everlast CRM

## 1. Einführung

**Everlast** ist ein modernes CRM-System mit Fokus auf Automatisierung und Lead-Management. Es ermöglicht Unternehmen (Tenants), ihre Leads effizient zu verwalten, Follow-Up-Aufgaben zu automatisieren und den Vertriebsprozess durch Workflows zu optimieren.

### 1.1 Zielgruppe
- Vertriebsteams und Sales-Manager.
- Unternehmen, die manuelle Follow-Ups reduzieren möchten.

### 1.2 Kernfunktionen (MVP)
- **Multi-Tenancy:** Mandantenfähige Architektur zur Trennung von Unternehmensdaten.
- **Lead Management:** Erfassen und Verwalten von Interessenten.
- **Task Management:** Manuelle und automatisierte Aufgabenverwaltung.
- **Workflow Engine:** Event-basierte Automatisierung (z. B. automatische Task-Erstellung bei neuem Lead).
- **Dashboard:** Übersicht über KPIs und anstehende Aufgaben.

---

## 2. Technische Architektur

### 2.1 Tech Stack
- **Frontend:** Next.js (React), TailwindCSS, Shadcn/UI, TanStack Query.
- **Backend:** NestJS (Node.js), TypeScript.
- **Datenbank:** PostgreSQL.
- **ORM:** Prisma (mit Type-Safety über Workspace-Packages).
- **Infrastruktur:** Docker & Docker Compose.
- **Monorepo:** PNPM Workspaces.

### 2.2 Datenmodell (Core Entities)
- **Tenant:** Repräsentiert den Mandanten (Firma).
- **User:** Benutzer innerhalb eines Tenants (Rollen: Admin, Sales Rep).
- **Lead:** Ein potenzieller Kunde.
- **Task:** Eine Aufgabe (Call, Email, Meeting), verknüpft mit Lead und/oder User.
- **Workflow:** Definition eines Automatisierungsprozesses (Trigger -> Actions).
- **WorkflowStep:** Einzelschritt eines Workflows (z. B. "Erstelle Task in 24h").

---

## 3. Funktionale Anforderungen

### 3.1 Multi-Tenancy & Authentifizierung
- **Header-based Isolation:** Alle API-Anfragen müssen den Header `x-tenant-id` enthalten.
- **Daten-Isolation:** Jeder Datenbankzugriff muss zwingend nach `tenantId` filtern.
- **Prototyping:** Für den MVP wird eine feste Tenant-ID (`tenant-demo-001`) verwendet.

### 3.2 Dashboard
- Anzeige aggregierter Statistiken:
  - Anzahl Leads gesamt.
  - Anzahl offener Tasks.
  - Anzahl aktiver Workflows.
- Liste der "Upcoming Tasks" (sortiert nach Fälligkeit).
- Liste der "Recent Leads" (neueste zuerst).

### 3.3 Lead Management
- **Liste:** Anzeige aller Leads mit Status (NEW, CONTACTED, etc.).
- **Details:** Detailansicht mit Stammdaten (Name, Email, Telefon).
- **Editieren:** Bearbeiten von Stammdaten direkt in der Detailansicht.
- **Status-Update:** Schnelles Ändern des Lead-Status.
- **Task-Historie:** Anzeige zugehöriger Tasks auf der Lead-Detailseite.

### 3.4 Task Management
- **Erstellung:** Manuell oder automatisch (via Workflow).
- **Attribute:** Titel, Typ (Call, Email), Kategorie, Fälligkeitsdatum.
- **Status:** Tasks können als `OPEN` oder `DONE` markiert werden.
- **Zuordnung:** Tasks sind immer einem Tenant und optional einem Lead zugeordnet.

### 3.5 Workflow Automation
- **Trigger:** `LEAD_CREATED` (Workflow startet, wenn ein neuer Lead angelegt wird).
- **Aktionen:** `CREATE_TASK` (Erstellt automatisch einen Task mit definierter Verzögerung).
- **CRUD:** Workflows können erstellt, gelöscht und deaktiviert werden.
- **Execution:** Die Ausführung erfolgt asynchron über eine interne Event-Engine (`EventEmitter`).

---

## 4. API Design (REST)

### 4.1 Standard-Header
Alle Requests erfordern:
```http
Content-Type: application/json
x-tenant-id: <TENANT_ID>
```

### 4.2 Endpoints (Auszug)

**Leads**
- `GET /leads` - Alle Leads abrufen.
- `POST /leads` - Neuen Lead erstellen (triggert `lead.created` Event).
- `GET /leads/:id` - Details abrufen.
- `PATCH /leads/:id` - Status oder Daten aktualisieren.

**Tasks**
- `GET /tasks?leadId=...` - Tasks abrufen (optional gefiltert).
- `POST /tasks` - Task erstellen.
- `PATCH /tasks/:id` - Task aktualisieren (z. B. Status auf DONE).

**Workflows**
- `GET /workflows` - Alle Workflows abrufen.
- `POST /workflows` - Workflow inkl. Steps erstellen.
- `DELETE /workflows/:id` - Workflow löschen.
- `PUT /workflows/:id` - Workflow ersetzen (Steps neu definieren).

**Dashboard**
- `GET /dashboard` - Aggregierte Statistiken abrufen.

---

## 5. Entwicklung & Deployment

### 5.1 Lokale Entwicklung
- **API & DB:** Laufen in Docker Containern (`docker-compose up`).
- **Frontend:** Läuft nativ via `pnpm dev` (Port 3001).
- **Seeding:** Beim Container-Start wird automatisch ein Demo-Tenant geseedet, um Login-Hürden zu entfernen.

### 5.2 Reset-Strategie
- Da Hot-Reload für Backend-Container deaktiviert wurde (für Stabilität), wird bei Code-Änderungen am Backend ein Rebuild empfohlen.
- Ein kompletter Daten-Reset ist via `docker-compose down -v` möglich.

---

## 6. Roadmap / Future Improvements
- [ ] Echte Authentifizierung (JWT/Auth0).
- [ ] UI für Workflow-Builder (Drag & Drop).
- [ ] Weitere Workflow-Aktionen (Email-Versand, Slack-Notifikation).
- [ ] Kalender-Ansicht für Tasks.
- [ ] User-Management & Rollenrechte.

