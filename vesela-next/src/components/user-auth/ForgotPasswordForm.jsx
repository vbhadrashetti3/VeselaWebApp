"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import LabeledInput from "../ui/LabeledInput";
import ModalHeader from "../modals/ModalHeader";
import CustomButton from "../ui/CustomButton";
import { MODALS } from "../modals/modalConstants";
import { requestPasswordReset, confirmPasswordReset } from "@/services/auth.service";

/**
 * Extracts human-readable backend error messages from Django response payloads.
 */
const extractErrorMessage = (response, fallback = "An error occurred. Please try again.") => {
  if (!response?.data) {
    return response?.message || fallback;
  }
  const d = response.data;
  if (typeof d === "string") {
    const trimmed = d.trim();
    if (trimmed.startsWith("<!DOCTYPE") || trimmed.startsWith("<html") || trimmed.includes("<head>")) {
      return fallback;
    }
    return d;
  }
  if (d.detail) {
    return Array.isArray(d.detail) ? d.detail[0] : d.detail;
  }
  if (d.non_field_errors) {
    return Array.isArray(d.non_field_errors) ? d.non_field_errors[0] : d.non_field_errors;
  }
  if (d.code) {
    return Array.isArray(d.code) ? d.code[0] : d.code;
  }
  if (d.new_password1) {
    return Array.isArray(d.new_password1) ? d.new_password1[0] : d.new_password1;
  }
  if (d.new_password2) {
    return Array.isArray(d.new_password2) ? d.new_password2[0] : d.new_password2;
  }
  if (d.email) {
    return Array.isArray(d.email) ? d.email[0] : d.email;
  }
  if (d.error) return d.error;
  if (d.message) return d.message;

  const firstKey = Object.keys(d)[0];
  if (firstKey && d[firstKey]) {
    const val = d[firstKey];
    return Array.isArray(val) ? `${firstKey}: ${val[0]}` : String(val);
  }

  return fallback;
};

// ─── Step Validation Schemas ──────────────────────────────────────────────────
const step1Schema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email address is required"),
});

const step2Schema = Yup.object({
  code: Yup.string()
    .required("Verification code is required")
    .min(4, "Verification code is too short")
    .trim(),
});

const step3Schema = Yup.object({
  new_password1: Yup.string()
    .min(8, "Minimum 8 characters required")
    .required("New password is required"),
  new_password2: Yup.string()
    .oneOf([Yup.ref("new_password1"), null], "Passwords do not match")
    .required("Please confirm your password"),
});

