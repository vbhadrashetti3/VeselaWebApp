import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeBackground {
    modalBackground: string;
  }

  interface Palette {
    custom: {
      border: {
        soft: string;
        strong: string;
      };
      header: {
        background: string;
        border: string;
      };
      surface: {
        surface: string;
        surfaceElevated: string;
        surfaceHover: string;
        modal: string;
        sidebar: string;
        card: string;
      };
      chat: {
        userBubble: string;
        assistantBubble: string;
        bubbleBorder: string;
        inputBg: string;
        welcomeBg: string;
        welcomeText: string;
      };
      shadow: string;
      modalShadow: string;
    };
  }

  interface PaletteOptions {
    custom?: {
      border?: {
        soft?: string;
        strong?: string;
      };
      header?: {
        background?: string;
        border?: string;
      };
      surface?: {
        surface?: string;
        surfaceElevated?: string;
        surfaceHover?: string;
        modal?: string;
        sidebar?: string;
        card?: string;
      };
      chat?: {
        userBubble?: string;
        assistantBubble?: string;
        bubbleBorder?: string;
        inputBg?: string;
        welcomeBg?: string;
        welcomeText?: string;
      };
      shadow?: string;
      modalShadow?: string;
    };
  }
}
