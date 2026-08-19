/**
 * Shared styling for step 3's inputs. This form's field is a distinct 38px /
 * BlueText variant, unlike S2SInput (rounded-full, ~48px, LightGrey) which
 * login/register/adopt use — so step 3 composes Chakra directly rather than
 * bolting more style props onto S2SInput.
 *
 * Kept in its own module so the component file only exports components, which
 * is what react-refresh needs to hot-reload it.
 */
const FIELD_HEIGHT = "38px";
const FIELD_BG = "rgba(255,255,255,0.70)";
const FIELD_BORDER = "BlueText";

export const detailInputStyle = {
    h: FIELD_HEIGHT,
    px: "13.83px",
    bg: FIELD_BG,
    borderRadius: "34.56px",
    borderWidth: "1px",
    borderColor: FIELD_BORDER,
    fontSize: "16px",
    color: "Grey",
    _placeholder: { color: "GreyText" },
} as const;

/**
 * The same field look expressed as S2SDropDown props. Kept next to
 * detailInputStyle and shared by every select so a dropdown can't silently
 * end up with a different background from the text inputs.
 */
export const detailDropDownStyle = {
    width: "100%",
    height: FIELD_HEIGHT,
    bg: FIELD_BG,
    borderColor: FIELD_BORDER,
} as const;
