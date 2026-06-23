# Deutsch Lernen 🇩🇪

A full-stack web application to help users practice and improve their German skills through interactive exercises in reading, writing, and vocabulary.

---

## 🚀 Features

- 📖 **Reading Practice (A1–B2)**  
  AI-generated German reading texts with comprehension questions

- ✍️ **Writing Practice**  
  AI-powered writing correction with grammar feedback and scoring

- 📚 **Vocabulary Practice**  
  Generate example sentences using selected German words

- 📊 **Progress Tracking**  
  Track user activity and learning progress over time

---

## 🏗️ Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- Hugging Face Inference API
- dotenv

### Frontend
- HTML
- CSS
- Vanilla JavaScript

---

## 📁 Project Structure

backend/
├── controllers/
├── routes/
├── services/
├── db/
├── app.js
├── server.js

frontend/
├── reading/
├── writing/
├── vocabulary/
├── dashboard/
├── index.html

---

## ⚙️ Installation

1. Clone the repository
```bash
git clone https://github.com/Elisa-Beltramone/Deutsch-Lernen.git
cd deutsch-lernen

2. Install backend dependencies
cd backend
npm install

3. Create environment variables

Create a .env file inside the /backend folder:
PORT=3000

DATABASE_URL=postgresql://user:password@localhost:5432/name

DB_USER=user
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=name

HF_TOKEN=token

4. Start PostgreSQL

Make sure PostgreSQL is running and the database exists:
CREATE DATABASE name;
CREATE USER user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE name TO user;

5. Start the backend server
node server.js

6. Open the application
http://localhost:3000

