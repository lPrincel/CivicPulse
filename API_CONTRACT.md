# 📜 CivicPulse — Official API Contract (DO NOT MODIFY WITHOUT TEAM CONSENT)

This document is the single source of truth between Frontend (Person A) and Backend (Person B).
Both teammates must feed this schema to their AI prompts.

---

## 🌐 Base URL
- **Local Dev:** `http://localhost:5000`
- **Endpoints Root:** `http://localhost:5000/api/issues`

---

## 📦 Data Schema: `Issue` Object

```typescript
interface Issue {
  _id: string;               // MongoDB generated ID
  title: string;             // Short 4-8 word title (e.g. "Transformer Sparking")
  description: string;       // Citizen report text
  category: "Roads" | "Sanitation" | "Electricity" | "Water" | "Safety";
  urgency: "Low" | "Medium" | "High" | "Emergency";
  location: string;          // Human-readable location/address
  status: "Reported" | "In Progress" | "Resolved";
  aiSummary: string;         // Executive AI triage summary
  createdAt: string;         // ISO date string
  updatedAt: string;         // ISO date string
}
```

---

## 📡 API Endpoints

### 1. AI Triage Preview
- **Method:** `POST`
- **Path:** `/api/issues/triage`
- **Request Body:**
  ```json
  {
    "description": "Exposed high voltage wire sparking in the rain",
    "location": "Corner of 5th and Main"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "title": "Exposed High-Voltage Wire Sparking",
      "category": "Electricity",
      "urgency": "Emergency",
      "aiSummary": "Critical electrical hazard. Dispatch isolation team immediately."
    }
  }
  ```

---

### 2. Save New Issue
- **Method:** `POST`
- **Path:** `/api/issues`
- **Request Body:**
  ```json
  {
    "title": "Exposed High-Voltage Wire Sparking",
    "description": "Exposed high voltage wire sparking in the rain",
    "category": "Electricity",
    "urgency": "Emergency",
    "location": "Corner of 5th and Main",
    "aiSummary": "Critical electrical hazard. Dispatch isolation team immediately."
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "data": { /* Complete saved Issue object with _id and createdAt */ }
  }
  ```

---

### 3. Fetch All Issues & Live Dashboard Stats
- **Method:** `GET`
- **Path:** `/api/issues`
- **Optional Query Params:** `?status=Reported&category=Roads&urgency=Emergency`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 8,
    "stats": {
      "total": 8,
      "urgent": 3,
      "resolved": 1,
      "reported": 4
    },
    "data": [
      /* Array of Issue objects */
    ]
  }
  ```

---

### 4. Update Status (Kanban / Admin Action)
- **Method:** `PATCH`
- **Path:** `/api/issues/:id/status`
- **Request Body:**
  ```json
  {
    "status": "In Progress" // or "Resolved" or "Reported"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": { /* Updated Issue object */ }
  }
  ```

