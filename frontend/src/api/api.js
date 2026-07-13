import axios from "axios";

export const API_URL = "http://localhost:8000/";

const api = axios.create({
  baseURL: API_URL,
});


// =====================
// CLAIMS
// =====================

export const createClaim = async (data) => {
  const res = await api.post("claim/create/", data);
  return res.data;
};


export const getClaims = async () => {
  const res = await api.get("claim/");
  return res.data;
};


export const reviewClaim = async (id, payload) => {
  const token = localStorage.getItem("accessToken");

  const res = await api.put(
    `claim/review/${id}/`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};



// =====================
// ITEMS
// =====================

export async function getItems(){

  const res = await api.get(
    "item/details/"
  );

  return res.data;
}



export async function createLostItem(formData){

  const res = await api.post(
    "item/create/",
    formData,
    {
      headers:{
        "Content-Type":"multipart/form-data"
      }
    }
  );

  return res.data;
}



export async function editLostItem(id,data){

  const res = await api.put(
    `item/details/${id}/`,
    data,
    {
      headers:{
        "Content-Type":"multipart/form-data"
      }
    }
  );

  return res.data;
}



export async function getItemById(id){

  const res = await api.get(
    `item/details/${id}/`
  );

  return res.data;
}



export async function trackItem(ticketCode){

  const res = await api.get(
    `item/track/${ticketCode}/`
  );

  return res.data;
}



// =====================
// AUTH
// =====================


export async function loginUser(username,password){

  const res = await api.post(
    "account/login/",
    {
      username,
      password
    }
  );


  localStorage.setItem(
    "accessToken",
    res.data.access
  );


  localStorage.setItem(
    "refreshToken",
    res.data.refresh
  );


  return res.data;
}



export async function getUsers(){

  const token =
    localStorage.getItem("accessToken");


  const res = await api.get(
    "account/users/",
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );


  return res.data;
}



export async function getCurrentUser(){

  const token =
    localStorage.getItem("accessToken");


  const res = await api.get(
    "account/current/",
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );


  return res.data;
}



export async function getUserById(id){

  const token =
    localStorage.getItem("accessToken");


  const res = await api.get(
    `account/users/${id}/`,
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );


  return res.data;
}



export async function updateUserById(id,data){

  const token =
    localStorage.getItem("accessToken");


  const res = await api.put(
    `account/users/${id}/`,
    data,
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );


  return res.data;
}



export async function createUser(data){

  const token =
    localStorage.getItem("accessToken");


  const res = await api.post(
    "account/register/",
    data,
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );


  return res.data;
}



export async function changePassword(
  current_password,
  new_password
){

  const token =
    localStorage.getItem("accessToken");


  const res = await api.post(
    "account/change-password/",
    {
      current_password,
      new_password
    },
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );


  return res.data;
}



// =====================
// GAMIFICATION
// =====================


export const getLeaderboard = async () => {
  const res = await api.get("gamification/leaderboard/");
  return res.data;
};

export const getPointsTracking = async () => {
  const res = await api.get("gamification/points-tracking/");
  return res.data;
};

export const getLeaderboardSettings = async () => {
  const res = await api.get("gamification/leaderboard-settings/");
  return res.data;
};

export const updateLeaderboardSettings = async (data) => {
  const res = await api.put("gamification/leaderboard-settings/update/", data);
  return res.data;
};


export const getLeaderboardHistory = async (params = {}) => {
  const response = await api.get("gamification/leaderboard-history/", { params });
  return response.data;
};

export const archiveLeaderboardHistory = async (payload) => {
  const response = await api.post("gamification/leaderboard-history/archive/", payload);
  return response.data;
};