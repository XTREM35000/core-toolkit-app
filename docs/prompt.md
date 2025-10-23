# 🧠 CONTEXTE GÉNÉRAL
Langue : **Français uniquement**  
Projet : **Plateforme SaaS modulaire pour gestion d’élevages agricoles et piscicoles**  
Objectif : Étendre la structure existante (Pisciculture + Héliciculture) pour inclure **8 modules complets** avec la même architecture, les mêmes composants UI et le même design system.

---

## 🎯 MISSION À RÉALISER
Implémenter une **architecture modulaire uniforme** couvrant :

1. 🐌 **Héliciculture (escargots)** — déjà existant  
2. 🐟 **Pisciculture (poissons)** — déjà existant  
3. 🐔 **Aviculture (poulets)** — à créer  
4. 🌾 **Agriculture (cultures)** — à créer  
5. 🐇 **Cuniculture (lapins)** — à créer  
6. 🐝 **Apiculture (abeilles)** — à créer  
7. 🐄 **Bovins (bétail)** — à créer  
8. 🎣 **Pêche (pisciculture extensive)** — à créer  

---

## 🧩 STRUCTURE TECHNIQUE ATTENDUE

### 📁 Pages à créer
Chaque module aura une page principale et ses sous-pages :

📁 pages/
📄 Aviculture.tsx
📄 Poulaillers.tsx
📄 CohortesPoulets.tsx
📄 Agriculture.tsx
📄 Parcelles.tsx
📄 Cultures.tsx
📄 Cuniculture.tsx
📄 Clapiers.tsx
📄 CohortesLapins.tsx
📄 Apiculture.tsx
📄 Ruchers.tsx
📄 RecoltesMiel.tsx
📄 Bovins.tsx
📄 Etables.tsx
📄 Troupeaux.tsx
📄 Peche.tsx
📄 ZonesPeche.tsx
📄 Captures.tsx

📁 components/
📁 aviculture/
📄 PoulaillerModal.tsx
📄 PoulaillersList.tsx
📄 CohortesPouletsList.tsx
📁 agriculture/
📄 ParcelleModal.tsx
📄 CulturesList.tsx
📄 ParcellesList.tsx
📁 cuniculture/
📄 ClapierModal.tsx
📄 ClapiersList.tsx
📄 CohortesLapinsList.tsx
📁 apiculture/
📄 RucherModal.tsx
📄 ColoniesAbeilles.tsx
📄 RecoltesMielList.tsx
📁 bovins/
📄 EtableModal.tsx
📄 TroupeauxList.tsx
📄 ProductionLaitiere.tsx
📁 peche/
📄 ZonePecheModal.tsx
📄 EnginsPecheList.tsx
📄 CapturesJournal.tsx


---

## 🎨 DESIGN SYSTEM À RESPECTER
| Élément | Référence à copier |
|----------|--------------------|
| **Modal** | `BassinsModal.tsx` |
| **Liste / Table** | `BassinsList.tsx` |
| **Formulaire** | `TankForm.tsx` |
| **Carte / item** | `CohortesPoissonsList.tsx` |
| **Palette couleurs** | Vert WhatsApp `#128C7E` / `#075E54` |
| **Espacements** | 8px / 16px / 24px cohérents |
| **UI Framework** | shadcn/ui + TailwindCSS |

---

## ⚙️ MÉTHODOLOGIE DE DÉVELOPPEMENT

### 🧩 Phase 1 — Squelettes de base
- Créer les pages principales avec Header + HelpButton  
- Créer les composants List/Modal (avec données fictives)  
- Ajouter les routes dans `App.tsx` + Sidebar  

### 🧠 Phase 2 — Données réelles
- Créer les tables Supabase pour chaque entité  
- Créer les hooks CRUD (`usePoulaillers`, `useRuchers`, etc.)  
- Connecter les formulaires à Supabase  

### 🚀 Phase 3 — Fonctions avancées
- Ajouter dashboards + indicateurs par module  
- Générer rapports d’activité  
- Gérer alertes (stocks, mortalité, ponte, récolte, etc.)

---

## 🧾 PRIORITÉS IMMÉDIATES

1. Générer toutes les **pages squelettes** pour les 8 modules  
2. Dupliquer et adapter les **Listes & Modals** depuis la pisciculture  
3. Ajouter routes et navigation dans Sidebar  
4. Préparer les **hooks CRUD Supabase** (structure + typage)

---

## ✅ CHECKLIST PAR MODULE
Pour **chaque module**, vérifier :
- [ ] Page principale (vue globale)  
- [ ] Liste des unités (ex : poulaillers, ruchers, etc.)  
- [ ] Page cohortes ou cycles  
- [ ] Modal création  
- [ ] Route + Sidebar intégrées  
- [ ] Hook CRUD fonctionnel  

---

## 🎯 OBJECTIF FINAL
Obtenir un **MVP complet, visuel et fonctionnel**, avec :
- 8 modules accessibles depuis la sidebar,  
- Pages, formulaires et listes homogènes,  
- Connexion Supabase opérationnelle.  

💡 *But :* Démo SaaS présentable aux investisseurs, prête à héberger les premiers utilisateurs.

---

## 🗣️ MESSAGE À COPILOT
> Crée les fichiers manquants pour les modules ci-dessus en copiant la structure de la **pisciculture**.  
> Utilise **React + TypeScript + Tailwind + Supabase**.  
> Chaque module doit avoir : pages, modals, listes et hooks CRUD.  
> Respecte le design existant et commente clairement le code.
