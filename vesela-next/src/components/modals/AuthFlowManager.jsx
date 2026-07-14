"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import LoginForm from "../user-auth/LoginForm";
import SignUpForm from "../user-auth/SignUpForm";
import UpdateInfoForm from "../onboarding/UpdateInfoForm";
import AssessmentOneForm from "../onboarding/AssessmentOneForm";
import AssessmentTwoForm from "../onboarding/AssessmentTwoForm";
import SuccessfulModal from "../user-auth/SuccessfulModal";
import PricingPlansContent from "../pricing/PricingPlansContent";

import GenericModalWrapper from "./GenericModalWrapper";
import { MODALS } from "./modalConstants";
import { getModalStepVariants } from "@/animations/modalMotionVariants";

import { useModal } from "@/context/ModalContext";
import { useColorMode, ColorModeContext } from "@/theme/ThemeRegistry";
import { ThemeProvider } from "@mui/material/styles";
import { getAppTheme, getChatTheme } from "@/theme/theme";

const AuthFlowManager = ({
  modalStepName,
  onClose,
  successMsg,
  handleNext,
}) => {
  const [userInfo, setUserInfo] = useState(null);
  const [reasonForSupport, setReasonForSupport] = useState("");
  const reducedMotion = useReducedMotion();
  const stepVariants = getModalStepVariants(reducedMotion);

  const { modalOptions } = useModal();
  const rootColorMode = useColorMode();

  const isFromChat = modalOptions?.source === "chat";

  const localColorMode = rootColorMode;

  const modalTheme = useMemo(() => {
    if (isFromChat) {
      return getChatTheme(rootColorMode.mode);
    } else {
      return getAppTheme(rootColorMode.mode);
    }
  }, [isFromChat, rootColorMode.mode]);

  const modalComponents = {
    [MODALS.LOGIN]: <LoginForm handleNext={handleNext} />,

    [MODALS.SIGNUP]: <SignUpForm handleNext={handleNext} />,

    [MODALS.UPDATE_INFO]: (
      <UpdateInfoForm setUserInfo={setUserInfo} handleNext={handleNext} />
    ),

    [MODALS.ASSESSMENT_ONE]: (
      <AssessmentOneForm
        userInfo={userInfo}
        setReasonForSupport={setReasonForSupport}
        reasonForSupport={reasonForSupport}
        handleNext={handleNext}
      />
    ),

    [MODALS.ASSESSMENT_TWO]: (
      <AssessmentTwoForm
        reasonForSupport={reasonForSupport}
        handleNext={handleNext}
        onClose={onClose}
      />
    ),

    [MODALS.SUCCESS]: (
      <SuccessfulModal successMsg={successMsg} handleNext={handleNext} />
    ),

    [MODALS.PLANS]: <PricingPlansContent handleNext={handleNext} mdSize={6} />,
  };

  if (!modalStepName) return null;

  return (
    <ColorModeContext.Provider value={localColorMode}>
      <ThemeProvider theme={modalTheme}>
        <GenericModalWrapper width={isFromChat ? 750 : 420} open={true} onClose={onClose}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={modalStepName}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {modalComponents[modalStepName] || null}
            </motion.div>
          </AnimatePresence>
        </GenericModalWrapper>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default AuthFlowManager;
