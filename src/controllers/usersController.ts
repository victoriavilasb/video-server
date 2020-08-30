import bcrypt from "bcrypt-nodejs";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import  { User, IUser } from "../models/user";
import  { Room, IRoom } from "../models/room";

export class UsersController {
    constructor() {
        this.joinRoom  = this.joinRoom.bind(this);
        this.leaveRoom  = this.leaveRoom.bind(this);
        this.getUserByUsername = this.getUserByUsername.bind(this);
        this.listUsers = this.listUsers.bind(this);
    }

    private formatUserResponse( users: Array<IUser> ): Array<Object> {
        return users.map(user => {
            const { username, mobile_token } = user;
            return {
                username,
                mobile_token
            };
        });
    }

    private findUserInRoom( username: string, room: IRoom ): Boolean {
        const { participants, host_user } = room;

        const allParticipants = [...participants, host_user];

        return allParticipants.some(participant => participant == username);
    }

    public async register( req: Request, res: Response ): Promise<Response> {
        const { username, password, mobile_token } = req.body;

        const findUser = await User.findOne({ username }, (err: Error) => {
            if (err) {
                console.error(err);
            }
        });

        if (findUser)
            return res.status(409).send({ error: "User already exists" });

        const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

        await User.create({
            username,
            mobile_token: mobile_token,
            password: hashPassword
        }, (err: Error, res: any) => {
            if (err) {
                console.error(err);
            }
        });

        const token = jwt.sign({ username: username, scope: req.body.scope }, process.env["JWT_SECRET"]);

        return res.status(201).json({ token: token });
    }

    public async getUserByUsername( req: Request, res: Response ): Promise<Response> {
        const { username } = req.params;

        const users = await User.find({ username }, (err: Error) => {
            if (err) {
                console.error(err);
            }
        });

        if (users)
            return res.status(200).json({ data: this.formatUserResponse(users) });

        return res.status(404).send({ error: "User not found" });
    }

    public async listUsers( req: Request, res: Response ): Promise<Response> {
        const users = await User.find({ }, (err: Error) => {
            if (err) {
                console.error(err);
            }
        });

        if (users)
            return res.status(200).json({ data: this.formatUserResponse(users) });

        return res.status(404).send({ error: "User not found"});
    }

    public async updateUser( req: Request, res: Response ): Promise<Response> {
        const { username, password, mobile_token } = req.body;

        const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

        await User.findOneAndUpdate({ username },
            {
                username,
                password: hashPassword,
                mobile_token
            }, (err: Error, user) => {
            if (!user) {
                return res.status(404).send({msg: "User not found."});
            }
            if (err) {
                console.error(err);
            }
        });

        return res.status(204).send({status: "ok"});
    }

    public async deleteUser( req: Request, res: Response): Promise<Response> {
        const { username } = req.params;

        await User.deleteOne({ username },
            (err: Error) => {
                if (err) {
                    console.error(err);
                }
            }
        );

        return res.status(204).json({ msg: "User deleted sucessfully"});
    }

    public async joinRoom( req: Request, res: Response): Promise<Response> {
        const { username, guid } = req.params;

        const user = await Room.findOne({ username },
            (err: Error) => {
                if (err) {
                    console.error(err);
                }
            }
        );

        if (user) {
            return res.status(400).json({ msg: `User not found.`, username });
        }

        const room = await Room.findOne({ guid },
            (err: Error) => {
                if (err) {
                    console.error(err);
                }
            }
        );

        if (!room) {
            return res.status(400).json({ msg: `Room not found` });
        }

        if (this.findUserInRoom(username, room)) {
            return res.status(409).json({ msg: `User is already in the room.`});
        }

        const { participants, capacity } = room;
        if (participants.length == capacity) {
            return res.status(409).json({ msg: `Room is full, user can not join.`});
        }

        participants.push(username);
        await Room.updateOne({ guid },
            { participants },
            (err: Error) => {
                if (err) {
                    console.error(err);
                }
            }
        );

        return res.status(204).json({ msg: `User ${username} has join room`});
    }

    public async leaveRoom( req: Request, res: Response): Promise<Response> {
        const { username, guid } = req.params;

        const user = await Room.findOne({ username },
            (err: Error) => {
                if (err) {
                    console.error(err);
                }
            }
        );

        if (user) {
            return res.status(400).json({ msg: `User not found`, username });
        }

        const room = await Room.findOne({ guid },
            (err: Error) => {
                if (err) {
                    console.error(err);
                }
            }
        );

        if (!room) {
            return res.status(400).json({ msg: `Room not found` });
        }

        if (!this.findUserInRoom(username, room)) {
            return res.status(404).json({ msg: `User is not in room.`});
        }

        let { participants, host_user } = room;

        participants = participants.filter(participant => participant != username);

        if (host_user == username) {
            host_user = participants[0];
        }

        await Room.updateOne({ guid },
            { participants, host_user },
            (err: Error) => {
                if (err) {
                    console.error(err);
                }
            }
        );

        return res.status(204).send({ data: `User ${username} has leave room`});
    }

    public async searchUserRooms( req: Request, res: Response ): Promise<Response> {
        const { username } = req.params;

        const user = await Room.findOne({ username },
            (err: Error) => {
                if (err) {
                    console.error(err);
                }
            }
        );

        if (user) {
            return res.status(400).json({ msg: `User not found`, username });
        }

        const rooms = await Room.find( {},
            (err: Error) => {
                if (err) {
                    console.error(err);
                }
            }
        );

        const listOfRooms = rooms.filter(room => {
            return room.participants.includes(username);
        }).map(room => room.guid);

        return res.status(200).json({ data: listOfRooms });
    }
}