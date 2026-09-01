const FIELD_HEIGHT = { base: "34px", md: "38px" };
const FIELD_FONT_SIZE = { base: "14px", md: "16px" };
const FIELD_BG = "rgba(255,255,255,0.70)";
const FIELD_BORDER = "BlueText";

export const detailInputStyle = {
    h: FIELD_HEIGHT,
    px: { base: "12.10px", md: "13.83px" },
    bg: FIELD_BG,
    borderRadius: { base: "30.26px", md: "34.56px" },
    borderWidth: { base: "0.88px", md: "1px" },
    borderColor: FIELD_BORDER,
    fontSize: FIELD_FONT_SIZE,
    color: "Grey",
    _placeholder: { color: "GreyText" },
} as const;

export const detailDropDownStyle = {
    width: "100%",
    height: FIELD_HEIGHT,
    fontSize: FIELD_FONT_SIZE,
    bg: FIELD_BG,
    borderColor: FIELD_BORDER,
} as const;
