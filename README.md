# CognitiveForge AI — Autonomous Course Roadmap & AI Video Learning Platform

A full-stack AI-driven educational platform that enables users to learn **any course or skill from basic to advanced level** with **AI-generated roadmaps** and **synchronized AI video lessons**. The platform includes a **Host & Admin Approval Control Center** that prevents unauthorized access until the Host or Admin approves each student, and ensures only the Host can approve administrators.

---

## 🌟 Key Features & Updates

### 1. 🔐 Phone-Verified Registration & Password Recovery
- **Phone Number Field**: Required during registration to protect accounts and enable identity verification.
- **"Forgot Password?" Option**: Users who forget their password can reset it instantly by entering their **registered email** and **phone number**.
- **Clear Error Messaging**: Detailed feedback when an email is not registered yet or when a password mismatch occurs.

---

### 2. 🛡️ Role Hierarchy & Strict Gatekeeper
- **Admin Panel Visibility**: Visible **ONLY** to Admins and the Host (`host`). Regular students cannot see the Admin Panel link or any Host options.
- **Approval Permissions**:
  - **Both Admin and Host**: Can approve and manage **Students**.
  - **Host Only**: Can approve **Administrators** or promote a student to Admin. Regular admins are strictly prevented from approving or creating other admins.
- **Zero Host Options for Students**: Students never see Host badges, persona switchers, or host buttons. When awaiting approval, students see a clean status check screen with their application details.

---

### 3. 🗺️ Basic to Advanced AI Roadmap Generator
- Search **any** course or skill (e.g. *Full-Stack React & Node*, *Machine Learning*, *Cybersecurity*, *Prompt Engineering*, *3D Blender Modeling*, *Public Speaking*).
- Automatically synthesizes a structured **5-Stage Progressive Curriculum**:
  1. **Stage 1: Basic Foundations & Core Syntax (Beginner)**
  2. **Stage 2: Core Patterns & Essential Tooling (Elementary)**
  3. **Stage 3: Systems Architecture & Intermediate Engineering (Intermediate)**
  4. **Stage 4: Advanced Scalability, Hardening & Security (Advanced)**
  5. **Stage 5: Production Capstone Project & Deployment (Mastery)**

---

### 4. 🎬 AI Video Generation Engine
- Click **"Generate & Watch AI Video Lesson"** on *any* roadmap topic.
- Multi-scene dynamic canvas layout (Hook, Interactive Architecture Diagram, Dark IDE Code Walkthrough, DO vs DON'T Matrix, Recap & Challenge).
- Real-time Web Speech Synthesis voice narration with natural voices (Nova, Orion, Echo).
- Real-time karaoke-highlighted subtitles.
- Interactive quizzes, practice mission scratchpads, and full transcripts.

---

## 🚀 How to Run in VS Code

1. Open VS Code: `File` ➔ `Open Folder...` ➔ Select `D:\Learning Idea`.
2. Open the terminal (<kbd>Ctrl</kbd> + <kbd>`</kbd>).
3. Run:
   ```powershell
   npm run dev
   ```
4. Open your browser: **[http://localhost:3000](http://localhost:3000)**.

---

## 🔑 Pre-Configured Test Accounts

| Role | Email | Phone Number | Password | Status | Privileges |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **👑 Platform Host (You)** | `host@learningidea.com` | `+1 555-010-0001` | `host123` | `approved` | Supreme Admin: Approves Admins & Students |
| **👨‍🏫 Instructor Elena (Admin)** | `elena.instructor@learningidea.com` | `+1 555-010-0002` | `admin123` | `approved` | Admin: Approves Students only |
| **🎓 Alex Chen (Student)** | `alex.student@learningidea.com` | `+1 555-010-0003` | `student123` | `approved` | Approved Student: Full Learning Access |
| **⏳ Sarah Jenkins (Student)** | `sarah.jenkins@learningidea.com` | `+1 555-010-0004` | `student123` | `pending` | Pending Approval: Locked until approved |
