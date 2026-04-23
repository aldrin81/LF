import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const INITIAL_LOST = [
  { id: 'L001', name: 'Pink Tumbler',  cat: 'Personal',    reporter: 'Aldrin Suarez Jr',   area: 'Canteen',          date: '03-31-26', time: '08:42 AM', status: 'Pending', desc: 'Pink starbucks tumbler with straw', photo: null },
  { id: 'L002', name: 'Luxury Watch',  cat: 'Accessories', reporter: 'Keichi Ren Petilla', area: 'Gym',              date: '03-11-26', time: '01:15 PM', status: 'Pending', desc: 'Silver metal watch', photo: null },
  { id: 'L003', name: 'Cash (500)',     cat: 'Cash/Cards',  reporter: 'Vherleen Higoy',     area: 'Library',          date: '01-22-26', time: '10:00 AM', status: 'Claimed', desc: 'Five hundred peso bill', photo: null },
  { id: 'L004', name: 'Tumbler',       cat: 'Personal',    reporter: 'Jerica Princena',    area: 'Parking Lot',      date: '12-10-25', time: '02:30 PM', status: 'Pending', desc: 'Black tumbler', photo: null },
  { id: 'L005', name: 'Laptop',        cat: 'Electronics', reporter: 'Daphne Rivera',      area: 'Library',          date: '05-13-25', time: '09:00 AM', status: 'Pending', desc: 'Acer laptop silver', photo: null },
  { id: 'L006', name: 'ID Card',       cat: 'Personal',    reporter: 'Mark Santos',        area: 'SAO Waiting Area', date: '03-01-26', time: '11:20 AM', status: 'Claimed', desc: 'SLC student ID', photo: null },
  { id: 'L007', name: 'Umbrella',      cat: 'Personal',    reporter: 'Liza Cruz',          area: 'Main Building',    date: '02-14-26', time: '03:45 PM', status: 'Claimed', desc: 'Black umbrella', photo: null },
  { id: 'L008', name: 'Earphones',     cat: 'Electronics', reporter: 'Paolo Reyes',        area: 'Canteen',          date: '01-10-26', time: '12:00 PM', status: 'Pending', desc: 'White earphones JBL', photo: null },
];

const INITIAL_FOUND = [
  { id: 'F001', name: 'Water Bottle',  cat: 'Personal',    finder: 'Aldrin Suarez Jr',   area: 'Canteen',          date: '03-31-26', time: '08:50 AM', status: 'Claimed',   desc: 'Blue water bottle', photo: null },
  { id: 'F002', name: 'iPhone 14',     cat: 'Electronics', finder: 'Keichi Ren Petilla', area: 'SAO Waiting Area', date: '03-11-26', time: '01:30 PM', status: 'Available', desc: 'Black iPhone 14', photo: null },
  { id: 'F003', name: 'Coin Purse',    cat: 'Personal',    finder: 'Vherleen Higoy',     area: 'Parking Lot',      date: '01-22-26', time: '10:15 AM', status: 'Claimed',   desc: 'Small pink coin purse', photo: null },
  { id: 'F004', name: 'Gold Watch',    cat: 'Accessories', finder: 'Jerica Princena',    area: 'Main Building',    date: '12-10-25', time: '02:00 PM', status: 'Available', desc: 'Gold watch Casio', photo: null },
  { id: 'F005', name: 'Shoes',         cat: 'Personal',    finder: 'Daphne Rivera',      area: 'Canteen',          date: '05-13-25', time: '09:30 AM', status: 'Claimed',   desc: 'White rubber shoes size 7', photo: null },
  { id: 'F006', name: 'Notebook',      cat: 'Personal',    finder: 'Mark Santos',        area: 'Library',          date: '02-20-26', time: '04:00 PM', status: 'Available', desc: 'Blue spiral notebook', photo: null },
];

const INITIAL_USERS = [
  { id: 'U001', name: 'Aldrin Suarez Jr',   idNum: '23100101', role: 'Admin',     email: 'aldrin@slc.edu.ph',   status: 'Active' },
  { id: 'U002', name: 'Keichi Ren Petilla', idNum: '23100102', role: 'User',      email: 'keichi@slc.edu.ph',   status: 'Active' },
  { id: 'U003', name: 'Vherleen Higoy',     idNum: '23100232', role: 'Moderator', email: 'vherleen@slc.edu.ph', status: 'Active' },
  { id: 'U004', name: 'Jerica Princena',    idNum: '23132393', role: 'User',      email: 'jerica@slc.edu.ph',   status: 'Active' },
  { id: 'U005', name: 'Daphne Rivera',      idNum: '23293971', role: 'User',      email: 'daphne@slc.edu.ph',   status: 'Active' },
  { id: 'U006', name: 'Mark Santos',        idNum: '23100310', role: 'User',      email: 'mark@slc.edu.ph',     status: 'Active' },
];

let lostCounter  = 9;
let foundCounter = 7;
let userCounter  = 7;
let claimCounter = 1;

export const AppProvider = ({ children }) => {
  const [lostItems,     setLostItems]     = useState(INITIAL_LOST);
  const [foundItems,    setFoundItems]    = useState(INITIAL_FOUND);
  const [users,         setUsers]         = useState(INITIAL_USERS);
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

  return (
    <AppContext.Provider value={{
      lostItems,  addLostItem,  updateLostItem,  deleteLostItem,
      foundItems, addFoundItem, updateFoundItem, deleteFoundItem,
      users,      addUser,      updateUser,      deleteUser,
      claimRequests, submitClaimRequest, updateClaimRequest, pendingClaimsCount,
    }}>
      {children}
    </AppContext.Provider>
  );
};