"use client";

import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SignInButton({ className }: { className?: string }) {
  return (
    <Button variant="outline" className={className} onClick={() => signIn("fao")}>
      <LogIn />
      Sign in
    </Button>
  );
}
