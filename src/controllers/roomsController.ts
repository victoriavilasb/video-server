import { NextFunction, Request, Response } from "express";
import  { Room, IRoom } from "../models/room";
import  { User, IUser } from "../models/user";

export class RoomsController {
    constructor() {
        this.createRoom = this.createRoom.bind(this);
    }

    private checkIfUserExists(username: string): Boolean {
        let user;
        async () => {
            user = await User.findOne({ username },
                (err: Error) => {
                    if (err)
                        console.error(err);
                }
            );
        };

        return !!user;
    }

    public async createRoom( req: Request, res: Response ): Promise<Response> {
        const { guid, host_user, participants } = req.body;

        const room = await Room.findOne({ guid },
            (err: Error) => {
                if (err) {
                    console.error(err);
                }
            }
        );

        if (room) {
            return res.status(409).json({ error: "Room already exists" });
        }

        const checkParticipants = [...participants, host_user].
            every((participant: string) => this.checkIfUserExists(participant));

        if (!checkParticipants) {
            return res.status(400).json({ error: "User does not exist" });
        }

        if (!participants.includes(host_user)) {
            req.body.participants = req.body.participants.push(host_user);
        }

        await Room.create(req.body,
            (err: Error) => {
                if (err) {
                    console.error(err);
                }
            }
        );

        return res.status(201).send({ status: "ok" });
    }

    public async findRoom( req: Request, res: Response ): Promise<Response> {
        const { guid } = req.params;

        const room = await Room.findOne({ guid },
            (err: Error) => {
                if (err) {
                    console.error(err);
                }
            }
        );

        if (!room) {
            return res.status(404).send({ error: "Room not found" });
        }

        return res.status(200).json({ data: room });
    }
}