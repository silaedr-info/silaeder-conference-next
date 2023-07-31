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
            const x = await fetch('/api/getUserProjects');
            return await x.json()
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
            setUserProjects(data.projects.reverse())
        })
        checkLogin().then((data) => {
            if (data.status === 'ok') {
                setAuthorized(true)
            } else {
                window.location.href = '/auth'
            }
        })
        // setCurrentProject(userProjects[0]);
    }, [userProjects]);
    const [ currentProject, setCurrentProject ] = useState(-1)
    const [ disabled, setDisabled ] = useState(true);
    const [ projectInformation, setProjectInformation] = useState({name: 1, description: 1, section: 1})

    async function addProject(values, wasProject) {
        if (wasProject === false) {
            const res = await fetch('/api/createEmptyProject', {
                method: "post"
            });
            const json = await res.json();
            await setCurrentProject(json.project_id);
            console.log(currentProject)
        }
        const body = {
            name: values.name,
            description: values.description,
            section: values.section,
            grade: values.grade,
            time_for_speech: 5,
            conference_id: values.conference,
            tutor_id: values.tutor,
            members: values.users,
            project_id: currentProject,
            additional_users: values.additional_users,
        }
        const x = await fetch(
            '/api/modifyProject', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(body)
            }
        )
        change_state(false)
    }
    function handleClick() {
        change_state(true)
        changePoint(false)
    }
    const [wasProject, changePoint] = useState(false)
    async function redact(id) {
        change_state(true);
        setCurrentProject(id);
        changePoint(true);
        const res = await fetch('/api/getProjectById', {
            method: 'post',
            body: JSON.stringify({
                id: id
            })
        })
        const json = await res.json()
        await setProjectInformation(json)
        await console.log(projectInformation)
        // return res.json()
    }
    const [new_project, change_state] = useState(false)
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
                { new_project &&
                    <Container sx={{width: '70%'}}>
                    <Title align='center'>*Название проекта*</Title>
                    <Text color="dimmed" size="sm" align='center' mt={5}>Заполните информацию о проекте. В описании
                        напишите хотя бы 1 абзац, загрузите картинку проекта. <br />При вводе участиков, начните писать имя
                        участника и начнеться поиск по всем ученикам Силаэдра. <br />Так же, если человек не из Силаэдра или
                        у него нет аккаунта, то можно добавить человека без аккаунта. <br />
                        При выборе научного руководителя, просто напишите его ФИО
                    </Text>
                    <Space h="xl" />
                    <form onSubmit={form.onSubmit((values) => addProject(values, wasProject))}>
                    <TextInput label="Название проекта" placeholder="Silaeder Conference" {...form.getInputProps('name')} required/>
                    <Textarea
                        placeholder="Напишите хотя бы один абзац. Например: Наш проект предостовляет совокупность сервисов, позволяющих быстро и без задержек показывать презентации и организовывать расписание."
                        label="Описание"
                        withAsterisk
                        {...form.getInputProps('description')}
                    />
                    <Select data={tutors} label="Научный руководитель" value={projectInformation.tutor} placeholder="Старунова Ольга Александровна" {...form.getInputProps('tutor')} required />
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
                        value={projectInformation.conference}
                        data={conferences}
                        {...form.getInputProps('conference')}
                        required
                    />
                    <NumberInput label="Класс участников"
                               placeholder="Запишите средний класс участников"
                               {...form.getInputProps('grade')}
                               value={projectInformation.grade}
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
                        value={projectInformation.users}
                        {...form.getInputProps('users')}
                    />
                    <Space h='lg' />
                    <Checkbox
                        label="Человека нет в списке"
                        onChange={(e) => {setDisabled(!e.target.checked); }}
                    />
                    <TextInput label="ФИО" placeholder="Напишите ФИО недостающих через запятую" disabled={disabled}
                               {...form.getInputProps('additional_users')}
                               value={projectInformation.additional_users}
                    />
                    <Space h="lg" />
                    <Button.Group>
                        <FileButton accept="application/vnd.ms-powerpoint,application/pdf" {...form.getInputProps('presentation')} onChange={(file) => {} } required>
                            {(props) => <Button     variant="default" {...props}>Загрузить презентацию</Button>}
                        </FileButton>
                        <Button variant="default">Просмотреть презентацию</Button>
                    </Button.Group>
                    <Button type={ "submit" }>Сохранить</Button>
                    </form>
                </Container>
                }
                <Divider orientation="vertical"/>
                <Container sx={{width: '30%'}}>
                    <Button mb={'5%'} color={'indigo.6'} fullWidth onClick={handleClick}> Создать новый проект </Button>
                    <SimpleGrid cols={1} spacing="xs" verticalSpacing="xs">
                        { userProjects.map(project => (
                            <ProjectCard key={project.id} name={project.name} description={project.description} projectId={project.id} section={project.section} editFunc={(id) => {redact(id).then()}} />
                        ))}
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