import { Input, InputGroup } from "@chakra-ui/react";

export default function S2SInput({ startIcon, endIcon, placeholder, type = "text", value, onChange }: { startIcon?: React.ReactNode, endIcon?: React.ReactNode, placeholder?: string, type?: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
    return (
        <InputGroup
            startElement={startIcon}
            endElement={endIcon}>
            <Input
                placeholder={placeholder}
                type={type}
                value={value}
                onChange={onChange}
                rounded="full"
                p={4}
                borderColor="LightGrey"
                _focus={{ borderColor: "Blue" }}
            />
        </InputGroup>
    )
}