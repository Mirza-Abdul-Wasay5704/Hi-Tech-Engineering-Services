/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Reveal } from "@/components/motion";
import { getBlogPost, getBlogPosts, mediaUrl } from "@/lib/api";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      publishedTime: post.published_at,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 pb-8 pt-32">
      <JsonLd
        data={[
          articleJsonLd(post),
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Insights", url: "/blog" },
            { name: post.title, url: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <Reveal>
        <div className="landing">
          <span className="floor-plate">I</span>
          <span className="landing-label">
            {new Date(post.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>
        <h1 className="display mt-6 text-4xl md:text-6xl">{post.title}</h1>
        {post.excerpt && <p className="mt-5 text-[16px] leading-relaxed text-[var(--muted)]">{post.excerpt}</p>}
      </Reveal>

      {post.cover_url && (
        <Reveal delay={0.1}>
          <img
            src={mediaUrl(post.cover_url)}
            alt={post.title}
            className="mt-10 w-full rounded-[3px] border border-[var(--line)]"
          />
        </Reveal>
      )}

      <Reveal delay={0.15}>
        <article className="prose-body mt-10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </article>
      </Reveal>

      <div className="plate-static mt-16 p-8 text-center">
        <p className="mono-tag">Need help with your elevators?</p>
        <p className="mx-auto mt-3 max-w-md text-sm text-[var(--muted)]">
          Our engineers answer questions and give honest assessments — no obligation.
        </p>
        <Link href="/contact" className="btn-primary mt-5">Contact Us →</Link>
      </div>
    </div>
  );
}
