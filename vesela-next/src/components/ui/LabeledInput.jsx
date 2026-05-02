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

  return (
    <Box sx={{ mb: 2 }}>
      {label && (
        <Typography
          htmlFor={inputId}
          component="label"
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            mb: 0.5,
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
        error={error}
        inputProps={inputProps}
        sx={{
          borderRadius: "5px",
          backgroundColor: theme.palette.background.modalBackground,
          color: theme.palette.text.primary,
          minHeight: multiline ? "auto" : 40,

          "& .MuiOutlinedInput-input": {
            padding: "8px 10px",
            fontSize: "14px",
            letterSpacing: type === "password" ? "0.1em" : "normal",
          },

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: error
              ? theme.palette.error.main
              : theme.palette.divider,
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 1,
          },

          ...sx,
        }}
        startAdornment={
          startIcon && (
            <InputAdornment
              sx={{
                "& svg": {
                  fontSize: 16,
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
                  fontSize: 16,
                },
              }}
              position="end"
            >
              {endIcon}
            </InputAdornment>
          )
        }
      />

      {error && helperText && (
        <FormHelperText
          sx={{
            color: theme.palette.error.main,
            mt: 0.5,
            ml: 0,
          }}
        >
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default LabeledInput;
