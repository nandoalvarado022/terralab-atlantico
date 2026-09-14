type Props = {
  valor: string;
  onCambiar: (valor: string) => void;
};

export function MisionProbar({ valor, onCambiar }: Props) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6">
      <label
        htmlFor="mision-probar-mejorar"
        className="block text-xs font-extrabold tracking-widest text-primary uppercase"
      >
        Qué se puede mejorar
      </label>
      <textarea
        id="mision-probar-mejorar"
        rows={6}
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
        placeholder="Escriban qué se puede mejorar…"
        className="mt-4 w-full resize-y rounded-2xl border-2 border-border bg-background p-4 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}
