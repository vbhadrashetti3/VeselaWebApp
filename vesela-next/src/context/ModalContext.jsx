"use client";

import { createContext, useContext, useState } from "react";

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [currentModal, setCurrentModal] = useState(null);

  const openModal = (modal) => setCurrentModal(modal);
  const closeModal = () => setCurrentModal(null);

  return (
    <ModalContext.Provider
      value={{
        currentModal,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used inside ModalProvider");
  }

  return context;
};
