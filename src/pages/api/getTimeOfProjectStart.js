import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient
export default async function getTimeOfProjectStart(req, res) {
    const conference_id = req.body.conference_id;
    const schedule_pos = req.body.schedule_pos;

    const conference = await prisma.conference.findMany({
        where: {
            id: conference_id
        },

        include: {
            project: true,
            break: true
        }
    })

    const projects = conference[0].project;
    const breaks = conference[0].break;

    let time = 0;

    for (let i = 0; i < schedule_pos; i++) {
        projects.forEach((el) => {
            if (el.schedulePos === i) {
                time += el.timeForSpeech
            }
        });

        breaks.forEach((el) => {
            if (el.schedulePos === i) {
                time += el.time
            }
        })
    }

    const startTime = new Date(conference[0].start);

    startTime.setMinutes(startTime.getMinutes()+time);

    res.status(200).json({ time: startTime.getHours()+":"+startTime.getMinutes() });
}