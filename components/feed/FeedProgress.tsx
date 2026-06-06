/** Segmentos de progreso del feed (posición actual entre los clips). */
export function FeedProgress({
  count,
  activeIndex,
}: {
  count: number;
  activeIndex: number;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-20 flex gap-1 px-3"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.5rem)" }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`h-[3px] flex-1 rounded-full transition-colors ${
            i === activeIndex ? "bg-gold" : "bg-white/25"
          }`}
        />
      ))}
    </div>
  );
}
