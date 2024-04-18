import prisma from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import * as z from "zod";

const inputSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export const authOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {
					type: "text",
					label: "Email",
					placeholder: "Email",
				},
				password: {
					type: "password",
					label: "Password",
					placeholder: "Password",
				},
			},
			// TODO: User credentials type from next-aut
			async authorize(credentials: any) {
				// zod validation, OTP validation here
				const { success } = inputSchema.safeParse(credentials);
				if (!success) {
					return null;
				}
				console.log("1nd");
				console.log(success);

				// User input password hash
				const hashedPassword = await bcrypt.hash(
					credentials.password,
					10
				);

				// Checking user exists or not
				const existingUser = await prisma.user.findUnique({
					where: {
						email: credentials.email,
					},
				});

				// Checking input password and user's password from db
				if (existingUser) {
					const passwordValidation = await bcrypt.compareSync(
						hashedPassword,
						existingUser.password
					);
					// console.log("passwo", passwordValidation);
					if (passwordValidation) {
						return {
							id: existingUser.id.toString(),
							name: existingUser.name,
							email: existingUser.email,
						};
					}
					return {
						id: existingUser.id.toString(),
						name: existingUser.name,
						email: existingUser.email,
					};
				}
				console.log("existinguser: ", existingUser);

				return null;
			},
		}),
	],
	secret: process.env.JWT_SECRET || "secret",
	callbacks: {
		// TODO: can u fix the type here? Using any is bad
		async session({ token, session }: any) {
			session.user.id = token.sub;

			return session;
		},
	},
};

// name,username,password
