import { useState, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Users,
  X,
  Mail,
  UserPlus,
  Trash2,
  Sparkles,
  ArrowRight,
  CheckCircle,
  User,
  Shield,
  Wrench,
  ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormModal } from '@/components/ui/FormModal';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface TeamMember {
  id: string;
  email: string;
  role: string;
  name: string;
}

export const TeamModal = ({ isOpen, onClose, onSuccess }: TeamModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMember, setNewMember] = useState({
    email: '',
    role: 'technician',
    name: ''
  });

  const roles = [
    { value: 'garage_manager', label: 'Gestionnaire', color: 'blue', icon: Shield },
    { value: 'technician', label: 'Technicien', color: 'green', icon: Wrench },
    { value: 'mechanic', label: 'Mécanicien', color: 'orange', icon: Wrench },
    { value: 'receptionist', label: 'Réceptionniste', color: 'purple', icon: ClipboardList }
  ];

  // Gestion du drag vertical comme dans SuperAdminModal
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (event: any, info: PanInfo) => {
    // Empêcher le drag horizontal excessif
    if (Math.abs(info.offset.x) > 50) {
      return;
    }
    // Augmenter les limites de drag vertical pour compenser les messages d'erreur
    const maxDragY = 300; // Augmenté de 200 à 300
    const clampedY = Math.max(-maxDragY, Math.min(maxDragY, info.offset.y));
    setDragY(clampedY);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);

    // Empêcher la fermeture accidentelle lors du drag horizontal
    if (Math.abs(info.offset.x) > 100) {
      // Reset position sans fermer
      setDragY(0);
      return;
    }

    // Fermer seulement si le drag vertical est suffisant ET vers le bas avec une vitesse importante
    if (info.offset.y > 250 && info.velocity.y > 500) { // Augmenté de 200 à 250
      onClose();
    } else {
      // Reset position avec animation fluide
      setDragY(0);
    }
  };

  // Gestion de la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Ajuster la position du modal quand une erreur apparaît
  useEffect(() => {
    if (error) {
      // Déplacer légèrement le modal vers le haut pour compenser l'erreur
      setDragY(-50);
    } else {
      // Remettre en position normale quand l'erreur disparaît
      setDragY(0);
    }
  }, [error]);

  const addTeamMember = () => {
    if (newMember.email && newMember.name) {
      const member: TeamMember = {
        id: Date.now().toString(),
        ...newMember
      };
      setTeamMembers([...teamMembers, member]);
      setNewMember({ email: '', role: 'technician', name: '' });
    }
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (teamMembers.length === 0) {
        setError('Ajoutez au moins un membre à l\'équipe');
        return;
      }

      // Simuler l'invitation des membres
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStep(2);
    } catch (error: any) {
      console.error('Erreur invitation équipe:', error);
      setError(error.message || 'Une erreur est survenue lors de l\'invitation');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    const roleConfig = roles.find(r => r.value === role);
    return roleConfig ? roleConfig.icon : User;
  };

  const getRoleColor = (role: string) => {
    const roleConfig = roles.find(r => r.value === role);
    return roleConfig ? roleConfig.color : 'gray';
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      draggable
    >
      {/* Handle de drag */}
      <div className="flex justify-center pt-3 pb-2 bg-white">
        <div className="w-12 h-1.5 rounded-full bg-[#128C7E]/30" />
      </div>

      {/* Header avec charte graphique WhatsApp */}
      <div className="bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white">
        {/* Indicateur Équipe */}
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-purple-500 text-purple-900 px-3 py-1 rounded-full text-xs font-semibold z-10">
          <Users className="w-4 h-4" />
          Équipe
        </div>

        <div className="p-4 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-1 text-white">
            Invitation d'Équipe
          </h2>
          <p className="text-xs opacity-90 text-white/90">
            Invitez vos collaborateurs
          </p>
        </div>

        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-white/80 hover:text-white hover:bg-white/20 focus:ring-white/50"
          aria-label="Fermer la modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Contenu compact */}
      <div className="bg-gradient-to-b from-white to-gray-50 dark:from-[hsl(var(--card))] dark:to-[hsl(var(--card))]">
        <div className="p-4">
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="animate-shake">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Ajout de membre compact */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <UserPlus className="h-4 w-4 text-[#128C7E]" />
                  <h3 className="text-sm font-semibold">Ajouter un membre</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="memberName" className="text-xs">Nom complet *</Label>
                    <Input
                      id="memberName"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      className="h-8 text-sm transition-all duration-200 focus:ring-2 focus:ring-[#128C7E]"
                      placeholder="Ex: Jean Dupont"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="memberEmail" className="text-xs">Email *</Label>
                    <Input
                      id="memberEmail"
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      className="h-8 text-sm transition-all duration-200 focus:ring-2 focus:ring-[#128C7E]"
                      placeholder="jean@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="memberRole" className="text-xs">Rôle</Label>
                  <select
                    id="memberRole"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    className="w-full h-8 px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  type="button"
                  onClick={addTeamMember}
                  disabled={!newMember.name || !newMember.email}
                  size="sm"
                  className="w-full bg-[#128C7E] hover:bg-[#0F7B6B] text-white"
                >
                  <UserPlus className="h-3 w-3 mr-1" />
                  Ajouter à l'équipe
                </Button>
              </div>

              {/* Liste des membres compacte */}
              {teamMembers.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-[#128C7E]" />
                    <h3 className="text-sm font-semibold">Membres de l'équipe ({teamMembers.length})</h3>
                  </div>

                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {teamMembers.map((member) => {
                      const Icon = getRoleIcon(member.role);
                      const color = getRoleColor(member.role);
                      return (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-2">
                            <Icon className={`h-4 w-4 text-${color}-600`} />
                            <div>
                              <p className="text-sm font-medium">{member.name}</p>
                              <p className="text-xs text-gray-500">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Badge variant="outline" className="text-xs">
                              {roles.find(r => r.value === member.role)?.label}
                            </Badge>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTeamMember(member.id)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions compactes */}
              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={onClose}>
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading || teamMembers.length === 0}
                  size="sm"
                  className="bg-gradient-to-r from-[#128C7E] to-[#075E54] hover:from-[#0F7B6B] hover:to-[#064A42] text-white"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1" />
                      Invitation...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3 mr-1" />
                      Inviter l'équipe
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-[#128C7E] to-[#075E54] rounded-full flex items-center justify-center mx-auto animate-pulse">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#128C7E]">Équipe invitée avec succès !</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {teamMembers.length} membre(s) ont été invité(s).
                </p>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    onSuccess?.();
                    onClose();
                  }}
                  size="sm"
                  className="bg-gradient-to-r from-[#128C7E] to-[#075E54] hover:from-[#0F7B6B] hover:to-[#064A42] text-white"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Continuer
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </FormModal>);
};