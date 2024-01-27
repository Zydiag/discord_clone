import { ModeToggle } from "@/components/toggle-theme";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      <UserButton afterSignOutUrl="/" />
      <ModeToggle />
    </>
  );
}
