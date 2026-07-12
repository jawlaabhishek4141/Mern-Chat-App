## 🔗 Live Links

- **Live App:** https://mern-chat-app-1-yzys.onrender.com
- **Live Backend API:** https://mern-chat-app-jgkf.onrender.com
- **GitHub Repo:** https://github.com/utsavjawla1919/Mern-Chat-App
- **Screen Recording (Google Drive):** https://drive.google.com/file/d/1eZS9hgFhZ5flEC613Ur-bJkLGIEv9LKZ/view?usp=sharing





# Wire — Real-Time MERN Chat Application

A production-structured real-time chat application:

- **Frontend:** React (Vite) + React Router + Axios + Socket.io-client + Tailwind CSS
- **Backend:** Node.js + Express + Socket.io + MongoDB (Mongoose) + JWT
- **Security:** Helmet, CORS, rate limiting, input validation/sanitization
- **Infra:** Dockerfiles for both apps, `docker-compose.yml`, Render + Vercel deploy configs


## ⚠️ A note on testing, read this first

Every file in this project was written, syntax-checked, and where possible
executed — but I built this in a sandboxed environment **with no MongoDB
available** (no local `mongod`, no network access to MongoDB's download
servers). So here's exactly what was and wasn't verified before you got it:

**Verified:**
- Every backend file passes `node -c` (syntax-checked individually).
- The Express app (`app.js`) builds and boots cleanly, independent of the DB.
- MongoDB connection failure/retry logic was tested against a real (closed)
  port and confirmed to retry, log clearly, and fail gracefully rather than
  crash uglily.
- JWT sign → verify round-trips correctly with the real `jsonwebtoken`
  library and this project's actual config loader.
- The username validation regex was tested against valid/invalid input.
- The frontend (`npm run build`) compiles with zero errors via Vite.
- The overall architecture (routes → controllers → services → models,
  and the equivalent Socket.io event contract) is the same pattern I
  built and fully end-to-end tested — including two simulated users
  messaging each other live — in a companion SQLite version of this app.
  The event names/payloads here follow that same proven design.

**Not verified (because I had no MongoDB to test against):**
- An actual live request hitting a real MongoDB — user creation, message
  persistence, `findOne`/`create`/`updateMany` calls, etc.
- Two real Socket.io clients messaging each other through this exact
  server with a live DB connection.

**What this means for you:** the code follows standard, well-established
Mongoose/Express/Socket.io patterns and should work as written, but you
are the first to run it against a real database. Follow the setup steps
below, and if anything doesn't behave as documented, it's most likely a
small integration issue (a typo in a query, a missed `await`) rather than
an architectural one — check the terminal output first, it's designed to
be descriptive.

---

## 1. Project structure

```
mern-chat-app/
├── backend/
│   ├── src/
│   │   ├── config/          # env.js (validated config), db.js (Mongo connection)
│   │   ├── controllers/     # auth, messages, users - REST handlers
│   │   ├── middleware/      # JWT auth guard, rate limiters, error handler, validator runner
│   │   ├── models/          # Mongoose schemas: User, Message
│   │   ├── routes/          # Express routers
│   │   ├── services/        # DB access / business logic, called by controllers AND sockets
│   │   ├── socket/          # socketAuth.js (JWT handshake), index.js (all socket events)
│   │   ├── validators/      # express-validator chains
│   │   ├── app.js           # Express app: middleware + routes
│   │   └── server.js        # Entry point: connects DB, starts HTTP + Socket.io
│   ├── seed/seed.js         # Sample users + conversation seeder
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      
│   │   │                    
│   │   ├── pages/           
│   │   ├── context/         
│   │   ├── hooks/           
│   │   ├── services/         
│   │   ├── utils/            
│   │   ├── App.jsx / main.jsx
│   │   └── index.css          
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── nginx.conf            
│   ├── vercel.json           
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml         
├── render.yaml                 
└── README.md                   
```

---

## 2. Prerequisites

- Node.js **v18+** (tested on v22)
- npm **v9+**
- A MongoDB instance — pick ONE:
  - **Local:** install MongoDB Community Server and run `mongod`, OR
  - **Docker:** just use `docker-compose up` (see §6) — no local install needed, OR
  - **Atlas (free, no install at all):** create a free cluster at
    [mongodb.com/atlas](https://www.mongodb.com/atlas) and copy its
    connection string into `MONGO_URI`

---

## 3. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` and set `MONGO_URI` to your database (local, Docker, or
Atlas) and a real `JWT_SECRET` (any long random string):

