'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Bot, HelpCircle, History, PenTool, Code } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/chatbot', label: 'AI Chatbot', icon: Bot },
  { href: '/dashboard/quiz', label: 'Quizzes', icon: HelpCircle },
  { href: '/dashboard/drawing', label: 'Drawing Tool', icon: PenTool },
  { href: '/dashboard/python-explainer', label: 'Python Explainer', icon: Code },
  { href: '/dashboard/history', label: 'History', icon: History },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={{ children: item.label, side: 'right' }}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
