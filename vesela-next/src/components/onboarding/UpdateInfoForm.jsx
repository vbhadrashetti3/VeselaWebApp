"use client";

import { useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

import LabeledInput from "../ui/LabeledInput";
import ModalHeader from "../modals/ModalHeader";

import { useFormik } from "formik";
import * as Yup from "yup";

import CustomButton from "../ui/CustomButton";
import FormikDatePicker from "../ui/FormikDatePicker";

const validationSchema = Yup.object({
  fname: Yup.string().required("First name is required"),
  lname: Yup.string().required("Last name is required"),
  phoneNo: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits"),
  dob: Yup.date().nullable().required("Date of birth is required"),
});

const UpdateInfoForm = ({ handleNext }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const formik = useFormik({
    initialValues: {
      fname: "",
      lname: "",
      phoneNo: "",
      dob: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <ModalHeader
        title="Update your profile"
        subtitle="Add your basic details to continue"
      />

      {errorMsg && (
        <Typography sx={{ color: "red", mb: 1 }}>{errorMsg}</Typography>
      )}

      <LabeledInput
        label="First Name"
        name="fname"
        value={formik.values.fname}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.fname && Boolean(formik.errors.fname)}
        helperText={formik.touched.fname && formik.errors.fname}
      />

      <LabeledInput
        label="Last Name"
        name="lname"
        value={formik.values.lname}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.lname && Boolean(formik.errors.lname)}
        helperText={formik.touched.lname && formik.errors.lname}
      />

      <LabeledInput
        label="Phone Number"
        name="phoneNo"
        value={formik.values.phoneNo}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.phoneNo && Boolean(formik.errors.phoneNo)}
        helperText={formik.touched.phoneNo && formik.errors.phoneNo}
      />

      <FormikDatePicker formik={formik} name="dob" label="Date of Birth" />

      <Box sx={{ textAlign: "center", mt: 3 }}>
        <CustomButton
          style={{
            width: "200px",
            borderRadius: "26px",
          }}
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: "#fff" }} />
          ) : (
            "Continue"
          )}
        </CustomButton>
      </Box>
    </form>
  );
};

export default UpdateInfoForm;
