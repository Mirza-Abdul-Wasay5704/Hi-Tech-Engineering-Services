import { COMPANY } from "./site";
import type { SiteSettings } from "./types";

/** Used when the API is unreachable at render time so pages never break. */
export const FALLBACK_SETTINGS: SiteSettings = {
  company_name: COMPANY.name,
  tagline: COMPANY.tagline,
  phones: COMPANY.phones,
  email: COMPANY.email,
  address: `${COMPANY.address.street}, ${COMPANY.address.city}, Pakistan`,
  city: COMPANY.address.city,
  country: "Pakistan",
  founded: COMPANY.founded,
  hours: "Mon–Sat 9:00–18:00 · 24/7 emergency response for contract clients",
  stats: [
    { value: 26, suffix: "+", label: "Years of Expertise" },
    { value: 25, suffix: "+", label: "Landmark Buildings Maintained" },
    { value: 4, suffix: "", label: "International Trainings (Korea)" },
    { value: 24, suffix: "/7", label: "Emergency Response" },
  ],
  hero_title: "Elevator Engineering, Perfected.",
  hero_subtitle:
    "26 years of precision maintenance, overhauling and modernization of elevators — trusted by Karachi's most demanding buildings, from five-star hotels to hospitals and the Pakistan Stock Exchange.",
  map_query: "Sohni Center, Karimabad, F.B. Area Block 4, Karachi",
};
