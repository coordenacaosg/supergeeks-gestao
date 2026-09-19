"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg("Credenciais inválidas ou usuário não cadastrado.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0E] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#12141C] border border-[#212433] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#E50914]" />

        <div className="flex flex-col items-center mb-8">
          <Image
            src="https://s3.amazonaws.com/cdn.freshdesk.com/data/helpdesk/attachments/production/27000106946/logo/ICqmNTvVq_G-HnhI7BCIdktR0tfctXvCtw.png"
            alt="SuperGeeks Logo"
            width={180}
            height={50}
            priority
            className="object-contain mb-3"
          />
          <h2 className="text-xl font-bold text-white tracking-wide">Gestão Pedagógica</h2>
          <p className="text-xs text-gray-400 mt-1">Acesso exclusivo da equipe escolar</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-sm text-red-400">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
              E-mail Institucional
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 text-gray-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.nome@supergeeks.com.br"
                className="w-full bg-[#1A1D27] border border-[#2B2F42] rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914] transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Senha de Acesso
              </label>
              <Link
                href="/reset-senha"
                className="text-xs text-gray-400 hover:text-[#E50914] transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-gray-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1A1D27] border border-[#2B2F42] rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E50914] hover:bg-[#B80710] text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-[#E50914]/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Entrar no Sistema"}
          </button>
        </form>
      </div>
    </div>
  );
}