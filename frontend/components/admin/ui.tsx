"use client";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-[var(--muted)]">{label}</span>
      {children}
    </label>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2.5 text-sm"
      aria-pressed={checked}
    >
      <span
        className={`relative h-5 w-9 rounded-full transition-colors ${
          checked ? "bg-[var(--accent)]" : "bg-[var(--line)]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
            checked ? "left-[18px]" : "left-0.5"
          }`}
        />
      </span>
      <span className="text-[var(--muted)]">{label}</span>
    </button>
  );
}

export function ImageUpload({
  label,
  value,
  kind,
  onUpload,
  onChange,
}: {
  label: string;
  value: string;
  kind: "photo" | "logo";
  onUpload: (file: File, kind: "photo" | "logo") => Promise<string>;
  onChange: (url: string) => void;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-sm text-[var(--muted)]">{label}</span>
      <div className="flex items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value.startsWith("/") ? `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001"}${value}` : value} alt="" className="h-12 w-20 rounded border border-[var(--line)] object-contain" />
        ) : (
          <span className="flex h-12 w-20 items-center justify-center rounded border border-dashed border-[var(--line)] text-xs text-[var(--muted)]">
            none
          </span>
        )}
        <input
          type="file"
          accept="image/*"
          className="text-xs text-[var(--muted)] file:mr-3 file:rounded file:border-0 file:bg-[var(--surface-2)] file:px-3 file:py-1.5 file:text-[var(--text)]"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
              const url = await onUpload(file, kind);
              onChange(url);
            } catch (err) {
              alert(err instanceof Error ? err.message : "Upload failed");
            }
          }}
        />
        {value && (
          <button type="button" className="text-xs text-red-400 hover:underline" onClick={() => onChange("")}>
            remove
          </button>
        )}
      </div>
    </div>
  );
}
