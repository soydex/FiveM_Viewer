import { Glasses, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("common");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Main horizontal layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 py-8">
          {/* Left: Brand */}
          <div className="flex items-center gap-2 group">
            <svg
              aria-label="FiveM Viewer"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="100"
              height="100"
              viewBox="0 0 48 48"
              className="text-zinc-900 dark:text-white group-hover:text-purple-600 w-10 h-10 transition-colors"
            >
              <polygon
                fill="CurrentColor"
                points="5,45 9,34 21,22 15,45"
              ></polygon>
              <polygon
                fill="CurrentColor"
                points="25,18 33,45 43,45 32,12"
              ></polygon>
              <polygon
                fill="CurrentColor"
                points="16.059,14.164 20,3 28,3"
              ></polygon>
              <polygon
                fill="CurrentColor"
                points="10.731,29.002 23,17 23,15 11.58,26.667"
              ></polygon>
              <polygon
                fill="CurrentColor"
                points="15.142,16.429 13,22 29.724,5.725 28.818,3.178"
              ></polygon>
              <polygon
                fill="CurrentColor"
                points="23.932,14.055 24.377,15.626 30.941,9.178 30.385,7.702"
              ></polygon>
            </svg>
            <span className="text-zinc-900 dark:text-white font-semibold text-lg group-hover:text-purple-600 transition-colors">
              FiveM Viewer
            </span>
          </div>

          {/* Center: Navigation links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href="/docs"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              Documentation
            </a>
            <a
              href="/terms"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              Terms
            </a>
            <a
              href="/blog"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              Blog
            </a>
            <a
              href="/changelog"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              Changelog
            </a>
            <a
              href="https://github.com/soydex/FiveM_Viewer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://discord.gg/invite"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              Discord
            </a>
          </nav>

          {/* Right: Social icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/soydex"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="https://twitter.com/soydex_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://soydex.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-blue-500 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors"
              aria-label="Portfolio"
            >
              <Glasses className="w-5 h-5" />
            </a>
            <a
              href="mailto:soydexdev@proton.me"
              className="text-zinc-500 hover:text-purple-500 dark:text-zinc-400 dark:hover:text-purple-400 transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 py-6 flex items-center justify-between">
          <p className="text-sm text-zinc-500 text-center sm:text-left">
            © {currentYear} FiveM Viewer. {t("licensedUnderMIT")}
          </p>
          <p className="text-sm text-zinc-500 text-center sm:text-right">
            {t("notAffiliated")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
