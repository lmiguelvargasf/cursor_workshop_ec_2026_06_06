export function Notice({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <div className="border-b border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
      <div className="mx-auto max-w-6xl">{message}</div>
    </div>
  );
}
