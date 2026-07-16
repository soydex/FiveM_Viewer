"use client";

import React from "react";
import { AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";

interface DeprecationBannerProps {
  onDismiss: () => void;
}

export default function DeprecationBanner({ onDismiss }: DeprecationBannerProps) {
  const t = useTranslations("common");

  return (
    <div className="relative w-full min-h-screen bg-zinc-900/90 p-6 sm:p-10 text-center flex flex-col items-center justify-center gap-6 overflow-hidden">
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-lg flex flex-col items-center gap-6 relative z-10">
        <div className="relative flex items-center justify-center text-amber-500 dark:text-amber-400 rounded-2xl">
          <AlertTriangle className="" strokeWidth="1" />
        </div>

        <div className="space-y-4 w-full">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white bg-clip-text">
            {t("deprecationTitle")}
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm font-medium uppercase tracking-widest text-amber-500/80">
            {t("deprecationCountdown")}
          </p>
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent my-4" />
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-normal text-justify">
            {t("deprecationNotice")}
          </p>
        </div>

        <div className="w-full bg-zinc-950/50 border border-zinc-800/80 rounded-xl p-4 sm:p-5 text-left space-y-2">
          <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            {t("deprecationWhyTitle")}
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed text-justify">
            {t("deprecationWhyText")}
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onDismiss}
          className="w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-t from-[#8122b0] to-[#c045fc] hover:from-[#a62ce2] hover:to-[#d584fd] active:scale-95 text-white rounded-xl font-semibold text-sm sm:text-base shadow-lg shadow-purple-500/10 transition-all cursor-pointer group"
        >
          {t("deprecationButton")}
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
