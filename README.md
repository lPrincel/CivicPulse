# 🏛️ CivicPulse AI — Smart Hyperlocal Issue Reporter & Auto-Triage Engine

> **A full-stack MERN civic tech platform powered by Google Gemini AI** that transforms raw citizen incident reports into auto-triaged, prioritized municipal dispatch tickets in real time.

---

## 💡 The Problem & Inspiration

In modern cities, reporting municipal hazards (downed power lines, burst pipes, dangerous potholes, illegal dumping) is broken:
- **Tedious 311 Portals:** Citizens are forced to navigate confusing multi-page forms with complex category dropdowns.
- **Duplicate Overload:** When a water main bursts, 50 people call the city or submit separate tickets, overwhelming emergency dispatchers.
- **Slow Manual Triage:** Municipal workers spend hours manually reading, classifying, and prioritizing citizen complaints.
- **Zero Transparency:** Citizens submit tickets and never know if or when City Hall resolved the issue.

### 🌟 The Solution: CivicPulse AI
1. **Citizens** write a simple one-sentence description, capture GPS, and attach a photo in seconds.
2. **Google Gemini AI** instantly parses the natural language, classifies the department, evaluates life-safety risk into urgency levels (**Low, Medium, High, Emergency**), and generates an executive dispatch briefing for field crews.
3. **Community Members** view a public hazard feed and can **"Echo" (+1)** existing reports, preventing duplicate tickets while dynamically escalating community priority.
4. **City Hall Dispatchers** manage live tickets on a responsive 3-column Kanban Command Center with one-click crew dispatching and instant community resolution alerts.

---

## 🤖 How Gemini AI Decides Category & Urgency

CivicPulse uses the official **Google Gen AI SDK (`@google/genai`)** with the `gemini-2.5-flash` model (`server/services/aiService.js`).

### 1. The Prompt Engine & Structured JSON Schema
When a citizen submits a hazard report, the backend feeds the unstructured description and location into Gemini with strict schema enforcement:

```json
{
  "title": "A short 4-8 word title summarizing the hazard",
  "category": "Must be exactly one of: Roads | Sanitation | Electricity | Water | Safety",
  "urgency": "Must be exactly one of: Low | Medium | High | Emergency",
  "aiSummary": "A concise executive briefing for municipal dispatchers describing severity and immediate field action"
}
```

### 2. Severity Classification Matrix

| Urgency Level | Criteria Evaluated by Gemini | Example Scenarios |
| :--- | :--- | :--- |
| **🚨 Emergency** | Imminent life-safety threat, live electricity, active gas leak, catastrophic infrastructure failure | *"Transformer sparking and smoking near elementary school fence"*, *"Major water main rupture flooding highway lanes"* |
| **🟠 High** | Confirmed property damage, high-speed transit hazard, major public obstruction | *"2-foot pothole blowing out tires on expressway exit"*, *"Broken storm drain grate open on bike lane"* |
| **🟡 Medium** | Significant municipal code violation, blocked pedestrian pathway, sanitation issue | *"Commercial trash dumpster overflowing for 2 weeks"*, *"Fallen tree branch blocking sidewalk"* |
| **🟢 Low** | Cosmetic defect, routine illumination failure, minor maintenance | *"Streetlight fixture flickering or dark at night"*, *"Faded crosswalk paint"* |

### 3. Failsafe Architecture (Zero-Downtime Guarantee)
If an API key is missing or an external rate-limit occurs during a live hackathon demo, the system automatically falls back to an internal heuristic triage engine. **Your demo will never crash or return a 500 error.**

---

## ⚡ Core Features

### 🏘️ 1. Dedicated Citizen Portal
- **Fast 15-Second Reporting:** Clean modal with auto-expanding text, GPS geolocation (`navigator.geolocation`), and real image upload with desktop sample presets.
- **Community Feed:** Public neighborhood stream preventing duplicate city reports.
- **"My Reports" Tab:** Instantly isolates only the tickets reported by the logged-in citizen.
- **Toggleable Upvote / Echo:** Citizens confirm nearby hazards without duplicate tickets.
- **🔥 Dynamic Community Escalation:** 
  - When an issue reaches **5+ community echoes**, it automatically promotes to **High Priority**.
  - When an issue reaches **10+ community echoes**, it promotes to **Emergency Priority** with a prominent community badge.
- **3-Stage Visual Status Tracker:** Real-time visibility into `1. Logged` $\rightarrow$ `2. Crew Dispatched` $\rightarrow$ `3. Resolved`.

