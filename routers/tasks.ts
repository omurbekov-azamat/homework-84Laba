import express from "express";
import {Error} from "mongoose";
import auth, {RequestWithUser} from "../middleware/auth";
import Task from "../modules/Task";

const tasksRouter = express.Router();

tasksRouter.post('/', auth, async (req, res, next) => {
    if (!req.body.title) {
        return res.status(400).send({error: 'Title field is required'});
    }

    const user = (req as RequestWithUser).user;
    try {
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

tasksRouter.get('/', auth, async (req, res, next) => {
    const user = (req as RequestWithUser).user;
    try {
        const tasks = await Task.find({user: user.id});
        return res.send(tasks);
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            return res.status(400).send(error);
        }

        return next(error);
    }
});

tasksRouter.put('/:id', auth, async (req, res, next) => {

    if (!req.body.title || !req.body.status) {
        return res.status(400).send({error: 'Title and status field is required'});
    }

    if (req.body.status !== "new" && req.body.status !== 'in_progress' && req.body.status !== 'complete') {
        return res.status(400).send({error: 'Status only can be: new, in_progress or complete'});
    }

    const user = (req as RequestWithUser).user;
    const updateTask = {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
    };

    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.send({error: "ID is not correct"});
        }

        if (task.user.toString() === user.id.toString()) {
            await Task.updateOne({_id: req.params.id}, {$set: updateTask});
            return res.send(updateTask);
        } else {
            return res.status(403).send({error: 'You can not change that task!'});
        }
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            return res.status(400).send(error);
        } else if (error instanceof Error.CastError) {
            return res.send({error: "ID is not correct"});
        } else {
            return next();
        }
    }
});

tasksRouter.delete('/:id', auth, async (req, res, next) => {
    const user = (req as RequestWithUser).user;
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.send({error: "ID is not correct"});
        }

        if (task.user.toString() === user.id.toString()) {
            await Task.deleteOne({_id: req.params.id});
            return res.send({message: 'You have deleted your task'});
        } else {
            return res.status(403).send({error: 'You can not delete that task!'});
        }
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            return res.status(400).send(error);
        } else if (error instanceof Error.CastError) {
            return res.send({error: "ID is not correct"});
        } else {
            return next();
        }
    }
});

export default tasksRouter;