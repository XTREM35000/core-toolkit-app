import { useState } from 'react';
import { FormModal } from '@/components/ui/FormModal';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Key, Sparkles, X } from 'lucide-react';

interface AdminCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminCreationModal = ({ isOpen, onClose, onSuccess }: AdminCreationModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!formData.name.trim()) {
        setError('Le nom est requis');
        return;
      }
      if (!formData.email.trim()) {
        setError('L\'email est requis');
        return;
      }
      if (!formData.password.trim() || formData.password.length < 8) {
        setError('Mot de passe requis (min. 8 caractères)');
        return;
      }
      // Simuler la création admin
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal isOpen={isOpen} onClose={onClose} draggable className="max-w-md">
      <div className="bg-gradient-to-r from-[#128C7E] to-[#075E54] rounded-t-2xl text-white shadow-2xl">
        <div className="flex flex-col items-center justify-center pt-6 pb-4">
          <AnimatedLogo size={48} mainColor="text-white" secondaryColor="text-green-300" waterDrop className="mb-2" />
          <h2 className="text-xl font-bold mb-1">Création Administrateur</h2>
          <p className="text-xs opacity-90 mb-2">Configurez le compte administrateur principal</p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-white/80 hover:text-white hover:bg-white/20 focus:ring-white/50"
          aria-label="Fermer la modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-4 p-6 bg-white dark:bg-[hsl(var(--card))] rounded-b-2xl">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-xs">Nom complet *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
              className="h-8 text-sm"
              placeholder="Nom de l'administrateur"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-xs">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
              className="h-8 text-sm"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-xs">Mot de passe *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
              className="h-8 text-sm"
              placeholder="••••••••"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              size="sm"
              className="bg-gradient-to-r from-[#128C7E] to-[#075E54] hover:from-[#0F7B6B] hover:to-[#064A42] text-white"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1" />
                  Création...
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3 mr-1" />
                  Créer Admin
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </FormModal>
  );
};
