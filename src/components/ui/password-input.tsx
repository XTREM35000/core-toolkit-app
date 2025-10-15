import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Key } from 'lucide-react';

interface PasswordInputProps {
  value: string;
  onChange: (password: string) => void;
  label?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
  showStrength?: boolean;
}

const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z\d]/.test(password)) strength++;
  return strength;
};

const getPasswordStrengthColor = (strength: number) => {
  if (strength <= 2) return 'bg-red-500';
  if (strength <= 3) return 'bg-yellow-500';
  return 'bg-green-500';
};

const getPasswordStrengthText = (strength: number) => {
  if (strength <= 2) return 'Faible';
  if (strength <= 3) return 'Moyen';
  return 'Fort';
};

export const PasswordInput = ({
  value,
  onChange,
  label = "Mot de passe",
  required = false,
  className = "",
  placeholder = "••••••••",
  showStrength = true
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const passwordStrength = calculatePasswordStrength(value);

  return (
    <div className={`space-y-1 ${className}`}>
      <Label className="flex items-center gap-1 text-xs">
        <Lock className="h-3 w-3" />
        {label} {required && '*'}
      </Label>

      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="h-7 text-xs pr-8 transition-all duration-200 focus:ring-2 focus:ring-[#128C7E]"
          placeholder={placeholder}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-7 px-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
        </Button>
      </div>

      {/* Barre de force du mot de passe */}
      {showStrength && value && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Force</span>
            <span className={`font-medium ${passwordStrength <= 2 ? 'text-red-500' :
                passwordStrength <= 3 ? 'text-yellow-500' : 'text-green-500'
              }`}>
              {getPasswordStrengthText(passwordStrength)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
              style={{ width: `${(passwordStrength / 5) * 100}%` }}
            />
          </div>
          {passwordStrength < 3 && (
            <div className="text-xs text-gray-500">
              Majuscules, minuscules, chiffres recommandés
            </div>
          )}
        </div>
      )}
    </div>
  );
};
