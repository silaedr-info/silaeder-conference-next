import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default async function handler(req, res) {
    if (req.method === "POST") {
        const {email} = req.body;

        const user = await prisma.user.findMany({
            where: {
                email: email
            }
        });

        if (user.length !== 0) {
            const code = getRandomInt(1000, 9999);

            return res.status(200).json({code: code, name: user[0].name});
        } else {
            return res.status(200).json({error: "not found"});
        }
    }
}