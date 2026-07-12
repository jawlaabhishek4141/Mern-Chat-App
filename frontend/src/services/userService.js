import api from './api';

/** GET /api/users/online - currently online users. */
export function fetchOnlineUsers() {
  return api.get('/users/online').then((res) => res.data);
}
