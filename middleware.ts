import { NextResponse } from "next/server";
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export default withAuth(async function middleware(req: NextRequestWithAuth) {
  try {
    const token = await getToken({ req, secret: process.env.SECRET });
    const admin_path: string[] = [
      "/api/users",
      "/api/auteurs",
      "/api/proprietaires",
      "/api/livres",
      "/api/exemplaires",
      "/api/emprunts",
      "/api/sanctions",
      "/admin",
    ];
    const adherent_path: string[] = ["/livres", "/emprunts", "/api/adherent"];
    const common_paths: string[] = [
      "/api/download-file",
      "/api/read-file",
      "/api/upload",
      "/api/change-password",
    ];
    const auth_free_paths: string[] = ["/api/auth"];

    const { pathname } = req.nextUrl;

    const isAdminPath = admin_path.some((path) => pathname.startsWith(path));
    const isAdherentPath = adherent_path.some((path) =>
      pathname.startsWith(path)
    );
    const isCommonPath = common_paths.some((path) => pathname.startsWith(path));
    const isAuthFreePath = auth_free_paths.some((path) =>
      pathname.startsWith(path)
    );

    if (isAuthFreePath) {
      // Allow access to auth free paths without a session
      return NextResponse.next();
    }

    if (token) {
      // Redirection pour les administrateurs accédant à la racine "/"
      if (pathname === "/" && token.role === "Administrateur") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }

      if (isAdminPath && token.role !== "Administrateur") {
        return NextResponse.rewrite(new URL("/unauthorized", req.url));
      }
      if (isAdherentPath && token.role !== "Adhérent") {
        return NextResponse.rewrite(new URL("/unauthorized", req.url));
      }
    }

    // Protected routes, require authentication
    if (!token && !isCommonPath) {
      return NextResponse.rewrite(new URL("/", req.url)); // Redirect to login
    }
  } catch (error) {
    console.error(error);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/livres/:path*",
    "/emprunts/:path*",
    "/api/:path*",
    "/",
  ],
};
