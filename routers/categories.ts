import express from "express";
import mysqlDb from "../mysqlDb";
import {Category, CategoryWithoutID} from "../types";
import {ResultSetHeader} from "mysql2";
const categoriesRouter = express.Router();


categoriesRouter.post("/", async (req, res) => {
    if (!req.body.title) {
        res.status(400).send({error: "Title is required"});
        return;
    }

    const category: CategoryWithoutID = {
        title: req.body.title,
        description: req.body.description || null,
    }

    const connection = await mysqlDb.getConnection();
    const [result] = await connection.query("INSERT INTO categories (title, description) VALUES (?, ?)",
        [category.title, category.description]);

    const resultHeader = result as ResultSetHeader;

    const [resultCategory] = await connection.query('SELECT * FROM categories WHERE id = ?', [resultHeader.insertId]);
    const oneCategory = resultCategory as Category[];

    if (oneCategory.length === 0) {
        res.status(404).send("Category not found");
    } else {
        res.send(oneCategory[0]);
    }
})

categoriesRouter.get("/", async (_req, res, next) => {
    try {
        const connection = await mysqlDb.getConnection();
        const [result] = await connection.query('SELECT * FROM categories');
        const categories = result as Category[];
        res.send(categories);
    } catch (e) {
        next(e);
    }
});

categoriesRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    const connection = await mysqlDb.getConnection();
    const [result] = await connection.query('SELECT * FROM categories WHERE id = ?', [id]);
    const categories = result as Category[];
    if (categories.length === 0) {
        res.status(404).send(`No category found with this ${id}`);
    } else {
        res.status(200).send(categories[0]);
    }
})
//
// categoriesRouter.put("/:id", async (req, res) => {
//     const id = req.params.id;
//     const connection = await mysqlDb.getConnection();
//     const [resultWithId] = await connection.query("SELECT * FROM categories WHERE id = ?", [id]);
//     const categoryWithId = resultWithId as Category[];
//     console.log(categoryWithId);
//     const [result] = await connection.query("UPDATE categories SET (title, description) VALUES (?,  ?) WHERE id = ?", [id]);
//
// })
//
//
// categoriesRouter.delete("/:id", async (req, res) => {
//
// })


export default categoriesRouter;