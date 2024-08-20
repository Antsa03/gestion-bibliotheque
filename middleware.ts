import { NextResponse } from "next/server";
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export default withAuth(async function middleware(req: NextRequestWithAuth) {
  try {
    const { pathname } = req.nextUrl;
    const admin_path: string[] = [
      "/api/users",
      "/api/auteurs",
      "/api/proprietaires",
      "/api/livres",
      "/api/exemplaires",
      "/api/emprunts",
      "/api/sanctions",
      "/api/dashboard",
      "/admin",
    ];
    const adherent_path: string[] = ["/livres", "/emprunts", "/api/adherent"];
    const common_paths: string[] = [
      "/api/download-file",
      "/api/read-file",
      "/api/change-password",
      "/api/account-update",
    ];

    const isAdminPath = admin_path.some((path) => pathname.startsWith(path));
    const isAdherentPath = adherent_path.some((path) =>
      pathname.startsWith(path)
    );
    const isCommonPath = common_paths.some((path) => pathname.startsWith(path));

    // Then check for token
    const token = await getToken({ req, secret: process.env.SECRET });

    if (!token) {
      if (!isCommonPath) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } else {
      if (isAdminPath && token.role !== "Administrateur") {
        console.log("Unauthorized access - Admin path");
        return NextResponse.rewrite(new URL("/unauthorized", req.url));
      }
      if (isAdherentPath && token.role !== "Adhérent") {
        console.log("Unauthorized access - Adherent path");
        return NextResponse.rewrite(new URL("/unauthorized", req.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware Error:", error);
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/livres/:path*",
    "/emprunts/:path*",
    "/api/users",
    "/api/auteurs",
    "/api/proprietaires",
    "/api/livres",
    "/api/exemplaires",
    "/api/emprunts",
    "/api/sanctions",
    "/api/dashboard",
    "/api/adherent/:path*",
    "/api/download-file/:path*",
    "/api/read-file/:path*",
    "/api/change-password/:path*",
    "/api/account-update/:path*",
  ],
};
