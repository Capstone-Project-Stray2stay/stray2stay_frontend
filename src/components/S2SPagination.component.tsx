import { Pagination, ButtonGroup, Box } from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";

import type { S2SPaginationType } from "../types/component.type";

export default function S2SPagination({ page, totalPages, onPageChange }: S2SPaginationType) {
    return (
        <Pagination.Root
            count={totalPages}
            pageSize={1}
            page={page}
            onPageChange={(details) => onPageChange(details.page)}
        >
            <ButtonGroup gap={2} variant="ghost">
                <Pagination.Items
                    render={(item) => (
                        <Pagination.Item asChild key={item.value} type="page" value={item.value}>
                            <Box
                                as="button"
                                w="44px"
                                h="44px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                rounded="10px"
                                outline="2px solid"
                                outlineColor="Blue"
                                outlineOffset="-2px"
                                bg={item.value === page ? "Blue" : "transparent"}
                                color={item.value === page ? "white" : "LightGrey"}
                                fontSize="20px"
                                fontWeight="500"
                            >
                                {item.value}
                            </Box>
                        </Pagination.Item>
                    )}
                />

                <Pagination.NextTrigger asChild>
                    <Box as="button" display="flex" alignItems="center" justifyContent="center" w="44px" h="44px" color="LightGrey">
                        <LuChevronRight size={20} />
                    </Box>
                </Pagination.NextTrigger>
            </ButtonGroup>
        </Pagination.Root>
    );
}
