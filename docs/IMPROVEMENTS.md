# 🚀 Future Improvements & Roadmap

Eine Übersicht über geplante Architekturerweiterungen und Optimierungen für den Produktivbetrieb.

## 🔐 Sicherheit & Authentifizierung

### JWT & Auth-Service
Aktuell nutzen wir eine feste Tenant-ID für den Prototypen.
- **Ziel:** Implementierung eines echten Auth-Services (z. B. Auth0 oder eigener JWT-Service).
- **Vorteil:** Die `tenantId` wird sicher aus dem **JWT-Payload** extrahiert, statt clientseitig im Header gesendet zu werden. Das verhindert, dass User Daten anderer Tenants abrufen können.

## 🏗 Architektur & Skalierung

### Queue-basierte Workflow Engine
Aktuell läuft der Workflow-Executor via `EventEmitter` im selben Prozess.
- **Ziel:** Umstellung auf eine Message Queue (z. B. RabbitMQ, SQS oder BullMQ).
- **Vorteil:** Workflows werden robust im Hintergrund verarbeitet. Der Executor kann als eigener **Microservice** (z. B. AWS Lambda) ausgelagert werden und unabhängig von der API skalieren.

### Caching Layer (Redis)
- **Ziel:** Zwischenspeichern von leseintensiven Daten (Dashboard-Stats, Workflow-Definitionen) in Redis.
- **Vorteil:** Entlastung der Datenbank und drastisch schnellere Antwortzeiten für den Endnutzer.

## ⚡ Frontend & UX

### Optimistic UI Updates
- **Ziel:** Änderungen (z. B. Task abhaken) im Frontend sofort anzeigen, während der Request im Hintergrund läuft.
- **Vorteil:** Die App fühlt sich "instant" an, ohne Ladezeiten bei Interaktionen.

### Server-Side Pagination & Filtering
- **Ziel:** Verlagern von Filterlogik (z. B. bei Tasks) komplett in die Datenbank.
- **Vorteil:** Bessere Performance bei großen Datenmengen (Tausende von Leads/Tasks).

## 📊 Observability

- **Structured Logging:** Einführung von zentralem Logging (z. B. ELK Stack) für besseres Debugging.
- **Monitoring:** Tracking von Workflow-Fehlerraten und API-Latenzen.

