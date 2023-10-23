import { Calendar } from '@mantine/dates';
import {Card} from "@mantine/core";
const ScheduleCard = (props) => {
    console.log(props.date)
    const calendarDate = new Date(props.date)
    console.log(calendarDate)
    return (
        <>
            <Card mt={'1%'} mx={'auto'} shadow="sm" padding="lg" radius="md" sx={{width: "50%"}} withBorder>
                <Calendar />
            </Card>
        </>
    )
}

export default ScheduleCard;