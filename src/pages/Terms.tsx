import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

const Terms = () => {
  const { t } = useTranslation('common');
  document.title = `${t('termsTitle')} - FiveM Viewer`;
  document.body.style.backgroundColor = "#18181b";
  return (
    <div className="min-h-screen bg-zinc-900 relative">
      <div className="fixed">
        <a
          href="/"
          className="text-zinc-400 hover:text-white transition-colors p-6 flex items-center"
        >
          <ArrowLeft className="inline w-5 h-5" />
          {t('back')}

        </a>
      </div>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-zinc-300 mb-6 border-b border-zinc-700 pb-2">
          {t('termsTitle')}
        </h1>
        <p className="text-zinc-400 mb-4">
          {t('termsWelcome')}
        </p>
        <h2 className="text-2xl font-semibold text-zinc-300 mt-8 mb-4 border-b border-zinc-700 pb-2">
          1. {t('termsSiteUsage')}
        </h2>
        <p className="text-zinc-400 mb-4">
          {t('termsSiteUsageDesc')}
        </p>
                <h2 className="text-2xl font-semibold text-zinc-300 mt-8 mb-4 border-b border-zinc-700 pb-2">
          2. {t('termsIntellectualProperty')}
        </h2>
        <p className="text-zinc-400 mb-4">
          {t('termsIntellectualPropertyDesc')}
        </p>
        <h2 className="text-2xl font-semibold text-zinc-300 mt-8 mb-4 border-b border-zinc-700 pb-2">
          3. {t('termsFiveMData')}
        </h2>
        <p className="text-zinc-400 mb-4">
          {t('termsFiveMDataDesc')}
        </p>
        <h2 className="text-2xl font-semibold text-zinc-300 mt-8 mb-4 border-b border-zinc-700 pb-2">
          3.1 {t('termsRockstarPosition')}
        </h2>
        <p className="text-zinc-400 mb-4">
          {t('termsRockstarPositionDesc')}
        </p>
        <h2 className="text-2xl font-semibold text-zinc-300 mt-8 mb-4 border-b border-zinc-700 pb-2">
          4. {t('termsUserResponsibilities')}
        </h2>
        <p className="text-zinc-400 mb-4">
          {t('termsUserResponsibilitiesDesc')}
        </p>
        <ul className="text-zinc-400 mb-4 ml-6 list-disc">
          <li>{t('termsUserResp1')}</li>
          <li>{t('termsUserResp2')}</li>
          <li>{t('termsUserResp3')}</li>
          <li>{t('termsUserResp4')}</li>
        </ul>
        <h2 className="text-2xl font-semibold text-zinc-300 mt-8 mb-4 border-b border-zinc-700 pb-2">
          5. {t('termsLiabilityLimitation')}
        </h2>
        <p className="text-zinc-400 mb-4">
          {t('termsLiabilityLimitationDesc')}
        </p>
        <h2 className="text-2xl font-semibold text-zinc-300 mt-8 mb-4 border-b border-zinc-700 pb-2">
          6. {t('termsDataProtection')}
        </h2>
        <p className="text-zinc-400 mb-4">
          {t('termsDataProtectionDesc')}
        </p>
        <h2 className="text-2xl font-semibold text-zinc-300 mt-8 mb-4 border-b border-zinc-700 pb-2">
          7. {t('termsCookies')}
        </h2>
        <p className="text-zinc-400 mb-4">
          {t('termsCookiesDesc')}
        </p>
        <h2 className="text-2xl font-semibold text-zinc-300 mt-8 mb-4 border-b border-zinc-700 pb-2">
          8. {t('termsModifications')}
        </h2>
        <p className="text-zinc-400 mb-4">
          {t('termsModificationsDesc')}
        </p>
        <h2 className="text-2xl font-semibold text-zinc-300 mt-8 mb-4 border-b border-zinc-700 pb-2">
          9. {t('termsApplicableLaw')}
        </h2>
        <p className="text-zinc-400 mb-4">
          {t('termsApplicableLawDesc')}
        </p>
        <h2 className="text-2xl font-semibold text-zinc-300 mt-8 mb-4 border-b border-zinc-700 pb-2">
          10. {t('termsContact')}
        </h2>
        <p className="text-zinc-400 mb-4">
          {t('termsContactDesc')}
        </p>
        <p className="text-zinc-500 text-sm mt-8 italic">
          {t('lastUpdated')} : {new Date().toLocaleDateString()} from <a href="https://github.com/soydex" className="text-sm hover:font-large text-zinc-300 hover:text-zinc-400 font-medium transition" target="_blank">soydex</a>
        </p>
      </div>
    </div>
  );
};

export default Terms;
