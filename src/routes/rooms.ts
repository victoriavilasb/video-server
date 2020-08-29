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
        // this.router.patch("/:room/updateHost", this.roomsController.updateRoom);
        // this.router.get("/:room", this.roomsController.getRoom);
    }
}
