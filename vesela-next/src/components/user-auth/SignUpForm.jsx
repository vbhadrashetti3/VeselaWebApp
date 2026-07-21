"use client";

import { useState } from "react";
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Typography,
} from "@mui/material";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import { useFormik } from "formik";
import * as Yup from "yup";

import LabeledInput from "../ui/LabeledInput";
import ModalHeader from "../modals/ModalHeader";

import CustomButton from "../ui/CustomButton";
import { MODALS } from "../modals/modalConstants";
import { useSignUp } from "@/hooks/useSignUp";
import { useColorMode } from "@/theme/ThemeRegistry";
import { useModal } from "@/context/ModalContext";
import { localStorageUtil } from "@/utils/localStorageUtil";
import GoogleLoginButton from "./GoogleLoginButton";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please re-enter your password"),
  agreeToTerms: Yup.boolean().oneOf(
    [true],
    "You must agree to the Terms and Privacy Policy",
  ),
});

const SignUpForm = ({ handleNext }) => {
  const [showPwd, setShowPwd] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const { mode, toggleColorMode } = useColorMode();
  const { modalOptions } = useModal();

  const setDarkMode = () => {
    if (modalOptions?.source === "chat") {
      return;
    }
    if (mode !== "dark") {
      localStorageUtil.set("theme", "dark");
      toggleColorMode();
    }
  };

  const { errorMsg, signUp } = useSignUp(handleNext, setDarkMode);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setTouched }) => {
      setTouched({
        email: true,
        password: true,
        confirmPassword: true,
        agreeToTerms: true,
      });

      if (!validationSchema.isValidSync(values)) {
        setSubmitting(false);
        return;
      }

      const body = {
        username: values.email,
        password1: values.password,
        password2: values.password,
        email: values.email,
      };

      signUp(body, setSubmitting);
    },
    validateOnChange: false,
    validateOnBlur: true,
  });

  const handlePasswordToggle = () => setShowPwd((prev) => !prev);

  const handleSubmitClick = (e) => {
    e.preventDefault();
    setShowErrors(true);
    formik.handleSubmit(e);
  };

  const goToLogin = () => handleNext(MODALS.LOGIN); // ✅ FIX

  return (
    <>
      <ModalHeader
        marginBottom="20px"
        title="Create an account"
        subtitle="We will send a verification link to your email."
      />

      {errorMsg ? (
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 500,
            mb: 1.5,
            color: "error.main",
            textAlign: "center",
          }}
        >
          {errorMsg}
        </Typography>
      ) : null}

      <LabeledInput
        label="Email"
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && formik.errors.email}
        helperText={formik.touched.email ? formik.errors.email : ""}
        startIcon={<EmailOutlinedIcon sx={{ fontSize: 18 }} />}
      />

      <LabeledInput
        label="Password"
        type={showPwd ? "text" : "password"}
        name="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && formik.errors.password}
        helperText={formik.touched.password ? formik.errors.password : ""}
        startIcon={<LockOutlinedIcon sx={{ fontSize: 18 }} />}
        endIcon={
          <div onClick={handlePasswordToggle} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
            {showPwd ? (
              <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
            ) : (
              <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
            )}
          </div>
        }
      />

      <LabeledInput
        label="Confirm Password"
        type={showPwd ? "text" : "password"}
        name="confirmPassword"
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.confirmPassword && formik.errors.confirmPassword}
        helperText={
          formik.touched.confirmPassword ? formik.errors.confirmPassword : ""
        }
        startIcon={<LockOutlinedIcon sx={{ fontSize: 18 }} />}
        endIcon={
          <div onClick={handlePasswordToggle} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
            {showPwd ? (
              <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
            ) : (
              <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
            )}
          </div>
        }
      />

      <Box sx={{ mt: -0.5, mb: 1 }}>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              name="agreeToTerms"
              checked={formik.values.agreeToTerms}
              onChange={formik.handleChange}
            />
          }
          label="I agree to Terms & Privacy Policy"
          sx={{
            "& .MuiFormControlLabel-label": {
              fontSize: "13px",
              fontWeight: 500,
            },
          }}
        />

        <Typography
          sx={{
            fontSize: 12,
            color: "error.main",
            minHeight: "18px",
            lineHeight: "1.3",
            ml: 4,
            display: "block",
            visibility: showErrors && formik.errors.agreeToTerms ? "visible" : "hidden",
          }}
        >
          {showErrors && formik.errors.agreeToTerms ? formik.errors.agreeToTerms : "\u00A0"}
        </Typography>
      </Box>

      <Box sx={{ textAlign: "center", mt: 1 }}>
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
          loading={formik.isSubmitting}
          onClick={handleSubmitClick}
        >
          {formik.isSubmitting ? "Signing up..." : "Sign up"}
        </CustomButton>
      </Box>

      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography variant="body2" sx={{ fontSize: 13, color: "text.secondary" }}>
          Already have an account?{" "}
          <Box
            component="span"
            onClick={goToLogin}
            sx={{
              cursor: "pointer",
              fontWeight: 700,
              color: "primary.main",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Sign In
          </Box>
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
        <Divider sx={{ flex: 1 }} />
        <Typography variant="body2" sx={{ mx: 2, color: "text.secondary", fontSize: 13 }}>
          or
        </Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>

      <GoogleLoginButton handleNext={handleNext} setDarkMode={setDarkMode} />
    </>
  );
};

export default SignUpForm;
