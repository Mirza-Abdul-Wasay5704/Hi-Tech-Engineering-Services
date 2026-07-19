import { API_URL } from "./site";
import type { BlogPost, Project, Service, SiteSettings, Testimonial } from "./types";
import { FALLBACK_SETTINGS } from "./fallback";

const REVALIDATE_SECONDS = 3600; // hourly safety net; admin saves revalidate on-demand

async function get<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    // API asleep/unreachable — render with fallback instead of failing the build
    return fallback;
  }
}

export const getProjects = () => get<Project[]>("/api/projects", []);
export const getProject = (slug: string) => get<Project | null>(`/api/projects/${slug}`, null);
export const getServices = () => get<Service[]>("/api/services", []);
export const getService = (slug: string) => get<Service | null>(`/api/services/${slug}`, null);
export const getBlogPosts = () => get<BlogPost[]>("/api/blog", []);
export const getBlogPost = (slug: string) => get<BlogPost | null>(`/api/blog/${slug}`, null);
export const getTestimonials = () => get<Testimonial[]>("/api/testimonials", []);
export const getSettings = () => get<SiteSettings>("/api/settings", FALLBACK_SETTINGS);

/** Resolve relative upload URLs (local dev storage) against the API host. */
export function mediaUrl(url: string): string {
  if (!url) return "";
  return url.startsWith("/") ? `${API_URL}${url}` : url;
}
