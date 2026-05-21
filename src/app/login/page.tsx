"use client";

import { FormEvent, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";
import { API_URL } from "@/app/lib/api";
const Container = dynamic(() => import("@/components/ui/Container").then((mod) => mod.Container));

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const payload = await response.json();
      if (!response.ok || payload.status === "error") {
        throw new Error(payload.message || "Login failed");
      }
      localStorage.setItem("ensis_user_token", payload.data.accessToken);
      localStorage.setItem("ensis_user", JSON.stringify(payload.data.user));
      router.push("/");
      return;
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-[#fbf8f2] py-12 md:py-16">
      <Container>
        <div className="mx-auto grid max-w-5xl overflow-hidden border border-[#ded3c4] bg-white md:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-[#263016] p-8 text-white md:p-10">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#d9c49d]">Ensis Account</span>
            <h1 className="mt-4 font-serif text-4xl leading-tight">User Login</h1>
            <p className="mt-4 text-sm leading-6 text-white/80">
              Sign in to your Ensis account. Admins should use the dedicated admin console.
            </p>
            <Link href={process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001"} target="_blank" className="mt-8 inline-flex items-center gap-3 text-sm font-bold text-[#d9c49d]">
              Admin Login <ArrowRight size={16} />
            </Link>
          </div>

          <form onSubmit={onSubmit} className="p-8 md:p-10">
            <div className="mb-6 inline-flex size-12 items-center justify-center rounded-full bg-[#f3eee6] text-[#6f542f]">
              <LogIn size={22} />
            </div>
            <label className="block text-xs font-bold uppercase tracking-wide text-[#5f5a50]">
              Email
              <input className="mt-2 w-full border border-[#d8cbb9] px-4 py-3 text-sm font-medium text-[#1f261b] outline-none focus:border-[#8d6a3a]" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label className="mt-5 block text-xs font-bold uppercase tracking-wide text-[#5f5a50]">
              Password
              <input className="mt-2 w-full border border-[#d8cbb9] px-4 py-3 text-sm font-medium text-[#1f261b] outline-none focus:border-[#8d6a3a]" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </label>
            <button className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#6f542f] px-5 py-3 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#4c381f]" type="submit" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
            {message && <p className="mt-4 text-sm font-semibold text-[#334022]">{message}</p>}
          </form>
        </div>
      </Container>
    </section>
  );
}
