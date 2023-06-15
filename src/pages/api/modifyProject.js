import { PrismaClient } from "@prisma/client";
import { getCookie } from "cookies-next";


const prisma = new PrismaClient

export default async function CreateProject(req, res) {
    if (req.method === "POST") {
        const jwt = getCookie('auth_token', { req, res })
        const user_id = JSON.parse(atob(jwt.split('.')[1])).user_id
        const { name, description, time_for_speech, grade, section, conference_id, members } = req.body
        const user = await prisma.user.findMany(
            {
                where: {
                    id: user_id
                }
            }
        );
        const users = [
        ]
        const conference = await prisma.conference.findMany({
            where: {
                id: parseInt(conference_id)
            }
        });
        let schedule_pos = await prisma.break.count() + await prisma.project.count();
        const project = await prisma.project.findUnique({
            where: {
                id: req.body.project_id
            },
            include: {
                users: true,
            }
        })
        const members_of_project_now = []
        project.users.forEach((e) => {
            members_of_project_now.push(e.userId)
        })
        console.log(members_of_project_now)
        members.forEach((e) => {
            if (!members_of_project_now.includes(e)) {

                users.push({
                    user: {
                        connect: {
                            id: e
                        }
                    }
                })
            }
        })

        await prisma.project.update({
            where: {
                id: req.body.project_id,
            },
            data: {
                schedulePos: schedule_pos,
                name: name,
                description: description,
                section: section,
                timeForSpeech: time_for_speech,
                grade: grade,
                active: true,
                users:
                    {
                        create: users
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
