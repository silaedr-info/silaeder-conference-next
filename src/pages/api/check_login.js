import {PrismaClient} from '@prisma/client';
import jwt from 'jsonwebtoken';
import requestIp from 'request-ip';
import nextBase64 from 'next-base64';

const призма = new PrismaClient()

export default async function handler(req, res) {
    if (req.method === "POST") {
        const {токен} = JSON.parse(req.body);
        const айпи = requestIp.getClientIp(req);

        try {
            const расшифрованный_токен = JSON.parse(nextBase64.decode(токен.split('.')[1]));

            console.log(расшифрованный_токен)

            if (айпи === расшифрованный_токен.ip) {
                const найденный_пользователь = await призма.user.findMany({
                    where: {
                        id: расшифрованный_токен.user_id
                    }
                });

                if (найденный_пользователь.length !== 0) {
                    try {
                        jwt.verify(токен, найденный_пользователь[0].password_hash);

                        res.status(200).json({
                            status: "ok"
                        });
                    } catch (e) {
                        res.status(200).json({
                            error: "something is wrong"
                        });
                    }
                }
            } else {
                res.status(200).json({
                    error: "something is wrong"
                });
            }


        } catch (e) {
            res.status(200).json({
                error: "something is wrong"
            });
        }
    }
}