import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import ElevatorProgress from "@/components/ElevatorProgress";
import { JsonLd, localBusinessJsonLd } from "@/lib/seo";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <JsonLd data={localBusinessJsonLd()} />
      <Navbar />
      <ElevatorProgress />
      <main className="flex-1">{children}</main>
      <Footer />
    </SmoothScroll>
  );
}
