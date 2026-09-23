# Mini Design Canvas

A full-stack canvas editor created for the Glazia Full Stack Developer Intern assignment.

**Live Application:** https://mini-design-canvas-hfk2.vercel.app/  
**GitHub Repository:** https://github.com/ishika61/mini-design-canvas  
**Backend API:** https://mini-design-canvas-iso6.onrender.com

Built using Next.js, React Konva, Express, and MongoDB.

## Features

### Core Features

- Create a new canvas
- Add Rectangle, Circle, and Text elements
- Select elements on the canvas
- Drag, resize, and rotate elements using React Konva Transformer
- Edit element properties:
  - X and Y position
  - Width and height
  - Circle radius
  - Rotation
  - Fill color
  - Text content
  - Font size
- Delete selected elements
- Save canvases to MongoDB
- Load, update, and delete saved canvases

### Additional Features

- JWT authentication
- User-owned canvases
- Undo/Redo
- Layer management with Move Back and Move Forward
- Autosave for existing saved canvases
- PNG export

## Tech Stack

### Frontend

- Next.js
- React
- React Konva
- Konva
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- express-validator
- CORS
- dotenv

## Project Structure

```text
mini-design-canvas/
├── frontend/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.jsx
│   │   └── page.jsx
│   ├── components/
│   │   ├── CanvasEditor.jsx
│   │   └── DesignStage.jsx
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── canvasController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── validate.js
│   │   ├── models/
│   │   │   ├── Canvas.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── canvasRoutes.js
│   │   └── services/
│   │       ├── authService.js
│   │       └── canvasService.js
│   ├── server.js
│   └── package.json
│
└── README.md

```
## Setup

## Setup

Prerequisites: Node.js 18+ and a MongoDB database (local or Atlas).

### 1. Configure and run the backend

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

Create/update `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 2. Configure and run the frontend

```bash
cd frontend
copy .env.example .env.local
npm install
npm run dev
```

Create/update `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Open [http://localhost:3000](http://localhost:3000).
```
```
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

## Deployment

The application is deployed using:
Frontend: Vercel
Backend: Render
Database: MongoDB Atlas


Author

Ishika Savita


## Assignment Note:

This project was developed as part of the **Glazia Full Stack Developer Intern Assignment**. It demonstrates the implementation of a full-stack Mini Design Canvas using the technologies and requirements specified by **Glazia**.
