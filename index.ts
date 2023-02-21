import express from "express";
import mongoose from "mongoose";
import usersRouter from "./routers/users";
import tasksRouter from "./routers/tasks";
import config from "./config";

const app = express();
const port = 8000;

app.use(express.json());
app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);

const run = async () => {
    mongoose.set('strictQuery', false);
    await mongoose.connect(config.db);

    app.listen(port, () => {
        console.log('We are live on ' + port);
    });

    process.on('exit', () => {
        mongoose.disconnect();
    });
};

run().catch(console.error);