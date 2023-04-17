import React, { createContext, useContext, useState } from "react";

// Define properties of the globally used object
const GlobalStateContext = createContext({
  state: {},
  setState: () => {},
});

// Setter and Getter for the global object
const GlobalStateProvider = ({ children, value }) => {
  const [state, setState] = useState(value || {});
  return (
    <GlobalStateContext.Provider value={{ state, setState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// Export
const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateContext");
  }
  return context;
};

export { GlobalStateProvider, useGlobalState };
