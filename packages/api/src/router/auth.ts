import { z } from "zod";

import { prisma } from "@acme/db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
	getSession: publicProcedure.query(({ ctx }) => {
		return ctx.session;
	}),
	getSecretMessage: protectedProcedure.query(() => {
		// testing type validation of overridden next-auth Session in @acme/auth package
		return "you can see this secret message!";
	}),

	signUp: publicProcedure
		.input(
			z.object({
				email: z.string().email(),
				password: z.string().min(5).max(20).regex(/\*|_/),
			}),
		)
		.mutation(({ input }) => {
			return prisma.user.create({
				data: {
					email: input.email,
				},
			});
		}),
});
