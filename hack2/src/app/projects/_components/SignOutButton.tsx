// FINISHTODO: 4. Call the signOut() function when the button is clicked
// hint: You may want to change the first line of this file
"use client"

import { signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { publicEnv } from "@/lib/env/public";

export default function SignOutButton() {
  const { data: session } = useSession();
  const router = useRouter();
  const handleSignOut = () => {
      if (session) {
        signOut({ callbackUrl: publicEnv.NEXT_PUBLIC_BASE_URL });
      }
      router.push("/");
  }

  return <Button variant={"outline"} onClick={handleSignOut} data-testid="sign-out-button">Sign Out</Button>;
}
// FINISHTODO: 4. end
