"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import SettingSection from "./SettingSection";
import LabeledInput from "@/components/ui/LabeledInput";
import { changePassword } from "@/services/auth.service";

/**
 * Parses backend error responses from dj-rest-auth / Django REST framework.
 */
const extractBackendErrorMessage = (data, fallback = "Failed to change password. Please check your inputs.") => {
  if (!data) return fallback;
  if (typeof data === "string") return data;

  if (data.detail) {
    return Array.isArray(data.detail) ? data.detail[0] : data.detail;
  }
  if (data.non_field_errors) {
    return Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;
  }
  if (data.old_password) {
    const err = Array.isArray(data.old_password) ? data.old_password[0] : data.old_password;
    return `Current Password: ${err}`;
  }
  if (data.new_password1) {
    const err = Array.isArray(data.new_password1) ? data.new_password1[0] : data.new_password1;
    return `New Password: ${err}`;
  }
  if (data.new_password2) {
    const err = Array.isArray(data.new_password2) ? data.new_password2[0] : data.new_password2;
    return `Confirm Password: ${err}`;
  }
  if (data.message) return data.message;

  const firstKey = Object.keys(data)[0];
  if (firstKey && data[firstKey]) {
    const val = data[firstKey];
    return Array.isArray(val) ? `${firstKey}: ${val[0]}` : String(val);
  }

  return fallback;
};

const validationSchema = Yup.object({
  old_password: Yup.string()
    .required("Current password is required"),
  new_password1: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  new_password2: Yup.string()
    .oneOf([Yup.ref("new_password1"), null], "Passwords do not match")
    .required("Please confirm your new password"),
});

const ChangePasswordContent = () => {
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd1, setShowNewPwd1] = useState(false);
  const [showNewPwd2, setShowNewPwd2] = useState(false);

  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      old_password: "",
      new_password1: "",
      new_password2: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      setApiError("");
      setSuccessMessage("");

      try {
        const res = await changePassword({
          old_password: values.old_password,
          new_password1: values.new_password1,
          new_password2: values.new_password2,
        });

        if (!res.error && (res.status === 200 || res.status === 201)) {
          const msg = res.data?.detail || "Your password has been changed successfully.";
          setSuccessMessage(msg);
          setSnackbarOpen(true);
          resetForm();
        } else {
          const errorData = res.data || res;

          // Map field-specific errors back into Formik
          const fieldErrors = {};
          if (errorData?.old_password) {
            fieldErrors.old_password = Array.isArray(errorData.old_password)
              ? errorData.old_password[0]
              : errorData.old_password;
          }
          if (errorData?.new_password1) {
            fieldErrors.new_password1 = Array.isArray(errorData.new_password1)
              ? errorData.new_password1[0]
              : errorData.new_password1;
          }
          if (errorData?.new_password2) {
            fieldErrors.new_password2 = Array.isArray(errorData.new_password2)
              ? errorData.new_password2[0]
              : errorData.new_password2;
          }

          if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
          }

          const genericError = extractBackendErrorMessage(
            errorData,
            res.message || "Failed to update password. Please check your inputs."
          );
          setApiError(genericError);
        }
      } catch (err) {
        setApiError(err?.message || "An unexpected network error occurred. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <SettingSection
      title="Change Password"
      description="Update your password to maintain the security of your account"
    >
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        noValidate
        sx={{
          maxWidth: 400,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          mt: 1,
        }}
      >
        {/* Error Alert */}
        {apiError && (
          <Alert
            severity="error"
            onClose={() => setApiError("")}
            sx={{ borderRadius: 1.5, fontSize: "0.875rem" }}
          >
            {apiError}
          </Alert>
        )}

        {/* Success Alert */}
        {successMessage && (
          <Alert
            severity="success"
            icon={<CheckCircle2 size={20} />}
            onClose={() => setSuccessMessage("")}
            sx={{ borderRadius: 1.5, fontSize: "0.875rem" }}
          >
            {successMessage}
          </Alert>
        )}

        {/* Current Password Field */}
        <LabeledInput
          label="Current Password"
          type={showOldPwd ? "text" : "password"}
          name="old_password"
          placeholder="Enter your current password"
          value={formik.values.old_password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.old_password && formik.errors.old_password}
          helperText={formik.touched.old_password ? formik.errors.old_password : ""}
          startIcon={<Lock size={18} />}
          endIcon={
            <div
              onClick={() => setShowOldPwd((prev) => !prev)}
              style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
              aria-label={showOldPwd ? "Hide current password" : "Show current password"}
            >
              {showOldPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          }
        />

        {/* New Password Field */}
        <LabeledInput
          label="New Password"
          type={showNewPwd1 ? "text" : "password"}
          name="new_password1"
          placeholder="Enter new password (min. 8 characters)"
          value={formik.values.new_password1}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.new_password1 && formik.errors.new_password1}
          helperText={formik.touched.new_password1 ? formik.errors.new_password1 : ""}
          startIcon={<Lock size={18} />}
          endIcon={
            <div
              onClick={() => setShowNewPwd1((prev) => !prev)}
              style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
              aria-label={showNewPwd1 ? "Hide new password" : "Show new password"}
            >
              {showNewPwd1 ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          }
        />

        {/* Confirm New Password Field */}
        <LabeledInput
          label="Confirm New Password"
          type={showNewPwd2 ? "text" : "password"}
          name="new_password2"
          placeholder="Re-enter new password"
          value={formik.values.new_password2}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.new_password2 && formik.errors.new_password2}
          helperText={formik.touched.new_password2 ? formik.errors.new_password2 : ""}
          startIcon={<Lock size={18} />}
          endIcon={
            <div
              onClick={() => setShowNewPwd2((prev) => !prev)}
              style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
              aria-label={showNewPwd2 ? "Hide confirm password" : "Show confirm password"}
            >
              {showNewPwd2 ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          }
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={formik.isSubmitting}
          aria-busy={formik.isSubmitting}
          sx={{
            mt: 1,
            py: 1.25,
            borderRadius: 1.5,
            fontWeight: 600,
            fontSize: "0.95rem",
            textTransform: "none",
            boxShadow: "none",
            transition: "all 0.2s ease-in-out",
          }}
          startIcon={
            formik.isSubmitting ? (
              <CircularProgress size={18} color="inherit" />
            ) : null
          }
        >
          {formik.isSubmitting ? "Updating Password..." : "Update Password"}
        </Button>

        {/* Success Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            sx={{ width: "100%", borderRadius: 1.5 }}
          >
            {successMessage || "Password updated successfully!"}
          </Alert>
        </Snackbar>
      </Box>
    </SettingSection>
  );
};

export default ChangePasswordContent;
