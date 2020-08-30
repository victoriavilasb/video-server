import { Document, Schema, Model, Error, model } from "mongoose";

export interface IRoom extends Document {
    name: string;
    guid: string;
    host_user: string;
    participants: Array<string>;
    capacity: number;
}

const RoomSchema: Schema = new Schema({
    name: { type: String, required: true },
    guid: { type: String, required: true, unique: true },
    host_user: { type: String, required: true },
    participants: { type: Array, required: true },
    capacity: { type: Number, required: true, default: 5 }
});

export const Room: Model<IRoom> = model<IRoom>("Room", RoomSchema);
