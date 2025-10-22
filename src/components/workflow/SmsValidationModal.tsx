// components/workflow/SMSValidationModal.tsx - REFACTORED
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Smartphone,
  X,
  Key,
  CheckCircle,
  Clock,
  RefreshCw,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormModal } from '@/components/ui/FormModal';
import { whatsappService } from '@/services/whatsappService';

interface SMSValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  phoneNumber?: string;
  userId?: string;
  tenantAdminData?: any;
}

export const SMSValidationModal = ({
  isOpen, onClose, onSuccess, phoneNumber, userId, tenantAdminData
}: SMSValidationModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [code, setCode] = useState('');
  const [email, setEmail] = useState(tenantAdminData?.email || '');
  const [localSimMode, setLocalSimMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [canResend, setCanResend] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Gestion du drag vertical
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (event: any, info: any) => {
    if (Math.abs(info.offset.x) > 50) return;
    const maxDragY = 300;
    const clampedY = Math.max(-maxDragY, Math.min(maxDragY, info.offset.y));
    setDragY(clampedY);
  };

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    if (Math.abs(info.offset.x) > 100) {
      setDragY(0);
      return;
    }
    // Keep the final dragged position within allowed bounds
    const maxDragY = 300;
    const clampedY = Math.max(-maxDragY, Math.min(maxDragY, info.offset.y));
    setDragY(clampedY);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Validation du code OTP
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // If tenantAdminData or localSimMode is enabled, we are in simulation/test mode.
      if (tenantAdminData || localSimMode) {
        // Accept any 6-digit numeric code as valid in simulation.
        if (/^\d{6}$/.test(code)) {
          setSuccess(true);
          setTimeout(() => onSuccess?.(), 800);
        } else {
          setError('Code OTP invalide (simulation)');
        }
      } else {
        const result = await whatsappService.verifyOTP(userId!, code, email);
        if (result.success) {
          setSuccess(true);
          setTimeout(() => {
            onSuccess?.();
          }, 1500);
        } else {
          setError(result.error || 'Code OTP invalide');
        }
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      setError(error.message || 'Erreur lors de la vérification');
    } finally {
      setLoading(false);
    }
  };

  // Renvoyer le code OTP
  const handleResendCode = async () => {
    setLoading(true);
    setError(null);

    try {
      // In simulation mode, just reset timer and prefill the test code
      if (tenantAdminData || localSimMode) {
        setTimeLeft(900);
        setCanResend(false);
        setCode('123456');
        setError(null);
      } else {
        const result = await whatsappService.sendOTP(
          userId!,
          phoneNumber!,
          'free'
        );

        if (result.success) {
          setTimeLeft(900); // Reset timer
          setCanResend(false);
          setCode(''); // Clear current code
          setError(null);
        } else {
          setError(result.error || 'Échec renvoi du code');
        }
      }
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      setError(error.message || 'Erreur lors du renvoi');
    } finally {
      setLoading(false);
    }
  };

  // Formatage du numéro de téléphone
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    return phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '+$1 $2 $3 $4 $5');
  };

  useEffect(() => {
    // If tenantAdminData exists, put modal into simulation mode: prefill email and OTP
    if (isOpen && tenantAdminData) {
      setEmail(tenantAdminData.email || '');
      // Pre-fill a test OTP for quicker simulation
      setCode('123456');
      setLocalSimMode(false);
      return;
    }

    // No tenantAdminData: check localStorage for a last created admin email to enable local simulation
    try {
      const last = localStorage.getItem('last_admin_email');
      if (isOpen && last) {
        setEmail(last);
        setCode('123456');
        setLocalSimMode(true);
      } else {
        setLocalSimMode(false);
      }
    } catch (e) {
      setLocalSimMode(false);
    }
  }, [isOpen, tenantAdminData]);

  if (!isOpen) return null;

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      draggable
      className="max-w-md"
      aria-label="Validation SMS WhatsApp"
    >
      <div className="bg-white dark:bg-[hsl(var(--card))] rounded-t-3xl shadow-2xl w-full mx-auto overflow-hidden">
        {/* Header custom WhatsApp */}
        <div className="bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white relative">
          <div className="absolute top-3 right-3 flex items-center gap-2 bg-green-500 text-green-900 px-3 py-1 rounded-full text-xs font-semibold z-10">
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </div>
          <div className="p-4 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-1 text-white">Validation SMS</h2>
            <p className="text-xs opacity-90 text-white/90">Code envoyé au {formatPhoneNumber(phoneNumber || '')}</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-white/80 hover:text-white hover:bg-white/20 focus:ring-white/50"
            aria-label="Fermer la modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Contenu */}
        <div className="bg-gradient-to-b from-white to-gray-50 dark:from-[hsl(var(--card))] dark:to-[hsl(var(--card))]">
          <div className="p-4">
            {success && (
              <Alert className="mb-4 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Code validé avec succès ! Redirection vers l'organisation...
                </AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                <AlertDescription className="text-red-800 dark:text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            {timeLeft > 0 && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg">
          <div className="flex items-center justify-center text-sm text-emerald-800 dark:text-emerald-200">
                  <Clock className="w-4 h-4 mr-2" />
                  Code valide pendant {formatTime(timeLeft)}
                </div>
              </div>
            )}
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Admin *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  disabled={loading || !!tenantAdminData}
                  className="mt-1"
                />
                {tenantAdminData && (
                  <p className="text-xs text-amber-700 mt-1">Mode simulation activé — email et OTP pré-remplis pour test</p>
                )}
              </div>
              <div>
                <Label htmlFor="code" className="text-sm font-medium text-gray-700 dark:text-gray-300">Code OTP *</Label>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  required
                  disabled={loading && !tenantAdminData}
                  className="mt-1 text-center text-lg tracking-widest"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Saisissez le code à 6 chiffres reçu sur WhatsApp</p>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={loading}>Annuler</Button>
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white" disabled={loading || !code.trim() || !email.trim()}>
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Vérification...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Key className="w-4 h-4 mr-2" />
                      Valider
                    </div>
                  )}
                </Button>
              </div>
            </form>
            {canResend && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button type="button" variant="outline" onClick={handleResendCode} disabled={loading} className="w-full">
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2" />
                      Renvoi...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Renvoyer le code
                    </div>
                  )}
                </Button>
              </div>
            )}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center"><MessageCircle className="w-3 h-3 mr-1" />WhatsApp</div>
                <div className="flex items-center"><Clock className="w-3 h-3 mr-1" />15 min</div>
                <div className="flex items-center"><Key className="w-3 h-3 mr-1" />6 chiffres</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormModal>
  );
};