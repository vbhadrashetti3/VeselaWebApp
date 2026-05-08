"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import LoginForm from "../user-auth/LoginForm";
import SignUpForm from "../user-auth/SignUpForm";
import UpdateInfoForm from "../onboarding/UpdateInfoForm";
import AssessmentOneForm from "../onboarding/AssessmentOneForm";
import AssessmentTwoForm from "../onboarding/AssessmentTwoForm";
import SuccessfulModal from "../user-auth/SuccessfulModal";
import PricingPlansContent from "../pricing/PricingPlansContent";

import GenericModalWrapper from "./GenericModalWrapper";
import { MODALS } from "./modalConstants";
 

const AuthFlowManager = ({
  modalStepName,
  onClose,
  successMsg,
  handleNext,
}) => {
  const [userInfo, setUserInfo] = useState(null);

  const [reasonForSupport, setReasonForSupport] = useState("");

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

    [MODALS.PLANS]: <PricingPlansContent handleNext={handleNext} />,
  };

  if (!modalStepName) return null;

  return (
    <GenericModalWrapper width={"420px"} open={true} onClose={onClose}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={modalStepName}
          initial={{
            opacity: 0,
            x: 40,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          exit={{
            opacity: 0,
            x: -40,
          }}
          transition={{
            duration: 0.25,
            ease: "easeInOut",
          }}
        >
          {modalComponents[modalStepName] || null}
        </motion.div>
      </AnimatePresence>
    </GenericModalWrapper>
  );
};

export default AuthFlowManager;
