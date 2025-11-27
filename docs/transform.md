# UI Transform - Applied Styles and Components

Ce document liste les composants modèles réutilisés, les éléments UI unifiés, les pages modifiées, et fournit un template de prompt réutilisable.

## Composants modèles utilisés
- `ModalHeader` (src/components/workflow/shared/ModalHeader)
  - En-tête utilisé pour toutes les pages et modals refactorés. Contient titre, sous-titre et logo animé.
- `AnimatedLogo` (src/components/AnimatedLogo)
  - Logo placé dans le header des pages/modals pour garder l'identité visuelle.
- `Card` (src/components/ui/card)
  - Conteneur central des formulaires et tableaux ; utilisé avec `className="p-4 border-0 shadow-lg"`.
- `WhatsAppModal` (src/components/ui/whatsapp-modal)
  - Composant modal utilisé comme conteneur principal pour les modals.
- `AvatarUpload`, `EmailInput`, `PhoneInput`, `Input` (src/components/ui)
  - Composants UI réutilisables pour champs et upload.

## Éléments UI unifiés
- Layout conteneur
  - Toutes les pages utilisent désormais un wrapper central similaire à `JournalEscargots.tsx` :
    - `div.max-w-4xl.mx-auto.py-6` puis `div.bg-gradient-to-r ... rounded-2xl overflow-hidden shadow-lg`
    - Header + zone blanche intérieure (`p-6 bg-white`) où les `Card` sont placées.
- Header
  - `ModalHeader` + `AnimatedLogo` en en-tête pour cohérence visuelle.
  - Couleurs de gradient adaptées par page (ex: emerald, sky, yellow, rose) pour différencier les contextes.
- Cards
  - `Card` utilisé avec `p-4 border-0 shadow-lg` pour un rendu uniforme (arrondis + ombre douce).
- Tables
  - Tables modernisées : `divide-y divide-gray-100`, header `bg-gray-50`, cellules `p-3`, hover `hover:bg-gray-50`.
  - Actions alignées à droite et boutons d'action textuels colorés.
- Inputs & Forms
  - Inputs stylés avec `border border-gray-300 rounded-lg px-3 py-2 focus:ring-2` et `focus:border-transparent`.
  - Form grids `grid grid-cols-1 md:grid-cols-2 gap-3` pour alignement responsive.
- Buttons
  - Primary actions: gradient backgrounds (ex: `from-emerald-500 to-emerald-600`) + `text-white shadow-lg`.
  - Secondary / cancel: `variant="ghost"` with `border border-gray-300 hover:bg-gray-50`.
  - Delete actions (if present) use red text and subtle red background on hover.
- Modals
  - Structure : `WhatsAppModal` → outer `div.bg-white.rounded-t-3xl.shadow-2xl` → `ModalHeader` → `div.p-6 > Card.p-4`.
  - Standard buttons: `Supprimer | Annuler | Sauvegarder` when relevant.

## Pages modifiées
- `src/pages/ListeVentesPage.tsx`
- `src/pages/ListeClientsPage.tsx`
- `src/pages/ListeCommandesPage.tsx`
- `src/pages/ListeFournisseursPage.tsx`

Notes:
- La logique Supabase, les clés `react-query`, et le routage n'ont pas été modifiés.
- Les noms de tables et colonnes sont inchangés.

## Modals vérifiés / améliorés
- `src/components/workflow/VenteClientModal.tsx` (UI refaite selon Cohorte template)
- `src/components/workflow/CommandeFournisseurModal.tsx` (UI refaite selon Cohorte template)
- `src/components/workflow/CreateProfileModal.tsx` (ajout d'AvatarUpload et harmonisation UI)

Si des modals supplémentaires pour `VenteModal.tsx`, `ClientModal.tsx`, `CommandeModal.tsx`, `FournisseurModal.tsx` sont attendus dans d'autres répertoires, ils peuvent être créés à partir du même template (voir ci-dessous).

## Template de prompt réutilisable
```
Applique le style UI suivant (tailwind + shadcn/ui) sur le composant/page X :
- Wrapper: `max-w-4xl mx-auto py-6` + `bg-gradient-to-r ... rounded-2xl overflow-hidden shadow-lg`
- Header: `ModalHeader` + `AnimatedLogo` (size 36-40)
- Content: `div.p-6 bg-white` contenant `Card` avec `p-4 border-0 shadow-lg`
- Form: grid responsive `grid grid-cols-1 md:grid-cols-2 gap-3` + inputs `border border-gray-300 rounded-lg px-3 py-2 focus:ring-2`.
- Buttons: primary -> gradient + `text-white shadow-lg`; cancel -> `ghost` + `border border-gray-300`
- Tables: `divide-y divide-gray-100`, header `bg-gray-50`, cells `p-3`, `hover:bg-gray-50`.
Contraintes : ne pas changer la logique métier, ne pas renommer tables/colonnes, conserver react-query keys et le routage.
```

## Vérifications effectuées
- Conservé les appels à `supabase` et les `queryKey` existants.
- Respect des imports existants et des modals déjà utilisés par les pages.

## Prochaines étapes (optionnel)
- Harmoniser d'autres modals si besoin (ex: modals de la feature `workflow` non listés ici).
- Ajouter tests UI/storybook pour valider l'apparence en light/dark mode.
