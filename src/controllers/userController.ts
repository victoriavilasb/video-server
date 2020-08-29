import bcrypt from "bcrypt-nodejs";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "../models/user";
const asyncHandler = require('express-async-handler')

export class UserController {
    public async register( req: Request, res: Response ): Promise<void> {
        const { username, password, mobile_token } = req.body;

        const findUser = await User.findOne({ username }, (err: Error) => {
            if (err) {
                console.error(err)
            }
        });

        if (!findUser) {
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

            res.status(200).json({ token: token });    
        }

     
        res.status(409).send({ error: "User already exists" })
    }
};