'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Filter, FolderKanban, GraduationCap, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/auth';

const menuItems = [
  { name: 'Дашборд', href: '/', icon: LayoutDashboard },
  { name: 'Клиенты', href: '/clients', icon: Users },
  { name: 'Воронка', href: '/funnel', icon: Filter },
  { name: 'Проекты', href: '/projects', icon: FolderKanban },
  { name: 'Обучение', href: '/lms', icon: GraduationCap },
];

export default function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="w-64 border-r border-neutral-800 bg-neutral-950 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h2 className="text-xl font-semibold tracking-tight text-white">RushdDigital</h2>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-neutral-800 text-white' 
                  : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900'
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-neutral-400 hover:text-red-400 hover:bg-neutral-900 transition-colors"
        >
          <LogOut size={18} />
          Выйти
        </button>
      </div>
    </aside>
  );
}