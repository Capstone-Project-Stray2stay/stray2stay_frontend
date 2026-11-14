import type { InputProps } from "@chakra-ui/react"

type ResponsiveSpace = string | number | { base?: string | number; sm?: string | number; md?: string | number; lg?: string | number; xl?: string | number }

export interface S2SAccordionType {
    title: string
    content: string
    value?: string
    width?: string
    px?: ResponsiveSpace
    py?: ResponsiveSpace
    fontSize?: ResponsiveSpace
    contentFontSize?: ResponsiveSpace
    contentPt?: ResponsiveSpace
    contentPb?: ResponsiveSpace
    contentColor?: string
    contentFontWeight?: string
}

export type S2SButtonSize = "lg" | "lgShort" | "md" | "sm" | "xs"

export interface S2SButtonType {
    icon?: React.ReactNode
    type?: "button" | "submit" | "reset"
    text: string
    bgColor?: string
    variant?: "solid" | "outline"
    /** Figma button sizes (Large, Large Short, Medium, Small, xs); width/height/fontSize still override */
    size?: S2SButtonSize
    height?: ResponsiveSpace
    fontSize?: ResponsiveSpace
    width?: ResponsiveSpace
    /** Icon-to-text gap; overrides the size's default (some Figma instances differ from the sheet) */
    gap?: string
    loading?: boolean
    disabled?: boolean
    onClick?: () => void
    /** Shows state only (looks like a button, isn't clickable): drops hover/press and the pointer cursor */
    isStatus?: boolean
}

export interface S2SChipType {
    text: string
    selected?: boolean
    onToggle?: () => void
    readOnly?: boolean
}

export interface S2SDropDownOption {
    value: string
    label: string
    image?: string
}

export interface S2SDropDownType {
    placeholder: string
    width: ResponsiveSpace
    data: S2SDropDownOption[]
    value?: string
    onValueChange?: (value: string) => void
    disabled?: boolean
    height?: ResponsiveSpace
    fontSize?: ResponsiveSpace
    borderColor?: string
    bg?: string
    boxShadow?: string
    placeholderColor?: string
    /** Shows a ✕ next to the chevron once a value is picked, so the field can be emptied again */
    clearable?: boolean
    /** Left padding of the text and right padding of the chevron (e.g. "16px") */
    paddingX?: string
    /** Space in px between the field and the open list (default 0: list hangs straight off the field) */
    gutter?: number
    /** "filter": the Figma Adopt filter (hover border, blue border once filled; list with 16px padding,
     *  16 radius, 40px rows 10px apart, 20/500 text, blue check) */
    variant?: "default" | "filter"
}

export interface S2SCheckboxType {
    label: string
    checked: boolean
    onChange: (checked: boolean) => void
}

export interface S2SIconButtonType {
    icon: React.ReactElement
    ariaLabel?: string
    bgColor?: string
    iconColor?: string
    boxSize?: ResponsiveSpace
    boxShadow?: string
    onClick?: () => void
}

export interface S2SInputType extends Omit<InputProps, "value" | "onChange" | "type" | "placeholder"> {
    startIcon?: React.ReactNode
    endIcon?: React.ReactNode
    placeholder?: string
    type?: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export interface S2SPageTitleType {
    title: string
}

export interface S2SPetCardType {
    rank?: number
    width: ResponsiveSpace
    height: ResponsiveSpace
    petName?: string
    petImageURL: string
    petAge: string
    petBreed: string
    petGender: string
    petLocation: string
    onClick?: () => void
}

export interface S2SPetIconButtonType {
    icon: React.ReactElement
    label: string
    selected?: boolean
    onClick?: () => void
}

export interface S2SStepperType {
    steps: string[]
    current: number
}

export interface S2SPaginationType {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
}

export interface S2SPetCardSkeletonType {
    width: ResponsiveSpace
    height: ResponsiveSpace
}

export interface S2SDialogCloseButtonType {
    onClick: () => void
    top?: ResponsiveSpace
    right?: ResponsiveSpace
    boxSize?: ResponsiveSpace
    iconBoxSize?: ResponsiveSpace
    zIndex?: number
    /** Place in normal layout flow instead of absolutely in the dialog's corner */
    inline?: boolean
}
