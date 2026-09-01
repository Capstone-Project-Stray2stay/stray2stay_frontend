import { HStack, Tag } from "@chakra-ui/react"

import type { S2SChipType } from "../types/component.type"

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
        bg={isActive ? "Blue" : "white"}
        color={isActive ? "white" : "Grey"}
        rounded="full"
        px={{ base: "12px", md: 4 }}
        py={{ base: "6px", md: 2 }}
        borderWidth="1px"
        borderColor={isActive ? "LightBlue" : "Blue"}
        _hover={
          readOnly
            ? undefined
            : {
                borderColor: isActive ? "LightBlue" : "Grey",
              }
        }
        transition="all 0.15s ease"
      >
        <Tag.Label fontWeight={"bold"}>{text}</Tag.Label>
        {!readOnly && selected && (
          <Tag.EndElement>
            <Tag.CloseTrigger onClick={onToggle} />
          </Tag.EndElement>
        )}
      </Tag.Root>
    </HStack>
  )
}
