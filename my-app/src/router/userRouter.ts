import { Context, Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import { userSchema } from '../zod/user';
import { Jwt } from 'hono/utils/jwt';
import { withAccelerate } from '@prisma/extension-accelerate';
import { env } from 'hono/adapter';

export const userRouter = new Hono();

const JWT_SECRET = "12345678";

userRouter.post('/signup', async (c) => {
    try {
        const body = await c.req.json();
        console.log(body)
        const validationResult = userSchema.safeParse(body);
        if (!validationResult.success) {
            return c.json({ error: validationResult.error.errors }, 400);
        }
        else {
            const { username, email, password } = validationResult.data;

            const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c)
            const prisma = new PrismaClient({
                datasourceUrl: DATABASE_URL,
            }).$extends(withAccelerate())
            
            const newUser = await prisma.user.create({
                data: {
                    username,
                    email,
                    password,
                },
            });
        }
        return c.text('your account has been created');
    }
    catch (err) {
        console.error('Error processing signup request:', err);
        return c.json({ error: 'There was an error completing the request' }, 500);
    }
});
userRouter.post('/signin', async (c) => {
    try {
        const body = await c.req.json();
        const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c)
        const prisma = new PrismaClient({
            datasourceUrl: DATABASE_URL,
        }).$extends(withAccelerate())
        const res = await prisma.user.findUnique({
            where: { email: body.email }
        });
        if (res && res.email) {
            const token = Jwt.sign({ id: body.id }, JWT_SECRET);
            return c.json({ token });
        }
    }
    catch (err) {
        console.log("there was some error logging you in");
        throw err;
    }
});

