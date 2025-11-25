import React from 'react';
import { Home, Package, TrendingUp, Palette, Users } from 'lucide-react';

interface NavigationProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
}

const navItems = [
  { id: '工作台', label: '工作台', icon: Home },
  { id: '资产', label: '资产', icon: Package },
  { id: '营销', label: '营销', icon: TrendingUp },
  { id: '创意', label: '创意', icon: Palette },
  { id: '合作', label: '合作', icon: Users },
];

export function Navigation({ activeNav, onNavChange }: NavigationProps) {
  return (
    <div className="w-16 bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-4">
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-8">
        <span className="text-zinc-900">T</span>
      </div>
      
      <div className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavChange(item.id)}
              className={`w-12 h-12 flex items-center justify-center rounded-lg transition-colors ${
                isActive
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
              }`}
              title={item.label}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
