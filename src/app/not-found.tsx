import Link from "next/link";
import { Button } from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <h1 className="text-6xl font-extrabold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-600 max-w-md mb-6">
        The medical resource or section you are looking for does not exist or has been moved.
      </p>
      <Link href="/">
        <Button variant="primary">Return to Homepage</Button>
      </Link>
    </div>
  );
}
