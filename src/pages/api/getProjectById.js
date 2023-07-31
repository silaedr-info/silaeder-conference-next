import { PrismaClient } from '@prisma/client'
import {getCookie} from "cookies-next";

const prisma = new PrismaClient()

export default async function getProjectById(req, res) {
    const id = JSON.parse(req.body).id
    const jwt = getCookie('auth_token', { req, res })
    const user_id = JSON.parse(atob(jwt.split('.')[1])).user_id
    const all_projects = await prisma.project.findMany({
        include: {
            users: true
        }
    })
    const projects = []
    all_projects.forEach((project) => {
        // console.log(project.users[0].projectId, id, user_id)
        if ((project.users[0].projectId === id) && (project.users[0].userId === user_id)) {
            projects.push(project)
        }
    })
    await res.status(200).json({ project: projects[0] })
}