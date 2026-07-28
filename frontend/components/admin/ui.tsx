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
  const src = value.startsWith("/")
    ? `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001"}${value}`
    : value;

  return (
    <div className="min-w-0">
      <span className="mb-2 block text-sm font-medium text-[var(--muted)]">{label}</span>
      <div className="flex items-start gap-3">
        {/* preview */}
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt=""
            className="h-16 w-24 shrink-0 rounded-[3px] border border-[var(--line)] bg-white object-contain p-1"
          />
        ) : (
          <span className="flex h-16 w-24 shrink-0 items-center justify-center rounded-[3px] border border-dashed border-[var(--line)] text-[11px] text-[var(--muted)]">
            No image
          </span>
        )}

        {/* controls — stacked so nothing overlaps */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-[3px] border border-[var(--line)] bg-[var(--panel)] px-3 py-1.5 text-xs font-medium text-[var(--ink)] transition-colors hover:border-[var(--green)] hover:text-[var(--green)]">
            {value ? "Replace image" : "Upload image"}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const url = await onUpload(file, kind);
                  onChange(url);
                } catch (err) {
                  alert(err instanceof Error ? err.message : "Upload failed");
                }
                e.target.value = ""; // allow re-picking the same file
              }}
            />
          </label>
          {value && (
            <button
              type="button"
              className="w-fit text-[11px] text-red-500 hover:underline"
              onClick={() => onChange("")}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
