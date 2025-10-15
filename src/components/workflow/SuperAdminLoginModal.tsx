import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle,
  Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DraggableModalWrapper } from '@/components/ui/draggable-modal-wrapper';

interface SuperAdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SuperAdminLoginModal = ({ isOpen, onClose, onSuccess }: SuperAdminLoginModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Gestion du drag vertical
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (event: any, info: any) => {
    if (Math.abs(info.offset.x) > 50) {
      return;
    }
    const maxDragY = 200;
    const clampedY = Math.max(-maxDragY, Math.min(maxDragY, info.offset.y));
    setDragY(clampedY);
  };

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);

    if (Math.abs(info.offset.x) > 100) {
      setDragY(0);
      return;
    }

    if (info.offset.y > 200 && info.velocity.y > 500) {
      onClose();
    } else {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.email.trim()) {
        setError('L\'email est requis');
        return;
      }

      if (!formData.password.trim()) {
        setError('Le mot de passe est requis');
        return;
      }

      // Connexion
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password
      });

      if (authError) throw authError;

      if (authData.user) {
        // Vérifier que l'utilisateur est bien un super admin
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        if (profileError) throw profileError;

        if (profileData.role !== 'super_admin') {
          setError('Accès refusé : vous n\'êtes pas un super administrateur');
          return;
        }

        // Succès
        onSuccess?.();
      }
    } catch (error: any) {
      console.error('Erreur connexion super admin:', error);
      setError(error.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DraggableModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      allowCloseOnOutsideClick={false}
      allowDragToClose={true}
      dragConstraints={{ top: -200, bottom: 300 }}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onWheel={(e) => {
        e.stopPropagation();
        const nextY = dragY - Math.sign(e.deltaY) * 20;
        const clamped = Math.max(-200, Math.min(300, nextY));
        setDragY(clamped);
      }}
      style={{
        transform: `translateY(${dragY}px)`
      }}
    >
      {/* Handle de drag */}
      <div className="flex justify-center pt-3 pb-2 bg-white">
        <div className="w-12 h-1.5 rounded-full bg-[#128C7E]/30" />
      </div>

      {/* Header avec charte graphique WhatsApp */}
      <div className="bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white">
        {/* Indicateur Super Admin */}
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold z-10">
          <Crown className="w-4 h-4" />
          Super Admin
        </div>

        <div className="p-4 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-1 text-white">
            Connexion Super Admin
          </h2>
          <p className="text-xs opacity-90 text-white/90">
            Accès au dashboard administrateur
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="animate-shake">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Informations de connexion */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-[#128C7E]" />
                <h3 className="text-sm font-semibold">Identifiants Super Admin</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1 text-xs">
                  <Mail className="h-3 w-3" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-8 text-sm transition-all duration-200 focus:ring-2 focus:ring-[#128C7E]"
                  placeholder="superadmin@automaster.ci"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-1 text-xs">
                  <Lock className="h-3 w-3" />
                  Mot de passe *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="h-8 text-sm pr-8 transition-all duration-200 focus:ring-2 focus:ring-[#128C7E]"
                    placeholder="••••••••"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-8 px-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions compactes */}
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
                    Connexion...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3 mr-1" />
                    Se connecter
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DraggableModalWrapper>
  );
};
