## EduGuide – Full‑Stack React + Node.js (MongoDB)

EduGuide helps students discover career paths, take an aptitude quiz, find nearby colleges, and track admission/scholarship timelines.

### Stack
- Frontend: React (Vite) + React Router + Tailwind CSS
- Backend: Node.js + Express + MongoDB (Mongoose) + JWT Auth

### Quick Start

1) Backend
- Copy `backend/.env.example` to `backend/.env` and set values
- Install deps: `cd backend && npm install`
- Seed data: `npm run seed`
- Run server (dev): `npm run dev`

2) Frontend
- Install deps: `cd frontend && npm install`
- Run app: `npm run dev`

### ENV
- `MONGO_URI` – MongoDB connection string
- `JWT_SECRET` – secret for JWT
- `PORT` – backend port (default 5000)
- `CLIENT_URL` – frontend dev URL (default http://localhost:5173)

### Project Structure

```
EduGuide/
  backend/
    src/
      config/db.js
      server.js
      middleware/auth.js
      models/
        User.js
        QuizResult.js
        Career.js
        College.js
        Notification.js
      controllers/
        authController.js
        quizController.js
        recommendController.js
        collegeController.js
        timelineController.js
      routes/
        auth.js
        quiz.js
        recommend.js
        colleges.js
        timeline.js
      utils/recommendation.js
      seed/
        careers.json
        courses.json
        colleges.json
        seed.js
    package.json
    .env.example

  frontend/
    index.html
    package.json
    vite.config.js
    tailwind.config.cjs
    postcss.config.cjs
    src/
      main.jsx
      App.jsx
      styles/index.css
      api/client.js
      context/AuthContext.jsx
      hooks/useAuth.js
      components/
        Navbar.jsx
        Quiz.jsx
        CareerPaths.jsx
        Colleges.jsx
        Timeline.jsx
        Profile.jsx
        auth/Login.jsx
        auth/Register.jsx
```

### Features
- Student registration/login (JWT; password hashing)
- Aptitude quiz; store results per user
- Recommendations for streams/careers/colleges
- Nearby colleges directory (sample JSON)
- Timeline tracker for admissions/scholarships

See subfolder READMEs for usage.



