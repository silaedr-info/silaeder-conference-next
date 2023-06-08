import { Flex, rem, Box, CloseButton, SelectItemProps } from '@mantine/core';
import { forwardRef } from "react";


export function Value({
                          value,
                          label,
                          onRemove,
                          classNames,
                          ...others
                      }) {
    return (
        <div {...others}>
            <Box
                sx={(theme) => ({
                    display: 'flex',
                    cursor: 'default',
                    alignItems: 'center',
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                    border: `${rem(1)} solid ${
                        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[4]
                    }`,
                    paddingLeft: theme.spacing.xs,
                    borderRadius: theme.radius.sm,
                })}
            >
                <Box sx={{ lineHeight: 1, fontSize: rem(12) }}>{label}</Box>
                <CloseButton
                    onMouseDown={onRemove}
                    variant="transparent"
                    size={22}
                    iconSize={14}
                    tabIndex={-1}
                />
            </Box>
        </div>
    );
}


export const Item = forwardRef(({ label, value, ...others }, ref) => {
    return (
        <div ref={ref} {...others}>
            <Flex align="center">
                <div>{label}</div>
            </Flex>
        </div>
    );
});