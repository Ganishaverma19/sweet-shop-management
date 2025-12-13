
# 🍬 Sweet Shop Management System

A full-stack Sweet Shop Management System built as part of a TDD Kata assignment.  
The application allows users to browse, search, and purchase sweets, while admin users can manage inventory through a secure dashboard.

---

## 🚀 Features

### 👤 Authentication
- User registration and login
- JWT-based authentication
- Role-based access (Admin / User)

### 🍭 Sweet Management
- View all sweets
- Search sweets by name
- Purchase sweets (quantity decreases automatically)
- Admin-only:
  - Add new sweets
  - Edit sweet details
  - Delete sweets
  - Restock inventory

### 📱 Responsive UI
- Desktop: Table-based dashboard
- Mobile: Card-based vertical layout
- Smooth animations using GSAP

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- TypeScript
- CSS (custom responsive styling)
- GSAP (animations)

### Backend
- Node.js + Express
- JWT Authentication
- Database: (MySQL / MongoDB)
- RESTful API architecture

---

## 📦 API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Sweets (Protected)
- `GET /api/sweets`
- `GET /api/sweets/search?name=`
- `POST /api/sweets` (Admin)
- `PUT /api/sweets/:id` (Admin)
- `DELETE /api/sweets/:id` (Admin)

### Inventory
- `POST /api/sweets/:id/purchase`
- `POST /api/sweets/:id/restock` (Admin)

---

## ▶️ Running the Project Locally

### Frontend
```bash
npm install
npm run dev





##  My AI Usage

### AI Tools Used
- ChatGPT (OpenAI)

### How I Used AI
I used AI as a development assistant during this project, primarily for:
- Debugging React and TypeScript issues when facing runtime or type errors
- Refactoring large components into cleaner, more maintainable structures
- Improving responsiveness and UI behavior across mobile and desktop views
- Clarifying best practices for REST API design, authentication flow, and deployment steps

AI was mainly used to **suggest approaches or alternatives**.  
All business logic, API integration, state management, and final UI decisions were implemented and validated by me.

### Reflection on AI Impact
Using AI significantly improved my productivity and reduced debugging time, allowing me to focus more on system design and feature completeness.  
However, I treated AI as a **support tool**, not a source of final authority.  
Every piece of AI-suggested code was reviewed, modified where necessary, and integrated manually to ensure correctness and alignment with project requirements.

This approach helped me better understand the codebase while still benefiting from modern development tools.
