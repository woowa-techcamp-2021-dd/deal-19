import { AUTH_ENDPOINT } from '../configs/endpoints.js';

function checkTokenValidity (callback) {
  const token = window.localStorage.getItem('_at');

  fetch(AUTH_ENDPOINT, {
    method: 'HEAD',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((res) => {
      callback(res.ok);
    });
}

export default checkTokenValidity;
