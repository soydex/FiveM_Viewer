"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GlobalNotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <html lang="en">
      <body className="flex flex-col items-center justify-center min-h-screen font-sans antialiased text-center px-4 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
        <div className="max-w-md w-full">
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            The page you are looking for does not exist. Redirecting to home
            page in 5 seconds...
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 font-medium transition-transform hover:scale-105 active:scale-95"
          >
            Go back home
          </a>
        </div>
      </body>
    </html>
  );
}
