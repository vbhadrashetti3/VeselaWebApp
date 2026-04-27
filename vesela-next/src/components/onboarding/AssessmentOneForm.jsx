"use client";

import { useState } from "react";
import { Box, Typography, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";  
import CustomButton from "../ui/CustomButton";
import ModalHeader from "../modals/ModalHeader";
import { MODALS } from "../modals/modalConstants";

const AssessmentOneForm = ({ handleNext }) => {
  const theme = useTheme();
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!value.trim()) return; // basic validation

    handleNext(MODALS.ASSESSMENT_TWO, "", value);
  };

  return (
    <>
      <ModalHeader
        title="Begin your assessment"
        subtitle="Answer a few quick questions so our AI can create a basic assessment for you."
      />

      <Typography sx={{ fontWeight: 600, mb: 1 }}>
        What is the primary reason you are seeking support?
      </Typography>

      <TextField
        multiline
        rows={4}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type your response..."
        fullWidth
      />

      <Typography sx={{ textAlign: "right", fontSize: 12 }}>
        {value.length}/1000
      </Typography>

      <Box sx={{ textAlign: "center", mt: 3 }}>
        <CustomButton onClick={handleSubmit}>Continue</CustomButton>
      </Box>
    </>
  );
};

export default AssessmentOneForm;
