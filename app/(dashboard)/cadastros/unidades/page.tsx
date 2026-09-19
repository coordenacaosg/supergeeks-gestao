"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Building2, Plus, Phone, MapPin } from "lucide-react";

export default function UnidadesPage() {
  const supabase = createClient();
  const [unidades, setUnidades] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    rua: "",
    numero: "",
    cep: "",
    cidade: "",
    estado: "SP",
    telefone: "",
  });

  useEffect(() => {
    loadUnidades();
  }, []);

  const loadUnidades = async () => {
    const { data } = await supabase.from("unidades").select("*");
    if (data) setUnidades(data);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("unidades").insert(formData);
    if (error) alert(error.message);
    else {
      setModalOpen(false);
      loadUnidades();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Unidades SuperGeeks</h1>
          <p className="text-sm text-gray-400 mt-1">Gestão de filiais e endereços</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#E50914] hover:bg-[#B80710] text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-[#E50914]/20 flex items-center gap-2 text-sm"
        >
          <Plus size={18} /> Nova Unidade
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {unidades.map((u) => (
          <div key={u.id} className="bg-[#12141C] border border-[#212433] rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="text-[#E50914]" size={20} />
              <h3 className="font-bold text-white text-base">{u.nome}</h3>
            </div>
            <div className="space-y-1.5 text-xs text-gray-400">
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-gray-500" />
                {u.rua}, {u.numero} - {u.cidade}/{u.estado}
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-gray-500" />
                {u.telefone}
              </p>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#12141C] border border-[#212433] rounded-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Nova Unidade</h2>
            <form onSubmit={handleSalvar} className="space-y-3">
              <div>
                <label className="text-xs text-gray-300 block mb-1">Nome da Unidade</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Unidade Vila Mariana"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full bg-[#1A1D27] border border-[#2B2F42] rounded-lg p-2 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-xs text-gray-300 block mb-1">Rua</label>
                  <input
                    type="text"
                    required
                    value={formData.rua}
                    onChange={(e) => setFormData({ ...formData, rua: e.target.value })}
                    className="w-full bg-[#1A1D27] border border-[#2B2F42] rounded-lg p-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Número</label>
                  <input
                    type="text"
                    required
                    value={formData.numero}
                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                    className="w-full bg-[#1A1D27] border border-[#2B2F42] rounded-lg p-2 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Cidade</label>
                  <input
                    type="text"
                    required
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    className="w-full bg-[#1A1D27] border border-[#2B2F42] rounded-lg p-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Telefone</label>
                  <input
                    type="text"
                    required
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="w-full bg-[#1A1D27] border border-[#2B2F42] rounded-lg p-2 text-sm text-white"
                  />
                </div>
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