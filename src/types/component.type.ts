export interface S2SAccordionType {
    title: string
    content: string
    value?: string
    width?: string
}

export interface S2SButtonType {
    icon?: React.ReactNode
    type?: "button" | "submit" | "reset"
    text: string
    bgColor?: string
    width?: string
    loading?: boolean
    onClick?: () => void
}

export interface S2SChipType {
    text: string
    selected?: boolean
    onToggle?: () => void
    readOnly?: boolean
}

export interface S2SDropDownType {
    placeholder: string
    width: string
    data: any[]
}

export interface S2SIconButtonType {
    icon: React.ReactElement
    ariaLabel?: string
    bgColor?: string
    iconColor?: string
    onClick?: () => void
}

export interface S2SInputType {
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
    width: string | number
    petName?: string
    petImageURL: string
    petAge: string
    petBreed: string
    petGender: string
    petLocation: string
    onClick?: () => void
}