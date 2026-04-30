import axios from "axios";

const API_BASE_URL = 'http://127.0.0.1:8000/';

export const API_URL = 'http://127.0.0.1:8000/';


export async function getItems() {
      const response = await axios.get(`${API_BASE_URL}item/details/`);
      return response.data;
  }


export async function createLostItem(formData) {
  const response = await axios.post(`${API_BASE_URL}item/report/`, formData);
  return response.data;
}


export async function updateLostItem(id, data) {
      const response = await axios.put(`${API_BASE_URL}item/details/update/${id}/`, data);
      return response.data;
}

export async function getItemById(id) {
  const response = await axios.get(`${API_URL}item/details/${id}/`);
  return response.data;
}