export default function ForgotPasswordForm({ handleNext }) {
  // Step 1: Enter email -> Request verification code
  // Step 2: Enter 6-digit verification code
  // Step 3: Enter new password & confirm -> Submit confirm endpoint
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ── Step 1 Formik (Email Input & Request Code) ────────────────────────────
  const formikStep1 = useFormik({
    initialValues: { email: "" },
    validationSchema: step1Schema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting }) => {
      setErrorMsg("");
      setInfoMsg("");
      try {
        const trimmedEmail = values.email.trim();
        const response = await requestPasswordReset({ email: trimmedEmail });
        if (!response.error && (response.status === 200 || response.status === 201)) {
          setEmail(trimmedEmail);
          const detailMsg = "We've just sent a 6 digit code to your email. Enter it below to confirm your email address. It should arrive in the next few minutes. If you don’t see it in your inbox, please check your spam/junk folder."
          setInfoMsg(detailMsg);
          setStep(2);
        } else {
          setErrorMsg(extractErrorMessage(response, "Failed to send verification code."));
        }
      } catch (err) {
        console.error("Request password reset error:", err);
        setErrorMsg("An unexpected error occurred. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // ── Step 2 Formik (Verification Code Input) ────────────────────────────────
  const formikStep2 = useFormik({
    initialValues: { code: "" },
    validationSchema: step2Schema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      setErrorMsg("");
      setCode(values.code.trim());
      setStep(3);
    },
  });

  // ── Step 3 Formik (New Password & Confirm) ─────────────────────────────────
  const formikStep3 = useFormik({
    initialValues: { new_password1: "", new_password2: "" },
    validationSchema: step3Schema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting }) => {
      setErrorMsg("");
      try {
        const payload = {
          email,
          code,
          new_password1: values.new_password1,
          new_password2: values.new_password2,
        };

        const response = await confirmPasswordReset(payload);
        if (!response.error && (response.status === 200 || response.status === 201)) {
          setSuccessMsg("Password reset successfully! Redirecting to sign in...");
          setTimeout(() => {
            handleNext?.(MODALS.LOGIN);
          }, 1500);
        } else {
          const errText = extractErrorMessage(
            response,
            "Failed to reset password. Please check your verification code.",
          );
          setErrorMsg(errText);
        }
      } catch (err) {
        console.error("Confirm password reset error:", err);
        setErrorMsg("An unexpected error occurred. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const getHeaderInfo = () => {
    switch (step) {
      case 1:
        return {
          title: "Forgot Password",
          subtitle: "Enter your email address to receive a 6-digit verification code.",
        };
      case 2:
        return {
          title: "Enter Verification Code",
          subtitle: `A 6-digit verification code was sent to ${email || "your email"}.`,
        };
      case 3:
        return {
          title: "Reset Password",
          subtitle: "Enter your new password and confirm it below.",
        };
      default:
        return { title: "Forgot Password", subtitle: "" };
    }
  };

  const headerInfo = getHeaderInfo();

  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);

  // 60-second countdown timer for resending verification code
  useEffect(() => {
    if (step !== 2 || resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [step, resendCooldown]);

  const handleResendCode = async () => {
    if (!email || isResending || resendCooldown > 0) return;
    setErrorMsg("");
    setInfoMsg("");
    setIsResending(true);
    try {
      const response = await requestPasswordReset({ email: email.trim() });
      if (!response.error && (response.status === 200 || response.status === 201)) {
        setInfoMsg("A new 6-digit verification code has been sent to your email address.");
        setResendCooldown(60);
      } else {
        setErrorMsg(extractErrorMessage(response, "Failed to resend verification code."));
      }
    } catch (err) {
      console.error("Resend code error:", err);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleChangeEmail = () => {
    setErrorMsg("");
    setInfoMsg("");
    setResendCooldown(60);
    setStep(1);
  };

  return (
    <Box component="div">
      <ModalHeader title={headerInfo.title} subtitle={headerInfo.subtitle} />

      {/* Backend Error Alert */}
      {errorMsg ? (
        <Typography
          sx={{
            color: "error.main",
            mb: 1.5,
            fontSize: 13,
            fontWeight: 500,
            textAlign: "center",
            bgcolor: (t) =>
              t.palette.mode === "dark"
                ? "rgba(244, 67, 54, 0.12)"
                : "rgba(211, 47, 47, 0.08)",
            p: 1,
            borderRadius: 1,
          }}
        >
          {errorMsg}
        </Typography>
      ) : null}

      {/* Info Alert (Step 2/3) */}
      {infoMsg && !successMsg && !errorMsg ? (
        <Typography
          sx={{
            color: "info.main",
            mb: 1.5,
            fontSize: 13,
            fontWeight: 500,
            textAlign: "center",
            bgcolor: (t) =>
              t.palette.mode === "dark"
                ? "rgba(2, 136, 209, 0.15)"
                : "rgba(2, 136, 209, 0.08)",
            p: 1,
            borderRadius: 1,
          }}
        >
          {infoMsg}
        </Typography>
      ) : null}

      {/* Success Alert */}
      {successMsg ? (
        <Typography
          sx={{
            color: "success.main",
            mb: 1.5,
            fontSize: 14,
            fontWeight: 600,
            textAlign: "center",
            bgcolor: (t) =>
              t.palette.mode === "dark"
                ? "rgba(76, 175, 80, 0.15)"
                : "rgba(46, 125, 50, 0.08)",
            p: 1.2,
            borderRadius: 1,
          }}
        >
          {successMsg}
        </Typography>
      ) : null}

      <AnimatePresence mode="wait" initial={false}>
        {/* Step 1: Email Form */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={formikStep1.handleSubmit} noValidate>
              <LabeledInput
                label="Email Address"
                name="email"
                type="email"
                placeholder="user@example.com"
                value={formikStep1.values.email}
                onChange={formikStep1.handleChange}
                onBlur={formikStep1.handleBlur}
                error={formikStep1.touched.email && formikStep1.errors.email}
                helperText={formikStep1.touched.email ? formikStep1.errors.email : ""}
                startIcon={<EmailOutlinedIcon />}
                disabled={formikStep1.isSubmitting}
              />

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <CustomButton
                  sx={{
                    width: "100%",
                    maxWidth: "320px",
                    height: 44,
                    borderRadius: "24px",
                    fontSize: "15px",
                    fontWeight: 600,
                    mx: "auto",
                  }}
                  type="submit"
                  loading={formikStep1.isSubmitting}
                >
                  Send Verification Code
                </CustomButton>
              </Box>
            </form>
          </motion.div>
        )}

        {/* Step 2: Verification Code Form */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={formikStep2.handleSubmit} noValidate>
              <LabeledInput
                label="6-Digit Verification Code"
                name="code"
                placeholder="e.g. 482913"
                value={formikStep2.values.code}
                onChange={formikStep2.handleChange}
                onBlur={formikStep2.handleBlur}
                error={formikStep2.touched.code && formikStep2.errors.code}
                helperText={formikStep2.touched.code ? formikStep2.errors.code : ""}
                startIcon={<KeyOutlinedIcon />}
              />

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <CustomButton
                  sx={{
                    width: "100%",
                    maxWidth: "320px",
                    height: 44,
                    borderRadius: "24px",
                    fontSize: "15px",
                    fontWeight: 600,
                    mx: "auto",
                  }}
                  type="submit"
                >
                  Verify Code
                </CustomButton>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: 2,
                  px: 0.5,
                }}
              >
                <Typography
                  sx={{
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "text.secondary",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    "&:hover": { color: "primary.main", textDecoration: "underline" },
                  }}
                  onClick={handleChangeEmail}
                >
                  <ArrowBackIcon sx={{ fontSize: 14 }} /> Change email
                </Typography>

                <Typography
                  sx={{
                    cursor: (isResending || resendCooldown > 0) ? "default" : "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    color: (isResending || resendCooldown > 0) ? "text.disabled" : "primary.main",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    "&:hover": { textDecoration: (isResending || resendCooldown > 0) ? "none" : "underline" },
                  }}
                  onClick={(isResending || resendCooldown > 0) ? undefined : handleResendCode}
                >
                  {isResending
                    ? "Resending..."
                    : resendCooldown > 0
                      ? `Resend code in ${resendCooldown}s`
                      : "Resend code"}
                </Typography>
              </Box>
            </form>
          </motion.div>
        )}


        {/* Step 3: Reset Password Form */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={formikStep3.handleSubmit} noValidate>
              <LabeledInput
                label="New Password"
                type={showPass1 ? "text" : "password"}
                name="new_password1"
                placeholder="Minimum 8 characters"
                value={formikStep3.values.new_password1}
                onChange={formikStep3.handleChange}
                onBlur={formikStep3.handleBlur}
                error={formikStep3.touched.new_password1 && formikStep3.errors.new_password1}
                helperText={formikStep3.touched.new_password1 ? formikStep3.errors.new_password1 : ""}
                startIcon={<LockOutlinedIcon />}
                disabled={formikStep3.isSubmitting || Boolean(successMsg)}
                endIcon={
                  <div
                    style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                    onClick={() => setShowPass1(!showPass1)}
                  >
                    {showPass1 ? (
                      <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                    )}
                  </div>
                }
              />

              <LabeledInput
                label="Confirm New Password"
                type={showPass2 ? "text" : "password"}
                name="new_password2"
                placeholder="Re-enter new password"
                value={formikStep3.values.new_password2}
                onChange={formikStep3.handleChange}
                onBlur={formikStep3.handleBlur}
                error={formikStep3.touched.new_password2 && formikStep3.errors.new_password2}
                helperText={formikStep3.touched.new_password2 ? formikStep3.errors.new_password2 : ""}
                startIcon={<LockOutlinedIcon />}
                disabled={formikStep3.isSubmitting || Boolean(successMsg)}
                endIcon={
                  <div
                    style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                    onClick={() => setShowPass2(!showPass2)}
                  >
                    {showPass2 ? (
                      <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                    )}
                  </div>
                }
              />

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <CustomButton
                  sx={{
                    width: "100%",
                    maxWidth: "320px",
                    height: 44,
                    borderRadius: "24px",
                    fontSize: "15px",
                    fontWeight: 600,
                    mx: "auto",
                  }}
                  type="submit"
                  loading={formikStep3.isSubmitting}
                  disabled={Boolean(successMsg)}
                >
                  Reset Password
                </CustomButton>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center", mt: 1.5 }}>
                <Typography
                  sx={{
                    cursor: "pointer",
                    fontSize: 13,
                    color: "text.secondary",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    "&:hover": { color: "primary.main", textDecoration: "underline" },
                  }}
                  onClick={() => {
                    setErrorMsg("");
                    setStep(2);
                  }}
                >
                  <ArrowBackIcon sx={{ fontSize: 14 }} /> Re-enter verification code
                </Typography>
              </Box>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer link: Back to Sign In */}
      <Box sx={{ textAlign: "center", mt: 2.5 }}>
        <Typography variant="body2" sx={{ fontSize: 13, color: "text.secondary" }}>
          Remember your password?{" "}
          <Box
            component="span"
            onClick={() => handleNext?.(MODALS.LOGIN)}
            sx={{
              cursor: "pointer",
              fontWeight: 700,
              color: "primary.main",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Sign in
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}
