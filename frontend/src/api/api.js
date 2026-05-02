import axios from "axios";

export const API_URL = 'http://192.168.1.204:8000/';

const api = axios.create({
  baseURL: API_URL,
});

// FETCH ITEMS (LOST OR FOUND DEPENDS ON TYPE)
export async function getItems() {
  const response = await api.get('item/details/');
  return response.data;
}

//ADDING LOST ITEMS
export async function createLostItem(formData) {
  const response = await api.post('item/report/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

//UPDATE ITEMS
export async function editLostItem(id, data) {
  const response = await api.put(`item/details/update/${id}/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

//FETCH SPECIFIC ITEM DEPENDING ON ID FOR VIEWING
export async function getItemById(id) {
  const response = await api.get(`item/details/${id}/`);
  return response.data;
}


//LOGIN USER
export async function loginUser(username, password) {
  const response = await api.post(`account/login/`, {
    username,
    password,
  });

  localStorage.setItem('accessToken', response.data.access);
  localStorage.setItem('refreshToken', response.data.refresh);

  return response.data;
}

export async function getUsers() {
  const token = localStorage.getItem('accessToken');

  console.log('Token before users request:', token);

  const response = await api.get('account/users/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log('Users response:', response.data);

  return response.data;
}


export async function getCurrentUser() {
  const token = localStorage.getItem('accessToken');

  const response = await api.get(`account/current/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}


export async function getUserById(id) {
  const token = localStorage.getItem('accessToken');

  const response = await api.get(`account/users/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function updateUserById(id, data) {
  const token = localStorage.getItem('accessToken');

  const response = await api.put(`account/users/${id}/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}


export async function createUser(data) {
  const token = localStorage.getItem('accessToken');

  const response = await api.post('account/register/', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
