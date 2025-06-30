export function Title({
  title,
  actions,
}: {
  title: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center gap-4">
      <h1 className="text-2xl font-bold mt-0">{title}</h1>

      {actions}
    </div>
  );
}
