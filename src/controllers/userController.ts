import bcrypt from "bcrypt-nodejs";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import  { User, IUser } from "../models/user";

export class UserController {
    public async register( req: Request, res: Response ): Promise<Response> {
        const { username, password, mobile_token } = req.body;

        const findUser = await User.findOne({ username }, (err: Error) => {
            if (err) {
                console.error(err)
            }
        });

        if (findUser) 
            return res.status(409).send({ error: "User already exists" })
        
        const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

        await User.create({
            username,
            mobile_token: mobile_token,
            password: hashPassword
        }, (err: Error, res: any) => {
            if (err) {
                console.error(err)
            }
        })    

        const token = jwt.sign({ username: username, scope: req.body.scope }, process.env["JWT_SECRET"])

        return res.status(201).json({ token: token });    
    }

    public async getUserByUsername( req: Request, res: Response ): Promise<Response> {
        const { username } = req.params;

        const users = await User.find({ username }, (err: Error) => {
            if (err) {
                console.error(err)
            }
        })

        if (users)
            return res.status(200).json({ data: 
                users.map(user => {
                    const { username, mobile_token } = user;
                    return {
                        username,
                        mobile_token
                    }
                }) 
            });

        return res.status(404).send({ error: "User not found"})
    }

    public async listUsers( req: Request, res: Response ): Promise<Response> {
        const users = await User.find({ }, (err: Error) => {
            if (err) {
                console.error(err)
            }
        })

        if (users)
            return res.status(200).json({ data: 
                users.map(user => {
                    const { username, mobile_token } = user;
                    return {
                        username,
                        mobile_token
                    }
                }) 
            });

        return res.status(404).send({ error: "User not found"});
    }

    public async updateUser( req: Request, res: Response ): Promise<Response> {
        const { username, password, mobile_token } = req.body

        const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

        await User.findOneAndUpdate({ username }, 
            { 
                username, 
                password: hashPassword,
                mobile_token
            }, (err: Error) => {
            if (err) {
                console.error(err)
            }
        })

        return res.status(204)
    }

    public async deleteUser( req: Request, res: Response): Promise<Response> {
        const { username } = req.params;

        await User.deleteOne({ username },
            (err: Error) => {
                if (err) {
                    console.error(err)
                }
            }
        )

        return res.status(204).json({ msg: "User deleted sucessfully"})
    }
};