import { BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)} aria-label="EduAI Home">
      <BrainCircuit className="h-8 w-8 text-primary" />
      <span className="text-2xl font-bold font-headline text-foreground">EduAI</span>
    </Link>
  );
}
