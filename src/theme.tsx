import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

// ตัวคูณขนาดตัวอักษรทั้งเว็บ: เปลี่ยนที่นี่ที่เดียว ทุกหน้าจะย่อ/ขยายตาม (เช่น 1.1 = ใหญ่ขึ้น 10%)
const FONT_SCALE = 1;
const scaled = (size: number) => Math.round(size * FONT_SCALE * 100) / 100;
const px = (size: number) => ({ value: `${scaled(size)}px` });
// Chakra's own scale is in rem; keep it that way so built-in components (Heading size, Input, etc.) render exactly as before
const rem = (size: number) => ({ value: `${scaled(size) / 16}rem` });

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
        Red: { value: "#D97D7D" },
        LightRed: { value: "#FBE1E1" },
        Yellow: { value: "#F8C56D" },
        LightYellow: { value: "#FFF6D4" },
        White: { value: "#FFFFFF" },
        Cream: { value: "#FFEEC1" },
        YellowBorder: { value: "#FFD387" },
        SkyBlue: { value: "#C6E7F7" },
        GreyText: { value: "#7E7E7E" },
        GreyMuted: { value: "#B0B0B0" },
        BabyGray: { value: "#D5D5D5" },
        GreenBorder: { value: "#BDE1B9" },
        TitleBlue: { value: "#78B8E0" },
        Orange: { value: "#FFC777" },
        GreyInfo: { value: "#969696" },
        GlowYellow: { value: "rgba(255, 235, 186, 0.67)" },
        // Figma --Green on the profile "Accept" button; brighter than the older Green token
        AcceptGreen: { value: "#5DB993" },
        // S2SButton / S2SIconButton look up `${bgColor}_hover` and `${bgColor}_active` (Figma button sheet)
        White_hover: { value: "rgba(247, 247, 247, 0.80)" },
        White_active: { value: "rgba(241, 241, 241, 0.80)" },
        Blue_hover: { value: "#77C8ED" },
        Blue_active: { value: "#6BC3EC" },
        Orange_hover: { value: "#FBBE6A" },
        Orange_active: { value: "#F9B95F" },
        Cream_hover: { value: "#FBE7B4" },
        Cream_active: { value: "#F7E1A7" },
        // "Line" button fills
        LineHover: { value: "rgba(198, 231, 247, 0.30)" },
        LineActive: { value: "rgba(198, 231, 247, 0.50)" },
        // Figma hover fill for outlined controls: --blue (#C6E7F7) at 30%
        SkyBlueHover: { value: "rgba(198, 231, 247, 0.30)" },
      },
      gradients: {
        BlueYellow: {
          value: "linear-gradient(180deg, #d3eefb 0%, #FFFBF1 100%)",
        },
        YellowBlue: {
          value: "linear-gradient(180deg, #FFEEC3 0%, #d3eefb 100%)",
        },
        // Figma page background for every screen inside the main layout
        PageBackground: {
          value: "linear-gradient(180deg, #E6FAFF 0%, #FFFBF1 100%)",
        },
        HomeHero: {
          value: "linear-gradient(180deg, #E6FAFF 0%, #FFFBF1 100%)",
        },
        HomeContent: {
          value: "linear-gradient(180deg, #FFEEC1 0%, #EFFCFF 50%, #E7FAFF 100%)",
        },
      },
      fonts: {
        heading: { value: "'Montserrat', sans-serif" },
        body: { value: "'Montserrat', sans-serif" },
      },
      // ใช้แบบ fontSize="14" หรือ fontSize={{ base: "14", md: "16" }}
      // ชื่อ token = ขนาด px ตาม Figma; ค่าจริง = ขนาดนั้น x FONT_SCALE
      fontSizes: {
        "10": px(10),
        "12": px(12),
        "13.05": px(13.05),
        "13.75": px(13.75),
        "14": px(14),
        "14.32": px(14.32),
        "15": px(15),
        "16": px(16),
        "16.32": px(16.32),
        "17.14": px(17.14),
        "17.33": px(17.33),
        "18": px(18),
        "20": px(20),
        "22": px(22),
        "24": px(24),
        "32": px(32),
        "36": px(36),
        "40": px(40),
        "48": px(48),
        "56": px(56),
        "60": px(60),
        "64": px(64),
        // Chakra's default scale, re-declared so FONT_SCALE also reaches built-in components
        "2xs": rem(10),
        xs: rem(12),
        sm: rem(14),
        md: rem(16),
        lg: rem(18),
        xl: rem(20),
        "2xl": rem(24),
        "3xl": rem(30),
        "4xl": rem(36),
        "5xl": rem(48),
        "6xl": rem(60),
        "7xl": rem(72),
        "8xl": rem(96),
        "9xl": rem(128),
      },
    },
  },
  globalCss: {
    "html, body": {
      fontFamily: "'Montserrat', sans-serif",
      overflowX: "hidden",
    },
    "*": {
      WebkitTapHighlightColor: "transparent",
    },
  },
});

const system = createSystem(defaultConfig, config);

export default system;
