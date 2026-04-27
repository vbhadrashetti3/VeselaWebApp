"use client";

import { useTheme } from "@mui/material/styles";
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import LabeledInput from "../ui/LabeledInput";
import ModalHeader from "../modals/ModalHeader";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";

import { postData } from "../../API/apiService";

import { useRouter } from "next/navigation"; // ✅ FIX
import CustomButton from "../ui/CustomButton";
import { MODALS } from "../modals/modalConstants";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginForm = ({ handleNext }) => {
  const router = useRouter(); // ✅ FIX
  const theme = useTheme();

  const [show, setShow] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setErrorMsg("");

      const response = await postData("/dj-rest-auth/login/", values);

      if (!response.error && response.status === 200) {
        localStorage.setItem("token", response.data.access);
        localStorage.setItem("userdetails", JSON.stringify(response.data.user));

        handleNext(MODALS.SUCCESS_MODAL, "Log in Successful!");

        const redirectTo = localStorage.getItem("postLoginNavigateTo");

        if (redirectTo) {
          router.push(redirectTo); // ✅ FIX
        }
      } else {
        const backendMsg =
          response?.data?.detail ||
          response?.data?.non_field_errors?.[0] ||
          "Login failed. Please try again.";

        setErrorMsg(backendMsg);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: handleSubmit,
    validateOnChange: true,
    validateOnBlur: false,
  });

  const handlePasswordToggle = () => setShow((prev) => !prev);

  const handleLoginClick = (e) => {
    e.preventDefault();
    setShowErrors(true);
    formik.handleSubmit(e);
  };

  return (
    <div style={{ minHeight: "480px" }}>
      <ModalHeader
        title="Welcome"
        subtitle="Please enter your email & password to sign in."
      />

      {errorMsg && (
        <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1, color: "red" }}>
          {errorMsg}
        </Typography>
      )}

      <LabeledInput
        label="Email"
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={showErrors && Boolean(formik.errors.email)}
        helperText={showErrors && formik.errors.email}
        startIcon={<EmailIcon sx={{ fontSize: 16 }} />}
      />

      <LabeledInput
        label="Password"
        type={show ? "text" : "password"}
        name="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        error={showErrors && Boolean(formik.errors.password)}
        helperText={showErrors && formik.errors.password}
        startIcon={<LockIcon sx={{ fontSize: 16 }} />}
        endIcon={
          <div onClick={handlePasswordToggle} style={{ cursor: "pointer" }}>
            {show ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </div>
        }
      />

      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
          }
          sx={{ fontSize: 14 }}
          label="Remember me"
        />

        <Typography
          sx={{ cursor: "pointer", fontWeight: 600, fontSize: 14 }}
          onClick={() =>
            window.open(
              "https://portal.grayskyai.com/accounts/password/reset/",
              "_blank",
            )
          }
        >
          Forgot password?
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography>
          Don’t have an account?{" "}
          <span
            onClick={() => handleNext(MODALS.SIGNUP)}
            style={{ cursor: "pointer", fontWeight: 700 }}
          >
            Sign up
          </span>
        </Typography>
      </Box>
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <CustomButton
          style={{
            width: "200px",
            borderRadius: "26px",
          }}
          loading={formik.isSubmitting}
          onClick={handleLoginClick}
        >
          {formik.isSubmitting ? "Logging in..." : "Login"}
        </CustomButton>
      </Box>
    </div>
  );
};

export default LoginForm;
