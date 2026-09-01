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
        // Centred as a pair at both sizes — space-around pushed them out to the
        // edges on a phone and they stopped reading as one choice.
        <Flex w="100%" justify="center" gap={{ base: "72px", md: "144px" }}>
            {/* The two icons are drawn at different sizes in the design (dog is
                wider than tall, cat is square), so each gets explicit
                dimensions rather than a shared boxSize. */}
            <S2SPetIconButton
                icon={
                    <Image
                        src="/assets/icons/dog.png"
                        alt="Dog"
                        w={{ base: "33px", md: "47px" }}
                        h={{ base: "29px", md: "41px" }}
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
                        boxSize={{ base: "35px", md: "50px" }}
                    />
                }
                label="Cat"
                selected={value === "cat"}
                onClick={() => onChange("cat")}
            />
        </Flex>
    );
}
