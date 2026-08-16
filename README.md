# VoltTrack app

A simple dashboard for a robotic charging system. 

## Tech stack

- **Backend:** nestJS, TypeORM, PostgreSQL
- **Frontend:** Vue 3, Vuetify, Vite
- **Database:** PostgreSQL (via Docker Compose)

## Prerequisites

- NodeJS (v20+)
- Docker & Docker Compose
- npm

## Getting Started

### 1. Clone & install dependencies

```bash
git clone https://github.com/dardecena/volt-track
cd volt-track

cd backend && npm install
cd ../frontend && npm install
```

### 2. Set up environment variables
From the volt-track directory:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontent/.env
```

### 3. Start the database

```bash
docker compose up -d
```

### 4. Run migrations
From the backend directory:
```bash
npm run migration:run
```

### 5. Seed the database
From the backend directory:
```bash
npm run seed
```

### 6. Start the backend
From the backend directory:
```bash
npm run start:dev
```

Runs on `http://localhost:3000`

### 7. Start the frontend

In a separate terminal, on the frontend directory:

```bash
npm run start:dev
```

Runs on `http://localhost:5173`

## Decisions, Tradeoffs, and Assumptions
**Assumptions**
- Development environment
  - Used Vite dev proxy to avoid CORS
  - No auth
- Error code must always be explicitly send on the BE
- Latest status means most recent by lastSeen, not createdAt
- 

**Trade-offs**
- No Pinia store, composables and refs were used instead. It was a pragmatic choice 
  to opt-out of using a store, as the structure of the component tree was 
  flat, prop-drilling would not be an issue in this case .
- Used a v-table rather than a v-data-table component for development ease. 
The table did not have any search, sort or pagination requirements
- 5-character alphanumeric IDS with no collision-retry logic rather than using UUIDs, as it's more readable
- RobotStatus is a normalized table instead of a jsonb array on Robot. A jsonb array would bundle every 
reading into a big blob on the Robot row that would require unpacking, and has no real indexing support. 
Adding a RobotStatus table enables for easier appending, allows for indexing at the cost of a JOIN 
when a query requires RobotStatus information. 
- No format validation pipe on :id route params, causing errors to resolve to 404 from the service layer 
instead of a 400 at the routing layer. 
- Pagination defaults and limits are hardcoded into the service logic rather than pulled into
environmental variables. It's the simplest option, but later on would require code changes and 
redeployments, rather than just updating a config. It would also  create more complications in 
different environments,
- Some display text and logic are hardcoded directly into the Vue template, rather than being
defined in the script section as data or methods. It works fine functionally but makes for text 
and logic that is harder to reuse, update or test later. The ideal approach would be to keep
logic in the script and just let the template render it. 
- e2e tests run against a dev database and not an isolated database. It is faster to set up, but 
it is not self-contained and repeatable in different environments. 

## AI tools used: 
- **Tool:** Claude
- **Used for:** AI-assisted coding where I was the driver and AI helped me with rubber ducking, 
debugging, writing scripts, TypeORM config, and tests. It also assisted with coding the presentation layer 
(HTML/CSS) as I was working with design and icon libraries I haven't used in awhile. 


- **Tool:** UX Pilot
- **Used for:** To generate a design mockup for a dashboard. 

## Time Spent: 
- Setup and Scaffolding - 2h
  - NestJS BE and Vue 3 FE
  - In hindsight, I should've used Claude Code for this.
- Backend - 1h
- Frontend - 2h
- Written - 45min


