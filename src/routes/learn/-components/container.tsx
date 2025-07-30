export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative pt-8 pb-20 mx-auto container animate-fade-in">
      {/* Background decoration */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-theme-50/30 via-transparent to-theme-100/20 dark:from-theme-950/20 dark:via-transparent dark:to-theme-900/10 rounded-3xl pointer-events-none" /> */}

      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 animate-slide-up">{children}</div>
      </div>
    </div>
  );
}
