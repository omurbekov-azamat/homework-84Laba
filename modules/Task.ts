import {model, Schema, Types} from "mongoose";
import User from "./User";
import {ITask} from "../types";

const TaskSchema = new Schema<ITask>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: async (value: Types.ObjectId) => User.findById(value),
            message: 'User does not exist',
        },
    },
    title: {
        type: String,
        required: true,
    },
    description: String,
    status: {
        type: String,
        enum: ['new', 'in_progress', 'complete'],
        default: 'new',
    }
});

const Task = model('Task', TaskSchema);
export default Task;