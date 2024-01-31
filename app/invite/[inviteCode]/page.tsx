import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

interface InvitePageProps {
  params: { inviteCode: string };
}

const InvitePage = async ({ params }: InvitePageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    redirectToSignIn();
    throw new Error("Unauthorized");
  }

  const { inviteCode } = params;
  if (!inviteCode) throw new Error("Invite Code invalid");

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode,
      members: {
        some: {
          profileId: profile?.id,
        },
      },
    },
  });
  if (existingServer) return redirect(`/servers/${existingServer.id}`);

  const server = await db.server.update({
    where: {
      inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });
  if (server) return redirect(`/servers/${server.id}`);

  return null;
};

export default InvitePage;
