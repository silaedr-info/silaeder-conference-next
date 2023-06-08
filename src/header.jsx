import {
    createStyles,
    Menu,
    Header,
    Container,
    Group,
    Burger,
    Avatar,
    Paper,
    Transition,
    rem,
    ActionIcon,
    useMantineColorScheme,
    useMantineTheme
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLogout, IconArrowsLeftRight, IconSun, IconMoonStars } from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
    dropdown: {
        position: 'absolute',
        top: rem(60),
        left: 0,
        right: 0,
        zIndex: 0,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        borderTopWidth: 0,
        overflow: 'hidden',

        [theme.fn.largerThan('md')]: {
            display: 'none',
        },
    },
    inner: {
        height: rem(60),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    links: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    burger: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    link: {
        display: 'block',
        lineHeight: 1,
        padding: `${rem(8)} ${rem(12)}`,
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },

    linkLabel: {
        marginRight: rem(5),
    },
}));

export function HeaderResponsive({ links }) {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const theme = useMantineTheme();
    const { classes } = useStyles();
    const [opened, { toggle }] = useDisclosure(false);

    const linkItems = links.map((link) => {
        return (
            <a
                key={link.label}
                href={link.link}
                className={classes.link}
            >
                {link.label}
            </a>
        )
    })
    return (
        <Header height={rem(60)} mb={120}>
            <Container className={classes.inner} fluid>
                <Group>
                    <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />
                    <h3>Silaeder Conference</h3>
                </Group>

                <Group>
                    <Group spacing={5} className={classes.links}>
                        {linkItems}
                    </Group>

                    <Menu shadow="md" width={200} transitionProps={{ transition: 'pop', duration: 250 }}>
                        <Group position="center" my="xl">
                            <ActionIcon
                                onClick={() => toggleColorScheme()}
                                size="lg"
                                sx={(theme) => ({
                                    backgroundColor:
                                        theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                                    color: theme.colors.blue[6],
                                })}
                            >
                                {theme.colorScheme === 'dark' && <IconSun size="1.2rem" />}
                                {theme.colorScheme === 'light' && <IconMoonStars size="1.2rem" />}
                            </ActionIcon>
                        </Group>
                        <Menu.Target>
                            <Avatar src={null} alt="no image here" color="indigo" radius="lg" />
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>*Username*</Menu.Label>
                            <Menu.Item icon={<IconArrowsLeftRight size={14} />}>Сменить пароль</Menu.Item>
                            <Menu.Item color="red" icon={<IconLogout size={14} />}>Выйти</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>

                <Transition transition="slide-right" duration={200} mounted={opened}>
                    {(styles) => (
                        <Paper className={classes.dropdown} withBorder style={styles}>
                            {linkItems}
                        </Paper>
                    )}
                </Transition>
            </Container>
        </Header>
    )
}
