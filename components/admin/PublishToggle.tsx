type Props = {
  action: (formData: FormData) => Promise<void>;
  id: string;
  isPublished: boolean;
  /** Campos ocultos extra (p. ej. seriesId para revalidar). */
  extra?: { name: string; value: string }[];
};

/** Botón que alterna el estado de publicación vía server action. */
export function PublishToggle({ action, id, isPublished, extra }: Props) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="publish" value={(!isPublished).toString()} />
      {extra?.map((field) => (
        <input
          key={field.name}
          type="hidden"
          name={field.name}
          value={field.value}
        />
      ))}
      <button
        type="submit"
        className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
          isPublished
            ? "bg-gold/15 text-gold hover:bg-gold/25"
            : "border border-border text-muted hover:text-foreground"
        }`}
      >
        {isPublished ? "Publicado" : "Borrador"}
      </button>
    </form>
  );
}
