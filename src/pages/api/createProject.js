import { PrismaClient } from "@prisma/client";
import { getCookie } from "cookies-next";


const prisma = new PrismaClient

export default async function CreateProject(req, res) {
    if (req.method === "POST") {
        const jwt = getCookie('auth', { req, res })
        const user_id = JSON.parse(atob(jwt.split('.')[1])).user_id
        const { name, description, time_for_speech, grade, section, conference_id } = req.body
        const user = await prisma.user.findMany(
            {
                where: {
                    id: user_id
                }
            }
        );
        const conference = await prisma.conference.findMany({
            where: {
                id: parseInt(conference_id)
            }
        });
        let schedule_pos = await prisma.break.count() + await prisma.project.count();
        await prisma.project.create({
            data: {
                schedulePos: schedule_pos,
                name: name,
                description: description,
                section: section,
                timeForSpeech: time_for_speech,
                grade: grade,
                active: true,
                User: {
                    connect: {
                        id: user[0].id,
                    }
                },
                Conference: {
                    connect: {
                        id: conference[0].id,
                    }
                },
            }
        })
        return res.status(200).json({ success: true })
    }
}
