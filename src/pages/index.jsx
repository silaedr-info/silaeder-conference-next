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
    NumberInput,
    Select,
    Flex,
    Loader
} from '@mantine/core';
import { useForm } from '@mantine/form'
import {useEffect, useState} from "react";
import { ProjectCard } from "@/projectCard";
import { Item, Value } from "@/multiSelect";

const Index = () => {
    const [ users, setUsers ] = useState([]);
    const [ conferences, setConferences ] = useState([]);
    const [ tutors, setTutor ] = useState([]);
    const [ authorized, setAuthorized ] = useState(false);
    const [ userProjects, setUserProjects ] = useState([])


    const form = useForm();

    useEffect(() => {
        const fetchingConferences = async () => {
            const x = await fetch('/api/getAllConferences')
            return x.json()
        }
        const fetchingProjects = async () => {
            const x = await fetch('/api/getUserProjects')
            return x.json()
        }
        const fetchingTutors = async () => {
            const x = await fetch('/api/getAllTutors')
            return x.json()
        }
        const fetching = async () => {
            const x = await fetch('/api/getAllUsers')
            return x.json()
        }
        const checkLogin = async () => {
            const x = await fetch('/api/check_login', {method: 'POST'})
            return x.json()
        }
        fetching().then((data) => {
            setUsers(data.data);
        })
        fetchingConferences().then((data) => {
            setConferences(data.data)
        })
        fetchingTutors().then((data) => {
            setTutor(data.data)
        })
        fetchingProjects().then((data) => {
            setUserProjects(data.projects)
        })
        checkLogin().then((data) => {
            if (data.status === 'ok') {
                setAuthorized(true)
            } else {
                window.location.href = '/auth'
            }
        })
        setCurrentProject(userProjects[0]);
    }, [userProjects]);
    const [ currentProject, setCurrentProject ] = useState(-1)
    const [ disabled, setDisabled ] = useState(true);

    const addProject = (value) => {
        const body = {
            name: value.name,
            description: value.description,
            section: value.section,
            grade: value.grade,
            time_for_speech: 5,
            conference_id: value.conference,
            tutor_id: value.tutor,
            members: value.users,
            project_id: currentProject
        }
        const x = fetch(
            '/api/modifyProject', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(body)
            }
        ).then()
    }
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
                    <form onSubmit={form.onSubmit(addProject)}>
                    <TextInput label="Название проекта" placeholder="Silaeder Conference" {...form.getInputProps('name')} required />
                    <Textarea
                        placeholder="Напишите хотя бы один абзац. Например: Наш проект предостовляет совокупность сервисов, позволяющих быстро и без задержек показывать презентации и организовывать расписание."
                        label="Описание"
                        withAsterisk
                        {...form.getInputProps('description')}
                    />
                    <Select data={tutors} label="Научный руководитель" placeholder="Старунова Ольга Александровна" {...form.getInputProps('tutor')} required />
                    <Autocomplete
                        label="Секция"
                        placeholder="Начните писать"
                        data={['Информатика', 'Биология', 'Программирование', 'Математика', 'История', 'Литература', 'География', 'Обществознание', 'Английский язык']}
                        {...form.getInputProps('section')}
                        required
                    />
                    <Select
                        label="Конференция"
                        placeholder="Выберите конференцию, на которую вы хотите загрузить проект"
                        data={conferences}
                        {...form.getInputProps('conference')}
                        required
                    />
                    <NumberInput label="Класс участников"
                               placeholder="Запишите среднее арифметическое классов участников, округлённое по правилам математического округления."
                               {...form.getInputProps('grade')}
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
                        {...form.getInputProps('users')}
                        required
                    />
                    <Space h='lg' />
                    <Checkbox
                        label="Человека нет в списке"
                        onChange={(e) => {setDisabled(!e.target.checked); }}
                    />
                    <TextInput label="ФИО" placeholder="Напишите ФИО недостающих через запятую" disabled={disabled}
                               {...form.getInputProps('additional_users')}
                    />
                    <Space h="lg" />
                    <Button.Group>
                        <FileButton accept="application/vnd.ms-powerpoint,application/pdf" onChange={(file) => {}}>
                            {(props) => <Button     variant="default" {...props}>Загрузить презентацию</Button>}
                        </FileButton>
                        <Button variant="default">Просмотреть презентацию</Button>
                    </Button.Group>
                    <Button type="submit">Сохранить</Button>
                    </form>

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

export default Index