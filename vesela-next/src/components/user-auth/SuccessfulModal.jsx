"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SuccessfulModal = ({ handleNext, successMsg }) => {
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      handleNext && handleNext(null); // close modal
      router.push("/welcome"); // redirect page
    }, 2000); // ⏱️ show for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ textAlign: "center" }}>
      {/* ✅ Next.js Image */}
      <Image
        src="/assets/Log-Successful.png"
        alt="success"
        width={160}
        height={160}
      />

      <Box mt={3}>
        <Typography
          sx={{
            fontSize: "22px",
            fontWeight: 700,
            color: theme.palette.primary.main,
            mb: 1,
          }}
        >
          {successMsg}
        </Typography>

        <Typography sx={{ color: theme.palette.text.primary }}>
          Please wait...
        </Typography>

        <Typography sx={{ color: theme.palette.text.secondary }}>
          Redirecting...
        </Typography>
      </Box>

      <Box mt={3}>
        <CircularProgress />
      </Box>
    </Box>
  );
};

export default SuccessfulModal;