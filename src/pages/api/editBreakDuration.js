import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient
export default async function editBreakDuration(req, res) {
    const { id, time } = req.body;

    await prisma.break.update({
        where: {
            id: id
        },
        data: {
            time: time
        }
    });

    res.status(200).json({ ok: true });
}
