import {PrismaClient} from '@prisma/client';
import jwt from 'jsonwebtoken';
import requestIp from 'request-ip';
import {setCookie} from "cookies-next";

const prisma = new PrismaClient()

export default async function handler(req, res) {
    if (req.method === "POST") {
        const {email, password_hash} = JSON.parse(req.body);
        const ip = requestIp.getClientIp(req);

        const user = await prisma.user.findMany({
            where: {
                email: email,
                password_hash: password_hash
            }
        });

        if ((user.length !== 0) && (user[0].password_hash === password_hash)) {
            const token = jwt.sign({ip: ip, user_id: user[0].id}, password_hash);
            setCookie('auth_token', token, { req, res })

            res.status(200).json({
                token: token
            });
        } else {
            res.status(200).json({
                error: "not found"
            });
        }
    }
}