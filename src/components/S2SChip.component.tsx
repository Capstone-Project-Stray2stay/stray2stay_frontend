import { HStack, Tag } from "@chakra-ui/react"

import type { S2SChipType } from "../types/component.type"

// Figma "Pet's Personality" chip: 38px tall, 70% white, 1px --bluetext outline, 16/500 --font text.
// Side padding matches the "+ Add" button (20px) so chips and Add read as one set. Selected keeps the blue fill.
export default function S2SChip({
  text,
  selected = false,
  onToggle,
  readOnly = false,
}: S2SChipType) {
  const isActive = readOnly ? true : selected

  return (
    <HStack>
      <Tag.Root
        onClick={readOnly ? undefined : onToggle}
        cursor={readOnly ? "default" : "pointer"}
        userSelect="none"
        bg={isActive ? "Blue" : "rgba(255, 255, 255, 0.70)"}
        color={isActive ? "white" : "Grey"}
        rounded="full"
        h={{ md: "38px" }}
        px={{ base: "12px", md: "20px" }}
        py={{ base: "6px", md: 0 }}
        borderWidth="1px"
        borderColor={isActive ? "LightBlue" : "BlueText"}
        _hover={
          readOnly
            ? undefined
            : {
                borderColor: isActive ? "LightBlue" : "Grey",
              }
        }
        transition="all 0.15s ease"
      >
        <Tag.Label fontSize={{ md: "16" }} fontWeight="500" lineHeight="normal">{text}</Tag.Label>
        {!readOnly && selected && (
          <Tag.EndElement>
            <Tag.CloseTrigger onClick={onToggle} />
          </Tag.EndElement>
        )}
      </Tag.Root>
    </HStack>
  )
}
