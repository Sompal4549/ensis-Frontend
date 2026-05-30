"use client";

import { FormEvent, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, UserPlus } from "lucide-react";
import { API_URL } from "@/app/lib/api";
const Container = dynamic(() => import("@/components/ui/Container").then((mod) => mod.Container));

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, phone, password }),
      });
      const payload = await response.json();
      if (!response.ok || payload.status === "error") {
        throw new Error(payload.message || "Registration failed");
      }
      
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
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
            <h2 className="mt-4 text-4xl leading-tight">Create Account</h2>
            <p className="mt-4 text-sm leading-6 text-white/80">
              Register for an Ensis account to securely save your wishlist, place orders, and track your purchase history.
            </p>
            <div className="mt-8 flex flex-col gap-4">
              <Link href="/login" className="inline-flex items-center gap-3 text-sm font-bold text-[#d9c49d]">
                Already have an account? Login <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <form onSubmit={onSubmit} className="p-8 md:p-10">
            <div className="mb-6 inline-flex size-12 items-center justify-center rounded-full bg-[#f3eee6] text-[#6f542f]">
              <UserPlus size={22} />
            </div>
            
            <label className="block text-xs font-bold uppercase tracking-wide text-[#5f5a50]">
              Full Name
              <input className="mt-2 w-full border border-[#d8cbb9] px-4 py-3 text-sm font-medium text-[#1f261b] outline-none focus:border-[#8d6a3a]" type="text" value={name} onChange={(event) => setName(event.target.value)} required />
            </label>
            
            <label className="mt-5 block text-xs font-bold uppercase tracking-wide text-[#5f5a50]">
              Email
              <input className="mt-2 w-full border border-[#d8cbb9] px-4 py-3 text-sm font-medium text-[#1f261b] outline-none focus:border-[#8d6a3a]" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            
            <label className="mt-5 block text-xs font-bold uppercase tracking-wide text-[#5f5a50]">
              Phone Number (Optional)
              <input className="mt-2 w-full border border-[#d8cbb9] px-4 py-3 text-sm font-medium text-[#1f261b] outline-none focus:border-[#8d6a3a]" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
            </label>
            
            <label className="mt-5 block text-xs font-bold uppercase tracking-wide text-[#5f5a50]">
              Password
              <input className="mt-2 w-full border border-[#d8cbb9] px-4 py-3 text-sm font-medium text-[#1f261b] outline-none focus:border-[#8d6a3a]" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} />
            </label>
            
            <button className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#6f542f] px-5 py-3 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#4c381f]" type="submit" disabled={isLoading}>
              {isLoading ? "Registering..." : "Create Account"}
            </button>
            {message && <p className="mt-4 text-sm font-semibold text-[#334022]">{message}</p>}
          </form>
        </div>
      </Container>
    </section>
  );
}
