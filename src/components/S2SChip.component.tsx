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
        // Tighter on a phone: the personality picker fits ~3 chips per row at
        // these paddings instead of spilling one per line.
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

// import { useState } from "react"
// import { HStack } from "@chakra-ui/react"
// import S2SChip from "../components/S2SChip.component"

// const OPTIONS = ["Tag A", "Tag B", "Tag C", "Tag D"]

// export default function Home() {
//   // this is the "list" the selected chips get stored into
//   const [selectedItems, setSelectedItems] = useState<string[]>([])

//   const toggle = (text: string) => {
//     setSelectedItems((prev) =>
//       prev.includes(text)
//         ? prev.filter((item) => item !== text) // unselect: remove from list
//         : [...prev, text]                       // select: add to list
//     )
//   }

//   return (
//     <>
//       <HStack wrap="wrap">
//         {OPTIONS.map((text) => (
//           <S2SChip
//             key={text}
//             text={text}
//             selected={selectedItems.includes(text)}
//             onToggle={() => toggle(text)}
//           />
//         ))}
//       </HStack>

//       {/* just to show what's stored */}
//       <pre>{JSON.stringify(selectedItems, null, 2)}</pre>
//     </>
//   )
// }
