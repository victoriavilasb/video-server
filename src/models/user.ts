import { Document, Schema, Model, Error, model } from "mongoose";
import bcrypt from "bcrypt-nodejs";

const salt = bcrypt.genSaltSync(10);

export interface IUser extends Document {
    username: string;
    password: string;
    mobile_token: string;
}

const userSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true,  },
    mobile_token: { type: String, required: false }
});

userSchema.pre<IUser>("save", function save(next) {
    const user = this;

    if (user.isModified("password") || user.isNew) {
        bcrypt.hash(this.password, salt, undefined, (err: Error, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    }
});

userSchema.methods.comparePassword = function (candidatePassword: string, callback: any) {
    bcrypt.compare(candidatePassword, this.password, function(err: Error, isMatch: boolean) {
        if (err) return callback(err);
        return callback(undefined, isMatch);
    });
};

export const User: Model<IUser> = model<IUser>("User", userSchema);