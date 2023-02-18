import express from "express";
import {Error} from "mongoose";
import User from "../modules/User";
import Task from "../modules/Task";

const tasksRouter = express.Router();

tasksRouter.post('/', async (req, res, next) => {
    if (!req.body.title || !req.body.status) {
        return res.status(400).send({error: 'Title and status field is required'});
    }

    if (req.body.status !== "new" && req.body.status !== 'in_progress' && req.body.status !== 'complete') {
            return res.status(400).send({error: 'Status only can be: new, in_progress or complete'});
    }

    try {
        const token = req.get('Authorization');

        if (!token) {
            return res.status(400).send({error: 'No token present'});
        }


        const user = await User.findOne({token});

        if (!user) {
            return res.status(400).send({error: 'Wrong token!'});
        }

        const task = new Task({
            user: user.id,
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
        });

        await task.save();
        return res.send(task);
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            return res.status(400).send(error);
        }

        return next(error);
    }
});

export default tasksRouter;