"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const signOut = useAuthStore(state => state.signOut);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/auth/login");
  };

  return <Button onClick={handleLogout}>Logout</Button>;
}
