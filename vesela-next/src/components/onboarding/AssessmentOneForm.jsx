"use client";

import { useState } from "react";
import { Box, Typography, TextField, MenuItem } from "@mui/material";
import CustomButton from "../ui/CustomButton";
import ModalHeader from "../modals/ModalHeader";
import { useUserUpdate } from "@/hooks/useUserUpdate";



const AssessmentOneForm = ({
  handleNext,
  userInfo,
  reasonForSupport,
  setReasonForSupport,
}) => {
  const [gender, setGender] = useState("");

  // ✅ use hook
  const { updateUser, loading, errorMsg } = useUserUpdate(handleNext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reasonForSupport.trim() || !gender) return;
    const payload = {
      ...userInfo,
      gender,
    };

    await updateUser(payload);
  };

  return (
    <>
      <ModalHeader
        title="Begin your assessment"
        subtitle="Answer a few quick questions so our AI can create a basic assessment for you."
      />

      {/* Gender Dropdown */}
      <Typography sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}>
        Select your gender
      </Typography>

      <TextField
        select
        fullWidth
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            height: 40,
          },
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            height: "40px",
            padding: "0 14px",
          },
        }}
      >
        <MenuItem value="">Select gender</MenuItem>
        <MenuItem value="M">Male</MenuItem>
        <MenuItem value="F">Female</MenuItem>
      </TextField>

      {/* Question */}
      <Typography sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}>
        What is the primary reason you are seeking support?
      </Typography>

      <TextField
        multiline
        rows={4}
        value={reasonForSupport}
        onChange={(e) => setReasonForSupport(e.target.value)}
        placeholder="Type your response..."
        fullWidth
        inputProps={{ maxLength: 1000 }}
      />

      <Typography variant="caption" sx={{ textAlign: "right", display: "block", color: "text.secondary" }}>
        {reasonForSupport.length}/1000
      </Typography>

      {/* Error */}
      {errorMsg && (
        <Typography color="error" sx={{ mt: 1 }}>
          {errorMsg}
        </Typography>
      )}

      <Box sx={{ textAlign: "center", mt: 3 }}>
        <CustomButton
          onClick={handleSubmit}
          disabled={!reasonForSupport.trim() || !gender || loading}
        >
          {loading ? "Please wait..." : "Continue"}
        </CustomButton>
      </Box>
    </>
  );
};

export default AssessmentOneForm;
