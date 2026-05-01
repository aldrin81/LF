import axios from "axios";

export const API_URL = 'http://127.0.0.1:8000/';

const api = axios.create({
  baseURL: API_URL,
});

export async function getItems() {
  const response = await api.get('item/details/');
  return response.data;
}

export async function createLostItem(formData) {
  const response = await api.post('item/report/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function editLostItem(id, data) {
  const response = await api.put(`item/details/update/${id}/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function getItemById(id) {
  const response = await api.get(`item/details/${id}/`);
  return response.data;
}
