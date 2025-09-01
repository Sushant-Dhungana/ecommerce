"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom"; //for button state
import { signUpUser } from "@/lib/actions/user.actions";

const SignUpForm = () => {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: "",
  });
  const SingUpButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full" variant="default">
        {pending ? "Signing Up..." : "Sign Up"}
      </Button>
    );
  };
  return (
    <form action={action}>
      <div className="space-y-6">
        <div>
          <Label htmlFor="name" className="pb-2">
            Name
          </Label>
          <Input
            id="name"
            type="text"
            name="name"
            required
            autoComplete="name"
            defaultValue={signUpDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="email" className="pb-2">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            required
            autoComplete="email"
            defaultValue={signUpDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="password" className="pb-2">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            name="password"
            required
            autoComplete="password"
            defaultValue={signUpDefaultValues.password}
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword" className="pb-2">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            required
            autoComplete="confirmPassword"
            defaultValue={signUpDefaultValues.confirmPassword}
          />
        </div>
        <div>
          <SingUpButton />
          {data && !data.success && (
            <p className="text-destructive text-sm pt-2 text-center">
              {data.message}
            </p>
          )}
          <div className="text-sm text-center text-muted-foreground pt-2">
            Already have an account?{""}
            <Link
              href="/sign-in"
              target="_self"
              className="text-primary font-medium hover:underline"
            >
              {" "}
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
