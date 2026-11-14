import { Box } from "@chakra-ui/react";

// Figma drop-zone stroke: 2px, centre-aligned, dash 10 / gap 10, round caps. CSS dashed borders can't set the dash
// length, so it's an SVG rect over the parent (which must be position: relative). Colour comes from the parent's
// `color` (currentColor); overflow visible lets the centred stroke sit 1px outside, like Figma.
export default function DashedOutline({ radius }: { radius: number }) {
    return (
        <Box
            as="svg"
            position="absolute"
            inset="0"
            w="100%"
            h="100%"
            overflow="visible"
            pointerEvents="none"
            aria-hidden="true"
        >
            <rect
                width="100%"
                height="100%"
                rx={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="10 10"
                strokeLinecap="round"
            />
        </Box>
    );
}
