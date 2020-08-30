import { NextFunction, Request, Response } from "express";
import passport from "passport";
import "../auth/passportHandler";
import * as jwt from "jsonwebtoken";

export class AuthController {
  public authenticateJWT(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("jwt", (err, user, info) => {
      if (err) {
        console.log(err);
        return res.status(401).json({ status: "error", code: "unauthorized" });
      }
      if (!user) {
        return res.status(401).json({ status: "error", code: "unauthorized" });
      }

      return next();
    })(req, res, next);
  }

  public authorizeJWT(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("jwt", (err, user, jwtToken) => {
      if (err) {
        console.log(err);
        return res.status(401).json({ status: "error", code: "unauthorized" });
      }
      if (!user) {
        return res.status(401).json({ status: "error", code: "unauthorized" });
      }

      const scope = req.baseUrl.split("/").slice(-1)[0];

      const authScope = jwtToken.scope;
      if (authScope && authScope.indexOf(scope) > -1) {
        return next();
      }

      return res.status(401).json({ status: "error", code: "unauthorized" });
    })(req, res, next);
  }

  public authenticateUser(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ status: "error", code: "unauthorized" });
      }

      const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
      return res.status(200).send({ token: token });
    })(req, res, next);
  }
}
