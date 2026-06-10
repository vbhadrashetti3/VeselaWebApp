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
import { localStorageUtil } from "@/utils/localStorageUtil";

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

  const setDarkMode = () => {
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

      {errorMsg && (
        <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1, color: "error.main" }}>
          {errorMsg}
        </Typography>
      )}

      <LabeledInput
        label="Email"
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && formik.errors.email}
        helperText={formik.touched.email ? formik.errors.email : ""}
        startIcon={<EmailOutlinedIcon sx={{ fontSize: 16 }} />}
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
        startIcon={<LockOutlinedIcon sx={{ fontSize: 16 }} />}
        endIcon={
          <div onClick={handlePasswordToggle} style={{ cursor: "pointer" }}>
            {showPwd ? (
              <VisibilityOffOutlinedIcon />
            ) : (
              <VisibilityOutlinedIcon />
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
        startIcon={<LockOutlinedIcon sx={{ fontSize: 16 }} />}
        endIcon={
          <div onClick={handlePasswordToggle} style={{ cursor: "pointer" }}>
            {showPwd ? (
              <VisibilityOffOutlinedIcon />
            ) : (
              <VisibilityOutlinedIcon />
            )}
          </div>
        }
      />

      <FormControlLabel
        control={
          <Checkbox
            size="medium"
            name="agreeToTerms"
            checked={formik.values.agreeToTerms}
            onChange={formik.handleChange}
          />
        }
        label="I agree to Terms & Privacy Policy"
        sx={{
          "& .MuiFormControlLabel-label": {
            fontSize: "14px",
            fontWeight: 500,
          },
        }}
      />

      {showErrors && formik.errors.agreeToTerms && (
        <Typography sx={{ fontSize: 12, color: "error.main" }}>
          {formik.errors.agreeToTerms}
        </Typography>
      )}

      <Divider sx={{ my: 2 }} />
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography>
          Already have an account?{" "}
          <span
            onClick={goToLogin}
            style={{ cursor: "pointer", fontWeight: 700, color: "inherit" }}
          >
            Sign In
          </span>
        </Typography>
      </Box>
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <CustomButton
          style={{
            width: "200px",
            borderRadius: "26px",
          }}
          loading={formik.isSubmitting}
          onClick={handleSubmitClick}
        >
          {formik.isSubmitting ? "Signing up..." : "Sign up"}
        </CustomButton>
      </Box>
    </>
  );
};

export default SignUpForm;
