import { Router } from "express";
import { AuthController } from "../controllers/authController";

export class AuthRoute {

    router: Router;
    public authController: AuthController = new AuthController();

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.post("/", this.authController.authenticateUser);
    }
}
