export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-12 mx-auto container flex flex-col gap-8 pb-16 px-4">
      {children}
    </div>
  );
}
