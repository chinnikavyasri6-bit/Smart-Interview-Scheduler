# 🧠 Smart Interview Scheduler

> 🚀 Smart Interview Scheduler automates coordination across recruiters, candidates & interviewers. 📅 Finds optimal slots using availability, calendars, working hours & time zones, with ⭐ smart slot ranking, conflict detection, rescheduling, notifications & audit tracking.

---

## 🌟 Overview

Scheduling interviews manually can be time-consuming and error-prone.

Recruiters often need to coordinate the availability of multiple candidates and interviewers, check calendars, consider different time zones, avoid scheduling conflicts, send notifications, and handle last-minute changes.

**Smart Interview Scheduler** automates this process through an intelligent scheduling workflow.

The platform allows recruiters to create interviews and automatically discover suitable interview slots by considering:

- 👤 Candidate availability
- 👥 Interviewer availability
- 📅 Existing calendar events
- ⏰ Working hours
- 🌍 Time zones
- ⏱️ Interview duration
- ⚡ Scheduling conflicts
- ⭐ Slot scoring and ranking
- 🔄 Rescheduling and cancellation
- 🔔 Notifications
- 📝 Audit tracking

---

## 🎯 Problem Statement

Traditional interview scheduling usually involves several manual steps:

```text
Recruiter
    ↓
Check Candidate Availability
    ↓
Check Interviewer Availability
    ↓
Check Calendars
    ↓
Compare Time Zones
    ↓
Check Working Hours
    ↓
Find Common Slots
    ↓
Send Invitations
    ↓
Wait for Confirmation
    ↓
Reschedule if Required
```

This process can result in:

- ❌ Scheduling conflicts
- ❌ Long coordination cycles
- ❌ Time-zone confusion
- ❌ Manual calendar checking
- ❌ Missed notifications
- ❌ Difficult rescheduling

### 💡 Our Solution

Smart Interview Scheduler brings the complete workflow into one platform.

```text
Recruiter Creates Interview
          ↓
Participants Provide Availability
          ↓
     Scheduling Engine
          ↓
   Common Availability
          ↓
    Conflict Detection
          ↓
 Working Hours Validation
          ↓
   Time Zone Validation
          ↓
      Slot Scoring
          ↓
  Ranked Recommendations
          ↓
    Recruiter Confirms
          ↓
 Calendar + Notifications
          ↓
       Interview 🎥
```

---

## ✨ Key Features

### 👨‍💼 Recruiter Portal

Recruiters can:

- ➕ Create interviews
- 👤 Select candidates
- 👥 Assign interviewers
- ⏱️ Define interview duration
- 🎯 Select interview type
- 🔎 Find the best available slots
- ⭐ View ranked slot recommendations
- ✅ Confirm interviews
- 🔄 Reschedule interviews
- ❌ Cancel interviews
- 🎥 Access meeting links
- 📊 View interview status

### 👨‍🎓 Candidate Portal

Candidates can:

- 🔐 Log in securely
- 🕐 Add their availability
- 📅 View scheduled interviews
- ⏰ View interview date and time
- 🌍 View interview timezone
- 🎥 Join confirmed interviews
- 📊 Track interview status

### 👨‍💻 Interviewer Portal

Interviewers can:

- 🔐 Log in securely
- 🕐 Set availability
- 📋 View assigned interviews
- 📅 View interview schedules
- 🎥 Join interviews
- 🔄 Refresh interview information

---

## 🧠 Intelligent Scheduling Engine

The scheduling engine is the core of the project.

It follows a multi-stage scheduling pipeline to identify suitable interview slots.

### 1️⃣ Availability Matching

The system retrieves availability for:

- Candidate
- Interviewers

It then identifies their common available periods.

```text
Candidate Availability
        +
Interviewer Availability
        ↓
Common Available Periods
```

### 2️⃣ Slot Generation

Common availability periods are divided into possible interview slots based on:

- Interview duration
- Slot interval

Example:

```text
Availability:
09:00 ───────────────────── 17:00

Interview Duration:
60 minutes

Generated Slots:
09:00 - 10:00
09:30 - 10:30
10:00 - 11:00
10:30 - 11:30
11:00 - 12:00
...
```

### 3️⃣ Conflict Detection

The scheduler checks existing calendar events.

Any generated slot that overlaps with an existing event is removed.

```text
Existing Calendar Event
10:00 ───── 11:00

Generated Slot
10:30 ───── 11:30

Result:
❌ Conflict → Slot Removed
```

### 4️⃣ Working Hours Validation

Each participant has configured working hours.

For example:

```text
Working Hours
09:00 ───────────────── 17:00
```

Slots outside the participant's working hours are rejected.

The system checks both the beginning and end of the interview.

### 5️⃣ Time Zone Handling

