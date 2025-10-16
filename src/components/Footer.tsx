import { Github, Twitter, HatGlasses, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation('common');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-zinc-950 border-t border-zinc-800 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Main horizontal layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 py-8">
          {/* Left: Brand */}
          <div className="flex items-center gap-2 group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="100"
              height="100"
              viewBox="0 0 48 48"
              className="text-white group-hover:text-purple-600 w-10 h-10 transition-colors"
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
            <span className="text-white font-semibold text-lg group-hover:text-purple-600 transition-colors">
              FiveM Viewer
            </span>
          </div>

          {/* Center: Navigation links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href="/docs"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Documentation
            </a>
            <a
              href="/terms"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Terms
            </a>
            <a
              href="/blog"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Blog
            </a>
            <a
              href="/changelog"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Changelog
            </a>
            <a
              href="https://github.com/soydex/FiveM_Viewer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://discord.gg/invite"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
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
              className="text-zinc-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com/soydex_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://soydex.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-blue-500 transition-colors"
              aria-label="Portfolio"
            >
              <HatGlasses className="w-5 h-5" />
            </a>
            <a
              href="mailto:soydexdev@proton.me"
              className="text-zinc-400 hover:text-purple-500 transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="border-t border-zinc-800 py-6 flex items-center justify-between">
          <p className="text-sm text-zinc-500 text-center sm:text-left">
            © {currentYear} FiveM Viewer. {t('licensedUnderMIT')}
          </p>
          <p className="text-sm text-zinc-500 text-center sm:text-right">
            {t('notAffiliated')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
