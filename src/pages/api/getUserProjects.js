import { PrismaClient } from "@prisma/client";
import { getCookie } from "cookies-next";


const prisma = new PrismaClient

export default async function getUserProjects(req, res) {
    if (req.method === "GET") {
        const jwt = getCookie('auth_token', { req, res })
        const user_id = JSON.parse(atob(jwt.split('.')[1])).user_id
        const user = await prisma.user.findMany(
            {
                where: {
                    id: user_id,
                },
                include: {
                    projects: true,
                }
            }
        );

        const projects = []
        user[0].projects.forEach((data) => {
            projects.push(data.projectId)
        });

        return res.status(200).json({ projects: projects })
    }
}
