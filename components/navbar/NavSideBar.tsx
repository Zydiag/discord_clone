import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import NavAction from "./NavAction";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import NavLink from "./NavLink";
import { ModeToggle } from "../toggle-theme";
import { UserButton } from "@clerk/nextjs";

const NavSideBar = async () => {
  const profile = await currentProfile();
  if (!profile) redirect("/");

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  return (
    <div
      className="space-y-4 flex flex-col items-center
			h-full text-primary w-full bg-[#e3e5e8] dark:bg-[#1e1f22] py-3"
    >
      <NavAction />
      <Separator
        className="h-[2px] bg-zinc-300 dark:bg-zinc-700
				rounded-md w-10 mx-auto"
      />
      <ScrollArea className="flex-2 w-full h-full">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavLink
              id={server.id}
              imageUrl={server.imgUrl}
              name={server.name}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]",
            },
          }}
        />
      </div>
    </div>
  );
};

export default NavSideBar;
