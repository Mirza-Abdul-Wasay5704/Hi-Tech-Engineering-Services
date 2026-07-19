export interface Project {
  id: number;
  name: string;
  slug: string;
  category: string;
  client_name: string;
  logo_url: string;
  image_url: string;
  location: string;
  scope_of_work: string;
  description: string;
  elevator_types: string;
  featured: boolean;
  show_logo: boolean;
  sort_order: number;
  published: boolean;
}

export interface ScopeItem {
  label: string;
  detail: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Service {
  id: number;
  name: string;
  slug: string;
  summary: string;
  answer_block: string;
  body: string;
  icon: string;
  scope_items: ScopeItem[];
  faq: FaqItem[];
  seo_title: string;
  seo_description: string;
  sort_order: number;
  published: boolean;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_url: string;
  tags: string;
  seo_title: string;
  seo_description: string;
  published: boolean;
  published_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: number;
  author: string;
  role: string;
  company: string;
  quote: string;
  sort_order: number;
  published: boolean;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface SiteSettings {
  company_name: string;
  tagline: string;
  phones: string[];
  email: string;
  address: string;
  city: string;
  country: string;
  founded: string;
  hours: string;
  stats: Stat[];
  hero_title: string;
  hero_subtitle: string;
  map_query: string;
}

export interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: string;
  created_at: string;
}
