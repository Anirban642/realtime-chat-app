```markdown
# Realtime Chat App

A full-stack real-time chat application built with React Native (Expo) + Node.js + Socket.io.

## Live Backend
https://realtime-chat-app-nluv.onrender.com

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React Native (Expo) |
| Backend | Node.js + Express |
| Real-time | Socket.io |
| Storage | In-memory (structured for SQLite swap) |
| Deployment | Render (free tier) |

---

## Project Structure

```
realtime-chat-app/
  backend/
    src/
      routes/       REST API endpoints
      sockets/      Socket.io event handlers
      models/       Message store
      middleware/   Error handling
    index.js
    package.json
  frontend/
    src/
      screens/      LoginScreen, ChatScreen
      components/   MessageBubble
      services/     api.js, socket.js
      hooks/
    App.js
    package.json
```

---

## Setup & Run

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on: http://localhost:3001

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

Then press `w` for web, or scan QR with Expo Go.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `3001` |
| `CLIENT_URL` | Allowed CORS origin | `*` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | Backend REST URL | `http://localhost:3001` |
| `EXPO_PUBLIC_SOCKET_URL` | Backend Socket URL | `http://localhost:3001` |

---

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Server health check |
| GET | `/messages` | Fetch full chat history |
| POST | `/messages` | Create a new message |

### POST /messages body:
```json
{
  "username": "Alice",
  "text": "Hello world"
}
```

---

## Design Decisions

### REST vs Socket for sending messages
- **Socket.io** handles sending messages in real time (`chat:send` event)
- **REST GET /messages** handles fetching history on app load
- This hybrid approach gives instant delivery via sockets while keeping history load simple and stateless via REST
- `POST /messages` exists as a fallback but the frontend uses sockets for all sends

### In-memory storage
- Messages stored in a plain array on the server
- Structured behind a `MessageStore` abstraction so swapping to SQLite only requires changing `models/messageStore.js` with zero API changes

### Username system
- Dummy username entry on first load (no auth, no passwords)
- Username stored in React state only — choosing a new name is as simple as logging out and picking another

### Multi-user architecture
- Every connected socket client receives all broadcast messages instantly
- Each message carries `username`, `text`, `timestamp`, `id`
- The frontend uses the stored username to determine bubble alignment (left = others, right = you)

---

## Assumptions

| # | Assumption |
|---|---|
| 1 | Root folder created in current working directory |
| 2 | Plain JavaScript used (not TypeScript) to minimize 24-hour build overhead |
| 3 | Backend runs on port 3001, Expo dev server on 8081 |
| 4 | Git and Node.js 18+ installed on the machine |
| 5 | In-memory storage is acceptable for MVP (no database required) |
| 6 | Single chat room only (no multi-room support needed) |
| 7 | Username is session-only, no persistence across app restarts |
| 8 | Expo free tier used for APK build (queue wait time expected) |

---

## Features

- Real-time messaging via Socket.io
- Multi-user support with username entry
- Chat history loaded on app open via REST
- Message bubbles with sender-aware alignment
- Timestamps on every message
- Connection status indicator (live/reconnecting)
- Animated message bubbles (slide + fade)
- Animated login screen
- Auto-scroll to latest message
- Keyboard-avoiding input on mobile
- Error handling with retry button
- Graceful socket reconnection

---

## Running the APK

1. Download the APK from the Expo build page
2. Transfer to Android device
3. Enable "Install from unknown sources" in Android settings
4. Open the APK file to install
5. Make sure backend is running (Render deployment stays live)
```