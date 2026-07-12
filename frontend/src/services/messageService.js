import api from './api';

/** GET /api/messages?limit=&offset= - paginated chat history. */
export function fetchMessages({ limit = 50, offset = 0 } = {}) {
  return api.get('/messages', { params: { limit, offset } }).then((res) => res.data);
}

/** POST /api/messages { text } - REST fallback send path. */
export function sendMessageRest(text) {
  return api.post('/messages', { text }).then((res) => res.data);
}

/** PUT /api/messages/read/:id - mark a single message read. */
export function markMessageRead(id) {
  return api.put(`/messages/read/${id}`).then((res) => res.data);
}
