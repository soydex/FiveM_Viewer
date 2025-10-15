import { ArrowLeft } from "lucide-react";

const Terms = () => {
    document.title = "Conditions d'utilisation - FiveM Viewer";
    document.body.style.backgroundColor = "#18181b";
  return (
    <div className="min-h-screen bg-zinc-900 relative">
      <div className="fixed">
        <a
          href="/"
          className="text-zinc-400 hover:text-white transition-colors p-6 flex items-center"
        >
          <ArrowLeft className="inline w-5 h-5" />
          Retour

        </a>
      </div>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-zinc-300 mb-6 border-b border-zinc-700 pb-2">
          Conditions d'utilisation
        </h1>
        <p className="text-zinc-400 mb-4">
          Bienvenue sur notre site web. En utilisant ce site, vous acceptez les
          présentes conditions d'utilisation. Si vous n'acceptez pas ces
          conditions, veuillez ne pas utiliser notre site.
        </p>
        <h2 className="text-2xl font-semibold text-zinc-300 mt-8 mb-4 border-b border-zinc-700 pb-2">
          1. Utilisation du site
        </h2>
        <p className="text-zinc-400 mb-4">
          Vous vous engagez à utiliser ce site conformément à la loi et aux
          présentes conditions. Vous ne devez pas utiliser le site à des fins
          illégales ou non autorisées.
        </p>
                <h2 className="text-2xl font-semibold text-zinc-300 mt-8 mb-4 border-b border-zinc-700 pb-2">
          2. Propriété intellectuelle
        </h2>
        <p className="text-zinc-400 mb-4">
          Tout le contenu de ce site, y compris les textes, images, logos, et
          code source, est protégé par les droits d'auteur et autres droits de
          propriété intellectuelle. Vous ne pouvez pas reproduire, distribuer
          ou utiliser ce contenu sans autorisation préalable.
        </p>
        <h2 className="text-2xl font-semibold text-zinc-300 mt-8 mb-4 border-b border-zinc-700 pb-2">
          3. Utilisation des données FiveM
        </h2>
        <p className="text-zinc-400 mb-4">
          Ce site utilise l'API publique de FiveM pour récupérer les
          informations des serveurs. Nous ne sommes pas responsables de
          l'exactitude, de la disponibilité ou de la mise à jour de ces données.
          L'utilisation de ces données est soumise aux conditions d'utilisation
          de FiveM.
        </p>
        <h2 className="text-2xl font-semibold text-zinc-300 mt-8 mb-4 border-b border-zinc-700 pb-2">
          3.1 Position concernant Rockstar Games
        </h2>
        <p className="text-zinc-400 mb-4">
          Ce site n'est pas affilié à Rockstar Games, Take-Two Interactive ou
          FiveM. Nous ne distribuons aucun contenu protégé par des droits
          d'auteur de Rockstar Games. Notre service se limite à l'affichage
          d'informations publiques disponibles via l'API officielle de FiveM.
          L'utilisation de ce site est à vos risques et périls.
        </p>
        <h2 className="text-2xl font-semibold text-zinc-300 mt-8 mb-4 border-b border-zinc-700 pb-2">
          4. Responsabilités de l'utilisateur
        </h2>
        <p className="text-zinc-400 mb-4">
          En utilisant ce site, vous vous engagez à :
        </p>
        <ul className="text-zinc-400 mb-4 ml-6 list-disc">
          <li>Ne pas utiliser le site pour des activités illégales</li>
          <li>Respecter les droits des autres utilisateurs</li>
          <li>Ne pas tenter de compromettre la sécurité du site</li>
          <li>Fournir des informations exactes si nécessaire</li>
        </ul>
        <h2 className="text-2xl font-semibold text-zinc-300 mt-8 mb-4 border-b border-zinc-700 pb-2">
          5. Limitation de responsabilité
        </h2>
        <p className="text-zinc-400 mb-4">
          Ce site est fourni "tel quel" sans garantie d'aucune sorte. Nous ne
          pouvons être tenus responsables des dommages directs ou indirects
          résultant de l'utilisation de ce site, y compris la perte de données
          ou d'opportunités commerciales.
        </p>
        <h2 className="text-2xl font-semibold text-zinc-300 mt-8 mb-4 border-b border-zinc-700 pb-2">
          6. Protection des données personnelles
        </h2>
        <p className="text-zinc-400 mb-4">
          Nous collectons uniquement les données nécessaires au fonctionnement
          du site (préférences utilisateur, historique des serveurs consultés).
          Ces données sont stockées localement dans votre navigateur et ne sont
          pas transmises à des tiers sans votre consentement explicite.
        </p>
        <h2 className="text-2xl font-semibold text-zinc-300 mt-8 mb-4 border-b border-zinc-700 pb-2">
          7. Cookies et technologies similaires
        </h2>
        <p className="text-zinc-400 mb-4">
          Ce site utilise le stockage local du navigateur (localStorage) pour
          sauvegarder vos préférences et votre historique. Aucune donnée n'est
          collectée via des cookies tiers ou des technologies de traçage.
        </p>
        <h2 className="text-2xl font-semibold text-zinc-300 mt-8 mb-4 border-b border-zinc-700 pb-2">
          8. Modifications des conditions
        </h2>
        <p className="text-zinc-400 mb-4">
          Nous nous réservons le droit de modifier ces conditions à tout moment.
          Les modifications prendront effet immédiatement après leur publication
          sur le site. Votre utilisation continue du site constitue l'acceptation
          des nouvelles conditions.
        </p>
        <h2 className="text-2xl font-semibold text-zinc-300 mt-8 mb-4 border-b border-zinc-700 pb-2">
          9. Droit applicable et juridiction
        </h2>
        <p className="text-zinc-400 mb-4">
          Ces conditions sont régies par le droit français. Tout litige relatif
          à l'utilisation de ce site sera soumis à la compétence exclusive des
          tribunaux français.
        </p>
        <h2 className="text-2xl font-semibold text-zinc-300 mt-8 mb-4 border-b border-zinc-700 pb-2">
          10. Contact
        </h2>
        <p className="text-zinc-400 mb-4">
          Pour toute question concernant ces conditions d'utilisation, vous
          pouvez nous contacter via les informations disponibles sur le site
          ou les serveurs Discord associés.
        </p>
        <p className="text-zinc-500 text-sm mt-8 italic">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')} from <a href="https://github.com/soydex" className="text-sm hover:font-large text-zinc-300 hover:text-zinc-400 font-medium transition" target="_blank">soydex</a>
        </p>
      </div>
    </div>
  );
};

export default Terms;
