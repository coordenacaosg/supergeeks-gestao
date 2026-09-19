"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { BookOpen, Plus, Loader2 } from "lucide-react";

export default function CursosPage() {
  const supabase = createClient();
  const [cursos, setCursos] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    carga_horaria_contratada: 64,
  });

  useEffect(() => {
    loadCursos();
  }, []);

  const loadCursos = async () => {
    const { data } = await supabase.from("cursos").select("*");
    if (data) setCursos(data);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("cursos").insert(formData);
    setLoading(false);
    if (error) alert(error.message);
    else {
      setModalOpen(false);
      loadCursos();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Cursos & Conteúdos</h1>
          <p className="text-sm text-gray-400 mt-1">Grade curricular, Units e Lessons</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#E50914] hover:bg-[#B80710] text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-[#E50914]/20 flex items-center gap-2 text-sm"
        >
          <Plus size={18} /> Novo Curso
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cursos.map((c) => (
          <div key={c.id} className="bg-[#12141C] border border-[#212433] rounded-2xl p-5 space-y-3">
            <BookOpen className="text-[#E50914]" size={24} />
            <h3 className="font-bold text-white text-lg">{c.nome}</h3>
            <p className="text-xs text-gray-400 line-clamp-2">{c.descricao || "Sem descrição informada."}</p>
            <div className="pt-2 border-t border-[#212433] flex justify-between text-xs text-gray-400">
              <span>Carga Contratada:</span>
              <strong className="text-white">{c.carga_horaria_contratada}h</strong>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#12141C] border border-[#212433] rounded-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Cadastrar Curso</h2>
            <form onSubmit={handleSalvar} className="space-y-4">
              <div>
                <label className="text-xs text-gray-300 block mb-1">Nome do Curso</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ciência da Computação 1 (CC1)"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full bg-[#1A1D27] border border-[#2B2F42] rounded-lg p-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full bg-[#1A1D27] border border-[#2B2F42] rounded-lg p-2 text-sm text-white h-20"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">Carga Horária (horas)</label>
                <input
                  type="number"
                  required
                  value={formData.carga_horaria_contratada}
                  onChange={(e) => setFormData({ ...formData, carga_horaria_contratada: parseInt(e.target.value, 10) })}
                  className="w-full bg-[#1A1D27] border border-[#2B2F42] rounded-lg p-2 text-sm text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-gray-400">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="bg-[#E50914] hover:bg-[#B80710] text-white px-5 py-2 rounded-xl text-sm font-semibold">
                  Salvar Curso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}