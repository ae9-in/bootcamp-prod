

# SkillLaunch — Online Bootcamp Platform

## Overview
A full-stack (localStorage-based) online bootcamp platform with 3 user roles (student, mentor, admin), course modules, meeting rooms, purchase flow, testimonials, and role-based dashboards. Built with React, TypeScript, Tailwind CSS, shadcn/ui, and Framer Motion.

## Pages & Features

### Public Pages
1. **Homepage (`/`)** — Hero with animated headline + CTAs, 3 feature cards, 3 testimonial preview cards (clickable → `/testimonials`), purchase banner, footer
2. **Testimonials (`/testimonials`)** — Full grid of all testimonials with staggered Framer Motion entrance, avatar color coding, star ratings
3. **Purchase (`/purchase`)** — Duration selector (Hours/Days/Weeks/Months) with live price calculation (₹500 × units), enrollment modal, saves to localStorage
4. **Login (`/login`)** — Email/password auth against localStorage users, role-based redirect, attendance logging
5. **Register (`/register`)** — Creates student account, auto-login, redirect to student dashboard

### Protected Pages
6. **Modules (`/modules`)** — 3 module cards (BA, HR, Web Dev) with topic checklists, progress tracking per user
7. **Module Detail (`/modules/:id`)** — Topic checklist with completion tracking, progress bar
8. **Meeting Room (`/meeting`)** — Google Meet-style UI with mic/camera/screenshare toggles, participant panel, chat panel, recording management
9. **Student Dashboard** — Welcome card, module progress bars, login history, quick links
10. **Mentor Dashboard** — Stats cards, student attendance table, student progress table, recordings list
11. **Admin Dashboard** — Everything from mentor + testimonials CRUD editor, purchase records table, user management

### Navigation
- Public: Logo, Home, Testimonials, Login, "Purchase Bootcamp" button
- Authenticated: Logo, Dashboard, Modules, Meeting, Logout (with role badge)
- Responsive hamburger menu on mobile

### Data & Auth
- All data in localStorage with seed data on first load (admin, mentor, 3 students, 6 testimonials)
- Login/logout attendance logging
- Role-based route protection
- Progress tracking per user per module

### Design & Animation
- Primary indigo (#4F46E5), white backgrounds, slate grays
- Framer Motion: page transitions (AnimatePresence), card hover effects, staggered entrances, count-up animations, shake on form errors
- Meeting control bar with glassmorphism (backdrop-blur)
- All animations via Framer Motion (no CSS-only transitions)

