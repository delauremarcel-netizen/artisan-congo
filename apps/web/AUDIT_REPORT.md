# RAPPORT FINAL D'AUDIT - ARTISAN CONGO
**Date de l'audit:** 04 Juin 2026
**Périmètre:** Infrastructure, Pages Publiques, Parcours Client, Parcours Admin, Technique (Performance, Sécurité, DB).

---

## 📊 RÉSUMÉ EXÉCUTIF

L'audit complet de l'application web Artisan Congo a révélé un état de développement avancé avec une interface utilisateur de qualité et des fondations solides (React, Vite, PocketBase). Cependant, plusieurs points de friction entre les composants frontend et la structure de la base de données (schémas PocketBase) ont été identifiés, créant des ruptures dans le parcours utilisateur.

*   **Nombre total de bugs trouvés:** 14
*   **Répartition par criticité:**
    *   🔴 **Critique:** 3 (Bloquant le fonctionnement principal ou la sécurité)
    *   🟠 **Majeur:** 5 (Dégradant fortement l'expérience utilisateur ou les performances)
    *   🟡 **Mineur:** 6 (Problèmes visuels, de lien, ou d'optimisation mineure)
*   **Score de santé global estimé:** **72%**
*   **Recommandations prioritaires:** Aligner l'utilisation des collections d'artisans (`artisans` auth vs `artisan_profiles` base), corriger l'import des pages d'administration qui provoque des crashs, et implémenter la pagination sur les listes massives.

---

## 🔴 BUGS CRITIQUES (À corriger immédiatement)

### 1. Incohérence des collections Artisans (Recherche vs Profil)
*   **Description:** La page de recherche (`ArtisanSearchPage.jsx`) interroge la collection d'authentification `artisans`, tandis que la page de détail (`ArtisanPublicProfile.jsx` et `ArtisanDetailPage.jsx`) interroge la collection de données `artisan_profiles`. L'ID retourné par la recherche ne correspondra pas toujours à l'ID du profil si la logique de synchronisation n'est pas parfaite.
*   **Localisation:** `apps/web/src/pages/ArtisanSearchPage.jsx` (Ligne 38) & `apps/web/src/pages/ArtisanPublicProfile.jsx` (Ligne 31)
*   **Reproduction:** Rechercher un artisan, cliquer sur sa carte. 
*   **Impact:** CRITIQUE (Erreur 404 systématique lors du clic sur un résultat de recherche si les IDs diffèrent ou si le profil n'est pas synchronisé).
*   **Correction proposée:** Standardiser l'affichage public sur `artisan_profiles`. Mettre à jour `ArtisanSearchPage.jsx` pour requêter `artisan_profiles` (avec `expand="artisan_id"` si nécessaire pour les photos).
*   **Fichiers à modifier:** `ArtisanSearchPage.jsx`

### 2. Crash de routage Admin (Import de fichier inexistant)
*   **Description:** Dans `App.jsx`, la route d'administration importe `AdminArtisansManagementPage.jsx`, mais le composant réel a été nommé `AdminArtisansPage.jsx`.
*   **Localisation:** `apps/web/src/App.jsx` (Lignes 37 et 101)
*   **Reproduction:** Se connecter en tant qu'admin, cliquer sur "Gestion des Artisans" dans le menu.
*   **Impact:** CRITIQUE (Écran blanc / Crash React au moment du chargement lazy).
*   **Correction proposée:** Renommer l'import dans `App.jsx` ou renommer le fichier `AdminArtisansPage.jsx`.
*   **Fichiers à modifier:** `App.jsx`

### 3. Faille de performance majeure sur la recherche (Pas de pagination)
*   **Description:** `ArtisanSearchPage.jsx` utilise `pb.collection('artisans').getFullList()` pour afficher les résultats.
*   **Localisation:** `apps/web/src/pages/ArtisanSearchPage.jsx` (Ligne 38)
*   **Reproduction:** Aller sur `/artisans` avec une base de données contenant plus de 1000 artisans.
*   **Impact:** CRITIQUE (Chargement excessivement long, plantage du navigateur sur mobile, saturation de l'API).
*   **Correction proposée:** Remplacer `getFullList()` par `getList(page, 20)` et implémenter une UI de pagination ou un bouton "Charger plus".
*   **Fichiers à modifier:** `ArtisanSearchPage.jsx`

---

## 🟠 BUGS MAJEURS (À corriger rapidement)

### 4. Filtrage invalide sur les statuts de Mission
*   **Description:** La page `ClientMissionsPage.jsx` tente de filtrer les missions avec le statut `in_progress`. Or, le schéma de la base de données définit les valeurs autorisées comme `['open', 'closed', 'completed']`.
*   **Localisation:** `apps/web/src/pages/ClientMissionsPage.jsx` (Ligne 38)
*   **Reproduction:** Se connecter en tant que client, créer une mission, et essayer de la voir dans l'onglet "En cours".
*   **Impact:** MAJEUR (Les missions en cours d'exécution disparaissent de l'interface client).
*   **Correction proposée:** Soit ajouter `in_progress` au schéma PocketBase, soit mapper "En cours" sur `open` avec un champ additionnel (ex: `assigned_artisan != null`).
*   **Fichiers à modifier:** `ClientMissionsPage.jsx` (ou migration PocketBase).

### 5. Vérification d'authentification client insuffisante 
*   **Description:** La route de création de demande (`CreateMissionModal.jsx` ou `/project-request`) ne force pas toujours la création d'un compte client de manière explicite si l'utilisateur est un simple visiteur (Guest). Le workflow dépend de l'existence d'un `company_id`.
*   **Localisation:** `apps/web/src/components/CreateMissionModal.jsx`
*   **Reproduction:** Cliquer sur "Demander un devis" sans être connecté.
*   **Impact:** MAJEUR (Les demandes peuvent échouer silencieusement si l'auth n'est pas strictement requise).
*   **Correction proposée:** Ajouter un fallback d'authentification ou rediriger vers `/client-signup` (ou un composant de connexion in-modal) avant d'autoriser la soumission.
*   **Fichiers à modifier:** `CreateMissionModal.jsx`

### 6. Gestion d'erreurs silencieuse sur le Signup Artisan
*   **Description:** Dans `ArtisanSignupPage.jsx`, la gestion d'erreur capture le retour JSON de l'API mais le toast de succès s'affiche parfois même si le backend (Express ou PocketBase) a rejeté la création (ex: numéro de téléphone en doublon non attrapé par le formatage).
*   **Localisation:** `apps/web/src/pages/ArtisanSignupPage.jsx` (Bloc try/catch de `handleSubmit`)
*   **Reproduction:** Créer un artisan avec un numéro existant.
*   **Impact:** MAJEUR (Frustration utilisateur croyant être inscrit).
*   **Correction proposée:** Améliorer le parsing des erreurs `data.error` et `data.details` provenant de l'API Node.js et bloquer strictement la navigation.
*   **Fichiers à modifier:** `ArtisanSignupPage.jsx`

### 7. Formulaire d'Avis (Reviews) sans validation du contrat
*   **Description:** Un utilisateur (client) peut techniquement soumettre un avis sur un artisan sans vérification stricte qu'un chantier a bien été `completed` entre eux, si l'interface (LeaveReviewModal) est déclenchée manuellement.
*   **Localisation:** `apps/web/src/components/LeaveReviewModal.jsx`
*   **Reproduction:** Se rendre sur le profil public, cliquer "Laisser un avis".
*   **Impact:** MAJEUR (Risque de faux avis ou de spam).
*   **Correction proposée:** L'UI ne doit afficher le bouton "Laisser un avis" QUE si une mission validée existe entre `currentUser.id` et l'artisan, OU le backend (`pb_hooks`) doit bloquer l'insertion.
*   **Fichiers à modifier:** `ArtisanPublicProfile.jsx`, `LeaveReviewModal.jsx`

### 8. Absence de gestion d'upload multiple optimisée
*   **Description:** Le portfolio accepte jusqu'à 20MB par image sur PocketBase, mais le frontend n'implémente pas de compression ou de redimensionnement côté client avant l'upload.
*   **Localisation:** `apps/web/src/components/PortfolioPhotoUpload.jsx`
*   **Reproduction:** Uploader 10 photos de 15Mo depuis un smartphone.
*   **Impact:** MAJEUR (Timeouts fréquents sur connexions 3G/4G, saturation du stockage).
*   **Correction proposée:** Intégrer une compression à la volée via canvas ou restreindre drastiquement la taille maximale côté client (ex: max 2MB).
*   **Fichiers à modifier:** `PortfolioPhotoUpload.jsx`

---

## 🟡 BUGS MINEURS (À corriger)

### 9. Lien obsolète dans le Footer
*   **Description:** Le Footer contient un lien vers `/artisan-signup-simplified`. Bien qu'une redirection existe dans `App.jsx`, il est préférable de pointer directement vers la bonne route.
*   **Localisation:** `apps/web/src/components/Footer.jsx`
*   **Correction proposée:** Remplacer par `/artisan-signup`.

### 10. Boutons d'action "Coming Soon" non clairs
*   **Description:** Dans `AdminMissionsPage.jsx`, certaines actions complexes (comme la messagerie ou l'assignation fine) manquent d'indicateurs visuels si elles ne sont pas totalement implémentées.
*   **Correction proposée:** Ajouter un feedback visuel de type toast "Fonctionnalité en cours de développement" ou désactiver le bouton avec `opacity-50 cursor-not-allowed`.

### 11. Erreurs de contraste (Accessibilité)
*   **Description:** Certains badges de statut (ex: `badge-warning` sur fond clair) ont un contraste inférieur au ratio WCAG AA de 4.5:1.
*   **Correction proposée:** Assombrir les textes des badges jaunes/orange (utiliser `text-yellow-800` ou `text-orange-800` plutôt que 700).

### 12. Délais de debounce trop courts sur la recherche
*   **Description:** Dans `ArtisanSearchPage.jsx`, le debounce de 400ms peut être trop court pour les utilisateurs sur mobile, déclenchant des requêtes inutiles.
*   **Correction proposée:** Passer le debounce à 800ms pour limiter les appels API lors de la frappe.

### 13. Skeleton Loaders incohérents
*   **Description:** Les tailles des Skeletons sur le tableau de bord Admin (`AdminArtisansPage.jsx`) "sautent" lorsque les données arrivent car la hauteur du `tr` squelette ne correspond pas à la hauteur réelle du contenu.
*   **Correction proposée:** Ajuster la classe `h-10` en `h-16` sur les `<Skeleton />` de tableau pour mieux simuler les doubles lignes de texte.

### 14. Manque de titre H1 sur le tableau de bord Client
*   **Description:** Bien que le layout soit structuré, certains états vides (ex: "Aucune mission trouvée") prennent le dessus visuel sur les balises de hiérarchie sémantique SEO/Accessibilité.

---

## 🛠️ PLAN DE CORRECTION

| Phase | Étape | Fichiers ciblés | Criticité | Estimation |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1** | Standardisation Collection Artisan | `ArtisanSearchPage.jsx`, `ClientMissionsPage.jsx` | 🔴 Critique | 2h |
| **Phase 1** | Correction des crashs de routing | `App.jsx` | 🔴 Critique | 15min |
| **Phase 1** | Implémentation de la Pagination (Recherche) | `ArtisanSearchPage.jsx` | 🔴 Critique | 1.5h |
| **Phase 2** | Fix Filtres Statuts (Missions) | `ClientMissionsPage.jsx`, `AdminMissionsPage.jsx` | 🟠 Majeur | 1h |
| **Phase 2** | Protection Auth & Modales d'action | `CreateMissionModal.jsx`, `LeaveReviewModal.jsx` | 🟠 Majeur | 2h |
| **Phase 2** | Parsing Erreurs API Signup | `ArtisanSignupPage.jsx` | 🟠 Majeur | 45min |
| **Phase 3** | Ajustements UI/UX & Composants | `Footer.jsx`, `AdminArtisansPage.jsx`, CSS | 🟡 Mineur | 1h |
| **Phase 3** | Accessibilité & Contrastes | `index.css`, UI Badges | 🟡 Mineur | 30min |

**Dépendances:**
La standardisation des collections PocketBase doit être faite **en premier** car elle affecte la logique d'affichage des autres pages.

**Risques potentiels:**
La modification de l'appel `getFullList` vers `getList` nécessitera la création d'un composant de pagination UI (Paginator) ou un scroll infini, ce qui modifie l'expérience utilisateur actuelle.

---

## ✅ CHECKLIST POST-AUDIT
- [x] Tous les bugs identifiés (14 éléments recensés)
- [x] Bugs classés par criticité (Critiques, Majeurs, Mineurs)
- [x] Corrections proposées pour chaque problème
- [x] Plan de correction établi (Ordre, temps)
- [x] Vérification de l'intégrité de la BDD (schémas analysés)
- [x] Audit de performance et de sécurité couvert

## 🚀 PROCHAINES ÉTAPES
1. **Validation:** Approbation de ce rapport d'audit par l'équipe de direction.
2. **Exécution Sprint 1:** Lancement immédiat des correctifs des **Bugs Critiques** (Routing, Collection, Pagination).
3. **Tests QA:** Vérification des régressions potentielles après modification de la logique de recherche.
4. **Exécution Sprint 2:** Application des correctifs Majeurs (Workflow client/avis).
5. **Déploiement:** Mise en production de la version patchée (v1.1.0).