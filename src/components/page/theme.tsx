import { extendTheme } from "@chakra-ui/react";
import "@fontsource/roboto";

export const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
  gray: {
    "50": "#F0F2F4",
    "100": "#D6DAE0",
    "200": "#BCC3CC",
    "300": "#A2ABB9",
    "400": "#8894A5",
    "500": "#6E7C91",
    "600": "#586474",
    "700": "#424B57",
    "800": "#2C323A",
    "900": "#16191D",
  },
  teal: {
    "50": "#ECF8F8",
    "100": "#CBECEB",
    "200": "#A9DFDE",
    "300": "#88D3D1",
    "400": "#66C7C5",
    "500": "#45BAB8",
    "600": "#379593",
    "700": "#29706E",
    "800": "#1B4B4A",
    "900": "#0E2525",
  },
  blue: {
    "50": "#EAF2FA",
    "100": "#C6DCF1",
    "200": "#A1C5E8",
    "300": "#7CAFDF",
    "400": "#5798D6",
    "500": "#3282CD",
    "600": "#2868A4",
    "700": "#1E4E7B",
    "800": "#143452",
    "900": "#0A1A29",
  },
};

export const styles = {
  global: (props) => ({
    body: {
      backgroundColor:
        props.colorMode === "dark" ? "gray.800" : "blackAlpha.50",
    },
  }),
};

export const components = {
  Button: {
    // style object for base or default style
    baseStyle: {},
    // styles for different sizes ("sm", "md", "lg")
    sizes: {},
    // styles for different visual variants ("outline", "solid")
    variants: {
      outline: {
        boxShadow: "md",
      },
    },
    // default values for 'size', 'variant' and 'colorScheme'
    // 6. We can overwrite defaultProps
    defaultProps: {
      // size: "lg", // default is md
      variant: "outline", // default is solid
      colorScheme: "blue", // default is gray
    },
  },
  Spinner: {
    // style object for base or default style
    baseStyle: {},
    // styles for different sizes ("sm", "md", "lg")
    sizes: {},
    // styles for different visual variants ("outline", "solid")
    variants: {
      outline: {
        boxShadow: "md",
      },
    },
    // default values for 'size', 'variant' and 'colorScheme'
    // 6. We can overwrite defaultProps
    defaultProps: {
      size: "lg", // default is md
      color: "blue.500",
      colorScheme: "blue", // default is gray
    },
  },
};

export const fonts = {
  heading: ` "Roboto", sans-serif`,
  body: ` "Roboto", sans-serif`,
};

export const theme = extendTheme({ components, colors, fonts, styles });
