
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import { UserRoutes } from "./routes/users";
class Server {
    public app: express.Application;

    constructor() {
        dotenv.config();
        this.app = express();
        this.config();
        this.routes();
        this.mongo();
    }

    public routes(): void {
        this.app.use("/users", new UserRoutes().router);
    }

    public config(): void {
        this.app.set("port", process.env.PORT || 3000);
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cors());
    }

    private mongo() {
        const connection = mongoose.connection;
        mongoose.set("useCreateIndex", true);
        mongoose.set("useNewUrlParser", true);

        connection.on("connected", () => {
        console.log("Mongo Connection Established");
        });

        connection.on("reconnected", () => {
        console.log("Mongo Connection Reestablished");
        });

        connection.on("disconnected", () => {
        console.log("Mongo Connection Disconnected");
        console.log("Trying to reconnect to Mongo ...");

        setTimeout(() => {
            mongoose.connect(process.env["MONGODB_URI"], {
                autoReconnect: true, keepAlive: true,
                socketTimeoutMS: 3000, connectTimeoutMS: 3000
            });
        }, 3000);
        });

        connection.on("close", () => {
            console.log("Mongo Connection Closed");
        });

        connection.on("error", (error: Error) => {
            console.log("Mongo Connection ERROR: " + error);
        });

        const run = async () => {
            await mongoose.connect(process.env["MONGODB_URI"], {
                autoReconnect: true, keepAlive: true
            });
        };

        run().catch(error => console.error(error));
    }


    public start(): void {
        this.app.listen(this.app.get("port"), () => {
            console.log(
                "  API is running at http://localhost:%d",
                this.app.get("port")
            );
        });
    }
}

const server = new Server();

server.start();