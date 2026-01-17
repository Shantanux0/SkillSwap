# SkillSwap Backend API 🛠️

## 🌟 Introduction
Welcome to the **SkillSwap Backend**! This is a robust Java Spring Boot application that powers the SkillSwap platform. As a Frontend Developer, you will interact with this API to build the user interface.

## 🚀 Getting Started

### Prerequisites
*   Java Development Kit (JDK) 17 or higher
*   Maven (wrapper included)

### Running the Server
pOpen your terminal in this directory and run:

```bash
./mvnw spring-boot:run
```

The server will start on **port 8080**.
*   **Base URL**: `http://localhost:8080`
*   **Health Check**: *Try hitting* `http://localhost:8080/api/profile` *(will return 403 Forbidden without token)*

---

## 📚 API Documentation (Crucial!)
We have created a **Master Postman Documentation** file for you.
👉 **[postman_documentation.md](./postman_documentation.md)**

**Recommendation:** Import this structure into Postman to test endpoints immediately. It contains pre-configured requests for every feature below.

---

## 🧩 Modules Breakdown

The backend is organized into "Packages" (P1, P2, etc.) representing feature sets:

### **P1: Authentication (`/register`, `/login`)**
*   **What it does**: Handles user signup and login.
*   **Security**: Uses JWT (JSON Web Tokens). You must attach the token as `Authorization: Bearer <token>` header for all other requests.

### **P2: User Profile (`/api/profile`)**
*   **What it does**: Manages basic user info (Bio, Location) and **Skills**.
*   **Key Concept**: "Skills to Learn" vs. "Skills to Teach".
*   **Skill Proficiency**: Users rate themselves (Beginner -> Expert).

### **P3: Resume Portal (`/api/resume/...`)**
*   **What it does**: Allows users to build a professional portfolio to build trust.
*   **Sub-features**:
    *   **Certifications**: Upload proofs of courses.
    *   **Education**: Add degrees/schools.
    *   **Experience**: Add job history.
    *   **Coding Stats**: Link LeetCode/GitHub profiles.

### **P4: Test Portal (`/api/test/...`)**
*   **What it does**: Validates if a user *actually* knows what they claim to teach.
*   **Rule**: Users **MUST** pass a test for a skill before they are allowed to teach it.

### **P5: Skill Match Algorithm (`/api/matches/swap`)**
*   **What it does**: The brain of the app. It finds "Swap Partners" (e.g., Alice needs Java, Bob needs React).
*   **Scoring**: It calculates a `matchScore` (0.0 - 1.0) based on:
    *   Skill Gap (Beginner vs Expert)
    *   Test Scores (Verified skill)
    *   Availability Overlap
    *   Learning Style Compatibility

### **P7: Session Management (`/api/sessions/...`)**
*   **What it does**: Handles the actual meeting requests.
*   **Flow**: Request Session -> Partner Accepts -> Session Scheduled -> Completed.

---

## ⚡ Recommended Frontend Flow

To build the UI, follow this user journey:

1.  **Onboarding**:
    *   Call `POST /register` -> `POST /login`.
    *   Store the received `token`.

2.  **Profile Building** (The "Resume" Phase):
    *   Call `POST /api/profile` to set Bio/Location.
    *   Call `POST /api/resume/experience`, `/education`, etc. to flesh out the profile.

3.  **Skill Setup**:
    *   User selects a skill to **Teach** (e.g., "Java").
    *   **Backend Check**: If they haven't passed the Java verification test, prompt them to "Take Test".
    *   Call `POST /api/test/generate` -> `POST /api/test/submit`.
    *   Once passed, call `POST /api/profile/skills` to list it as a Teaching Skill.

4.  **Finding Links**:
    *   User selects a skill to **Learn** (e.g., "React").
    *   Call `GET /api/profile/matches?skillToLearn=React&skillToTeach=Java`.
    *   Display the results card-style.

5.  **Connect**:
    *   Click "Request Session" on a match (`POST /api/sessions/request`).

---

## 🤝 Need Help?
Check `postman_documentation.md` for the exact JSON payloads required for every request above.
