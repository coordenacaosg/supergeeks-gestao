"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserX, BookX, MessageSquareWarning, Cake, CalendarClock, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    faltasCount: 0,
    semLicaoCount: 0,
    coordenadorCount: 0,
    aniversariantes: [] as any[],
    contratosVencendo: [] as any[],
  });

  const supabase = createClient();

  useEffect(() => {
    async function loadMetrics() {
      setLoading(true);

      const { count: faltas } = await supabase
        .from("frequencias_diario")
        .select("*", { count: "exact", head: true })
        .eq("status", "Falta");

      const { count: semLicao } = await supabase
        .from("frequencias_diario")
        .select("*", { count: "exact", head: true })
        .eq("diversao_casa_entregue", false);

      const { count: coordAvisos } = await supabase
        .from("frequencias_diario")
        .select("*", { count: "exact", head: true })
        .eq("conversar_coordenador", true);

      const currentMonth = new Date().getMonth() + 1;
      const { data: todosAlunos } = await supabase
        .from("alunos")
        .select("id, nome, data_nascimento, inicio_contrato, turmas(nome)")
        .eq("status", "ativo");

      const nivers = (todosAlunos || []).filter((a) => {
        if (!a.data_nascimento) return false;
        const m = parseInt(a.data_nascimento.split("-")[1], 10);
        return m === currentMonth;
      });

      const now = new Date();
      const in60Days = new Date();
      in60Days.setDate(now.getDate() + 60);

      const contratos = (todosAlunos || []).filter((a) => {
        if (!a.inicio_contrato) return false;
        const ini = new Date(a.inicio_contrato);
        const fim = new Date(ini);
        fim.setFullYear(fim.getFullYear() + 1);
        return fim >= now && fim <= in60Days;
      });

      setStats({
        faltasCount: faltas || 0,
        semLicaoCount: semLicao || 0,
        coordenadorCount: coordAvisos || 0,
        aniversariantes: nivers,
        contratosVencendo: contratos,
      });

      setLoading(false);
    }

    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#E50914]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">Painel Pedagógico</h1>
        <p className="text-sm text-gray-400 mt-1">Métricas de rendimento e alertas em tempo real</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#12141C] border border-[#212433] rounded-2xl p-5 flex items-center justify-between border-l-4 border-l-[#E50914]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total de Faltas</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">{stats.faltasCount}</h3>
          </div>
          <div className="p-3 bg-[#E50914]/10 text-[#E50914] rounded-xl">
            <UserX size={26} />
          </div>
        </div>

        <div className="bg-[#12141C] border border-[#212433] rounded-2xl p-5 flex items-center justify-between border-l-4 border-l-orange-500">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Diversão Pendente</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">{stats.semLicaoCount}</h3>
          </div>
          <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl">
            <BookX size={26} />
          </div>
        </div>

        <div className="bg-[#12141C] border border-[#212433] rounded-2xl p-5 flex items-center justify-between border-l-4 border-l-yellow-500">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Alertas Coordenação</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">{stats.coordenadorCount}</h3>
          </div>
          <div className="p-3 bg-yellow-500/10 text-yellow-400 rounded-xl">
            <MessageSquareWarning size={26} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#12141C] border border-[#212433] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Cake className="text-[#E50914]" size={20} />
            <h2 className="text-base font-bold text-white">Aniversariantes do Mês</h2>
          </div>
          {stats.aniversariantes.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">Nenhum aniversariante neste mês.</p>
          ) : (
            <div className="divide-y divide-[#212433]">
              {stats.aniversariantes.map((aluno) => (
                <div key={aluno.id} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium text-white">{aluno.nome}</span>
                    <p className="text-xs text-gray-400">{aluno.turmas?.nome || "Sem Turma"}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-[#1A1D27] text-gray-300 rounded-md">
                    Dia {aluno.data_nascimento?.split("-")[2]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#12141C] border border-[#212433] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarClock className="text-orange-400" size={20} />
            <h2 className="text-base font-bold text-white">Contratos a Vencer (60 dias)</h2>
          </div>
          {stats.contratosVencendo.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">Nenhum contrato vencendo nos próximos 60 dias.</p>
          ) : (
            <div className="divide-y divide-[#212433]">
              {stats.contratosVencendo.map((aluno) => (
                <div key={aluno.id} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium text-white">{aluno.nome}</span>
                    <p className="text-xs text-gray-400">{aluno.turmas?.nome || "Sem Turma"}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-md">
                    Vencimento Anual
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}