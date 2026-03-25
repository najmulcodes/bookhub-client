# BookHub — Your Digital Library

> Discover, review, and manage your personal book collection in one elegant platform.

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Pages & Routes](#pages--routes)
- [Key Design Decisions](#key-design-decisions)

---

## Overview

**BookHub** is a full-stack web application that lets users discover books, add their own to a shared collection, and manage their personal library. Users authenticate via Firebase (email/password or Google), upload book covers to ImgBB, and interact with a RESTful backend API. The UI is built with React 18, styled with Tailwind CSS, and optimised for performance with lazy loading, skeleton screens, and debounced search.

---

## Live Demo

🔗 **[ https://bookhub-heaven.surge.sh/ ](#)**  
*(Update the link in `README.md` after deployment)*

---

## Features

### Core
- 📚 **Browse All Books** — Searchable, sortable table of every book in the collection
- ➕ **Add a Book** — Upload a cover image, enter metadata, and publish instantly
- ✏️ **Edit / Delete** — Full CRUD for books you own, protected behind auth checks
- 🔍 **Search & Filter** — Debounced real-time search with rating-based sort (asc/desc)
- ⭐ **Ratings** — Star-based rating display across all book views

### Authentication
- 🔐 Firebase Email/Password sign-in & registration
- 🔑 Google OAuth one-click sign-in
- 👤 Profile page — update display name and avatar (file upload or URL)
- 🛡️ Route-level auth guards (redirects to login for protected pages)

### UX & Performance
- ⚡ Route-based code splitting with `React.lazy` + `Suspense`
- 🖼️ Lazy image loading via `IntersectionObserver`
- 💀 Skeleton loaders for books grid and table
- 🔁 Debounced search input (300 ms)
- ✅ Confirm dialogs before destructive actions
- 🍞 Toast notifications (react-hot-toast)
- 📱 Fully responsive — mobile-first layout with collapsible navigation

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (with Hooks) |
| Routing | React Router v6 |
| Styling | Tailwind CSS v3 |
| Auth | Firebase v9 (Email + Google) |
| HTTP Client | Axios |
| Image Hosting | ImgBB API |
| Notifications | react-hot-toast |
| Build Tool | Vite 5 |

---

## Project Structure

```
bookhub-client/
├── public/
│   └── _redirects              # Netlify SPA redirect rule
├── src/
│   ├── components/
│   │   ├── BookCard.jsx         # Individual book card (grid view)
│   │   ├── BookGrid.jsx         # Responsive grid wrapper
│   │   ├── ConfirmDialog.jsx    # Reusable delete confirmation modal
│   │   ├── Footer.jsx
│   │   ├── LazyImage.jsx        # IntersectionObserver-based image loader
│   │   ├── LoadingSpinner.jsx
│   │   ├── Navbar.jsx
│   │   └── SkeletonLoader.jsx   # Grid & table skeleton screens
│   ├── firebase/
│   │   └── firebaseConfig.js    # Firebase app initialisation & exports
│   ├── hooks/
│   │   ├── useApiProtection.js  # AbortController-based request deduplication
│   │   ├── useConfirm.js        # Promise-based confirmation dialog hook
│   │   └── useDebounce.js       # Generic debounce hook
│   ├── pages/
│   │   ├── AddBook.jsx
│   │   ├── AllBooks.jsx
│   │   ├── BookDetails.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── MyBooks.jsx
│   │   ├── NotFound.jsx
│   │   ├── Profile.jsx
│   │   ├── Register.jsx
│   │   └── UpdateBook.jsx
│   ├── services/
│   │   ├── axiosInstance.js     # Pre-configured Axios instance
│   │   └── imgbb.js             # ImgBB upload helper
│   ├── utils/
│   │   └── performance.js       # debounce / throttle / preloadImage
│   ├── App.jsx                  # Root component & route definitions
│   ├── index.css                # Tailwind directives + custom CSS classes
│   └── main.jsx                 # React DOM entry point
├── .env                         # Local environment variables (not committed)
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 8
- A running instance of the BookHub backend API (default: `http://localhost:5000/api`)
- A Firebase project with **Email/Password** and **Google** sign-in providers enabled
- An [ImgBB](https://imgbb.com/) account and API key

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/bookhub-client.git
cd bookhub-client

# 2. Install dependencies
npm install

# 3. Create the environment file
cp .env.example .env   # then fill in the values (see below)

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Backend API base URL
VITE_API_URL=http://localhost:5000/api

# ImgBB public API key — https://api.imgbb.com/
VITE_IMGBB_KEY=your_imgbb_key_here
```

> **Firebase credentials** are currently hard-coded in `src/firebase/firebaseConfig.js`. For production deployments it is strongly recommended to move them to `VITE_FIREBASE_*` environment variables.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run build:prod` | Alias for production build with explicit mode flag |

---

## Pages & Routes

| Path | Component | Auth Required |
|---|---|---|
| `/` | `Home` | No |
| `/all-books` | `AllBooks` | No |
| `/book/:id` | `BookDetails` | No |
| `/add-book` | `AddBook` | ✅ Yes |
| `/my-books` | `MyBooks` | ✅ Yes |
| `/update-book/:id` | `UpdateBook` | ✅ Yes |
| `/profile` | `Profile` | ✅ Yes |
| `/login` | `Login` | No |
| `/register` | `Register` | No |
| `*` | `NotFound` | No |

Unauthenticated users who navigate to a protected route are redirected to `/login`.

---

## Key Design Decisions

**Lazy loading & code splitting** — Every page component is loaded via `React.lazy`, keeping the initial bundle small and improving Time to Interactive.

**Request deduplication** — The `useApiProtection` hook uses `AbortController` to cancel in-flight requests when a new one for the same resource is triggered, preventing race conditions and redundant network calls.

**Debounced search** — The `useDebounce` hook (300 ms delay) prevents a backend request on every keystroke in the search input.

**Skeleton screens** — Separate `SkeletonLoader` variants for both the book grid and the table view give users immediate structural feedback while data loads.

**Promise-based confirmation** — `useConfirm` wraps the confirm dialog state in a `Promise`, making delete flows read naturally as `await confirm(...)` without prop-drilling callbacks.

**ImgBB for image hosting** — Book covers are uploaded directly from the browser to ImgBB before the book record is saved, keeping image storage off the application server entirely.

**Vite manual chunks** — `vendor`, `router`, `firebase`, and `ui` are split into separate chunks in the production build, enabling better long-term caching.

---

## License

This project is open source and available under the [MIT License](LICENSE).
