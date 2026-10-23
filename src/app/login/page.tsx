"use client";
import { FormEvent, useState } from "react";
import s from "./login.module.css";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Não foi possível entrar.");
      const next = new URLSearchParams(window.location.search).get("next");
      window.location.assign(next && next.startsWith("/") && !next.startsWith("//") ? next : "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha de rede. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <main className={s.page}>
      <div className={s.wrap}>
        <div className={s.brand} aria-label="3CORP Finance Operations">
          <span className={s.mark} aria-hidden="true">3</span>
          <span><strong>3CORP</strong><small>Finance Operations</small></span>
        </div>

        <form className={s.card} onSubmit={onSubmit} noValidate aria-labelledby="t">
          <h1 id="t">Acesse o portal</h1>
          <p className={s.sub}>Boletos, faturas e envios ao Financeiro em um só lugar.</p>

          <div className={s.field}>
            <input id="user" name="user" autoComplete="username" placeholder=" " value={user}
              onChange={(e) => setUser(e.target.value)} required autoFocus
              aria-invalid={!!error} aria-describedby={error ? "err" : undefined} />
            <label htmlFor="user">Usuário</label>
          </div>

          <div className={s.field}>
            <input id="password" name="password" type={show ? "text" : "password"} autoComplete="current-password"
              placeholder=" " value={password} onChange={(e) => setPassword(e.target.value)} required
              aria-invalid={!!error} aria-describedby={error ? "err" : undefined} />
            <label htmlFor="password">Senha</label>
            <button type="button" className={s.eye} onClick={() => setShow((v) => !v)} aria-pressed={show}>
              {show ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          <p id="err" role="alert" className={s.error} hidden={!error}>{error}</p>

          <button className={s.submit} type="submit" disabled={loading || !user || !password}>
            {loading ? "Entrando…" : "Entrar"}
          </button>
          <p className={s.help}>Sem acesso ou esqueceu a senha? Fale com o administrador do portal.</p>
        </form>
      </div>
    </main>
  );
}
