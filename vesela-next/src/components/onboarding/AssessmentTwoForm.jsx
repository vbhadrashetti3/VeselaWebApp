"use client";

import { useState } from "react";
import { Box, Typography, Slider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ModalHeader from "../modals/ModalHeader";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import { useRouter } from "next/navigation";
import CustomButton from "../ui/CustomButton";
import { useAssessment } from "@/hooks/useAssessment";

const AssessmentTwoForm = ({ handleNext, reasonForSupport, onClose }) => {
  const theme = useTheme();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [value, setValue] = useState(0);

  const [assessmentValues, setAssessmentValues] = useState({
    ev: 0,
    env: 0,
    er: 0,
  });

  // ✅ hook usage
  const { submitAssessment, loading, error } = useAssessment(() => {
    handleNext && handleNext("SUCCESS_MODAL", "Sign up Successful");
    router.push("/chat");
  }, onClose);

  const subtitles = {
    1: "On a scale of -5 to +5, how do you feel right now?",
    2: "How is your energy level?",
    3: "How resilient do you feel?",
  };

  const handleSubmit = async () => {
    let updated = { ...assessmentValues };

    if (step === 1) updated.ev = value;
    if (step === 2) updated.env = value;
    if (step === 3) updated.er = value;

    setAssessmentValues(updated);

    // 👉 move to next step
    if (step < 3) {
      setStep(step + 1);
      setValue(updated[step === 1 ? "env" : "er"]);
      return;
    }

    // 👉 final submit
    const payload = {
      ...updated,
      reason_for_support: reasonForSupport || "",
    };

    await submitAssessment(payload);
  };

  return (
    <Box>
      <ModalHeader
        title="Continue your assessment"
        subtitle={subtitles[step]}
      />

      {/* Value */}
      <Typography sx={{ fontSize: 60, textAlign: "center", mb: 2 }}>
        {value}
      </Typography>

      {/* Slider */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <SentimentVeryDissatisfiedIcon />
        <Slider
          value={value}
          onChange={(_, v) => setValue(v)}
          min={-5}
          max={5}
          step={1}
          sx={{ flex: 1 }}
        />
        <SentimentVerySatisfiedIcon />
      </Box>

      {/* Error */}
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {/* Button */}
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CustomButton onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Continue"}
        </CustomButton>
      </Box>
    </Box>
  );
};

export default AssessmentTwoForm;
