"use client";

import { useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

import LabeledInput from "../ui/LabeledInput";
import ModalHeader from "../modals/ModalHeader";

import { useFormik } from "formik";
import * as Yup from "yup";

import CustomButton from "../ui/CustomButton";
import FormikDatePicker from "../ui/FormikDatePicker";
import { useUserUpdate } from "@/hooks/useUserUpdate";
import { MODALS } from "../modals/modalConstants";

const validationSchema = Yup.object({
  fname: Yup.string().required("First name is required"),
  lname: Yup.string().required("Last name is required"),
  phoneNo: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits"),
  dob: Yup.date().nullable().required("Date of birth is required"),
});

const formatDate = (date) => {
  return new Date(date).toISOString().split("T")[0];
};

const UpdateInfoForm = ({ handleNext, setUserInfo }) => {
  const { loading, errorMsg } = useUserUpdate(handleNext);

  const formik = useFormik({
    initialValues: {
      fname: "",
      lname: "",
      phoneNo: "",
      dob: null,
    },
    validationSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values, { setSubmitting, setTouched }) => {
      setTouched({ fname: true, lname: true, phoneNo: true, dob: true });

      if (!validationSchema.isValidSync(values)) {
        setSubmitting(false);
        return;
      }
      const { fname, lname, phoneNo, dob } = values;
      const body = {
        first_name: fname,
        last_name: lname,
        phone_number: phoneNo,
        date_of_birth: formatDate(dob),
      };
      setUserInfo(body);
      handleNext && handleNext(MODALS.ASSESSMENT_ONE);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <ModalHeader
        title="Update your profile"
        subtitle="Add your basic details to continue"
      />

      {errorMsg && (
        <Typography sx={{ color: "error.main", mb: 1 }}>{errorMsg}</Typography>
      )}

      <LabeledInput
        label="First Name"
        name="fname"
        value={formik.values.fname}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.fname && Boolean(formik.errors.fname)}
        helperText={formik.touched.fname ? formik.errors.fname : ""}
      />

      <LabeledInput
        label="Last Name"
        name="lname"
        value={formik.values.lname}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.lname && Boolean(formik.errors.lname)}
        helperText={formik.touched.lname ? formik.errors.lname : ""}
      />

      <LabeledInput
        label="Phone Number"
        name="phoneNo"
        value={formik.values.phoneNo}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.phoneNo && Boolean(formik.errors.phoneNo)}
        helperText={formik.touched.phoneNo ? formik.errors.phoneNo : ""}
      />

      <FormikDatePicker formik={formik} name="dob" label="Date of Birth" />

      <Box sx={{ textAlign: "center", mt: 3 }}>
        <CustomButton
          style={{
            width: "100%",
            maxWidth: "200px",
            borderRadius: "26px",
          }}
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Continue"
          )}
        </CustomButton>
      </Box>
    </form>
  );
};

export default UpdateInfoForm;
