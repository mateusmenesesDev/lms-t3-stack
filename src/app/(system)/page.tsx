import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";

export default async function Home() {
  const userClerk = auth();

  if (!userClerk.userId) {
    return null;
  }

  const user = await db.user.findUnique({
    where: {
      id: userClerk.userId,
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      Clerk: {userClerk.userId} <br />
      DB: {user?.id}
    </main>
  );
}
