import express from "express";
import mysqlDb from "../mysqlDb";
import {Subject, SubjectWithoutID} from "../types";
import {ResultSetHeader} from "mysql2";
import {imagesUpload} from "../multer";
const subjectsRouter = express.Router();


subjectsRouter.post("/", imagesUpload.single("image"), async (req, res) => {
    if (!req.body.title || !req.body.category_id || !req.body.location_id) {
        res.status(400).send({error: "Title, category_id, location_id is required"});
        return;
    }

    const subject: SubjectWithoutID = {
        category_id: req.body.category_id,
        location_id: req.body.location_id,
        title: req.body.title,
        description: req.body.description || null,
        image: req.file ? "images" + req.file.filename : null,
    }

    const connection = await mysqlDb.getConnection();
    const [result] = await connection.query("INSERT INTO subjects (category_id, location_id, title, description, image) VALUES (?, ?, ?, ?, ?)",
        [subject.category_id, subject.location_id, subject.title, subject.description, subject.image]);

    const resultHeader = result as ResultSetHeader;

    const [resultSubject] = await connection.query('SELECT * FROM subjects WHERE id = ?', [resultHeader.insertId]);
    const oneSubject = resultSubject as Subject[];

    if (oneSubject.length === 0) {
        res.status(404).send("Subject not found");
    } else {
        res.send(oneSubject[0]);
    }
})

subjectsRouter.get("/", async (_req, res, next) => {
    try {
        const connection = await mysqlDb.getConnection();
        const [result] = await connection.query('SELECT * FROM subjects');
        const subjects = result as Subject[];
        res.send(subjects);
    } catch (e) {
        next(e);
    }
});

subjectsRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    const connection = await mysqlDb.getConnection();
    const [result] = await connection.query('SELECT * FROM subjects WHERE id = ?', [id]);
    const subjects = result as Subject[];
    if (subjects.length === 0) {
        res.status(404).send(`No subject found with this ${id}`);
    } else {
        res.status(200).send(subjects[0]);
    }
})



export default subjectsRouter;