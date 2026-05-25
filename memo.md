# FiveM API Documentation & Source Code Reference

Ce document répertorie les routes de l'API de FiveM (et de l'écosystème CFX) ainsi que leurs localisations correspondantes dans le code source officiel de [fivem](file:///Users/user/Documents/Code_Perso/fivem).

---

## User (Discourse & Policy)

### 1. User Session (GET)
*   **API URL :** `https://forum.cfx.re/session/current.json`
*   **Fichier source :** [discourse.service.ts](file:///Users/user/Documents/Code_Perso/fivem/ext/cfx-ui/src/cfx/apps/mpMenu/services/discourse/discourse.service.ts#L142)
*   **Fonction :** Appelé dans la méthode `loadCurrentAccount()`.

### 2. Information (GET)
*   **API URL :** `https://forum.cfx.re/u/{username}.json`
*   **Fichier source :** [discourse.service.ts](file:///Users/user/Documents/Code_Perso/fivem/ext/cfx-ui/src/cfx/apps/mpMenu/services/discourse/discourse.service.ts#L143)
*   **Fonction :** Appelé dans `loadCurrentAccount()` juste après avoir récupéré la session utilisateur.

### 3. CSRF Session (GET)
*   **API URL :** `https://forum.cfx.re/session/csrf.json`
*   **Note :** N'est pas présent directement dans la base de code active. L'authentification utilise le flux de clés d'API Discourse (`/user-api-key/new`) généré par `createAuthURL()` dans [discourse.service.ts](file:///Users/user/Documents/Code_Perso/fivem/ext/cfx-ui/src/cfx/apps/mpMenu/services/discourse/discourse.service.ts#L258).

### 4. Username Check (GET)
*   **API URL :** `https://forum.cfx.re/u/check_username.json?username={username}`
*   **Note :** Route Discourse standard. L'application UI utilise les pages d'inscription standard du forum (comme [getSignUpURL()](file:///Users/user/Documents/Code_Perso/fivem/ext/cfx-ui/src/cfx/apps/mpMenu/services/discourse/discourse.service.ts#L190)).

### 5. Email Check (GET)
*   **API URL :** `https://forum.cfx.re/u/check_email.json?email={email}`
*   **Note :** Route Discourse standard.

### 6. Send Email (POST)
*   **API URL :** `https://forum.cfx.re/u/action/send_activation_email`
*   **En-têtes requis :**
    ```json
    {
      "Cfx-Entitlement-Ticket": "<ownership ticket>",
      "x-requested-with": "XMLHttpRequest",
      "discourse-present": "true",
      "x-csrf-token": "<csrf token>"
    }
    ```
*   **Payload (JSON/FormData) :** `username: <username>`
*   **Note :** Route Discourse standard.

### 7. Policy User (GET)
*   **API URL :** `https://policy-live.fivem.net/api/getUserInfo/{id}`
*   **Fichier source :** [NetLibrary.cpp](file:///Users/user/Documents/Code_Perso/fivem/code/components/net/src/NetLibrary.cpp#L42) et [NetLibrary.cpp](file:///Users/user/Documents/Code_Perso/fivem/code/components/net/src/NetLibrary.cpp#L1461)
*   **Fonction :** Défini par la macro `POLICY_LIVE_ENDPOINT`. L'application l'utilise via `DoGetRequest(fmt::sprintf("%sapi/policy/%s", POLICY_LIVE_ENDPOINT, val), ...)` pour demander les politiques de fonctionnalités associées à la licence serveur (`sv_licenseKeyToken`).

---

## FiveM (Server list, status & metadata)

### 1. Main Information (GET)
*   **API URL :** `http://{ip:port}/info.json`
*   **Fichier source :** [InfoHttpHandler.cpp](file:///Users/user/Documents/Code_Perso/fivem/code/components/citizen-server-impl/src/InfoHttpHandler.cpp#L286)
*   **Description :** FXServer enregistre ce point d'accès via `HttpServerManager->AddEndpoint("/info.json", ...)`.

### 2. Dynamic Information (GET)
*   **API URL :** `http://{ip:port}/dynamic.json`
*   **Fichier source :** [InfoHttpHandler.cpp](file:///Users/user/Documents/Code_Perso/fivem/code/components/citizen-server-impl/src/InfoHttpHandler.cpp#L327)
*   **Description :** Enregistré sous `/dynamic.json` sur FXServer pour les infos de jeu dynamiques (nombre de joueurs, etc.).

### 3. Player Information (GET)
*   **API URL :** `http://{ip:port}/players.json`
*   **Fichier source :** [InfoHttpHandler.cpp](file:///Users/user/Documents/Code_Perso/fivem/code/components/citizen-server-impl/src/InfoHttpHandler.cpp#L341)
*   **Description :** Enregistré sous `/players.json` sur FXServer pour l'état actuel des joueurs connectés (noms, IDs, pings).

### 4. Server List Information (GET)
*   **API URL :** `https://frontend.cfx-services.net/api/servers/single/{address}` *(anciennement `servers-frontend.fivem.net`)*
*   **Fichier source :** [fetchers.ts](file:///Users/user/Documents/Code_Perso/fivem/ext/cfx-ui/src/cfx/common/services/servers/source/utils/fetchers.ts#L12)
*   **Description :** Point d'accès de l'API web (`SINGLE_SERVER_URL` pointant vers `/single/`) exécuté par la méthode `getMasterListServer` pour obtenir les détails d'un serveur unique.

### 5. All Server Data (GET)
*   **API URL :** `https://frontend.cfx-services.net/api/servers/streamRedir` *(anciennement `servers-frontend.fivem.net`)*
*   **Fichier source :** [fetchers.ts](file:///Users/user/Documents/Code_Perso/fivem/ext/cfx-ui/src/cfx/common/services/servers/source/utils/fetchers.ts#L11)
*   **Description :** Point d'accès de l'API web (`ALL_SERVERS_URL` pointant vers `/streamRedir/`) pour récupérer le flux de données de tous les serveurs actifs.

### 6. Top Server (Country) (GET)
*   **API URL :** `https://frontend.cfx-services.net/api/servers/top/{language}` *(anciennement `servers-frontend.fivem.net`)*
*   **Fichier source :** [HomeScreenServerList.service.ts](file:///Users/user/Documents/Code_Perso/fivem/ext/cfx-ui/src/cfx/apps/mpMenu/services/servers/list/HomeScreenServerList.service.ts#L86) et [WorkerSource.worker.ts](file:///Users/user/Documents/Code_Perso/fivem/ext/cfx-ui/src/cfx/common/services/servers/source/WorkerSource.worker.ts#L120)
*   **Description :** Le client récupère tout le flux `streamRedir` et filtre/trie localement les serveurs dans un Web Worker avec `ServersListType.RegionalTop` selon la locale système.

### 7. Upvote Information (GET/POST)
*   **API URL :** `https://frontend.cfx-services.net/api/upvote/` *(anciennement `servers-frontend.fivem.net`)*
*   **Fichier source :** [serversBoost.mpMenu.ts](file:///Users/user/Documents/Code_Perso/fivem/ext/cfx-ui/src/cfx/apps/mpMenu/services/servers/serversBoost.mpMenu.ts#L105) (POST pour upvoter) et [serversBoost.mpMenu.ts](file:///Users/user/Documents/Code_Perso/fivem/ext/cfx-ui/src/cfx/apps/mpMenu/services/servers/serversBoost.mpMenu.ts#L176) (GET pour charger l'état actuel).

### 8. Player Playtime (GET)
*   **API URL :** `https://lambda.fivem.net/api/ticket/playtimes/{ip:port}?identifiers[]={identifier}`
*   **Fichier source :** [playtimes.ts](file:///Users/user/Documents/Code_Perso/fivem/ext/cfx-ui/src/cfx/common/services/servers/activity/playtimes.ts#L24)
*   **Description :** Requête effectuée avec la constante `__CFXUI_CNL_ENDPOINT__` (qui vaut par défaut `https://lambda.fivem.net/`).

### 9. Promotions (GET)
*   **API URL :** `https://runtime.fivem.net/promotions_targeting.json`
*   **Fichier source :** [ServerNucleus.cpp](file:///Users/user/Documents/Code_Perso/fivem/code/components/citizen-server-impl/src/ServerNucleus.cpp#L30)

### 10. CnL (GET)
*   **API URL :** `https://lambda.fivem.net`
*   **Fichier source :** [CnlEndpoint.h](file:///Users/user/Documents/Code_Perso/fivem/code/client/shared/CnlEndpoint.h#L13)
*   **Description :** Défini par la macro `CNL_ENDPOINT` (transmis à l'UI via `__CFXUI_CNL_ENDPOINT__` dans [webpack.config.js](file:///Users/user/Documents/Code_Perso/fivem/ext/cfx-ui/config/webpack.config.js#L34)).

### 11. CnL Heartbeat (GET)
*   **API URL :** `https://cnl-hb-live.fivem.net`
*   **Fichier source :** [CnlEndpoint.h](file:///Users/user/Documents/Code_Perso/fivem/code/client/shared/CnlEndpoint.h#L17)
*   **Description :** Défini par la macro `CNL_HB_ENDPOINT`.

### 12. Top Server (GET)
*   **API URL :** `https://runtime.fivem.net/pins.json`
*   **Fichier source :** [servers.mpMenu.ts](file:///Users/user/Documents/Code_Perso/fivem/ext/cfx-ui/src/cfx/apps/mpMenu/services/servers/servers.mpMenu.ts#L357)
*   **Description :** Récupère la liste des serveurs épinglés (pins).

### 13. Sentry Login (GET)
*   **API URL :** `https://sentry.fivem.net/auth/login`
*   **Fichier source :** [webpack.prerequisites.js](file:///Users/user/Documents/Code_Perso/fivem/ext/sdk/resources/sdk-root/shell/config/webpack.prerequisites.js#L66)

### 14. Build Change Log (GET)
*   **API URL :** `https://changelogs-live.fivem.net/api/changelog/versions/{buildversion}`
*   **Fichier source :** [game-server-manager-service.ts](file:///Users/user/Documents/Code_Perso/fivem/ext/sdk/resources/sdk-root/shell/src/backend/game-server/game-server-manager-service.ts#L260)

### 15. NUI Blacklist (GET)
*   **API URL :** `https://runtime.fivem.net/nui-blacklist.json`
*   **Fichier source :** [ResourceUI.cpp](file:///Users/user/Documents/Code_Perso/fivem/code/components/nui-resources/src/ResourceUI.cpp#L379)

### 16. Players Count (GET)
*   **Ancien domaine (redirection) :** `https://runtime.fivem.net/counts.json`
*   **Domaine moderne (direct) :** `https://static.cfx.re/runtime/counts.json`
*   **Domaine moderne (RedM) :** `https://static.cfx.re/runtime/counts_rdr3.json`
*   **Fichier source :** [platformStatus.service.ts](file:///Users/user/Documents/Code_Perso/fivem/ext/cfx-ui/src/cfx/apps/mpMenu/services/platformStatus/platformStatus.service.ts#L11-L12)
*   **Description :** Défini via les constantes `PLAYER_STATS_FIVEM` et `PLAYER_STATS_REDM`.

### 17. Tweet (GET)
*   **API URL :** `https://runtime.fivem.net/tweets.json`
*   **Fichier source :** [activity.service.ts](file:///Users/user/Documents/Code_Perso/fivem/ext/cfx-ui/src/cfx/common/services/activity/activity.service.ts#L60)

### 18. Artifact Data (GET)
*   **API URL :** `https://changelogs-live.fivem.net/api/changelog/versions/win32/server`
*   **Fichier source :** [game-server-manager-service.ts](file:///Users/user/Documents/Code_Perso/fivem/ext/sdk/resources/sdk-root/shell/src/backend/game-server/game-server-manager-service.ts#L260)

### 19. Loading Screen (GET)
*   **API URL :** `http://niklasvh.github.io/WebGL-GTA` ou `https://runtime.fivem.net/loadscreen/spotlight-2/WebGL-GTA`
*   **Fichier source :** [index.html](file:///Users/user/Documents/Code_Perso/fivem/ext/ui-build/loadscreen/index.html#L12)
*   **Description :** Fait référence au script de démonstration du chargement spotlight (`https://runtime.fivem.net/loadscreen/spotlight.js?2`).

### 20. Pool Size Limits (GET)
*   **Requête d'origine :** `https://gss.cfx-services.net/v1/pool-size-limits/fivem` et `redm` (qui redirige vers les miroirs de `content.cfx.re`).
*   **Miroir direct FiveM :** `https://content.cfx.re/mirrors/client/pool-size-limits/fivem.json`
*   **Miroir direct RedM :** `https://content.cfx.re/mirrors/client/pool-size-limits/redm.json`
*   **Fichier source :** [PoolSizesState.cpp](file:///Users/user/Documents/Code_Perso/fivem/code/components/pool-sizes-state/src/PoolSizesState.cpp#L181-L183)

### 21. Native Data (GET)
*   **Natives FiveM :** `https://static.cfx.re/natives/natives.lua`
*   **Natives RedM :** `https://static.cfx.re/natives/natives_rdr3.lua`
*   **Fichier source :** [prebuild_natives.cmd](file:///Users/user/Documents/Code_Perso/fivem/prebuild_natives.cmd#L26-L27) (ou [build_server_proot_alpine.sh](file:///Users/user/Documents/Code_Perso/fivem/code/tools/ci/build_server_proot_alpine.sh#L17) pour le serveur).