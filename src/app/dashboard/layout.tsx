'use client';
import { usePathname, useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger, SidebarHeader } from '@/components/ui/sidebar';
import DashboardNav from '@/components/dashboard-nav';
import Logo from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

const titleMap: { [key: string]: string } = {
  '/dashboard': 'Dashboard',
  '/dashboard/chatbot': 'AI Chatbot',
  '/dashboard/quiz': 'Quizzes',
  '/dashboard/history': 'History',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const title = titleMap[pathname] || 'Dashboard';

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [isUserLoading, user, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
    const { user } = useUser();
    const auth = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast({
                title: "Logged Out",
                description: "You have been successfully logged out.",
            });
            router.push('/login');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: "Logout Failed",
                description: error.message || "An error occurred during logout.",
            });
        }
    };
    
    const getInitials = (name: string | null | undefined) => {
        if (!name) return '??';
        const names = name.split(' ');
        if (names.length > 1) {
            return names[0][0] + names[names.length - 1][0];
        }
        return name.substring(0, 2);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer h-9 w-9">
                    <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/40/40`} data-ai-hint="person face" />
                    <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.displayName || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
