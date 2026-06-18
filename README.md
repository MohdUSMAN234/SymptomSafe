# 🩺 SymptomSafe

A free, no-login symptom checker designed for Tier-2 and Tier-3 India that helps users understand the seriousness of their symptoms and find nearby government hospitals when medical attention is required.

## 🚀 Problem Statement

Many people search symptoms online and receive overwhelming or confusing information. This often leads to:

* Unnecessary panic
* Delayed medical attention
* Difficulty identifying nearby healthcare facilities

SymptomSafe provides a simple and actionable response:

✅ Monitor at Home
⚠️ See a Doctor
🚨 Emergency Care Required

along with nearby government hospital recommendations.

---

## ✨ Features

### Symptom Assessment

* Enter symptoms in simple language
* Supports English and Hinglish keywords
* Rule-based medical assessment engine
* Provides severity classification

### Severity Levels

* **Monitor** – Mild symptoms, self-care suggested
* **See Doctor** – Medical consultation recommended
* **Emergency** – Immediate medical attention required

### Hospital Finder

* Search nearby government hospitals
* City and pincode-based lookup
* Emergency contact guidance

### History Tracking

* Stores symptom assessments
* Session-based history without requiring login
* Privacy-friendly approach

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Axios
* CSS / Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Tools

* Git
* GitHub
* Postman

---

## 📂 Project Structure

```text
symptomsafe/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── data/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│
└── README.md
```

---

## ⚙️ System Architecture

```text
User
 │
 ▼
React Frontend
 │
 ▼
Express API
 │
 ▼
Symptom Engine
 │
 ├── Severity Analysis
 │
 └── Hospital Recommendation
 │
 ▼
MongoDB Database
 │
 ▼
Response to User
```

---

## 🧠 Symptom Assessment Workflow

```text
User enters symptoms
           │
           ▼
Keyword Parsing
           │
           ▼
Rule Matching Engine
           │
           ▼
Severity Calculation
           │
           ▼
Monitor / See Doctor / Emergency
           │
           ▼
Nearest Hospital Recommendation
```

---

## 🗄️ Database Design

### SymptomCheck Collection

```json
{
  "_id": "123",
  "symptoms": ["fever", "headache"],
  "severity": "see_doctor",
  "message": "Consult a doctor",
  "city": "Prayagraj",
  "createdAt": "2026-06-18"
}
```

### Hospital Collection

```json
{
  "_id": "456",
  "name": "Government Medical College",
  "city": "Prayagraj",
  "state": "Uttar Pradesh",
  "phone": "XXXXXXXXXX"
}
```

---

## 🔌 API Endpoints

### Symptoms

#### Get Available Symptoms

```http
GET /api/symptoms/list
```

#### Check Symptoms

```http
POST /api/symptoms/check
```

Request:

```json
{
  "symptoms": ["fever", "body_ache"],
  "city": "Prayagraj"
}
```

Response:

```json
{
  "severity": "see_doctor",
  "message": "Consult a doctor within 24 hours"
}
```

---

### Hospitals

#### Search Hospitals

```http
GET /api/hospitals?city=Prayagraj
```

---

## 🔒 Security Considerations

* Environment variables stored in `.env`
* Sensitive credentials excluded using `.gitignore`
* Input validation before database operations
* Error handling middleware implemented
* No personal medical information required

---

## 📈 Future Improvements

* AI-assisted symptom analysis
* Multi-language support
* Live government hospital APIs
* Doctor appointment booking
* GPS-based hospital recommendations
* Emergency SOS integration

---

## 💡 Why Rule-Based Instead of AI?

For healthcare-related recommendations, explainability and consistency are critical.

Benefits:

* Predictable results
* No hallucinations
* Easy debugging
* Transparent decision making
* Faster response time

---

## ▶️ Installation

### Backend

```bash
cd backend
npm install
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## 👨‍💻 Author

**Mohd Usman**

B.Tech Information Technology
Pranveer Singh Institute of Technology (PSIT), Kanpur

GitHub: https://github.com/MohdUSMAN234

---

## 📜 Disclaimer

SymptomSafe is an educational and demonstration project. It is not intended to replace professional medical advice, diagnosis, or treatment. Users should consult qualified healthcare professionals for medical concerns.
