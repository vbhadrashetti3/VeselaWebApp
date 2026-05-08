const EASE_OUT = [0.16, 1, 0.3, 1];

/**
 * Reusable variants for premium modal and step transitions.
 * Each builder supports reduced-motion to improve accessibility.
 */
export const getModalContainerVariants = (reducedMotion = false) => {
  if (reducedMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.12 } },
      exit: { opacity: 0, transition: { duration: 0.1 } },
    };
  }

  return {
    initial: { opacity: 0, scale: 0.96, y: 12 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.22, ease: EASE_OUT },
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      y: 8,
      transition: { duration: 0.16, ease: EASE_OUT },
    },
  };
};

export const getModalStepVariants = (reducedMotion = false) => {
  if (reducedMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.12 } },
      exit: { opacity: 0, transition: { duration: 0.1 } },
    };
  }

  return {
    initial: { opacity: 0, x: 16 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2, ease: EASE_OUT },
    },
    exit: {
      opacity: 0,
      x: -14,
      transition: { duration: 0.16, ease: EASE_OUT },
    },
  };
};
