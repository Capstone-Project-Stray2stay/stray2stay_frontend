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
}

export interface S2SButtonType {
    icon?: React.ReactNode
    type?: "button" | "submit" | "reset"
    text: string
    bgColor?: string
    variant?: "solid" | "outline"
    height?: ResponsiveSpace
    fontSize?: ResponsiveSpace
    width?: ResponsiveSpace
    loading?: boolean
    disabled?: boolean
    onClick?: () => void
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
    /** Optional thumbnail (e.g. a breed-color swatch photo) shown before the label. */
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
    width: string | number
    height: string | number
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
    width: string | number
    height: string | number
}