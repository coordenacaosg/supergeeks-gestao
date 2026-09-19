"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function ResetSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    setLoading(false);
    if (error) {
      setErrorMsg("Não foi possível enviar o link. Verifique o e-mail digitado.");
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0E] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#12141C] border border-[#212433] rounded-2xl p-8 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#E50914]" />

        <Link href="/login" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white mb-6">
          <ArrowLeft size={16} /> Voltar para login
        </Link>

        <h2 className="text-xl font-bold text-white mb-2">Recuperar Acesso</h2>
        <p className="text-xs text-gray-400 mb-6 leading-relaxed">
          Informe seu e-mail institucional para receber um link de redefinição de senha.
        </p>

        {sent ? (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex flex-col items-center text-center">
            <CheckCircle2 size={36} className="text-green-400 mb-2" />
            <span className="text-sm font-semibold text-green-300">E-mail Enviado!</span>
            <p className="text-xs text-gray-400 mt-1">Verifique sua caixa de entrada para prosseguir.</p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-xs text-red-400">
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                Seu E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.nome@supergeeks.com.br"
                  className="w-full bg-[#1A1D27] border border-[#2B2F42] rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E50914] hover:bg-[#B80710] text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-[#E50914]/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : "Enviar Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}