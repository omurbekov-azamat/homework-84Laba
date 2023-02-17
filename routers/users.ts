import express from 'express';
import {Error} from "mongoose";
import User from "../modules/User";

const usersRouter = express.Router();

usersRouter.post('/', async (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send({error: 'You have to fields username and password'});
    }

    try {
        const findUser = await User.findOne({username: req.body.username});

        if (findUser) {
            return res.status(400).send({error: 'this username is already taken'});
        }

        const user = new User({
            username: req.body.username,
            password: req.body.password,
        });

        user.generateToken();
        await user.save();
        return res.send(user);
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            return res.status(400).send(error);
        }

        return next(error);
    }
});

usersRouter.post('/sessions', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send({error: 'You have to fields username and password'});
    }

    const user = await User.findOne({username: req.body.username});

    if (!user) {
        return res.status(400).send({error: 'Username not found'});
    }

    const isMatch = await user.checkPassword(req.body.password);

    if (!isMatch) {
        return res.status(404).send({error: 'Password is wrong'});
    }

    user.generateToken();
    await user.save();

    return res.send({message: 'Username and password correct', user});
});

export default usersRouter;