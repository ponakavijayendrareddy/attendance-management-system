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

Welcome to the **Next-Generation Attendance Management System**! 🚀

Gone are the days of archaic spreadsheets, clunky interfaces, and disjointed academic portals. This platform is meticulously engineered from the ground up to revolutionize how educational institutions and modern organizations track, monitor, and manage attendance. It isn't just a tool; it's a seamless experience designed to empower both students and faculty members alike.

### 🎯 The Vision
Our goal was simple: to construct a robust, highly scalable attendance platform that *feels* like a premium, consumer-grade application. By leveraging a state-of-the-art **Glass-Neumorphic** design system, the interface is visually striking, blending ultra-modern minimalism with deep, tactile depth and frosted glass effects. 

### 💡 Core Experience
The system acts as a central hub bridging the gap between administrators and attendees:
* **For Faculty & Instructors:** Say goodbye to manual roll calls. With intuitive dashboards, you can perform bulk updates, monitor class slot statuses (Pending, Present, Absent), and analyze attendance trends at a glance.
* **For Students & Attendees:** Access your real-time attendance records in a personalized, responsive portal. Beautiful shimmer skeletons guarantee smooth loading transitions, while our optimized backend ensures your data is fetched securely and instantaneously.

### 🛡️ Built for Performance & Integrity
Underneath the stunning UI lies a powerhouse architecture. We've decoupled the frontend and backend to guarantee maximum scalability. 
- Fast, secure role-based authorization is handled via **JWT** (JSON Web Tokens). 
- Optimistic UI updates powered by **Zustand** ensure that every interaction feels instantaneous, never keeping the user waiting. 
- Complex bulk operations like upserting attendance records are handled securely by **FastAPI** and **SQLAlchemy**.

Whether you're managing a faculty of hundreds or tracking attendance for thousands of students, the **Attendance Management System** delivers unmatched performance, uncompromising security, and an unforgettable aesthetic experience.

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
