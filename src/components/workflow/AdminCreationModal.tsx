import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';
import { WhatsAppModal } from '@/components/ui/whatsapp-modal';
import { ModalHeader } from './shared/ModalHeader';
import { FormField } from './shared/FormField';

interface AdminCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminCreationModal = ({ isOpen, onClose, onSuccess }: AdminCreationModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: formData.fullName,
          },
        },
      });

      if (authError) throw authError;

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            permissions: ['manage_users', 'view_analytics'],
            full_name: formData.fullName,
            is_active: true,
          })
          .eq('id', data.user.id);

        if (profileError) throw profileError;

        const { error: roleError } = await supabase
          .from('user_roles' as any)
          .insert([{
            user_id: data.user.id,
            role: 'admin'
          }]) as any;

        if (roleError) throw roleError;

        onSuccess();
      }
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <WhatsAppModal 
      isOpen={isOpen} 
      onClose={onClose}
      size="md"
      className="rounded-2xl"
      hideHeader={true}
    >
      <ModalHeader
        title="Créer un Admin"
        subtitle="Ajouter un administrateur à la plateforme"
        icon={Shield}
        onClose={onClose}
      />

      <div className="p-6 bg-white dark:bg-[hsl(var(--card))] rounded-b-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="rounded-lg">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <FormField
            id="fullName"
            label="Nom complet"
            value={formData.fullName}
            onChange={(fullName) => setFormData({ ...formData, fullName })}
            required
          />

          <FormField
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(email) => setFormData({ ...formData, email })}
            required
          />

          <FormField
            id="password"
            label="Mot de passe"
            type="password"
            value={formData.password}
            onChange={(password) => setFormData({ ...formData, password })}
            required
            placeholder="Min. 8 caractères"
          />

          <FormField
            id="confirmPassword"
            label="Confirmer le mot de passe"
            type="password"
            value={formData.confirmPassword}
            onChange={(confirmPassword) => setFormData({ ...formData, confirmPassword })}
            required
          />

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white font-semibold rounded-lg"
            disabled={loading}
          >
            {loading ? 'Création...' : 'Créer l\'Admin'}
          </Button>
        </form>
      </div>
    </WhatsAppModal>
  );
};
