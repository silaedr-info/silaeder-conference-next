import {Button, Container, Paper, Text, TextInput, Title, PinInput, PasswordInput, rem} from "@mantine/core";
import { useState } from "react";

export default function ForgotPassword() {
    const [ email, setEmail ] = useState('')
    const [ code, setCode ] = useState('')
    const [stage, setStage] = useState(0);


    const handleChangeEmail = (event) => {
        setEmail(event.target.value);
        console.log(email)
    }
    const handleChangeCode = (event) => {
        setCode(event);
        console.log(code)
    }


    return (
        <Container size={420} my={40}>
            <Title
                align="center"
                sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
            >
                Сброс пароля
            </Title>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                {stage === 0 &&
                    <>
                        <Text color="dimmed" size="sm" mt={5}>
                            Введите вашу почту, указанную в таблице Силаэдра
                        </Text>
                        <TextInput label="Эл. почта" placeholder="jhondoe@example.com" required onChange={handleChangeEmail} />
                        <Button fullWidth mt="xl" color={"indigo.4"} onClick={() => {
                            setStage(1);
                        }}>
                            Далее
                        </Button>
                    </>
                }
                {stage === 1 &&
                    <>
                        <Title order={2}>Введите код</Title>
                        <Text color="dimmed" size="sm" mt={5}>
                            На введенную почту был отправлен код подтверждения. Введите его. Если не видите письмо, проверьте
                            вкладку &quot спам &quot
                        </Text>
                        <PinInput type="number" onChange={handleChangeCode} sx={{paddingTop: rem(10)}}/>
                        <Button fullWidth mt="xl" color={"indigo.4"} onClick={() => {
                            setStage(2)
                        }}>
                            Далее
                        </Button>
                    </>
                }
                {stage === 2 &&
                    <>
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
                        <Button fullWidth mt="xl" color={"indigo.4"} onClick={() => {
                            setStage(2)
                        }}>
                            Подтвердить
                        </Button>
                    </>
                }
            </Paper>
        </Container>
    )
}