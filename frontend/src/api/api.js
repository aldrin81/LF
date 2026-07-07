import axios from "axios";

export const API_URL = "http://localhost:8000/";

const api = axios.create({
  baseURL: API_URL,
});

export const createClaim = async (data) => {
  const res = await api.post("claim/create/", data);
  return res.data;
};

export const getClaims = async () => {
  const res = await api.get("claim/");
  return res.data;
};

export const scheduleMeeting = async (id, meeting_date) => {
  const res = await api.put(`claim/schedule/${id}/`, {
    meeting_date
  });
  return res.data;
};
// =====================
// ITEMS
// =====================

// GET ALL ITEMS
export async function getItems() {
  const response = await api.get("item/details/");
  return response.data;
}

// CREATE ITEM
export async function createLostItem(formData) {
  const response = await api.post("item/create/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

// UPDATE ITEM
export async function editLostItem(id, data) {
  const response = await api.put(`item/details/${id}/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

// GET ITEM BY ID
export async function getItemById(id) {
  const response = await api.get(`item/details/${id}/`);
  return response.data;
}

// =====================
// TRACKING (🔥 FIXED)
// =====================

export async function trackItem(ticketCode) {
  const response = await api.get(`item/track/${ticketCode}/`);
  return response.data;
}


// =====================
// AUTH (unchanged)
// =====================

export async function loginUser(username, password) {
  const response = await api.post("account/login/", {
    username,
    password,
  });

  localStorage.setItem("accessToken", response.data.access);
  localStorage.setItem("refreshToken", response.data.refresh);

  return response.data;
}

export async function getUsers() {
  const token = localStorage.getItem("accessToken");

  const response = await api.get("account/users/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function getCurrentUser() {
  const token = localStorage.getItem("accessToken");

  const response = await api.get("account/current/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function getUserById(id) {
  const token = localStorage.getItem("accessToken");

  const response = await api.get(`account/users/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function updateUserById(id, data) {
  const token = localStorage.getItem("accessToken");
  const response = await api.put(`account/users/${id}/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function createUser(data) {
  const token = localStorage.getItem("accessToken");

  const response = await api.post("account/register/", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function changePassword(current_password, new_password) {
  const token = localStorage.getItem("accessToken");

  const response = await api.post(
    "account/change-password/",
    {
      current_password,
      new_password,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

//LEADERBOARD API
export const getLeaderboard = async () => {
  const res = await api.get("gamification/leaderboard/");
  return res.data;
};

//POINTS TRACKING API
export const getPointsTracking = async () => {
  const res = await api.get("gamification/points-tracking/");
  return res.data;
};