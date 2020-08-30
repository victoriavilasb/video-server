import { Router } from "express";
import { UsersController } from "../controllers/usersController";
import { AuthController } from "../controllers/authController";

export class UsersRoutes {

    router: Router;
    public usersController: UsersController = new UsersController();
    public authController: AuthController = new AuthController();

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get("/:username", this.usersController.getUserByUsername);
        this.router.get("/", this.usersController.listUsers);
        this.router.post("/register", this.usersController.register);
        this.router.patch("/:username/update", this.authController.authenticateJWT, this.usersController.updateUser);
        this.router.delete("/:username/delete", this.authController.authenticateJWT, this.usersController.deleteUser);
        this.router.patch("/:username/join/:guid", this.authController.authenticateJWT, this.usersController.joinRoom);
        this.router.patch("/:username/leave/:guid", this.authController.authenticateJWT, this.usersController.leaveRoom);
        this.router.get("/:username/rooms", this.usersController.searchUserRooms);
    }
}

