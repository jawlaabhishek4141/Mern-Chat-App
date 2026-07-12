import api from './api';

/** POST /api/auth/login - dummy username login, returns { token, user }. */
export function login(username) {
  return api.post('/auth/login', { username }).then((res) => res.data);
}
