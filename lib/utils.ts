import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//convert prisma object into a regular js object

export function convertToPlainObject<T>(value: T): T {
  //T generic type for function that might accept
  return JSON.parse(JSON.stringify(value));
}

//format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

//format errors
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any): string {
  if (error instanceof ZodError) {
    const fieldErrors = error.issues.map((issue) => {
      const field = issue.path.join(".") || "Field";
      return `${field}: ${issue.message}`;
    });
    return fieldErrors.join(" | ");
  } else if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    const field = error.meta?.target ? error.meta.target[0] : "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return "An unexpected error occurred.";
  }
}

//round number to two decimal places
export function round2(value: number | string) {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("value is neither string nor a number");
  }
}
