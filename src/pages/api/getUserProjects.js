import { PrismaClient } from "@prisma/client";
import { getCookie } from "cookies-next";


const prisma = new PrismaClient

export default async function getUserProjects(req, res) {
    if (req.method === "GET") {
        const jwt = getCookie('auth_token', { req, res })
        const user_id = JSON.parse(atob(jwt.split('.')[1])).user_id
        const user = await prisma.user.findFirst(
            {
                where: {
                    id: user_id,
                },
                include: {
                    projects: true
                }
            }
        );
        const all_projects = await prisma.project.findMany({
            include: {
                users: true
            }
        })
        const projects = []
        all_projects.forEach((project) => {
            if (project.users[0].userId === user_id) {
                projects.push(project)
            }
        })
        await res.status(200).json({ projects: projects })
    }
}
