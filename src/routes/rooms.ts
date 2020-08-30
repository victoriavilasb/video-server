import { Router } from "express";
import { RoomsController } from "../controllers/roomsController";

export class RoomsRoutes {

    router: Router;
    public roomsController: RoomsController = new RoomsController();

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.post("/", this.roomsController.createRoom);
        this.router.patch("/:guid/updateHost", this.roomsController.updateHost);
        this.router.get("/:guid", this.roomsController.findRoom);
    }
}
