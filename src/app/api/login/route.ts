import { NextRequest, NextResponse } from "next/server";
import { COOKIE, MAX_AGE, createToken, hmac, safeEqual, secret } from "@/lib/session";

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.nextUrl.host) return fail("Origem inválida.", 403);

  const { PORTAL_USER, PORTAL_PASSWORD } = process.env;
  const s = secret();
  if (!PORTAL_USER || !PORTAL_PASSWORD || s.length < 32)
    return fail("Acesso não configurado. Defina PORTAL_USER, PORTAL_PASSWORD e SESSION_SECRET (32+ caracteres).", 503);

  let body: { user?: string; password?: string };
  try { body = await req.json(); } catch { return fail("Requisição inválida.", 400); }
  const user = String(body.user ?? "").trim();
  const pass = String(body.password ?? "");
  if (!user || !pass) return fail("Informe usuário e senha.", 400);

  const [a, b, c, d] = await Promise.all([hmac(s, user), hmac(s, PORTAL_USER), hmac(s, pass), hmac(s, PORTAL_PASSWORD)]);
  const ok = safeEqual(a, b) && safeEqual(c, d);
  if (!ok) {
    await new Promise((r) => setTimeout(r, 600)); // freia tentativa em massa (rate limit real: no seu edge/API)
    return fail("Usuário ou senha incorretos.", 401);
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, await createToken(s), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: MAX_AGE,
  });
  return res;
}
