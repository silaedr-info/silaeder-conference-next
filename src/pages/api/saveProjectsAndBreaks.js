import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient
export default async function saveProjectsAndBreaks(req, res) {
    const objects = req.body.objects1;

    for (const el of objects) {
        const idx = objects.indexOf(el);

        if (el.type === "project") {
            const prj = await prisma.project.findMany({
                where: {
                    schedulePos: el.schedulePos
                }
            });

            await prisma.project.update({
                where: {
                    id: prj[0].schedulePos
                },

                data: {
                    schedulePos: idx
                }
            });
        }

        if (el.type === "break") {
            await prisma.break.update({
                where: {
                    id: el.schedulePos
                },

                data: {
                    schedulePos: idx
                }
            });
        }
    }

    res.status(200).json({ ok: true })
}