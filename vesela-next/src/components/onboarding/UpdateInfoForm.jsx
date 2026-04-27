"use client";

import { useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

import LabeledInput from "../ui/LabeledInput";
import ModalHeader from "../modals/ModalHeader";

import { useFormik } from "formik";
import * as Yup from "yup";

import { postData } from "../../API/apiService";
import CustomButton from "../ui/CustomButton";
import { MODALS } from "../modals/modalConstants";

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

  const { planDetails } = useAppContext();

  const formik = useFormik({
    initialValues: {
      fname: "",
      lname: "",
      phoneNo: "",
      dob: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setErrorMsg("");

        const response = await postData(
          `${process.env.NEXT_PUBLIC_API_URL}/api/update_user_info/`,
          {
            first_name: values.fname,
            last_name: values.lname,
            phone_number: values.phoneNo,
            date_of_birth: values.dob,
          },
        );

        if (!response.error && response.status === 200) {
          const allowedPlans = ["plan4", "plan42"];

          if (!allowedPlans.includes(planDetails?.plan)) {
            handleNext(MODALS.PLANSMODAL);
          } else {
            handleNext(MODALS.ASSESSMENT_ONE);
          }
        } else {
          setErrorMsg("Failed to update profile");
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("Something went wrong");
      } finally {
        setLoading(false);
      }
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

      {/* <FormikDatePicker formik={formik} name="dob" label="Date of Birth" /> */}

      <Box sx={{ textAlign: "center", mt: 3 }}>
        <CustomButton type="submit" disabled={loading}>
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