```bash
npm run dev      # nodemon, auto-restarts on changes
# or: npm start   # plain node
```

You should see:
```
[db] Connected to MongoDB (mern_chat)
Chat backend listening on http://localhost:5000
```

### (Optional) Seed sample data

```bash
npm run seed
```
Creates three users (`alice`, `bob`, `carol`) and a short sample
conversation, so the chat isn't empty on first load. Log in as any of
those usernames to see it.

### Backend environment variables (`backend/.env`)

| Variable                | Default                                | Description                                              |
|---------------------------|-------------------------------------------|--------------------------------------------------------------|
| `PORT`                    | `5000`                                     | Port the Express + Socket.io server listens on                |
| `NODE_ENV`                | `development`                              | `development` or `production`                                 |
| `MONGO_URI`               | `mongodb://127.0.0.1:27017/mern_chat`      | MongoDB connection string                                      |
| `JWT_SECRET`              | *(required, no default)*                    | Secret used to sign JWTs — use a long random string            |
| `JWT_EXPIRES_IN`          | `7d`                                        | JWT expiry                                                       |
| `CLIENT_ORIGIN`           | `http://localhost:5173`                     | Comma-separated allowed frontend origins (CORS + Socket.io)     |
| `RATE_LIMIT_WINDOW_MS`    | `900000` (15 min)                           | Rate limit window                                                |
| `RATE_LIMIT_MAX`          | `300`                                       | Max requests per window per IP                                   |

---

## 4. Frontend setup

Open a **second terminal** (keep the backend running):

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Visit **http://localhost:5173**, log in with a username, and open a second
browser window with a different username to see real-time messaging,
typing indicators, and online status.

### Frontend environment variables (`frontend/.env`)

| Variable              | Default                  | Description                        |
|------------------------|---------------------------|----------------------------------------|
| `VITE_API_BASE_URL`    | `http://localhost:5000`  | Base URL of the backend REST API        |
| `VITE_SOCKET_URL`      | `http://localhost:5000`  | Socket.io server URL                     |

### Production build

```bash
npm run build      # outputs static files to frontend/dist
npm run preview    # serve the production build locally
```

---

## 5. REST API documentation

All `/api/messages` and `/api/users` routes require
`Authorization: Bearer <token>` (obtained from `/api/auth/login`).

### `POST /api/auth/login`
Dummy username login — creates the user if new, always returns a JWT.

Request body:
```json
{ "username": "aryan" }
```
Response `200`:
```json
{
  "token": "eyJhbGciOi...",
  "user": { "id": "665f1b...", "username": "aryan" }
}
```

### `GET /api/messages?limit=50&offset=0`
Chat history, oldest first.

