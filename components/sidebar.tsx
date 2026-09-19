"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Users, BookOpen, CalendarCheck2, Award, 
  BarChart3, Layers, LogOut, Monitor, Building2, Calendar 
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const menuItems = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Gestão de Aula", href: "/gestao-aula", icon: CalendarCheck2 },
  { name: "Projetos TCC", href: "/tcc", icon: Award },
  {
    name: "Cadastros",
    icon: Layers,
    subItems: [
      { name: "Alunos", href: "/cadastros/alunos", icon: Users },
      { name: "Turmas", href: "/cadastros/turmas", icon: Calendar },
      { name: "Cursos & Aulas", href: "/cadastros/cursos", icon: BookOpen },
      { name: "Unidades", href: "/cadastros/unidades", icon: Building2 },
      { name: "Salas & Equipamentos", href: "/cadastros/salas", icon: Monitor },
    ]
  },
  { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-[#12141C] border-r border-[#212433] h-screen flex flex-col justify-between p-4 select-none">
      <div>
        <div className="flex items-center justify-center p-3 border-b border-[#212433] mb-6">
          <Image 
            src="https://s3.amazonaws.com/cdn.freshdesk.com/data/helpdesk/attachments/production/27000106946/logo/ICqmNTvVq_G-HnhI7BCIdktR0tfctXvCtw.png" 
            alt="SuperGeeks Logo" 
            width={160} 
            height={44} 
            priority
            className="object-contain"
          />
        </div>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            if (item.subItems) {
              return (
                <div key={item.name} className="pt-2">
                  <span className="text-xs uppercase font-semibold text-gray-400 px-3 tracking-wider">
                    {item.name}
                  </span>
                  <div className="mt-1 space-y-1">
                    {item.subItems.map((sub) => {
                      const active = pathname === sub.href;
                      const Icon = sub.icon;
                      return (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                            active 
                              ? "bg-[#E50914] text-white shadow-lg shadow-[#E50914]/20" 
                              : "text-gray-400 hover:text-white hover:bg-[#1A1D27]"
                          }`}
                        >
                          <Icon size={18} />
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active 
                    ? "bg-[#E50914] text-white shadow-lg shadow-[#E50914]/20" 
                    : "text-gray-400 hover:text-white hover:bg-[#1A1D27]"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-[#E50914] hover:bg-[#E50914]/10 transition-colors w-full border border-[#212433]"
      >
        <LogOut size={18} />
        Sair do Sistema
      </button>
    </aside>
  );
}