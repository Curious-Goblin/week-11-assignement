import { Next } from "hono";
import { Jwt } from 'hono/utils/jwt';


export async function userAuthentication(c: any, next: Next) {
    const token = c.req.headers.Authorization;
    const JWT_SECRET = "12345678";
    const decodedToken = await Jwt.verify(token, JWT_SECRET);
    try {
        if (decodedToken) {
            c.set('userId', decodedToken)
            next()
        }
        else {
            c.json({
                msg: "you are not authenticated"
            })
        }
    }
    catch (error) {
        c.status(500).json({
            msg: "not a valid token"
        })
    }
}