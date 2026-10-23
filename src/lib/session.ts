export const COOKIE = "pc_session";
export const MAX_AGE = 60 * 60 * 8; // 8h
const enc = new TextEncoder();

export async function hmac(secret: string, data: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
export const secret = () => process.env.SESSION_SECRET ?? "";
export const authRequired = () => Boolean(process.env.API_BASE_URL || (process.env.PORTAL_USER && process.env.PORTAL_PASSWORD));

export async function createToken(s: string) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  return `${exp}.${await hmac(s, String(exp))}`;
}
export async function verifyToken(token: string | undefined, s: string) {
  if (!token || s.length < 32) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  return safeEqual(sig, await hmac(s, exp));
}
