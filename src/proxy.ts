import { NextRequest, NextResponse } from "next/server";
import { COOKIE, authRequired, secret, verifyToken } from "@/lib/session";

// Substitui o src/proxy.ts anterior (HTTP Basic). Modo demo (sem API_BASE_URL) segue aberto.
export async function proxy(req: NextRequest) {
  if (!authRequired()) {
    return req.nextUrl.pathname === "/login" ? NextResponse.redirect(new URL("/", req.url)) : NextResponse.next();
  }
  const { pathname } = req.nextUrl;
  const ok = await verifyToken(req.cookies.get(COOKIE)?.value, secret());

  if (pathname === "/login") return ok ? NextResponse.redirect(new URL("/", req.url)) : NextResponse.next();
  if (pathname === "/api/login" || pathname === "/api/logout") return NextResponse.next();
  if (ok) return NextResponse.next();

  if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const url = new URL("/login", req.url);
  if (pathname !== "/") url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|svg|ico|webp)$).*)"],
};
