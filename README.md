# Mini Design Canvas

A full-stack canvas editor created for the Glazia Full Stack Developer Intern assignment. It uses Next.js, React Konva, Express, and MongoDB.

## Features

- Create a new canvas and add rectangle, circle, and text elements.
- Select, drag, resize, rotate, edit, and delete elements.
- Save, load, update, and delete canvases stored in MongoDB.
- Register and sign in with JWT authentication; each user sees only their own canvases.
- Undo/redo, layer ordering, autosave for an existing saved canvas, and PNG export.

## Project structure

```
frontend/  Next.js interface and React Konva editor
backend/   Express REST API, MongoDB models, and authentication
```

## Setup

Prerequisites: Node.js 18+ and a MongoDB database (local or Atlas).

1. Configure the backend:

   ```bash
   cd backend
   copy .env.example .env
   npm install
   npm run dev
   ```

   Set `MONGO_URI` and `JWT_SECRET` in `backend/.env` before starting it.

2. Configure and run the frontend in another terminal:

   ```bash
   cd frontend
   copy .env.example .env.local
   npm install
   npm run dev
   ```

   Open `http://localhost:3000`. The default API address is `http://localhost:5000/api`.

## API endpoints

Authentication:

- `POST /api/auth/register` — creates an account and returns a JWT.
- `POST /api/auth/login` — signs in and returns a JWT.

Canvas routes require `Authorization: Bearer <token>`:

- `POST /api/canvases` — create a canvas.
- `GET /api/canvases` — list the signed-in user's canvases.
- `GET /api/canvases/:id` — get one canvas.
- `PUT /api/canvases/:id` — update its name or elements.
- `DELETE /api/canvases/:id` — delete it.

## Architecture decisions

The frontend keeps the current canvas and editor history in React state. React Konva's `Transformer` drives resizing and rotation, and drag/transform events immediately update state. The backend separates routing, controllers, services, models, authentication, and request validation. Canvas ownership is filtered at query time so a user cannot access another user's canvas.

## Known limitations

- The canvas has a fixed 900 × 600 editing area.
- Text editing happens through the properties panel rather than directly on the canvas.
- There are no automated API or UI tests yet.

## Bonus features implemented

- Layer reordering
- Undo/redo
- Autosave
- JWT authentication with user-owned canvases
- PNG export
