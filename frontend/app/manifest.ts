import type { MetadataRoute } from "next";
import { COMPANY } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: COMPANY.name,
    short_name: "Hi-Tech Eng",
    description: "Elevator maintenance, overhauling and modernization in Karachi, Pakistan.",
    start_url: "/",
    display: "standalone",
    background_color: "#EFF1EE",
    theme_color: "#1E5C46",
    icons: [{ src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" }],
  };
}
