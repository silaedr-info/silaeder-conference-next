import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient
export default async function getBreaksByConferenceID(req, res) {
    const conference = await prisma.conference.findMany({
        where: {
            id: req.body.id
        },

        include: {
            break: true
        }
    })
    conference[0].break.sort((a, b) => {return a.schedulePos - b.schedulePos})

    res.status(200).json({ breaks: conference[0].break })
}