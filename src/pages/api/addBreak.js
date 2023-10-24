import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient
export default async function addBreak(req, res) {
    const time = req.body.time;
    const conference_id = req.body.conference_id;
    const schedule_pos = req.body.schedule_pos;

    await prisma.break.create({
        data: {
            time: time,
            conferenceId: conference_id,
            schedulePos: schedule_pos
        }
    });

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

    for (const el of projects) {
        if (el.schedulePos === schedule_pos) {
            await prisma.project.update({
                where: {
                    id: el.id
                },

                data: {
                    schedulePos: el.schedulePos+1
                }
            })

            break;
        }
    }

    let i = schedule_pos + 1;
    while (true) {
        let can_continue = false;

        for (const el of projects) {
            if (el.schedulePos === i) {
                await prisma.project.update({
                    where: {
                        id: el.id
                    },

                    data: {
                        schedulePos: el.schedulePos+1
                    }
                })

                can_continue = true;
                break;
            }
        }

        if (!can_continue) {
            for (const el of breaks) {
                if (el.schedulePos === i) {
                    await prisma.break.update({
                        where: {
                            id: el.id
                        },

                        data: {
                            schedulePos: el.schedulePos+1
                        }
                    })

                    break;
                }
            }
        }

        if (!can_continue) {
            break;
        }
    }

    res.status(200).json({ ok: true })
}