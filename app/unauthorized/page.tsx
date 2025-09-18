import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unauthorized Access",
};

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h1 className="text-4xl font-bold text-red-600">Unauthorized Access</h1>
      <p className="text-lg text-gray-700">
        You do not have permission to view this page.
      </p>
      <Link href="/" passHref>
        <Button variant="outline">Go to Home</Button>
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
