"use client";

import React from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const LabeledInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  startIcon,
  endIcon,
  error = false,
  helperText = "",
  disabled = false,
  multiline = false,
  rows = 1,
  fullWidth = true,
  sx = {},
  inputProps = {},
}) => {
  const theme = useTheme();

  const inputId = `input-${name}`;
  const hasHelper = Boolean(helperText);
  const showError = Boolean(error && helperText);

  return (
    <Box sx={{ mb: 1 }}>
      {label && (
        <Typography
          htmlFor={inputId}
          component="label"
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            display: "block",
            color: theme.palette.text.primary,
            fontSize: 13,
          }}
        >
          {label}
        </Typography>
      )}

      <OutlinedInput
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        fullWidth={fullWidth}
        disabled={disabled}
        multiline={multiline}
        rows={multiline ? rows : undefined}
        error={Boolean(error)}
        inputProps={inputProps}
        sx={{
          borderRadius: "8px",
          backgroundColor: theme.palette.background.modalBackground,
          color: theme.palette.text.primary,
          minHeight: multiline ? "auto" : 42,
          height: multiline ? "auto" : 42,
          boxSizing: "border-box",
          transition: "box-shadow 0.2s ease, border-color 0.2s ease",

          "& .MuiOutlinedInput-input": {
            padding: "8px 12px",
            fontSize: "14px",
            lineHeight: "1.5",
            fontFamily: "inherit",
            height: multiline ? "auto" : "100%",
            boxSizing: "border-box",
            letterSpacing: "normal",

            "&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active": {
              WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.modalBackground} inset !important`,
              WebkitTextFillColor: `${theme.palette.text.primary} !important`,
              caretColor: `${theme.palette.text.primary} !important`,
              borderRadius: "inherit",
              transition: "background-color 5000s ease-in-out 0s",
            },
          },

          "& .MuiInputAdornment-root": {
            color: theme.palette.text.secondary,
            height: "100%",
            maxHeight: "100%",
            display: "flex",
            alignItems: "center",
          },

          "& .MuiOutlinedInput-notchedOutline": {
            borderWidth: "1px !important",
            borderColor: error
              ? theme.palette.error.main
              : theme.palette.divider,
            transition: "border-color 0.2s ease",
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: error
              ? theme.palette.error.main
              : theme.palette.primary.main,
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: "1px !important",
            borderColor: error
              ? theme.palette.error.main
              : theme.palette.primary.main,
          },

          "&.Mui-focused": {
            boxShadow: error
              ? `0 0 0 3px ${theme.palette.error.main}25`
              : `0 0 0 3px ${theme.palette.primary.main}25`,
          },

          ...sx,
        }}
        startAdornment={
          startIcon && (
            <InputAdornment
              sx={{
                "& svg": {
                  fontSize: 18,
                },
              }}
              position="start"
            >
              {startIcon}
            </InputAdornment>
          )
        }
        endAdornment={
          endIcon && (
            <InputAdornment
              sx={{
                "& svg": {
                  fontSize: 18,
                },
              }}
              position="end"
            >
              {endIcon}
            </InputAdornment>
          )
        }
      />

      <FormHelperText
        sx={{
          color: showError ? theme.palette.error.main : theme.palette.text.secondary,
          mt: 0.5,
          ml: 0,
          minHeight: "18px",
          lineHeight: "1.3",
          fontSize: "12px",
          visibility: showError || hasHelper ? "visible" : "hidden",
          display: "block",
        }}
      >
        {showError ? helperText : hasHelper ? helperText : "\u00A0"}
      </FormHelperText>
    </Box>
  );
};

export default LabeledInput;
