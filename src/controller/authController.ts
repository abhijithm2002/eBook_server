import { Request, Response, NextFunction } from "express";
import Users from "../model/userModel.js";
import bcrypt from 'bcrypt'
import { IAuthController } from "./interfaces/IauthController.js";
import generateJwt from "../middleware/jwt.js";
import { Payload } from "../middleware/jwt.js";

export default class AuthController implements IAuthController {
    async userSignup(req: Request, res: Response, next: NextFunction): Promise<void > {
        try {
            const { name, email, password } = req.body;

            const existingUser = await Users.findOne({ email });
            if (existingUser) {
                res.status(400).json({ message: "Email already exists" });
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new Users({
                name,
                email,
                password: hashedPassword,
            });

            await newUser.save();

            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            console.error("Error in userSignup:", error);
            res.status(500).json({ message: "An error occurred during signup" });
        }
    }

    async userLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;
            const userData = await Users.findOne({ email }).exec();
            console.log(userData)
            if (!userData) {
                res.status(400).json({ message: "Email is incorrect" });
                return;
            }
    
            const isMatch = await bcrypt.compare(password, userData.password as string);
            if (!isMatch) {
                res.status(401).json({ message: "Password is incorrect" });
                return;
            }
    
            const { refreshToken, accessToken } = await generateJwt(userData as Payload);
    
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
    
            res.status(200).json({ message: "User logged in", user: userData, accessToken });
        } catch (error) {
            console.error("Error in userLogin:", error);
            res.status(500).json({ message: "An error occurred during login" });
        }
    }
    
}
