import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

// This tells the middleware to only run on the portal/apply pages
export const config = { 
  matcher: ["/dashboard/:path*", "/apply/:path*"] 
};