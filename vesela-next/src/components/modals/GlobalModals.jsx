"use client";

import { useModal } from "@/context/ModalContext";
import AuthFlowManager from "./AuthFlowManager";

const GlobalModals = () => {
  const {
    currentModal,
    closeModal,
    openModal, // optional if needed
  } = useModal();

  return (
    <AuthFlowManager
      modalStepName={currentModal}
      onClose={closeModal}
      handleNext={openModal}
    />
  );
};

export default GlobalModals;