import { Hono } from "hono";
import { userAuthentication } from "../middleware/user";
import { PrismaClient } from "@prisma/client";
import { Context } from "hono";
import { postSchema } from "../zod/post";

export const postRouter = new Hono();
const prisma = new PrismaClient();

postRouter.get('/', userAuthentication, async (c: Context) => {
    try {
        const userId = c.get('userId')
        const res = await prisma.posts.findMany({
            where: {
                userId: userId
            },
            include: { tags: true, User: true }
        })
        return c.json({ res })
    }
    catch (err) {
        console.log("there was some error fetching your posts");
        throw err;
    }
})

postRouter.post('/', userAuthentication, async (c: Context) => {
    try {
        const userId = c.get('userId')
        const body = await c.req.json();
        const validation = postSchema.safeParse(body)
        if (!validation.success) {
            console.log("your input format for your post is wrong")
        }
        else {
            const newpost = await prisma.posts.create({
                data: {
                    title: body.title,
                    body: body.body,
                    userId: userId
                }
            })
            return c.json({ newpost })
        }
    }
    catch (err) {
        console.log("there was some error in creating the posts")
        throw err;
    }
})

postRouter.get('/:id', userAuthentication, async (c: Context) => {
    try {
        const postId = parseInt(c.req.param('id'))
        const res = await prisma.posts.findUnique({
            where: { id: postId },
            include: { tags: true }
        })
        return c.json({ res });
    }
    catch (err) {
        console.log("there was some error fetching your posts")
        throw err;
    }
})

postRouter.post('/:id', userAuthentication, async (c: Context) => {
    try {
        const postId = parseInt(c.req.param('id'))
        const body = await c.req.json();
        const updatedPost = await prisma.posts.update({
            where: {
                id: postId
            },
            data: {
                title: body.title,
                body: body.body
            }
        })
        return c.json({ updatedPost })
    }
    catch (err) {
        console.log("there was some error updating your posts")
        throw err;
    }
})

postRouter.delete('/:id', userAuthentication, async (c: Context) => {
    try {
        const postId = parseInt(c.req.param('id'))
        const res = await prisma.posts.delete({
            where: {
                id: postId
            }
        })
        return c.json({
            res,
            msg: "post was deleted"
        })
    }
    catch (err) {
        console.log('there was some error deleting your post')
        throw err;
    }
})

