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
* **Jesus Salas** | *Business Analyst (Documentation Lead)*
    * **Focus:** Product backlog management, user story profiling, requirement matrix analysis, and validation compliance reports.
* **Alex Johnston** | *Scrum Master (Project Coordinator)*
    * **Focus:** Sprint velocity tracking, block mitigation, timeline coordination, and deployment workspace infrastructure.

---

## 💻 Technical Architecture & Stack

To ensure optimal speed, horizontal scalability, and multi-platform deployment capabilities, AetherFlow utilizes the following stack:

* **Frontend Environment:** React.js initialized via the Node.js/Vite build system.
* **Design & Styling:** Tailwind CSS engine enforcing strict design tokens:
    * *Primary Action Elements:* `Aether Blue (#007BFF)`
    * *System Warning Indicators:* `Crimson Alert (#D50000)`
    * *Container Framing:* Strict `8px` rounded-corner (`rounded-lg`) layout rules.
* **Cross-Platform Scaffolding:** Native runtime layer using `@capacitor/core` and `@capacitor/cli` for mobile device scalability.
* **Backend Server Logic:** Node.js running an asynchronous Express API router framework.
* **Data Persistence Layer:** Relational SQL database engine managing strict data constraints.

---

## 📊 Current Project Status

### Done (Sprint 1 Milestones)
* [x] **Secure Access Gateway:** Developed the responsive frontend login interface matching core branding guidelines.
* [x] **Credential Input Masking:** Implemented real-time character obscuring for secure access key inputs.
* [x] **Environment Standardization:** Resolved local asset resolution breaks by enforcing relative path structures.
* [x] **Mobile Runtime Initialization:** Integrated and initialized cross-platform Capacitor dependencies locally.

### In Progress (Sprint 2 Focus)
* [ ] **Primary Workspace Development:** Coding high-fidelity dashboard views and inventory management grid structures.
* [ ] **Relational Schema Integration:** Deploying live SQL table instances and setting up secure backend database connections.
* [ ] **Authentication Handoff:** Connecting frontend form validation handlers to active backend API verification endpoints.
* [ ] **Automated Integration Testing:** Writing automated script testing parameters to evaluate registration limits and input validation safety.

---

## 🛠️ Local Development & Installation Setup

Follow these precise steps to spin up the local development environment inside your terminal workspace. If you are operating within a Linux or Windows Subsystem for Linux (WSL) environment, make sure you are in the correct directory.

### 1. Clone & Navigate
Clone the centralized team repository and move straight into the project root directory folder:
```bash
git clone <repository-url>
cd AetherFlow-1
