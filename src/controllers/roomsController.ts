import { NextFunction, Request, Response } from "express";
import  { Room, IRoom } from "../models/room";

export class RoomsController {
    public async createRoom( req: Request, res: Response ): Promise<Response> {
        const { guid } = req.body;

        const room = await Room.findOne({ guid },
            (err: Error) => {
                if (err) {
                    console.error(err);
                }
            }
        );

        if (room) {
            return res.status(409).send({ error: "Room already exists" });
        }

        await Room.create(req.body,
            (err: Error) => {
                if (err) {
                    console.error(err);
                }
            }
        );

        return res.status(201);
    }
}