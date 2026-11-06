import { cn } from '@/lib/utils';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  strong?: boolean;
}

export function GlassPanel({ strong, className, ...props }: GlassPanelProps) {
  return (
    <div
      className={cn(strong ? 'glass-strong' : 'glass', 'rounded-2xl', className)}
      {...props}
    />
  );
}
