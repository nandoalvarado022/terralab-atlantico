type Props = {
  valor: string;
  onCambiar: (valor: string) => void;
};

export function MisionInspirar({ valor, onCambiar }: Props) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6">
      <label
        htmlFor="mision-inspirar"
        className="block text-xs font-extrabold tracking-widest text-primary uppercase"
      >
        Como esto te inspiro a construir
      </label>
      <textarea
        id="mision-inspirar"
        rows={8}
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
        className="mt-4 w-full resize-y rounded-2xl border-2 border-border bg-background p-4 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}
