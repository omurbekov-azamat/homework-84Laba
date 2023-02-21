import mongoose from "mongoose";
import User from "./modules/User";
import Task from "./modules/Task";
import config from "./config";
import {randomUUID} from "crypto";

const run = async () => {
    mongoose.set('strictQuery', false);
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection('users');
        await db.dropCollection('tasks');
    } catch (e) {
        console.log('Collections were not present, skipping drop...');
    }

    const [userFirst, userSecond] = await User.create({
        username: 'user-1',
        password: 'qwerty',
        token: randomUUID(),
    }, {
        username: 'user-2',
        password: '12345',
        token: randomUUID(),
    });

    await Task.create({
        user: userFirst._id,
        title: 'Preparing meals',
        description: 'description meals',
        status: 'new',
    }, {
        user: userSecond._id,
        title: 'Clean the house',
        description: 'description house',
        status: 'in_progress'
    });
    await db.close();
};

void run();