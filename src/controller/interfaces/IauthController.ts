
import { Request, Response, NextFunction } from "express";
import { IUser } from "../../model/userModel";

export interface IAuthController {
    userSignup(req: Request, res: Response, next: NextFunction): Promise<void>;
    userLogin(req: Request, res: Response, next: NextFunction): void;
}
