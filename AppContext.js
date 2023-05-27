/* eslint-disable prettier/prettier */
import React, {createContext, useState} from 'react';

// Create a new context
const AppContext = createContext();

// Create a provider for the context
const AppProvider = ({children}) => {
  const [user, setUser] = useState(null);

  return (
    <AppContext.Provider value={{user, setUser}}>
      {children}
    </AppContext.Provider>
  );
};

export {AppContext, AppProvider};
