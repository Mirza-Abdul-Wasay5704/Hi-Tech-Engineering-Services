import { getProjects, getServices } from "@/lib/api";
import { COMPANY, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

// llms.txt — a concise, factual company summary for AI crawlers and assistants.
export async function GET() {
  const [services, projects] = await Promise.all([getServices(), getProjects()]);

  const body = `# ${COMPANY.name}

> Elevator maintenance, mechanical & electrical overhauling, retrofitting and modernization company in Karachi, Pakistan. Operating since ${COMPANY.founded} (26+ years). Specialists in Sigma/LG elevator control systems. One of the fastest breakdown response times in Karachi.

## Key facts
- Location: ${COMPANY.address.street}, ${COMPANY.address.city}, Pakistan
- Phone: ${COMPANY.phones.join(" / ")}
- Email: ${COMPANY.email}
- Service area: Karachi and across Pakistan
- Founded: ${COMPANY.founded}
- Credentials: NTN-registered; manufacturer training in Korea (1994, 1997, 2005, 2014)

## Services
${services.map((s) => `- [${s.name}](${SITE_URL}/services/${s.slug}): ${s.summary}`).join("\n")}

## Expertise
- All elevator motor types: AC synchronous, AC asynchronous, geared and gearless machines
- All electrical panel types: relay logic, SSD PCB, microprocessor — Sigma is our specialty
- Mechanical work: doors, guide rails, ropes, brakes, guide shoes, complete overhauls
- Spare parts supply (local and imported): encoders, control cards, inverters, complete panels, sensors

## Notable clients (buildings maintained)
${projects.slice(0, 15).map((p) => `- ${p.name} (${p.category})`).join("\n")}

## Pages
- [Home](${SITE_URL}/)
- [Services](${SITE_URL}/services)
- [Projects](${SITE_URL}/projects)
- [About](${SITE_URL}/about)
- [Contact](${SITE_URL}/contact)
- [Insights / Blog](${SITE_URL}/blog)
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
