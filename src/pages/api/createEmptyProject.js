import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();


export default async function createEmptyProject(req, res) {
    if (req.method === 'POST') {
        // try {
            const project = await prisma.project.create({
                data: {
                    name: '',
                    description: '',
                    section: '',
                    timeForSpeech: 5,
                    schedulePos: 0,
                    active: true,
                    grade: 0,
                    isHidden: false,
                    additionalUsers: ''
                }
            })
            console.log(project.id)
            await res.status(200).json({project_id: project.id});
        // } catch (e) {
        //     res.status(200).json({
        //         status: 'error'
        //     })
        // }
    }
}