import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();


export default async function createEmptyProject(req, res) {
    if (req.method === 'POST') {
        try {
            await prisma.project.create({
                data: {
                    name: '',
                    description: '',
                    section: '',
                    timeForSpeech: 5,
                    schedulePos: 0,
                    active: true,
                    grade: 0,
                    isHidden: false,
                }
            })
            res.status(200).json({
                status: 'ok'
            });
        } catch (e) {
            res.status(200).json({
                status: 'error'
            })
        }
    }
}