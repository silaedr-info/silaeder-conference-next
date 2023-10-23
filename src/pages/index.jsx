import {Grid, Textarea, Text, Title, MultiSelect, Container, Space, Divider, SimpleGrid, TextInput, Autocomplete,
    Button, Checkbox, NumberInput, Select, Flex, Image, Loader, Group, useMantineTheme, rem
} from '@mantine/core';
import { useForm } from '@mantine/form'
import {useEffect, useState, useRef} from "react";
import { ProjectCard } from "@/projectCard";
import { Item, Value } from "@/multiSelect";
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import {IconPhoto, IconUpload, IconX, IconPresentation, IconVideo} from "@tabler/icons-react";
import ReactPlayer from 'react-player/lazy';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import path from 'path';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Index = () => {
    const [ users, setUsers ] = useState([]);
    const [ conferences, setConferences ] = useState([]);
    const [ tutors, setTutor ] = useState([]);
    const [ authorized, setAuthorized ] = useState(false);
    const [ userProjects, setUserProjects ] = useState([])

    const viewer = useRef(null);
    const form = useForm();

    useEffect(() => {
        window.addEventListener("DOMContentLoaded", (event) => {
            import('@pdftron/webviewer').then(() => {
                WebViewer(
                    {
                        path: '/',
                        licenseKey: 'demo:1691587758106:7c58ee130300000000125c200c03783ac53ed0bbe545ab60d1194591be', // sign up to get a key at https://dev.apryse.com
                        initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
                    },
                    viewer.current,
                ).then((instance) => {
                    const {docViewer} = instance;
                    // you can now call WebViewer APIs here...
                });
            });
        });
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
    const [ projectInformation, setProjectInformation] = useState()
    const [image, setImage] = useState([]);
    const [presentation, setPresentation] = useState([]);
    const [video, setVideo] = useState([]);
    const [scale, setScale] = useState(1)

    const addProject = async (values, wasProject) => {

        const body = {
            name: values.name,
            description: values.description,
            section: values.section,
            grade: values.grade,
            time_for_speech: 5,
            conference_id: values.conference,
            tutor_id: values.tutor,
            members: values.users,
            additional_users: values.additional_users,
        }
        const files = [image[0], video[0], presentation[0]];
        if (wasProject === false) {
            const res = await fetch('/api/createEmptyProject', {
                method: "post"
            });
            const json = await res.json();
            body.project_id = json.project_id
            files.forEach((file, index) => {
                const body = new FormData()
                body.append("file", file)
                body.append("id", json.project_id)
                body.append("type", index === 0 ? 'images' : index === 1 ? 'videos' : 'presentations')
                body.append("wasProject", 0)
                fetch(
                    'api/uploadFiles',
                    {
                        method: 'post',
                        body
                    }
                ).then()
            })
        } else {
            body.project_id = currentProject;
            files.forEach((file, index) => {
                const body = new FormData()
                body.append("file", file)
                body.append("id", currentProject)
                body.append("type", index === 0 ? 'images' : index === 1 ? 'videos' : 'presentations')
                body.append("wasProject", 1)
                fetch(
                    'api/uploadFiles',
                    {
                        method: 'post',
                        body: JSON.stringify({
                            file: file,
                            id: currentProject,
                        })
                    }
                ).then()
            })
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
        });
        const json = await res.json()
        return json;
    }
    const [new_project, change_state] = useState(false)
    const theme = useMantineTheme();
    const previewsImage = image.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return (
            <Image
                key={index}
                src={imageUrl}
                imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
                alt={'Input'}
            />
        );
    });
    const [videoFile, setVideoFile] = useState()
    const [presentationFile, setPresentationFile] = useState()
    const [url, setUrl] = useState('')
    const [prUrl, setPrUrl] = useState('')
    const previewsVideo = video.map((file, index) => {
        if (file !== videoFile) {
            setVideoFile(file);
            try {
                const videoUrl = URL.createObjectURL(file);
                setUrl(videoUrl)
            } catch (e) {}
        }
        try {
            return (
                <ReactPlayer key={index} url={url} playing={true} loop={true}/>
            );
        } catch (e) {}
    });
    const previewsPresentation = presentation.map((file, index) => {
        if (file !== presentationFile) {
            setPresentationFile(file)
            const presentationUrl = URL.createObjectURL(file);
            setPrUrl(presentationUrl)
        }
        if (path.extname(prUrl) === '.pdf') {
            return (
                <>
                    <Document key={index} file={prUrl}>
                        <Page scale={scale} pageNumber={1}/>
                    </Document>
                </>
            )
        } else {
            try {
                return (
                    <>
                        <div className="webviewer" ref={viewer} style={{height: "200px"}}></div>
                    </>
                )
            } catch (e) {
                
            }
        }
    });
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
                        { projectInformation ?
                    <Title align='center'>{ projectInformation.name }</Title> :
                            <Title align='center'>*Название проекта*</Title>

                        }
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
                               placeholder="Запишите средний класс участников"
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
                    <Dropzone mb={'2%'} aria-required
                        onDrop={(files) => {setImage(files)}}
                        maxSize={3 * 1024 ** 2}
                        accept={IMAGE_MIME_TYPE}>
                        <Group position="center" spacing="xl" style={{ minHeight: rem(100), pointerEvents: 'none' }}>
                            {previewsImage.length === 0 &&
                             <>
                            <Dropzone.Accept>
                                <IconUpload
                                    size="3.2rem"
                                    stroke={1.5}
                                    color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
                                />
                            </Dropzone.Accept>
                            <Dropzone.Reject>
                                <IconX
                                    size="3.2rem"
                                    stroke={1.5}
                                    color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
                                />
                            </Dropzone.Reject>
                            <Dropzone.Idle>
                                <IconPhoto size="3.2rem" stroke={1.5} />
                            </Dropzone.Idle>
                            </>
                            }
                            <div>
                                <Text size="xl" inline>
                                    Переместите сюда изображение или нажмите, чтобы выбрать файл
                                </Text>
                                <Text size="sm" color="dimmed" inline mt={7}>
                                    Файл не должен весить более 3мб
                                </Text>
                                <SimpleGrid
                                    cols={4}
                                    breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
                                    mt={previewsImage.length > 0 ? 'xl' : 0}
                                >
                                    {previewsImage}
                                </SimpleGrid>
                            </div>
                        </Group>
                    </Dropzone>
                    <Dropzone mb={'2%'}
                              onDrop={(files) => {setVideo(files)}}
                              maxSize={20 * 1024 ** 2}
                              accept={{
                                  'video/*': []
                              }}>
                        <Group position="center" spacing="xl" style={{ minHeight: rem(100), pointerEvents: 'none' }}>
                            {previewsVideo.length === 0 &&
                                <>
                                    <Dropzone.Accept>
                                        <IconUpload
                                            size="3.2rem"
                                            stroke={1.5}
                                            color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
                                        />
                                    </Dropzone.Accept>
                                    <Dropzone.Reject>
                                        <IconX
                                            size="3.2rem"
                                            stroke={1.5}
                                            color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
                                        />
                                    </Dropzone.Reject>
                                    <Dropzone.Idle>
                                        <IconVideo size="3.2rem" stroke={1.5} />
                                    </Dropzone.Idle>
                                </>
                            }
                            <div>
                                <Text size="xl" inline>
                                    Переместите сюда видео или нажмите, чтобы выбрать файл
                                </Text>
                                <Text size="sm" color="dimmed" inline mt={7}>
                                    Файл не должен весить более 20мб
                                </Text>
                                {previewsVideo &&
                                    <SimpleGrid
                                        cols={4}
                                        breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
                                        mt={previewsVideo.length > 0 ? 'xl' : 0}
                                    >
                                        {previewsVideo}
                                    </SimpleGrid>
                                }
                            </div>
                        </Group>
                    </Dropzone>
                    <Dropzone mb={'2%'}
                              onDrop={(files) => {setPresentation(files)}}
                              maxSize={3 * 1024 ** 2}
                              accept={['application/vnd.ms-powerpoint',
                                  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                              'application/pdf']}>
                        <Group position="center" spacing="xl" style={{ minHeight: rem(100), pointerEvents: 'none' }}>
                            {/*{previewsPresentation.length > 0 && <IconFileCheck size="3.2rem" stroke={1.5} />}*/}
                            {previewsPresentation.length === 0 &&
                                <>
                                    <Dropzone.Accept>
                                        <IconUpload
                                            size="3.2rem"
                                            stroke={1.5}
                                            color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
                                        />
                                    </Dropzone.Accept>
                                    <Dropzone.Reject>
                                        <IconX
                                            size="3.2rem"
                                            stroke={1.5}
                                            color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
                                        />
                                    </Dropzone.Reject>
                                    <Dropzone.Idle>
                                        <IconPresentation size="3.2rem" stroke={1.5} />
                                    </Dropzone.Idle>
                                </>
                            }
                            <div>
                                <Text size="xl" inline>
                                    Переместите сюда презентацию или нажмите, чтобы выбрать файл
                                </Text>
                                <Text size="sm" color="dimmed" inline mt={7}>
                                    Файл не должен весить более 3мб
                                </Text>
                                <SimpleGrid
                                    cols={4}
                                    breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
                                    mt={previewsPresentation.length > 0 ? 'xl' : 0}
                                >
                                    {previewsPresentation[0]}

                                </SimpleGrid>
                            </div>
                        </Group>
                    </Dropzone>
                    <Button type={ "submit" } color={'indigo.6'}>Сохранить</Button>
                    </form>
                </Container>
                }
                <Divider orientation="vertical"/>
                <Container sx={{width: '30%'}}>
                    <Button mb={'5%'} color={'indigo.6'} fullWidth onClick={handleClick}> Создать новый проект </Button>
                    <SimpleGrid cols={1} spacing="xs" verticalSpacing="xs">
                        { userProjects.map(project => (
                            <ProjectCard key={project.id} name={project.name} description={project.description} projectId={project.id}
                                         section={project.section} editFunc={async (id) => {const result = (await redact(id)).project; setProjectInformation(result); form.setValues(result)}} />
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