Response `200`:
```json
{
  "messages": [
    {
      "_id": "665f...",
      "sender": "665e...",
      "senderUsername": "alice",
      "text": "hello!",
      "status": "read",
      "createdAt": "2026-07-12T10:00:00.000Z",
      "updatedAt": "2026-07-12T10:00:05.000Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

### `POST /api/messages`
Send a message as the authenticated user. Also broadcasts it over
Socket.io (`message` event) to everyone connected.

Request body:
```json
{ "text": "hello!" }
```
Response `201`: the created message object (same shape as above).

### `PUT /api/messages/read/:id`
Marks a single message as read.

Response `200`: the updated message object.

### `GET /api/users/online`
Response `200`:
```json
{ "users": [{ "username": "alice", "lastSeen": "2026-07-12T10:00:00.000Z" }] }
```

### `GET /api/health`
Liveness check — `{ "status": "ok" }`.

All error responses share one shape: `{ "error": "human-readable message" }`.

---

## 6. Socket.io events

Every socket connection **must** authenticate with a JWT in the handshake:
```js
io(SOCKET_URL, { auth: { token: myJwt } });
```
Connections without a valid token are rejected before any event handler runs.

| Event (client → server) | Payload                    | Purpose                                    |
|----------------------------|-------------------------------|-------------------------------------------------|
| `message`                    | `{ text }` (+ ack callback)   | Send a message in real time                     |
| `message_read`                | —                              | Mark others' messages as read                    |
| `typing`                       | —                              | Notify others typing has started                 |
| `stop_typing`                  | —                              | Notify others typing has stopped                 |
| `join_room` / `leave_room`     | `room` (optional)              | Room management (single "general" room by default) |

| Event (server → client)   | Payload                                   | Purpose                                |
|-------------------------------|------------------------------------------------|-------------------------------------------|
| `message`                       | message object                                   | Broadcast a new message                    |
| `message_read`                  | `{ reader }`                                     | Someone marked messages as read            |
| `messages_delivered`             | —                                                 | Previously "sent" messages are now delivered |
| `user_online` / `user_offline`   | `{ username }`                                   | A user's presence changed                    |
| `online_users`                    | `string[]`                                        | Full current online user list                |
| `typing` / `stop_typing`          | `{ username }`                                   | Someone's typing state changed                |
| `error_message`                    | `string`                                          | A socket-side error occurred                    |
| `connect_error`                     | Socket.io built-in                                | Fired on handshake/auth failure or network drop |

**Reconnection:** the frontend's Socket.io client is configured with
`reconnectionAttempts: Infinity` and re-authenticates with the stored JWT
automatically. Presence and typing state are treated as ephemeral — that
is, they're server-side in-memory (not persisted), so a server restart
resets everyone to "offline" until they reconnect, which is the correct
behavior for live presence.

---

## 7. Running with Docker Compose (recommended for a quick full-stack run)

This spins up MongoDB, the backend, and the frontend together with a
single command — no local Mongo/Node install required beyond Docker
itself.

```bash
# from the project root
JWT_SECRET=$(openssl rand -hex 32) docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:5000
- MongoDB:  localhost:27017 (data persisted in a named Docker volume)

To run in the background: add `-d`. To stop: `docker-compose down` (add
`-v` to also delete the MongoDB volume).

> This compose file was authored to standard Docker Compose v2 syntax and
> validated as well-formed YAML, but — like the rest of the MongoDB path —
> wasn't executed end-to-end in this sandbox (no Docker daemon available
> here either). Double-check `docker-compose config` on your machine
> before relying on it for a live demo.

---

## 8. Design decisions

- **REST is the source of truth, sockets are the fast path.** Every
  message is written to MongoDB via the same `message.service.js` whether
  it came in through `POST /api/messages` or the `message` socket event,
  so history (loaded via REST on refresh) and live messages are always
  consistent.
- **JWT, not sessions.** The brief asks for "JWT Authentication (Dummy
  username login)" — no password is checked or stored; a username is
  enough to mint a token. The token is verified on every protected REST
  call *and* on the Socket.io handshake, so an unauthenticated socket
  can never reach the app's real-time handlers.
- **Services layer.** Controllers stay thin (parse request → call
  service → shape response); the same service functions are reused by
  the Socket.io handlers, so "create a message" has exactly one
  implementation regardless of which transport triggered it.
- **One shared room.** A single "General Room" keeps the scope on the
  mandatory mechanics (delivery, typing, presence, read receipts) rather
  than building full room/DM management. `join_room`/`leave_room` events
  exist so extending to multiple rooms later is a contained change.
- **Delivered vs. read semantics.** A message batch flips from `sent` to
  `delivered` once a second user is online; it flips to `read` when
  another client emits `message_read` (sent automatically by the
  frontend whenever the message list updates while the chat is open).
- **Socket-first send with a REST fallback.** If the socket emit fails
  (e.g. a mid-type disconnect), the frontend automatically retries over
  REST so a message is never silently lost.
- **Security stack:** Helmet for standard security headers, CORS locked
  to `CLIENT_ORIGIN`, `express-rate-limit` (tighter on `/auth/login` to
  slow down username enumeration), `express-validator` on every
  mutating endpoint, and `express-mongo-sanitize` to strip `$`/`.`
  query operators from user input as a NoSQL-injection guard.
- **Tailwind CSS v3**, not v4 — v4 changed its config model significantly
  (no more `tailwind.config.js` + `postcss.config.js` the classic way);
  v3 was chosen so the config matches what the brief's deliverable list
  ("Tailwind configuration") and most existing docs/tutorials expect.

## 9. Assumptions

- A single shared chat room is sufficient (no private 1:1 DMs / multiple
  rooms) — matches the mandatory requirements' scope.
