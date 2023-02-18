import {model, Schema, Types} from "mongoose";
import User from "./User";

const TaskSchema = new Schema({
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
    status: String,
});

const Task = model('Task', TaskSchema);
export default Task;