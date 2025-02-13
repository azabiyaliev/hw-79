import express from "express";
import categoriesRouter from "./routers/categories";
import mysqlDb from "./mysqlDb";
import locationsRouter from "./routers/locations";
import subjectsRouter from "./routers/subjects";

const app = express();
const port = 8000;

app.use(express.json());

app.use("/categories", categoriesRouter);
app.use("/locations", locationsRouter);
app.use("/subjects", subjectsRouter);

const run = async () => {

    await mysqlDb.init();

    app.listen(port, () => {
        console.log(`Server started on port http://localhost:${port}`);
    });
}

run().catch(err => console.log(err));