import { Calendar } from '@mantine/dates';
import {Button, Card, Indicator, Text, Title} from "@mantine/core";
import {useRouter} from "next/router";
export function ScheduleCard({date}) {
    console.log(date)
    const calendarDate = new Date(date)
    console.log(calendarDate)
    const router = useRouter()


    const handleClick = () => {
        router.push('/schedule/1')
    }


    return (
            <Card mt={'1%'} mx={'auto'} shadow="sm" padding="lg" radius="md" sx={{width: "50%"}} withBorder>
                <Title>Conference 1</Title>
                <Text>293939</Text>
                <Button onClick={handleClick}>Go to the conference</Button>
            </Card>
    )
}
