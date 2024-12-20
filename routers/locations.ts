import express from "express";
import mysqlDb from "../mysqlDb";
import { Location, LocationWithoutID} from "../types";
import {ResultSetHeader} from "mysql2";
const locationsRouter = express.Router();


locationsRouter.post("/", async (req, res) => {
    if (!req.body.title) {
        res.status(400).send({error: "Title is required"});
        return;
    }

    const location: LocationWithoutID = {
        title: req.body.title,
        description: req.body.description || null,
    }

    const connection = await mysqlDb.getConnection();
    const [result] = await connection.query("INSERT INTO locations (title, description) VALUES (?, ?)",
        [location.title, location.description]);

    const resultHeader = result as ResultSetHeader;

    const [resultLocation] = await connection.query('SELECT * FROM locations WHERE id = ?', [resultHeader.insertId]);
    const oneLocation = resultLocation as Location[];

    if (oneLocation.length === 0) {
        res.status(404).send("Location not found");
    } else {
        res.send(oneLocation[0]);
    }
})

locationsRouter.get("/", async (_req, res, next) => {
    try {
        const connection = await mysqlDb.getConnection();
        const [result] = await connection.query('SELECT * FROM locations');
        const locations = result as Location[];
        res.send(locations);
    } catch (e) {
        next(e);
    }
});

locationsRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    const connection = await mysqlDb.getConnection();
    const [result] = await connection.query('SELECT * FROM locations WHERE id = ?', [id]);
    const locations = result as Location[];
    if (locations.length === 0) {
        res.status(404).send(`No location found with this ${id}`);
    } else {
        res.status(200).send(locations[0]);
    }
})

locationsRouter.put("/:id", async (req, res) => {
    const id = req.params.id;
    const connection = await mysqlDb.getConnection();
    const [resultWithId] = await connection.query("SELECT * FROM locations WHERE id = ?", [id]);
    const locationWithId = resultWithId as Location[];
    const [result] = await connection.query("UPDATE locations SET title = ?, description = ? WHERE id = ?", [req.body.title || locationWithId[0].title, req.body.description || locationWithId[0].description, id]);
    const [resultLocation] = await connection.query('SELECT * FROM locations WHERE id = ?', [id]);
    const oneLocation = resultLocation as Location[];
    res.send(oneLocation[0]);
})

locationsRouter.delete("/:id", async (req, res, next) => {
    const id = req.params.id;
    try {
        const connection = await mysqlDb.getConnection();
        const [result] = await connection.query("DELETE FROM locations WHERE id = ?", [id]);
        res.status(200).send("Entity successfully deleted");
    } catch (e) {
        next(e);
    }
})



export default locationsRouter;