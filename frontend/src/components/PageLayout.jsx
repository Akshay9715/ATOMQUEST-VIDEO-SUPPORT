export default function PageLayout({
  title,
  children,
}) {
  return (
    <div className="min-h-screen bg-slate-900 text-white">

      <div className="border-b border-slate-700 px-6 py-4">

        <h1 className="text-3xl font-bold">
          {title}
        </h1>

      </div>

      <div className="p-6">
        {children}
      </div>

    </div>
  );
}