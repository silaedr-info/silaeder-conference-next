import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
    api: {
        bodyParser: false
    }
};

const post = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        await saveFile(files.file, fields.type, fields.id, fields.wasProject);
        return res.status(201).send("");
    });
};

const saveFile = async (file, type, id, wasProject) => {
    if (!wasProject) {
        try {
            const data = fs.readFileSync(file.filepath);
            fs.writeFileSync(`./files/${type}/${id}${path.extname(file.originalFilename)}`, data);
            await fs.unlinkSync(file.filepath);
        } catch (e) {
            
        }
    } else {
        try {
            const data = fs.readFileSync(file.filepath);
            await fs.unlinkSync(`./files/${type}/${id}${path.extname(file.originalFilename)}`);
            fs.writeFileSync(`./files/${type}/${id}${path.extname(file.originalFilename)}`, data);
            await fs.unlinkSync(file.filepath);
        } catch (e) {
            
        }
    }
    return 'ok';
};

export default (req, res) => {
    req.method === "POST"
        ? post(req, res)
        : req.method === "PUT"
            ? console.log("PUT")
            : req.method === "DELETE"
                ? console.log("DELETE")
                : req.method === "GET"
                    ? console.log("GET")
                    : res.status(404).send("");
};
