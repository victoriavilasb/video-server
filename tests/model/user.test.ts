const mongoose = require("mongoose");
const { User, IUser } = require("/Users/victoria/Github/video-server/src/models/user");
const bcrypt = require("bcrypt-nodejs");
const dotenv = require("dotenv");

const salt = bcrypt.genSaltSync(10);
dotenv.config();


describe("User Model Test", () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });

    it("create & save user successfully", async () => {
        const userData = { username: "victoria21", password: "pass", mobile_token: "AWSGRELD123" };

        const validUser = User(userData);
        const savedUser = await validUser.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.username).toEqual(validUser.username);
    });

    it("insert user successfully, but the field does not defined in schema should be undefined", async () => {
        const userWithInvalidField = User({ username: "user5", password: "1234", gender: "Male"});
        const savedUserWithInvalidField = await userWithInvalidField.save();
        expect(savedUserWithInvalidField._id).toBeDefined();
        expect(savedUserWithInvalidField.gender).toBeUndefined();
    });

    it("create user without required field should failed", async () => {
        const userWithoutRequiredField = User({ username: "victoria6", mobile_token: "123435" });
        let err;
        try {
            const savedUserWithoutRequiredField = await userWithoutRequiredField.save();
            err = savedUserWithoutRequiredField;
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });
});