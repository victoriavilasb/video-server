import mongoose, { Document, Schema, Model, Error, model } from "mongoose";
import bcrypt from "bcrypt-nodejs";

export interface IUser extends Document {
    username: string;
    password: string;
    mobile_token: string;
}

const UserSchema: Schema = new Schema({
    username: { Type: String, required: true, unique: true },
    password: { Type: String, required: true },
    mobile_token: { Type: String, required: true, unique: true }
});

export default mongoose.model<IUser>("User", UserSchema);