import { z } from "zod";

const postSchema = z.object({
    title: z.string(),
    body: z.string()
})

export { postSchema }