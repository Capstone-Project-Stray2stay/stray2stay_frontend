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
        // Figma variables that have no equivalent above. Added rather than
        // repointing Yellow/LightBlue, which other pages already depend on.
        Cream: { value: "#FFEEC1" },        // --yelloww
        YellowBorder: { value: "#FFD387" }, // --yellow
        SkyBlue: { value: "#C6E7F7" },      // --blue
        GreyText: { value: "#7E7E7E" },     // --gray
        GreyMuted: { value: "#B0B0B0" },    // --gray2
        BabyGray: { value: "#D5D5D5" },     // --baby-gray
        GreenBorder: { value: "#BDE1B9" },  // outline of the Accept button
      },
      gradients: {
        BlueYellow: {
          value: "linear-gradient(180deg, #d3eefb 0%, #FFFBF1 100%)",
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