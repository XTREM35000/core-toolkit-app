import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';

const Help = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        <ModalHeader
          title="Aide & Documentation"
          subtitle="Guide rapide pour démarrer"
          headerGradient="from-purple-500 to-purple-600"
          headerLogo={<AnimatedLogo size={40} mainColor="text-white" secondaryColor="text-purple-300" />}
          onClose={() => {}}
        />

        <div className="mt-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-3">Mission du projet</h2>
            <p className="mb-4">Ce projet aide les éleveurs à gérer leurs bassins, cohortes et stocks. Il vise une interface simple, utilisable sur mobile et ordinateur.</p>

            <h3 className="text-md font-medium mb-2">Fonctionnalités clés</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Créer et gérer des bassins</li>
              <li>Suivre des cohortes (poissons/escargots)</li>
              <li>Gérer les stocks d'aliments</li>
              <li>Ajouter des collaborateurs et gérer les profils</li>
            </ul>

            <h3 className="text-md font-medium mb-2">Guide rapide</h3>
            <ol className="list-decimal pl-5 mb-4">
              <li>Aller dans le menu correspondant (Bassins, Cohortes, Stock)</li>
              <li>Cliquer sur « Créer » pour ouvrir le formulaire</li>
              <li>Remplir les champs et valider</li>
            </ol>

            <h3 className="text-md font-medium mb-2">Qui contacter ?</h3>
            <p>Si vous rencontrez un problème : parlez-en d'abord à l'administrateur de votre structure. Pour les bugs techniques, remontez l'information à l'équipe en charge.</p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Help;