Participants may be located in different time zones.

The scheduler evaluates proposed slots according to each participant's timezone and working hours.

This helps prevent situations where a slot is convenient for one participant but outside another participant's working hours.

### 6️⃣ Slot Scoring

Every valid slot receives a score based on scheduling factors such as:

- 👤 Candidate preference
- 👥 Participant availability
- ⏰ Working hours
- 🌍 Timezone comfort
- ⚖️ Workload balance
- 🏢 Operational fit

### 7️⃣ Slot Ranking

Valid slots are ranked according to their calculated scores.

```text
⭐ Recommended Slots

1. 09:00 - 10:00    Score: 60
2. 09:30 - 10:30    Score: 60
3. 10:00 - 11:00    Score: 60
4. 10:30 - 11:30    Score: 60
```

The recruiter can then choose the most suitable slot.

---

## 🔄 Interview Lifecycle

Interviews move through different stages:

```text
Draft
  ↓
Scheduling
  ↓
Proposed
  ↓
Confirmed
  ↓
Completed
```

### Rescheduling Flow

```text
Confirmed
    ↓
Rescheduling
    ↓
Confirmed
```

### Cancellation Flow

```text
Confirmed
    ↓
Cancelled
```

---

## 🔐 Authentication & Authorization

The application uses secure authentication and role-based authorization.

### Authentication Flow

```text
User
 ↓
Register / Login
 ↓
Password Verification
 ↓
Authentication Token
 ↓
Protected API Request
 ↓
Authentication Middleware
 ↓
Role Authorization
 ↓
Protected Resource
```

### Supported Roles

| Role | Responsibilities |
| --- | --- |
| 👨‍💼 Recruiter | Create, schedule, confirm, reschedule and cancel interviews |
| 👨‍🎓 Candidate | Manage availability and view assigned interviews |
| 👨‍💻 Interviewer | Manage availability and view assigned interviews |

Passwords are securely hashed using `bcryptjs`.

---

## 📅 Complete Scheduling Workflow

```text
                    Recruiter
                       │
                       ▼
              Create Interview
                       │
                       ▼
          Select Candidate + Interviewers
                       │
                       ▼
             Define Duration & Type
                       │
                       ▼
              Scheduling Engine
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
     Availability   Calendar     Time Zones
          │            │            │
          └────────────┼────────────┘
                       ▼
              Conflict Detection
                       │
                       ▼
             Working Hours Check
                       │
                       ▼
                 Slot Scoring
                       │
                       ▼
                 Slot Ranking
                       │
                       ▼
              Recommended Slots
                       │
                       ▼
                 Confirmation
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
       Calendar Events       Notifications
             │                   │
             └─────────┬─────────┘
                       ▼
                 Interview 🎥
```

---

## 🔄 Rescheduling

Recruiters can reschedule confirmed interviews.

The system:

1. Receives the new requested slot
2. Validates the interview duration
3. Checks participant conflicts
4. Removes old internal calendar events
5. Updates the selected slot
6. Creates new calendar events
7. Generates notifications
8. Records the operation in the audit log

```text
Confirmed Interview
        ↓
Reschedule Request
        ↓
Validate New Slot
        ↓
Check Conflicts
        ↓
Update Interview
        ↓
Update Calendar Events
        ↓
Send Notification
        ↓
Audit Log
        ↓
Confirmed Interview
```

---

## ❌ Cancellation

When an interview is cancelled:

- Interview status is updated
- Associated internal calendar events are cancelled
- Participants receive notifications
- The cancellation is recorded in the audit log

```text
Confirmed Interview
        ↓
Cancellation Request
        ↓
Update Status
        ↓
Cancel Calendar Events
        ↓
Send Notifications
        ↓
Create Audit Log
```

---

## 🔔 Notifications

The notification service supports important interview events such as:

- 📩 Interview invitations
- 🔔 Interview reminders
- ✅ Interview confirmations
- 🔄 Rescheduling notifications
- ❌ Cancellation notifications

The notification architecture can be extended with external email providers.

---

## 📝 Audit Logging

Important scheduling operations are recorded through an audit trail.

Examples include:

```text
interview_created
availability_added
availability_updated
slot_generated
slot_proposed
slot_confirmed
interview_rescheduled
interview_cancelled
calendar_event_created
notification_sent
```

This provides traceability for important scheduling operations.

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      React Client    │
                    │       Vercel         │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   Node.js + Express  │
                    │       Render         │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌─────────────┐  ┌─────────────┐  ┌──────────────┐
       │    Auth     │  │ Scheduling  │  │ Notifications│
       │   Service   │  │   Engine    │  │   & Audit    │
       └─────────────┘  └──────┬──────┘  └──────────────┘
                               │
                               ▼
                       ┌───────────────┐
                       │ MongoDB Atlas │
                       │   Database    │
                       └───────────────┘
