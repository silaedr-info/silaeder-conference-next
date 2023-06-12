import { PrismaClient } from "@prisma/client";
import { getCookie } from "cookies-next";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function fill_project_form(req, res) {
    if (req.method === "post") {
        const project_form = req.form.get();
        const project_name = project_form["name"];
        const project_description = project_form["description"];
        const tutor = project_form["tutor"];
        const participants = project_form["participants"];
        const section = project_form["section"];
        const time_for_speech = project_form["time_for_speech"];
        const grade = project_form["classes"];
        const decoded = jwt.verify(getCookie('auth', { req, res }));
        const user_id = decoded.user_id;
        const conference = prisma.conference.findMany({
            where: {
                id: project_form['conference_id']
            }
        })[0]
        const schedule_pos = conference.project.length+conference.break.length
        const project = await prisma.project.create({
            data: {
                name: project_form['name'],
                description: project_form['description'],
                section: project_form['section'],
                timeForSpeech: project_form['time_for_speech'],
                userId: user_id,
                grade: project_form['grade'],
                conferenceId: conference.id,
                active: true,
                schedulePos: schedule_pos
            }
        })
    }
}
