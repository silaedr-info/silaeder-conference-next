import {Grid, Textarea, Text, Title, MultiSelect, Container, Space, Divider, SimpleGrid, TextInput, Autocomplete, Button, FileButton, Checkbox } from '@mantine/core';
import { useState } from "react";
import { ProjectCard } from "@/projectCard";
import { Item, Value } from "@/multiSelect";


export default function Index() {

    const users = [
        "Таран Максим Владимирович",
        "Белозеров Иван Максимович",
    ];
    const [ currentProject, setCurrentProject ] = useState(0) // replace zero with first project of this user
    const [ disabled, setDisabled ] = useState(true);

    return (
        <>
            <Title
                align="center"
                sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
            >
                Редактирование проекта
            </Title>
            <Space h="xl" />
            <Grid grow>
                <Container sx={{width: '70%'}}>
                    <Title align='center'>*project title*</Title>
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
                        label="Человека нету в списке"
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
        </>
    );
}