### 🏛️ 2. City Hall Command Center (Admin Dispatch)
- **4 Real-Time KPI Cards:** Total Reports, Critical Hazards, Pending Queue, and Resolution Rate %.
- **3-Column Operational Kanban Board:**
  - `1. Triage & Queue` (Reported & classified by AI)
  - `2. Field Crew Dispatched` (Under active municipal repair)
  - `3. Verified & Closed` (Resolved with timestamp)
- **Quick Workflow Actions:** One-click transitions (`Dispatch Crew` $\rightarrow$ `Mark Resolved` $\rightarrow$ `Reopen`).
- **Internal AI Dispatch Briefing:** Displays actionable instructions for dispatch field teams.
- **🌱 One-Click "Seed Demo Data" Button:** Reset database with 8 realistic incident records for live presentations.

### 🔐 3. Production Role-Based Access Control (RBAC)
- Strict separation between **Citizen** and **Admin** environments (no casual toggle switches).
- Passwords cryptographically hashed using Node.js native `PBKDF2-SHA512` with unique salts.
- Authenticated state managed via signed JWT-style tokens stored in `localStorage`.
- **⚡ Quick Sample Logins:** One-click demo logins for both roles directly on the auth page.

### 🗺️ 4. Real-Time OpenStreetMap GIS Mapping (Zero API Key)
- Integrated **Leaflet.js & OpenStreetMap** (100% free, zero API key, no credit card required).
- **Auto-GPS Geolocation:** Automatically detects and flies the map camera to the citizen's real coordinates.
- **Global City Quick-Switcher:** One-click fly-through across major cities (*New Delhi, Mumbai, Bengaluru, New York, London, San Francisco*).
- **Adaptive Dark / Light Tiles:** Automatically serves **CARTO Dark Matter** tiles in dark mode and **OpenStreetMap Standard** in light mode.
- **Pulsing Emergency Blips & Rich Popups:** Emergency hazard markers pulse with glowing rings. Clicking any pin displays a rich preview popup with photo, status, and department.

### 🌙 5. Dark Mode & Audio Feedback (Hackathon Polish)
- Full Dark / Light theme toggle with persistent storage in `localStorage`.
- **Web Audio API Chimes:** Native browser synthesizer (zero external MP3 assets) playing celebratory major triad arpeggios when tickets are resolved and siren frequencies on emergency logs.
- Animated slide-in Toast notification system.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide React, Axios, Web Audio API |
| **GIS & Mapping** | Leaflet.js 1.9.4, OpenStreetMap, CARTO Dark Matter (Zero API Key) |
| **Backend** | Node.js, Express 5, Mongoose 9, MongoDB Atlas, Node Crypto (PBKDF2) |
| **AI Engine** | Google Gen AI SDK (`@google/genai`), Gemini 2.5 Flash |
| **Architecture** | Monorepo structure (`client/` and `server/`), REST API, Contract-Driven |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v20 or higher recommended)
- MongoDB instance (Local or free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)
- Google Gemini API Key (Get a free key from [Google AI Studio](https://aistudio.google.com/apikey))

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in `server/` (or copy from `.env.example`):
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/civicpulse
GEMINI_API_KEY=your_gemini_api_key_here
```

Seed the database with 8 realistic demo incidents and demo accounts:
```bash
npm run seed
```

Start the backend server (with auto-reload):
```bash
npm run dev
# Server running on http://localhost:5000
```

---

### 3. Frontend Setup

In a new terminal window:
```bash
cd client
npm install
npm run dev
# App running on http://localhost:5173
```

---

## 🔑 Pre-Configured Demo Credentials

For quick evaluation without manual sign-up, use the one-click demo buttons on the login page or these credentials:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **🏘️ Citizen** | `citizen@civicpulse.org` | `citizen123` | Citizen Community Portal & Hazard Reporting |
| **🏛️ Admin** | `admin@cityhall.gov` | `admin123` | City Hall Kanban Command Center & Dispatch |

---

## 📡 API Contract Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new citizen or municipal staff |
| `POST` | `/api/auth/login` | Authenticate user and receive JWT bearer token |
| `POST` | `/api/issues/triage` | Preview Gemini AI classification on description |
| `POST` | `/api/issues` | Create and save issue (auto-triages with Gemini) |
| `GET` | `/api/issues` | Fetch all issues with dashboard stats and filter queries |
| `PATCH`| `/api/issues/:id/status`| Advance issue stage (`Reported` $\rightarrow$ `In Progress` $\rightarrow$ `Resolved`) |
| `POST` | `/api/issues/:id/upvote`| Toggle community echo / upvote (supports auto-escalation) |
| `POST` | `/api/issues/seed` | Reset and reload 8 sample demo records |

---

## 👥 Authors
Developed with passion for modern smart cities and civic technology.

