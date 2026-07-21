import { COMPANY, SITE_URL } from "./site";
import type { FaqItem, Service, BlogPost, SiteSettings } from "./types";

/** Convert a local Pakistani number (0331-…) to intl (+92331-…) for schema. */
function toIntl(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  return digits.startsWith("0") ? `+92-${digits.slice(1)}` : phone;
}

export function localBusinessJsonLd(settings?: SiteSettings) {
  const name = settings?.company_name || COMPANY.name;
  const tagline = settings?.tagline || COMPANY.tagline;
  const phone = settings?.phones?.[0] ? toIntl(settings.phones[0]) : COMPANY.phoneIntl;
  const email = settings?.email || COMPANY.email;
  const founded = settings?.founded || COMPANY.founded;
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${SITE_URL}/#business`,
    name,
    description: tagline,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    image: `${SITE_URL}/opengraph-image`,
    telephone: phone,
    email,
    foundingDate: founded,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings?.address || COMPANY.address.street,
      addressLocality: settings?.city || COMPANY.address.city,
      addressRegion: COMPANY.address.region,
      addressCountry: COMPANY.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: COMPANY.geo.lat,
      longitude: COMPANY.geo.lng,
    },
    areaServed: [
      { "@type": "City", name: "Karachi" },
      { "@type": "Country", name: "Pakistan" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "18:00",
    },
    knowsAbout: [
      "Elevator maintenance",
      "Elevator modernization",
      "Elevator overhauling",
      "Elevator spare parts",
      "Sigma elevator panels",
    ],
  };
}

export function serviceJsonLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.answer_block || service.summary,
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: { "@type": "City", name: "Karachi" },
    url: `${SITE_URL}/services/${service.slug}`,
    serviceType: service.name,
  };
}

export function faqJsonLd(faq: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    url: `${SITE_URL}/blog/${post.slug}`,
    author: { "@type": "Organization", name: COMPANY.name },
    publisher: { "@id": `${SITE_URL}/#business` },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  const list = Array.isArray(data) ? data : [data];
  return (
    <>
      {list.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
    </>
  );
}
