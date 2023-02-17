import {Model, model, Schema} from "mongoose";
import {randomUUID} from "crypto";
import {IUser} from "../types";

interface IUserMethods {
    generateToken(): void;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
});

UserSchema.methods.generateToken = function () {
    this.token = randomUUID();
};

const User = model<IUser, UserModel>('User', UserSchema);
export default User;