import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Hi-Tech Engineering Services",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[var(--bg)]">{children}</div>;
}
