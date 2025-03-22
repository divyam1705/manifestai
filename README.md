# Manifest AI – Productivity & Goal-Tracking App

A premium, Nebula-themed AI-powered productivity app that helps users achieve their dreams through personalized, scientifically-backed scheduling and habit-building techniques.

## Core Features & Functionalities

### 1. Dream & Goal Input

- Users enter their dream/goal (e.g., "Become a software engineer").
- The app asks personalization questions to build an optimal schedule:
  - Chronotype: Are you a morning person or night owl?
  - Focus Time: When do you concentrate best?
  - Work Style: Do you prefer strict schedules or flexibility?
  - Break Preferences: How long should breaks be?
  - Distractions: What frequently disrupts your work?
  - Work/Study Mode: Deep Work, Pomodoro, or time-blocking?
  - Exercise & Meditation Inclusion: Y/N (shows scientific benefits)

### 2. Smart Schedule Generation

- AI-powered timetable based on the user's preferences.
- Import work/class schedules from Google Calendar API.
- Generates:
  - Daily tasks: Specific action items with time slots.
  - Weekly & Monthly goals: Bigger milestones.
- Time-blocking & Prioritization:
  - Urgent vs. Important (Eisenhower Matrix).
  - Auto-adjustment based on performance & consistency.

### 3. Exercise & Meditation Integration

- Users can opt to schedule workouts & meditation.
- Below these, show scientifically-backed benefits like:
  - Exercise improves cognitive function (Harvard).
  - Meditation enhances focus (Mindfulness studies).

### 4. Gamification & Habit-Building

- Users "level up" by completing tasks consistently.
- Streaks, XP, Badges for motivation.
- Weekly & monthly progress reports.
- Habit streak tracking from Atomic Habits.

### 5. AI Productivity Insights (LangChain)

- Personalized suggestions based on performance.
- Example: "You work best at night, schedule deep work from 8-11 PM."
- Habit improvement suggestions from books like:
  - Atomic Habits
  - Deep Work
  - The Power of Habit
  - The 5 AM Club

### 6. Premium UI/UX (Dark Nebula Theme)

- Glassmorphism UI with space aesthetics.
- Smooth animations (Framer Motion).
- Background music (customizable).

## Tech Stack & Architecture

### Frontend:

- Next.js – SSR & optimized performance.
- ShadCN – Modern UI components.
- Tailwind CSS – Efficient styling.

### Backend:

- Supabase (PostgreSQL) – Authentication & database.
- Google Calendar API – Schedule import.
- LangChain – AI-driven recommendations.

### State Management & API:

- Recoil/Zustand – Lightweight state management.
- Supabase Functions – Backend logic & APIs.

## Development Plan

### Phase 1: UI/UX Design

- Design Nebula-themed dark mode UI.
- Glass cards, space animations, soothing background music.

### Phase 2: Authentication & User Input

- Sign-up/Login with Supabase Auth.
- Input dreams & personalization preferences.

### Phase 3: Smart Scheduling & AI Integration

- Google Calendar Import.
- AI-generated time-blocked schedules.

### Phase 4: Gamification & Habit Tracking

- Streaks, XP system, habit-building rewards.
- AI-powered insights & habit optimization.

### Phase 5: Final Enhancements

- Animations, music & aesthetic improvements.
- Bug fixes & final UI polish.

## Project Structure

```
src/
├── components/  # Reusable UI components
├── pages/       # Route-based pages
├── hooks/       # Custom React hooks
├── utils/       # Helper functions
├── store/       # Recoil/Zustand state management
├── api/         # API integration (Google Calendar, Supabase)
├── styles/      # Tailwind styles
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Future Enhancements

- Focus Mode – Blocks distractions (Chrome Extension support).
- Social Accountability – Study rooms for co-working.
- Widget Support – Quick access to tasks.
- Habit Stacking – "If you do Task A, follow it with Task B."
