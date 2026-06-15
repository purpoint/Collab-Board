# ⬡ CollabBoard

> A real-time collaborative whiteboard. Multiple users. One canvas. Zero lag.

**CollabBoard** is a Miro-inspired full-stack web application where multiple users can join a shared board and draw shapes together in real time. Every stroke, every cursor, every undo — synced instantly across all connected users and persisted in MongoDB.

Built without third-party canvas libraries. Every part of the real-time sync is hand-rolled.

&nbsp;

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://render.com/)

&nbsp;

---

## 🔗 Links

| | |
|---|---|
| 🌐 **Live App** | [collab-board-xi.vercel.app](https://collab-board-xi.vercel.app) |
| ⚙️ **Backend API** | [collabboard-server-y8eb.onrender.com](https://collabboard-server-y8eb.onrender.com/health) |
| 💻 **GitHub** | [github.com/purpoint/Collab-Board](https://github.com/purpoint/Collab-Board) |

> **Try it:** Open the live app in two browser windows. Register two different users. Join the same board. Draw — shapes and cursors sync instantly.

---

## ✨ Features

### Drawing Tools
- **Rectangle** — click and drag to draw
- **Circle** — click and drag to draw ellipses
- **Line** — draw straight lines at any angle
- **Pencil** — freehand drawing with automatic path simplification

### Canvas Controls
- **Stroke color** — full color picker
- **Fill color** — toggle fill on/off with color picker
- **Stroke width** — Small / Medium / Large
- **Opacity** — 10% to 100% slider
- **Zoom** — Ctrl+Scroll or toolbar buttons, zooms toward cursor position

### Collaboration
- **Live cursors** — see every user's cursor with their name and assigned color
- **Real-time sync** — shapes appear on all screens under 100ms
- **User count** — shows how many people are on the board right now
- **Join by ID** — share the board URL and anyone can join instantly

### Board Management
- **Undo** — Cmd+Z removes your last shape and broadcasts to all users
- **Delete** — click a shape to select it, press Delete key to remove it
- **Clear board** — wipe everything with confirmation, synced to all users
- **Export PNG** — download the current canvas as an image
- **Persistence** — refresh the page and all shapes are still there from MongoDB

### Security
- JWT authentication on both HTTP routes and WebSocket connections
- Rate limiting — 10 auth attempts and 100 API requests per 15 minutes
- Socket event validation before any database operation
- Passwords hashed with bcrypt

---

## 🏗️ How It Works

CollabBoard uses two separate communication channels:

**HTTP (REST)** handles auth and board setup — login, register, create board, join board. These are one-time request-response operations.

**WebSocket (Socket.io)** handles everything real-time — drawing shapes, cursor movement, undo, delete, clear. This is a persistent connection that stays open for the entire session.

### The Real-Time Draw Flow

When you draw a rectangle this is exactly what happens:

```
1. mouseDown     → record start point, convert screen → world coords for zoom
2. mouseDrag     → show live preview (local only, never sent to server)
3. mouseUp       → generate UUID, kill preview, save undo snapshot
4. emit          → socket.emit('draw-shape', { boardId, shape })
5. server        → validates boardId and shape fields
6. MongoDB       → createShape() saves document, adds createdBy from JWT
7. broadcast     → io.to(boardId).emit('shape-added', savedShape)
8. Redux         → dispatch(addShape(shape)) on all clients
9. canvas        → renderBoard() redraws — shape appears for everyone
```

Steps 4–9 complete in under 100ms.

### Cursor Tracking

Cursors are **ephemeral** — they never touch the database. Mouse events fire 60 times per second. With multiple users that would flood the server. Solution: emit only once every 30ms (33 updates/sec) using a timestamp check. Smooth to the human eye, half the server load. Cursors expire automatically after 3 seconds of no movement.

```js
const handleMouseMove = (e) => {
  const now = Date.now()
  if (now - lastEmit.current < 30) return  // throttle to ~33fps
  lastEmit.current = now
  socket.emit('cursor-move', { boardId, x, y })
}
```

### Pencil Path Simplification

A 10-second pencil stroke generates ~600 coordinate points. Storing all of them bloats MongoDB. The **Ramer-Douglas-Peucker algorithm** removes points that are nearly collinear — points so close to the line between their neighbours that removing them is visually imperceptible. Result: 60–85% fewer points stored with zero visible difference in the stroke.

### Socket Authentication

HTTP routes are protected by `auth.js` middleware. But WebSocket is a completely separate connection — someone could bypass login and open a raw socket to emit draw events anonymously. `socketAuth.js` runs independently at connection time, reads the JWT from the socket handshake, verifies it, and attaches `socket.user` to the connection. Every downstream handler trusts this — no re-verification needed per event.

---

## 🗄️ Database Design

### Why Shapes Are a Separate Collection

Most tutorials embed shapes inside the board document. This hits MongoDB's 16MB document limit quickly and rewrites the entire shapes array on every single draw. CollabBoard stores shapes as separate documents:

```
boards collection    →  board metadata, member list, roles
shapes collection    →  one document per shape, indexed by boardId
users collection     →  auth credentials, avatarColor
```

A compound index on `{ boardId, isDeleted, zIndex }` makes loading a board's shapes a single fast query regardless of total shapes in the database. Every draw is a targeted single-document write.

### Soft Deletes

Shapes are never hard-deleted. `isDeleted: true` is set instead. This means undo history is always recoverable and the full event history is preserved for a future CRDT implementation.

---

## 📁 Project Structure

```
collab-board/
│
├── client/                          # React frontend (Vercel)
│   └── src/
│       ├── components/
│       │   ├── Canvas/
│       │   │   ├── CanvasBoard.jsx      # canvas element, zoom, resize
│       │   │   ├── CanvasRenderer.js    # pure JS drawing — no React
│       │   │   └── useCanvasEvents.js   # mouse events, world coords
│       │   ├── Toolbar/
│       │   │   └── Toolbar.jsx          # all drawing controls
│       │   ├── Cursors/
│       │   │   ├── CursorOverlay.jsx    # renders all remote cursors
│       │   │   └── RemoteCursor.jsx     # single cursor with label
│       │   └── UI/
│       │       ├── Toast.jsx            # join/leave notifications
│       │       └── ErrorBoundary.jsx    # crash protection
│       ├── hooks/
│       │   ├── useSocket.js             # connection lifecycle
│       │   ├── useBoard.js              # join room, loading state
│       │   ├── useShapes.js             # emit + receive shapes
│       │   ├── useCursors.js            # 30ms throttled cursor
│       │   └── useHistory.js            # Cmd+Z undo stack
│       ├── store/
│       │   ├── shapesSlice.js           # entity adapter, O(1) lookup
│       │   ├── cursorSlice.js           # remote cursors by userId
│       │   └── boardSlice.js            # board name and ID
│       ├── socket/
│       │   ├── socketClient.js          # singleton — one connection
│       │   └── events.js               # event name constants
│       └── utils/
│           └── simplifyPath.js          # RDP algorithm
│
└── server/                          # Node.js backend (Render)
    └── src/
        ├── models/
        │   ├── User.js                  # username, passwordHash, avatarColor
        │   ├── Board.js                 # boardId, members[], roles
        │   └── Shape.js                 # type, points[], compound index
        ├── services/
        │   ├── board.service.js         # business logic shared by HTTP + socket
        │   └── shape.service.js         # createShape, deleteShape, clearBoard
        ├── socket/
        │   ├── handlers/
        │   │   ├── board.handler.js     # join-board, leave-board
        │   │   ├── shape.handler.js     # draw, delete, clear events
        │   │   └── cursor.handler.js    # fire-and-forget, no DB
        │   └── middleware/
        │       ├── socketAuth.js        # JWT guard for WebSocket
        │       └── validateEvent.js     # payload validation
        └── middleware/
            ├── auth.js                  # JWT guard for HTTP
            └── errorHandler.js          # global error handler
```

---

## 🛠️ Tech Choices

| Technology | Why |
|---|---|
| **Socket.io** | Automatic reconnection, room management built-in. Raw WebSockets would need all of this hand-rolled. |
| **MongoDB** | Flexible schema handles rect `{x,y,w,h}` and pencil `{points[]}` in the same collection without separate tables. |
| **Redux Toolkit** | `createEntityAdapter` gives O(1) shape lookup by ID and free `upsertOne`/`removeOne` operations. Context API re-renders the whole tree on any state change. |
| **JWT** | Stateless auth that works across HTTP and WebSocket without a session store. Payload carries `userId` and `avatarColor` so no extra DB queries. |
| **Raw Canvas API** | Full control over rendering. Fabric.js and Konva add abstraction overhead that prevents the targeted optimizations needed for real-time collaboration. |

---

## 🚀 Run Locally

**Prerequisites:** Node.js 18+, MongoDB Atlas account

### 1. Clone the repo
```bash
git clone https://github.com/purpoint/Collab-Board.git
cd Collab-Board
```

### 2. Setup the backend
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=8080
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:3000
```

Start the server:
```bash
node server.js
```

You should see:
```
MongoDB connected
Server running on port 8080
```

### 3. Setup the frontend
```bash
cd ../client
npm install
```

Create `client/.env`:
```env
REACT_APP_SERVER_URL=http://localhost:8080
```

Start the frontend:
```bash
npm start
```

### 4. Test collaboration
- Open `http://localhost:3000` in two browser windows
- Register two different users
- Create a board in window 1
- Copy the board ID from the URL
- Join that board in window 2
- Draw — everything syncs in real time

---

## 🔒 Security

- Passwords hashed with **bcrypt** (10 salt rounds)
- **JWT** signed with secret, 24-hour expiry
- HTTP routes protected with `auth.js` middleware
- WebSocket connections protected with `socketAuth.js` independently
- **Rate limiting** — 10 auth attempts / 100 API requests per 15 minutes
- Socket event **payload validation** before any handler or database operation
- `createdBy` always set server-side from JWT — client never provides userId

---

## 📊 Numbers

| | |
|---|---|
| Real-time sync latency | < 100ms |
| Cursor update rate | 33 fps (throttled from 60fps mousemove) |
| Pencil point reduction | 60–85% via RDP algorithm |
| Undo history depth | 50 snapshots per session |
| Auth rate limit | 10 attempts / 15 min |
| API rate limit | 100 requests / 15 min |

---

## 🗺️ Roadmap

- [ ] Shape drag and move
- [ ] Text tool with inline editing
- [ ] View-only mode for shared links
- [ ] Redis adapter for multi-server scaling
- [ ] CRDT conflict resolution for simultaneous shape editing
- [ ] Mobile touch support

---

## 👤 Author

**Manan Ghodasara**

- GitHub: [@purpoint](https://github.com/purpoint)
- Live: [collab-board-xi.vercel.app](https://collab-board-xi.vercel.app)

---

<p align="center">Built from scratch — no canvas libraries, no shortcuts.</p>