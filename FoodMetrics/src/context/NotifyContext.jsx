import React, { createContext, useContext, useState } from "react";

const NotifyContext = createContext();

export const NotifyProvider = ({ children }) => {
  const [message, setMessage] = useState(null);

  const showNotify = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 6000);
  };

  return (
    <NotifyContext.Provider value={{ message, showNotify }}>
      {children}
    </NotifyContext.Provider>
  );
};

export const useNotify = () => useContext(NotifyContext);
