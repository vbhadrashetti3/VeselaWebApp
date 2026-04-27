"use client";

import React from "react";
import { Box, Typography, FormHelperText } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CalendarToday } from "@mui/icons-material";

const FormikDatePicker = ({ formik, name, label, disableFuture = true }) => {
  const theme = useTheme();

  const showError =
    Boolean(formik.errors[name]) &&
    (formik.touched[name] || formik.submitCount > 0);

  const inputId = `datepicker-${name}`;

  return (
    <Box sx={{ mb: 2 }}>
      {/* Label (same as LabeledInput) */}
      {label && (
        <Typography
          component="label"
          htmlFor={inputId}
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            color: theme.palette.text.primary,
            display: "block",
          }}
        >
          {label}
        </Typography>
      )}

      <DatePicker
        value={formik.values[name] || null}
        onChange={(value) => formik.setFieldValue(name, value)}
        onAccept={() => formik.setFieldTouched(name, true)}
        disableFuture={disableFuture}
        format="dd/MM/yyyy"
        slots={{
          openPickerIcon: CalendarToday,
        }}
        slotProps={{
          textField: {
            id: inputId,
            fullWidth: true,
            name,
            onBlur: formik.handleBlur,
            error: showError,

            placeholder: "DD/MM/YYYY",

            sx: {
              "& .MuiOutlinedInput-root": {
                height: 40,
                borderRadius: 1.5,
                backgroundColor: theme.palette.background.modalBackground,
                padding: 0, // ❗ important: reset container padding
              },

              // ✅ MAIN FIX (THIS controls actual layout)
              "& .MuiPickersInputBase-root": {
                height: 40,
                padding: "0 12px",
                display: "flex",
                alignItems: "center",
              },

              // ✅ THIS is what you were missing
              "& .MuiPickersSectionList-root": {
                padding: "0 !important",
              },

              // ✅ actual input text spacing
              "& .MuiPickersInputBase-input": {
                padding: "0 !important",
                height: "100%",
                display: "flex",
                alignItems: "center",
                fontWeight: 500,
              },

              "& input": {
                padding: "0 !important",
                height: "100%",
              },
            },
          },

          openPickerIcon: {
            sx: {
              fontSize: 18,
              color: theme.palette.text.secondary,
              cursor: "pointer",
            },
          },
        }}
      />

      {/* Error text (same style as LabeledInput) */}
      {showError && formik.errors[name] && (
        <FormHelperText
          sx={{
            color: theme.palette.error.main,
            mt: 0.5,
            ml: 0,
          }}
        >
          {formik.errors[name]}
        </FormHelperText>
      )}
    </Box>
  );
};

export default FormikDatePicker;
