import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient
export default async function getAllConferences(req, res) {
    const users = await prisma.conference.findMany()
    const json = []
    users.forEach((e) => {
        json.push({ label: e.name, value: [e.id, e.start] })
    })
    res.status(200).json({ data: json })
}