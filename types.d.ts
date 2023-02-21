import {ObjectId} from "mongoose";

export interface IUser {
    username: string;
    password: string;
    token: string;
}

export interface ITask {
    user: ObjectId;
    title: string;
    description: string;
    status: string;
    id: string;
}