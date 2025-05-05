# Coin Control

Coin Control is a personal finance management tool that helps users track expenses, manage income, set savings goals, and visualize their financial progress. Built with a React + Vite frontend and Express backend, it features a PostgreSQL database and a modern, interactive dashboard.

---

## Table of Contents

- [Features](#features)
- [Feature Previews](#feature-previews)
- [Setup](#setup)
- [Dependencies](#dependencies)
- [User Stories](#user-stories)
- [ERD](#erd)
- [Development Timeline](#development-timeline)

---

## Features

- **Expense Tracking:** Add, view, edit, and delete expenses with categories and dates.
- **Income Management:** Track multiple income sources, frequencies, and payment dates.
- **Savings Goals:** Set, update, and visualize savings goals as a percentage of income.
- **Dashboard:** View summaries of balance, expenses, income, and savings progress.
- **Trophies:** Earn achievements for financial milestones.
- **AI Insights:** Get personalized financial insights (AI-powered).
- **Responsive UI:** Modern, animated, and mobile-friendly interface.

---

## Feature Previews

Below are placeholders for screenshots or GIFs of the main features. Replace the image links with actual screenshots or demo GIFs as needed.

### Dashboard Overview

![Dashboard Screenshot](https://github.com/SilentYell/Coin_Control/blob/main/docs/images/dashboard.png?raw=true)

### Expense Tracking

![Expense Tracking Screenshot](https://github.com/SilentYell/Coin_Control/blob/main/docs/images/expense_tracking.png?raw=true)

### Income Management

![Income Management Screenshot](https://github.com/SilentYell/Coin_Control/blob/main/docs/images/income_tracking.png?raw=true)

### Savings Goals

![Savings Goals Screenshot](https://github.com/SilentYell/Coin_Control/blob/main/docs/images/saving_goal.png?raw=true)

### Trophies & Achievements

![Trophies Screenshot](https://github.com/SilentYell/Coin_Control/blob/main/docs/images/trophy_case.png?raw=true)

### AI Insights

![AI Insights Screenshot](https://github.com/SilentYell/Coin_Control/blob/main/docs/images/AI_Insights.png?raw=true)

---

## Setup

1. **Frontend:**

   ```bash
   cd client && npm install && npm run dev
   ```

2. **Backend:**

   ```bash
   cd server && npm install && node index.js
   ```

3. **Database:**
   - Start PostgreSQL and set up the database:

   ```bash
   sudo systemctl start postgresql
   npm run db-setup
   ```

---

## Dependencies

**Frontend:**

- animejs (animations)
- matter-js (physics for trophy/animation effects)
- react, react-dom
- react-grid-layout (dashboard layout)
- react-icons (iconography)
- react-router-dom (routing)
- recharts (charts/graphs)
- sass (styling)

**Backend:**

- express
- pg (node-postgres)
- dotenv

---

## User Stories

See [`docs/user_stories.md`](docs/user_stories.md) for full details. Highlights:

- Authentication (sign up, login, logout)
- Expense and income management (add, view, edit, delete)
- Set and track savings goals
- Dashboard summary and progress visualization

---

## ERD

See [`docs/ERD.md`](docs/ERD.md) for full details. Highlights:

- Users, Expenses, Income, SavingsGoals tables
- Users have many Expenses, Income, and SavingsGoals

---

## Development Timeline

- **Week 1:** Database schema, core components, backend API routes
- **Week 2:** Frontend-backend integration, dashboard, savings goals
- **Week 3:** Testing, UI polish, animations, trophies, AI insights

---