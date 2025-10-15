import * as React from "react";
import { FormModal } from "@/components/ui/FormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DialogModalProps {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DialogModal({ trigger, title, description, children, open, onOpenChange }: DialogModalProps) {
  return (
    <>
      <span onClick={() => onOpenChange?.(true)}>{trigger}</span>
      <FormModal
        isOpen={!!open}
        onClose={() => onOpenChange?.(false)}
        title={title}
        description={description}
        size="md"
      >
        {children}
      </FormModal>
    </>
  );
}

interface InterventionModalProps {
  trigger: React.ReactNode;
}

export function InterventionModal({ trigger }: InterventionModalProps) {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    client: '',
    vehicle: '',
    description: '',
    priority: 'normale',
    estimatedDuration: '',
    assignedTo: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nouvelle intervention:', formData);
    setOpen(false);
    // Reset form
    setFormData({
      client: '',
      vehicle: '',
      description: '',
      priority: 'normale',
      estimatedDuration: '',
      assignedTo: ''
    });
  };

  return (
    <DialogModal
      trigger={<span onClick={() => setOpen(true)}>{trigger}</span>}
      title="Nouveau quelque chose"
      description="Ouvrir un nouveau module"
      open={open}
      onOpenChange={setOpen}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <Select value={formData.client} onValueChange={(value) => setFormData(prev => ({ ...prev, client: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dupont">Dupont Martin</SelectItem>
                <SelectItem value="moreau">Moreau Sophie</SelectItem>
                <SelectItem value="bernard">Bernard Paul</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicle">Véhicule</Label>
            <Select value={formData.vehicle} onValueChange={(value) => setFormData(prev => ({ ...prev, vehicle: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un véhicule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bmw-x5">BMW X5</SelectItem>
                <SelectItem value="renault-clio">Renault Clio</SelectItem>
                <SelectItem value="peugeot-308">Peugeot 308</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description de l'intervention</Label>
          <Textarea
            id="description"
            placeholder="Décrivez les travaux à effectuer..."
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="min-h-[80px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="priority">Priorité</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basse">🟢 Basse</SelectItem>
                <SelectItem value="normale">🟡 Normale</SelectItem>
                <SelectItem value="haute">🔴 Haute</SelectItem>
                <SelectItem value="urgente">⚡ Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="estimatedDuration">Durée estimée (h)</Label>
            <Input
              id="estimatedDuration"
              type="number"
              placeholder="Ex: 2.5"
              value={formData.estimatedDuration}
              onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignedTo">Assigné à</Label>
          <Select value={formData.assignedTo} onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un mécanicien" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jean">Jean Dupuis</SelectItem>
              <SelectItem value="marie">Marie Martin</SelectItem>
              <SelectItem value="pierre">Pierre Durand</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button type="submit" className="bg-gradient-primary text-primary-foreground">
            Créer l'intervention
          </Button>
        </div>
      </form>
    </DialogModal>
  );
}

interface GarageModalProps {
  trigger: React.ReactNode;
}

export function GarageModal({ trigger }: GarageModalProps) {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    manager: '',
    capacity: '',
    services: [] as string[],
    status: 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nouveau garage:', formData);
    setOpen(false);
    // Reset form
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      manager: '',
      capacity: '',
      services: [],
      status: 'active'
    });
  };

  return (
    <DialogModal
      trigger={<span onClick={() => setOpen(true)}>{trigger}</span>}
      title="Nouveau Garage"
      description="Ajouter un nouveau garage à votre réseau"
      open={open}
      onOpenChange={setOpen}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="manager">Responsable</Label>
            <Input
              id="manager"
              placeholder="Ex: Kouassi Yao"
              value={formData.manager}
              onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Nom du garage</Label>
          <Input
            id="name"
            placeholder="Ex: Garage Central Paris"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Adresse complète</Label>
          <Textarea
            id="address"
            placeholder="15 Rue de la République, 75001 Paris"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            className="min-h-[60px]"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="01 23 45 67 89"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="garage@example.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="manager">Responsable</Label>
            <Input
              id="manager"
              placeholder="Nom du responsable"
              value={formData.manager}
              onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacité (véhicules)</Label>
            <Input
              id="capacity"
              type="number"
              placeholder="10"
              value={formData.capacity}
              onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Services proposés</Label>
          <div className="grid grid-cols-2 gap-2">
            {['Réparation', 'Entretien', 'Contrôle technique', 'Climatisation', 'Peinture', 'Carrosserie'].map((service) => (
              <label key={service} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={formData.services.includes(service)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({ ...prev, services: [...prev.services, service] }));
                    } else {
                      setFormData(prev => ({ ...prev, services: prev.services.filter(s => s !== service) }));
                    }
                  }}
                />
                <span className="text-sm">{service}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button type="submit" className="bg-gradient-primary text-primary-foreground">
            Créer le garage
          </Button>
        </div>
      </form>
    </DialogModal>
  );
}