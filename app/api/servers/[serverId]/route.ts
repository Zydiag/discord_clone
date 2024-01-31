import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } },
) {
  try {
    const profile = await currentProfile();
    if (!profile) return redirectToSignIn();
    const { name, imageUrl } = await req.json();
    const { serverId } = params;
    if (!serverId) return new NextResponse("serverId invalid", { status: 400 });
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imgUrl: imageUrl,
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("updating server error", error);
    return new NextResponse("server Error", { status: 500 });
  }
}
