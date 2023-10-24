import { PrismaClient } from "@prisma/client";
import { getCookie } from "cookies-next";


const prisma = new PrismaClient

export default async function getUserProjects(req, res) {
    if (req.method === "GET") {
        const project_id = req.body.project_id
        const project = await prisma.project.findFirst(
            {
                where: {
                    id: project_id,
                },
                include: {
                    users: true
                }
            }
        );
        await res.status(200).json({ users: project.users() })
    }
}
