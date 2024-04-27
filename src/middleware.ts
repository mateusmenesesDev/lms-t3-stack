import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { env } from "./env";

const isProtectedRoute = createRouteMatcher(["/(/*)"]);

export default clerkMiddleware(
  (auth, req) => {
    if (isProtectedRoute(req)) auth().protect();
  },
  {
    signInUrl: "/login",
    signUpUrl: "/signup",
    debug: env.NODE_ENV === "development",
  },
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
