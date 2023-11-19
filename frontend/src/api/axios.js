import axios from 'axios';

const instance = axios.create({
  baseURL: "http://18.189.7.189:5000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    instance.get(url, { params }).then(
      (response) => {
        resolve(response.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    instance.post(url, data).then(
      (response) => {
        resolve(response.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

export function postFile(url, file, email) {
  let formData = new FormData();
  formData.append('file', file);
  formData.append('email', email);

  return new Promise((resolve, reject) => {
    axios.post(url, formData, {
      baseURL: instance.defaults.baseURL,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(
      (response) => {
        resolve(response.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}