/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/motion";
import { getBlogPosts, mediaUrl } from "@/lib/api";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Insights — Elevator Maintenance & Modernization Guides",
  description:
    "Practical guides from Hi-Tech Engineering Services: elevator maintenance, modernization, troubleshooting and buying advice for building managers in Pakistan.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-32">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", url: "/" }, { name: "Insights", url: "/blog" }])} />
      <SectionHeading
        floor="I"
        label="Insights"
        title="Engineering Knowledge, Shared"
        subtitle="Guides written by our engineers for building managers, facility teams and property owners in Pakistan."
      />

      {posts.length === 0 ? (
        <p className="mt-16 text-[var(--muted)]">Articles coming soon.</p>
      ) : (
        <RevealGroup className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <RevealItem key={post.id}>
              <Link href={`/blog/${post.slug}`} className="plate group flex h-full flex-col overflow-hidden">
                {post.cover_url && (
                  <img
                    src={mediaUrl(post.cover_url)}
                    alt={post.title}
                    className="h-44 w-full border-b border-[var(--line)] object-cover"
                    loading="lazy"
                  />
                )}
                <div className="flex flex-1 flex-col p-6">
                  <time className="font-mono text-xs tracking-wider text-[var(--muted)]">
                    {new Date(post.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </time>
                  <h2 className="mt-3 font-sans text-lg font-semibold leading-snug transition-colors group-hover:text-[var(--green)]">
                    {post.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--muted)]">{post.excerpt}</p>
                  <span className="mt-4 font-mono text-xs tracking-widest text-[var(--green)]">READ →</span>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  );
}
