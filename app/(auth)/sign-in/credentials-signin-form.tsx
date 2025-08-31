"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom"; //for button state
import { signInWithCredentials } from "@/lib/actions/user.actions";

const CredentialsSignInForm = () => {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });
  const SingInButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full" variant="default">
        {pending ? "Signing In..." : "Sign In"}
      </Button>
    );
  };
  return (
    <form action={action}>
      <div className="space-y-6">
        <div>
          <Label htmlFor="email" className="pb-2">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={signInDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="password" className="pb-2">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            required
            autoComplete="password"
            defaultValue={signInDefaultValues.password}
          />
        </div>
        <div>
          <SingInButton />
          {data && !data.success && (
            <p className="text-destructive text-sm pt-2 text-center">
              {data.message}
            </p>
          )}
          <div className="text-sm text-center text-muted-foreground pt-2">
            Don&apos;t have an account?{""}
            <Link
              href="/sign-up"
              target="_self"
              className="text-primary font-medium hover:underline"
            >
              {" "}
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
