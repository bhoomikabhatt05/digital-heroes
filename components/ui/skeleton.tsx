export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800 ${className}`} />;
}
export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-16 px-6 text-center dark:border-zinc-800">
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="mt-1 text-sm text-zinc-500 max-w-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
