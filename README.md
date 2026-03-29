<div align="center">

# ✨ Attendance Management System ✨

<p align="center">
  A modern, full-stack, glass-neumorphic attendance tracking solution.
</p>

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

</div>

---

## 📖 About 

The **Attendance Management System** is a beautifully designed, premium web application tailored for educational institutions and organizations. It moves away from dull, traditional interfaces and instead embraces a state-of-the-art **Glass-Neumorphic** aesthetic, providing users with a delightful, intuitive experience. 

Built with scalability and user experience in mind, it features decoupled architecture seamlessly bridging a robust Python backend with a dynamic, reactive frontend. Whether you are a student checking your attendance record or a faculty member updating class slots, the platform ensures secure, rapid, and optimistic UI updates.

---

## 🚀 Key Features

- **🛡️ Secure Authentication**: Role-aware access control with JWT access and refresh tokens.
- **🎨 Stunning UI/UX**: Custom glass-neumorphism design using Tailwind CSS and CSS modules.
- **⚡ Optimistic Updates**: Instantaneous UI feedback using Zustand state management.
- **📊 Comprehensive Dashboards**: Dedicated, responsive portals for Students and Faculty members.
- **🗃️ Robust Data Handling**: Powered by FastAPI and SQLAlchemy ORM, ensuring robust bulk upserts and data integrity.

---

## 🏗️ Architecture

<details>
<summary><b>Backend (FastAPI)</b></summary>

```text
backend/
  app/
    auth/
    core/
    models/
    routers/
    schemas/
    services/
    main.py
  tests/
  requirements.txt
```
The backend is built with FastAPI, SQLAlchemy ORM, structured JSON error responses, SQL DB integrations, and a robust `/health` check.

</details>

<details>
<summary><b>Frontend (React + Vite)</b></summary>

```text
frontend/
  src/
    components/
    contexts/
    hooks/
    pages/
    services/
    store/
    styles/
    test/
    types/
  package.json
  tailwind.config.js
```
The frontend leverages Vite, Zustand, and React Router to provide protected routes, shimmer skeletons, and smooth interactive flows.
</details>

---

## 💎 Design System

Our frontend incorporates a custom design language located in `frontend/src/styles/glass-neumorphic.module.css`, which provides reusable primitives such as:

- `✨ cardGlass` & `heroGlass`: For floating, translucent containers.
- `🖱️ btnNeumorphic`: Soft, tactile buttons.
- `📝 inputGlass`: Clean, unobtrusive input fields.
- `🚦 slotButton`, `slotPending`, `slotPresent`, `slotAbsent`: Dynamic attendance status indicators.
- `⏳ skeletonShimmer`: Smooth loading states.

---

<div align="center">
  <i>Crafted with passion for modern web experiences.</i>
</div>