- "Username-based dummy authentication" means no password; the returned
  JWT is what "protects" the APIs, per the brief's own wording.
- "Online/offline" is tracked per username across all of that user's open
  sockets/tabs — a user is online if at least one socket is connected.
- Message pagination (`limit`/`offset`) is implemented on the API; the
  frontend currently loads the most recent 100 messages on mount.
  Infinite-scroll-to-load-older-messages was left out as out of scope for
  the mandatory requirements.
- Given the sandbox couldn't run a live MongoDB (see the note at the top),
  I optimized for code that's correct-by-inspection and follows
  conventional, well-documented Mongoose/Express/Socket.io patterns,
  rather than for exotic query optimizations that are harder to verify
  without a live database to test against.

## 10. Bonus features implemented

- [x] Username-based login with real JWTs (not just a dummy client flag)
- [x] Typing indicator
- [x] Online/offline user status
- [x] Message sent/delivered/read status
- [x] Messages + users stored in MongoDB via Mongoose
- [x] Docker + Docker Compose for one-command local full-stack runs
- [x] Render blueprint (`render.yaml`) for the backend
- [x] Vercel config (`vercel.json`) for the frontend
- [ ] An actual **live, deployed** URL — not included, since deploying
      requires an account on Render/Vercel/Atlas that I don't have access
      to from this sandbox. Steps to deploy it yourself are in §11.
### ✅ This project is deployed and live

- Backend: https://mern-chat-app-jgkf.onrender.com (Render, Node Web Service)
- Frontend: https://mern-chat-app-1-yzys.onrender.com (Render, Static Site)
- Database: MongoDB Atlas (free M0 cluster)

## 11. Deployment

### Backend → Render
1. Push this repo to GitHub.
2. In Render, "New +" → "Blueprint", point it at the repo — it will read
   `render.yaml` automatically. Or create a Web Service manually with
   root dir `backend`, build command `npm install`, start command
   `node src/server.js`.
3. Set `MONGO_URI` (e.g. your Atlas connection string) and
   `CLIENT_ORIGIN` (your deployed frontend URL) in the Render dashboard —
   these are marked `sync: false` in the blueprint so Render won't
   overwrite them.
4. Once live, copy the backend's `https://your-service.onrender.com` URL.

### Frontend → Vercel
1. Import the repo in Vercel, set the root directory to `frontend`.
2. Framework preset: Vite. Build command `npm run build`, output `dist`.
3. Set environment variables `VITE_API_BASE_URL` and `VITE_SOCKET_URL` to
   your Render backend URL from above.
4. Deploy. `vercel.json` in `frontend/` already handles the SPA rewrite
   so React Router routes work on refresh.

### MongoDB → Atlas
1. Create a free cluster at mongodb.com/atlas.
2. Add a database user and allow network access from your Render
   service's IP (or `0.0.0.0/0` for simplicity during a demo).
3. Copy the connection string into `MONGO_URI`.

---

## 12. About "React Native (preferred)"

This project uses **React (web)**, not React Native, and there's no
generated APK. Producing a real, signed Android build requires the
Android SDK/Gradle toolchain, which isn't available in the environment
this was built in. The REST/Socket.io client logic (`services/`,
`context/SocketContext.jsx`) is plain JavaScript with no DOM-only APIs, so
porting the screens to React Native later — swapping HTML/Tailwind for
RN's `View`/`Text`/`FlatList` — is a contained follow-up, not a rewrite.
For submission, a screen recording of two browser windows chatting live
is a faithful stand-in for what an APK demo would show.

## 13. Future improvements

- Multiple rooms / private 1:1 conversations (the `join_room`/`leave_room`
  events already exist as a foundation).
- Infinite scroll to load older message history instead of a fixed
  most-recent-100 window.
- Message editing/deletion, reactions, file/image attachments.
- Push notifications for messages received while the tab isn't focused.
- Automated tests (Jest/Supertest for the API, React Testing Library for
  the frontend) — not included here given the no-MongoDB sandbox
  constraint made API-level integration tests impossible to run and
  verify honestly.
- Real password-based auth (or OAuth) if this ever needs to leave the
  "dummy auth for an assignment" scope.

## 14. Screenshots

_Add screenshots or a screen recording link here once you've run the app
locally — e.g. the login screen, two windows chatting live, and the
typing indicator in action._
