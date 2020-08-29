// import mongoose from "mongoose";
// import { User , IUser   } from "@models/user";

// describe("User model", () => {
//     beforeAll(async () => {
//         await mongoose.connect("mongodb://db:27017", {
//           useNewUrlParser: true
//         });
//       });

//     afterAll(async () => {
//         mongoose.connection.close();
//     });

//     it("Should throw validation errors", () => {
//         const user = new User();

//         expect(user.validate).toThrow();
//     });

//     it("Should save a user", async () => {
//         expect.assertions(3);

//         const user: IUser = new User({
//             username: "victoriaovilas",
//             password: "123",
//         });
//         const spy = jest.spyOn(user, "save");

//         // Should await so the teardown doesn't throw an exception
//         // Thanks @briosheje
//         user.save();

//         expect(spy).toHaveBeenCalled();

//         expect(user).toMatchObject({
//             username: expect.any(String),
//             password: expect.any(String),
//         });

//         expect(user.username).toBe("victoriaovilas");
//     });
// });