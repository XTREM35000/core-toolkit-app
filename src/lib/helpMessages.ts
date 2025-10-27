export const helpMessages: Record<string, string> = {
  default: "Besoin d'aide ? Cliquez sur l'icône Aide pour des conseils rapides sur cette page.",
  profile: "Aide — Profil : modifiez vos informations personnelles, mettez à jour votre photo et gérez vos préférences. N'oubliez pas d'enregistrer pour appliquer les changements.",
  bassins: "Aide — Bassins : Créez, éditez ou supprimez un bassin. Pour chaque bassin, vous pouvez assigner des cohortes, définir la capacité et consulter l'historique des mesures. Utilisez les filtres pour repérer les bassins en alerte.",
  poissons: "Aide — Poissons : Naviguez entre Cohortes, Bassins et Espèces. Dans Cohortes, enregistrez l'âge, le nombre et les traitements. Dans Bassins, surveillez la qualité de l'eau et les transferts entre unités.",
  'cohortes-poissons': "Aide — Cohortes (poissons) : Suivez la croissance par lot, saisissez les mesures (poids moyen, mortalité), planifiez les transferts et consignez les traitements vétérinaires. Utilisez la vue historique pour comparer les performances.",
  heliciculture: "Aide — Héliciculture : Gérez parcs, escargotières et cohortes. Pour chaque parc, créez des escargotières, assignez des cohortes, et enregistrez interventions et inspections pour assurer le suivi sanitaire.",
  'cohortes-escargots': "Aide — Cohortes (héliciculture) : Saisissez les dates d'entrée, les effectifs, la composition et les interventions (alimentation, traitements). Utilisez les notes pour tracer les événements importants.",
  pontes: "Aide — Pontes : Enregistrez les pontes par escargotière, notez le nombre d'œufs, la qualité et l'état (fécondation). Programmez des interventions (gestion humidité/température) et suivez l'éclosion.",
  journal: "Aide — Journal : Carnet d'activités. Consignez interventions, observations et incidents (maladies, mortalités). Filtrez par date ou par parc pour retrouver rapidement les notes historiques.",
  ventes: "Aide — Ventes : Créez une nouvelle vente en sélectionnant le client, les produits et les quantités. Enregistrez l'encaissement ou générez un reçu. Utilisez la liste pour suivre les statuts (en attente, payé, annulé).",
  stock: "Aide — Stock : Consultez les niveaux de stock, les mouvements entrants/sortants et les seuils de réapprovisionnement. Exportez un état pour l'inventaire périodique.",
  'stock-aliments': "Aide — Stock Aliments : Suivez les lots d'aliments, dates de péremption et consommations par parc/cohorte. Enregistrez les réceptions fournisseurs et les consommations journalières.",
  poulaillers: "Aide — Poulaillers : Gérez bâtiments, effectifs, production (ponte) et interventions. Assignez des responsables et planifiez les opérations de maintenance ou de nettoyage.",
  clapiers: "Aide — Clapiers : Suivez la répartition des clapiers, les effectifs et les mouvements entre clapiers. Enregistrez les traitements et interventions vétérinaires par clapier.",
  cuniculture: "Aide — Cuniculture : Gestion complète des clapiers et des cohortes de lapins : reproduction, sevrage, mouvements et interventions sanitaires.",
  peche: "Aide — Pêche : Gérez les zones de pêche, les captures et les quotas par période. Enregistrez les relevés, les remorques et les sorties pêche pour la traçabilité.",
  zonespeche: "Aide — Zones de pêche : Créez et paramétrez vos zones (géorepérage), assignez licences et consultez l'historique des captures pour chaque zone.",
  ruchers: "Aide — Ruchers : Suivez vos ruchers, planifiez inspections, enregistrez récoltes et interventions (traitements, nourrissements). Documentez chaque ruche pour l'historique sanitaire.",
  troupeaux: "Aide — Troupeaux : Gérez troupeaux bovins, suivez mouvements, traitements, reproductions et documents sanitaires. Utilisez les filtres pour repérer les animaux par statut.",
  fournisseurs: "Aide — Fournisseurs : Créez et suivez les commandes fournisseurs, enregistrez les réceptions et gérez les paiements. Ajoutez des notes et des pièces jointes aux commandes.",
  analytics: "Aide — Analytics : Consultez les indicateurs clés (performances production, mortalité, ventes) et adaptez la période pour analyser les tendances. Utilisez les filtres pour segmenter par ferme, parc ou espèce.",
  'admin/config': "Aide — Configuration : Paramétrez les options globales, les rôles et permissions, l'intégration des services (Supabase, PWA) et les préférences d'affichage. Sauvegardez avant de quitter.",
  // Additional keys for pages that lacked specific messages
  'mesures-heliciculture': "Aide — Mesures (héliciculture) : saisissez les mesures sanitaires et de croissance par cohorte, comparez les historiques et exportez si besoin.",
  'parcs-helicicoles': "Aide — Parcs hélicicoles : créez et gérez vos parcs, assignez des escargotières et planifiez les inspections.",
  activities: "Aide — Activités : consultez les actions récentes, notifications et tâches à traiter.",
  alerts: "Aide — Alertes : gérez les notifications critiques et suivez les incidents requérant une action.",
  clients: "Aide — Clients : gérez la liste clients, consultez l'historique d'achats et contactez les clients si nécessaire.",
  collaborators: "Aide — Collaborateurs : invitez des membres, attribuez des rôles et gérez leurs accès.",
  commandes: "Aide — Commandes : créez des commandes fournisseurs, suivez les réceptions et gérez les statuts.",
  encaissements: "Aide — Encaissements : enregistrez les paiements, suivez les transactions et réconciliez la trésorerie.",
  reports: "Aide — Rapports : générez et exportez des rapports sur les ventes, stocks et performances.",
  settings: "Aide — Paramètres : ajustez les configurations générales de l'application et les préférences utilisateur.",
  security: "Aide — Sécurité : gérez les règles d'accès, authentification et permissions.",
  parks: "Aide — Parcs : créez et gérez des parcs (terres, bassins) et leurs attributs.",
  ponds: "Aide — Bassins/Étangs : gérez vos bassins, suivez la qualité de l'eau et les cohortes associées.",
  snailcohorts: "Aide — Cohortes d'escargots : suivez les lots, saisissez interventions et mouvements.",
  fishcohorts: "Aide — Cohortes de poissons : suivez la croissance, la mortalité et les traitements par lot.",
  employees: "Aide — Employés : gérez les utilisateurs internes, rôles, et accès au système.",
};

