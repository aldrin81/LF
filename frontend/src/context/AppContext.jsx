import React, { createContext, useContext, useState, useRef } from 'react';
import { createClaim } from "../api/api";

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {

  // =====================
  // STATE
  // =====================
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [users, setUsers] = useState([]);

  // FIX: stable counters (DO NOT reset on rerender)
  const lostCounter = useRef(1);
  const foundCounter = useRef(1);
  const userCounter = useRef(1);

  // =====================
  // CLAIM API
  // =====================
  const submitClaimRequest = async (data) => {
  console.log("Submitting claim payload:", data);

    return await createClaim({
      item: data.item_id,
      claimant_name: data.claimant_name,
      claimant_contact: data.claimant_contact,
      claimant_email: data.claimant_email,
      meeting_date: data.meeting_date,
      meeting_time: data.meeting_time,
      proof_description: data.proof_description,
  });
};

  // =====================
  // LOST ITEMS
  // =====================
  const addLostItem = (item) =>
    setLostItems(p => [
      {
        ...item,
        id: `L${String(lostCounter.current++).padStart(3, '0')}`,
        status: 'Pending'
      },
      ...p
    ]);

  const updateLostItem = (id, u) =>
    setLostItems(p => p.map(i => i.id === id ? { ...i, ...u } : i));

  const deleteLostItem = (id) =>
    setLostItems(p => p.filter(i => i.id !== id));

  // =====================
  // FOUND ITEMS
  // =====================
  const addFoundItem = (item) =>
    setFoundItems(p => [
      {
        ...item,
        id: `F${String(foundCounter.current++).padStart(3, '0')}`,
        status: 'Available'
      },
      ...p
    ]);

  const updateFoundItem = (id, u) =>
    setFoundItems(p => p.map(i => i.id === id ? { ...i, ...u } : i));

  const deleteFoundItem = (id) =>
    setFoundItems(p => p.filter(i => i.id !== id));

  // =====================
  // USERS
  // =====================
  const addUser = (user) =>
    setUsers(p => [
      {
        ...user,
        id: `U${String(userCounter.current++).padStart(3, '0')}`,
        status: 'Active'
      },
      ...p
    ]);

  const updateUser = (id, u) =>
    setUsers(p => p.map(x => x.id === id ? { ...x, ...u } : x));

  const deleteUser = (id) =>
    setUsers(p => p.filter(x => x.id !== id));

  // =====================
  // AUTH
  // =====================
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('isLoggedIn') === 'true'
  );

  const [userRole, setUserRole] = useState(
    () => localStorage.getItem('userRole') || ''
  );

  const setLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', role);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
  };

  return (
    <AppContext.Provider
      value={{
        lostItems,
        foundItems,
        users,

        addLostItem,
        updateLostItem,
        deleteLostItem,

        addFoundItem,
        updateFoundItem,
        deleteFoundItem,

        addUser,
        updateUser,
        deleteUser,

        submitClaimRequest,

        isLoggedIn,
        setLogin,
        userRole,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};