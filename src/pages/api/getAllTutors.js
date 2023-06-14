import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient
export default async function getAllUsers(req, res) {
    const users = await prisma.user.findMany()
    const json = []
    users.forEach((e) => {
        if (e.isTutor) {
            json.push({label: e.name, value: e.id})
        }
    })
    res.status(200).json({ data: json })
}