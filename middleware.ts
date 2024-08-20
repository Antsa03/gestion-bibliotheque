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
      "/api/change-password",
    ];
    const auth_free_paths: string[] = [
      "/api/auth",
      "/api/send-email",
      "/api/upload",
      "/api/register",
    ];

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
      return NextResponse.next();
    }

    if (token) {
      if (isAdminPath && token.role !== "Administrateur") {
        return NextResponse.rewrite(new URL("/unauthorized", req.url));
      }
      if (isAdherentPath && token.role !== "Adhérent") {
        return NextResponse.rewrite(new URL("/unauthorized", req.url));
      }
    } else {
      if (!isCommonPath) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  } catch (error) {
    console.error("Middleware Error:", error);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/livres/:path*",
    "/emprunts/:path*",
    "/api/:path*",
  ],
};
