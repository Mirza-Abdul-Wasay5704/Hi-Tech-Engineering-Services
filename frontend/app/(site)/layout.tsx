import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import ElevatorProgress from "@/components/ElevatorProgress";
import { JsonLd, localBusinessJsonLd } from "@/lib/seo";
import { getSettings } from "@/lib/api";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <SmoothScroll>
      <JsonLd data={localBusinessJsonLd(settings)} />
      <Navbar />
      <ElevatorProgress />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </SmoothScroll>
  );
}
