# 🚀 FinLogix

**A Personal Finance Tracker with AI Budget Advice**

🔗 [Live Demo →](https://finlogix-three.vercel.app)

FinLogix is a full-stack personal finance management platform that empowers users to track their income and expenses, categorize spending, receive real-time updates, and get AI-generated budget tips. With features like voice memos, analytics, and an admin panel, FinLogix helps users gain insights and make smarter financial decisions.

---

## 🌟 Features

### 👤 Authentication & Profile

* JWT-based user authentication
* Register/Login with protected routes
* Edit profile and manage default budget goals

### 💸 Transaction Management

* Add/edit/delete income or expense
* Assign categories (Rent, Food, Travel, etc.)
* Filter by date range and transaction type
* Attach optional audio memos for context

### 📊 Dashboard & Charts

* Real-time balance, income, and expense updates
* Dynamic Pie and Bar charts by category
* Filter by week, month, custom range
* Export data to CSV, PNG, or PDF

### 🧠 AI Budget Suggestions

* Integrated with Gemini API for smart tips
* Detect overspending patterns
* Friendly and actionable insights (e.g.,
  *“Dining expenses exceeded 40% of your budget this week”*)

### 🎙️ Audio Memos

* Record voice notes for each transaction
* Stored and retrieved per transaction

### ⚡ Real-Time Sync

* Socket.IO-powered dashboard updates
* Instant transaction + balance reflection
* Chart refresh without page reload

### 🔧 Admin Panel

* Manage spending categories
* Promote users to admin
* View user summaries and overspenders
* Analytics: category stats, income vs expense

---

## 🧱 Tech Stack

### 🖥️ Frontend

* React + TypeScript
* Tailwind CSS for UI styling
* Chart.js and Recharts for visualization
* React Hook Form, Toastify, Framer Motion

### 🛠️ Backend

* Python + Flask
* Flask-JWT-Extended for auth
* SQLAlchemy 
* Flask-SocketIO for real-time sync
* Gemini API (Google AI) for budget analysis

### 🗄️ Database

* MySQL (hosted on Railway)

### ☁️ Deployment

* **Frontend**: Vercel – [`https://finlogix-three.vercel.app`](https://finlogix-three.vercel.app)
* **Backend**: Render  
* **Database**: Railway (MySQL)

---

## 🧪 Setup Instructions

### 📦 Prerequisites

* Node.js + npm
* Python 3.10+
* MySQL DB
* Gemini API Key (Google AI Studio)

---
Clone the git repo
### 🖥️ Frontend

```bash
cd frontend
npm install
npm run dev
```

**Environment Variables (`.env`):**
# Set .env in frontend folder
```env
VITE_API_URL=https://your-backend-url.onrender.com(replace this with your deployed url on render)
```

---

### 🐍 Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python run.py
```

**Environment Variables (`.env`):**
set .env file as below in backend folder
```env
DATABASE_URL=mysql://user:password@host/db_name
SECRET_KEY=your_secret
JWT_SECRET_KEY=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key
```

---

## 🧪 Sample Test Users

| Email                | Password   | Role  |
| -------------------- | ---------- | ----- |
| `admin@finlogix.com` | `admin123` | Admin |
| `eren@gmail.com`     | `eren123`  | User  |

---

## 📁 Project Structure

```
finlogix/
│
├── backend/
│   ├── app/           # Flask Blueprints (auth, ai, admin, transactions, audio)
│   ├── models.py
│   ├── run.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   └── vite.config.ts
```

---

## 📈 Future Enhancements

* Budget limit alerts
* Monthly email summaries
* Drag-and-drop chart filtering

---
