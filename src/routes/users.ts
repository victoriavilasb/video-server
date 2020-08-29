import { Router } from "express";
import { UsersController } from "../controllers/usersController";

export class UsersRoutes {

    router: Router;
    public usersController: UsersController = new UsersController();

    constructor() {
        this.router = Router();
        this.routes();
    }

    // PATCH Join/leave room
    // GET Search rooms that a user is in /rooms/:user
    routes() {
        this.router.get("/:username", this.usersController.getUserByUsername.bind(this.usersController));
        this.router.get("/", this.usersController.listUsers.bind(this.usersController));
        this.router.post("/register", this.usersController.register.bind(this.usersController));
        this.router.patch("/:username/update", this.usersController.updateUser.bind(this.usersController));
        this.router.delete("/:username/delete", this.usersController.deleteUser.bind(this.usersController));
        this.router.patch("/:username/join/:guid", this.usersController.joinRoom).bind(this.usersController);
        // this.router.patch("/:username/leave/:guid", this.usersController.leaveRoom);
        // this.router.get("/:username/rooms", this.searchUserRooms);
    }
}

