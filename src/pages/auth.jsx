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
import {useForm} from "@mantine/form";
import {setCookie} from "cookies-next";
import MD5 from "crypto-js/md5";

export default function Auth() {
    const form = useForm({
        initialValues: {
            email: '',
            password: ''
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    async function login(email, password) {
        let res = await fetch("/api/login", {
            method: "post",
            body: JSON.stringify({
                email: email,
                password_hash: await MD5(password).toString(),
            })
        });

        let json = await res.json();

        const token = json.token;

        if ((typeof token === "string") && (token !== "")) {
            setCookie("auth_token", token, {maxAge: 31536000});

            window.location.href = "/";
        }
    }

    return (
        <Container size={420} my={40}>
            <Title
                align="center"
                sx={(theme) => ({fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900})}
            >
                Войдите в аккаунт
            </Title>
            <Text color="dimmed" size="sm" align="center" mt={5}>
                Аккаунт сгенерирован автоматически, пароль вам сообщит руководитель. Указывайте ту почту, что стоит у
                вас в таблице Силаэдра
            </Text>

            <form onSubmit={form.onSubmit((values) => login(values.email, values.password))}>
                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <TextInput label="Эл. почта" placeholder="jhondoe@example.com"
                               required {...form.getInputProps('email')} />
                    <PasswordInput label="Пароль" placeholder="Password" required
                                   mt="md" {...form.getInputProps('password')} />
                    <Space h="lg"/>
                    <Checkbox
                        required
                        label="Я согласен на обработку персональных данных"
                    />
                    <Anchor component="button" size="sm" align="right">
                        <a href="/forgot-password" style={{textDecoration: 'none', color: "#748FFC"}}>
                            Забыли пароль?
                        </a>
                    </Anchor>
                    <Button type="submit" fullWidth mt="xl" href={'/'} color={"indigo.4"}>
                        Войти
                    </Button>
                    <Button fullWidth mt="xl" variant="outline" color={"indigo.4"}>
                        Продолжить как гость
                    </Button>
                </Paper>
            </form>
        </Container>
    );
}