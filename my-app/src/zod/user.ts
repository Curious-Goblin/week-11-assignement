import { z } from "zod";

const userSchema = z.object({
    email: z.string().email(),
    username: z.string(),
    password: z.string().min(8)
})

export { userSchema }