import { Request, Response, NextFunction } from "express";
import { authURL } from "../keys";
import axios from "axios";

/**
 * Class that work as interface of comunication with the authentication microservice
 */
export class Authentication {
    async validar(req: Request, res: Response, next: NextFunction) {
        console.log(`[DATE] ${new Date()}`);
        try {
            let head: string = req.headers["x-access-control"] as string;
            let { data } = await axios.post(`${authURL}/validate`, {
                token: head,
            });
            if (!data.validado)
                return res.status(401).json({ message: "Invalid token" });
            req.userId = data.id;
            next();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async encriptar(token: any) {
        try {
            let { data } = await axios.post(`${authURL}/validate`, {
                password: token,
            });
            return data.password;
        } catch (error) {
            throw new Error(
                `Error en conexion connection la BD, error: ${error.response.status}`
            );
        }
    }
}
