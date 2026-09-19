"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Calendar, Loader2 } from "lucide-react";

export default function TurmasPage() {
  const supabase = createClient();
  const [turmas, setTurmas] = useState<any[]>([]);
  const [unidades, setUnidades] = useState<any[]>([]);
  const [cursos, setCursos] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    dia_semana: 7, // Sábado
    horario_inicio: "09:00",
    horario_termino: "10:30",
    modalidade: "Presencial",
    formato: "Tradicional",
    limite_alunos: 12,
    unidade_id: "",
    curso_id: "",
    status: "ativo"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [t, u, c] = await Promise.all([
      supabase.from("turmas").select("*, unidades(nome), cursos(nome)"),
      supabase.from("unidades").select("id, nome"),
      supabase.from("cursos").select("id, nome")
    ]);
    if (t.data) setTurmas(t.data);
    if (u.data) setUnidades(u.data);
    if (c.data) setCursos(c.data);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("turmas").insert({
      ...formData,
      unidade_id: formData.unidade_id || null,
      curso_id: formData.curso_id || null
    });
    setLoading(false);
    if (error) alert("Erro: " + error.message);
    else {
      setModalOpen(false);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Turmas</h1>
          <p className="text-sm text-gray-400 mt-1">Horários, modalidades e limites de alunos</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#E50914] hover:bg-[#B80710] text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-[#E50914]/20 flex items-center gap-2 text-sm"
        >
          <Plus size={18} /> Nova Turma
        </button>
      </div>

      <div className="bg-[#12141C] border border-[#212433] rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-[#181B26] text-xs uppercase font-semibold text-gray-400 border-b border-[#212433]">
            <tr>
              <th className="p-4">Nome da Turma</th>
              <th className="p-4">Horário</th>
              <th className="p-4">Modalidade / Formato</th>
              <th className="p-4">Curso</th>
              <th className="p-4">Unidade</th>
              <th className="p-4">Capacidade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#212433]">
            {turmas.map((t) => (
              <tr key={t.id} className="hover:bg-[#1A1D27]">
                <td className="p-4 font-medium text-white">{t.nome}</td>
                <td className="p-4 text-gray-400">{t.horario_inicio} - {t.horario_termino}</td>
                <td className="p-4 text-gray-400">{t.modalidade} ({t.formato})</td>
                <td className="p-4 text-gray-400">{t.cursos?.nome || "-"}</td>
                <td className="p-4 text-gray-400">{t.unidades?.nome || "-"}</td>
                <td className="p-4 text-gray-400">{t.limite_alunos} alunos</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#12141C] border border-[#212433] rounded-2xl w-full max-w-lg p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Cadastrar Turma</h2>
            <form onSubmit={handleSalvar} className="space-y-4">
              <div>
                <label className="text-xs text-gray-300 block mb-1">Nome da Turma</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sáb 09h - SuperKids 1"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full bg-[#1A1D27] border border-[#2B2F42] rounded-lg p-2 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Início</label>
                  <input
                    type="time"
                    required
                    value={formData.horario_inicio}
                    onChange={(e) => setFormData({ ...formData, horario_inicio: e.target.value })}
                    className="w-full bg-[#1A1D27] border border-[#2B2F42] rounded-lg p-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Término</label>
                  <input
                    type="time"
                    required
                    value={formData.horario_termino}
                    onChange={(e) => setFormData({ ...formData, horario_termino: e.target.value })}
                    className="w-full bg-[#1A1D27] border border-[#2B2F42] rounded-lg p-2 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Modalidade</label>
                  <select
                    value={formData.modalidade}
                    onChange={(e) => setFormData({ ...formData, modalidade: e.target.value })}
                    className="w-full bg-[#1A1D27] border border-[#2B2F42] rounded-lg p-2 text-sm text-white"
                  >
                    <option value="Presencial">Presencial</option>
                    <option value="Live">Live</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Formato</label>
                  <select
                    value={formData.formato}
                    onChange={(e) => setFormData({ ...formData, formato: e.target.value })}
                    className="w-full bg-[#1A1D27] border border-[#2B2F42] rounded-lg p-2 text-sm text-white"
                  >
                    <option value="Tradicional">Tradicional</option>
                    <option value="FLEX">FLEX</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Curso</label>
                  <select
                    value={formData.curso_id}
                    onChange={(e) => setFormData({ ...formData, curso_id: e.target.value })}
                    className="w-full bg-[#1A1D27] border border-[#2B2F42] rounded-lg p-2 text-sm text-white"
                  >
                    <option value="">Selecione...</option>
                    {cursos.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Unidade</label>
                  <select
                    value={formData.unidade_id}
                    onChange={(e) => setFormData({ ...formData, unidade_id: e.target.value })}
                    className="w-full bg-[#1A1D27] border border-[#2B2F42] rounded-lg p-2 text-sm text-white"
                  >
                    <option value="">Selecione...</option>
                    {unidades.map((u) => <option key={u.id} value={u.id}>{u.nome}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#E50914] hover:bg-[#B80710] text-white px-5 py-2 rounded-xl text-sm font-semibold"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : "Salvar Turma"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}