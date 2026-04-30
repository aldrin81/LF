import axios from "axios";

export const API_URL = 'http://127.0.0.1:8000/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getItems() {
  const response = await api.get('item/details/');
  return response.data;
}

export async function createLostItem(formData) {
  // If formData is an instance of FormData, axios will automatically set Content-Type to multipart/form-data
  const response = await api.post('item/report/', formData);
  return response.data;
}

export async function updateLostItem(id, data) {
  const response = await api.put(`item/details/update/${id}/`, data);
  return response.data;
}

export async function getItemById(id) {
  const response = await api.get(`item/details/${id}/`);
  return response.data;
}

