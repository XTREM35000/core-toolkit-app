import { useState } from 'react';
import { BaseModal } from './BaseModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

interface SuperAdminCreationModalProps {
  onSuccess: () => void;
}

export const SuperAdminCreationModal = ({ onSuccess }: SuperAdminCreationModalProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 8 caractères",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: formData.fullName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Update profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            permissions: ['*'],
            full_name: formData.fullName,
            is_active: true,
          })
          .eq('id', data.user.id);

        if (profileError) throw profileError;

        // Ask the DB to perform the privileged assignment of the super_admin role
        const { error: rpcError } = await (supabase as any).rpc('assign_initial_super_admin', { user_uuid: data.user.id });
        if (rpcError) throw rpcError;

        toast({
          title: "Succès",
          description: "Super Admin créé avec succès",
        });

        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal open={true} onClose={() => {}} showClose={false}>
      <div className="space-y-6 p-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold">Créer le Super Admin</h2>
          <p className="text-sm text-muted-foreground">
            Cette personne aura tous les droits d'administration
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nom complet</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              placeholder="Jean Dupont"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="admin@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="Min. 8 caractères"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              placeholder="Confirmer le mot de passe"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full gradient-primary text-primary-foreground font-semibold"
            disabled={loading}
          >
            {loading ? 'Création...' : 'Créer le Super Admin'}
          </Button>
        </form>
      </div>
    </BaseModal>
  );
};
