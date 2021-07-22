const request = (url, method, options) => new Promise((resolve, reject) => {
  fetch(url, { method, ...options })
    .then((res) => {
      if (!res.ok) {
        throw res.json();
      }
      resolve(res.json());
    })
    .catch((err) => err)
    .then((err) => {
      if (err) {
        const { message } = err;
        reject(message);
      }
    });
});

export default request;
