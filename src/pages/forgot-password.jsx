import {Button, Container, Paper, Text, TextInput, Title, PinInput, PasswordInput, rem} from "@mantine/core";
import {useState} from "react";
import emailjs from '@emailjs/browser';
import {useForm} from '@mantine/form';

export default function ForgotPassword() {
    const [stage, setStage] = useState(0);
    const [code, setCode] = useState(0);
    const [inputCode, setInputCode] = useState("");

    const form = useForm({
        initialValues: {
            email: '',
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    async function send_email(email) {
        let res = await fetch("/api/forgot-password", {
            method: "post",
            body: JSON.stringify({
                email: email
            })
        })

        let json = await res.json();

        emailjs.send(process.env.NEXT_PUBLIC_SERVICE_ID, process.env.NEXT_PUBLIC_TEMPLATE_ID, {
            to_email: email,
            to_name: json.name,
            message: json.code,
        }, process.env.NEXT_PUBLIC_PUBLIC_KEY);

        setCode(json.code);

        setStage(1);
    }

    function check_code(event) {
        event.preventDefault();

        if (Number(inputCode) === code) {
            setStage(2);
        }
    }

    return (
        <Container size={420} my={40}>
            <Title
                align="center"
                sx={(theme) => ({fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900})}
            >
                Сброс пароля
            </Title>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                {stage === 0 &&
                    <form onSubmit={form.onSubmit((values) => send_email(values.email))}>
                        <Text color="dimmed" size="sm" mt={5}>
                            Введите вашу почту, указанную в таблице Силаэдра
                        </Text>
                        <TextInput label="Эл. почта" placeholder="jhondoe@example.com"
                                   required {...form.getInputProps('email')} />
                        <Button type="submit" fullWidth mt="xl">
                            Далее
                        </Button>
                    </form>
                }
                {stage === 1 &&
                    <form onSubmit={check_code}>
                        <Title order={2}>Введите код</Title>
                        <Text color="dimmed" size="sm" mt={5}>
                            На введенную почту был отправлен код подтверждения. Введите его. Если не видите письмо,
                            проверьте
                            вкладку &quot спам &quot
                        </Text>
                        <PinInput type="number" sx={{paddingTop: rem(10)}} value={inputCode} onChange={(value) => {setInputCode(value)}} />
                        <Button fullWidth mt="xl" type="submit">
                            Далее
                        </Button>
                    </form>
                }
                {stage === 2 &&
                    <form>
                        <Title order={2}>Новый пароль</Title>
                        <Text color="dimmed" size="sm" mt={5}>
                            Введите новый пароль
                        </Text>
                        <PasswordInput
                            placeholder="Password"
                            label="Новый пароль"
                        />
                        <PasswordInput
                            placeholder="Password"
                            label="Повторите пароль"
                        />
                        <Button fullWidth mt="xl" onClick={() => {
                            setStage(2)
                        }}>
                            Подтвердить
                        </Button>
                    </form>
                }
            </Paper>
        </Container>
    )
}