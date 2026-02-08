import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { LandingContent } from "./landing-content";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/home");
  }

  return <LandingContent />;
}
