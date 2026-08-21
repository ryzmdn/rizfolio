import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { users, sessions } from "../schema/users"

export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
})
export const selectUserSchema = createSelectSchema(users)

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const insertSessionSchema = createInsertSchema(sessions)
export const selectSessionSchema = createSelectSchema(sessions)
