"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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

import LabeledInput from "../ui/LabeledInput";
import ModalHeader from "../modals/ModalHeader";
import CustomButton from "../ui/CustomButton";
import { MODALS } from "../modals/modalConstants";

import { useLogin } from "@/hooks/useLogin";
import { useColorMode } from "@/theme/ThemeRegistry";
import { useModal } from "@/context/ModalContext";
import { localStorageUtil } from "@/utils/localStorageUtil";
import GoogleLoginButton from "./GoogleLoginButton";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Minimum 8 characters")
    .required("Password is required"),
});
const LoginForm = ({ handleNext }) => {
  const [show, setShow] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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

  const { login, errorMsg } = useLogin(handleNext, setDarkMode);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values, { setSubmitting, setTouched }) => {
      setTouched({ email: true, password: true });

      if (!validationSchema.isValidSync(values)) {
        setSubmitting(false);
        return;
      }

      login(values, setSubmitting);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <ModalHeader
        title="Welcome"
        subtitle="Please enter your email & password"
      />

      {errorMsg && (
        <Typography sx={{ color: "error.main", mb: 1 }}>{errorMsg}</Typography>
      )}

      <LabeledInput
        label="Email"
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && formik.errors.email}
        helperText={formik.touched.email ? formik.errors.email : ""}
        startIcon={<EmailOutlinedIcon />}
      />

      <LabeledInput
        label="Password"
        type={show ? "text" : "password"}
        name="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && formik.errors.password}
        helperText={formik.touched.password ? formik.errors.password : ""}
        startIcon={<LockOutlinedIcon />}
        endIcon={
          <div style={{ cursor: "pointer" }} onClick={() => setShow(!show)}>
            {show ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
          </div>
        }
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              size="medium"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
          }
          label="Remember me"
          sx={{
            "& .MuiFormControlLabel-label": {
              fontSize: "14px",
              fontWeight: 500,
            },
          }}
        />

        <Typography
          sx={{
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 14,
          }}
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

      <Divider sx={{ my: 2 }} />

      <Box sx={{ textAlign: "center" }}>
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
            width: "100%",
            maxWidth: "200px",
            borderRadius: "26px",
          }}
          type="submit"
          loading={formik.isSubmitting}
        >
          Login
        </CustomButton>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
        <Divider sx={{ flex: 1 }} />
        <Typography variant="body2" sx={{ mx: 2, color: "text.secondary" }}>
          or
        </Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>

      <GoogleLoginButton handleNext={handleNext} setDarkMode={setDarkMode} />
    </form>
  );
};

export default LoginForm;
