import { Router } from "express";
import { UsersController } from "../controllers/usersController";

export class UsersRoutes {

    router: Router;
    public usersController: UsersController = new UsersController();

    constructor() {
        this.router = Router();
        this.routes();
    }

    // GET Search rooms that a user is in /rooms/:user
    routes() {
        this.router.get("/:username", this.usersController.getUserByUsername);
        this.router.get("/", this.usersController.listUsers);
        this.router.post("/register", this.usersController.register);
        this.router.patch("/:username/update", this.usersController.updateUser);
        this.router.delete("/:username/delete", this.usersController.deleteUser);
        this.router.patch("/:username/join/:guid", this.usersController.joinRoom);
        this.router.patch("/:username/leave/:guid", this.usersController.leaveRoom);
        this.router.get("/:username/rooms", this.usersController.searchUserRooms);
    }
}