export function getHelpForPath(path?: string): string {
  if (!path) return helpMessages.default;
  const p = path.toLowerCase();
  if (p.startsWith('/profile')) return helpMessages.profile;
  if (p.includes('bassins') || p.includes('bassin')) return helpMessages.bassins;
  if (p.includes('/poissons') || p.includes('poissons') || p.includes('especes')) return helpMessages.poissons;
  if (p.includes('cohortes') && p.includes('poisson')) return helpMessages['cohortes-poissons'];
  if (p.includes('cohortes') && p.includes('escargot')) return helpMessages['cohortes-escargots'];
  if (p.includes('ponte') || p.includes('pontes')) return helpMessages.pontes;
  if (p.includes('journal') || p.includes('carnet') || p.includes('journal-escargot')) return helpMessages.journal;
  if (p.includes('heliciculture') || p.includes('escargoti')) return helpMessages.heliciculture;
  if (p.includes('ventes')) return helpMessages.ventes;
  if (p.includes('stock-aliments') || p.includes('aliments')) return helpMessages['stock-aliments'];
  if (p.includes('stock')) return helpMessages.stock;
  if (p.includes('poulaill') || p.includes('poulaillers')) return helpMessages.poulaillers;
  if (p.includes('clapier') || p.includes('clapiers')) return helpMessages.clapiers;
  if (p.includes('cuniculture')) return helpMessages.cuniculture;
  if (p.includes('peche')) return helpMessages.peche;
  if (p.includes('zonespeche') || p.includes('zones-peche') || p.includes('zones')) return helpMessages.zonespeche;
  if (p.includes('rucher') || p.includes('ruchers')) return helpMessages.ruchers;
  if (p.includes('troupeau') || p.includes('troupeaux')) return helpMessages.troupeaux;
  if (p.includes('fournisseur') || p.includes('fournisseurs')) return helpMessages.fournisseurs;
  if (p.includes('analytics')) return helpMessages.analytics;
  if (p.includes('admin') && p.includes('config')) return helpMessages['admin/config'];
  return helpMessages.default;
}

export default helpMessages;
