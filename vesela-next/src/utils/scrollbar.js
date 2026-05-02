import { alpha } from "@mui/material/styles";

/**
 * Custom scrollbar styles that adapt to the current MUI theme.
 * @param {object} theme - The MUI theme object from useTheme()
 */
export const scrollbarStyles = (theme) => ({
  "&::-webkit-scrollbar": {
    width: "6px",
    height: "6px", // For horizontal scrollbars
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: alpha(theme.palette.text.secondary, 0.2),
    borderRadius: "10px",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: alpha(theme.palette.text.secondary, 0.4),
    },
  },
  // Firefox support
  scrollbarWidth: "thin",
  scrollbarColor: `${alpha(theme.palette.text.secondary, 0.2)} transparent`,
});