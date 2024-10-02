import React, { createContext, useState } from 'react';

// יצירת קונטקסט חדש
export const UserContext = createContext();

// רכיב שמספק את הקונטקסט
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
  });

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
