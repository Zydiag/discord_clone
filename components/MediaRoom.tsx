"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!user?.fullName) return;
    const name = user?.fullName;

    // const name = `${user.firstName} ${user.lastName}`;
    (async () => {
      try {
        const resp = await fetch(
          // `/api/livekit?room=${chatId}&username=${name}`,
          `/api/livekit?room=${chatId}&username=Sahil lakha`,
        );
        console.log("resp", resp);
        const data = await resp.json();
        console.log(data);
        setToken(data.token);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [user?.firstName, user?.lastName, chatId]);

  // console.log(user);
  // useEffect(() => {
  //   if (!user?.fullName) return;
  //   const name = user?.fullName;
  //   console.log("name", name);
  //
  //   fetch(`/api/livekit?room=${chatId}&username=${name}`)
  //     .then((resp) => resp.json())
  //     .then((data) => {
  //       console.log("data", data);
  //       setToken(data.token);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching token:", error);
  //     });
  // }, []);

  if (token === "") {
    console.log("token empty");
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
