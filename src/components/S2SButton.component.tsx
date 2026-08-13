import { Button, Flex} from "@chakra-ui/react";

import type { S2SButtonType } from "../types/component.type"

export default function S2SButton({ icon, type = "button", text, bgColor, width, loading, onClick }: S2SButtonType) {
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
            {icon && <Flex pr={2}>{icon}</Flex>}
            {text}
        </Button>
    );
}