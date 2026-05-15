import { useTranslations } from "next-intl";

const SupportMe = () => {
  const t = useTranslations("common");

  const socialLinks = [
    {
      icon: "github",
      url: "https://github.com/soydex",
      link: "https://avatars.githubusercontent.com/u/49359256?v=4",
      label: "GitHub",
      color: "hover:text-white",
    },
  ];

  const imgSafe = (img: { src?: string }) =>
    img.src ?? "https://avatars.githubusercontent.com/u/49359256?v=4";

  return (
    <div className="absolute left-2 top-2">
      <div className="flex gap-3">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={t("SupportMe")}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <img
              src={imgSafe(link.link ? { src: link.link } : {})}
              alt={link.label}
              className="relative w-10 h-10 rounded-full border border-zinc-700 group-hover:border-zinc-500 shadow-lg group-hover:shadow-zinc-500/50 group-hover:scale-110 transition-all duration-300"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default SupportMe;
