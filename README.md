# BeyondChats Article Scraper & Dashboard

A full-stack internship assignment that scrapes blog articles from BeyondChats, stores them in a MySQL database via a Node.js scraper, exposes the data through a backend API, and visualizes it using a React dashboard.

---

## 🚀 Features

- Scrapes **BeyondChats blog articles** using Puppeteer (JS-rendered pages)
- Extracts and stores:
  - Article Title
  - Main Content
  - Source URL
  - Created Timestamp
- Saves data into **MySQL (`beyond_db`)**
- Backend API built using **Node.js / Express / Axios / Cheerio**
- React dashboard UI:
  - Live MySQL data
  - Search filter
  - Stats overview cards
  - Responsive table view

---

## 🏗️ Architecture

```
Scraper (Node.js + Puppeteer)
        ↓
  MySQL Database (beyond_db)
        ↓
 Backend API (Express / Flask)
        ↓
  React Dashboard (Frontend UI)
```

---

## 🛠️ Tech Stack

| Component | Technology |
|---------|------------|
| Scraper | Node.js, Puppeteer, Axios, Cheerio |
| Database | MySQL (articles table) |
| Backend API | Express or Flask (localhost:5000) |
| Frontend | React, Axios, CSS |

---

## 📦 Database Schema

```sql
CREATE DATABASE beyond_db;
USE beyond_db;

CREATE TABLE articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  content TEXT,
  source_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository
```bash
git clone <your-repo-url>
cd BeyondChats-Article-Scraper
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure Environment Variables  
Create a `.env` file inside `backend/` and `scraper/` (DO NOT push to GitHub):

```
OPENAI_API_KEY=your_openai_key_here
SERP_API_KEY=your_serpapi_key_here
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=beyond_db
```

### 4️⃣ Run the Scraper (Phase 1 Insert Only)
```bash
node scraper/scrape.js
```

### 5️⃣ Start Backend API Server
```bash
node backend/server.js  # or python app.py if Flask
```

### 6️⃣ Start React Dashboard
```bash
cd frontend
npm start
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/articles` | Fetch all stored articles |
| PUT | `/articles/:id` | Update rewritten article |
| DELETE | `/articles/:id` | Delete article |

---

## 🔐 Important Notes

- `.env` files must be added to `.gitignore` to avoid secret leaks
- Use **clean Git history** before pushing if secrets were committed earlier
- Force pushing without cleaning secrets will be rejected by GitHub

---

## 👨‍💻 Author

**Vignesh V**  
Aspiring Software Engineer | B.E Computer Science (2021–2025)

---

## ⭐ Acknowledgment

Thanks to **BeyondChats** and **Pantech Solutions Pvt. Ltd.** for providing the opportunity to build this assignment.
