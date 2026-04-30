"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FileQuestion, Home } from "lucide-react";
import { Link } from "../../routing";

export default function NotFound() {
  const t = useTranslations("common");
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="mb-6 p-4 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
        <FileQuestion size={48} />
      </div>

      <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
        {t("notFoundTitle")}
      </h1>

      <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-md">
        {t("notFoundDescription")}
      </p>

      <div className="space-y-6">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-500 animate-pulse">
          {t("redirecting", { seconds: countdown })}
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 font-medium transition-transform hover:scale-105 active:scale-95"
        >
          <Home size={18} />
          {t("goBack")}
        </Link>
      </div>
    </div>
  );
}
