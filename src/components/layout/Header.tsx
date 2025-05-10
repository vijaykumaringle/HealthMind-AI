import { BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="py-6 px-4 md:px-8 border-b border-border/50 shadow-sm">
      <div className="container mx-auto flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:opacity-90 transition-opacity">
          <BrainCircuit className="h-8 w-8" />
          <span>HealthMind AI</span>
        </Link>
      </div>
    </header>
  );
}
