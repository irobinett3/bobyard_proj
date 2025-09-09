# bobyard_proj
# Bobyard Fullstack Challenge

## Quick Start

Requirements

Python 3.11.x

Node.js 18.x LTS and npm 9+

PostgreSQL 14+

macOS/Windows/Linux

### Clone the repo
```bash
git clone https://github.com/irobinett3/bobyard_proj.git
cd bobyard_proj
```

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_comments --file seed/comments.json   # optional, adds data from comments.json
python manage.py runserver
```
Runs at: http://localhost:8000/api/

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open: http://localhost:5173

---
Features: list, add, edit, delete comments (as Admin) with text, author, date, likes, and images.
