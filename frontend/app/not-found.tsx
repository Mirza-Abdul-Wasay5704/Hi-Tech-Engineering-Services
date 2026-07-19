import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <span className="floor-plate !h-auto !px-5 !py-2 !text-5xl">404</span>
      <h1 className="display mt-6 text-4xl">Wrong floor.</h1>
      <p className="mt-3 max-w-sm text-sm text-[var(--muted)]">
        This page doesn&apos;t exist — but unlike a stuck elevator, you can get out of here instantly.
      </p>
      <Link href="/" className="btn-primary mt-8">
        ↑ Back to Ground Floor
      </Link>
    </div>
  );
}
