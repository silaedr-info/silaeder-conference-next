import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient
export default async function getProjectsByConferenceID(req, res) {
    const conference = await prisma.conference.findMany({
        where: {
            id: req.body.id
        },

        include: {
            project: true
        }
    })

    res.status(200).json({ projects: conference[0].project })
}