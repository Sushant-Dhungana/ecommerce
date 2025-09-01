import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignUpForm from "./sign-up-form";

export const metadata: Metadata = {
  title: "Sign Up",
};
const SignUpPage = async () => {
  const session = await auth();
  if (session) {
    return redirect("/");
  }
  return (
    <div className="w-full max-w-sm mx-auto">
      <Card className="p-6 shadow-lg rounded-md">
        <CardHeader className="space-y-4">
          <Link href="/" className="flex items-center justify-center">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} logo`}
              width={80}
              height={80}
              priority={true}
              className="rounded-lg bg-yellow-400 p-4"
            />
          </Link>
          <CardTitle className="text-center text-lg font-semibold">
            Create Account
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Enter Your Information Below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
