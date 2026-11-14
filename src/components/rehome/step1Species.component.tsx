import { Flex, Image } from "@chakra-ui/react";

import { S2SPetIconButton } from "../S2S.components";
import type { PetType } from "../../types/rehome.type";

export default function Step1Species({
    value,
    onChange,
}: {
    value: PetType | null;
    onChange: (petType: PetType) => void;
}) {
    return (
        <Flex w="100%" justify="center" gap={{ base: "72px", md: "144px" }}>
            <S2SPetIconButton
                icon={
                    <Image
                        src="/assets/icons/dog.png"
                        alt="Dog"
                        w={{ base: "28px", md: "46px" }}
                        h={{ base: "28px", md: "46px" }}
                        objectFit="contain"
                    />
                }
                label="Dog"
                selected={value === "dog"}
                onClick={() => onChange("dog")}
            />
            <S2SPetIconButton
                icon={
                    <Image
                        src="/assets/icons/cat.png"
                        alt="Cat"
                        w={{ base: "28px", md: "46px" }}
                        h={{ base: "28px", md: "46px" }}
                        objectFit="contain"
                    />
                }
                label="Cat"
                selected={value === "cat"}
                onClick={() => onChange("cat")}
            />
        </Flex>
    );
}
