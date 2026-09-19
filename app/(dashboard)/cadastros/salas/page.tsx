"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Monitor, Plus, Wrench, CheckCircle } from "lucide-react";

export default function SalasEquipamentosPage() {
  const supabase = createClient();
  const [salas, setSalas] = useState<any[]>([]);
  const [equipamentos, setEquipamentos] = useState<any[]>([]);
  const [unidades, setUnidades] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [nomeSala, setNomeSala] = useState("");
  const [unidadeId, setUnidadeId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [s, eq, u] = await Promise.all([
      supabase.from("salas").select("*, unidades(nome)"),
      supabase.from("equipamentos").select("*, salas(nome)"),
      supabase.from("unidades").select("id, nome"),
    ]);
    if (s.data) setSalas(s.data);
    if (eq.data) setEquipamentos(eq.data);
    if (u.data) setUnidades(u.data);
  };

  const handleSalvarSala = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("salas").insert({
      nome: nomeSala,
      unidade_id: unidadeId || null,
    });
    if (error) alert(error.message);
    else {
      setModalOpen(false);
      setNomeSala("");
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Salas & Equipamentos</h1>
          <p className="text-sm text-gray-400 mt-1">Controle de laboratórios e manutenção de PCs</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#E50914] hover:bg-[#B80710] text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-[#E50914]/20 flex items-center gap-2 text-sm"
        >
          <Plus size={18} /> Nova Sala
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Salas */}
        <div className="bg-[#12141C] border border-[#212433] rounded-2xl p-5 space-y-4">
          <h2 className="text-base font-bold text-white">Salas Cadastradas</h2>
          <div className="divide-y divide-[#212433]">
            {salas.map((s) => (
              <div key={s.id} className="py-3 flex justify-between items-center text-sm">
                <div>
                  <span className="font-semibold text-white">{s.nome}</span>
                  <p className="text-xs text-gray-400">{s.unidades?.nome || "Sem Unidade"}</p>
                </div>
                <span className="text-xs px-2.5 py-1 bg-[#1A1D27] text-gray-300 rounded-md">
                  Laboratório
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Equipamentos */}
        <div className="bg-[#12141C] border border-[#212433] rounded-2xl p-5 space-y-4">
          <h2 className="text-base font-bold text-white">Status dos Equipamentos</h2>
          <div className="divide-y divide-[#212433]">
            {equipamentos.map((eq) => (
              <div key={eq.id} className="py-3 flex justify-between items-center text-sm">
                <div>
                  <span className="font-semibold text-white">{eq.nome}</span>
                  <p className="text-xs text-gray-400">{eq.salas?.nome || "-"}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 ${
                  eq.status === "ok"
                    ? "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400 font-semibold"
                }`}>
                  {eq.status === "ok" ? <CheckCircle size={14} /> : <Wrench size={14} />}
                  {eq.status === "ok" ? "Operacional" : "Manutenção"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#12141C] border border-[#212433] rounded-2xl w-full max-w-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Nova Sala</h2>
            <form onSubmit={handleSalvarSala} className="space-y-3">
              <div>
                <label className="text-xs text-gray-300 block mb-1">Nome da Sala</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Lab Alpha"
                  value={nomeSala}
                  onChange={(e) => setNomeSala(e.target.value)}
                  className="w-full bg-[#1A1D27] border border-[#2B2F42] rounded-lg p-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">Unidade</label>
                <select
                  value={unidadeId}
                  onChange={(e) => setUnidadeId(e.target.value)}
                  className="w-full bg-[#1A1D27] border border-[#2B2F42] rounded-lg p-2 text-sm text-white"
                >
                  <option value="">Selecione...</option>
                  {unidades.map((u) => <option key={u.id} value={u.id}>{u.nome}</option>)}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-gray-400">
                  Cancelar
                </button>
                <button type="submit" className="bg-[#E50914] hover:bg-[#B80710] text-white px-5 py-2 rounded-xl text-sm font-semibold">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}