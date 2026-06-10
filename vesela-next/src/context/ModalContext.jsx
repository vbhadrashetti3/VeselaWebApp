"use client";

import { createContext, useContext, useState } from "react";

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [currentModal, setCurrentModal] = useState(null);
  const [modalOptions, setModalOptions] = useState({});

  const openModal = (modal, options) => {
    setCurrentModal(modal);
    if (options !== undefined) {
      setModalOptions(options || {});
    } else {
      setModalOptions((prev) => prev || {});
    }
  };
  
  const closeModal = () => {
    setCurrentModal(null);
    setModalOptions({});
  };

  return (
    <ModalContext.Provider
      value={{
        currentModal,
        modalOptions,
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
