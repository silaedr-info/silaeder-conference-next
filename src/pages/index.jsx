import {
    Grid,
    Textarea,
    Text,
    Title,
    MultiSelect,
    Container,
    Space,
    Divider,
    SimpleGrid,
    TextInput,
    Autocomplete,
    Button,
    FileButton,
    Checkbox,
    Center, Flex
} from '@mantine/core';
import {useEffect, useState} from "react";
import { ProjectCard } from "@/projectCard";
import { Item, Value } from "@/multiSelect";
import {getCookie, hasCookie} from "cookies-next";
import { Loader } from '@mantine/core';
import MD5 from "crypto-js/md5";

export default function Index() {
    const users = [
        "Таран Максим Владимирович",
        "Белозеров Иван Максимович",
    ];
    const [ currentProject, setCurrentProject ] = useState(0) // replace zero with first project of this user
    const [ disabled, setDisabled ] = useState(true);

    const [ authorized, setAuthorized ] = useState(false);

    useEffect(async () => {
        if (hasCookie("auth_token")) {
            let res = await fetch("/api/check_login", {
                method: "post",
                body: JSON.stringify({
                    токен: getCookie("auth_token")
                })
            });

            let json = await res.json();

            if (json.status === "ok") {
                setAuthorized(true);
            }
        } else {
            window.location.href = "/auth"
        }
    }, [])

    return (
        <>
            {authorized ? <>
            <Title
                align="center"
                sx={(theme) => ({ fontFamily: `Greycliff sans-serif, ${theme.fontFamily}`, fontWeight: 900 })}
            >
                Редактирование проекта
            </Title>
            <Space h="xl" />
            <Grid grow>
                <Container sx={{width: '70%'}}>
                    <Title align='center'>*Название проекта*</Title>
                    <Text color="dimmed" size="sm" align='center' mt={5}>Заполните информацию о проекте. В описании
                        напишите хотя бы 1 абзац, загрузите картинку проекта. <br />При вводе участиков, начните писать имя
                        участника и начнеться поиск по всем ученикам Силаэдра. <br />Так же, если человек не из Силаэдра или
                        у него нет аккаунта, то можно добавить человека без аккаунта. <br />
                        При выборе научного руководителя, просто напишите его ФИО
                    </Text>
                    <Space h="xl" />
                    <TextInput label="Название проекта" placeholder="Silaeder Conference" required />
                    <Textarea
                        placeholder="Напишите хотя бы один абзац. Например: Наш проект предостовляет совокупность сервисов, позволяющих быстро и без задержек показывать презентации и организовывать расписание."
                        label="Описание"
                        withAsterisk
                    />
                    <TextInput label="Научный руководитель" placeholder="Старунова Ольга Александровна" required />
                    <Autocomplete
                        label="Секция"
                        placeholder="Начните писать"
                        data={['Информатика', 'Биология', 'Программирование', 'Математика', 'История', 'Литература', 'География', 'Обществознание', 'Английский язык']}
                        required
                    />
                    <TextInput label="Классы участников"
                               placeholder="Запишите среднее арифметическое классов участников, округлённое по правилам математического округления."
                               required />
                    <MultiSelect
                        data={users}
                        limit={20}
                        valueComponent={Value}
                        itemComponent={Item}
                        searchable
                        defaultValue={['US', 'FI']}
                        placeholder="Начните писать ФИО"
                        label="Участники"
                        required
                    />
                    <Space h='lg' />
                    <Checkbox
                        label="Человека нет в списке"
                        onChange={(e) => {setDisabled(!e.target.checked); }}
                    />
                    <TextInput label="ФИО" placeholder="Напишите ФИО недостающих через запятую" disabled={disabled} required />
                    <Space h="lg" />
                    <Button.Group>
                        <FileButton accept="application/vnd.ms-powerpoint,application/pdf" onChange={(file) => {}}>
                            {(props) => <Button variant="default" {...props}>Загрузить презентацию</Button>}
                        </FileButton>
                        <Button variant="default">Просмотреть презентацию</Button>
                    </Button.Group>

                </Container>
                <Divider orientation="vertical"/>
                <Container sx={{width: '30%'}}>
                    <SimpleGrid cols={1} spacing="xs" verticalSpacing="xs">
                        <ProjectCard name='Проект 1' description='проект 1.' projectId={0} section="математика" editFunc={(id) => {setCurrentProject(id)}} />
                        <ProjectCard name='Проект 2' description='проект 2.' projectId={1} section="биология" editFunc={(id) => {setCurrentProject(id)}} />
                        <ProjectCard name='Проект 3' description='проект 3.' projectId={2} section="программирование" editFunc={(id) => {setCurrentProject(id)}} />
                    </SimpleGrid>
                </Container>
            </Grid>
            </> : <>
                <Flex w="100%" h="100%" mx="auto" align="center" justify="center">
                    <Flex align="center" direction="column">
                        <Loader mb="10px" size="xl" variant="bars" />
                        <Text size="xl">Пожалуйста подождите</Text>
                    </Flex>
                </Flex>
            </> }
            </>
    );
}