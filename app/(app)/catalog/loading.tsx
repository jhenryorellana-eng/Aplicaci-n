export default function CatalogLoading() {
  return (
    <main className="animate-pulse space-y-10 pb-28 pt-8">
      <div className="space-y-3 px-5">
        <div className="h-3 w-24 rounded bg-surface-2" />
        <div className="h-8 w-3/4 rounded bg-surface-2" />
      </div>

      {[0, 1, 2].map((row) => (
        <div key={row} className="space-y-3">
          <div className="mx-5 h-5 w-40 rounded bg-surface-2" />
          <div className="flex gap-3 px-5">
            {[0, 1, 2].map((card) => (
              <div
                key={card}
                className="aspect-[4/5] w-[44vw] shrink-0 rounded-2xl bg-surface-2 sm:w-[200px]"
              />
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}
