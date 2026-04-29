import axios from "axios";

const API_BASE_URL = 'http://127.0.0.1:8000/';


export async function getItems() {
      const response = await axios.get(`${API_BASE_URL}item/details/`);
      return response.data;
  }


export async function createLostItem(data) {
      const response = await axios.post(`${API_BASE_URL}item/report/`, data);
      return response.data;
}