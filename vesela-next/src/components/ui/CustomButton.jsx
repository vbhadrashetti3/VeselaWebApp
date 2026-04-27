"use client";

import { Button, CircularProgress, useTheme } from "@mui/material";

const CustomButton = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  type = "button",
  fullWidth = false,
  sx = {},
  ...props
}) => {
  const theme = useTheme();

  return (
    <Button
      variant="contained"
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      sx={{
        boxShadow: "none",
        height: 45,
        borderRadius: 3,
        textTransform: "none",
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        fontSize: "16px",
        fontWeight: 600,
        "&:hover": {
          backgroundColor: theme.palette.primary.dark,
        },
        "&.Mui-disabled": {
          backgroundColor: theme.palette.action.disabledBackground,
          color: theme.palette.action.disabled,
        },
        ...sx,
      }}
      {...props}
    >
      {loading ? <CircularProgress size={20} color="inherit" /> : children}
    </Button>
  );
};

export default CustomButton;
