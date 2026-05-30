# AetherFlow: Cloud-Native Inventory Management Ecosystem

AetherFlow is a high-performance digital ecosystem designed to optimize the movement, tracking, and auditing of goods for small-to-medium enterprises. By transitioning away from fragmented manual workflows, AetherFlow provides a centralized control hub where supply chain visibility, secure role-based access, automated stock alerts, and real-time inventory diagnostics converge.

---

## 👥 Team Roles & Project Responsibilities

The development of AetherFlow is driven by a structured, Agile-inspired framework with clearly defined operational roles:

* **Daniel Rhoads** | *UI/UX Specialist & Lead*
    * **Focus:** Visual architecture, design token enforcement, frontend interface engineering, and mobile cross-platform layout wrappers.
* **Nathan Nied** | *Logic Architect (Backend & Database)*
    * **Focus:** Relational SQL database schema formulation, secure API development, server-side data pools, and token-based session processing.
* **Garrett Lassalle** | *Detail-Oriented Tester (QA & Validation)*
    * **Focus:** Core functionality assurance, automated execution script testing, test runner WAF optimizations, and viewport layout verification.
* **Jesus Salas** | *Business Analyst (Documentation Lead - AWOL)*
    * **Focus:** Product backlog management, user story profiling, requirement matrix analysis, and validation compliance reports.
* **Alex Johnston** | *Scrum Master (Project Coordinator)*
    * **Focus:** Sprint velocity tracking, block mitigation, timeline coordination, and deployment workspace infrastructure.

---

## 💻 Technical Architecture & Stack

To ensure optimal speed, horizontal scalability, and multi-platform deployment capabilities, AetherFlow utilizes the following stack:

* **Frontend Environment:** React.js initialized via the Node.js/Vite build system utilizing client-side route tracking via React Router (`useNavigate`).
* **Design & Styling:** Tailwind CSS engine enforcing a sleek dark-mode glassmorphism aesthetic (`slate-950`) alongside strict design system tokens:
    * *Brand Navigation/Headers:* `Aether Blue (#0D47A1)` (Midnight Dark Blue)
    * *Success States / Dynamic Stream Trackers:* `Flow Teal (#00BFA5)` (Items > 5 units)
    * *System Warning / Critical Threshold Indicators:* `Alert Crimson (#D50000)` (Items <= 5 units)
    * *Container Framing:* Strict `8px` rounded-corner (`rounded-lg`) layout rules.
* **Cross-Platform Scaffolding:** Native runtime layer using `@capacitor/core` and `@capacitor/cli` for mobile device scalability.
* **Backend Server Logic:** Node.js running an asynchronous Express API router framework deployed via Railway.
* **Data Persistence Layer:** Relational SQL database engine managing strict data constraints and user access tables.

---

## 📊 Project Progress & Sprint Lifecycle

### Done (Sprint 1 Milestones)
* [x] **Secure Access Gateway:** Developed the responsive frontend login interface matching core branding guidelines.
* [x] **Credential Input Masking:** Implemented real-time character obscuring for secure access key inputs.
* [x] **Environment Standardization:** Resolved cross-environment compilation path breaks by enforcing rigid absolute path configurations (`@/*`) via Vite settings.
* [x] **Mobile Runtime Initialization:** Integrated and initialized cross-platform Capacitor dependencies locally.

### Done (Sprint 2 Milestones)
* [x] **High-Fidelity Dashboard Framework:** Coded and deployed the main tracking workspace layout, featuring dynamic status analytic cards.
* [x] **Real-Time Holdings Matrix:** Implemented the core data table mapping out current warehouse assets and stock metrics.
* [x] **Interactive Catalog Filtering:** Developed the frontend search query handling input text to instantly filter inventory rows via active keystrokes.
* [x] **Critical Low-Stock Logic:** Implemented dynamic styling logic that color-flags rows instantly if inventory values drop at or below 5 units.
* [x] **Defensive Local Bypasses:** Configured automated frontend sanitization (`.trim()`) to catch data formatting anomalies safely during pipeline exchanges.

### In Progress (Sprint 3 / Release Preparation Focus)
* [ ] **CORS Middleware & Environment Tuning:** Finalizing API gateway permissions for secure, end-to-end server messaging.
* [ ] **Automated Rigor Scripts:** Conducting validation checks on SKU data tables to ensure production compliance.
* [ ] **Product Demonstration Readiness:** Preparing the system presentation media and Scrum retrospective slide decks for final release evaluation.

---

## 🛠️ Local Development & Installation Setup

Follow these precise steps to spin up the local development environment inside your terminal workspace. If you are operating within a Linux or Windows Subsystem for Linux (WSL) environment, make sure you are in the correct directory.

### 1. Clone & Navigate
Clone the centralized team repository and move straight into the project root directory folder:
```bash
git clone <repository-url>
cd AetherFlow-1
