/**
 * Populates the database with a few sample users and a short sample
 * conversation. Safe to re-run - it clears prior seed data first.
 *
 * Usage:  npm run seed   (from the backend/ folder, with .env configured)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const config = require('../src/config/env');
const User = require('../src/models/User');
const Message = require('../src/models/Message');

const SAMPLE_USERS = ['alice', 'bob', 'carol'];

const SAMPLE_CONVERSATION = [
  { from: 'alice', text: 'Hey everyone, welcome to the room! 👋' },
  { from: 'bob', text: 'Hi Alice! Excited to try this out.' },
  { from: 'carol', text: 'Same here — the real-time updates are smooth.' },
  { from: 'alice', text: 'Try opening this in two browser windows to see it live.' },
  { from: 'bob', text: 'Typing indicators work great too.' },
];

async function seed() {
  await mongoose.connect(config.mongoUri);
  console.log(`[seed] Connected to ${mongoose.connection.name}`);

  await Message.deleteMany({});
  await User.deleteMany({ username: { $in: SAMPLE_USERS } });
  console.log('[seed] Cleared prior seed data');

  const userDocs = {};
  for (const username of SAMPLE_USERS) {
    userDocs[username] = await User.create({ username, isOnline: false });
  }
  console.log(`[seed] Created ${SAMPLE_USERS.length} sample users: ${SAMPLE_USERS.join(', ')}`);

  for (const { from, text } of SAMPLE_CONVERSATION) {
    await Message.create({
      sender: userDocs[from]._id,
      senderUsername: from,
      text,
      status: 'read',
    });
  }
  console.log(`[seed] Created ${SAMPLE_CONVERSATION.length} sample messages`);

  await mongoose.disconnect();
  console.log('[seed] Done. Log in as "alice", "bob", or "carol" to see the seeded conversation.');
}

seed().catch((err) => {
  console.error('[seed] Failed:', err.message);
  process.exit(1);
});
