import React, {useEffect, useState} from "react";
import {Button, Center, Text} from '@mantine/core'
import {useRouter} from "next/router";
import {ScheduleCard} from '@/scheduleCard'
const Schedules = () => {
    const [ conferences, setConferences ] = useState([]);
    useEffect(() => {
        const fetchingConferences = async () => {
            const x = await fetch('/api/getAllConferences')
            return x.json()
        }
        fetchingConferences().then((data) => {
            setConferences(data.data)
            // conferences.sort()
        })
    }, [conferences])
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
            { conferences.map((conference) => (<ScheduleCard key={conference.id} conference={conference} />))

            }
        </>
    )
};

export default Schedules;