"use client";

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
  reasonForSupport,
  handleNext,
}) => {
  const renderModal = () => {
    switch (modalStepName) {
      case MODALS.LOGIN:
        return <LoginForm handleNext={handleNext} />;

      case MODALS.SIGNUP:
        return <SignUpForm handleNext={handleNext} />;

      case MODALS.UPDATE_INFO:
        return <UpdateInfoForm handleNext={handleNext} />;

      case MODALS.ASSESSMENT_ONE:
        return <AssessmentOneForm handleNext={handleNext} />;

      case MODALS.ASSESSMENT_TWO:
        return (
          <AssessmentTwoForm
            reasonForSupport={reasonForSupport}
            handleNext={handleNext}
          />
        );

      case MODALS.SUCCESS_MODAL:
        return (
          <SuccessfulModal successMsg={successMsg} handleNext={handleNext} />
        );

      case MODALS.PLANSMODAL:
        return <PricingPlansContent />;

      default:
        return null;
    }
  };

  if (!modalStepName) return null;

  return (
    <GenericModalWrapper open={true} onClose={onClose}>
      <AnimatePresence mode="wait">
        <motion.div
          key={modalStepName}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          {renderModal()}
        </motion.div>
      </AnimatePresence>
    </GenericModalWrapper>
  );
};

export default AuthFlowManager;
