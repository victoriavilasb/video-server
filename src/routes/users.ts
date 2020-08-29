import { Router } from "express";
import { UserController } from "../controllers/userController";

export class UserRoutes {

    router: Router;
    public userController: UserController = new UserController();

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get("/:username", this.userController.getUserByUsername);
        this.router.get("/", this.userController.listUsers);
        this.router.post("/register", this.userController.register);
        this.router.patch("/:username/update", this.userController.updateUser);
        this.router.delete("/:username/delete", this.userController.deleteUser);
    }
}

