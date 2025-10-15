import { Smartphone, AlertTriangle } from "lucide-react";

const Mobile = () => {
  return (
    <div className="md:hidden min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Content card */}
      <div className="relative z-10 max-w-md w-full">
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 rounded-3xl p-8 shadow-2xl">
          {/* Icon container with gradient background */}
          <div className="relative mx-auto w-20 h-20 mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-red-500 rounded-2xl blur-lg opacity-50"></div>
            <div className="relative bg-gradient-to-br from-purple-500 to-red-600 rounded-2xl w-full h-full flex items-center justify-center">
              <Smartphone className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-white text-center mb-3 tracking-tight">
            Appareil non compatible
          </h1>
          
          {/* Description */}
          <p className="text-zinc-400 text-center mb-6 leading-relaxed">
            Cette fonctionnalité n'est pas disponible sur votre appareil mobile.
          </p>
          
          {/* Info box */}
          <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-zinc-300 leading-relaxed">
                L'API de FiveM limite les requêtes depuis certains appareils. Malheureusement, le vôtre n'est pas compatible avec ce service.
              </p>
            </div>
          </div>
          
          {/* Suggestion */}
          <div className="text-center">
            <p className="text-sm text-zinc-500 mb-4">
              Pour accéder à cette fonctionnalité :
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full border border-zinc-700/50">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-zinc-300">Utilisez un ordinateur</span>
            </div>
          </div>
        </div>
        
        {/* Footer note */}
        <p className="text-center text-xs text-zinc-600 mt-6">
          Restriction technique imposée par l'API FiveM
        </p>
      </div>
    </div>
  );
};

export default Mobile;