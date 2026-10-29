import { Pagination, ButtonGroup, Box } from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";

import type { S2SPaginationType } from "../types/component.type";

// Shared shell for page numbers and the next arrow: 44px square, 2px Blue outline
const cellStyle = {
    w: "44px",
    h: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    rounded: "10px",
    outline: "2px solid",
    outlineColor: "Blue",
    outlineOffset: "-2px",
    fontSize: "20",
    cursor: "pointer",
    transition: "background 0.15s ease, color 0.15s ease",
} as const;

export default function S2SPagination({ page, totalPages, onPageChange }: S2SPaginationType) {
    return (
        <Pagination.Root
            count={totalPages}
            pageSize={1}
            page={page}
            onPageChange={(details) => onPageChange(details.page)}
        >
            <ButtonGroup gap="6px" variant="ghost">
                <Pagination.Items
                    render={(item) => {
                        const isCurrent = item.value === page;
                        return (
                            <Pagination.Item asChild key={item.value} type="page" value={item.value}>
                                <Box
                                    as="button"
                                    {...cellStyle}
                                    bg={isCurrent ? "Blue" : "transparent"}
                                    color={isCurrent ? "white" : "GreyText"}
                                    fontWeight="500"
                                    _hover={isCurrent ? undefined : { bg: "SkyBlueHover", fontWeight: "600" }}
                                >
                                    {item.value}
                                </Box>
                            </Pagination.Item>
                        );
                    }}
                />

                <Pagination.NextTrigger asChild>
                    <Box
                        as="button"
                        {...cellStyle}
                        color="GreyText"
                        _hover={{ bg: "Blue", color: "white" }}
                        _disabled={{ opacity: 0.4, cursor: "not-allowed", bg: "transparent", color: "GreyText" }}
                    >
                        <LuChevronRight size={20} />
                    </Box>
                </Pagination.NextTrigger>
            </ButtonGroup>
        </Pagination.Root>
    );
}
