import {
    TextInput,
    PasswordInput,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Button,
    Checkbox,
    Space,
} from '@mantine/core';

export default function Auth() {
    return (
        <Container size={420} my={40}>
            <Title
                align="center"
                sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
            >
                Войдите в аккаунт
            </Title>
            <Text color="dimmed" size="sm" align="center" mt={5}>
                Аккаунт сгенерирован автоматически, пароль вам сообщит руководитель. Указывайте ту почту, что стоит у вас в таблице Силаэдра
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <TextInput label="Эл. почта" placeholder="jhondoe@example.com" required />
                <PasswordInput label="Пароль" placeholder="Password" required mt="md" />
                <Space h="lg" />
                <Checkbox
                    label="Я согласен на обработку персональных данных"
                />
                <Anchor component="button" size="sm" align="right">
                    <a href="/forgot-password" style={{textDecoration: 'none', color: "#228be6"}}>
                        Забыли пароль?
                    </a>
                </Anchor>
                <Button fullWidth mt="xl">
                    Войти
                </Button>
                <Button fullWidth mt="xl" variant="outline">
                    Продолжить как гость
                </Button>
            </Paper>
        </Container>
    );
}