import prisma from "@repo/db/client";
import { NextResponse } from "next/server";
import * as z from "zod";
import bcyrpt from "bcryptjs";

const signupSchema = z.object({
	email: z.string(),
	password: z.string(),
	name: z.string(),
});

export async function POST(req: Request) {
	const body = await req.json();

	// Input validation
	const success = signupSchema.safeParse(body);

	console.log(success);
	// if (!success) {
	// 	return NextResponse.json(
	// 		{ message: "Invalid inputs" },
	// 		{ status: 400 }
	// 	);
	// }

	// Hashing the user password with bcyrptjs
	const hashedPassword = await bcyrpt.hash(body.password, 10);

	// Creating user account
	try {
		const userExists = await prisma.user.findFirst({
			where: {
				email: body.email,
			},
		});

		// Checking whether the email is taken or not
		if (userExists) {
			return NextResponse.json({
				message: "Email already taken / Invalid email",
			});
		}

		// Creating
		const user = await prisma.user.create({
			data: {
				...body,
				password: hashedPassword,
			},
		});

		const { password, ...res } = user;

		return NextResponse.json({
			message: "User created Successfully",
			res,
		});
	} catch (error) {
		return NextResponse.json({
			message: "Internal Server Error",
		});
	}
}
