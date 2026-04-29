import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

let lostCounter  = 9;
let foundCounter = 7;
let userCounter  = 7;
let claimCounter = 1; 

export const AppProvider = ({ children }) => {
  const [lostItems,     setLostItems]     = useState([]);
  const [foundItems,    setFoundItems]    = useState([]);
  const [users,         setUsers]         = useState([]);
  const [claimRequests, setClaimRequests] = useState([]);

  // ── LOST ────────────────────────────────────────────────────────────────────
  const addLostItem    = (item) => setLostItems(p => [{ ...item, id: `L${String(lostCounter++).padStart(3,'0')}`, status: 'Pending' }, ...p]);
  const updateLostItem = (id, u) => setLostItems(p => p.map(i => i.id === id ? { ...i, ...u } : i));
  const deleteLostItem = (id)    => setLostItems(p => p.filter(i => i.id !== id));

  // ── FOUND ───────────────────────────────────────────────────────────────────
  const addFoundItem    = (item) => setFoundItems(p => [{ ...item, id: `F${String(foundCounter++).padStart(3,'0')}`, status: 'Available' }, ...p]);
  const updateFoundItem = (id, u) => setFoundItems(p => p.map(i => i.id === id ? { ...i, ...u } : i));
  const deleteFoundItem = (id)    => setFoundItems(p => p.filter(i => i.id !== id));

  // ── USERS ───────────────────────────────────────────────────────────────────
  const addUser    = (user) => setUsers(p => [{ ...user, id: `U${String(userCounter++).padStart(3,'0')}`, status: 'Active' }, ...p]);
  const updateUser = (id, u) => setUsers(p => p.map(x => x.id === id ? { ...x, ...u } : x));
  const deleteUser = (id)    => setUsers(p => p.filter(x => x.id !== id));

  // ── CLAIM REQUESTS ──────────────────────────────────────────────────────────
  // Called from the public landing page when a visitor submits a claim form.
  // This persists into React state so the moderator dashboard can read it.
  const submitClaimRequest = (claim) => {
    const newClaim = {
      ...claim,
      id: `C${String(claimCounter++).padStart(3,'0')}`,
      timestamp: new Date().toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' }),
      status: 'Pending',
    };
    setClaimRequests(p => [newClaim, ...p]);
  };

  const updateClaimRequest = (id, updates) =>
    setClaimRequests(p => p.map(c => c.id === id ? { ...c, ...updates } : c));

  const pendingClaimsCount = claimRequests.filter(c => c.status === 'Pending').length;

  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || '');

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
    <AppContext.Provider value={{
      lostItems,  addLostItem,  updateLostItem,  deleteLostItem,
      foundItems, addFoundItem, updateFoundItem, deleteFoundItem,
      users,      addUser,      updateUser,      deleteUser,
      claimRequests, submitClaimRequest, updateClaimRequest, pendingClaimsCount,
      isLoggedIn, setLogin, userRole, logout
    }}>
      {children}
    </AppContext.Provider>
  );
};