/** Anima la entrada de cada pantalla al navegar (sensación de app nativa). */
export default function AppTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="page-enter">{children}</div>;
}
