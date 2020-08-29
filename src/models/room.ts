import mongoose, { Document, Schema, Model, Error, model } from "mongoose";
import bcrypt from "bcrypt-nodejs";

export interface IRoom extends Document {
    name: string;
    guid: string;
    hostUser: string;
    participants: Array<string>;
    capacity: number;
}

const RoomSchema: Schema = new Schema({
    name: { Type: String, required: true },
    guid: { Type: String, required: true, unique: true },
    hostUser: { Type: String, required: true },
    participants: { Type: Array, required: true },
    capacity: { Type: Number, required: true, default: 5 }
});

export default mongoose.model<IRoom>("Room", RoomSchema);