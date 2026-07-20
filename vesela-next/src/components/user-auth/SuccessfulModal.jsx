"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect } from "react";
import Image from "next/image";
import { useModal } from "@/context/ModalContext";
import { POST_LOGIN_NAVIGATE_TO } from "@/constant";
import { useRouter } from "next/navigation";
import { localStorageUtil } from "@/utils/localStorageUtil";

const SuccessfulModal = ({ handleNext, successMsg }) => {
  const { closeModal } = useModal();
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      const redirectTo = localStorageUtil.get(POST_LOGIN_NAVIGATE_TO);
      if (redirectTo) router.push(redirectTo);
      else {
        router.push("/welcome");
      }
      closeModal();
    }, 2000);
    return () => clearTimeout(timer);
  }, [closeModal, router]);

  return (
    <Box sx={{
      textAlign: "center", display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Image
        src="/log-successful.png"
        alt="success"
        width={160}
        height={160}
        priority
        unoptimized={true}
      />

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
