import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeBackground {
    modalBackground: string;
  }

  interface Palette {
    custom: {
      /** Raw brand colours (always the source-of-truth hex). */
      brand: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
      };
      primary: {
        main: string;
        dark: string;
        light: string;
        contrastText: string;
      };
      secondary: {
        main: string;
        dark: string;
        light: string;
        contrastText: string;
      };
      background: {
        default: string;
        paper: string;
        overlay: string;
      };
      text: {
        primary: string;
        secondary: string;
        disabled: string;
      };
      border: {
        soft: string;
        strong: string;
      };
      divider: string;
      state: {
        hover: string;
        selected: string;
        focusRing: string;
        disabledBg: string;
      };
      surface: {
        surface: string;
        surfaceElevated: string;
        surfaceHover: string;
        modal: string;
        sidebar: string;
        card: string;
      };
      header: {
        background: string;
        border: string;
      };
      chat: {
        userBubble: string;
        assistantBubble: string;
        bubbleBorder: string;
        inputBg: string;
        welcomeBg: string;
        welcomeText: string;
      };
      success: { main: string; light: string; dark: string; contrastText: string };
      warning: { main: string; light: string; dark: string; contrastText: string };
      error:   { main: string; light: string; dark: string; contrastText: string };
      info:    { main: string; light: string; dark: string; contrastText: string };
      shadows: {
        shadow: string;
        modalShadow: string;
      };
      radius: {
        small: string;
        medium: string;
        large: string;
        full: string;
      };
      spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
      };
      /** Backward-compatibility aliases */
      shadow: string;
      modalShadow: string;
    };
  }

  interface PaletteOptions {
    custom?: Partial<Palette["custom"]>;
  }
}