```

---

## 📂 Project Structure

```text
Smart-Interview-Scheduler/
│
├── 📁 client/
│   ├── 📁 src/
│   │   ├── 📁 pages/
│   │   │   ├── RecruiterDashboard.jsx
│   │   │   ├── CreateInterview.jsx
│   │   │   ├── CandidateDashboard.jsx
│   │   │   ├── InterviewerDashboard.jsx
│   │   │   ├── Availability.jsx
│   │   │   └── ProposedSlots.jsx
│   │   │
│   │   ├── 📁 services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   │
│   └── package.json
│
├── 📁 server/
│   ├── 📁 src/
│   │   ├── 📁 config/
│   │   │   └── database.js
│   │   │
│   │   ├── 📁 controllers/
│   │   │   ├── authController.js
│   │   │   ├── interviewController.js
│   │   │   └── ...
│   │   │
│   │   ├── 📁 middlewares/
│   │   │   ├── authMiddleware.js
│   │   │   └── validate.js
│   │   │
│   │   ├── 📁 models/
│   │   │   ├── User.js
│   │   │   ├── Interview.js
│   │   │   ├── Availability.js
│   │   │   ├── CalendarEvent.js
│   │   │   ├── Notification.js
│   │   │   └── AuditLog.js
│   │   │
│   │   ├── 📁 routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── interviewRoutes.js
│   │   │   └── availabilityRoutes.js
│   │   │
│   │   ├── 📁 services/
│   │   │   ├── availabilityService.js
│   │   │   ├── schedulingService.js
│   │   │   ├── confirmationService.js
│   │   │   ├── calendarService.js
│   │   │   ├── notificationService.js
│   │   │   ├── auditService.js
│   │   │   └── rescheduleService.js
│   │   │
│   │   ├── 📁 validators/
│   │   │   ├── authValidator.js
│   │   │   ├── interviewValidator.js
│   │   │   └── availabilityValidator.js
│   │   │
│   │   └── server.js
│   │
│   └── .env.example
│
├── 📁 scheduler/
│   ├── conflictDetector.js
│   ├── slotGeneration.js
│   ├── slotRanker.js
│   ├── timeZone.js
│   └── workingHours.js
│
├── 📁 docs/
│
├── .gitignore
├── package.json
└── README.md
```

---

## 🛠️ Tech Stack

### 🎨 Frontend

- ⚛️ React
- ⚡ Vite
- 🎨 CSS
- 🌐 Fetch API
- 💾 Browser Local Storage

### ⚙️ Backend

- 🟢 Node.js
- 🚂 Express.js
- 🔐 JSON Web Tokens
- 🔒 bcryptjs
- ✅ Zod

### 🍃 Database

- MongoDB
- MongoDB Atlas
- Mongoose

### 🧠 Scheduling Engine

- Custom scheduling algorithms
- `date-fns`
- `date-fns-tz`
- Availability matching
- Slot generation
- Conflict detection
- Working-hour validation
- Time-zone handling
- Slot scoring
- Slot ranking

### ☁️ Deployment

- ▲ Vercel — Frontend
- 🚀 Render — Backend
- 🍃 MongoDB Atlas — Database

---

## 🔌 API Endpoints

### 🔐 Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

### 👤 Users

```http
GET /api/users
```

### 🕐 Availability

```http
POST /api/availability
GET  /api/availability/common
GET  /api/availability/user/:userId
```

### 📅 Interviews

```http
POST /api/interviews
GET  /api/interviews
GET  /api/interviews/:id

POST /api/interviews/:id/schedule
GET  /api/interviews/:id/slots

POST /api/interviews/:id/confirm
POST /api/interviews/:id/reschedule
POST /api/interviews/:id/cancel
```

---

## ⚙️ Local Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/chinnikavyasri6-bit/Smart-Interview-Scheduler.git
cd Smart-Interview-Scheduler
```

### 2️⃣ Install Backend Dependencies

From the project root:

```bash
npm install
```

### 3️⃣ Install Frontend Dependencies

```bash
cd client
npm install
cd ..
```

### 4️⃣ Configure Environment Variables

Create:

```text
server/.env
```

Add:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

⚠️ **Never commit `.env` files or database credentials to GitHub.**

The repository contains `.env.example` as a template.

### 5️⃣ Start the Backend

From the project root:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### Health Check

```text
http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "service": "smart-interview-scheduler-api",
  "status": "healthy"
}
```

### 6️⃣ Start the Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

## 🌐 Deployment

The application is deployed as a full-stack system:

```text
┌─────────────────────┐
│       Vercel        │
│    React Frontend   │
└─────────┬───────────┘
          │
          │ HTTPS
          ▼
┌─────────────────────┐
│       Render        │
│  Node.js + Express  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│    MongoDB Atlas    │
│      Database       │
└─────────────────────┘
```

