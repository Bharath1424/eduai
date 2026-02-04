'use client';
import { usePathname } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger, SidebarHeader } from '@/components/ui/sidebar';
import DashboardNav from '@/components/dashboard-nav';
import Logo from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';

const titleMap: { [key: string]: string } = {
  '/dashboard': 'Dashboard',
  '/dashboard/chatbot': 'AI Chatbot',
  '/dashboard/quiz': 'Quizzes',
  '/dashboard/history': 'History',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = titleMap[pathname] || 'Dashboard';

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <div className="flex h-full flex-col">
          <SidebarHeader>
            <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
              <div className="group-data-[collapsible=icon]:hidden">
                <Logo />
              </div>
              <div className="hidden group-data-[collapsible=icon]:block">
                 <Link href="/dashboard" className="flex items-center justify-center p-2" aria-label="EduAI Home">
                    <BrainCircuit className="h-8 w-8 text-primary" />
                 </Link>
              </div>
            </div>
          </SidebarHeader>
          <DashboardNav />
        </div>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
          <div className="flex items-center gap-4">
             <SidebarTrigger className="md:hidden" />
             <h1 className="text-xl font-semibold">{title}</h1>
          </div>
          <UserMenu />
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function UserMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer h-9 w-9">
                    <AvatarImage src="https://picsum.photos/seed/user-avatar/40/40" data-ai-hint="person face" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">John Doe</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            john.doe@example.com
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/">Logout</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
