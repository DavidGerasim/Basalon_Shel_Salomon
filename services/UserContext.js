import React, { createContext, useContext, useState } from "react";

// יצירת הקונטקסט
const UserContext = createContext();

// יצירת ה-UserProvider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // מצב משתמש ברירת מחדל

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children} {/* כאן ייכנסו כל הקומפוננטות הפנימיות */}
    </UserContext.Provider>
  );
};

// חיבור לקונטקסט - שימוש ב-user context בכל מקום באפליקציה
export const useUser = () => useContext(UserContext);
