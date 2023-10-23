import React, {useEffect, useState} from "react";
import {Button, Center, Text} from '@mantine/core'
import {useRouter} from "next/router";
import ScheduleCard from '@/scheduleCard'
const Schedules = () => {
    const [ conferences, setConferences ] = useState([]);
    const [ conference, setConference ] = useState({});
    useEffect(() => {
        const fetchingConferences = async () => {
            const x = await fetch('/api/getAllConferences')
            return x.json()
        }
        fetchingConferences().then((data) => {
            setConferences(data.data)
            // conferences.sort()
        })

        const fetchingConference = async () => {
            const x = await fetch('/api/getConferenceById', {
                method: 'post',
                body: JSON.stringify({
                    id: 1
                })
            });
            return x.json();
        }
        fetchingConference().then((data) => {
            setConference(data.conference)
            console.log(conference)
        })
    }, [conferences, conference])
    const router = useRouter()
    const handleClick = () => {
        router.push('/make_conference')
    }
    return (
        <>
            <Center>
                <Button w={'35%'} color={'indigo.8'} onClick={handleClick}>
                    Создать новое расписание конференции
                </Button>
            </Center>
            <ScheduleCard date={conference.start}/>
        </>
    )
};

export default Schedules;