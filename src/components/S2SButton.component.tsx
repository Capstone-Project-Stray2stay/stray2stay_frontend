import { Button, } from "@chakra-ui/react";

export default function S2SButton({ type = "button", text, bgColor, width, loading, onClick }: { type?: "button" | "submit" | "reset", text: string, bgColor?: string, width?: string, loading?: boolean, onClick?: () => void }) {
    return (
        <Button
            type={type}
            rounded="full"
            fontWeight="bold"
            bg={bgColor || "Blue"}
            color="white"
            _hover={{ bg: `${bgColor || "Blue"}_hover` }}
            _active={{ bg: `${bgColor || "Blue"}_active` }}
            w={width}
            loading={loading}
            onClick={onClick}
        >
            {text}
        </Button>
    );
}