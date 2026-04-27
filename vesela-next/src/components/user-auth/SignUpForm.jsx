"use client";

import { useState } from "react";
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { useFormik } from "formik";
import * as Yup from "yup";

import LabeledInput from "../ui/LabeledInput";
import ModalHeader from "../modals/ModalHeader";

import { postData } from "../../API/apiService";
import CustomButton from "../ui/CustomButton";
import { MODALS } from "../modals/modalConstants";
import FormikDatePicker from "../ui/FormikDatePicker";

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
  const theme = useTheme();

  const [showPwd, setShowPwd] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setErrorMsg("");

        const body = {
          username: values.email,
          password1: values.password,
          password2: values.password,
          email: values.email,
        };

        const response = await postData("/dj-rest-auth/registration/", body);

        if (!response.error && response.status === 201) {
          localStorage.setItem("token", response.data.access);
          localStorage.setItem(
            "userdetails",
            JSON.stringify(response.data.user),
          );

          // refreshPlan();

          handleNext(MODALS.UPDATE_INFO);
        } else {
          const backendMsg =
            response?.data?.username?.[0] ||
            response?.data?.password1?.[0] ||
            "Signup failed. Please try again.";

          setErrorMsg(backendMsg);
        }
      } catch (error) {
        console.error("Signup error:", error);
        setErrorMsg("Something went wrong. Try again.");
      } finally {
        setSubmitting(false);
      }
    },
    validateOnChange: true,
    validateOnBlur: false,
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
        type={showPwd ? "text" : "password"}
        name="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        error={showErrors && Boolean(formik.errors.password)}
        helperText={showErrors && formik.errors.password}
        startIcon={<LockIcon sx={{ fontSize: 16 }} />}
        endIcon={
          <div onClick={handlePasswordToggle} style={{ cursor: "pointer" }}>
            {showPwd ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </div>
        }
      />

      <LabeledInput
        label="Confirm Password"
        type={showPwd ? "text" : "password"}
        name="confirmPassword"
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        error={showErrors && Boolean(formik.errors.confirmPassword)}
        helperText={showErrors && formik.errors.confirmPassword}
        startIcon={<LockIcon sx={{ fontSize: 16 }} />}
      />

      <FormikDatePicker formik={formik} name="dob" label="Date of Birth" />

      <FormControlLabel
        control={
          <Checkbox
            name="agreeToTerms"
            checked={formik.values.agreeToTerms}
            onChange={formik.handleChange}
          />
        }
        label="I agree to Terms & Privacy Policy"
      />

      {showErrors && formik.errors.agreeToTerms && (
        <Typography sx={{ fontSize: 12, color: "red" }}>
          {formik.errors.agreeToTerms}
        </Typography>
      )}

      <Divider sx={{ my: 2 }} />
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography>
          Already have an account?{" "}
          <span
            onClick={goToLogin}
            style={{ cursor: "pointer", fontWeight: 700 }}
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
