"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { SignInFormSchema } from "../validators";
import { signIn, signOut } from "@/auth";

//sign in with credentials provided in ui
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = SignInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const res = await signIn("credentials", {
      email: user.email,
      password: user.password,
      redirect: false,
    });

    if (res?.error) {
      return { success: false, message: "Invalid credentials" };
    }

    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Invalid credentials" };
  }
}

//sign out
export async function signOutUser() {
  await signOut(); //kill cookies
}
