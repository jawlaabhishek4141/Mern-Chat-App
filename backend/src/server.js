const http = require('http');
const { Server } = require('socket.io');
const config = require('./config/env');
const connectDB = require('./config/db');
const createApp = require('./app');
const { registerSocketHandlers } = require('./socket');

async function start() {
  await connectDB();

  const app = createApp();
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: config.clientOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Make `io` reachable from Express controllers (e.g. to broadcast a
  // message created via the REST endpoint).
  app.set('io', io);

  registerSocketHandlers(io);

  server.listen(config.port, () => {
    console.log(`Chat backend listening on http://localhost:${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`Allowing CORS/Socket.io origins: ${config.clientOrigins.join(', ')}`);
  });
}

start().catch((err) => {
  console.error('[server] Failed to start:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});
