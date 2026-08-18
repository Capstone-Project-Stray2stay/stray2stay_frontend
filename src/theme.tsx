import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        Blue: { value: "#87CFF0" },
        BlueText: { value: "#85BFE2" },
        LightBlue: { value: "#d3eefb" },
        Grey: { value: "#595959" },
        LightGrey: { value: "#888888" },
        Green: { value: "#84B895" },
        LightGreen: { value: "#D6F5D8" },
        Yellow: { value: "#F8C56D" },
        LightYellow: { value: "#FFF6D4" },
        White: { value: "#FFFFFF" },
      },
      gradients: {
        BlueYellow: {
          value: "linear-gradient(180deg, #d3eefb 0%, #FFFBF1 100%)",
        },
        YellowBlue: {
          value: "linear-gradient(180deg, #FFEEC3 0%, #d3eefb 100%)",
        },
      },
      fonts: {
        heading: { value: "'Montserrat', sans-serif" },
        body: { value: "'Montserrat', sans-serif" },
      },
    },
  },
  globalCss: {
    "html, body": {
      fontFamily: "'Montserrat', sans-serif",
    },
  },
});

const system = createSystem(defaultConfig, config);

export default system;