### Frontend

The React frontend is deployed using Vercel.

Vercel configuration:

```text
Root Directory: client
Build Command: npm run build
Output Directory: dist
```

### Backend

The Node.js + Express backend is deployed using Render.

The backend uses environment variables for database credentials and application secrets.

### Database

MongoDB Atlas provides the cloud database used by the backend.

---

## 📸 Application Workflow

The application provides separate experiences for each role.

```text
                    Smart Interview Scheduler
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
         Recruiter         Candidate       Interviewer
             │                │                │
             ▼                ▼                ▼
      Create Interview    Set Availability  Set Availability
             │                │                │
             └────────────────┼────────────────┘
                              ▼
                    Scheduling Engine
                              │
                              ▼
                    Recommended Slots
                              │
                              ▼
                         Confirmation
                              │
                  ┌───────────┴───────────┐
                  ▼                       ▼
            Calendar Events         Notifications
                  │                       │
                  └───────────┬───────────┘
                              ▼
                         Interview 🎥
```

---

## 🔮 Future Enhancements

The current architecture can be extended with:

- 📆 Google Calendar OAuth integration
- 🎥 Google Meet integration
- 💻 Microsoft Teams integration
- 📧 Resend email integration
- 🤖 AI-powered scheduling recommendations
- 🧠 Candidate preference learning
- 📊 Advanced recruiter analytics
- 🔔 Automated interview reminders
- 🔄 Automatic rescheduling when participants decline
- 📱 Enhanced mobile responsiveness
- 🧪 Automated unit and integration testing
- 📈 Scheduling performance analytics

---

## 🧩 Key Design Principles

### ⚡ Automation

Reduce manual coordination between recruiters, candidates, and interviewers.

### 🧠 Intelligent Scheduling

Treat scheduling as a multi-constraint optimization problem rather than a simple calendar form.

### 🔐 Secure Access

Protect application resources through authentication and role-based authorization.

### 🌍 Time-Zone Awareness

Ensure proposed interview times respect participant time zones and working hours.

### 📋 Traceability

Maintain audit logs for important scheduling operations.

### 🔄 Flexible Lifecycle

Support confirmation, rescheduling, cancellation, and completion workflows.

---

## 🧠 Why Smart Interview Scheduler?

Instead of treating interview scheduling as a simple appointment-booking system, this project treats scheduling as a **multi-constraint optimization problem**.

The scheduler considers:

```text
Candidate Availability
          +
Interviewer Availability
          +
Calendar Conflicts
          +
Working Hours
          +
Time Zones
          +
Interview Duration
          +
Scheduling Preferences
          ↓
   Valid Interview Slots
          ↓
     Slot Scoring
          ↓
   Ranked Recommendations
```

This allows the system to identify suitable interview slots while reducing manual coordination and scheduling conflicts.

---

## 🚀 Core Workflow

```text
                SMART INTERVIEW SCHEDULER
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
    Recruiter        Candidate       Interviewer
        │                │                │
        │                │                │
        └──────────────┬─┴────────────────┘
                       │
                       ▼
              Availability Collection
                       │
                       ▼
              Common Slot Detection
                       │
                       ▼
               Conflict Detection
                       │
                       ▼
              Working Hours Check
                       │
                       ▼
               Time Zone Handling
                       │
                       ▼
                 Slot Scoring
                       │
                       ▼
                 Slot Ranking
                       │
                       ▼
                 Confirmation
                       │
              ┌────────┴────────┐
              ▼                 ▼
        Calendar Events    Notifications
              │                 │
              └────────┬────────┘
                       ▼
                 Interview 🎥
```

---

## 👥 User Roles

| Role | Main Responsibilities |
| --- | --- |
| 👨‍💼 Recruiter | Creates and manages the interview scheduling workflow |
| 👨‍🎓 Candidate | Provides availability and attends scheduled interviews |
| 👨‍💻 Interviewer | Provides availability and participates in assigned interviews |

---

## 🤝 Contributing

Contributions are welcome! 🎉

### 1️⃣ Fork the repository

### 2️⃣ Create a feature branch

```bash
git checkout -b feature/your-feature
```

### 3️⃣ Make your changes

### 4️⃣ Commit your changes

```bash
git commit -m "feat: add your feature"
```

### 5️⃣ Push your branch

```bash
git push origin feature/your-feature
```

### 6️⃣ Open a Pull Request 🚀

---

## 📄 License

This project is licensed under the MIT License.

---

## 💙 Built With

Built with ❤️ by the **Smart Interview Scheduler Team**.

> **Making interview scheduling smarter, faster, and conflict-free. 🚀📅✨**
