import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Called by the FastAPI backend after an admin save so changes go live in seconds.
export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  let body: { secret?: string; paths?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!secret || body.secret !== secret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const paths = (body.paths || []).filter((p) => typeof p === "string" && p.startsWith("/"));
  for (const path of paths) {
    revalidatePath(path === "/sitemap.xml" ? "/sitemap.xml" : path);
  }
  // llms.txt reflects services/projects too
  revalidatePath("/llms.txt");

  return NextResponse.json({ revalidated: paths });
}
