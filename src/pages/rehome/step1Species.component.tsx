import { Flex, Image } from "@chakra-ui/react";

import { S2SPetIconButton } from "../../components/S2S.components";
import type { PetType } from "./rehome.type";

export default function Step1Species({
    value,
    onChange,
}: {
    value: PetType | null;
    onChange: (petType: PetType) => void;
}) {
    return (
        // The two icons are drawn at different sizes in the design (dog is wider
        // than tall, cat is square), so each gets explicit dimensions rather than
        // the shared boxSize the Adopt page uses.
        <Flex justify="center" gap={{ base: "64px", md: "144px" }}>
            <S2SPetIconButton
                icon={<Image src="/assets/icons/dog.png" alt="Dog" w="47px" h="41px" />}
                label="Dog"
                selected={value === "dog"}
                onClick={() => onChange("dog")}
            />
            <S2SPetIconButton
                icon={<Image src="/assets/icons/cat.png" alt="Cat" w="50px" h="50px" />}
                label="Cat"
                selected={value === "cat"}
                onClick={() => onChange("cat")}
            />
        </Flex>
    );
}
