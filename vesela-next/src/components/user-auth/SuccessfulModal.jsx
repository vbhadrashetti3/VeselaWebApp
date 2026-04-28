"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MODALS } from "../modals/modalConstants";

const SuccessfulModal = ({ handleNext, successMsg }) => {
  const router = useRouter();

  useEffect(() => {
    handleNext && handleNext(MODALS.SUCCESS);
  }, []);

  return (
    <Box sx={{ textAlign: "center" }}>
      {/* ✅ Next.js Image */}
      <Image src="/log-Successful.png" alt="success" width={160} height={160} />

      <Box mt={3}>
        <Typography
          sx={{
            fontSize: "22px",
            fontWeight: 700,
            mb: 1,
          }}
        >
          {successMsg}
        </Typography>

        <Typography>Please wait...</Typography>

        <Typography>You will be directed to the homepage.</Typography>
      </Box>

      <Box mt={3}>
        <CircularProgress />
      </Box>
    </Box>
  );
};

export default SuccessfulModal;
