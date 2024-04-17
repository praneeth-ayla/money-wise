"use client";
import { signIn, signOut, SessionProvider, useSession } from "next-auth/react"; // Import SessionProvider
import { Appbar } from "@repo/ui/appbar";

export default function Page(): JSX.Element {
	return (
		<SessionProvider>
			{/* Wrap your component with SessionProvider */}
			<PageContent />
		</SessionProvider>
	);
}

function PageContent(): JSX.Element {
	const session = useSession();
	return (
		<div>
			<Appbar
				onSignin={signIn}
				onSignout={signOut}
				user={session.data?.user}
			/>
			<div>{JSON.stringify(session)}</div>
		</div>
	);
}
