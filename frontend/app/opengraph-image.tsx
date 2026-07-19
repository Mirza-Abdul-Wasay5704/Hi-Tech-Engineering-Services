import { ImageResponse } from "next/og";
import { COMPANY } from "@/lib/site";

export const alt = `${COMPANY.name} — Elevator Maintenance, Overhauling & Modernization in Karachi`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#EFF1EE",
          color: "#171D1A",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* building section, right side */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: 90,
            top: 90,
            bottom: 90,
            width: 220,
            border: "3px solid #171D1A",
            borderRadius: 3,
            background: "#FBFBF9",
          }}
        >
          <div
            style={{
              display: "flex",
              position: "absolute",
              left: 45,
              top: 130,
              width: 130,
              height: 150,
              border: "4px solid #96793D",
              borderRadius: 2,
            }}
          />
          <div style={{ display: "flex", position: "absolute", left: 108, top: 0, width: 4, height: 130, background: "#1E5C46" }} />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 24,
            color: "#5A655F",
            letterSpacing: 6,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "3px solid #96793D",
              color: "#96793D",
              borderRadius: 3,
              padding: "4px 14px",
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            G
          </div>
          EST. 1997 — KARACHI, PAKISTAN
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.05, maxWidth: 760, textTransform: "uppercase" }}>
          Elevator Engineering, Perfected.
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#5A655F", marginTop: 28, maxWidth: 720 }}>
          Maintenance · Overhauling · Modernization · Spare Parts
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#1E5C46", marginTop: 48, fontWeight: 700, letterSpacing: 2 }}>
          HI-TECH ENGINEERING SERVICES
        </div>
      </div>
    ),
    { ...size },
  );
}
