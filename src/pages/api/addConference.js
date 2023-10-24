import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient
export default async function addConference(req, res) {
    const { name, start } = req.body;

    const conference = await prisma.conference.create({
        data: {
            name: name,
            start: start
        }
    });

    res.status(200).json({ ok: true });
}
