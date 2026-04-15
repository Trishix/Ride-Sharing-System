# Ride-Sharing-System

## Project Overview

This repository contains a TypeScript-based backend for a ride-sharing system. It is designed with a clean architecture using domain services, repositories, and strategy patterns for pricing and driver matching. The application exposes REST endpoints for managing drivers, riders, and trips, and stores data in PostgreSQL.

## Tech Stack

- Language: TypeScript
- Runtime: Node.js
- Web framework: Express
- Database: PostgreSQL
- Database driver: `pg`
- Swagger UI for API docs: `swagger-ui-express`
- Tooling: `ts-node`, TypeScript compiler (`tsc`), npm

## Features

- Register drivers and riders
- Update driver availability
- Create, update, withdraw, and end trips
- Retrieve available drivers
- Retrieve rider trip history
- Pricing strategy with preferred rider discounts
- Postgres persistence with schema initialization

## Repository Structure

- `src/server.ts` - application bootstrap, environment loading, dependency wiring
- `src/app.ts` - Express app configuration, routes setup, middleware, API docs integration
- `src/routes/` - route definitions for drivers, riders, trips, and system endpoints
- `src/controllers/` - request handling, validation, response formatting
- `src/application/services/` - business logic for drivers, riders, and trips
- `src/domain/repositories/` - repository interface definitions
- `src/infrastructure/` - PostgreSQL persistence and repository implementations
- `src/model/` - domain entities such as `Driver`, `Rider`, `Trip`, and `TripStatus`
- `src/strategy/` - pricing and driver matching strategy interfaces and implementations
- `src/utils/` - request parsing helpers and shared utilities
- `src/constants/` - location options for origin and destination validation

## Prerequisites

- Node.js 18 or newer
- npm
- PostgreSQL database

## Setup and Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Ride-Sharing-System
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables.

Create a `.env` file at the project root with the following values:

```env
DB_URL=postgres://<username>:<password>@<host>:<port>/<database>
PORT=3000
```

- `DB_URL` or `DATABASE_URL` is required.
- `PORT` is optional and defaults to `3000` if not provided.

4. Ensure PostgreSQL is running and accessible using the configured connection string.

## How to Run the Project

### Development

```bash
npm run dev
```

This runs the server using `ts-node` and listens on the configured port.

### Production Build

```bash
npm run build
npm start
```

This compiles TypeScript into `dist/` and runs the compiled application.

### Override the port

```bash
PORT=3001 npm run dev
```

## API Endpoints

### System

- `GET /health` - health check endpoint
- `GET /api-docs.json` - JSON OpenAPI spec output
- `GET /api-docs` - Swagger UI documentation page

### Drivers

- `POST /drivers` - Register a new driver
- `PATCH /drivers/:id/availability` - Update driver availability
- `GET /drivers/available` - Get available drivers
- `POST /drivers/:driverId/end-trip` - End current driver trip

### Riders

- `POST /riders` - Register a new rider
- `GET /riders/:id` - Get rider details
- `GET /riders/:riderId/trips` - Get rider trip history

### Trips

- `POST /trips` - Create a new trip
- `PATCH /trips/:tripId` - Update an existing trip
- `POST /trips/:tripId/withdraw` - Withdraw a trip

## Architecture Explanation

### Application bootstrap

`src/server.ts` loads environment variables, creates the database connection, initializes the schema, and composes the application with service and repository dependencies.

### Express application

`src/app.ts` configures Express middleware, CORS, JSON parsing, route registration, and global error handling. It also mounts Swagger UI for API documentation.

### Route layer

Route classes in `src/routes/` define endpoint paths and attach controller methods. Each route is registered in `App` with a base path.

### Controller layer

Controllers in `src/controllers/` parse and validate incoming requests, call the appropriate service methods, and send JSON responses. Errors are forwarded to the global error handler.

### Service layer

Services in `src/application/services/` contain business logic and orchestration:

- `DriverService` handles driver registration, availability updates, and available driver queries.
- `RiderService` handles rider registration and retrieval.
- `TripService` handles trip creation, updates, withdrawal, ending trips, pricing, and history lookups.

### Domain and repository layer

Repository interfaces in `src/domain/repositories/` define persistence contracts.

Concrete implementations in `src/infrastructure/repositories/` persist domain entities to PostgreSQL:

- `PostgresDriverRepository` manages driver records and active trip loading.
- `PostgresRiderRepository` manages rider records.
- `PostgresTripRepository` manages trip records and maps them back to domain entities.

### Persistence

`src/infrastructure/persistence/PostgresDatabase.ts` manages the PostgreSQL connection pool and initializes database schema for `drivers`, `riders`, and `trips`.

### Domain models

Domain entities in `src/model/` encapsulate the state and behavior of drivers, riders, and trips. The `Trip` entity also tracks status transitions like `IN_PROGRESS`, `COMPLETED`, and `WITHDRAWN`.

### Strategy Pattern

The codebase uses a strategy pattern under `src/strategy/` for extensible pricing and driver matching:

- `PricingStrategy` defines fare calculation contracts.
- `DefaultPricingStrategy` applies a base per-kilometer fare with discounts for rides with more than one seat and preferred riders.
- `DriverMatchingStrategy` defines driver selection logic.
- `OptimalDriverStrategy` currently selects the first available driver, but it can be extended for richer matching.

### Validation

`src/utils/requestParsers.ts` provides reusable request validation helpers for positive integers, required strings, and booleans.

## Notes and Next Steps

- The project currently requires `src/config/openApiSpec.ts` for Swagger docs and API spec support. If this file is missing, the application will fail on startup.
- There are no automated tests in this repository yet.
- Future improvements can include:
  - richer driver matching rules
  - more flexible location handling
  - authentication and authorization
  - request/response API contracts and tests
  - support for multiple database environments
