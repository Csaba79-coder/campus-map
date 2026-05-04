# Campus Map

A map-based Angular application for marking, saving, editing, and deleting buildings on an interactive map after authentication.

Advanced Web Development — Exam Assignment, 2026.

## Prerequisites

- [Node.js](https://nodejs.org/) v24.x LTS
- npm v11.x

## Installation

```bash
git clone https://github.com/Csaba79-coder/campus-map.git
cd campus-map
npm install
npm i -g json-server
ng add @angular/material
npm install leaflet @types/leaflet
npm install leaflet-draw
npm install @ngrx/store @ngrx/effects
npm install @types/leaflet-draw
```

## Running the application

Start the JSON Server (mock backend):

```bash
npx json-server src/db/db.json
```

Start the Angular dev server (in a separate terminal):

```bash
ng serve
```

The application will be available at `http://localhost:4200/`

## Tech stack

- Angular 21
- Angular Material (Azure/Blue theme)
- NgRx (state management)
- Leaflet + Leaflet Draw (interactive maps & polygon drawing)
- json-server (mock REST API)
- TypeScript 6
- Node.js 24

## Default credentials

- Username: `admin`
- Password: `test01`
