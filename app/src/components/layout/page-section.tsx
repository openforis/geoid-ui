import { cn } from '@/lib/utils';

export function CenteredShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-1 items-center justify-center w-full', className)}>
      {children}
    </div>
  );
}
